'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, Flame, Star, Target, Shuffle, ListOrdered, CalendarClock, Sparkles } from 'lucide-react';
import { EXAMS, CHAPTER_MAP, studyableFor, type Exam } from '@/data';
import { useStore, useHydrated, dueIds, newIds, newRemainingToday, todayLog, streak, overallStat, daysToExam, updateSettings, weakIds, leechIds, heat, type Order } from '@/lib/store';
import { Button, Segmented, Section, Progress, useMotionOn } from '@/components/ui';
import { motion } from 'motion/react';
import { cn, fmtMs, heatLevel as level } from '@/lib/cn';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useStore((st) => st);
  const motionOn = useMotionOn();
  const exam = s.settings.exam;

  const data = useMemo(() => {
    if (!hydrated) return null;
    const now = new Date();
    const due = dueIds(now, undefined, s).length;
    const fresh = Math.min(newIds(undefined, s).length, newRemainingToday(s));
    const log = todayLog(s);
    const st = overallStat(now, s);
    const cursor = s.cursor[exam];
    const all = studyableFor(exam);
    const cursorCard = all[cursor];
    return { due, fresh, log, st, streak: streak(s), left: daysToExam(now, s.settings), weak: weakIds(30, now, s).length, leech: leechIds(s).length, flags: s.flags.filter((id) => all.some((c) => c.id === id)).length, cursor, cursorCard, total: all.length, heat: heat(14, s) };
  }, [hydrated, s, exam]);

  if (!data) return <HomeSkeleton />;

  const todayTotal = data.due + data.fresh;
  const doneToday = data.log.n;
  const pct = data.st.knowledge ? data.st.kLearned / data.st.knowledge : 0;

  return (
    <div>
      <header className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold leading-8 tracking-[-0.01em] sm:text-2xl">今日</h1>
          <p className="mt-0.5 text-sm text-muted">
            {EXAMS[exam].title} · 距考试 {data.left > 0 ? `${data.left} 天` : '已结束'}
            {data.streak > 0 ? ` · 连续 ${data.streak} 天` : ''}
          </p>
        </div>
        <Segmented<Exam> ariaLabel="考试模式" value={exam} onValueChange={(v) => updateSettings({ exam: v })} options={[{ value: 'm2', label: '数二' }, { value: 'm1', label: '数一' }]} size="sm" />
      </header>

      {/* 今日任务 */}
      <motion.section initial={motionOn ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="card mb-4 overflow-hidden">
        <div className="px-5 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-wide text-muted">今日任务</div>
              <div className="tnum mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight">{todayTotal}</span>
                <span className="text-sm text-muted">张</span>
              </div>
              <div className="mt-1 text-sm text-muted">
                待复习 {data.due} · 新卡 {data.fresh}
                {doneToday > 0 ? ` · 今天已评分 ${doneToday} 次` : ''}
              </div>
            </div>
            <Segmented<Order> ariaLabel="出题顺序" value={s.settings.order} onValueChange={(v) => updateSettings({ order: v })} size="sm" options={[{ value: 'random', label: <span className="inline-flex items-center gap-1"><Shuffle className="size-3.5" />随机</span> }, { value: 'sequential', label: <span className="inline-flex items-center gap-1"><ListOrdered className="size-3.5" />顺序</span> }]} />
          </div>
        </div>
        <div className="flex items-center gap-2 px-5 pb-5 pt-4">
          {todayTotal > 0 ? (
            <Button variant="primary" size="lg" className="flex-1 sm:flex-none sm:px-8" onClick={() => router.push('/study?mode=daily')}>
              开始学习
              <ArrowRight />
            </Button>
          ) : (
            <div className="flex h-12 flex-1 items-center text-sm text-muted">今日任务已完成。可以从章节主动学习，或做一轮自测。</div>
          )}
          {doneToday > 0 && (
            <div className="tnum ml-auto hidden text-right text-xs text-muted sm:block">
              {fmtMs(data.log.ms)}
              {data.log.again > 0 ? ` · 忘了 ${data.log.again}` : ''}
            </div>
          )}
        </div>
      </motion.section>

      {/* 进度 */}
      <Section title="掌握进度" aside={<Link href="/stats" className="text-xs font-medium text-accent">详细统计</Link>}>
        <div className="card px-5 py-4">
          <div className="flex items-baseline justify-between">
            <div className="tnum text-sm">
              <span className="text-xl font-semibold">{data.st.kLearned}</span>
              <span className="text-muted"> / {data.st.knowledge} 个知识点已学</span>
            </div>
            <div className="tnum text-xs text-muted">稳固 {data.st.kMastered}</div>
          </div>
          <Progress value={pct} className="mt-3" />
          <div className="tnum mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            <span>卡片 {data.st.learned} / {data.st.cards}</span>
            <span>到期 {data.st.due}</span>
            {data.st.excluded > 0 && <span>待确认 / 拓展 {data.st.excluded}（不进队列）</span>}
          </div>
        </div>
      </Section>

      {/* 快捷入口 */}
      <Section title="练习">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Quick href="/study?mode=weak" icon={Target} label="薄弱点" count={data.weak} disabled={data.weak === 0} />
          <Quick href="/study?mode=flag" icon={Star} label="收藏" count={data.flags} disabled={data.flags === 0} />
          <Quick href="/study?mode=leech" icon={Flame} label="顽固卡片" count={data.leech} disabled={data.leech === 0} />
          <Quick href="/study?mode=all" icon={Sparkles} label={s.settings.order === 'sequential' ? '顺序通读' : '随机自测'} count={data.total} />
        </div>
        {s.settings.order === 'sequential' && data.cursor > 0 && data.cursorCard && (
          <Link href={`/study?mode=all&start=${data.cursor}`} className="card mt-2 flex items-center gap-3 px-4 py-3 text-sm hover:bg-paper-2">
            <CalendarClock className="size-4 shrink-0 text-muted" />
            <span className="min-w-0 flex-1 truncate">
              续读 · {CHAPTER_MAP[data.cursorCard.ch]?.title} · 第 {data.cursor + 1} / {data.total} 张
            </span>
            <ArrowRight className="size-4 shrink-0 text-muted" />
          </Link>
        )}
      </Section>

      {/* 近两周 */}
      <Section title="近 14 天">
        <div className="card px-4 py-3.5">
          <div className="grid grid-cols-14 gap-1" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
            {data.heat.map((d) => (
              <div key={d.d} className={cn('heat-cell')} data-level={level(d.n)} data-before={d.before && d.n === 0} title={`${d.d} · ${d.n} 次`} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-muted">
            <span>{data.heat[0].d.slice(5)}</span>
            <span>今天</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Quick({ href, icon: Icon, label, count, disabled }: { href: string; icon: typeof Target; label: string; count: number; disabled?: boolean }) {
  const inner = (
    <>
      <Icon className="size-[18px] text-muted" />
      <div className="mt-2 text-sm font-medium">{label}</div>
      <div className="tnum text-xs text-muted">{count} 张</div>
    </>
  );
  if (disabled) return <div className="card px-4 py-3.5 opacity-50">{inner}</div>;
  return (
    <Link href={href} className="card px-4 py-3.5 transition-colors hover:bg-paper-2">
      {inner}
    </Link>
  );
}

function HomeSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-5 h-8 w-24 rounded-lg bg-paper-2" />
      <div className="card mb-4 h-40" />
      <div className="card mb-4 h-24" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card h-20" />
        ))}
      </div>
    </div>
  );
}
