import { db } from '@/db';
import { profiles, reviewLogs } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type CardLike = { due: string; last_review?: string; reps?: number; state?: number; stability?: number; difficulty?: number; lapses?: number };
type DayLog = { n: number; again: number; ms: number; new: number };
interface Snapshot {
  cards?: Record<string, CardLike>;
  logs?: Record<string, DayLog>;
  flags?: string[];
  notes?: Record<string, string>;
  settings?: Record<string, unknown>;
  onboarded?: boolean;
  newToday?: { d: string; n: number };
  updatedAt?: string;
  [k: string]: unknown;
}
interface IncomingLog {
  clientId: string;
  cardId: string;
  grade: number;
  elapsedMs: number;
  state: number;
  stability: number;
  difficulty: number;
  reviewedAt: string;
}

const CODE_RE = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/;

function ts(x?: string) {
  const t = x ? new Date(x).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
}

/** 合并两个快照：每张卡取最近复习的一方；日志按天取较大值；标记并集；笔记取更新方 */
function merge(server: Snapshot, client: Snapshot): Snapshot {
  const cards: Record<string, CardLike> = { ...(server.cards ?? {}) };
  for (const [id, c] of Object.entries(client.cards ?? {})) {
    const s = cards[id];
    if (!s) {
      cards[id] = c;
      continue;
    }
    const sT = ts(s.last_review);
    const cT = ts(c.last_review);
    if (cT > sT || (cT === sT && (c.reps ?? 0) >= (s.reps ?? 0))) cards[id] = c;
  }
  const logs: Record<string, DayLog> = { ...(server.logs ?? {}) };
  for (const [d, l] of Object.entries(client.logs ?? {})) {
    const s = logs[d];
    logs[d] = s ? { n: Math.max(s.n, l.n), again: Math.max(s.again, l.again), ms: Math.max(s.ms, l.ms), new: Math.max(s.new ?? 0, l.new ?? 0) } : l;
  }
  const flags = [...new Set([...(server.flags ?? []), ...(client.flags ?? [])])];
  const clientNewer = ts(client.updatedAt) >= ts(server.updatedAt);
  const notes = clientNewer ? { ...(server.notes ?? {}), ...(client.notes ?? {}) } : { ...(client.notes ?? {}), ...(server.notes ?? {}) };
  const settings = clientNewer ? { ...(server.settings ?? {}), ...(client.settings ?? {}) } : { ...(client.settings ?? {}), ...(server.settings ?? {}) };
  const newToday =
    client.newToday && server.newToday && client.newToday.d === server.newToday.d
      ? { d: client.newToday.d, n: Math.max(client.newToday.n, server.newToday.n) }
      : ts(client.newToday?.d) >= ts(server.newToday?.d)
        ? client.newToday
        : server.newToday;
  return {
    v: 2,
    cards,
    logs,
    flags,
    notes,
    settings,
    newToday,
    onboarded: Boolean(server.onboarded || client.onboarded),
    updatedAt: new Date(Math.max(ts(client.updatedAt), ts(server.updatedAt), Date.now())).toISOString(),
  };
}

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code')?.toUpperCase() ?? '';
  if (!CODE_RE.test(code)) return NextResponse.json({ ok: false, error: '同步码格式不正确' }, { status: 400 });
  const [row] = await db.select().from(profiles).where(eq(profiles.code, code)).limit(1);
  if (!row) return NextResponse.json({ ok: false, error: '未找到该同步码' }, { status: 404 });
  return NextResponse.json({ ok: true, snapshot: row.data, updatedAt: row.updatedAt });
}

export async function POST(req: Request) {
  let body: { code?: string; snapshot?: Snapshot; logs?: IncomingLog[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: '请求体不是合法 JSON' }, { status: 400 });
  }
  const code = (body.code ?? '').toUpperCase();
  if (!CODE_RE.test(code)) return NextResponse.json({ ok: false, error: '同步码格式不正确' }, { status: 400 });
  const client = body.snapshot ?? {};
  if (typeof client !== 'object') return NextResponse.json({ ok: false, error: '快照格式错误' }, { status: 400 });

  const [existing] = await db.select().from(profiles).where(eq(profiles.code, code)).limit(1);
  const merged = existing ? merge(existing.data as Snapshot, client) : { ...client, v: 2, updatedAt: new Date().toISOString() };

  if (existing) {
    await db
      .update(profiles)
      .set({ data: merged as Record<string, unknown>, updatedAt: new Date() })
      .where(eq(profiles.code, code));
  } else {
    await db.insert(profiles).values({ code, data: merged as Record<string, unknown> });
  }

  const logs = Array.isArray(body.logs) ? body.logs.slice(0, 2000) : [];
  if (logs.length) {
    const rows = logs
      .filter((l) => l && typeof l.clientId === 'string' && typeof l.cardId === 'string')
      .map((l) => ({
        profileCode: code,
        clientId: l.clientId,
        cardId: l.cardId,
        grade: Math.min(4, Math.max(1, Number(l.grade) || 1)),
        elapsedMs: Math.max(0, Number(l.elapsedMs) || 0),
        state: Number(l.state) || 0,
        stability: Number.isFinite(l.stability) ? l.stability : null,
        difficulty: Number.isFinite(l.difficulty) ? l.difficulty : null,
        reviewedAt: new Date(l.reviewedAt || Date.now()),
      }));
    if (rows.length) await db.insert(reviewLogs).values(rows).onConflictDoNothing();
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(reviewLogs)
    .where(eq(reviewLogs.profileCode, code));

  return NextResponse.json({ ok: true, snapshot: merged, serverReviews: count, updatedAt: new Date().toISOString() });
}
