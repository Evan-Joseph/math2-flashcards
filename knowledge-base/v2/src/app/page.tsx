'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useStoreState, dueIds, newIds, newRemainingToday, streak, todayLog, overallStat, weakIds, daysToExam, updateSettings } from '@/lib/store';
import { chaptersFor, chapterColor, EXAMS, ALL_CARDS, CHAPTER_MAP } from '@/data';
import { chapterStat } from '@/lib/store';
import { ExamSwitch } from '@/components/Shell';
import { Icon, Progress, fmtMs } from '@/components/ui';

export default function Home() {
  const s = useStoreState();
  const exam = s.settings.exam;
  const now = useMemo(() => new Date(), []);
  const due = dueIds(now, undefined, s).length;
  const fresh = Math.min(newIds(undefined, s).length, newRemainingToday(s));
  const newTotal = newIds(undefined, s).length;
  const log = todayLog(s);
  const st = overallStat(now, s);
  const weak = weakIds(30, now, s).length;
  const flagsInExam = s.flags.filter((id) => CHAPTER_MAP[ALL_CARDS.find((c) => c.id === id)?.ch ?? '']).length;
  const days = daysToExam(now, s.settings);
  const chapters = chaptersFor(exam);
  const cursor = s.cursor[exam];
  const stk = streak(s);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">{EXAMS[exam].title} · 代码 {EXAMS[exam].code}</div>
          <h1 className="text-[1.7rem] font-bold tracking-tight">今天</h1>
        </div>
        <div className="md:hidden">
          <ExamSwitch compact />
        </div>
      </div>

      {/* 今日任务 */}
      <section className="card overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-sm text-muted">待复习 · 新卡</div>
              <div className="mt-0.5 text-4xl font-bold tabular-nums tracking-tight">
                {due}
                <span className="mx-1.5 text-2xl text-muted">·</span>
                {fresh}
              </div>
            </div>
            <div className="text-right text-sm text-muted">
              {log.n > 0 ? (
                <>
                  今日已学 <span className="font-semibold text-ink">{log.n}</span> 张 · {fmtMs(log.ms)}
                </>
              ) : (
                '今天还没开始'
              )}
              {stk > 0 && (
                <div className="mt-0.5 flex items-center justify-end gap-1 text-warn">
                  <Icon.Flame size={14} /> 连续 {stk} 天
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/study?mode=daily" className="btn btn-primary min-w-40 flex-1 text-base" aria-disabled={due + fresh === 0}>
              <Icon.Play size={16} /> {due + fresh === 0 ? '今日任务已完成' : '开始今日任务'}
            </Link>
            <Link href="/study?mode=all" className="btn flex-1">
              {s.settings.order === 'random' ? <Icon.Shuffle size={16} /> : <Icon.List size={16} />}
              {s.settings.order === 'random' ? '随机自测' : cursor > 0 ? `顺序续学 · 第 ${cursor + 1} 张` : '顺序通读'}
            </Link>
          </div>
          {newTotal > 0 && fresh === 0 && due === 0 && <p className="mt-3 text-xs text-muted">今天的新卡额度（{s.settings.dailyNew}）已用完；可在章节中继续主动学习，或到设置调整。</p>}
        </div>
        <div className="grid grid-cols-3 divide-x divide-line border-t border-line bg-paper-2/50 text-center text-sm">
          <div className="px-2 py-3">
            <div className="text-lg font-bold tabular-nums">
              {st.learned}
              <span className="text-xs font-medium text-muted"> / {st.total}</span>
            </div>
            <div className="text-xs text-muted">已学</div>
          </div>
          <div className="px-2 py-3">
            <div className="text-lg font-bold tabular-nums">{st.avgR != null ? `${Math.round(st.avgR * 100)}%` : '—'}</div>
            <div className="text-xs text-muted">平均可提取率</div>
          </div>
          <div className="px-2 py-3">
            <div className="text-lg font-bold tabular-nums">{days > 0 ? days : '—'}</div>
            <div className="text-xs text-muted">距考试天数</div>
          </div>
        </div>
      </section>

      {/* 学习方式 */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Link href="/study?mode=weak" className={`card flex items-center gap-3 px-4 py-3 ${weak === 0 ? 'opacity-60' : ''}`}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-bad-soft text-bad font-bold">{weak}</span>
          <span>
            <span className="block text-sm font-semibold">薄弱点</span>
            <span className="block text-xs text-muted">遗忘多、难度高</span>
          </span>
        </Link>
        <Link href="/study?mode=flag" className={`card flex items-center gap-3 px-4 py-3 ${flagsInExam === 0 ? 'opacity-60' : ''}`}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-warn-soft text-warn font-bold">{flagsInExam}</span>
          <span>
            <span className="block text-sm font-semibold">收藏</span>
            <span className="block text-xs text-muted">标记的卡片</span>
          </span>
        </Link>
        <button type="button" onClick={() => updateSettings({ order: s.settings.order === 'random' ? 'sequential' : 'random' })} className="card flex items-center gap-3 px-4 py-3 text-left">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent">{s.settings.order === 'random' ? <Icon.Shuffle size={18} /> : <Icon.List size={18} />}</span>
          <span>
            <span className="block text-sm font-semibold">{s.settings.order === 'random' ? '随机模式' : '顺序模式'}</span>
            <span className="block text-xs text-muted">点按切换</span>
          </span>
        </button>
      </section>

      {/* 章节进度 */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold">章节</h2>
          <Link href="/chapters" className="text-sm text-accent">
            全部
          </Link>
        </div>
        <div className="card divide-y divide-line">
          {chapters.map((ch) => {
            const cs = chapterStat(ch.id, now, s);
            return (
              <Link key={ch.id} href={`/chapters/${ch.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-paper-2/60">
                <span className="h-8 w-1 rounded-full" style={{ background: chapterColor(ch.id) }} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium">{ch.title}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted">
                      {cs.due > 0 && <span className="mr-2 text-bad">{cs.due} 待复习</span>}
                      {cs.learned}/{cs.total}
                    </span>
                  </span>
                  <Progress value={cs.total ? cs.learned / cs.total : 0} className="mt-1.5" color={chapterColor(ch.id)} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
