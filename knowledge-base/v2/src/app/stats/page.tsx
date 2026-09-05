'use client';

import { useMemo, useState } from 'react';
import { useStoreState, overallStat, streak, heat, forecast, totalsAllTime, todayLog, recentHistory, chapterStat, Rating } from '@/lib/store';
import { chaptersFor, chapterColor, CHAPTER_MAP, CARD_MAP, EXAMS } from '@/data';
import { MathText } from '@/lib/math';
import { fmtDate } from '@/lib/cn';
import { PageTitle, fmtMs, Empty } from '@/components/ui';
import { CardSheet } from '@/components/CardSheet';

const GRADE_LABEL: Record<number, string> = { 1: '忘了', 2: '模糊', 3: '记住', 4: '轻松' };

export default function StatsPage() {
  const s = useStoreState();
  const exam = s.settings.exam;
  const now = useMemo(() => new Date(), []);
  const st = overallStat(now, s);
  const stk = streak(s);
  const hm = heat(119, s);
  const fc = forecast(14, now, s);
  const tot = totalsAllTime(s);
  const log = todayLog(s);
  const hist = recentHistory(40, s);
  const [open, setOpen] = useState<string | null>(null);
  const maxH = Math.max(1, ...hm.map((h) => h.n));
  const maxF = Math.max(1, ...fc);
  const chapters = chaptersFor(exam);
  const empty = tot.n === 0;

  return (
    <div>
      <PageTitle title="统计" sub={`${EXAMS[exam].title} · 只统计写入调度的复习，自测不计入`} />
      {empty ? (
        <Empty title="还没有复习记录" desc="完成一次今日任务或章节学习后，这里会显示真实的复习数据。" />
      ) : (
        <div className="space-y-4">
          <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Tile label="今日复习" value={String(log.n)} sub={log.n ? `忘了 ${log.again} · ${fmtMs(log.ms)}` : ''} />
            <Tile label="连续天数" value={String(stk)} sub={`累计 ${tot.days} 天`} />
            <Tile label="已学 / 总数" value={`${st.learned} / ${st.total}`} sub={`熟练 ${st.mature}`} />
            <Tile label="累计复习" value={String(tot.n)} sub={tot.n ? `遗忘率 ${Math.round((tot.again / tot.n) * 100)}% · ${fmtMs(tot.ms)}` : ''} />
          </section>

          <section className="card px-4 py-4">
            <h2 className="mb-3 text-sm font-semibold">最近 17 周</h2>
            <div className="overflow-x-auto">
              <div className="grid grid-flow-col gap-[3px]" style={{ gridTemplateRows: 'repeat(7, 0.7rem)' }}>
                {hm.map((h) => (
                  <span key={h.d} title={`${h.d}: ${h.n} 张`} className="h-[0.7rem] w-[0.7rem] rounded-[3px]" style={{ background: h.n ? `color-mix(in oklch, var(--accent) ${Math.max(25, Math.round((h.n / maxH) * 100))}%, var(--paper-2))` : 'var(--paper-2)' }} />
                ))}
              </div>
            </div>
          </section>

          <section className="card px-4 py-4">
            <h2 className="mb-3 text-sm font-semibold">未来 14 天到期</h2>
            <div className="flex h-24 items-end gap-1">
              {fc.map((n, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1" title={`${n} 张`}>
                  <span className="text-[0.6rem] tabular-nums text-muted">{n || ''}</span>
                  <span className="w-full rounded-t bg-accent/80" style={{ height: `${Math.max(2, (n / maxF) * 64)}px` }} />
                  <span className="text-[0.6rem] text-muted">{i === 0 ? '今' : i === 1 ? '明' : i + 1}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card divide-y divide-line">
            <h2 className="px-4 py-3 text-sm font-semibold">各章可提取率</h2>
            {chapters.map((ch) => {
              const cs = chapterStat(ch.id, now, s);
              const r = cs.avgR;
              return (
                <div key={ch.id} className="flex items-center gap-3 px-4 py-2 text-sm">
                  <span className="h-6 w-1 rounded-full" style={{ background: chapterColor(ch.id) }} />
                  <span className="w-28 shrink-0 truncate">{ch.short}</span>
                  <div className="progress flex-1">
                    <i style={{ width: `${(r ?? 0) * 100}%`, background: r == null ? 'transparent' : r > 0.9 ? 'var(--good)' : r > 0.8 ? 'var(--warn)' : 'var(--bad)' }} />
                  </div>
                  <span className="w-12 text-right text-xs tabular-nums text-muted">{r == null ? '未学' : `${Math.round(r * 100)}%`}</span>
                </div>
              );
            })}
          </section>

          <section className="card">
            <h2 className="px-4 py-3 text-sm font-semibold">最近复习记录</h2>
            <div className="divide-y divide-line">
              {hist.map((h, i) => (
                <button key={`${h.at}-${i}`} type="button" onClick={() => setOpen(h.id)} className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-paper-2/60">
                  <span className={`w-9 shrink-0 text-xs font-semibold ${h.g === Rating.Again ? 'text-bad' : h.g === Rating.Hard ? 'text-warn' : 'text-good'}`}>{GRADE_LABEL[h.g]}</span>
                  <span className="min-w-0 flex-1 truncate">
                    <MathText text={`${CHAPTER_MAP[CARD_MAP[h.id]?.ch ?? '']?.short ?? ''} · ${CARD_MAP[h.id]?.q.split('\n')[0] ?? h.id}`} className="inline" />
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted">{fmtDate(h.at, true)}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
      <CardSheet id={open} onClose={() => setOpen(null)} />
    </div>
  );
}


function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card px-4 py-3">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-0.5 text-xl font-bold tabular-nums tracking-tight">{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  );
}
