'use client';

import { useSyncExternalStore } from 'react';
import { fsrs, createEmptyCard, generatorParameters, State, type Card, type Grade } from 'ts-fsrs';
import { ALL_CARDS, CHAPTERS, CARD_MAP } from '@/data';

/* ------------------------------------------------------------------ */
/* 类型                                                                */
/* ------------------------------------------------------------------ */

export interface Settings {
  dailyNew: number;
  retention: number; // 0.8 ~ 0.97
  chapters: string[];
  theme: 'auto' | 'light' | 'dark';
  motion: boolean;
  fontScale: number; // 0.9 ~ 1.3
  mathScale: number; // 0.9 ~ 1.3
  showHookFirst: boolean;
  simpleGrading: boolean; // 只显示「忘了 / 记得」
  swipe: boolean;
  haptics: boolean;
  examDate: string; // YYYY-MM-DD
  newOrder: 'chapter' | 'importance';
}

export interface DayLog {
  n: number;
  again: number;
  ms: number;
  new: number;
}

export interface PendingLog {
  clientId: string;
  cardId: string;
  grade: Grade;
  elapsedMs: number;
  state: number;
  stability: number;
  difficulty: number;
  reviewedAt: string;
}

export interface SyncMeta {
  code: string | null;
  lastSyncAt: string | null;
  lastError: string | null;
}

export interface Store {
  v: 2;
  cards: Record<string, Card>;
  logs: Record<string, DayLog>;
  newToday: { d: string; n: number };
  flags: string[];
  notes: Record<string, string>;
  settings: Settings;
  onboarded: boolean;
  pending: PendingLog[];
  sync: SyncMeta;
  updatedAt: string;
}

const KEY = 'math2-fsrs-v2';
const LEGACY_KEY = 'math2-memo-v1';

export const DEFAULT_SETTINGS: Settings = {
  dailyNew: 15,
  retention: 0.9,
  chapters: CHAPTERS.map((c) => c.id),
  theme: 'auto',
  motion: true,
  fontScale: 1,
  mathScale: 1,
  showHookFirst: true,
  simpleGrading: false,
  swipe: true,
  haptics: true,
  examDate: '2026-12-19',
  newOrder: 'chapter',
};

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fresh(): Store {
  return {
    v: 2,
    cards: {},
    logs: {},
    newToday: { d: todayKey(), n: 0 },
    flags: [],
    notes: {},
    settings: { ...DEFAULT_SETTINGS },
    onboarded: false,
    pending: [],
    sync: { code: null, lastSyncAt: null, lastError: null },
    updatedAt: new Date(0).toISOString(),
  };
}

/** 服务端 / 首次水合时使用的稳定快照 */
const EMPTY: Store = fresh();

function reviveCards(cards: Record<string, Card>): Record<string, Card> {
  const out: Record<string, Card> = {};
  for (const [id, c] of Object.entries(cards)) {
    if (!CARD_MAP[id] || !c) continue;
    out[id] = {
      ...c,
      due: new Date(c.due),
      last_review: c.last_review ? new Date(c.last_review) : undefined,
    };
  }
  return out;
}

function normalize(parsed: Partial<Store>): Store {
  const base = fresh();
  const logs: Record<string, DayLog> = {};
  for (const [k, v] of Object.entries(parsed.logs ?? {})) {
    const l = v as Partial<DayLog>;
    logs[k] = { n: l.n ?? 0, again: l.again ?? 0, ms: l.ms ?? 0, new: l.new ?? 0 };
  }
  return {
    ...base,
    ...parsed,
    v: 2,
    cards: reviveCards((parsed.cards ?? {}) as Record<string, Card>),
    logs,
    settings: { ...base.settings, ...(parsed.settings ?? {}) },
    newToday: parsed.newToday?.d === todayKey() ? parsed.newToday : { d: todayKey(), n: 0 },
    pending: Array.isArray(parsed.pending) ? parsed.pending : [],
    sync: { ...base.sync, ...(parsed.sync ?? {}) },
    flags: Array.isArray(parsed.flags) ? parsed.flags.filter((id) => CARD_MAP[id]) : [],
    notes: parsed.notes ?? {},
    updatedAt: parsed.updatedAt ?? base.updatedAt,
  };
}

function load(): Store {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return fresh();
    return normalize(JSON.parse(raw) as Partial<Store>);
  } catch {
    return fresh();
  }
}

/* ------------------------------------------------------------------ */
/* 外部 store                                                          */
/* ------------------------------------------------------------------ */

let state: Store = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | undefined;

function ensureLoaded() {
  if (!loaded && typeof window !== 'undefined') {
    state = load();
    loaded = true;
  }
}

function persist() {
  if (typeof window === 'undefined') return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota */
    }
  }, 120);
}

function emit() {
  listeners.forEach((l) => l());
  persist();
}

function set(patch: Partial<Store> | ((s: Store) => Partial<Store>), touch = true) {
  ensureLoaded();
  const p = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...p, ...(touch ? { updatedAt: new Date().toISOString() } : {}) };
  emit();
}

function subscribe(cb: () => void) {
  ensureLoaded();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** 选择器必须返回稳定引用（原始值或 state 中已有的对象） */
export function useStore<T>(selector: (s: Store) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => {
      ensureLoaded();
      return selector(state);
    },
    () => selector(EMPTY),
  );
}

/** 整体 state（引用随每次变更更新，适合配合 useMemo 派生统计） */
export function useStoreState(): Store {
  return useStore((s) => s);
}

/** 是否已在客户端完成加载（用于避免 SSR 闪烁） */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => loaded,
    () => false,
  );
}

export function getState() {
  ensureLoaded();
  return state;
}

/* ------------------------------------------------------------------ */
/* FSRS                                                                */
/* ------------------------------------------------------------------ */

export function daysToExam(now = new Date(), s: Settings = getState().settings): number {
  const exam = new Date(`${s.examDate}T08:30:00`);
  return Math.ceil((exam.getTime() - now.getTime()) / 86400000);
}

function scheduler(s: Settings = state.settings) {
  const left = daysToExam(new Date(), s);
  // 间隔上限：不超过半年，也不超过距考试的天数（至少 7 天，防止考前疯狂堆积）
  const maximum_interval = Math.max(7, Math.min(180, left > 0 ? left : 180));
  return fsrs(
    generatorParameters({
      request_retention: s.retention,
      maximum_interval,
      enable_fuzz: true,
      enable_short_term: true,
    }),
  );
}

export function cardStateOf(id: string): Card | undefined {
  return getState().cards[id];
}

export function isLearned(id: string, s: Store = getState()) {
  const c = s.cards[id];
  return !!c && c.state !== State.New;
}

export function retrievability(id: string, now = new Date(), s: Store = getState()): number | null {
  const c = s.cards[id];
  if (!c || c.state === State.New) return null;
  try {
    return scheduler(s.settings).get_retrievability(c, now, false);
  } catch {
    return null;
  }
}

export function previewIntervals(id: string, now = new Date()): Record<Grade, string> {
  const f = scheduler();
  const card = getState().cards[id] ?? createEmptyCard(now);
  const out = {} as Record<Grade, string>;
  ([1, 2, 3, 4] as Grade[]).forEach((g) => {
    try {
      const { card: next } = f.next(card, now, g);
      out[g] = humanInterval(new Date(next.due).getTime() - now.getTime());
    } catch {
      out[g] = '';
    }
  });
  return out;
}

export function humanInterval(ms: number): string {
  const min = Math.round(ms / 60000);
  if (min < 1) return '<1 分';
  if (min < 60) return `${min} 分`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} 小时`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} 天`;
  const mo = (d / 30).toFixed(1).replace(/\.0$/, '');
  return `${mo} 月`;
}

export interface RateResult {
  prev: Card | undefined;
  wasNew: boolean;
  nextDue: Date;
  requeue: boolean;
  leech: boolean;
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** 评分并调度 */
export function rate(id: string, grade: Grade, elapsedMs = 0, now = new Date()): RateResult {
  ensureLoaded();
  const f = scheduler();
  const prev = state.cards[id];
  const wasNew = !prev || prev.state === State.New;
  const card = prev ?? createEmptyCard(now);
  const { card: next } = f.next(card, now, grade);
  const day = todayKey(now);
  const log = state.logs[day] ?? { n: 0, again: 0, ms: 0, new: 0 };
  const pendingItem: PendingLog = {
    clientId: uid(),
    cardId: id,
    grade,
    elapsedMs: Math.min(elapsedMs, 10 * 60000),
    state: next.state,
    stability: next.stability,
    difficulty: next.difficulty,
    reviewedAt: now.toISOString(),
  };
  set({
    cards: { ...state.cards, [id]: next },
    logs: {
      ...state.logs,
      [day]: { n: log.n + 1, again: log.again + (grade === 1 ? 1 : 0), ms: log.ms + Math.min(elapsedMs, 10 * 60000), new: log.new + (wasNew ? 1 : 0) },
    },
    newToday: wasNew ? { d: day, n: (state.newToday.d === day ? state.newToday.n : 0) + 1 } : state.newToday.d === day ? state.newToday : { d: day, n: 0 },
    pending: [...state.pending, pendingItem].slice(-2000),
  });
  const nextDue = new Date(next.due);
  const requeue = (next.state === State.Learning || next.state === State.Relearning) && nextDue.getTime() - now.getTime() < 20 * 60000;
  return { prev, wasNew, nextDue, requeue, leech: next.lapses >= 4 && grade === 1 };
}

/** 撤销上一次评分 */
export function undoRate(id: string, prev: Card | undefined, grade: Grade, elapsedMs: number, wasNew: boolean, now = new Date()) {
  ensureLoaded();
  const day = todayKey(now);
  const cards = { ...state.cards };
  if (prev) cards[id] = prev;
  else delete cards[id];
  const log = state.logs[day];
  const logs = { ...state.logs };
  if (log) {
    logs[day] = {
      n: Math.max(0, log.n - 1),
      again: Math.max(0, log.again - (grade === 1 ? 1 : 0)),
      ms: Math.max(0, log.ms - elapsedMs),
      new: Math.max(0, log.new - (wasNew ? 1 : 0)),
    };
    if (logs[day].n === 0) delete logs[day];
  }
  // 撤销时去掉最后一条针对该卡的待同步记录
  const pending = [...state.pending];
  for (let i = pending.length - 1; i >= 0; i--) {
    if (pending[i].cardId === id) {
      pending.splice(i, 1);
      break;
    }
  }
  set({
    cards,
    logs,
    newToday: wasNew && state.newToday.d === day ? { d: day, n: Math.max(0, state.newToday.n - 1) } : state.newToday,
    pending,
  });
}

export function forgetCard(id: string) {
  set((s) => {
    const cards = { ...s.cards };
    delete cards[id];
    return { cards };
  });
}

/* ------------------------------------------------------------------ */
/* 查询                                                                */
/* ------------------------------------------------------------------ */

export function dueIds(now = new Date(), chapters?: string[], s: Store = getState()): string[] {
  const en = new Set(chapters ?? s.settings.chapters);
  const t = now.getTime();
  return ALL_CARDS.filter((c) => {
    if (!en.has(c.ch)) return false;
    const st = s.cards[c.id];
    return !!st && st.state !== State.New && new Date(st.due).getTime() <= t;
  })
    .sort((a, b) => new Date(s.cards[a.id].due).getTime() - new Date(s.cards[b.id].due).getTime())
    .map((c) => c.id);
}

export function newIds(chapters?: string[], s: Store = getState()): string[] {
  const en = new Set(chapters ?? s.settings.chapters);
  const list = ALL_CARDS.filter((c) => en.has(c.ch) && !isLearned(c.id, s));
  if (s.settings.newOrder === 'importance') return list.slice().sort((a, b) => b.s - a.s).map((c) => c.id);
  return list.map((c) => c.id);
}

export function newRemainingToday(s: Store = getState()) {
  const used = s.newToday.d === todayKey() ? s.newToday.n : 0;
  return Math.max(0, s.settings.dailyNew - used);
}

export interface ChapterStat {
  total: number;
  learned: number;
  due: number;
  mastery: number;
  avgR: number | null;
  weak: number;
  mature: number;
}

export function chapterStat(ch: string, now = new Date(), s: Store = getState()): ChapterStat {
  const cards = ALL_CARDS.filter((c) => c.ch === ch);
  let learned = 0;
  let due = 0;
  let rSum = 0;
  let weak = 0;
  let mature = 0;
  const t = now.getTime();
  for (const c of cards) {
    const st = s.cards[c.id];
    if (!st || st.state === State.New) continue;
    learned++;
    if (new Date(st.due).getTime() <= t) due++;
    const r = retrievability(c.id, now, s) ?? 0;
    rSum += r;
    if (r < 0.7) weak++;
    if (st.stability >= 21) mature++;
  }
  return { total: cards.length, learned, due, mastery: cards.length ? rSum / cards.length : 0, avgR: learned ? rSum / learned : null, weak, mature };
}

export function overallStat(now = new Date(), s: Store = getState()) {
  let learned = 0;
  let rSum = 0;
  let due = 0;
  let mature = 0;
  const t = now.getTime();
  for (const c of ALL_CARDS) {
    const st = s.cards[c.id];
    if (!st || st.state === State.New) continue;
    learned++;
    rSum += retrievability(c.id, now, s) ?? 0;
    if (new Date(st.due).getTime() <= t) due++;
    if (st.stability >= 21) mature++;
  }
  const total = ALL_CARDS.length;
  const reviews = Object.values(s.logs).reduce((a, l) => a + l.n, 0);
  const minutes = Math.round(Object.values(s.logs).reduce((a, l) => a + l.ms, 0) / 60000);
  return { total, learned, due, mature, mastery: total ? rSum / total : 0, avgR: learned ? rSum / learned : null, reviews, minutes, streak: streak(s) };
}

export function streak(s: Store = getState()): number {
  let n = 0;
  const d = new Date();
  if (!s.logs[todayKey(d)]) d.setDate(d.getDate() - 1);
  for (;;) {
    const k = todayKey(d);
    if (s.logs[k]?.n) {
      n++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return n;
}

export function todayLog(s: Store = getState()): DayLog {
  return s.logs[todayKey()] ?? { n: 0, again: 0, ms: 0, new: 0 };
}

/** 未来 n 天到期预测（第 0 天含逾期） */
export function forecast(days = 14, now = new Date(), s: Store = getState()): number[] {
  const out = new Array(days).fill(0) as number[];
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const en = new Set(s.settings.chapters);
  for (const [id, c] of Object.entries(s.cards)) {
    if (c.state === State.New || !en.has(CARD_MAP[id]?.ch)) continue;
    const idx = Math.floor((new Date(c.due).getTime() - start.getTime()) / 86400000);
    if (idx < 0) out[0]++;
    else if (idx < days) out[idx]++;
  }
  return out;
}

export function heat(days = 119, s: Store = getState()): { d: string; n: number }[] {
  const out: { d: string; n: number }[] = [];
  const d = new Date();
  d.setDate(d.getDate() - (days - 1));
  for (let i = 0; i < days; i++) {
    const k = todayKey(d);
    out.push({ d: k, n: s.logs[k]?.n ?? 0 });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function weakIds(limit = 20, now = new Date(), s: Store = getState()): string[] {
  const en = new Set(s.settings.chapters);
  return ALL_CARDS.filter((c) => en.has(c.ch) && isLearned(c.id, s))
    .map((c) => {
      const st = s.cards[c.id];
      const r = retrievability(c.id, now, s) ?? 1;
      return { id: c.id, score: r - st.lapses * 0.08 - st.difficulty * 0.01 };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((x) => x.id);
}

export function leechIds(s: Store = getState()): string[] {
  return ALL_CARDS.filter((c) => (s.cards[c.id]?.lapses ?? 0) >= 4).map((c) => c.id);
}

/* ------------------------------------------------------------------ */
/* 其它操作                                                            */
/* ------------------------------------------------------------------ */

export function toggleFlag(id: string) {
  set((s) => ({ flags: s.flags.includes(id) ? s.flags.filter((x) => x !== id) : [...s.flags, id] }));
}

export function setNote(id: string, text: string) {
  set((s) => {
    const notes = { ...s.notes };
    if (text.trim()) notes[id] = text;
    else delete notes[id];
    return { notes };
  });
}

export function updateSettings(patch: Partial<Settings>) {
  set((s) => ({ settings: { ...s.settings, ...patch } }));
}

export function setOnboarded() {
  set({ onboarded: true });
}

export function setSyncMeta(patch: Partial<SyncMeta>) {
  set((s) => ({ sync: { ...s.sync, ...patch } }), false);
}

export function clearPending(ids: string[]) {
  const drop = new Set(ids);
  set((s) => ({ pending: s.pending.filter((p) => !drop.has(p.clientId)) }), false);
}

/** 用服务器返回的合并结果替换本地（保留本地 pending 与 sync 元信息） */
export function applyMerged(snapshot: Partial<Store>) {
  ensureLoaded();
  const merged = normalize({ ...snapshot, pending: state.pending, sync: state.sync });
  state = { ...merged, settings: { ...merged.settings, theme: state.settings.theme } };
  emit();
}

/** 用于上传的快照（不含 pending / sync） */
export function snapshotForSync(): Record<string, unknown> {
  ensureLoaded();
  const { pending: _p, sync: _s, ...rest } = state;
  void _p;
  void _s;
  return rest;
}

export function exportData(): string {
  return JSON.stringify(getState(), null, 2);
}

export function importData(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as Partial<Store> & { v?: number };
    if (!parsed || typeof parsed.cards !== 'object') return false;
    state = normalize(parsed);
    emit();
    return true;
  } catch {
    return false;
  }
}

export function resetAll() {
  state = fresh();
  loaded = true;
  emit();
}

export function resetProgressOnly() {
  set({ cards: {}, logs: {}, newToday: { d: todayKey(), n: 0 }, pending: [] });
}

export { State };
export type { Card, Grade };
