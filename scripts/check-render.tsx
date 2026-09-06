/**
 * 渲染检查：npx tsx scripts/check-render.tsx
 * - 填空 hide 模式不泄露答案、show 模式无空格、逐空揭示计数正确
 * - 全部卡片正反面可渲染（无异常）
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { MathText, countCloze } from '../src/lib/math';
import { ALL_CARDS } from '../src/data';
import { CardBody } from '../src/components/CardSheet';

const fail: string[] = [];
const ok = (c: unknown, m: string) => {
  if (!c) fail.push(m);
};

const clozes = ALL_CARDS.filter((c) => c.k === 'cloze');
for (const c of clozes) {
  const n = countCloze(c.q);
  const hide = renderToStaticMarkup(<MathText text={c.q} mode="hide" reveal={0} />);
  const show = renderToStaticMarkup(<MathText text={c.q} mode="show" />);
  const blanks = (hide.match(/data-ci="/g) ?? []).length;
  ok(blanks === n, `${c.id}: hide 模式空格数 ${blanks} ≠ ${n}`);
  ok(!/cloze-answer|kanswer/.test(hide), `${c.id}: hide 模式泄露答案`);
  ok(!/cloze-blank|kcloze/.test(show), `${c.id}: show 模式仍有空格`);
  if (n >= 2) {
    const part = renderToStaticMarkup(<MathText text={c.q} mode="hide" reveal={1} />);
    const shownN = (part.match(/cloze-answer|kanswer/g) ?? []).length;
    const blankN = (part.match(/cloze-blank|kcloze/g) ?? []).length;
    ok(shownN === 1 && blankN === n - 1, `${c.id}: 揭示 1 个后 显示 ${shownN} / 空 ${blankN}（应 1 / ${n - 1}）`);
  }
  ok(!hide.includes('⟦') && !show.includes('⟦'), `${c.id}: 输出含挖空符`);
}

let rendered = 0;
for (const c of ALL_CARDS) {
  try {
    const html = renderToStaticMarkup(<CardBody card={c} />);
    ok(!html.includes('katex-error'), `${c.id}: 含 katex-error`);
    ok(!/[⟦⟧]/.test(html), `${c.id}: 详情渲染含挖空符`);
    if (c.k === 'steps') ok(html.includes('step-line'), `${c.id}: 步骤卡无编号行`);
    rendered++;
  } catch (e) {
    fail.push(`${c.id}: 渲染异常 ${(e as Error).message}`);
  }
}

console.log(`填空卡 ${clozes.length} · 全部卡片渲染 ${rendered}`);
if (fail.length) {
  console.error(`${fail.length} 个问题：`);
  for (const f of fail.slice(0, 40)) console.error(' -', f);
  process.exit(1);
}
console.log('渲染检查通过');
