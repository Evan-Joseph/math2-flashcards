/**
 * 来源登记。印刷页范围来自 docs/页码索引 中已核验的讲次级映射
 * （高数分册 pdf_page = print_page + 5；线代分册 +4；概率分册 +6）。
 * 同济 / 浙大教材仅登记到章级，页码未核验，不写具体页。
 */

export interface Book {
  id: string;
  title: string;
  edition: string;
  isbn?: string;
  /** pdf 页 = 印刷页 + offset */
  pdfOffset?: number;
}

export const BOOKS: Record<string, Book> = {
  gs: { id: 'gs', title: '张宇 考研数学基础 30 讲 · 高等数学分册', edition: '2027 版', isbn: '9787576358629', pdfOffset: 5 },
  xd: { id: 'xd', title: '张宇 考研数学基础 30 讲 · 线性代数分册', edition: '2027 版（ISBN 待确认）', pdfOffset: 4 },
  gl: { id: 'gl', title: '张宇 考研数学基础 30 讲 · 概率论与数理统计分册', edition: '2027 版（ISBN 待确认）', pdfOffset: 6 },
  tjgs: { id: 'tjgs', title: '同济大学《高等数学》', edition: '第七版（上、下册）' },
  tjxd: { id: 'tjxd', title: '同济大学《线性代数》', edition: '第六版' },
  zdgl: { id: 'zdgl', title: '浙江大学《概率论与数理统计》', edition: '第四版' },
};

export interface Lecture {
  key: string;
  book: string;
  title: string;
  /** 印刷页范围 [起, 止] */
  print: [number, number];
  /** 是否为数学一专属讲次 */
  m1Only?: boolean;
}

const L = (key: string, book: string, title: string, a: number, b: number, m1Only = false): Lecture => ({ key, book, title, print: [a, b], m1Only });

export const LECTURES: Record<string, Lecture> = Object.fromEntries(
  [
    L('gs1', 'gs', '第 1 讲 函数极限与连续', 1, 75),
    L('gs2', 'gs', '第 2 讲 数列极限', 76, 98),
    L('gs3', 'gs', '第 3 讲 一元函数微分学的概念', 99, 118),
    L('gs4', 'gs', '第 4 讲 一元函数微分学的计算', 119, 138),
    L('gs5', 'gs', '第 5 讲 一元函数微分学的应用（一）几何应用', 139, 163),
    L('gs6', 'gs', '第 6 讲 一元函数微分学的应用（二）中值定理、微分等式与不等式', 164, 185),
    L('gs7', 'gs', '第 7 讲 一元函数微分学的应用（三）物理应用与经济应用', 186, 194),
    L('gs8', 'gs', '第 8 讲 一元函数积分学的概念与性质', 195, 229),
    L('gs9', 'gs', '第 9 讲 一元函数积分学的计算', 230, 262),
    L('gs10', 'gs', '第 10 讲 一元函数积分学的应用（一）几何应用', 263, 281),
    L('gs11', 'gs', '第 11 讲 一元函数积分学的应用（二）积分等式与不等式', 282, 293),
    L('gs12', 'gs', '第 12 讲 一元函数积分学的应用（三）物理应用与经济应用', 294, 303),
    L('gs13', 'gs', '第 13 讲 多元函数微分学', 304, 337),
    L('gs14', 'gs', '第 14 讲 二重积分', 338, 376),
    L('gs15', 'gs', '第 15 讲 微分方程', 377, 408),
    L('gs16', 'gs', '第 16 讲 无穷级数（仅数学一、数学三）', 409, 463, true),
    L('gs17', 'gs', '第 17 讲 多元函数积分学的预备知识（仅数学一）', 464, 487, true),
    L('gs18', 'gs', '第 18 讲 多元函数积分学（仅数学一）', 488, 545, true),
    L('gsA2', 'gs', '附录 2 常用平面图形', 549, 551),
    L('gsA3', 'gs', '附录 3 常用空间图形', 552, 554),
    L('gsA4', 'gs', '附录 4 重要公式', 555, 557),
    L('xd0', 'xd', '第 0 讲 零基础', 1, 10),
    L('xd1', 'xd', '第 1 讲 行列式', 11, 44),
    L('xd2', 'xd', '第 2 讲 矩阵', 45, 81),
    L('xd3', 'xd', '第 3 讲 向量组', 82, 113),
    L('xd4', 'xd', '第 4 讲 线性方程组', 114, 138),
    L('xd5', 'xd', '第 5 讲 相似理论', 139, 177),
    L('xd6', 'xd', '第 6 讲 二次型', 178, 206),
    L('gl1', 'gl', '第 1 讲 随机事件与概率', 1, 32, true),
    L('gl2', 'gl', '第 2 讲 一维随机变量及其分布', 33, 61, true),
    L('gl3', 'gl', '第 3 讲 多维随机变量及其分布', 62, 102, true),
    L('gl4', 'gl', '第 4 讲 随机变量的数字特征', 103, 124, true),
    L('gl5', 'gl', '第 5 讲 大数定律与中心极限定理', 125, 132, true),
    L('gl6', 'gl', '第 6 讲 数理统计', 133, 163, true),
  ].map((l) => [l.key, l]),
);

export interface SourceRef {
  lecture: Lecture;
  book: Book;
  /** 印刷页范围文字 */
  pages: string;
  /** PDF 页范围文字 */
  pdf: string;
}

export function resolveSource(key: string): SourceRef | null {
  const lecture = LECTURES[key];
  if (!lecture) return null;
  const book = BOOKS[lecture.book];
  const [a, b] = lecture.print;
  const off = book.pdfOffset ?? 0;
  return { lecture, book, pages: `印刷页 ${a}–${b}`, pdf: `PDF 页 ${a + off}–${b + off}` };
}

/** 官方大纲入口（中国教育考试网 / 研招网） */
export const OFFICIAL = {
  neea: 'https://yankao.neea.edu.cn/xhtml1/category/1509/6235-1.htm',
  chsi: 'https://yz.chsi.com.cn/',
  note: '2027 年正式考试大纲发布前，范围以最近可核验的官方大纲（2026 版数学一 / 数学二）为基线；标为「待确认」的条目不进入默认复习队列。',
};
