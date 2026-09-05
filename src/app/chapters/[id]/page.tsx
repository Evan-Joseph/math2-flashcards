'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CHAPTER_MAP, KIND_LABEL, chapterColor, sectionsOf } from '@/data';
import type { KCard } from '@/data/types';
import { chapterStat, retrievability, useHydrated, useStoreState } from '@/lib/store';
import { plain } from '@/lib/math';
import { Button, Card, Chip, Icon, IconButton, Stars } from '@/components/ui';
import { CardSheet, stateLabel } from '@/components/CardSheet';
import { cn } from '@/lib/cn';

export default function ChapterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const ch = CHAPTER_MAP[id];
  const s = useStoreState();
  const hydrated = useHydrated();
  const [open, setOpen] = useState<KCard | null>(null);
  const [filter, setFilter] = useState<'all' | 'due' | 'new' | 'weak' | 'flag'>('all');

  const now = useMemo(() => new Date(), []);
  const st = useMemo(() => (ch ? chapterStat(ch.id, now, s) : null), [ch, now, s]);
  const sections = useMemo(() => (ch ? sectionsOf(ch.id) : []), [ch]);
  if (!ch || !st) return notFound();

  const color = chapterColor(ch.id);
  const match = (c: KCard) => {
    const cs = s.cards[c.id];
    if (filter === 'all') return true;
    if (filter === 'new') return !cs || cs.state === 0;
    if (filter === 'due') return !!cs && cs.state !== 0 && new Date(cs.due).getTime() <= now.getTime();
    if (filter === 'weak') return !!cs && cs.state !== 0 && (retrievability(c.id, now, s) ?? 1) < 0.7;
    if (filter === 'flag') return s.flags.includes(c.id);
    return true;
  };
  const chips: { k: typeof filter; label: string; n?: number }[] = [
    { k: 'all', label: '全部', n: st.total },
    { k: 'due', label: '到期', n: st.due },
    { k: 'new', label: '新卡', n: st.total - st.learned },
    { k: 'weak', label: '薄弱', n: st.weak },
    { k: 'flag', label: '标记' },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 pt-3 md:pt-8" style={{ ['--ch' as string]: color, ['--ch-soft' as string]: chapterColor(ch.id, 0.94, 0.04) }}>
      <div className="mb-3 flex items-center gap-1 md:hidden">
        <Link href="/chapters" aria-label="返回章节列表">
          <IconButton label="返回">
            <Icon.Back />
          </IconButton>
        </Link>
        <span className="text-sm font-semibold text-muted">章节</span>
      </div>

      <Card className="relative overflow-hidden p-5">
        <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: color }} aria-hidden />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight md:text-2xl">{ch.title}</h1>
            <p className="mt-1 text-sm text-muted">{ch.desc}</p>
            <p className="mt-1 text-[11px] text-muted/80">{ch.ref}</p>
          </div>
          <div className="text-right">
            <div className="tabular text-2xl font-extrabold" style={{ color }}>
              {hydrated ? Math.round(st.mastery * 100) : '–'}%
            </div>
            <div className="text-[11px] text-muted">章节掌握度</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          {[
            ['已学', `${st.learned}/${st.total}`],
            ['到期', st.due],
            ['薄弱', st.weak],
            ['稳固', st.mature],
          ].map(([l, v]) => (
            <div key={l as string} className="rounded-xl bg-card2 py-2">
              <div className="tabular text-base font-extrabold">{hydrated ? v : '–'}</div>
              <div className="text-[11px] text-muted">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/study?mode=chapter&ch=${ch.id}`}>
            <Button variant="primary" disabled={!hydrated || (st.due === 0 && st.learned === st.total)}>
              <Icon.Play /> 学习本章 {hydrated && st.due + (st.total - st.learned) > 0 && `(${st.due + Math.min(st.total - st.learned, 999)})`}
            </Button>
          </Link>
          <Link href={`/study?mode=chapter&ch=${ch.id}&all=1`}>
            <Button disabled={!hydrated}>全章过一遍</Button>
          </Link>
          <Link href={`/study?mode=cram&ch=${ch.id}&n=20`}>
            <Button variant="ghost" disabled={!hydrated}>
              <Icon.Shuffle /> 随机速刷
            </Button>
          </Link>
        </div>
        <p className="mt-2 text-[11px] text-muted">「学习本章」= 到期 + 全部新卡（不受每日上限约束）；「全章过一遍」额外包含未到期卡片。</p>
      </Card>

      <div className="no-scrollbar mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {chips.map((c) => (
          <button
            key={c.k}
            type="button"
            onClick={() => setFilter(c.k)}
            className={cn('pressable h-9 shrink-0 rounded-full border px-3.5 text-sm font-semibold', filter === c.k ? 'border-transparent bg-ink text-paper' : 'border-line bg-card text-ink-soft')}
          >
            {c.label}
            {c.n != null && hydrated && <span className="ml-1 opacity-60">{c.n}</span>}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-5">
        {sections.map(({ sec, cards }) => {
          const list = cards.filter(match);
          if (!list.length) return null;
          return (
            <section key={sec}>
              <div className="mb-1.5 flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-ink-soft">{sec}</h2>
                <Link href={`/study?mode=custom&title=${encodeURIComponent(`${ch.short} · ${sec}`)}&ids=${cards.map((c) => c.id).join(',')}`} className="text-xs font-semibold text-accent-ink">
                  背这一节 ({cards.length})
                </Link>
              </div>
              <Card className="divide-y divide-line overflow-hidden">
                {list.map((c) => {
                  const cs = s.cards[c.id];
                  const lab = stateLabel(cs, now);
                  const r = retrievability(c.id, now, s);
                  return (
                    <button key={c.id} type="button" onClick={() => setOpen(c)} className="flex w-full items-start gap-3 p-3 text-left hover:bg-ink/3">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: !cs || cs.state === 0 ? 'var(--line-strong)' : r != null && r < 0.7 ? 'var(--bad)' : color }} aria-hidden />
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-2 text-[14.5px] leading-snug">{plain(c.q)}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <Chip>{KIND_LABEL[c.k]}</Chip>
                          <Stars n={c.s} />
                          {hydrated && <Chip tone={lab.tone}>{lab.label}</Chip>}
                          {s.flags.includes(c.id) && <Icon.Flag filled className="h-3.5 w-3.5 text-gold" />}
                        </div>
                      </div>
                      <Icon.Right className="mt-1 shrink-0 text-muted" />
                    </button>
                  );
                })}
              </Card>
            </section>
          );
        })}
      </div>

      <CardSheet card={open} onClose={() => setOpen(null)} />
    </div>
  );
}
