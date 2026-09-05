import type { Chapter, Exam, KCard, Scope, Subject } from './types';
import { pre } from './pre';
import { h1 } from './h1';
import { h2 } from './h2';
import { h3 } from './h3';
import { h4, h5, h6 } from './h456';
import { l1, l2, l3, l4, l5, l6 } from './la';
import { EXTRA_CARDS } from './extra';
import { M1_HS_CARDS } from './m1-hs';
import { M1_PR_CARDS } from './m1-pr';
import { resolveSource, type SourceRef } from './sources';

export { resolveSource, BOOKS, LECTURES, OFFICIAL } from './sources';
export type { SourceRef } from './sources';
export type { Chapter, Exam, KCard, Scope, Subject, CardKind, Status } from './types';

export const CHAPTERS: Chapter[] = [
  { id: 'pre', subject: 'pre', title: '预备知识', short: '预备', desc: '三角、不等式、数列、常见曲线', hue: 60, ref: '高中衔接 · 30 讲第 1 讲前置', scope: 'both', book: '同济《高等数学》第七版 第一章 §1', src: 'gs1', secSrc: { 常见曲线: 'gsA2', 几何公式: 'gsA2' } },
  { id: 'h1', subject: 'hs', title: '函数、极限、连续', short: '极限', desc: '等价无穷小、泰勒、间断点、闭区间性质', hue: 230, ref: '大纲高数一', scope: 'both', book: '同济《高等数学》第七版 第一章', src: 'gs1', secSrc: { 数列极限: 'gs2', 极限存在准则: 'gs2' }, pre: ['pre'] },
  { id: 'h2', subject: 'hs', title: '一元函数微分学', short: '微分', desc: '导数公式、中值定理、极值拐点、曲率', hue: 265, ref: '大纲高数二', scope: 'both', book: '同济《高等数学》第七版 第二、三章', src: 'gs4', secSrc: { 导数定义: 'gs3', 微分: 'gs3', 中值定理: 'gs6', 泰勒公式: 'gs6', 导数应用: 'gs5', 单调与极值: 'gs5', 凹凸与拐点: 'gs5', 渐近线: 'gs5', 曲率: 'gs5', 切线与法线: 'gs5', 洛必达法则: 'gs1' }, pre: ['h1'] },
  { id: 'h3', subject: 'hs', title: '一元函数积分学', short: '积分', desc: '积分表、定积分技巧、反常积分、几何与物理应用', hue: 295, ref: '大纲高数三', scope: 'both', book: '同济《高等数学》第七版 第四、五、六章', src: 'gs9', secSrc: { 原函数: 'gs8', 定积分概念: 'gs8', 定积分性质: 'gs8', 变限积分: 'gs8', 反常积分: 'gs8', 定积分应用: 'gs10' }, pre: ['h2'] },
  { id: 'h4', subject: 'hs', title: '多元函数微分学', short: '多元', desc: '偏导可微、链式法则、隐函数、极值；数一含方向导数与几何应用', hue: 330, ref: '大纲高数四（数一：高数四 · 数二：高数四）', scope: 'both', book: '同济《高等数学》第七版 第九章', src: 'gs13', pre: ['h2'] },
  { id: 'h5', subject: 'hs', title: '二重积分', short: '二重', desc: '直角/极坐标、交换次序、对称性', hue: 10, ref: '大纲高数五（数二） / 高数五（数一）', scope: 'both', book: '同济《高等数学》第七版 第十章 §1–2', src: 'gs14', pre: ['h3', 'h4'] },
  { id: 'h6', subject: 'hs', title: '常微分方程', short: '微方', desc: '一阶方程、可降阶、常系数线性方程；数一含全微分方程、欧拉方程', hue: 40, ref: '大纲高数六（数二） / 高数七（数一）', scope: 'both', book: '同济《高等数学》第七版 第七章', src: 'gs15', pre: ['h3'] },
  { id: 'g', subject: 'hs', title: '向量代数与空间解析几何', short: '空间几何', desc: '向量运算、平面与直线、二次曲面、投影', hue: 195, ref: '大纲高数三（数一）', scope: 'm1', book: '同济《高等数学》第七版 第八章', src: 'gs17', pre: ['pre'] },
  { id: 'h7', subject: 'hs', title: '三重积分', short: '三重', desc: '投影法、截面法、柱坐标、球坐标、对称性', hue: 350, ref: '大纲高数五（数一）', scope: 'm1', book: '同济《高等数学》第七版 第十章 §3–4', src: 'gs18', pre: ['h5', 'g'] },
  { id: 'h8', subject: 'hs', title: '曲线积分与曲面积分', short: '曲线曲面', desc: '两类曲线/曲面积分、格林、高斯、斯托克斯', hue: 20, ref: '大纲高数五（数一）', scope: 'm1', book: '同济《高等数学》第七版 第十一章', src: 'gs18', pre: ['h5', 'h7'] },
  { id: 'h9', subject: 'hs', title: '无穷级数', short: '级数', desc: '正项级数、交错级数、幂级数、傅里叶级数', hue: 100, ref: '大纲高数六（数一）', scope: 'm1', book: '同济《高等数学》第七版 第十二章', src: 'gs16', pre: ['h1', 'h3'] },
  { id: 'l1', subject: 'la', title: '行列式', short: '行列式', desc: '性质、展开、范德蒙德、抽象行列式', hue: 85, ref: '大纲线代一', scope: 'both', book: '同济《线性代数》第六版 第一章', src: 'xd1' },
  { id: 'l2', subject: 'la', title: '矩阵', short: '矩阵', desc: '逆、伴随、初等变换、秩、分块', hue: 120, ref: '大纲线代二', scope: 'both', book: '同济《线性代数》第六版 第二、三章', src: 'xd2', pre: ['l1'] },
  { id: 'l3', subject: 'la', title: '向量', short: '向量', desc: '线性相关、极大无关组、施密特', hue: 155, ref: '大纲线代三', scope: 'both', book: '同济《线性代数》第六版 第四章', src: 'xd3', pre: ['l2'] },
  { id: 'l4', subject: 'la', title: '线性方程组', short: '方程组', desc: '解的判定、解的结构、公共解同解', hue: 180, ref: '大纲线代四', scope: 'both', book: '同济《线性代数》第六版 第三、四章', src: 'xd4', pre: ['l3'] },
  { id: 'l5', subject: 'la', title: '特征值与特征向量', short: '特征值', desc: '性质、相似、对角化、实对称', hue: 205, ref: '大纲线代五', scope: 'both', book: '同济《线性代数》第六版 第五章', src: 'xd5', pre: ['l4'] },
  { id: 'l6', subject: 'la', title: '二次型', short: '二次型', desc: '标准形、合同、惯性定理、正定', hue: 250, ref: '大纲线代六', scope: 'both', book: '同济《线性代数》第六版 第五章', src: 'xd6', pre: ['l5'] },
  { id: 'p1', subject: 'pr', title: '随机事件与概率', short: '事件', desc: '事件运算、条件概率、全概率与贝叶斯、独立性', hue: 300, ref: '大纲概率一（数一）', scope: 'm1', book: '浙大《概率论与数理统计》第四版 第一章', src: 'gl1' },
  { id: 'p2', subject: 'pr', title: '随机变量及其分布', short: '一维分布', desc: '分布函数、常见分布、随机变量函数的分布', hue: 315, ref: '大纲概率二（数一）', scope: 'm1', book: '浙大《概率论与数理统计》第四版 第二章', src: 'gl2', pre: ['p1'] },
  { id: 'p3', subject: 'pr', title: '多维随机变量及其分布', short: '多维分布', desc: '联合/边缘/条件分布、独立性、函数的分布', hue: 330, ref: '大纲概率三（数一）', scope: 'm1', book: '浙大《概率论与数理统计》第四版 第三章', src: 'gl3', pre: ['p2', 'h5'] },
  { id: 'p4', subject: 'pr', title: '数字特征', short: '数字特征', desc: '期望、方差、协方差、相关系数', hue: 345, ref: '大纲概率四（数一）', scope: 'm1', book: '浙大《概率论与数理统计》第四版 第四章', src: 'gl4', pre: ['p3'] },
  { id: 'p5', subject: 'pr', title: '大数定律与中心极限定理', short: '极限定理', desc: '切比雪夫不等式、三大数定律、中心极限定理', hue: 5, ref: '大纲概率五（数一）', scope: 'm1', book: '浙大《概率论与数理统计》第四版 第五章', src: 'gl5', pre: ['p4'] },
  { id: 'p6', subject: 'pr', title: '数理统计', short: '统计', desc: '统计量、三大分布、参数估计、假设检验', hue: 25, ref: '大纲概率六–八（数一）', scope: 'm1', book: '浙大《概率论与数理统计》第四版 第六、七、八章', src: 'gl6', pre: ['p4', 'p5'] },
];

export const SUBJECTS: Record<Subject, { title: string; short: string }> = {
  pre: { title: '预备知识', short: '预备' },
  hs: { title: '高等数学', short: '高数' },
  la: { title: '线性代数', short: '线代' },
  pr: { title: '概率论与数理统计', short: '概率' },
};

export const SUBJECT_ORDER: Subject[] = ['pre', 'hs', 'la', 'pr'];

export const EXAMS: Record<Exam, { title: string; short: string; code: string; desc: string }> = {
  m2: { title: '数学二', short: '数二', code: '302', desc: '高等数学约 80%，线性代数约 20%' },
  m1: { title: '数学一', short: '数一', code: '301', desc: '高等数学约 56%，线性代数约 22%，概率统计约 22%' },
};

const BASE: KCard[] = [...pre, ...h1, ...h2, ...h3, ...h4, ...h5, ...h6, ...l1, ...l2, ...l3, ...l4, ...l5, ...l6, ...EXTRA_CARDS, ...M1_HS_CARDS, ...M1_PR_CARDS];

export const CHAPTER_MAP: Record<string, Chapter> = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));

/** 按章节顺序排列（增补卡片紧跟在所属章节主卡片之后），并补全继承字段 */
const order = new Map(CHAPTERS.map((c, i) => [c.id, i]));
export const ALL_CARDS: KCard[] = BASE.map((c) => {
  const ch = CHAPTER_MAP[c.ch];
  return {
    ...c,
    scope: c.scope ?? ch.scope,
    status: c.status ?? 'ok',
    src: c.src ?? ch.secSrc?.[c.sec] ?? ch.src,
  };
}).sort((a, b) => (order.get(a.ch) ?? 0) - (order.get(b.ch) ?? 0));

export const CARD_MAP: Record<string, KCard> = Object.fromEntries(ALL_CARDS.map((c) => [c.id, c]));

/* ------------------------------------------------------------------ */
/* 考试模式过滤                                                        */
/* ------------------------------------------------------------------ */

export function scopeAllows(scope: Scope | undefined, exam: Exam): boolean {
  return exam === 'm1' || scope !== 'm1';
}

export function chapterInExam(ch: Chapter, exam: Exam) {
  return scopeAllows(ch.scope, exam);
}

export function cardInExam(card: KCard, exam: Exam) {
  return scopeAllows(card.scope, exam);
}

/** 当前考试模式下的章节 */
export function chaptersFor(exam: Exam): Chapter[] {
  return CHAPTERS.filter((c) => chapterInExam(c, exam));
}

/** 当前考试模式下的全部卡片（含待确认） */
export function cardsFor(exam: Exam): KCard[] {
  return ALL_CARDS.filter((c) => cardInExam(c, exam));
}

/** 进入默认学习/复习队列的卡片：范围内且已核验 */
export function studyableFor(exam: Exam): KCard[] {
  return ALL_CARDS.filter((c) => cardInExam(c, exam) && c.status !== 'pending');
}

export function cardsOf(ch: string, exam?: Exam): KCard[] {
  return ALL_CARDS.filter((c) => c.ch === ch && (!exam || cardInExam(c, exam)));
}

export function sectionsOf(ch: string, exam?: Exam): { sec: string; cards: KCard[] }[] {
  const map = new Map<string, KCard[]>();
  for (const c of cardsOf(ch, exam)) {
    if (!map.has(c.sec)) map.set(c.sec, []);
    map.get(c.sec)!.push(c);
  }
  return [...map.entries()].map(([sec, cards]) => ({ sec, cards }));
}

export function sourceOf(card: KCard): SourceRef | null {
  return card.src ? resolveSource(card.src) : null;
}

/** 前置知识：卡片自身声明 + 章节前置 */
export function prerequisitesOf(card: KCard): { chapters: Chapter[]; cards: KCard[] } {
  const chapters: Chapter[] = [];
  const cards: KCard[] = [];
  for (const id of card.pre ?? []) {
    if (CHAPTER_MAP[id]) chapters.push(CHAPTER_MAP[id]);
    else if (CARD_MAP[id]) cards.push(CARD_MAP[id]);
  }
  for (const id of CHAPTER_MAP[card.ch]?.pre ?? []) {
    if (CHAPTER_MAP[id] && !chapters.includes(CHAPTER_MAP[id])) chapters.push(CHAPTER_MAP[id]);
  }
  return { chapters, cards };
}

/** 相似 / 易混知识点：显式声明 + 同小节其他卡片 */
export function relatedOf(card: KCard, exam: Exam, limit = 4): KCard[] {
  const out: KCard[] = [];
  for (const id of card.rel ?? []) {
    const c = CARD_MAP[id];
    if (c && cardInExam(c, exam)) out.push(c);
  }
  for (const c of ALL_CARDS) {
    if (out.length >= limit) break;
    if (c.id !== card.id && c.ch === card.ch && c.sec === card.sec && cardInExam(c, exam) && !out.includes(c)) out.push(c);
  }
  return out.slice(0, limit);
}

export const KIND_LABEL: Record<string, string> = {
  qa: '问答',
  cloze: '填空',
  judge: '判断',
  steps: '步骤',
  mcq: '选择',
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
