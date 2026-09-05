import { useSyncExternalStore } from 'react';
import { fsrs, createEmptyCard, generatorParameters, State, type Card, type Grade } from 'ts-fsrs';
import { ALL_CARDS, CHAPTERS } from '../data';

/* ------------------------------------------------------------------ */
/* 类型                                                                */
/* ------------------------------------------------------------------ */

export interface Settings {
  dailyNew: number;
  retention: number; // 0.8 ~ 0.97
  chapters: string[]; // 启用的章节
  theme: 'auto' | 'light' | 'dark';
  motion: boolean;
  fontScale: number; // 0.9 ~ 1.2
  showHookFirst: boolean; // 翻面后是否默认展开记忆锚点
}

export interface DayLog {
  n: number;
  again: number;
  ms: number;
}

export interface Store {
  v: 1;
  cards: Record<string, Card>;
  logs: Record<string, DayLog>;
  newToday: { d: string; n: number };
  flags: string[];
  notes: Record<string, string>;
  settings: Settings;
  onboarded: boolean;
}

const KEY = 'math2-memo-v1';

export const DEFAULT_SETTINGS: Settings = {
  dailyNew: 15,
  retention: 0.9,
  chapters: CHAPTERS.map((c) => c.id),
  theme: 'auto',
  motion: true,
  fontScale: 1,
  showHookFirst: true,
};

function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fresh(): Store {
  return {
    v: 1,
    cards: {},
    logs: {},
    newToday: { d: todayKey(), n: 0 },
    flags: [],
    notes: {},
    settings: { ...DEFAULT_SETTINGS },
    onboarded: false,
  };
}

function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const parsed = JSON.parse(raw) as Partial<Store>;
    const base = fresh();
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...(parsed.settings ?? {}) },
      newToday: parsed.newToday?.d === todayKey() ? parsed.newToday : { d: todayKey(), n: 0 },
    };
  } catch {
    return fresh();
  }
}

/* ------------------------------------------------------------------ */
/* 外部 store                                                          */
/* ------------------------------------------------------------------ */

let state: Store = load();
const listeners = new Set<() => void>();
let saveTimer: number | undefined;

function emit() {
  listeners.forEach((l) => l());
  if (saveTimer) window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore quota errors */
    }
  }, 150);
}

function set(patch: Partial<Store> | ((s: Store) => Partial<Store>)) {
  const p = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...p };
  emit();
}

export function useStore<T>(selector: (s: Store) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => selector(state),
    () => selector(state),
  );
}

export function getState() {
  return state;
}

/* ------------------------------------------------------------------ */
/* FSRS                                                                */
/* ------------------------------------------------------------------ */

function scheduler() {
  return fsrs(
    generatorParameters({
      request_retention: state.settings.retention,
      maximum_interval: 180, // 考研备考周期内，间隔不超过半年
      enable_fuzz: true,
      enable_short_term: true,
    }),
  );
}

export function cardStateOf(id: string): Card | undefined {
  return state.cards[id];
}

export function isLearned(id: string) {
  const c = state.cards[id];
  return !!c && c.state !== State.New;
}

export function retrievability(id: string, now = new Date()): number | null {
  const c = state.cards[id];
  if (!c || c.state === State.New) return null;
  try {
    return scheduler().get_retrievability(c, now, false);
  } catch {
    return null;
  }
}

export function previewIntervals(id: string, now = new Date()): Record<Grade, string> {
  const f = scheduler();
  const card = state.cards[id] ?? createEmptyCard(now);
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
  if (min < 1) return '<1分';
  if (min < 60) return `${min}分`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}时`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}天`;
  const mo = (d / 30).toFixed(1).replace(/\.0$/, '');
  return `${mo}月`;
}

export interface RateResult {
  prev: Card | undefined;
  wasNew: boolean;
  nextDue: Date;
  requeue: boolean;
}

/** 评分并调度 */
export function rate(id: string, grade: Grade, elapsedMs = 0, now = new Date()): RateResult {
  const f = scheduler();
  const prev = state.cards[id];
  const wasNew = !prev || prev.state === State.New;
  const card = prev ?? createEmptyCard(now);
  const { card: next } = f.next(card, now, grade);
  const day = todayKey(now);
  const log = state.logs[day] ?? { n: 0, again: 0, ms: 0 };
  set({
    cards: { ...state.cards, [id]: next },
    logs: { ...state.logs, [day]: { n: log.n + 1, again: log.again + (grade === 1 ? 1 : 0), ms: log.ms + elapsedMs } },
    newToday: wasNew
      ? { d: day, n: (state.newToday.d === day ? state.newToday.n : 0) + 1 }
      : state.newToday.d === day
        ? state.newToday
        : { d: day, n: 0 },
  });
  const nextDue = new Date(next.due);
  // 处于（重）学习阶段且下次到期在 20 分钟内 → 本次会话内重排
  const requeue = (next.state === State.Learning || next.state === State.Relearning) && nextDue.getTime() - now.getTime() < 20 * 60000;
  return { prev, wasNew, nextDue, requeue };
}

/** 撤销上一次评分 */
export function undoRate(id: string, res: RateResult, grade: Grade, now = new Date()) {
  const day = todayKey(now);
  const cards = { ...state.cards };
  if (res.prev) cards[id] = res.prev;
  else delete cards[id];
  const log = state.logs[day];
  set({
    cards,
    logs: log ? { ...state.logs, [day]: { ...log, n: Math.max(0, log.n - 1), again: Math.max(0, log.again - (grade === 1 ? 1 : 0)) } } : state.logs,
    newToday: res.wasNew && state.newToday.d === day ? { d: day, n: Math.max(0, state.newToday.n - 1) } : state.newToday,
  });
}

export function forgetCard(id: string) {
  const cards = { ...state.cards };
  delete cards[id];
  set({ cards });
}

/* ------------------------------------------------------------------ */
/* 查询                                                                */
/* ------------------------------------------------------------------ */

export function enabledCards() {
  const en = new Set(state.settings.chapters);
  return ALL_CARDS.filter((c) => en.has(c.ch));
}

export function dueIds(now = new Date(), chapters?: string[]): string[] {
  const en = new Set(chapters ?? state.settings.chapters);
  const t = now.getTime();
  return ALL_CARDS.filter((c) => {
    if (!en.has(c.ch)) return false;
    const s = state.cards[c.id];
    return !!s && s.state !== State.New && new Date(s.due).getTime() <= t;
  })
    .sort((a, b) => new Date(state.cards[a.id].due).getTime() - new Date(state.cards[b.id].due).getTime())
    .map((c) => c.id);
}

export function newIds(chapters?: string[]): string[] {
  const en = new Set(chapters ?? state.settings.chapters);
  return ALL_CARDS.filter((c) => en.has(c.ch) && !isLearned(c.id)).map((c) => c.id);
}

export function newRemainingToday() {
  const used = state.newToday.d === todayKey() ? state.newToday.n : 0;
  return Math.max(0, state.settings.dailyNew - used);
}

export interface ChapterStat {
  total: number;
  learned: number;
  due: number;
  mastery: number; // 0-1，已学卡片平均可提取率 × 覆盖率
  avgR: number | null;
  weak: number; // R < 0.7 的数量
}

export function chapterStat(ch: string, now = new Date()): ChapterStat {
  const cards = ALL_CARDS.filter((c) => c.ch === ch);
  let learned = 0;
  let due = 0;
  let rSum = 0;
  let weak = 0;
  const t = now.getTime();
  for (const c of cards) {
    const s = state.cards[c.id];
    if (!s || s.state === State.New) continue;
    learned++;
    if (new Date(s.due).getTime() <= t) due++;
    const r = retrievability(c.id, now) ?? 0;
    rSum += r;
    if (r < 0.7) weak++;
  }
  const avgR = learned ? rSum / learned : null;
  return {
    total: cards.length,
    learned,
    due,
    mastery: cards.length ? rSum / cards.length : 0,
    avgR,
    weak,
  };
}

export function overallStat(now = new Date()) {
  let learned = 0;
  let rSum = 0;
  let due = 0;
  const t = now.getTime();
  for (const c of ALL_CARDS) {
    const s = state.cards[c.id];
    if (!s || s.state === State.New) continue;
    learned++;
    rSum += retrievability(c.id, now) ?? 0;
    if (new Date(s.due).getTime() <= t) due++;
  }
  const total = ALL_CARDS.length;
  const reviews = Object.values(state.logs).reduce((s, l) => s + l.n, 0);
  return { total, learned, due, mastery: total ? rSum / total : 0, reviews, streak: streak() };
}

export function streak(): number {
  let n = 0;
  const d = new Date();
  // 今天若还没学，不中断连续（从昨天开始数）
  if (!state.logs[todayKey(d)]) d.setDate(d.getDate() - 1);
  for (;;) {
    const k = todayKey(d);
    if (state.logs[k]?.n) {
      n++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return n;
}

export function todayLog(): DayLog {
  return state.logs[todayKey()] ?? { n: 0, again: 0, ms: 0 };
}

/** 未来 n 天到期预测 */
export function forecast(days = 7, now = new Date()): number[] {
  const out = new Array(days).fill(0) as number[];
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  for (const c of Object.values(state.cards)) {
    if (c.state === State.New) continue;
    const due = new Date(c.due).getTime();
    const idx = Math.floor((due - start.getTime()) / 86400000);
    if (idx < 0) out[0]++;
    else if (idx < days) out[idx]++;
  }
  return out;
}

/** 热力图：最近 n 天每天复习量 */
export function heat(days = 91): { d: string; n: number }[] {
  const out: { d: string; n: number }[] = [];
  const d = new Date();
  d.setDate(d.getDate() - (days - 1));
  for (let i = 0; i < days; i++) {
    const k = todayKey(d);
    out.push({ d: k, n: state.logs[k]?.n ?? 0 });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/** 薄弱卡：可提取率最低 / 遗忘次数最多 */
export function weakIds(limit = 20, now = new Date()): string[] {
  return ALL_CARDS.filter((c) => isLearned(c.id))
    .map((c) => {
      const s = state.cards[c.id];
      const r = retrievability(c.id, now) ?? 1;
      return { id: c.id, score: r - s.lapses * 0.08 - s.difficulty * 0.01 };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((x) => x.id);
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

export function exportData(): string {
  return JSON.stringify(state, null, 2);
}

export function importData(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as Store;
    if (!parsed || parsed.v !== 1 || typeof parsed.cards !== 'object') return false;
    state = { ...fresh(), ...parsed, settings: { ...DEFAULT_SETTINGS, ...parsed.settings } };
    emit();
    return true;
  } catch {
    return false;
  }
}

export function resetAll() {
  state = fresh();
  emit();
}

export function resetProgressOnly() {
  set({ cards: {}, logs: {}, newToday: { d: todayKey(), n: 0 } });
}
