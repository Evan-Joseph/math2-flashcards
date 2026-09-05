'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import { cardsFor, chaptersFor, CHAPTER_MAP, KIND_LABEL, chapterColor, type CardKind } from '@/data';
import { plain, MathText } from '@/lib/math';
import { useStoreState, State, useHydrated } from '@/lib/store';
import { PageTitle, Icon, Empty } from '@/components/ui';
import { CardSheet } from '@/components/CardSheet';

type Filter = 'all' | 'new' | 'due' | 'flag' | 'weak' | 'pending' | 'must';

export default function BrowsePage() {
  const s = useStoreState();
  const hydrated = useHydrated();
  const exam = s.settings.exam;
  const [q, setQ] = useState('');
  const dq = useDeferredValue(q);
  const [ch, setCh] = useState('');
  const [kind, setKind] = useState<CardKind | ''>('');
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<string | null>(null);
  const [now] = useState(() => Date.now());

  const index = useMemo(() => cardsFor(exam).map((c) => ({ c, text: plain(`${c.q} ${c.a ?? ''} ${c.hook ?? ''} ${c.trap ?? ''} ${c.cond ?? ''} ${c.sec} ${CHAPTER_MAP[c.ch].title}`).toLowerCase() })), [exam]);

  const results = useMemo(() => {
    const terms = dq.toLowerCase().split(/\s+/).filter(Boolean);
    return index
      .filter(({ c, text }) => {
        if (ch && c.ch !== ch) return false;
        if (kind && c.k !== kind) return false;
        const st = s.cards[c.id];
        const learned = st && st.state !== State.New;
        if (filter === 'new' && learned) return false;
        if (filter === 'due' && !(learned && st.due.getTime() <= now)) return false;
        if (filter === 'flag' && !s.flags.includes(c.id)) return false;
        if (filter === 'weak' && !(learned && (st.lapses > 0 || st.difficulty >= 7))) return false;
        if (filter === 'pending' && c.status !== 'pending') return false;
        if (filter === 'must' && c.s !== 3) return false;
        return terms.every((t) => text.includes(t));
      })
      .map((x) => x.c);
  }, [index, dq, ch, kind, filter, s.cards, s.flags, now]);

  const shown = hydrated ? results.slice(0, 150) : [];
  const chapters = chaptersFor(exam);

  return (
    <div>
      <PageTitle title="检索" sub={`${index.length} 张卡片`} />
      <div className="relative">
        <Icon.Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input className="field pl-10" type="search" placeholder="搜索公式、定理、易错点…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="搜索" />
      </div>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {(
          [
            ['all', '全部'],
            ['due', '待复习'],
            ['new', '未学'],
            ['must', '必背'],
            ['weak', '薄弱'],
            ['flag', '收藏'],
            ['pending', '待确认'],
          ] as [Filter, string][]
        ).map(([f, label]) => (
          <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f} className={`chip shrink-0 ${filter === f ? 'border-accent bg-accent-soft text-accent' : ''}`} style={{ height: '2rem' }}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <select className="field" value={ch} onChange={(e) => setCh(e.target.value)} aria-label="章节">
          <option value="">全部章节</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select className="field" value={kind} onChange={(e) => setKind(e.target.value as CardKind | '')} aria-label="类型">
          <option value="">全部类型</option>
          {Object.entries(KIND_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>
          {results.length} 条结果{results.length > shown.length ? `（显示前 ${shown.length}）` : ''}
        </span>
        {results.length > 0 && results.length <= 60 && (
          <Link href={`/study?mode=custom&ids=${results.filter((c) => c.status !== 'pending').map((c) => c.id).join(',')}`} className="text-accent">
            自测这些
          </Link>
        )}
      </div>

      {shown.length === 0 ? (
        <div className="mt-3">
          <Empty title="没有匹配的卡片" desc="换个关键词，或放宽筛选条件。" />
        </div>
      ) : (
        <div className="card mt-2 divide-y divide-line">
          {shown.map((c) => (
            <button key={c.id} type="button" onClick={() => setOpen(c.id)} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-paper-2/60">
              <span className="mt-1.5 h-6 w-1 shrink-0 rounded-full" style={{ background: chapterColor(c.ch) }} />
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 text-[0.95rem]">
                  <MathText text={c.q.split('\n')[0]} className="inline" />
                </span>
                <span className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted">
                  <span>{CHAPTER_MAP[c.ch].short}</span>
                  <span>{c.sec}</span>
                  <span>{KIND_LABEL[c.k]}</span>
                  {c.status === 'pending' && <span className="text-warn">待确认</span>}
                </span>
              </span>
              {s.flags.includes(c.id) && <Icon.Star size={14} filled className="mt-1 shrink-0 text-warn" />}
            </button>
          ))}
        </div>
      )}
      <CardSheet id={open} onClose={() => setOpen(null)} />
    </div>
  );
}
