import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ALL_CARDS, CHAPTERS, CHAPTER_MAP, KIND_LABEL, hueVar } from '../data';
import type { KCard } from '../data/types';
import { MathText } from '../lib/math';
import { isLearned, retrievability, toggleFlag, useStore } from '../lib/store';
import type { View } from '../lib/nav';
import { Button, Chip, Icon, Stars, useMotion } from './ui';
import { cn } from '../utils/cn';

type Filter = 'all' | 'flag' | 'weak' | 'new' | 'star3';

export function Sheet({ ch: initCh, q: initQ, go }: { ch?: string; q?: string; go: (v: View) => void }) {
  const [ch, setCh] = useState<string>(initCh ?? 'h1');
  const [query, setQuery] = useState(initQ ?? '');
  const [filter, setFilter] = useState<Filter>('all');
  const [hideAnswers, setHideAnswers] = useState(false);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const flags = useStore((s) => s.flags);
  useStore((s) => s.cards);
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotion();
  const now = new Date();

  const searching = query.trim().length > 0;

  const list = useMemo(() => {
    const src = searching ? ALL_CARDS : ALL_CARDS.filter((c) => c.ch === ch);
    const qq = query.trim().toLowerCase();
    return src.filter((c) => {
      if (qq && !`${c.q} ${c.a ?? ''} ${c.sec} ${c.hook ?? ''} ${c.trap ?? ''}`.toLowerCase().includes(qq)) return false;
      if (filter === 'flag') return flags.includes(c.id);
      if (filter === 'new') return !isLearned(c.id);
      if (filter === 'weak') {
        const r = retrievability(c.id, now);
        return r !== null && r < 0.7;
      }
      if (filter === 'star3') return c.s === 3;
      return true;
    });
  }, [ch, query, filter, flags, searching]); // eslint-disable-line react-hooks/exhaustive-deps

  const sections = useMemo(() => {
    const map = new Map<string, KCard[]>();
    for (const c of list) {
      const key = searching ? `${CHAPTER_MAP[c.ch].short} · ${c.sec}` : c.sec;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    return [...map.entries()];
  }, [list, searching]);

  useEffect(() => {
    setOpenIds(new Set());
  }, [ch, hideAnswers, filter]);

  useGSAP(
    () => {
      if (!motion) return;
      gsap.fromTo('.sheet-row', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.02, ease: 'power2.out', overwrite: true });
    },
    { dependencies: [ch, filter, searching], scope: ref },
  );

  const chapter = CHAPTER_MAP[ch];
  const color = hueVar(chapter.hue);

  return (
    <div ref={ref} className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:pt-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">速记清单</h1>
          <p className="mt-1 text-sm text-muted">按章节扫读全部知识点；开启「遮答案」可逐条自测。</p>
        </div>
        <button
          onClick={() => setHideAnswers((h) => !h)}
          className={cn('flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition', hideAnswers ? 'border-gold/30 bg-gold-soft text-gold' : 'border-line bg-card text-muted hover:text-ink')}
        >
          <Icon.Eye className="h-4 w-4" off={hideAnswers} />
          {hideAnswers ? '遮答案中' : '遮答案'}
        </button>
      </div>

      {/* 搜索 */}
      <div className="relative mt-4">
        <Icon.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索全部章节：如 泰勒、伴随、华里士、正定…"
          className="h-11 w-full rounded-xl border border-line bg-card pl-9 pr-9 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-ink">
            <Icon.Close className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 章节 tab */}
      {!searching && (
        <div className="no-scrollbar -mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 pb-1">
          {CHAPTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCh(c.id)}
              className={cn('shrink-0 rounded-full border px-3 py-1.5 text-sm transition', c.id === ch ? 'border-transparent text-white' : 'border-line bg-card text-muted hover:text-ink')}
              style={c.id === ch ? { backgroundColor: hueVar(c.hue) } : undefined}
            >
              {c.short}
            </button>
          ))}
        </div>
      )}

      {/* 筛选 */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
        {(
          [
            ['all', '全部'],
            ['star3', '★★★ 核心'],
            ['weak', '薄弱'],
            ['new', '未学'],
            ['flag', '已标记'],
          ] as [Filter, string][]
        ).map(([f, label]) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('rounded-full px-2.5 py-1 transition', filter === f ? 'bg-ink text-paper' : 'bg-card2 text-muted hover:text-ink')}>
            {label}
          </button>
        ))}
        <span className="ml-auto text-muted">{list.length} 条</span>
        {list.length > 0 && (
          <Button size="sm" variant="soft" onClick={() => go({ name: 'study-custom', title: searching ? `搜索「${query.trim()}」` : `${chapter.short} · 清单`, ids: list.map((c) => c.id) })}>
            <Icon.Play className="h-3 w-3" /> 背这 {list.length} 条
          </Button>
        )}
      </div>

      {/* 列表 */}
      {sections.length === 0 ? (
        <div className="mt-10 text-center text-sm text-muted">没有符合条件的知识点。</div>
      ) : (
        sections.map(([sec, cards]) => (
          <section key={sec} className="mt-6">
            <h2 className="sticky top-0 z-10 -mx-4 bg-paper/90 px-4 py-2 text-sm font-semibold backdrop-blur" style={{ color: searching ? undefined : color }}>
              {sec}
              <span className="ml-2 text-xs font-normal text-muted">{cards.length}</span>
            </h2>
            <div className="space-y-2">
              {cards.map((c) => {
                const open = !hideAnswers || openIds.has(c.id);
                const r = retrievability(c.id, now);
                const flagged = flags.includes(c.id);
                return (
                  <article key={c.id} className="sheet-row rounded-2xl border border-line bg-card">
                    <div
                      className={cn('px-4 pt-3 pb-3', hideAnswers && 'cursor-pointer')}
                      onClick={() => {
                        if (!hideAnswers) return;
                        setOpenIds((s) => {
                          const n = new Set(s);
                          if (n.has(c.id)) n.delete(c.id);
                          else n.add(c.id);
                          return n;
                        });
                      }}
                    >
                      <div className="mb-1.5 flex items-center gap-2 text-[11px] text-muted">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: r === null ? 'var(--line)' : r >= 0.9 ? 'var(--good)' : r >= 0.7 ? 'var(--gold)' : 'var(--bad)' }}
                          title={r === null ? '未学' : `可提取率 ${Math.round(r * 100)}%`}
                        />
                        <span>{KIND_LABEL[c.k]}</span>
                        <Stars n={c.s} />
                        <div className="ml-auto flex items-center gap-1">
                          {searching && <Chip color={hueVar(CHAPTER_MAP[c.ch].hue)}>{CHAPTER_MAP[c.ch].short}</Chip>}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFlag(c.id);
                            }}
                            className={cn('rounded-md p-1', flagged ? 'text-gold' : 'text-muted/60 hover:text-ink')}
                            aria-label="标记"
                          >
                            <Icon.Flag className="h-3.5 w-3.5" filled={flagged} />
                          </button>
                        </div>
                      </div>
                      <div className="text-[0.98rem]">
                        <MathText text={c.q} mode={c.k === 'cloze' ? (open ? 'show' : 'hide') : 'plain'} />
                      </div>
                      {c.a && (
                        <div className={cn('mt-2 border-t border-dashed border-line pt-2 text-[0.95rem]', !open && 'select-none')}>
                          {open ? (
                            <MathText text={c.k === 'judge' ? c.a : c.a} />
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-muted">
                              <Icon.Eye className="h-3.5 w-3.5" off /> 点击显示答案
                            </div>
                          )}
                        </div>
                      )}
                      {open && (c.hook || c.trap) && (
                        <details className="mt-2 text-sm">
                          <summary className="cursor-pointer select-none text-xs text-muted hover:text-ink">锚点 / 易错点</summary>
                          <div className="mt-2 space-y-2">
                            {c.hook && (
                              <div className="flex gap-2 rounded-xl bg-accent-soft/60 px-3 py-2 text-[0.92rem]">
                                <span className="shrink-0 text-sm">🧠</span>
                                <MathText text={c.hook} className="flex-1" />
                              </div>
                            )}
                            {c.trap && (
                              <div className="flex gap-2 rounded-xl bg-gold-soft/50 px-3 py-2 text-[0.92rem]">
                                <span className="shrink-0 text-sm">⚠️</span>
                                <MathText text={c.trap} className="flex-1" />
                              </div>
                            )}
                          </div>
                        </details>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
