'use client';

import { memo, useMemo, useSyncExternalStore, type ReactNode, type MouseEvent } from 'react';
import katex from 'katex';

export type ClozeMode = 'hide' | 'show' | 'plain';

const CLOZE_OPEN = '⟦';
const CLOZE_CLOSE = '⟧';

type Token = { t: 'text'; v: string } | { t: 'math'; v: string; display: boolean } | { t: 'open' } | { t: 'close' };

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  let buf = '';
  const flush = () => {
    if (buf) out.push({ t: 'text', v: buf });
    buf = '';
  };
  while (i < src.length) {
    const ch = src[i];
    if (ch === '$') {
      const display = src[i + 1] === '$';
      const delim = display ? '$$' : '$';
      const start = i + delim.length;
      const end = src.indexOf(delim, start);
      if (end === -1) {
        buf += ch;
        i++;
        continue;
      }
      flush();
      out.push({ t: 'math', v: src.slice(start, end), display });
      i = end + delim.length;
      continue;
    }
    if (ch === CLOZE_OPEN) {
      flush();
      out.push({ t: 'open' });
      i++;
      continue;
    }
    if (ch === CLOZE_CLOSE) {
      flush();
      out.push({ t: 'close' });
      i++;
      continue;
    }
    buf += ch;
    i++;
  }
  flush();
  return out;
}

interface Ctx {
  /** 当前挖空序号 */
  i: number;
  /** 序号 < reveal 的挖空显示答案（仅 hide 模式） */
  reveal: number;
}

const CLOZE_RE = /⟦([\s\S]*?)⟧/g;

function mathWithCloze(tex: string, mode: ClozeMode, ctx: Ctx): string {
  if (!tex.includes(CLOZE_OPEN)) return tex;
  return tex.replace(CLOZE_RE, (_, inner: string) => {
    const idx = ctx.i++;
    if (mode === 'plain') return `{${inner}}`;
    const shown = mode === 'show' || idx < ctx.reveal;
    if (shown) return String.raw`\htmlClass{kanswer}{${inner}}`;
    return String.raw`\htmlClass{kcloze}{\htmlData{ci=${idx}}{\underline{\;\;\;?\;\;\;}}}`;
  });
}

const cache = new Map<string, string>();

export function renderTex(tex: string, display: boolean): string {
  const key = `${display ? 'D' : 'I'}${tex}`;
  const hit = cache.get(key);
  if (hit) return hit;
  let html: string;
  try {
    html = katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      strict: 'ignore',
      trust: true,
      output: 'html',
      macros: { '\\R': '\\mathbb{R}', '\\N': '\\mathbb{N}', '\\d': '\\mathrm{d}' },
    });
  } catch {
    html = `<code>${tex.replace(/</g, '&lt;')}</code>`;
  }
  if (cache.size > 3000) cache.clear();
  cache.set(key, html);
  return html;
}

/* ---------------- 公式放大 ---------------- */

let zoomTex: { tex: string; display: boolean } | null = null;
const zoomListeners = new Set<() => void>();
export function openZoom(tex: string, display: boolean) {
  zoomTex = { tex, display };
  zoomListeners.forEach((l) => l());
}
export function closeZoom() {
  zoomTex = null;
  zoomListeners.forEach((l) => l());
}
export function useZoom() {
  return useSyncExternalStore(
    (cb) => {
      zoomListeners.add(cb);
      return () => {
        zoomListeners.delete(cb);
      };
    },
    () => zoomTex,
    () => null,
  );
}

/* ---------------- 文本渲染 ---------------- */

function renderText(text: string, key: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  if (parts.length === 1 && !parts[0].startsWith('**') && !parts[0].startsWith('`')) return text;
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={`${key}-${i}`} className="font-semibold text-ink">
        {p.slice(2, -2)}
      </strong>
    ) : p.startsWith('`') && p.endsWith('`') ? (
      <code key={`${key}-${i}`} className="rounded-md bg-ink/6 px-1 py-0.5 font-mono text-[0.9em]">
        {p.slice(1, -1)}
      </code>
    ) : (
      <span key={`${key}-${i}`}>{p}</span>
    ),
  );
}

function renderTokens(tokens: Token[], mode: ClozeMode, keyBase: string, ctx: Ctx): ReactNode[] {
  const nodes: ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok.t === 'open') {
      const inner: Token[] = [];
      let j = i + 1;
      while (j < tokens.length && tokens[j].t !== 'close') inner.push(tokens[j++]);
      const idx = ctx.i++;
      const shown = mode === 'show' || (mode === 'hide' && idx < ctx.reveal);
      const children = renderTokens(inner, 'plain', `${keyBase}-c${k}`, ctx);
      if (mode === 'plain') {
        nodes.push(<span key={`${keyBase}-p${k}`}>{children}</span>);
      } else if (shown) {
        nodes.push(
          <span key={`${keyBase}-s${k}`} className="cloze-answer" data-ci={idx}>
            {children}
          </span>,
        );
      } else {
        const len = inner.reduce((s, t) => s + ('v' in t ? t.v.length : 0), 0);
        const w = Math.min(Math.max(len * 0.5, 2.5), 10);
        nodes.push(
          <button type="button" key={`${keyBase}-b${k}`} className="cloze-blank" data-ci={idx} style={{ minWidth: `${w}em` }} aria-label={`第 ${idx + 1} 个空，点按显示`}>
            ?
          </button>,
        );
      }
      k++;
      i = j + 1;
      continue;
    }
    if (tok.t === 'close') {
      i++;
      continue;
    }
    if (tok.t === 'math') {
      const tex = mathWithCloze(tok.v, mode, ctx);
      const html = renderTex(tex, tok.display);
      if (tok.display) {
        nodes.push(
          <div key={`${keyBase}-m${k++}`} className="math-display" role="group">
            <div className="math-display-inner" dangerouslySetInnerHTML={{ __html: html }} />
            <button type="button" className="math-zoom" onClick={() => openZoom(mathWithCloze(tok.v, mode === 'hide' ? 'plain' : mode, { i: 0, reveal: 0 }), true)} aria-label="放大查看公式">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
          </div>,
        );
      } else {
        nodes.push(<span key={`${keyBase}-m${k++}`} className="math-inline" dangerouslySetInnerHTML={{ __html: html }} />);
      }
      i++;
      continue;
    }
    nodes.push(<span key={`${keyBase}-t${k++}`}>{renderText(tok.v, `${keyBase}-t${k}`)}</span>);
    i++;
  }
  return nodes;
}

function splitCells(row: string): string[] {
  const cells: string[] = [];
  let buf = '';
  let inMath = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '$') inMath = !inMath;
    if (ch === '|' && !inMath) {
      cells.push(buf.trim());
      buf = '';
    } else buf += ch;
  }
  cells.push(buf.trim());
  return cells;
}

interface Props {
  text: string;
  mode?: ClozeMode;
  className?: string;
  /** 分步显示：只渲染前 n 行（steps 卡） */
  maxLines?: number;
  /** hide 模式下已揭示的挖空数量 */
  reveal?: number;
  /** 点按某个挖空 */
  onBlank?: (index: number) => void;
}

/**
 * 渲染知识文本：
 * - `$…$` 行内公式，`$$…$$` 块级公式（可放大）
 * - `⟦…⟧` 挖空（hide 显示空格；show 高亮显示答案；plain 原样）
 * - 以 `|` 开头的连续行渲染为表格
 * - `- ` 项目符号，`1. ` 编号，`**粗体**`，`` `代码` ``
 */
export const MathText = memo(function MathText({ text, mode = 'plain', className, maxLines, reveal = 0, onBlank }: Props) {
  const blocks = useMemo(() => {
    const ls = text.split('\n');
    const lines = maxLines != null ? ls.slice(0, maxLines) : ls;
    const ctx: Ctx = { i: 0, reveal };
    const out: ReactNode[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.trimStart().startsWith('|')) {
        const rows: string[] = [];
        while (i < lines.length && lines[i].trimStart().startsWith('|')) rows.push(lines[i++]);
        const parsed = rows.filter((r) => !/^\s*\|?\s*:?-{2,}/.test(r)).map((r) => splitCells(r.trim().replace(/^\|/, '').replace(/\|$/, '')));
        const [head, ...body] = parsed;
        out.push(
          <div key={`tb${i}`} className="table-scroll">
            <table>
              <thead>
                <tr>
                  {head.map((c, ci) => (
                    <th key={ci}>{renderTokens(tokenize(c), mode, `th${i}-${ci}`, ctx)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((c, ci) => (
                      <td key={ci}>{renderTokens(tokenize(c), mode, `td${i}-${ri}-${ci}`, ctx)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
        continue;
      }
      if (line.trim() === '') {
        out.push(<div key={`sp${i}`} className="h-1.5" />);
        i++;
        continue;
      }
      const bullet = /^\s*- /.test(line);
      const numbered = /^\s*(\d+)\.\s/.exec(line);
      const isDisplayOnly = /^\s*\$\$[\s\S]*\$\$\s*$/.test(line);
      const content = bullet ? line.replace(/^\s*- /, '') : numbered ? line.replace(/^\s*\d+\.\s/, '') : line;
      out.push(
        <div key={`ln${i}`} className={isDisplayOnly ? 'my-1' : bullet ? 'bullet-line' : numbered ? 'step-line' : ''} data-step={numbered ? numbered[1] : undefined}>
          {renderTokens(tokenize(content), mode, `l${i}`, ctx)}
        </div>,
      );
      i++;
    }
    return out;
  }, [text, mode, maxLines, reveal]);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!onBlank) return;
    const el = (e.target as HTMLElement).closest('[data-ci]') as HTMLElement | null;
    if (!el) return;
    const ci = Number(el.dataset.ci);
    if (!Number.isNaN(ci)) {
      e.stopPropagation();
      onBlank(ci);
    }
  };

  return (
    <div className={`mathtext ${className ?? ''}`} onClick={onBlank ? onClick : undefined}>
      {blocks}
    </div>
  );
});

export function hasCloze(text: string) {
  return text.includes(CLOZE_OPEN);
}

export function countCloze(text: string) {
  return (text.match(/⟦/g) ?? []).length;
}

export function countLines(text: string) {
  return text.split('\n').filter((l) => l.trim() !== '').length;
}

/** 纯文本（用于搜索）：去掉挖空符与 Markdown 标记 */
export function plain(text: string) {
  return text
    .replace(/[⟦⟧]/g, '')
    .replace(/\*\*/g, '')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}$^_]/g, '');
}

/** 严格渲染（用于数据检查脚本）：任何 KaTeX 错误都会抛出 */
export function renderTexStrict(tex: string, display: boolean): string {
  return katex.renderToString(tex.replace(CLOZE_RE, (_, inner: string) => `{${inner}}`), {
    displayMode: display,
    throwOnError: true,
    strict: 'ignore',
    trust: true,
    output: 'html',
    macros: { '\\R': '\\mathbb{R}', '\\N': '\\mathbb{N}', '\\d': '\\mathrm{d}' },
  });
}

/** 提取文本中的全部公式片段 */
export function extractTex(text: string): { tex: string; display: boolean }[] {
  return tokenize(text).flatMap((t) => (t.t === 'math' ? [{ tex: t.v, display: t.display }] : []));
}
