'use client';

import { useSyncExternalStore } from 'react';
import { fsrs, createEmptyCard, generatorParameters, State, Rating, type Card, type Grade } from 'ts-fsrs';
import { ALL_CARDS, CARD_MAP, CHAPTER_MAP, studyableFor, cardInExam, type Exam } from '@/data';

/* ------------------------------------------------------------------ */
/* 类型                                                                */
/* ------------------------------------------------------------------ */

export type Order = 'random' | 'sequential';

export interface Settings {
  exam: Exam;
  order: Order;
  dailyNew: number;
  retention: number; // 0.8 ~ 0.97
  theme: 'auto' | 'light' | 'dark';
  motion: 'auto' | 'on' | 'off';
  fontScale: number; // 0.9 ~ 1.25
  mathScale: number; // 0.9 ~ 1.3
  hintFirst: boolean;
  haptics: boolean;
  examDate: string; // YYYY-MM-DD
}

export interface DayLog {
  n: number;
  again: number;
  ms: number;
  new: number;
}

export interface ReviewEntry {
  id: string;
  g: Grade;
  ms: number;
  at: string;
  exam: Exam;
  /** 复习后的稳定性（天） */
  s: number;
}

export interface Store {
  v: 3;
  cards: Record<string, Card>;
  /** key: `${YYYY-MM-DD}|${exam}` */
  logs: Record<string, DayLog>;
  history: ReviewEntry[];
  newToday: { d: string; m1: number; m2: number };
  cursor: { m1: number; m2: number };
  flags: string[];
  notes: Record<string, string>;
  settings: Settings;
  updatedAt: string;
}

const KEY = 'kaoyan-math-v3';
const LEGACY_KEYS = ['math2-fsrs-v2', 'math2-memo-v1'];
const HISTORY_LIMIT = 5000;

export const DEFAULT_SETTINGS: Settings = {
  exam: 'm2',
  order: 'random',
  dailyNew: 15,
  retention: 0.9,
  theme: 'auto',
  motion: 'auto',
  fontScale: 1,
  mathScale: 1,
  hintFirst: true,
  haptics: true,
  examDate: '2026-12-19',
};

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fresh(): Store {
  return {
    v: 3,
    cards: {},
    logs: {},
    history: [],
    newToday: { d: todayKey(), m1: 0, m2: 0 },
    cursor: { m1: 0, m2: 0 },
    flags: [],
    notes: {},
    settings: { ...DEFAULT_SETTINGS },
    updatedAt: new Date(0).toISOString(),
  };
}

const EMPTY: Store = fresh();

function reviveCards(cards: Record<string, Card>): Record<string, Card> {
  const out: Record<string, Card> = {};
  for (const [id, c] of Object.entries(cards)) {
    if (!CARD_MAP[id] || !c) continue;
    out[id] = { ...c, due: new Date(c.due), last_review: c.last_review ? new Date(c.last_review) : undefined };
  }
  return out;
}

type LegacyStore = { cards?: Record<string, Card>; logs?: Record<string, DayLog>; flags?: string[]; notes?: Record<string, string>; settings?: Partial<Settings> & { motion?: boolean | string } };

function normalize(parsed: Partial<Store> & LegacyStore): Store {
  const base = fresh();
  const logs: Record<string, DayLog> = {};
  for (const [k, v] of Object.entries(parsed.logs ?? {})) {
    const l = v as Partial<DayLog>;
    // v2 日志无考试维度：归入数学二
    const key = k.includes('|') ? k : `${k}|m2`;
    logs[key] = { n: l.n ?? 0, again: l.again ?? 0, ms: l.ms ?? 0, new: l.new ?? 0 };
  }
  const s: Partial<Settings> & { motion?: boolean | string } = parsed.settings ?? {};
  const settings: Settings = {
    ...base.settings,
    ...s,
    motion: typeof s.motion === 'boolean' ? (s.motion ? 'auto' : 'off') : ((s.motion as Settings['motion']) ?? 'auto'),
    exam: s.exam === 'm1' ? 'm1' : 'm2',
    order: s.order === 'sequential' ? 'sequential' : 'random',
  };
  const nt = parsed.newToday as Partial<Store['newToday']> | undefined;
  return {
    ...base,
    cards: reviveCards((parsed.cards ?? {}) as Record<string, Card>),
    logs,
    history: Array.isArray(parsed.history) ? parsed.history.slice(-HISTORY_LIMIT) : [],
    newToday: nt?.d === todayKey() ? { d: nt.d, m1: nt.m1 ?? 0, m2: nt.m2 ?? 0 } : base.newToday,
    cursor: { m1: parsed.cursor?.m1 ?? 0, m2: parsed.cursor?.m2 ?? 0 },
    flags: Array.isArray(parsed.flags) ? parsed.flags.filter((id) => CARD_MAP[id]) : [],
    notes: parsed.notes ?? {},
    settings,
    updatedAt: parsed.updatedAt ?? base.updatedAt,
  };
}

function load(): Store {
  if (typeof window === 'undefined') return EMPTY;
  try {
    let raw = localStorage.getItem(KEY);
    if (!raw) for (const k of LEGACY_KEYS) if ((raw = localStorage.getItem(k))) break;
    if (!raw) return fresh();
    return normalize(JSON.parse(raw));
  } catch {
    return fresh();
  }
}

/* ------------------------------------------------------------------ */
/* 外部 store                                                          */
/* ------------------------------------------------------------------ */

let state: Store = EMPTY;
let loaded = false;
let lastSaveError: string | null = null;
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
      lastSaveError = null;
    } catch (e) {
      lastSaveError = (e as Error)?.message ?? '存储失败';
      listeners.forEach((l) => l());
    }
  }, 120);
}

function emit() {
  listeners.forEach((l) => l());
  persist();
}

function set(patch: Partial<Store> | ((s: Store) => Partial<Store>)) {
  ensureLoaded();
  const p = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...p, updatedAt: new Date().toISOString() };
  emit();
}

function subscribe(cb: () => void) {
  ensureLoaded();
  listeners.add(cb);
  if (typeof window !== 'undefined') {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try {
          state = normalize(JSON.parse(e.newValue));
          listeners.forEach((l) => l());
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(cb);
      window.removeEventListener('storage', onStorage);
    };
  }
  return () => {
    listeners.delete(cb);
  };
}

/** 选择器必须返回稳定引用 */
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

export function useStoreState(): Store {
  return useStore((s) => s);
}

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => loaded, () => false);
}

export function useSaveError(): string | null {
  return useSyncExternalStore(subscribe, () => lastSaveError, () => null);
}

export function getState() {
  ensureLoaded();
  return state;
}

export function useExam(): Exam {
  return useStore((s) => s.settings.exam);
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
  const maximum_interval = Math.max(7, Math.min(180, left > 0 ? left : 180));
  return fsrs(generatorParameters({ request_retention: s.retention, maximum_interval, enable_fuzz: true }));
}

export function cardStateOf(id: string, s: Store = getState()): Card | undefined {
  return s.cards[id];
}

export function isLearned(id: string, s: Store = getState()) {
  const c = s.cards[id];
  return !!c && c.state !== State.New;
}

export function retrievability(id: string, now = new Date(), s: Store = getState()): number | null {
  const c = s.cards[id];
  if (!c || c.state === State.New) return null;
  const r = scheduler(s.settings).get_retrievability(c, now, false);
  return typeof r === 'number' ? r : null;
}

export function previewIntervals(id: string, now = new Date()): Record<Grade, string> {
  const c = getState().cards[id] ?? createEmptyCard(now);
  const rec = scheduler().repeat(c, now);
  const fmt = (g: Grade) => humanInterval(rec[g].card.due.getTime() - now.getTime());
  return { [Rating.Again]: fmt(Rating.Again), [Rating.Hard]: fmt(Rating.Hard), [Rating.Good]: fmt(Rating.Good), [Rating.Easy]: fmt(Rating.Easy) } as Record<Grade, string>;
}

export function humanInterval(ms: number): string {
  const m = Math.round(ms / 60000);
  if (m < 1) return '<1 分';
  if (m < 60) return `${m} 分`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} 时`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} 天`;
  const mo = d / 30;
  return mo < 12 ? `${mo.toFixed(mo < 3 ? 1 : 0)} 月` : `${(d / 365).toFixed(1)} 年`;
}

export interface RateResult {
  prev: Card | undefined;
  wasNew: boolean;
}

function bumpLog(logs: Record<string, DayLog>, key: string, d: Partial<DayLog>) {
  const cur = logs[key] ?? { n: 0, again: 0, ms: 0, new: 0 };
  return { ...logs, [key]: { n: cur.n + (d.n ?? 0), again: cur.again + (d.again ?? 0), ms: cur.ms + (d.ms ?? 0), new: cur.new + (d.new ?? 0) } };
}

export function rate(id: string, grade: Grade, elapsedMs = 0, now = new Date()): RateResult {
  ensureLoaded();
  const prev = state.cards[id];
  const wasNew = !prev || prev.state === State.New;
  const base = prev ?? createEmptyCard(now);
  const rec = scheduler().repeat(base, now);
  const next = rec[grade].card;
  const exam = state.settings.exam;
  const key = `${todayKey(now)}|${exam}`;
  const entry: ReviewEntry = { id, g: grade, ms: Math.min(elapsedMs, 600000), at: now.toISOString(), exam, s: Math.round(next.stability * 10) / 10 };
  set((s) => ({
    cards: { ...s.cards, [id]: next },
    logs: bumpLog(s.logs, key, { n: 1, again: grade === Rating.Again ? 1 : 0, ms: entry.ms, new: wasNew ? 1 : 0 }),
    history: [...s.history, entry].slice(-HISTORY_LIMIT),
    newToday: s.newToday.d === todayKey(now) ? { ...s.newToday, [exam]: s.newToday[exam] + (wasNew ? 1 : 0) } : { d: todayKey(now), m1: 0, m2: 0, [exam]: wasNew ? 1 : 0 },
  }));
  return { prev, wasNew };
}

export function undoRate(id: string, prev: Card | undefined, grade: Grade, elapsedMs: number, wasNew: boolean, now = new Date()) {
  const exam = getState().settings.exam;
  const key = `${todayKey(now)}|${exam}`;
  set((s) => {
    const cards = { ...s.cards };
    if (prev) cards[id] = prev;
    else delete cards[id];
    const history = s.history.slice();
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].id === id) {
        history.splice(i, 1);
        break;
      }
    }
    return {
      cards,
      logs: bumpLog(s.logs, key, { n: -1, again: grade === Rating.Again ? -1 : 0, ms: -Math.min(elapsedMs, 600000), new: wasNew ? -1 : 0 }),
      history,
      newToday: { ...s.newToday, [exam]: Math.max(0, s.newToday[exam] - (wasNew ? 1 : 0)) },
    };
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
/* 查询（全部按当前考试模式过滤）                                       */
/* ------------------------------------------------------------------ */

function pool(exam: Exam, chapters?: string[]) {
  const list = studyableFor(exam);
  return chapters ? list.filter((c) => chapters.includes(c.ch)) : list;
}

export function dueIds(now = new Date(), chapters?: string[], s: Store = getState()): string[] {
  const t = now.getTime();
  return pool(s.settings.exam, chapters)
    .filter((c) => {
      const st = s.cards[c.id];
      return st && st.state !== State.New && st.due.getTime() <= t;
    })
    .sort((a, b) => s.cards[a.id].due.getTime() - s.cards[b.id].due.getTime())
    .map((c) => c.id);
}

export function newIds(chapters?: string[], s: Store = getState()): string[] {
  return pool(s.settings.exam, chapters)
    .filter((c) => !s.cards[c.id] || s.cards[c.id].state === State.New)
    .map((c) => c.id);
}

export function newRemainingToday(s: Store = getState()) {
  const used = s.newToday.d === todayKey() ? s.newToday[s.settings.exam] : 0;
  return Math.max(0, s.settings.dailyNew - used);
}

export interface ChapterStat {
  total: number;
  learned: number;
  due: number;
  mature: number;
  avgR: number | null;
  pending: number;
}

export function chapterStat(ch: string, now = new Date(), s: Store = getState()): ChapterStat {
  const exam = s.settings.exam;
  const all = ALL_CARDS.filter((c) => c.ch === ch && cardInExam(c, exam));
  const cards = all.filter((c) => c.status !== 'pending');
  let learned = 0;
  let due = 0;
  let mature = 0;
  let rs = 0;
  let rn = 0;
  const t = now.getTime();
  for (const c of cards) {
    const st = s.cards[c.id];
    if (!st || st.state === State.New) continue;
    learned++;
    if (st.due.getTime() <= t) due++;
    if (st.stability >= 21) mature++;
    const r = retrievability(c.id, now, s);
    if (r != null) {
      rs += r;
      rn++;
    }
  }
  return { total: cards.length, learned, due, mature, avgR: rn ? rs / rn : null, pending: all.length - cards.length };
}

export function overallStat(now = new Date(), s: Store = getState()) {
  const exam = s.settings.exam;
  const cards = studyableFor(exam);
  let learned = 0;
  let mature = 0;
  let due = 0;
  let rs = 0;
  let rn = 0;
  const t = now.getTime();
  for (const c of cards) {
    const st = s.cards[c.id];
    if (!st || st.state === State.New) continue;
    learned++;
    if (st.stability >= 21) mature++;
    if (st.due.getTime() <= t) due++;
    const r = retrievability(c.id, now, s);
    if (r != null) {
      rs += r;
      rn++;
    }
  }
  return { total: cards.length, learned, mature, due, avgR: rn ? rs / rn : null };
}

function examLogs(s: Store, exam: Exam = s.settings.exam): Record<string, DayLog> {
  const out: Record<string, DayLog> = {};
  for (const [k, v] of Object.entries(s.logs)) {
    const [d, e] = k.split('|');
    if (e === exam) out[d] = v;
  }
  return out;
}

export function streak(s: Store = getState()): number {
  const logs = examLogs(s);
  let n = 0;
  const d = new Date();
  if (!(logs[todayKey(d)]?.n > 0)) d.setDate(d.getDate() - 1);
  while (logs[todayKey(d)]?.n > 0) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function todayLog(s: Store = getState()): DayLog {
  return s.logs[`${todayKey()}|${s.settings.exam}`] ?? { n: 0, again: 0, ms: 0, new: 0 };
}

export function forecast(days = 14, now = new Date(), s: Store = getState()): number[] {
  const out = new Array<number>(days).fill(0);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  for (const c of studyableFor(s.settings.exam)) {
    const st = s.cards[c.id];
    if (!st || st.state === State.New) continue;
    const diff = Math.floor((st.due.getTime() - start.getTime()) / 86400000);
    const i = Math.max(0, diff);
    if (i < days) out[i]++;
  }
  return out;
}

export function heat(days = 119, s: Store = getState()): { d: string; n: number }[] {
  const logs = examLogs(s);
  const out: { d: string; n: number }[] = [];
  const d = new Date();
  d.setDate(d.getDate() - days + 1);
  for (let i = 0; i < days; i++) {
    const k = todayKey(d);
    out.push({ d: k, n: logs[k]?.n ?? 0 });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function totalsAllTime(s: Store = getState()) {
  const logs = examLogs(s);
  let n = 0;
  let again = 0;
  let ms = 0;
  let days = 0;
  for (const l of Object.values(logs)) {
    if (l.n <= 0) continue;
    n += l.n;
    again += l.again;
    ms += l.ms;
    days++;
  }
  return { n, again, ms, days };
}

export function weakIds(limit = 20, now = new Date(), s: Store = getState()): string[] {
  return studyableFor(s.settings.exam)
    .map((c) => ({ id: c.id, st: s.cards[c.id] }))
    .filter((x) => x.st && x.st.state !== State.New && (x.st.lapses > 0 || x.st.difficulty >= 7))
    .sort((a, b) => b.st.lapses * 2 + b.st.difficulty - (a.st.lapses * 2 + a.st.difficulty))
    .slice(0, limit)
    .map((x) => x.id);
}

export function leechIds(s: Store = getState()): string[] {
  return studyableFor(s.settings.exam)
    .filter((c) => (s.cards[c.id]?.lapses ?? 0) >= 4)
    .map((c) => c.id);
}

export function recentHistory(limit = 50, s: Store = getState()): ReviewEntry[] {
  const exam = s.settings.exam;
  return s.history.filter((h) => h.exam === exam).slice(-limit).reverse();
}

/* ------------------------------------------------------------------ */
/* 操作                                                                */
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

export function setCursor(exam: Exam, index: number) {
  set((s) => ({ cursor: { ...s.cursor, [exam]: index } }));
}

export function exportData(): string {
  return JSON.stringify({ app: 'kaoyan-math', exportedAt: new Date().toISOString(), ...getState() }, null, 2);
}

export type ImportResult = { ok: true; cards: number; reviews: number } | { ok: false; error: string };

export function importData(json: string): ImportResult {
  try {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object' || (!parsed.cards && !parsed.settings && !parsed.logs)) return { ok: false, error: '文件中没有可识别的学习数据' };
    const next = normalize(parsed);
    state = next;
    emit();
    return { ok: true, cards: Object.keys(next.cards).length, reviews: next.history.length };
  } catch {
    return { ok: false, error: '文件不是有效的 JSON' };
  }
}

export function resetAll() {
  state = fresh();
  loaded = true;
  emit();
}

export function resetProgressOnly() {
  set((s) => ({ cards: {}, logs: {}, history: [], newToday: { d: todayKey(), m1: 0, m2: 0 }, cursor: { m1: 0, m2: 0 }, settings: s.settings }));
}

export function chapterTitle(ch: string) {
  return CHAPTER_MAP[ch]?.title ?? ch;
}

export { State, Rating };
export type { Card, Grade };
