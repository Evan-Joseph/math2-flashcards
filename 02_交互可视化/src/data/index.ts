import type { Chapter, KCard } from './types';
import { pre } from './pre';
import { h1 } from './h1';
import { h2 } from './h2';
import { h3 } from './h3';
import { h4, h5, h6 } from './h456';
import { l1, l2, l3, l4, l5, l6 } from './la';

export const CHAPTERS: Chapter[] = [
  { id: 'pre', subject: 'pre', title: '预备知识', short: '预备', desc: '三角、不等式、数列、常见曲线', hue: 'stone' },
  { id: 'h1', subject: 'hs', title: '函数、极限、连续', short: '极限', desc: '等价无穷小、泰勒、间断点、闭区间性质', hue: 'sky' },
  { id: 'h2', subject: 'hs', title: '一元函数微分学', short: '微分', desc: '导数公式、中值定理、极值拐点、渐近线', hue: 'indigo' },
  { id: 'h3', subject: 'hs', title: '一元函数积分学', short: '积分', desc: '积分表、定积分技巧、反常积分、应用', hue: 'violet' },
  { id: 'h4', subject: 'hs', title: '多元函数微分学', short: '多元', desc: '偏导可微、链式法则、隐函数、极值', hue: 'fuchsia' },
  { id: 'h5', subject: 'hs', title: '二重积分', short: '二重', desc: '直角/极坐标、交换次序、对称性', hue: 'rose' },
  { id: 'h6', subject: 'hs', title: '常微分方程', short: '微方', desc: '一阶方程、可降阶、常系数线性方程', hue: 'orange' },
  { id: 'l1', subject: 'la', title: '行列式', short: '行列式', desc: '性质、展开、范德蒙德、抽象行列式', hue: 'amber' },
  { id: 'l2', subject: 'la', title: '矩阵', short: '矩阵', desc: '逆、伴随、初等变换、秩、分块', hue: 'lime' },
  { id: 'l3', subject: 'la', title: '向量', short: '向量', desc: '线性相关、极大无关组、施密特', hue: 'emerald' },
  { id: 'l4', subject: 'la', title: '线性方程组', short: '方程组', desc: '解的判定、解的结构、公共解同解', hue: 'teal' },
  { id: 'l5', subject: 'la', title: '特征值与特征向量', short: '特征值', desc: '性质、相似、对角化、实对称', hue: 'cyan' },
  { id: 'l6', subject: 'la', title: '二次型', short: '二次型', desc: '标准形、合同、惯性定理、正定', hue: 'blue' },
];

export const SUBJECTS: Record<string, { title: string; short: string }> = {
  pre: { title: '预备知识', short: '预备' },
  hs: { title: '高等数学', short: '高数' },
  la: { title: '线性代数', short: '线代' },
};

export const ALL_CARDS: KCard[] = [
  ...pre, ...h1, ...h2, ...h3, ...h4, ...h5, ...h6,
  ...l1, ...l2, ...l3, ...l4, ...l5, ...l6,
];

export const CARD_MAP: Record<string, KCard> = Object.fromEntries(ALL_CARDS.map((c) => [c.id, c]));

export const CHAPTER_MAP: Record<string, Chapter> = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));

export function cardsOf(ch: string): KCard[] {
  return ALL_CARDS.filter((c) => c.ch === ch);
}

/** 章节色（Tailwind v4 的颜色变量） */
export function hueVar(hue: string, shade = 500) {
  return `var(--color-${hue}-${shade})`;
}

export const KIND_LABEL: Record<string, string> = {
  qa: '问答',
  cloze: '填空',
  judge: '判断',
  steps: '步骤',
};
