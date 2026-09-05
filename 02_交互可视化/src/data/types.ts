export type CardKind = 'qa' | 'cloze' | 'judge' | 'steps';

export interface KCard {
  /** 稳定 ID，如 h1-03 */
  id: string;
  /** 章节 ID */
  ch: string;
  /** 小节名 */
  sec: string;
  /** 卡片类型 */
  k: CardKind;
  /** 重要度 1-3 */
  s: 1 | 2 | 3;
  /** 正面（cloze 时为含 ⟦⟧ 挖空的完整文本） */
  q: string;
  /** 背面 / 解析（steps 时按换行分步；judge 时以 ✓ 或 ✗ 开头） */
  a?: string;
  /** 记忆锚点：帮助记住的口诀 / 直觉 / 推导线索 */
  hook?: string;
  /** 易错点 */
  trap?: string;
}

export type Subject = 'pre' | 'hs' | 'la';

export interface Chapter {
  id: string;
  subject: Subject;
  title: string;
  short: string;
  desc: string;
  /** Tailwind 颜色基名，用于章节色 */
  hue: string;
}

/** 输入卡片（无 id / ch），由 defineChapter 自动补全 */
export type CardInput = Omit<KCard, 'id' | 'ch'>;

export function defineChapter(ch: string, items: CardInput[]): KCard[] {
  return items.map((it, i) => ({
    ...it,
    id: `${ch}-${String(i + 1).padStart(2, '0')}`,
    ch,
  }));
}

export const r = String.raw;
