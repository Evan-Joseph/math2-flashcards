/**
 * 渲染回归检查：挖空三种模式互斥、逐空揭示、表格 / 步骤 / 块级公式结构、全部卡片可无异常渲染。
 * 运行：npm run check:render
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MathText } from '../src/lib/math';
import { ALL_CARDS } from '../src/data';

let errors = 0;
const fail = (m: string) => {
  errors++;
  console.error('✗', m);
};
const html = (el: React.ReactElement) => renderToStaticMarkup(el);

const cloze = String.raw`数列极限：$\forall\varepsilon>0$，$⟦\exists N⟧$，当 ⟦$n>N$⟧ 时 $|x_n-a|<\varepsilon$`;
const hide = html(<MathText text={cloze} mode="hide" />);
const show = html(<MathText text={cloze} mode="show" />);
const plain = html(<MathText text={cloze} mode="plain" />);
if (!(hide.includes('kcloze') && hide.includes('cloze-blank'))) fail('hide 模式应显示空格');
if (hide.includes('kanswer') || hide.includes('cloze-answer')) fail('hide 模式不得出现答案样式（正反重叠）');
if (!(show.includes('kanswer') && show.includes('cloze-answer'))) fail('show 模式应高亮答案');
if (show.includes('kcloze') || show.includes('cloze-blank')) fail('show 模式不得残留空格');
if (plain.includes('kcloze') || plain.includes('kanswer') || plain.includes('cloze-blank')) fail('plain 模式不得有挖空标记');
if (!hide.includes('exists') === false && !show.includes('N')) fail('答案内容缺失');

const partial = html(<MathText text={cloze} mode="hide" reveal={1} />);
if (!(partial.includes('kanswer') && partial.includes('cloze-blank'))) fail('reveal=1 应为一个已揭示 + 一个未揭示');
if ((partial.match(/data-ci="1"/g) ?? []).length !== 1) fail('第二个空应保留 data-ci=1');

const table = html(<MathText text={'| 矩阵 | 特征值 |\n|---|---|\n| $A^{-1}$ | $\\lambda^{-1}$ |'} />);
if (!table.includes('<table') || !table.includes('table-scroll')) fail('表格未渲染');
const steps = html(<MathText text={'1. 第一步 $x$\n2. 第二步\n3. 第三步'} maxLines={2} />);
if ((steps.match(/step-line/g) ?? []).length !== 2) fail('maxLines 应只渲染前两步');
const disp = html(<MathText text={'$$\\int_a^b f(x)\\,dx$$'} />);
if (!disp.includes('math-display-inner') || !disp.includes('math-zoom')) fail('块级公式应可横向滚动并可放大');

let n = 0;
for (const c of ALL_CARDS) {
  try {
    html(<MathText text={c.q} mode={c.k === 'cloze' ? 'hide' : 'plain'} />);
    if (c.a) html(<MathText text={c.a} mode="show" />);
    n++;
  } catch (e) {
    fail(`${c.id} 渲染异常：${(e as Error).message}`);
  }
}
console.log(`渲染 ${n} 张卡片正反面`);
if (errors) {
  console.error(`共 ${errors} 处问题`);
  process.exit(1);
}
console.log('✓ 渲染检查通过');
