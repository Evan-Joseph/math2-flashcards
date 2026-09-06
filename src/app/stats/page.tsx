'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { chaptersFor, CARD_MAP, CHAPTER_MAP, EXAMS, chapterColor } from '@/data';
import { useStore, useHydrated, overallStat, chapterStat, heat, adaptiveHeatDays, firstStudyDay, forecast, totalsAllTime, streak, recentHistory, Rating, State } from '@/lib/store';
import { PageHeader, Section, Stat, Segmented, Progress, Empty } from '@/components/ui';
import { cn, fmtMs, fmtPct, fmtDate, heatLevel } from '@/lib/cn';

type Win = '14' | '35' | '91';

export default function StatsPage() {
  const hydrated = useHydrated();
  const s = useStore((st) => st);
  const exam = s.settings.exam;
  const [win, setWin] = useState<Win | null>(null);

  const data = useMemo(() => {
    if (!hydrated) return null;
    const now = new Date();
    const days = win ? Number(win) : adaptiveHeatDays(s);
    const st = overallStat(now, s);
    const chs = chaptersFor(exam).map((c) => ({ ch: c, st: chapterStat(c.id, now, s) }));
    const totals = totalsAllTime(s);
    const dist = { new: 0, learning: 0, review: 0, mature: 0 };
    // 卡片状态分布（仅可学卡片）
    for (const { st: cs } of chs) {
      dist.new += cs.cards - cs.learned;
      dist.mature += cs.mature;
    }
    let learning = 0;
    for (const [id, c] of Object.entries(s.cards)) {
      const card = CARD_MAP[id];
      if (!card || card.status !== 'ok' || (card.scope === 'm1' && exam === 'm2')) continue;
      if (c.state === State.Learning || c.state === State.Relearning) learning++;
    }
    dist.learning = learning;
    dist.review = Math.max(0, st.learned - dist.mature - learning);
    return { days, st, chs, totals, heat: heat(days, s), first: firstStudyDay(s), forecast: forecast(14, now, s), streak: streak(s), recent: recentHistory(30, s), dist };
  }, [hydrated, s, exam, win]);

  if (!data) return <div className="card h-40 animate-pulse" />;

  const { st } = data;
  const fmax = Math.max(1, ...data.forecast);
  const hasData = data.totals.n > 0;

  return (
    <div>
      <PageHeader title="统计" subtitle={`${EXAMS[exam].title} · 仅统计当前考试模式`} />

      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="唯一知识点" value={`${st.kLearned} / ${st.knowledge}`} sub={`稳固 ${st.kMastered}`} />
        <Stat label="卡片" value={`${st.learned} / ${st.cards}`} sub={`到期 ${st.due} · 稳固 ${st.mature}`} />
        <Stat label="累计复习" value={data.totals.n} sub={hasData ? `${data.totals.days} 个学习日 · ${fmtMs(data.totals.ms)}` : '尚未开始'} />
        <Stat label="平均可提取率" value={fmtPct(st.avgR)} sub={data.streak > 0 ? `连续 ${data.streak} 天` : '按 FSRS 估算'} />
      </div>

      <Section title="卡片状态">
        <div className="card px-5 py-4">
          <div className="flex h-3 overflow-hidden rounded-full bg-paper-2">
            {(['mature', 'review', 'learning'] as const).map((k) => (
              <div key={k} className={cn(k === 'mature' ? 'bg-good' : k === 'review' ? 'bg-accent' : 'bg-warn')} style={{ width: `${st.cards ? (data.dist[k] / st.cards) * 100 : 0}%` }} />
            ))}
          </div>
          <div className="tnum mt-3 grid grid-cols-4 gap-2 text-xs">
            <Legend color="bg-good" label="稳固" n={data.dist.mature} />
            <Legend color="bg-accent" label="复习中" n={data.dist.review} />
            <Legend color="bg-warn" label="学习中" n={data.dist.learning} />
            <Legend color="bg-line-2" label="未学" n={data.dist.new} />
          </div>
        </div>
      </Section>

      <Section
        title="学习记录"
        aside={<Segmented<Win> ariaLabel="时间范围" size="sm" value={String(data.days) as Win} onValueChange={setWin} options={[{ value: '14', label: '2 周' }, { value: '35', label: '5 周' }, { value: '91', label: '13 周' }]} />}
      >
        <div className="card px-4 py-4">
          {data.days === 14 ? (
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
              {data.heat.map((d) => (
                <div key={d.d} className="heat-cell" data-level={heatLevel(d.n)} data-before={d.before && d.n === 0} title={`${d.d} · ${d.n} 次`} />
              ))}
            </div>
          ) : (
            <div className="grid grid-flow-col gap-1 overflow-x-auto" style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}>
              {data.heat.map((d) => (
                <div key={d.d} className="heat-cell w-3 sm:w-3.5" data-level={heatLevel(d.n)} data-before={d.before && d.n === 0} title={`${d.d} · ${d.n} 次`} />
              ))}
            </div>
          )}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted">
            <span>{fmtDate(data.heat[0].d)} – 今天</span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1"><i className="heat-cell inline-block size-2.5" data-before="true" /> 开始前</span>
              <span className="inline-flex items-center gap-1"><i className="heat-cell inline-block size-2.5" data-level="0" /> 未学习</span>
              <span className="inline-flex items-center gap-1"><i className="heat-cell inline-block size-2.5" data-level="2" /> 有复习</span>
            </span>
          </div>
          {data.first && <div className="mt-1 text-[11px] text-muted">首次学习：{fmtDate(data.first, { year: 'numeric', month: 'numeric', day: 'numeric' })}</div>}
        </div>
      </Section>

      <Section title="未来 14 天到期">
        <div className="card px-4 py-4">
          {st.learned === 0 ? (
            <p className="text-sm text-muted">尚无已学卡片，暂无复习预测。</p>
          ) : (
            <>
              <div className="flex h-24 items-end gap-1">
                {data.forecast.map((n, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center justify-end" title={`${i === 0 ? '今天' : `+${i} 天`} · ${n} 张`}>
                    <div className="tnum mb-1 text-[10px] text-muted">{n || ''}</div>
                    <div className={cn('w-full rounded-t', i === 0 ? 'bg-accent' : 'bg-accent/50')} style={{ height: `${(n / fmax) * 72}px`, minHeight: n ? 3 : 0 }} />
                  </div>
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-muted">
                <span>今天</span>
                <span>+13 天</span>
              </div>
            </>
          )}
        </div>
      </Section>

      <Section title="章节">
        <div className="card divide-y divide-line overflow-hidden">
          {data.chs.map(({ ch, st: cs }) => (
            <Link key={ch.id} href={`/chapters/${ch.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-paper-2">
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: chapterColor(ch.id) }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="truncate font-medium">{ch.title}</span>
                  <span className="tnum shrink-0 text-xs text-muted">
                    {cs.kLearned}/{cs.knowledge}
                    {cs.avgR != null ? ` · ${fmtPct(cs.avgR)}` : ''}
                  </span>
                </div>
                <Progress value={cs.knowledge ? cs.kLearned / cs.knowledge : 0} className="mt-1.5 !h-1" color={chapterColor(ch.id)} />
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="最近评分">
        {data.recent.length === 0 ? (
          <Empty title="还没有评分记录" desc="完成一轮今日任务后，这里会显示每次评分。" />
        ) : (
          <ul className="card divide-y divide-line overflow-hidden">
            {data.recent.map((h, i) => {
              const c = CARD_MAP[h.id];
              return (
                <li key={`${h.at}-${i}`} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <span className={cn('w-9 shrink-0 text-center text-xs font-semibold', h.g === Rating.Again ? 'text-bad' : h.g === Rating.Hard ? 'text-warn' : h.g === Rating.Good ? 'text-good' : 'text-accent')}>{h.g === Rating.Again ? '忘了' : h.g === Rating.Hard ? '模糊' : h.g === Rating.Good ? '记住' : '轻松'}</span>
                  <span className="min-w-0 flex-1 truncate">
                    {CHAPTER_MAP[c?.ch ?? '']?.short} · {c?.sec ?? h.id}
                  </span>
                  <span className="tnum shrink-0 text-xs text-muted">
                    {new Date(h.at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Legend({ color, label, n }: { color: string; label: string; n: number }) {
  return (
    <div className="flex items-center gap-1.5 text-muted">
      <span className={cn('size-2 rounded-full', color)} />
      {label} <b className="font-semibold text-ink">{n}</b>
    </div>
  );
}
