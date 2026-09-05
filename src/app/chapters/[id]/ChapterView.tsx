'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { notFound } from 'next/navigation';
import { CHAPTER_MAP, sectionsOf, chapterColor, cardInExam, KIND_LABEL, resolveSource, BOOKS } from '@/data';
import { useStoreState, chapterStat, State, retrievability } from '@/lib/store';
import { MathText } from '@/lib/math';
import { relDue } from '@/lib/cn';
import { Icon, Progress, Chip } from '@/components/ui';
import { CardSheet } from '@/components/CardSheet';

export function ChapterView({ id }: { id: string }) {
  const ch = CHAPTER_MAP[id];
  const s = useStoreState();
  const exam = s.settings.exam;
  const now = useMemo(() => new Date(), []);
  const [open, setOpen] = useState<string | null>(null);
  if (!ch) notFound();
  const inExam = cardInExam({ scope: ch.scope } as never, exam);
  const cs = chapterStat(ch.id, now, s);
  const sections = sectionsOf(ch.id, exam);
  const lectures = [...new Set([ch.src, ...Object.values(ch.secSrc ?? {})])].map(resolveSource).filter(Boolean);
  const pendingCount = cs.pending;

  return (
    <div>
      <Link href="/chapters" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <Icon.Back size={16} /> 章节
      </Link>
      <div className="card overflow-hidden">
        <div className="h-1.5" style={{ background: chapterColor(ch.id) }} />
        <div className="px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">{ch.title}</h1>
            {ch.scope === 'm1' && <Chip style={{ background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: 'transparent' }}>仅数学一</Chip>}
          </div>
          <p className="mt-0.5 text-sm text-muted">{ch.desc}</p>
          {!inExam && <p className="mt-2 rounded-lg bg-warn-soft px-3 py-2 text-sm">当前为数学二模式，本章不在考试范围内，不进入复习队列。</p>}
          <div className="mt-3 flex items-center gap-3 text-sm">
            <Progress value={cs.total ? cs.learned / cs.total : 0} className="flex-1" color={chapterColor(ch.id)} />
            <span className="tabular-nums text-muted">
              {cs.learned}/{cs.total}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {cs.due > 0 && <span className="text-bad">{cs.due} 待复习</span>}
            <span>{cs.mature} 已熟练</span>
            {cs.avgR != null && <span>可提取率 {Math.round(cs.avgR * 100)}%</span>}
            {pendingCount > 0 && <span>{pendingCount} 待确认（不进队列）</span>}
          </div>
          {inExam && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/study?mode=chapter&ch=${ch.id}`} className="btn btn-primary">
                <Icon.Play size={14} /> 学习本章
              </Link>
              <Link href={`/study?mode=browse&ch=${ch.id}`} className="btn">
                <Icon.List size={16} /> 顺序通读
              </Link>
            </div>
          )}
          <div className="mt-4 space-y-1 border-t border-line pt-3 text-xs text-muted">
            <div>大纲定位：{ch.ref}</div>
            <div>教材：{ch.book}</div>
            {lectures.map((l) => (
              <div key={l!.lecture.key}>
                {BOOKS[l!.book.id].title.replace('张宇 考研数学基础 30 讲 · ', '30 讲·')} {l!.lecture.title}（{l!.pages}，{l!.pdf}）
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {sections.map((sec) => (
          <section key={sec.sec}>
            <h2 className="mb-2 flex items-baseline justify-between text-sm font-semibold">
              {sec.sec}
              <span className="text-xs font-normal text-muted">{sec.cards.length} 张</span>
            </h2>
            <div className="card divide-y divide-line">
              {sec.cards.map((c) => {
                const st = s.cards[c.id];
                const learned = st && st.state !== State.New;
                const r = learned ? retrievability(c.id, now, s) : null;
                const dueNow = learned && st.due.getTime() <= now.getTime();
                return (
                  <button key={c.id} type="button" onClick={() => setOpen(c.id)} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-paper-2/60">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${c.status === 'pending' ? 'bg-warn' : !learned ? 'bg-line-2' : dueNow ? 'bg-bad' : (r ?? 1) > 0.9 ? 'bg-good' : 'bg-warn'}`} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-[0.95rem]">
                        <MathText text={c.q.split('\n')[0]} className="inline" />
                      </span>
                      <span className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted">
                        <span>{KIND_LABEL[c.k]}</span>
                        {c.s === 3 && <span className="text-bad">必背</span>}
                        {c.scope === 'm1' && ch.scope !== 'm1' && <span className="text-accent">仅数一</span>}
                        {c.status === 'pending' && <span className="text-warn">待确认</span>}
                        {learned && <span>{dueNow ? '已到期' : relDue(st.due, now)}</span>}
                      </span>
                    </span>
                    {s.flags.includes(c.id) && <Icon.Star size={14} filled className="mt-1 shrink-0 text-warn" />}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <CardSheet id={open} onClose={() => setOpen(null)} />
    </div>
  );
}
