'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import { ALL_CARDS, CHAPTERS, CHAPTER_MAP, KIND_LABEL, chapterColor } from '@/data';
import type { KCard } from '@/data/types';
import { MathText, hasCloze, plain } from '@/lib/math';
import { retrievability, useHydrated, useStoreState } from '@/lib/store';
import { Button, Card, Chip, Icon, Stars } from '@/components/ui';
import { CardSheet, stateLabel } from '@/components/CardSheet';
import { cn } from '@/lib/cn';

type StateFilter = 'all' | 'new' | 'learned' | 'due' | 'weak' | 'flag';

export default function BrowsePage() {
  const s = useStoreState();
  const hydrated = useHydrated();
  const [q, setQ] = useState('');
  const dq = useDeferredValue(q);
  const [ch, setCh] = useState<string>('all');
  const [kind, setKind] = useState<string>('all');
  const [imp, setImp] = useState<number>(0);
  const [stf, setStf] = useState<StateFilter>('all');
  const [sheet, setSheet] = useState(false);
  const [open, setOpen] = useState<KCard | null>(null);

  const index = useMemo(() => ALL_CARDS.map((c) => ({ c, text: `${plain(c.q)} ${plain(c.a ?? '')} ${c.sec} ${plain(c.hook ?? '')} ${plain(c.trap ?? '')}`.toLowerCase() })), []);
  const now = useMemo(() => new Date(), []);

  const results = useMemo(() => {
    const terms = dq.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return index
      .filter(({ c, text }) => {
        if (ch !== 'all' && c.ch !== ch) return false;
        if (kind !== 'all' && c.k !== kind) return false;
        if (imp && c.s < imp) return false;
        const cs = s.cards[c.id];
        if (stf === 'new' && cs && cs.state !== 0) return false;
        if (stf === 'learned' && (!cs || cs.state === 0)) return false;
        if (stf === 'due' && !(cs && cs.state !== 0 && new Date(cs.due).getTime() <= now.getTime())) return false;
        if (stf === 'weak' && !(cs && cs.state !== 0 && (retrievability(c.id, now, s) ?? 1) < 0.7)) return false;
        if (stf === 'flag' && !s.flags.includes(c.id)) return false;
        return terms.every((t) => text.includes(t));
      })
      .map((x) => x.c);
  }, [index, dq, ch, kind, imp, stf, s, now]);

  const ids = results.map((c) => c.id);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">清单与速查</h1>
        <p className="mt-1 text-sm text-muted">搜索公式、定理、易错点；也可以按条件筛出一组卡片直接背。</p>
      </header>

      <div className="relative">
        <Icon.Search className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="例如：等价无穷小、正定、拉格朗日、洛必达…"
          className="h-12 w-full rounded-2xl border border-line bg-card pr-4 pl-11 text-[15px] shadow-card outline-none focus:border-accent"
          aria-label="搜索卡片"
        />
      </div>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        <select value={ch} onChange={(e) => setCh(e.target.value)} className="h-9 shrink-0 rounded-full border border-line bg-card px-3 text-sm font-semibold" aria-label="章节">
          <option value="all">全部章节</option>
          {CHAPTERS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select value={kind} onChange={(e) => setKind(e.target.value)} className="h-9 shrink-0 rounded-full border border-line bg-card px-3 text-sm font-semibold" aria-label="题型">
          <option value="all">全部题型</option>
          {Object.entries(KIND_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select value={imp} onChange={(e) => setImp(Number(e.target.value))} className="h-9 shrink-0 rounded-full border border-line bg-card px-3 text-sm font-semibold" aria-label="重要度">
          <option value={0}>全部重要度</option>
          <option value={3}>仅必背 ★★★</option>
          <option value={2}>重点以上 ★★</option>
        </select>
        <select value={stf} onChange={(e) => setStf(e.target.value as StateFilter)} className="h-9 shrink-0 rounded-full border border-line bg-card px-3 text-sm font-semibold" aria-label="状态">
          <option value="all">全部状态</option>
          <option value="new">新卡</option>
          <option value="learned">已学</option>
          <option value="due">到期</option>
          <option value="weak">薄弱</option>
          <option value="flag">已标记</option>
        </select>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="tabular text-sm text-muted">{results.length} 张</span>
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant={sheet ? 'soft' : 'default'} onClick={() => setSheet((v) => !v)}>
            <Icon.Eye className="h-4 w-4" /> {sheet ? '列表模式' : '速查表模式'}
          </Button>
          <Link href={`/study?mode=custom&cram=1&title=${encodeURIComponent(dq ? `搜索「${dq}」` : '筛选结果')}&ids=${ids.slice(0, 80).join(',')}`} className={cn(!ids.length && 'pointer-events-none opacity-50')}>
            <Button size="sm" variant="primary" disabled={!ids.length || !hydrated}>
              <Icon.Shuffle className="h-4 w-4" /> 速刷这些 ({Math.min(80, ids.length)})
            </Button>
          </Link>
        </div>
      </div>

      {sheet ? (
        <div className="mt-3 space-y-3">
          {results.slice(0, 60).map((c) => (
            <SheetItem key={c.id} c={c} onOpen={() => setOpen(c)} />
          ))}
          {results.length > 60 && <p className="py-4 text-center text-xs text-muted">速查表模式最多显示 60 张，请缩小筛选范围。</p>}
        </div>
      ) : (
        <Card className="mt-3 divide-y divide-line overflow-hidden">
          {results.length === 0 && <p className="p-8 text-center text-sm text-muted">没有匹配的卡片。试试更短的关键词。</p>}
          {results.slice(0, 200).map((c) => {
            const lab = stateLabel(s.cards[c.id], now);
            return (
              <button key={c.id} type="button" onClick={() => setOpen(c)} className="flex w-full items-start gap-3 p-3 text-left hover:bg-ink/3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: chapterColor(c.ch) }} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-[14.5px] leading-snug">{plain(c.q)}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Chip>{CHAPTER_MAP[c.ch].short}</Chip>
                    <Chip>{c.sec}</Chip>
                    <Stars n={c.s} />
                    {hydrated && <Chip tone={lab.tone}>{lab.label}</Chip>}
                  </div>
                </div>
                <Icon.Right className="mt-1 shrink-0 text-muted" />
              </button>
            );
          })}
          {results.length > 200 && <p className="p-3 text-center text-xs text-muted">仅显示前 200 张。</p>}
        </Card>
      )}

      <CardSheet card={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function SheetItem({ c, onOpen }: { c: KCard; onOpen: () => void }) {
  const cloze = c.k === 'cloze' && hasCloze(c.q);
  return (
    <Card className="p-4" style={{ ['--ch' as string]: chapterColor(c.ch), ['--ch-soft' as string]: chapterColor(c.ch, 0.94, 0.04) }}>
      <div className="mb-2 flex items-center gap-1.5">
        <Chip tone="ch">{CHAPTER_MAP[c.ch].short}</Chip>
        <Chip>{c.sec}</Chip>
        <Stars n={c.s} />
        <button type="button" onClick={onOpen} className="ml-auto text-xs font-semibold text-accent-ink">
          详情
        </button>
      </div>
      <div className="text-[15px] leading-relaxed font-semibold">
        <MathText text={c.q} mode={cloze ? 'show' : 'plain'} />
      </div>
      {c.a && (
        <div className="mt-2 border-t border-line pt-2 text-[15px] leading-relaxed">
          <MathText text={c.a} />
        </div>
      )}
    </Card>
  );
}
