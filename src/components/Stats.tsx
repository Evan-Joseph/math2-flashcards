import { useMemo } from 'react';
import { State } from 'ts-fsrs';
import { CARD_MAP, CHAPTERS, hueVar } from '../data';
import { chapterStat, forecast, heat, overallStat, useStore, weakIds, cardStateOf, retrievability } from '../lib/store';
import type { View } from '../lib/nav';
import { Bar, Button, CountUp, Icon } from './ui';
import { MathText } from '../lib/math';

export function Stats({ go }: { go: (v: View) => void }) {
  const cards = useStore((s) => s.cards);
  const logs = useStore((s) => s.logs);
  const now = new Date();
  const overall = useMemo(() => overallStat(now), [cards, logs]); // eslint-disable-line react-hooks/exhaustive-deps
  const hm = useMemo(() => heat(13 * 7), [logs]); // eslint-disable-line react-hooks/exhaustive-deps
  const hmMax = Math.max(1, ...hm.map((x) => x.n));
  const fc = forecast(14, now);
  const fcMax = Math.max(1, ...fc);
  const weak = weakIds(8, now);
  const totalMs = Object.values(logs).reduce((s, l) => s + l.ms, 0);
  const totalAgain = Object.values(logs).reduce((s, l) => s + l.again, 0);
  const stateCount = { learning: 0, review: 0, relearning: 0 };
  for (const c of Object.values(cards)) {
    if (c.state === State.Learning) stateCount.learning++;
    else if (c.state === State.Review) stateCount.review++;
    else if (c.state === State.Relearning) stateCount.relearning++;
  }
  const stable = Object.values(cards).filter((c) => c.state === State.Review && c.stability >= 21).length;

  // 热力图按周排列（列 = 周，行 = 周几）
  const firstDow = (new Date(hm[0].d).getDay() + 6) % 7; // 周一 = 0
  const cells: ({ d: string; n: number } | null)[] = [...Array(firstDow).fill(null), ...hm];
  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:pt-10">
      <h1 className="text-2xl font-bold tracking-tight">学习统计</h1>
      <p className="mt-1 text-sm text-muted">「掌握度」= 按 FSRS 记忆模型估算的当前可提取概率，会随时间自然衰减，复习后回升。</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="总体掌握" value={<><CountUp value={Math.round(overall.mastery * 100)} />%</>} />
        <Kpi label="累计复习" value={<CountUp value={overall.reviews} />} />
        <Kpi label="连续天数" value={<CountUp value={overall.streak} />} />
        <Kpi label="累计用时" value={`${Math.round(totalMs / 60000)} 分`} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="已学 / 总数" value={`${overall.learned} / ${overall.total}`} small />
        <Kpi label="长期稳固 (≥21天)" value={stable} small />
        <Kpi label="学习中 / 重学中" value={`${stateCount.learning} / ${stateCount.relearning}`} small />
        <Kpi label="历史遗忘率" value={overall.reviews ? `${Math.round((totalAgain / overall.reviews) * 100)}%` : '—'} small />
      </div>

      {/* 热力图 */}
      <section className="mt-7 rounded-2xl border border-line bg-card p-4">
        <h2 className="text-sm font-semibold">最近 13 周</h2>
        <div className="scroll-thin mt-3 overflow-x-auto">
          <div className="flex gap-1">
            {weeks.map((w, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {w.map((c, di) => (
                  <div
                    key={di}
                    className="h-3.5 w-3.5 rounded-[3px]"
                    title={c ? `${c.d}：${c.n} 次` : ''}
                    style={{ backgroundColor: !c ? 'transparent' : c.n === 0 ? 'var(--line)' : `color-mix(in srgb, var(--accent) ${25 + Math.round((c.n / hmMax) * 75)}%, var(--card))` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 到期预测 */}
      <section className="mt-4 rounded-2xl border border-line bg-card p-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">未来 14 天到期</h2>
          <span className="text-xs text-muted">共 {fc.reduce((a, b) => a + b, 0)} 张</span>
        </div>
        <div className="mt-3 flex h-24 items-end gap-1">
          {fc.map((n, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[9px] tabular-nums text-muted">{n || ''}</span>
              <div className="flex w-full flex-1 items-end">
                <div className="w-full rounded-sm bg-accent" style={{ height: `${Math.max(3, (n / fcMax) * 100)}%`, opacity: i === 0 ? 1 : 0.5 }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 章节 */}
      <section className="mt-7">
        <h2 className="mb-3 text-base font-semibold">各章掌握度</h2>
        <div className="space-y-2">
          {CHAPTERS.map((c) => {
            const st = chapterStat(c.id, now);
            const color = hueVar(c.hue);
            return (
              <button key={c.id} onClick={() => go({ name: 'chapter', id: c.id })} className="flex w-full items-center gap-3 rounded-xl border border-line bg-card px-3 py-2.5 text-left hover:border-ink/20">
                <span className="w-24 shrink-0 truncate text-sm font-medium sm:w-40">{c.title}</span>
                <Bar value={st.mastery} color={color} className="flex-1" />
                <span className="w-10 text-right text-xs tabular-nums text-muted">{Math.round(st.mastery * 100)}%</span>
                <span className="hidden w-20 text-right text-xs tabular-nums text-muted sm:inline">
                  {st.learned}/{st.total}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 最薄弱 */}
      {weak.length > 0 && (
        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">最需要加强的知识点</h2>
            <Button size="sm" variant="soft" onClick={() => go({ name: 'study', plan: 'weak' })}>
              <Icon.Bolt className="h-3.5 w-3.5" /> 薄弱突击
            </Button>
          </div>
          <div className="space-y-2">
            {weak.map((id) => {
              const c = CARD_MAP[id];
              const s = cardStateOf(id)!;
              const r = retrievability(id, now) ?? 0;
              return (
                <div key={id} className="rounded-xl border border-line bg-card px-4 py-3">
                  <div className="mb-1 flex items-center gap-2 text-[11px] text-muted">
                    <span style={{ color: hueVar(CHAPTERS.find((x) => x.id === c.ch)!.hue) }}>{CHAPTERS.find((x) => x.id === c.ch)!.short}</span>
                    <span>· {c.sec}</span>
                    <span className="ml-auto">
                      可提取率 {Math.round(r * 100)}% · 遗忘 {s.lapses} 次
                    </span>
                  </div>
                  <div className="line-clamp-2 text-sm">
                    <MathText text={c.q} mode="plain" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function Kpi({ label, value, small }: { label: string; value: React.ReactNode; small?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-3.5">
      <div className={small ? 'text-lg font-bold tabular-nums' : 'text-2xl font-bold tabular-nums'}>{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}
