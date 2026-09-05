import { ALL_CARDS, CARD_MAP } from '../data';
import { dueIds, newIds, newRemainingToday, weakIds, isLearned, getState } from './store';

export type SessionMode = 'daily' | 'chapter' | 'weak' | 'flag' | 'custom';

export interface SessionPlan {
  mode: SessionMode;
  title: string;
  ids: string[];
  dueCount: number;
  newCount: number;
  chapter?: string;
}

function seededShuffle<T>(arr: T[]): T[] {
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
  const lists = [...buckets.values()].map(seededShuffle);
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

/** 今日任务：到期复习（交错）+ 新卡（按章节顺序，受每日上限约束） */
export function planDaily(now = new Date()): SessionPlan {
  const due = interleave(dueIds(now));
  const limit = newRemainingToday();
  const fresh = newIds().slice(0, limit);
  // 新卡穿插进复习中：每 3 张复习后放 1 张新卡，避免连续大量新知识
  const ids: string[] = [];
  let di = 0;
  let ni = 0;
  while (di < due.length || ni < fresh.length) {
    for (let k = 0; k < 3 && di < due.length; k++) ids.push(due[di++]);
    if (ni < fresh.length) ids.push(fresh[ni++]);
  }
  return { mode: 'daily', title: '今日任务', ids, dueCount: due.length, newCount: fresh.length };
}

/** 章节学习：到期 → 新卡 → （可选）其余已学 */
export function planChapter(ch: string, includeAll: boolean, now = new Date()): SessionPlan {
  const chapterIds = ALL_CARDS.filter((c) => c.ch === ch).map((c) => c.id);
  const due = dueIds(now, [ch]);
  const fresh = newIds([ch]);
  const rest = includeAll ? chapterIds.filter((id) => !due.includes(id) && !fresh.includes(id)) : [];
  const ids = [...due, ...fresh, ...rest];
  return { mode: 'chapter', title: '章节学习', ids, dueCount: due.length, newCount: fresh.length, chapter: ch };
}

/** 薄弱突击 */
export function planWeak(limit = 20, now = new Date()): SessionPlan {
  const ids = weakIds(limit, now);
  return { mode: 'weak', title: '薄弱突击', ids, dueCount: ids.length, newCount: 0 };
}

/** 标记卡片 */
export function planFlags(): SessionPlan {
  const ids = getState().flags.filter((id) => CARD_MAP[id]);
  return { mode: 'flag', title: '标记复习', ids, dueCount: ids.filter(isLearned).length, newCount: ids.filter((id) => !isLearned(id)).length };
}

/** 自定义（如从清单点进来只看某一小节） */
export function planCustom(title: string, ids: string[]): SessionPlan {
  return { mode: 'custom', title, ids, dueCount: ids.filter(isLearned).length, newCount: ids.filter((id) => !isLearned(id)).length };
}
