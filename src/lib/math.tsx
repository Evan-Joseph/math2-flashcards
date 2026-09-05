'use client';

import { memo, useMemo, useSyncExternalStore, type ReactNode } from 'react';
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

function mathWithCloze(tex: string, mode: ClozeMode): string {
  if (!tex.includes(CLOZE_OPEN)) return tex;
  const re = /⟦([\s\S]*?)⟧/g;
  if (mode === 'hide') return tex.replace(re, String.raw`\htmlClass{kcloze}{\underline{\;\;\;?\;\;\;}}`);
  if (mode === 'show') return tex.replace(re, String.raw`\htmlClass{kanswer}{$1}`);
  return tex.replace(re, '$1');
}

const cache = new Map<string, string>();

export function renderTex(tex: string, display: boolean, mode: ClozeMode = 'plain'): string {
  const key = `${display ? 'D' : 'I'}${mode}${tex}`;
  const hit = cache.get(key);
  if (hit) return hit;
  let html: string;
  try {
    html = katex.renderToString(mathWithCloze(tex, mode), {
      displayMode: display,
      throwOnError: false,
      strict: 'ignore',
      trust: true,
      output: 'html',
      macros: { '\\R': '\\mathbb{R}', '\\d': '\\mathrm{d}' },
    });
  } catch {
    html = `<code>${tex.replace(/</g, '&lt;')}</code>`;
  }
  if (cache.size > 3000) cache.clear();
  cache.set(key, html);
  return html;
}

/* ---------------- 公式放大（移动端） ---------------- */

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
      <code key={`${key}-${i}`} className="rounded bg-ink/6 px-1 py-0.5 font-mono text-[0.9em]">
        {p.slice(1, -1)}
      </code>
    ) : (
      <span key={`${key}-${i}`}>{p}</span>
    ),
  );
}

function renderTokens(tokens: Token[], mode: ClozeMode, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok.t === 'open') {
      const inner: Token[] = [];
      let j = i + 1;
      while (j < tokens.length && tokens[j].t !== 'close') inner.push(tokens[j++]);
      const children = renderTokens(inner, mode === 'hide' ? 'plain' : mode, `${keyBase}-c${k}`);
      if (mode === 'hide') {
        const len = inner.reduce((s, t) => s + ('v' in t ? t.v.length : 0), 0);
        const w = Math.min(Math.max(len * 0.5, 2.5), 10);
        nodes.push(
          <span key={`${keyBase}-b${k}`} className="cloze-blank" style={{ minWidth: `${w}em` }} aria-label="待填空">
            ?
          </span>,
        );
      } else if (mode === 'show') {
        nodes.push(
          <span key={`${keyBase}-s${k}`} className="cloze-answer">
            {children}
          </span>,
        );
      } else {
        nodes.push(<span key={`${keyBase}-p${k}`}>{children}</span>);
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
      const html = renderTex(tok.v, tok.display, mode);
      if (tok.display) {
        nodes.push(
          <button
            type="button"
            key={`${keyBase}-m${k++}`}
            className="math-display"
            onClick={() => openZoom(mathWithCloze(tok.v, mode === 'hide' ? 'plain' : mode), true)}
            aria-label="放大查看公式"
            dangerouslySetInnerHTML={{ __html: html }}
          />,
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

function InlineLine({ text, mode, keyBase }: { text: string; mode: ClozeMode; keyBase: string }) {
  const nodes = useMemo(() => renderTokens(tokenize(text), mode, keyBase), [text, mode, keyBase]);
  return <>{nodes}</>;
}

interface Props {
  text: string;
  mode?: ClozeMode;
  className?: string;
  /** 分步显示：只渲染前 n 行（steps 卡） */
  maxLines?: number;
}

/**
 * 渲染知识文本：
 * - `$…$` 行内公式，`$$…$$` 块级公式（点击可放大）
 * - `⟦…⟧` 挖空（hide 显示空格；show 高亮显示答案；plain 原样）
 * - 以 `|` 开头的连续行渲染为表格
 * - `- ` 项目符号，`1. ` 编号，`**粗体**`，`` `代码` ``
 */
export const MathText = memo(function MathText({ text, mode = 'plain', className, maxLines }: Props) {
  const lines = useMemo(() => {
    const ls = text.split('\n');
    return maxLines != null ? ls.slice(0, maxLines) : ls;
  }, [text, maxLines]);
  const blocks: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trimStart().startsWith('|')) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith('|')) rows.push(lines[i++]);
      const parsed = rows.filter((r) => !/^\s*\|?\s*:?-{2,}/.test(r)).map((r) => splitCells(r.trim().replace(/^\|/, '').replace(/\|$/, '')));
      const [head, ...body] = parsed;
      blocks.push(
        <div key={`tb${i}`} className="my-2 -mx-1 overflow-x-auto px-1">
          <table className="w-full min-w-[280px] border-collapse text-[0.95em]">
            <thead>
              <tr>
                {head.map((c, ci) => (
                  <th key={ci} className="border-b border-line px-2 py-1.5 text-left font-semibold text-muted">
                    <InlineLine text={c} mode={mode} keyBase={`th${i}-${ci}`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri} className="border-b border-line/60 last:border-0">
                  {row.map((c, ci) => (
                    <td key={ci} className="px-2 py-1.5 align-top">
                      <InlineLine text={c} mode={mode} keyBase={`td${i}-${ri}-${ci}`} />
                    </td>
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
      blocks.push(<div key={`sp${i}`} className="h-2" />);
      i++;
      continue;
    }
    const bullet = /^\s*- /.test(line);
    const numbered = /^\s*(\d+)\.\s/.exec(line);
    const isDisplayOnly = /^\s*\$\$[\s\S]*\$\$\s*$/.test(line);
    const content = bullet ? line.replace(/^\s*- /, '') : numbered ? line.replace(/^\s*\d+\.\s/, '') : line;
    blocks.push(
      <div
        key={`ln${i}`}
        className={
          isDisplayOnly
            ? 'my-1'
            : bullet
              ? 'relative pl-4 before:absolute before:left-1 before:top-[0.72em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-muted/60'
              : numbered
                ? 'step-line'
                : ''
        }
        data-step={numbered ? numbered[1] : undefined}
      >
        <InlineLine text={content} mode={mode} keyBase={`l${i}`} />
      </div>,
    );
    i++;
  }
  return <div className={`mathtext leading-relaxed ${className ?? ''}`}>{blocks}</div>;
});

export function hasCloze(text: string) {
  return text.includes(CLOZE_OPEN);
}

export function countLines(text: string) {
  return text.split('\n').filter((l) => l.trim() !== '').length;
}

/** 纯文本（用于搜索）：去掉挖空符与 Markdown 标记 */
export function plain(text: string) {
  return text.replace(/[⟦⟧]/g, '').replace(/\*\*/g, '').replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}$^_]/g, '');
}
