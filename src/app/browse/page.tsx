'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Play, Star } from 'lucide-react';
import { cardsFor, chaptersFor, CHAPTER_MAP, KIND_LABEL, STATUS_LABEL, isStudyable, countKnowledge, type CardKind } from '@/data';
import { plain, MathText } from '@/lib/math';
import { useStore, useHydrated, cardMastery, type Mastery } from '@/lib/store';
import { PageHeader, Button, Badge, Segmented, Empty } from '@/components/ui';
import { CardSheet, MASTERY_LABEL, MASTERY_TONE } from '@/components/CardSheet';
import { cn } from '@/lib/cn';

type Filter = 'all' | 'flag' | 'weak' | 'due' | 'new' | 'noted' | 'excluded';

export default function BrowsePage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useStore((st) => st);
  const exam = s.settings.exam;
  const [q, setQ] = useState('');
  const dq = useDeferredValue(q);
  const [ch, setCh] = useState<string>('');
  const [kind, setKind] = useState<CardKind | ''>('');
  const [filter, setFilter] = useState<Filter>('all');
  const [detail, setDetail] = useState<string | null>(null);
  const [shown, setShown] = useState(60);
  const [now] = useState(() => Date.now());

  const chapters = chaptersFor(exam);

  const results = useMemo(() => {
    const needle = dq.trim().toLowerCase();
    const terms = needle.split(/\s+/).filter(Boolean);
    return cardsFor(exam).filter((c) => {
      if (ch && c.ch !== ch) return false;
      if (kind && c.k !== kind) return false;
      if (filter === 'flag' && !s.flags.includes(c.id)) return false;
      if (filter === 'noted' && !s.notes[c.id]) return false;
      if (filter === 'excluded' && isStudyable(c)) return false;
      if (filter !== 'excluded' && !isStudyable(c) && filter !== 'all') return false;
      const st = s.cards[c.id];
      if (filter === 'weak' && !(st && st.state !== 0 && (st.lapses > 0 || st.difficulty >= 7))) return false;
      if (filter === 'due' && !(st && st.state !== 0 && st.due.getTime() <= now)) return false;
      if (filter === 'new' && st && st.state !== 0) return false;
      if (!terms.length) return true;
      const hay = `${plain(c.q)} ${plain(c.a ?? '')} ${c.sec} ${plain(c.hook ?? '')} ${plain(c.trap ?? '')} ${plain(c.cond ?? '')} ${CHAPTER_MAP[c.ch]?.title ?? ''} ${s.notes[c.id] ?? ''}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [exam, dq, ch, kind, filter, s, now]);

  const studyable = results.filter(isStudyable);
  const anyFilter = q || ch || kind || filter !== 'all';
  const listKey = `${dq}|${ch}|${kind}|${filter}`;
  const [lastKey, setLastKey] = useState(listKey);
  if (lastKey !== listKey) {
    setLastKey(listKey);
    setShown(60);
  }

  return (
    <div>
      <PageHeader title="检索" subtitle={hydrated ? `${results.length} 张卡片 · ${countKnowledge(results)} 个知识点` : ' '} />

      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted" />
        <input type="search" enterKeyHint="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索公式、定理、章节、笔记…" className="h-12 w-full rounded-xl border border-line bg-paper pl-11 pr-11 text-[16px] placeholder:text-muted/70 focus:border-accent focus:outline-none" aria-label="搜索" />
        {q && (
          <button type="button" onClick={() => setQ('')} className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-paper-2" aria-label="清空">
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="no-scrollbar -mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <Segmented<Filter> ariaLabel="集合" size="sm" value={filter} onValueChange={setFilter} options={[{ value: 'all', label: '全部' }, { value: 'due', label: '到期' }, { value: 'weak', label: '薄弱' }, { value: 'new', label: '未学' }, { value: 'flag', label: '收藏' }, { value: 'noted', label: '有笔记' }, { value: 'excluded', label: '不进队列' }]} />
      </div>
      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <select value={ch} onChange={(e) => setCh(e.target.value)} className="h-9 shrink-0 rounded-lg border border-line bg-paper px-2.5 text-[13px]" aria-label="章节">
          <option value="">全部章节</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select value={kind} onChange={(e) => setKind(e.target.value as CardKind | '')} className="h-9 shrink-0 rounded-lg border border-line bg-paper px-2.5 text-[13px]" aria-label="题型">
          <option value="">全部题型</option>
          {(Object.keys(KIND_LABEL) as CardKind[]).map((k) => (
            <option key={k} value={k}>
              {KIND_LABEL[k]}
            </option>
          ))}
        </select>
        {studyable.length > 0 && anyFilter && (
          <Button size="sm" variant="soft" className="ml-auto shrink-0" onClick={() => router.push(`/study?mode=custom&title=${encodeURIComponent('检索自测')}&ids=${studyable.slice(0, 200).map((c) => c.id).join(',')}`)}>
            <Play /> 自测 {Math.min(studyable.length, 200)} 张
          </Button>
        )}
      </div>

      {!hydrated ? (
        <div className="card h-40 animate-pulse" />
      ) : results.length === 0 ? (
        <Empty title="没有匹配的卡片" desc="换个关键词，或放宽章节 / 题型 / 集合筛选。" />
      ) : (
        <ul className="card divide-y divide-line overflow-hidden">
          {results.slice(0, shown).map((c) => {
            const m: Mastery = hydrated ? cardMastery(c.id, s) : 'new';
            const ok = isStudyable(c);
            return (
              <li key={c.id}>
                <button type="button" onClick={() => setDetail(c.id)} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-paper-2">
                  <span className={cn('mt-2 size-2 shrink-0 rounded-full', m === 'mature' ? 'bg-good' : m === 'review' ? 'bg-accent' : m === 'learning' ? 'bg-warn' : 'bg-line-2')} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-[15px] leading-6">
                      <MathText text={c.q} className="!text-[15px] !leading-6" />
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                      <span>{CHAPTER_MAP[c.ch]?.short}</span>
                      <span>·</span>
                      <span>{c.sec}</span>
                      <Badge tone="outline" className="h-5 px-1.5 text-[10px]">
                        {KIND_LABEL[c.k]}
                      </Badge>
                      {c.scope === 'm1' && <Badge tone="accent" className="h-5 px-1.5 text-[10px]">仅数一</Badge>}
                      {!ok && <Badge tone="bad" className="h-5 px-1.5 text-[10px]">{STATUS_LABEL[c.status ?? 'ok']}</Badge>}
                      {hydrated && m !== 'new' && <Badge tone={MASTERY_TONE[m]} className="h-5 px-1.5 text-[10px]">{MASTERY_LABEL[m]}</Badge>}
                      {s.flags.includes(c.id) && <Star className="size-3.5 fill-warn text-warn" />}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
          {results.length > shown && (
            <li>
              <button type="button" onClick={() => setShown((n) => n + 60)} className="h-12 w-full text-center text-sm font-medium text-accent hover:bg-paper-2">
                显示更多（还有 {results.length - shown} 条）
              </button>
            </li>
          )}
        </ul>
      )}

      <CardSheet id={detail} onClose={() => setDetail(null)} onOpenCard={setDetail} />
    </div>
  );
}
