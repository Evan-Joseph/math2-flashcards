/**
 * 数据检查：npx tsx scripts/check-data.ts
 * - 全部公式 KaTeX 严格渲染（throwOnError）
 * - 数二队列不含仅数一内容；数一专属讲次只被数一卡引用
 * - 待确认 / 拓展不进默认队列
 * - 知识点聚合表 id 有效、组内章节一致
 * - 挖空 / 判断 / 选择卡结构合法
 */
import katex from 'katex';
import { ALL_CARDS, CHAPTER_MAP, studyableFor, cardsFor, countKnowledge, KNOWLEDGE_GROUPS, LECTURES, sourceOf } from '../src/data';

const CLOZE_RE = /⟦([\s\S]*?)⟧/g;
const errors: string[] = [];
let formulas = 0;

function tokens(src: string): { tex: string; display: boolean }[] {
  const out: { tex: string; display: boolean }[] = [];
  let i = 0;
  while (i < src.length) {
    if (src[i] === '$') {
      const display = src[i + 1] === '$';
      const d = display ? '$$' : '$';
      const start = i + d.length;
      const end = src.indexOf(d, start);
      if (end === -1) {
        i++;
        continue;
      }
      out.push({ tex: src.slice(start, end), display });
      i = end + d.length;
    } else i++;
  }
  return out;
}

for (const c of ALL_CARDS) {
  const fields = [c.q, c.a, c.hook, c.trap, c.cond, ...(c.opts ?? [])].filter(Boolean) as string[];
  for (const f of fields) {
    // 挖空必须成对
    const open = (f.match(/⟦/g) ?? []).length;
    const close = (f.match(/⟧/g) ?? []).length;
    if (open !== close) errors.push(`${c.id}: 挖空符不成对`);
    for (const t of tokens(f)) {
      formulas++;
      try {
        katex.renderToString(t.tex.replace(CLOZE_RE, (_, inner) => `{${inner}}`), { displayMode: t.display, throwOnError: true, strict: 'ignore', trust: true, macros: { '\\R': '\\mathbb{R}', '\\N': '\\mathbb{N}', '\\d': '\\mathrm{d}' } });
      } catch (e) {
        errors.push(`${c.id}: KaTeX 错误 ${(e as Error).message.slice(0, 80)} ← ${t.tex.slice(0, 60)}`);
      }
    }
  }
  if (c.k === 'cloze' && !c.q.includes('⟦')) errors.push(`${c.id}: 填空卡没有挖空`);
  if (c.k !== 'cloze' && c.q.includes('⟦')) errors.push(`${c.id}: 非填空卡含挖空符`);
  if (c.k === 'judge' && !/^\s*[✓✗]/.test(c.a ?? '')) errors.push(`${c.id}: 判断卡答案须以 ✓/✗ 开头`);
  if (c.k === 'mcq' && (!c.opts || c.ans == null || c.ans >= c.opts.length)) errors.push(`${c.id}: 选择卡选项 / 答案缺失`);
  if (c.k === 'steps' && !(c.a ?? '').split('\n').some((l) => /^\s*\d+\.\s/.test(l))) errors.push(`${c.id}: 步骤卡缺少编号步骤`);
  if ((c.k === 'qa' || c.k === 'steps') && !c.a) errors.push(`${c.id}: 缺少答案`);
  if (!CHAPTER_MAP[c.ch]) errors.push(`${c.id}: 未知章节 ${c.ch}`);
  // 数一专属讲次只被数一卡引用
  const src = sourceOf(c);
  if (src?.lecture.m1Only && c.scope !== 'm1') errors.push(`${c.id}: 引用数一专属讲次 ${src.lecture.key} 但 scope=${c.scope}`);
  // 数一专属章节的卡必须是 m1
  if (CHAPTER_MAP[c.ch]?.scope === 'm1' && c.scope !== 'm1') errors.push(`${c.id}: 数一章节内卡片 scope 不是 m1`);
}

// 过滤
const m2 = studyableFor('m2');
const m1 = studyableFor('m1');
if (m2.some((c) => c.scope === 'm1')) errors.push('数二队列包含仅数一卡片');
if (m2.some((c) => c.status !== 'ok') || m1.some((c) => c.status !== 'ok')) errors.push('默认队列包含待确认 / 拓展卡片');
const BLACKLIST_M2 = [/伯努利/, /全微分方程/, /欧拉方程/, /方向导数/, /梯度/, /三重积分/, /曲线积分/, /曲面积分/, /格林公式/, /高斯公式/, /斯托克斯/, /傅里叶/, /幂级数/, /随机变量/, /概率/, /偏微分方程/];
for (const c of m2) {
  const text = `${c.q}\n${c.a ?? ''}`;
  for (const re of BLACKLIST_M2) {
    if (re.test(text) && !/数学一|数一|仅数一|不涉及/.test(`${text}${c.hook ?? ''}${c.cond ?? ''}`)) {
      // 允许在 trap/hook 中提及「数一才考」，但正文出现则报错
      if (re.test(c.q)) errors.push(`${c.id}: 数二队列卡片正文含数一关键词 ${re}`);
    }
  }
}

// 知识点聚合
for (const [kid, ids] of Object.entries(KNOWLEDGE_GROUPS)) {
  const cards = ids.map((id) => ALL_CARDS.find((c) => c.id === id));
  if (cards.some((c) => !c)) errors.push(`知识点 ${kid}: 含未知卡片 id`);
  const chs = new Set(cards.filter(Boolean).map((c) => CHAPTER_MAP[c!.ch].subject).filter((s) => s !== 'pre'));
  if (chs.size > 1) errors.push(`知识点 ${kid}: 跨学科聚合`);
  if (ids.length < 2) errors.push(`知识点 ${kid}: 组内少于 2 张卡`);
  const scopes = new Set(cards.filter(Boolean).map((c) => c!.scope));
  if (scopes.size > 1) errors.push(`知识点 ${kid}: 组内 scope 不一致`);
}
const seen = new Set<string>();
for (const ids of Object.values(KNOWLEDGE_GROUPS)) for (const id of ids) {
  if (seen.has(id)) errors.push(`卡片 ${id} 出现在多个知识点组`);
  seen.add(id);
}

// 讲次页码单调
for (const l of Object.values(LECTURES)) if (l.print[0] > l.print[1]) errors.push(`讲次 ${l.key} 页码区间无效`);

console.log(`卡片 ${ALL_CARDS.length} · 公式 ${formulas}`);
console.log(`数二：可学 ${m2.length} 张 / ${countKnowledge(m2)} 个知识点 / 可检索 ${cardsFor('m2').length}`);
console.log(`数一：可学 ${m1.length} 张 / ${countKnowledge(m1)} 个知识点 / 可检索 ${cardsFor('m1').length}`);
console.log(`知识点组 ${Object.keys(KNOWLEDGE_GROUPS).length}`);
if (errors.length) {
  console.error(`\n${errors.length} 个问题：`);
  for (const e of errors) console.error(' -', e);
  process.exit(1);
}
console.log('数据检查通过');
