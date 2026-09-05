'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ALL_CARDS, CHAPTERS, CARD_MAP, chapterColor } from '@/data';
import { chapterStat, forecast, heat, overallStat, retrievability, useHydrated, useStoreState, State, todayKey } from '@/lib/store';
import { plain } from '@/lib/math';
import { Bar, Card, Chip, SectionTitle } from '@/components/ui';
import { cn } from '@/lib/cn';

interface Cloud {
  totals: { total: number; again: number; avgMs: number; first: string | null };
  dist: { grade: number; n: number }[];
  lapses: { cardId: string; n: number }[];
}

export default function StatsPage() {
  const s = useStoreState();
  const hydrated = useHydrated();
  const [cloud, setCloud] = useState<Cloud | null>(null);

  const d = useMemo(() => {
    const now = new Date();
    const all = overallStat(now, s);
    const fc = forecast(14, now, s);
    const hm = heat(119, s);
    const buckets = [0, 0, 0, 0, 0];
    let learnedCount = 0;
    const stabilities: number[] = [];
    for (const c of ALL_CARDS) {
      const st = s.cards[c.id];
      if (!st || st.state === State.New) continue;
      learnedCount++;
      const r = retrievability(c.id, now, s) ?? 0;
      buckets[Math.min(4, Math.floor(r * 5))]++;
      stabilities.push(st.stability);
    }
    stabilities.sort((a, b) => a - b);
    const medS = stabilities.length ? stabilities[Math.floor(stabilities.length / 2)] : 0;
    const chapters = CHAPTERS.map((c) => ({ c, st: chapterStat(c.id, now, s) }));
    const days = Object.entries(s.logs).sort(([a], [b]) => (a < b ? 1 : -1)).slice(0, 7);
    const today = s.logs[todayKey()];
    return { all, fc, hm, buckets, learnedCount, medS, chapters, days, today };
  }, [s]);

  useEffect(() => {
    if (!s.sync.code) return;
    fetch(`/api/reviews?code=${s.sync.code}`)
      .then((r) => r.json())
      .then((j) => j.ok && setCloud(j))
      .catch(() => {});
  }, [s.sync.code, s.sync.lastSyncAt]);

  const maxFc = Math.max(1, ...d.fc);
  const maxHeat = Math.max(1, ...d.hm.map((x) => x.n));
  const weeks: { d: string; n: number }[][] = [];
  for (let i = 0; i < d.hm.length; i += 7) weeks.push(d.hm.slice(i, i + 7));

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">统计</h1>
        <p className="mt-1 text-sm text-muted">记忆率由 FSRS 按每张卡的稳定性与间隔实时估算。</p>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Num label="累计复习" v={hydrated ? d.all.reviews : '–'} sub={`${d.all.minutes} 分钟`} />
        <Num label="连续天数" v={hydrated ? d.all.streak : '–'} sub={d.today ? `今天 ${d.today.n} 次` : '今天还没学'} />
        <Num label="平均记忆率" v={hydrated && d.all.avgR != null ? `${Math.round(d.all.avgR * 100)}%` : '–'} sub={`目标 ${Math.round(s.settings.retention * 100)}%`} />
        <Num label="中位稳定性" v={hydrated ? `${d.medS.toFixed(1)} 天` : '–'} sub={`${d.all.mature} 张 ≥ 21 天`} />
      </div>

      <section className="mt-6">
        <SectionTitle>最近 17 周</SectionTitle>
        <Card className="p-4">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }} role="img" aria-label="复习热力图">
            {weeks.map((w, wi) => (
              <div key={wi} className="grid gap-1">
                {w.map((x) => {
                  const lvl = x.n === 0 ? 0 : Math.min(4, Math.ceil((x.n / maxHeat) * 4));
                  return <div key={x.d} className={cn('heat-cell', lvl > 0 && `heat-${lvl}`)} title={`${x.d}：${x.n} 次`} />;
                })}
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
            <span>{d.hm[0]?.d.slice(5)}</span>
            <span className="flex items-center gap-1">
              少 <i className="heat-cell !w-2.5" /> <i className="heat-cell heat-1 !w-2.5" /> <i className="heat-cell heat-2 !w-2.5" /> <i className="heat-cell heat-3 !w-2.5" /> <i className="heat-cell heat-4 !w-2.5" /> 多
            </span>
            <span>今天</span>
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <SectionTitle>未来 14 天到期</SectionTitle>
        <Card className="p-4">
          <div className="flex h-28 items-end gap-1">
            {d.fc.map((n, i) => (
              <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${i === 0 ? '今天' : `+${i} 天`}：${n} 张`}>
                <span className="tabular text-[10px] text-muted">{n || ''}</span>
                <div className={cn('w-full rounded-t-md', i === 0 ? 'bg-bad' : 'bg-accent/70')} style={{ height: `${Math.max(n ? 6 : 2, (n / maxFc) * 80)}px` }} />
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-muted">
            <span>今天</span>
            <span>+7</span>
            <span>+13</span>
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <SectionTitle>记忆率分布（已学 {d.learnedCount} 张）</SectionTitle>
        <Card className="p-4">
          {['<20%', '20–40%', '40–60%', '60–80%', '80–100%'].map((l, i) => (
            <div key={l} className="flex items-center gap-3 py-1">
              <span className="tabular w-16 text-xs text-muted">{l}</span>
              <Bar value={d.learnedCount ? d.buckets[i] / d.learnedCount : 0} color={i < 2 ? 'var(--bad)' : i < 4 ? 'var(--gold)' : 'var(--good)'} className="flex-1" />
              <span className="tabular w-8 text-right text-xs">{d.buckets[i]}</span>
            </div>
          ))}
          <p className="mt-2 text-[11px] text-muted">低于 60% 的卡片会优先进入「薄弱突击」。</p>
        </Card>
      </section>

      <section className="mt-6">
        <SectionTitle>章节掌握度</SectionTitle>
        <Card className="divide-y divide-line">
          {d.chapters.map(({ c, st }) => (
            <Link key={c.id} href={`/chapters/${c.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-ink/3">
              <span className="w-14 shrink-0 text-sm font-semibold">{c.short}</span>
              <Bar value={st.mastery} color={chapterColor(c.id)} className="flex-1" />
              <span className="tabular w-12 text-right text-xs text-muted">{Math.round(st.mastery * 100)}%</span>
              <span className="tabular w-14 text-right text-xs text-muted">
                {st.learned}/{st.total}
              </span>
            </Link>
          ))}
        </Card>
      </section>

      <section className="mt-6">
        <SectionTitle>最近 7 天</SectionTitle>
        <Card className="divide-y divide-line">
          {d.days.length === 0 && <p className="p-6 text-center text-sm text-muted">还没有学习记录。</p>}
          {d.days.map(([day, l]) => (
            <div key={day} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className="tabular w-24 font-semibold">{day.slice(5)}</span>
              <span className="tabular text-muted">{l.n} 次</span>
              <span className="tabular text-muted">{l.new} 新</span>
              <span className={cn('tabular ml-auto', l.n && l.again / l.n > 0.3 ? 'text-bad' : 'text-good')}>{l.n ? `${Math.round((1 - l.again / l.n) * 100)}% 记得` : ''}</span>
              <span className="tabular w-14 text-right text-muted">{Math.round(l.ms / 60000)} 分</span>
            </div>
          ))}
        </Card>
      </section>

      <section className="mt-6 mb-4">
        <SectionTitle>云端记录</SectionTitle>
        <Card className="p-4 text-sm">
          {!s.sync.code ? (
            <p className="text-muted">
              未开启同步。在{' '}
              <Link href="/settings" className="font-semibold text-accent-ink">
                设置
              </Link>{' '}
              中生成同步码后，每次评分都会备份到服务器，并可跨设备合并。
            </p>
          ) : !cloud ? (
            <p className="text-muted">正在读取服务器统计…</p>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Chip tone="accent">服务器记录 {cloud.totals.total} 次</Chip>
                <Chip tone={cloud.totals.total && cloud.totals.again / cloud.totals.total > 0.25 ? 'bad' : 'good'}>遗忘率 {cloud.totals.total ? Math.round((cloud.totals.again / cloud.totals.total) * 100) : 0}%</Chip>
                <Chip>平均每卡 {(cloud.totals.avgMs / 1000).toFixed(1)} 秒</Chip>
              </div>
              {cloud.lapses.length > 0 && (
                <div>
                  <div className="mb-1 text-xs font-bold text-muted">最常遗忘</div>
                  <ul className="space-y-1">
                    {cloud.lapses.filter((l) => CARD_MAP[l.cardId]).slice(0, 6).map((l) => (
                      <li key={l.cardId} className="flex items-center gap-2 text-[13px]">
                        <span className="tabular w-8 shrink-0 font-bold text-bad">{l.n}×</span>
                        <span className="line-clamp-1 text-ink-soft">{plain(CARD_MAP[l.cardId].q)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}

function Num({ label, v, sub }: { label: string; v: string | number; sub?: string }) {
  return (
    <Card className="px-3 py-2.5">
      <div className="text-[11px] text-muted">{label}</div>
      <div className="tabular mt-0.5 text-xl font-extrabold leading-tight">{v}</div>
      {sub && <div className="text-[11px] text-muted">{sub}</div>}
    </Card>
  );
}
