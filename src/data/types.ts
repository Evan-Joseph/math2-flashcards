export type CardKind = 'qa' | 'cloze' | 'judge' | 'steps' | 'mcq';

/** 考试模式 */
export type Exam = 'm1' | 'm2';

/**
 * 知识范围：
 * - both：数学一、数学二共同大纲内容
 * - m1：仅数学一（数学二模式下不出现）
 */
export type Scope = 'both' | 'm1';

/**
 * 核验状态：
 * - ok：已由官方大纲、教材目录与真题交叉确认
 * - pending：待确认（2027 正式细目未发布前无法交叉确认），不进入默认复习队列
 * - ext：拓展（教辅常见但两份大纲均未列出），可检索，不进入默认复习队列
 */
export type Status = 'ok' | 'pending' | 'ext';

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
  /** 正面（cloze 时为含 ⟦⟧ 挖空的完整文本；mcq 时为题干） */
  q: string;
  /** 背面 / 解析（steps 时按换行分步；judge 时以 ✓ 或 ✗ 开头；mcq 时为解析） */
  a?: string;
  /** 选择题选项（仅 mcq） */
  opts?: string[];
  /** 选择题正确选项下标（仅 mcq） */
  ans?: number;
  /** 记忆锚点：帮助记住的口诀 / 直觉 / 推导线索（逐步提示时先于答案显示） */
  hook?: string;
  /** 易错点 / 反例 */
  trap?: string;
  /** 适用条件 / 前提（简短，独立展示） */
  cond?: string;
  /** 知识范围（缺省继承章节） */
  scope?: Scope;
  /** 核验状态（缺省 ok） */
  status?: Status;
  /** 前置知识：章节 ID 或卡片 ID */
  pre?: string[];
  /** 来源讲次 key（缺省按章节小节映射），见 sources.ts */
  src?: string;
  /** 相似 / 易混知识点（卡片 ID） */
  rel?: string[];
  /**
   * 知识点 ID：同一知识点的不同卡片（题型 / 表达 / 增补）共享同一 kid，
   * 统计唯一知识点数时按 kid 去重。缺省为卡片自身 id（由 knowledge.ts 聚合表补全）。
   */
  kid?: string;
}

export type Subject = 'pre' | 'hs' | 'la' | 'pr';

export interface Chapter {
  id: string;
  subject: Subject;
  title: string;
  short: string;
  desc: string;
  /** 章节主色（oklch 色相角） */
  hue: number;
  /** 大纲定位 */
  ref: string;
  /** 知识范围 */
  scope: Scope;
  /** 教材章级定位（同济 / 浙大） */
  book: string;
  /** 缺省来源讲次 key */
  src: string;
  /** 小节 → 来源讲次 key（覆盖缺省） */
  secSrc?: Record<string, string>;
  /** 前置章节 */
  pre?: string[];
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

/** 增补卡片：id 形如 h3-x01，与主卡片 id 空间隔离，保证历史进度不错位 */
export function defineExtra(ch: string, items: CardInput[]): KCard[] {
  return items.map((it, i) => ({
    ...it,
    id: `${ch}-x${String(i + 1).padStart(2, '0')}`,
    ch,
  }));
}

export const r = String.raw;
