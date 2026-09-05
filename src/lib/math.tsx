import { memo, useMemo, type ReactNode } from 'react';
import katex from 'katex';

export type ClozeMode = 'hide' | 'show' | 'plain';

const CLOZE_OPEN = '⟦';
const CLOZE_CLOSE = '⟧';
const HIGHLIGHT = '#c2410c';

type Token =
  | { t: 'text'; v: string }
  | { t: 'math'; v: string; display: boolean }
  | { t: 'open' }
  | { t: 'close' };

/** 词法：把一段行内文本切成 文本 / 公式 / 挖空标记 */
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
  if (mode === 'hide') return tex.replace(re, String.raw`\textcolor{#b45309}{\underline{\;\;\;?\;\;\;}}`);
  if (mode === 'show') return tex.replace(re, String.raw`\textcolor{${HIGHLIGHT}}{$1}`);
  return tex.replace(re, '$1');
}

function renderTex(tex: string, display: boolean, mode: ClozeMode): string {
  try {
    return katex.renderToString(mathWithCloze(tex, mode), {
      displayMode: display,
      throwOnError: false,
      strict: 'ignore',
      trust: true,
      output: 'html',
    });
  } catch {
    return tex;
  }
}

/** 文本中的 **加粗** */
function renderText(text: string, key: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  if (parts.length === 1 && !parts[0].startsWith('**')) return text;
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={`${key}-${i}`} className="font-semibold text-ink">
        {p.slice(2, -2)}
      </strong>
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
      // 收集到匹配的 close
      const inner: Token[] = [];
      let j = i + 1;
      while (j < tokens.length && tokens[j].t !== 'close') inner.push(tokens[j++]);
      const children = renderTokens(inner, mode === 'hide' ? 'plain' : mode, `${keyBase}-c${k}`);
      if (mode === 'hide') {
        const len = inner.reduce((s, t) => s + ('v' in t ? t.v.length : 0), 0);
        const w = Math.min(Math.max(len * 0.55, 3), 12);
        nodes.push(
          <span
            key={`${keyBase}-b${k}`}
            className="cloze-blank"
            style={{ minWidth: `${w}em` }}
            aria-label="挖空"
          >
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
      nodes.push(
        <span
          key={`${keyBase}-m${k++}`}
          className={tok.display ? 'block overflow-x-auto py-1' : 'inline'}
          dangerouslySetInnerHTML={{ __html: renderTex(tok.v, tok.display, mode) }}
        />,
      );
      i++;
      continue;
    }
    nodes.push(<span key={`${keyBase}-t${k++}`}>{renderText(tok.v, `${keyBase}-t${k}`)}</span>);
    i++;
  }
  return nodes;
}

/** 按 | 切分表格单元格，但忽略 $…$ 内部的 | */
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
}

/**
 * 渲染知识文本：
 * - `$…$` 行内公式，`$$…$$` 块级公式
 * - `⟦…⟧` 挖空（hide 显示空格；show 高亮显示答案；plain 原样）
 * - 以 `|` 开头的连续行渲染为表格
 * - `- ` 开头为项目符号，`1. ` 开头为编号
 */
export const MathText = memo(function MathText({ text, mode = 'plain', className }: Props) {
  const lines = text.split('\n');
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
        <div key={`tb${i}`} className="my-2 overflow-x-auto">
          <table className="w-full border-collapse text-[0.95em]">
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
    const content = bullet ? line.replace(/^\s*- /, '') : line;
    blocks.push(
      <div
        key={`ln${i}`}
        className={
          isDisplayOnly
            ? 'my-1'
            : bullet
              ? 'relative pl-4 before:absolute before:left-1 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-muted/60'
              : numbered
                ? 'pl-[1.6em] -indent-[1.6em]'
                : ''
        }
      >
        <InlineLine text={content} mode={mode} keyBase={`l${i}`} />
      </div>,
    );
    i++;
  }
  return <div className={`mathtext leading-relaxed ${className ?? ''}`}>{blocks}</div>;
});

/** 是否包含挖空 */
export function hasCloze(text: string) {
  return text.includes(CLOZE_OPEN);
}
