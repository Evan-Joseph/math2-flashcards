'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { chaptersFor, SUBJECTS, SUBJECT_ORDER, EXAMS, chapterColor, type Subject } from '@/data';
import { useStore, useHydrated, chapterStat } from '@/lib/store';
import { PageHeader, Section, Progress } from '@/components/ui';

export default function ChaptersPage() {
  const hydrated = useHydrated();
  const s = useStore((st) => st);
  const exam = s.settings.exam;
  const chapters = chaptersFor(exam);

  return (
    <div>
      <PageHeader title="章节" subtitle={`${EXAMS[exam].title} · ${chapters.length} 章`} />
      {SUBJECT_ORDER.map((sub: Subject) => {
        const list = chapters.filter((c) => c.subject === sub);
        if (!list.length) return null;
        return (
          <Section key={sub} title={SUBJECTS[sub].title}>
            <div className="card divide-y divide-line overflow-hidden">
              {list.map((ch) => {
                const st = hydrated ? chapterStat(ch.id, new Date(), s) : null;
                const pct = st && st.knowledge ? st.kLearned / st.knowledge : 0;
                return (
                  <Link key={ch.id} href={`/chapters/${ch.id}`} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-paper-2">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: chapterColor(ch.id) }} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="truncate text-[15px] font-medium">{ch.title}</div>
                        {st && (
                          <div className="tnum shrink-0 text-xs text-muted">
                            {st.kLearned}/{st.knowledge} 知识点
                            {st.due > 0 ? <span className="ml-1.5 text-warn">· 到期 {st.due}</span> : null}
                          </div>
                        )}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-muted">{ch.desc}</div>
                      <Progress value={pct} className="mt-2 !h-1" color={chapterColor(ch.id)} />
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted" />
                  </Link>
                );
              })}
            </div>
          </Section>
        );
      })}
    </div>
  );
}
