'use client';

import { ALL_CARDS, CARD_MAP, CHAPTER_MAP } from '@/data';
import { dueIds, newIds, newRemainingToday, weakIds, isLearned, getState, leechIds } from './store';

export type SessionMode = 'daily' | 'chapter' | 'weak' | 'flag' | 'custom' | 'cram' | 'leech';

export interface SessionPlan {
  mode: SessionMode;
  title: string;
  subtitle?: string;
  ids: string[];
  dueCount: number;
  newCount: number;
  chapter?: string;
  /** 巩固模式：不写入 FSRS，仅浏览与自测 */
  cram?: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 交错：避免同一章节连续出现太多 */
function interleave(ids: string[]): string[] {
  const buckets = new Map<string, string[]>();
  for (const id of ids) {
    const ch = CARD_MAP[id].ch;
    if (!buckets.has(ch)) buckets.set(ch, []);
    buckets.get(ch)!.push(id);
  }
  const lists = [...buckets.values()].map(shuffle);
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

/** 今日任务：到期复习（交错）+ 新卡（受每日上限约束） */
export function planDaily(now = new Date()): SessionPlan {
  const due = interleave(dueIds(now));
  const limit = newRemainingToday();
  const fresh = newIds().slice(0, limit);
  const ids: string[] = [];
  let di = 0;
  let ni = 0;
  while (di < due.length || ni < fresh.length) {
    for (let k = 0; k < 3 && di < due.length; k++) ids.push(due[di++]);
    if (ni < fresh.length) ids.push(fresh[ni++]);
  }
  return { mode: 'daily', title: '今日任务', subtitle: `${due.length} 张到期 · ${fresh.length} 张新卡`, ids, dueCount: due.length, newCount: fresh.length };
}

/** 章节学习：到期 → 新卡 → （可选）其余已学 */
export function planChapter(ch: string, includeAll: boolean, now = new Date()): SessionPlan {
  const chapterIds = ALL_CARDS.filter((c) => c.ch === ch).map((c) => c.id);
  const due = dueIds(now, [ch]);
  const fresh = newIds([ch]);
  const rest = includeAll ? chapterIds.filter((id) => !due.includes(id) && !fresh.includes(id)) : [];
  const ids = [...due, ...fresh, ...rest];
  return { mode: 'chapter', title: CHAPTER_MAP[ch]?.title ?? '章节学习', subtitle: includeAll ? '全章过一遍' : '到期与新卡', ids, dueCount: due.length, newCount: fresh.length, chapter: ch };
}

/** 薄弱突击 */
export function planWeak(limit = 20, now = new Date()): SessionPlan {
  const ids = weakIds(limit, now);
  return { mode: 'weak', title: '薄弱突击', subtitle: '可提取率最低的已学卡片', ids, dueCount: ids.length, newCount: 0 };
}

/** 顽固卡（lapses ≥ 4） */
export function planLeech(): SessionPlan {
  const ids = leechIds();
  return { mode: 'leech', title: '顽固卡专攻', subtitle: '遗忘 4 次以上，建议重写记忆锚点', ids, dueCount: ids.length, newCount: 0 };
}

/** 标记卡片 */
export function planFlags(): SessionPlan {
  const ids = getState().flags.filter((id) => CARD_MAP[id]);
  return { mode: 'flag', title: '标记复习', subtitle: '你标记过的卡片', ids, dueCount: ids.filter((id) => isLearned(id)).length, newCount: ids.filter((id) => !isLearned(id)).length };
}

/** 自定义（如只看某一小节） */
export function planCustom(title: string, ids: string[], cram = false): SessionPlan {
  return {
    mode: cram ? 'cram' : 'custom',
    title,
    subtitle: cram ? '巩固模式 · 不影响复习计划' : undefined,
    ids: cram ? shuffle(ids) : ids,
    dueCount: ids.filter((id) => isLearned(id)).length,
    newCount: ids.filter((id) => !isLearned(id)).length,
    cram,
  };
}

/** 考前速刷：按重要度随机抽取（巩固模式） */
export function planCram(count = 30, chapters?: string[]): SessionPlan {
  const en = new Set(chapters ?? getState().settings.chapters);
  const pool = ALL_CARDS.filter((c) => en.has(c.ch));
  const weighted = shuffle(pool)
    .sort((a, b) => b.s - a.s + (Math.random() - 0.5))
    .slice(0, count)
    .map((c) => c.id);
  return { mode: 'cram', title: '随机速刷', subtitle: '巩固模式 · 不影响复习计划', ids: shuffle(weighted), dueCount: 0, newCount: 0, cram: true };
}
