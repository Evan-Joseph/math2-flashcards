'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { CHAPTERS, SUBJECTS, SUBJECT_ORDER, chapterColor } from '@/data';
import { chapterStat, useHydrated, useStoreState } from '@/lib/store';
import { Bar, Card, Icon, Ring } from '@/components/ui';
import { cn } from '@/lib/cn';

export default function ChaptersPage() {
  const s = useStoreState();
  const hydrated = useHydrated();
  const stats = useMemo(() => {
    const now = new Date();
    return Object.fromEntries(CHAPTERS.map((c) => [c.id, chapterStat(c.id, now, s)]));
  }, [s]);
  const totals = useMemo(() => {
    const t = { total: 0, learned: 0, due: 0 };
    for (const c of CHAPTERS) {
      t.total += stats[c.id].total;
      t.learned += stats[c.id].learned;
      t.due += stats[c.id].due;
    }
    return t;
  }, [stats]);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
      <header className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">章节</h1>
          <p className="mt-1 text-sm text-muted">
            共 {totals.total} 张 · 已学 {hydrated ? totals.learned : '–'} · 到期 {hydrated ? totals.due : '–'}
          </p>
        </div>
        <Link href="/settings#chapters" className="text-xs font-semibold text-accent-ink">
          调整范围
        </Link>
      </header>

      {SUBJECT_ORDER.map((sub) => {
        const list = CHAPTERS.filter((c) => c.subject === sub);
        return (
          <section key={sub} className="mb-6">
            <h2 className="mb-2 px-1 text-[13px] font-bold tracking-wide text-muted uppercase">{SUBJECTS[sub].title}</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {list.map((c, i) => {
                const st = stats[c.id];
                const enabled = s.settings.chapters.includes(c.id);
                const color = chapterColor(c.id);
                return (
                  <Link key={c.id} href={`/chapters/${c.id}`} className={cn('anim-rise block', !enabled && 'opacity-55')} style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}>
                    <Card className="pressable flex h-full items-center gap-3 p-3.5 hover:border-line-strong">
                      <Ring value={hydrated ? st.mastery : 0} size={52} stroke={5} color={color}>
                        <span className="text-[13px] font-black" style={{ color }}>
                          {c.short.slice(0, 2)}
                        </span>
                      </Ring>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="truncate text-[15px] font-semibold">{c.title}</div>
                          <span className="tabular shrink-0 text-xs text-muted">
                            {hydrated ? st.learned : '–'}/{st.total}
                          </span>
                        </div>
                        <div className="mt-0.5 truncate text-xs text-muted">{c.desc}</div>
                        <Bar value={hydrated ? st.learned / st.total : 0} color={color} className="mt-2 opacity-70" height={4} />
                        <div className="mt-1 flex gap-2 text-[11px]">
                          {!enabled ? (
                            <span className="text-muted">已停用</span>
                          ) : (
                            <>
                              {st.due > 0 && <span className="font-semibold text-bad">{st.due} 到期</span>}
                              {st.weak > 0 && <span className="text-gold">{st.weak} 薄弱</span>}
                              {st.mature > 0 && <span className="text-good">{st.mature} 稳固</span>}
                              {st.learned === 0 && <span className="text-muted">尚未开始</span>}
                            </>
                          )}
                        </div>
                      </div>
                      <Icon.Right className="shrink-0 text-muted" />
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
