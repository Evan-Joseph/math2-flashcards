'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { chaptersFor, chapterColor, SUBJECTS, SUBJECT_ORDER, EXAMS } from '@/data';
import { useStoreState, chapterStat } from '@/lib/store';
import { PageTitle, Progress } from '@/components/ui';
import { ExamSwitch } from '@/components/Shell';

export default function ChaptersPage() {
  const s = useStoreState();
  const exam = s.settings.exam;
  const now = useMemo(() => new Date(), []);
  const chapters = chaptersFor(exam);
  return (
    <div>
      <PageTitle title="章节" sub={`${EXAMS[exam].title} · ${chapters.length} 章`} right={<div className="md:hidden"><ExamSwitch compact /></div>} />
      <div className="space-y-6">
        {SUBJECT_ORDER.map((sub) => {
          const list = chapters.filter((c) => c.subject === sub);
          if (!list.length) return null;
          return (
            <section key={sub}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{SUBJECTS[sub].title}</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {list.map((ch) => {
                  const cs = chapterStat(ch.id, now, s);
                  return (
                    <Link key={ch.id} href={`/chapters/${ch.id}`} className="card flex flex-col gap-2 px-4 py-3 hover:bg-paper-2/60">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 h-7 w-1 rounded-full" style={{ background: chapterColor(ch.id) }} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="truncate font-semibold">{ch.title}</div>
                            <div className="shrink-0 text-xs tabular-nums text-muted">
                              {cs.learned}/{cs.total}
                            </div>
                          </div>
                          <div className="truncate text-xs text-muted">{ch.desc}</div>
                        </div>
                      </div>
                      <Progress value={cs.total ? cs.learned / cs.total : 0} color={chapterColor(ch.id)} />
                      <div className="flex gap-3 text-xs text-muted">
                        {cs.due > 0 ? <span className="text-bad">{cs.due} 待复习</span> : <span>无待复习</span>}
                        <span>{cs.mature} 已熟练</span>
                        {cs.pending > 0 && <span>{cs.pending} 待确认</span>}
                        {ch.scope === 'm1' && <span className="text-accent">仅数一</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
