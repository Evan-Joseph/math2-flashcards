import type { Chapter, KCard, Subject } from './types';
import { pre } from './pre';
import { h1 } from './h1';
import { h2 } from './h2';
import { h3 } from './h3';
import { h4, h5, h6 } from './h456';
import { l1, l2, l3, l4, l5, l6 } from './la';
import { EXTRA_CARDS } from './extra';

export const CHAPTERS: Chapter[] = [
  { id: 'pre', subject: 'pre', title: '预备知识', short: '预备', desc: '三角、不等式、数列、常见曲线', hue: 60, ref: '基础 30 讲 · 高数第 0 讲' },
  { id: 'h1', subject: 'hs', title: '函数、极限、连续', short: '极限', desc: '等价无穷小、泰勒、间断点、闭区间性质', hue: 230, ref: '大纲高数一 · 第 1–3 讲' },
  { id: 'h2', subject: 'hs', title: '一元函数微分学', short: '微分', desc: '导数公式、中值定理、极值拐点、曲率', hue: 265, ref: '大纲高数二 · 第 4–7 讲' },
  { id: 'h3', subject: 'hs', title: '一元函数积分学', short: '积分', desc: '积分表、定积分技巧、反常积分、几何与物理应用', hue: 295, ref: '大纲高数三 · 第 8–11 讲' },
  { id: 'h4', subject: 'hs', title: '多元函数微分学', short: '多元', desc: '偏导可微、链式法则、隐函数、极值', hue: 330, ref: '大纲高数四 · 第 12 讲' },
  { id: 'h5', subject: 'hs', title: '二重积分', short: '二重', desc: '直角/极坐标、交换次序、对称性', hue: 10, ref: '大纲高数五 · 第 13 讲' },
  { id: 'h6', subject: 'hs', title: '常微分方程', short: '微方', desc: '一阶方程、可降阶、常系数线性方程', hue: 40, ref: '大纲高数六 · 第 14–15 讲' },
  { id: 'l1', subject: 'la', title: '行列式', short: '行列式', desc: '性质、展开、范德蒙德、抽象行列式', hue: 85, ref: '大纲线代一 · 线代第 1 讲' },
  { id: 'l2', subject: 'la', title: '矩阵', short: '矩阵', desc: '逆、伴随、初等变换、秩、分块', hue: 120, ref: '大纲线代二 · 线代第 2 讲' },
  { id: 'l3', subject: 'la', title: '向量', short: '向量', desc: '线性相关、极大无关组、施密特', hue: 155, ref: '大纲线代三 · 线代第 3 讲' },
  { id: 'l4', subject: 'la', title: '线性方程组', short: '方程组', desc: '解的判定、解的结构、公共解同解', hue: 180, ref: '大纲线代四 · 线代第 4 讲' },
  { id: 'l5', subject: 'la', title: '特征值与特征向量', short: '特征值', desc: '性质、相似、对角化、实对称', hue: 205, ref: '大纲线代五 · 线代第 5 讲' },
  { id: 'l6', subject: 'la', title: '二次型', short: '二次型', desc: '标准形、合同、惯性定理、正定', hue: 250, ref: '大纲线代六 · 线代第 6 讲' },
];

export const SUBJECTS: Record<Subject, { title: string; short: string }> = {
  pre: { title: '预备知识', short: '预备' },
  hs: { title: '高等数学', short: '高数' },
  la: { title: '线性代数', short: '线代' },
};

export const SUBJECT_ORDER: Subject[] = ['pre', 'hs', 'la'];

const BASE: KCard[] = [...pre, ...h1, ...h2, ...h3, ...h4, ...h5, ...h6, ...l1, ...l2, ...l3, ...l4, ...l5, ...l6, ...EXTRA_CARDS];

/** 按章节顺序排列（增补卡片紧跟在所属章节主卡片之后） */
const order = new Map(CHAPTERS.map((c, i) => [c.id, i]));
export const ALL_CARDS: KCard[] = BASE.slice().sort((a, b) => (order.get(a.ch) ?? 0) - (order.get(b.ch) ?? 0));

export const CARD_MAP: Record<string, KCard> = Object.fromEntries(ALL_CARDS.map((c) => [c.id, c]));
export const CHAPTER_MAP: Record<string, Chapter> = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));

export function cardsOf(ch: string): KCard[] {
  return ALL_CARDS.filter((c) => c.ch === ch);
}

export function sectionsOf(ch: string): { sec: string; cards: KCard[] }[] {
  const map = new Map<string, KCard[]>();
  for (const c of cardsOf(ch)) {
    if (!map.has(c.sec)) map.set(c.sec, []);
    map.get(c.sec)!.push(c);
  }
  return [...map.entries()].map(([sec, cards]) => ({ sec, cards }));
}

export const KIND_LABEL: Record<string, string> = {
  qa: '问答',
  cloze: '填空',
  judge: '判断',
  steps: '步骤',
};

export const IMPORTANCE_LABEL: Record<number, string> = {
  3: '必背',
  2: '重点',
  1: '了解',
};

/** 章节主色（oklch） */
export function chapterColor(ch: string, l = 0.62, c = 0.16) {
  const hue = CHAPTER_MAP[ch]?.hue ?? 230;
  return `oklch(${l} ${c} ${hue})`;
}
