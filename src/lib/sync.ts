'use client';

import { applyMerged, clearPending, getState, setSyncMeta, snapshotForSync, type Store } from './store';

let inflight: Promise<boolean> | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

export function genCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  for (const b of arr) s += alphabet[b % alphabet.length];
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

export function normalizeCode(code: string) {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^(.{4})(.{4})$/, '$1-$2');
}

/** 立即同步：上传快照与待同步日志，接收服务器合并结果 */
export async function syncNow(codeOverride?: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (inflight) return inflight;
  const code = codeOverride ?? getState().sync.code;
  if (!code) return false;
  inflight = (async () => {
    try {
      const state = getState();
      const pending = state.pending;
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code, snapshot: snapshotForSync(), logs: pending }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { ok: boolean; snapshot?: Partial<Store>; error?: string };
      if (!json.ok || !json.snapshot) throw new Error(json.error ?? '同步失败');
      applyMerged(json.snapshot);
      clearPending(pending.map((p) => p.clientId));
      setSyncMeta({ code, lastSyncAt: new Date().toISOString(), lastError: null });
      return true;
    } catch (e) {
      setSyncMeta({ lastError: e instanceof Error ? e.message : '同步失败' });
      return false;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/** 防抖同步：学习中频繁评分时合并请求 */
export function scheduleSync(delay = 4000) {
  if (typeof window === 'undefined' || !getState().sync.code) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => void syncNow(), delay);
}

export function disconnectSync() {
  if (timer) clearTimeout(timer);
  setSyncMeta({ code: null, lastSyncAt: null, lastError: null });
}
