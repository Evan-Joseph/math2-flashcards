'use client';

import { ALL_CARDS, CARD_MAP, CHAPTER_MAP, studyableFor, cardsOf } from '@/data';
import { dueIds, newIds, newRemainingToday, weakIds, getState, leechIds, State } from './store';

export type SessionMode = 'daily' | 'chapter' | 'weak' | 'flag' | 'leech' | 'browse' | 'all' | 'custom';

export interface SessionPlan {
  mode: SessionMode;
  title: string;
  subtitle?: string;
  ids: string[];
  dueCount: number;
  newCount: number;
  chapter?: string;
  /** 巩固 / 浏览：不写入调度，只做自测 */
  cram?: boolean;
  /** 顺序模式起点（用于续学） */
  startIndex?: number;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 交错：避免同一章节连续出现太多；同时保证相邻不重复 */
function interleave(ids: string[]): string[] {
  const buckets = new Map<string, string[]>();
  for (const id of ids) {
    const ch = CARD_MAP[id].ch;
    if (!buckets.has(ch)) buckets.set(ch, []);
    buckets.get(ch)!.push(id);
  }
  const lists = shuffle([...buckets.values()].map(shuffle));
  const out: string[] = [];
  let remaining = ids.length;
  while (remaining > 0) {
    for (const l of lists) {
      const x = l.shift();
      if (x) {
        out.push(x);
        remaining--;
      }
    }
  }
  return out;
}

const knowledgeOrder = new Map(ALL_CARDS.map((c, i) => [c.id, i]));
export function bySequence(ids: string[]): string[] {
  return [...ids].sort((a, b) => (knowledgeOrder.get(a) ?? 0) - (knowledgeOrder.get(b) ?? 0));
}

function arrange(ids: string[]): string[] {
  return getState().settings.order === 'sequential' ? bySequence(ids) : interleave(ids);
}

/** 今日任务：到期复习 + 新卡（受每日上限约束） */
export function planDaily(now = new Date()): SessionPlan {
  const s = getState();
  const due = dueIds(now);
  const limit = newRemainingToday();
  const fresh = newIds().slice(0, limit);
  let ids: string[];
  if (s.settings.order === 'sequential') {
    ids = [...bySequence(due), ...bySequence(fresh)];
  } else {
    const d = interleave(due);
    const f = shuffle(fresh);
    ids = [];
    let di = 0;
    let ni = 0;
    // 大约每 3 张复习插 1 张新卡
    while (di < d.length || ni < f.length) {
      for (let k = 0; k < 3 && di < d.length; k++) ids.push(d[di++]);
      if (ni < f.length) ids.push(f[ni++]);
    }
  }
  return { mode: 'daily', title: '今日任务', subtitle: `${due.length} 张待复习 · ${fresh.length} 张新卡`, ids, dueCount: due.length, newCount: fresh.length };
}

/** 章节学习：到期 + 新卡（章节内不受每日上限限制，但至多 30 张新卡） */
export function planChapter(ch: string, now = new Date()): SessionPlan {
  const due = dueIds(now, [ch]);
  const fresh = newIds([ch]).slice(0, 30);
  const s = getState();
  const ids = s.settings.order === 'sequential' ? [...bySequence(due), ...bySequence(fresh)] : [...interleave(due), ...shuffle(fresh)];
  const title = CHAPTER_MAP[ch]?.title ?? ch;
  return { mode: 'chapter', title, subtitle: `${due.length} 张待复习 · ${fresh.length} 张新卡`, ids, dueCount: due.length, newCount: fresh.length, chapter: ch };
}

/** 顺序通读章节（巩固，不记录调度） */
export function planChapterBrowse(ch: string, startIndex = 0): SessionPlan {
  const exam = getState().settings.exam;
  const ids = cardsOf(ch, exam).filter((c) => c.status !== 'pending').map((c) => c.id);
  return { mode: 'browse', title: `${CHAPTER_MAP[ch]?.title ?? ch} · 通读`, subtitle: `${ids.length} 张 · 按知识顺序`, ids, dueCount: 0, newCount: 0, chapter: ch, cram: true, startIndex };
}

export function planWeak(now = new Date()): SessionPlan {
  const ids = arrange(weakIds(30, now));
  return { mode: 'weak', title: '薄弱点', subtitle: '遗忘次数多、难度高的卡片', ids, dueCount: ids.length, newCount: 0, cram: true };
}

export function planLeech(): SessionPlan {
  const ids = arrange(leechIds());
  return { mode: 'leech', title: '顽固卡片', subtitle: '遗忘 4 次以上', ids, dueCount: ids.length, newCount: 0, cram: true };
}

export function planFlag(): SessionPlan {
  const s = getState();
  const set = new Set(studyableFor(s.settings.exam).map((c) => c.id));
  const ids = arrange(s.flags.filter((id) => set.has(id)));
  return { mode: 'flag', title: '收藏', subtitle: `${ids.length} 张`, ids, dueCount: ids.length, newCount: 0, cram: true };
}

/** 全库随机 / 顺序自测（巩固） */
export function planAll(startIndex = 0): SessionPlan {
  const s = getState();
  const all = studyableFor(s.settings.exam).map((c) => c.id);
  const ids = s.settings.order === 'sequential' ? all : shuffle(all);
  return { mode: 'all', title: s.settings.order === 'sequential' ? '顺序通读' : '随机自测', subtitle: `${ids.length} 张`, ids, dueCount: 0, newCount: 0, cram: true, startIndex: s.settings.order === 'sequential' ? startIndex : 0 };
}

export function planCustom(ids: string[], title = '自定义'): SessionPlan {
  return { mode: 'custom', title, ids: arrange(ids), dueCount: 0, newCount: 0, cram: true };
}

/** 学习中：答错的卡片重新排队（至少间隔 gap 张，且不与相邻重复） */
export function requeue(queue: string[], id: string, gap = 3): string[] {
  const q = queue.filter((x) => x !== id);
  const pos = Math.min(q.length, gap + Math.floor(Math.random() * 3));
  q.splice(pos, 0, id);
  return q;
}

export function isNewCard(id: string) {
  const st = getState().cards[id];
  return !st || st.state === State.New;
}
