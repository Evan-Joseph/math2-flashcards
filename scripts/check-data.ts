/**
 * 数据完整性 / 范围过滤 / 公式渲染检查。
 * 运行：npm run check:data
 */
import katex from 'katex';
import { ALL_CARDS, CHAPTERS, CHAPTER_MAP, cardsFor, studyableFor, chaptersFor, LECTURES, resolveSource } from '../src/data';
import type { KCard } from '../src/data/types';

let errors = 0;
const fail = (msg: string) => {
  errors++;
  console.error('✗', msg);
};

/* 1. ID 唯一、章节存在、来源可解析 */
const seen = new Set<string>();
for (const c of ALL_CARDS) {
  if (seen.has(c.id)) fail(`重复 ID ${c.id}`);
  seen.add(c.id);
  if (!CHAPTER_MAP[c.ch]) fail(`${c.id} 章节 ${c.ch} 不存在`);
  if (!c.src || !LECTURES[c.src]) fail(`${c.id} 来源 ${c.src} 无法解析`);
  else if (LECTURES[c.src].m1Only && c.scope !== 'm1') fail(`${c.id} 引用数一专属讲次 ${c.src} 但范围为 ${c.scope}`);
  if (!c.q.trim()) fail(`${c.id} 正面为空`);
  if (c.k === 'cloze' && !c.q.includes('⟦')) fail(`${c.id} 填空卡缺少挖空`);
  if (c.k === 'judge' && !(c.a?.startsWith('✓') || c.a?.startsWith('✗'))) fail(`${c.id} 判断卡答案需以 ✓/✗ 开头`);
  if (c.k === 'mcq' && (!c.opts || c.opts.length < 2 || c.ans == null || c.ans >= c.opts.length)) fail(`${c.id} 选择卡选项/答案不完整`);
  if ((c.k === 'qa' || c.k === 'steps') && !c.a) fail(`${c.id} 缺少答案`);
  for (const id of c.pre ?? []) if (!CHAPTER_MAP[id] && !seen.has(id) && !ALL_CARDS.some((x) => x.id === id)) fail(`${c.id} 前置 ${id} 不存在`);
  for (const id of c.rel ?? []) if (!ALL_CARDS.some((x) => x.id === id)) fail(`${c.id} 关联 ${id} 不存在`);
}

/* 2. 范围过滤 */
const m2 = cardsFor('m2');
const m1 = cardsFor('m1');
if (m2.some((c) => c.scope === 'm1')) fail('数学二模式包含数一专属卡片');
if (m1.length <= m2.length) fail('数学一卡片数应大于数学二');
for (const ch of chaptersFor('m2')) if (ch.scope === 'm1') fail(`数学二模式包含数一章节 ${ch.id}`);
const m1OnlyChapters = CHAPTERS.filter((c) => c.scope === 'm1');
for (const ch of m1OnlyChapters) for (const c of ALL_CARDS.filter((x) => x.ch === ch.id)) if (c.scope !== 'm1') fail(`${c.id} 位于数一章节但范围为 ${c.scope}`);
// 数二不得包含的关键词（出现在 both 范围卡片的正面）
const banned = ['曲面积分', '三重积分', '傅里叶', '幂级数', '方向导数', '斯托克斯', '高斯公式', '格林公式', '欧拉方程', '全微分方程', '随机变量', '数学期望'];
for (const c of m2) {
  for (const w of banned) if (c.q.includes(w) && c.scope !== 'm1') fail(`数二卡片 ${c.id} 正面含数一关键词「${w}」`);
}
/* 3. 待确认不进入默认队列 */
for (const c of studyableFor('m2').concat(studyableFor('m1'))) if (c.status === 'pending') fail(`${c.id} 待确认却进入默认队列`);

/* 4. KaTeX 渲染：所有 $…$ / $$…$$ 均须成功 */
const macros = { '\\R': '\\mathbb{R}', '\\d': '\\mathrm{d}' };
function texOf(s: string): string[] {
  const out: string[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) out.push((m[1] ?? m[2]).replace(/⟦/g, '{').replace(/⟧/g, '}'));
  return out;
}
let formulas = 0;
for (const c of ALL_CARDS) {
  const fields: (keyof KCard)[] = ['q', 'a', 'hook', 'trap', 'cond'];
  for (const f of fields) {
    const v = c[f];
    if (typeof v !== 'string') continue;
    const dollars = (v.match(/\$/g) ?? []).length;
    if (dollars % 2 !== 0) fail(`${c.id}.${f} 的 $ 未配对`);
    const opens = (v.match(/⟦/g) ?? []).length;
    const closes = (v.match(/⟧/g) ?? []).length;
    if (opens !== closes) fail(`${c.id}.${f} 挖空符号未配对`);
    for (const tex of texOf(v)) {
      formulas++;
      try {
        katex.renderToString(tex, { throwOnError: true, strict: 'ignore', trust: true, macros });
      } catch (e) {
        fail(`${c.id}.${f} 公式无法渲染: ${tex.slice(0, 60)} → ${(e as Error).message.slice(0, 80)}`);
      }
    }
  }
}

/* 5. 来源解析 */
for (const key of Object.keys(LECTURES)) if (!resolveSource(key)) fail(`来源 ${key} 无法解析`);

console.log(`卡片 ${ALL_CARDS.length}（数二 ${m2.length} / 数一 ${m1.length}），默认队列 数二 ${studyableFor('m2').length} / 数一 ${studyableFor('m1').length}，公式 ${formulas} 条`);
console.log(`待确认 ${ALL_CARDS.filter((c) => c.status === 'pending').length} 张，章节 ${CHAPTERS.length}（数二 ${chaptersFor('m2').length}）`);
if (errors) {
  console.error(`共 ${errors} 处问题`);
  process.exit(1);
}
console.log('✓ 数据检查通过');
