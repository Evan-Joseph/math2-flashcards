'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CHAPTERS, CHAPTER_MAP, chapterColor } from '@/data';
import { useStoreState, useHydrated, dueIds, newIds, newRemainingToday, todayLog, overallStat, chapterStat, daysToExam, forecast, leechIds, setOnboarded, updateSettings } from '@/lib/store';
import { Button, Card, Chip, Icon, Ring, Bar, SectionTitle, Sheet } from '@/components/ui';
import { cn } from '@/lib/cn';

export default function HomePage() {
  const s = useStoreState();
  const hydrated = useHydrated();
  const [showHelp, setShowHelp] = useState(false);

  const data = useMemo(() => {
    const now = new Date();
    const due = dueIds(now, undefined, s);
    const fresh = newIds(undefined, s).slice(0, newRemainingToday(s));
    const today = todayLog(s);
    const all = overallStat(now, s);
    const left = daysToExam(now, s.settings);
    const fc = forecast(7, now, s);
    const chapters = CHAPTERS.filter((c) => s.settings.chapters.includes(c.id))
      .map((c) => ({ c, st: chapterStat(c.id, now, s) }))
      .sort((a, b) => b.st.due - a.st.due || a.st.mastery - b.st.mastery)
      .slice(0, 4);
    return { due, fresh, today, all, left, fc, chapters, leech: leechIds(s).length, flags: s.flags.length };
  }, [s]);

  const total = data.due.length + data.fresh.length;
  const doneToday = data.today.n;
  const dayGoal = doneToday + total;
  const progress = dayGoal ? doneToday / dayGoal : 1;
  const hour = new Date().getHours();
  const greet = hour < 6 ? '夜深了' : hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{greet}，今天也先回忆再揭示</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight md:text-3xl">数学二识记</h1>
        </div>
        <div className="flex items-center gap-2">
          {data.all.streak > 0 && (
            <Chip tone="gold" className="h-8 px-3 text-xs">
              <Icon.Fire className="h-4 w-4" /> 连续 {data.all.streak} 天
            </Chip>
          )}
          <button type="button" onClick={() => setShowHelp(true)} className="pressable grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-muted" aria-label="使用说明">
            <Icon.Info />
          </button>
        </div>
      </header>

      {/* 今日任务 */}
      <Card className="anim-rise relative overflow-hidden p-5">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_60%)]" aria-hidden />
        <div className="relative flex items-center gap-5">
          <Ring value={hydrated ? progress : 0} size={84} stroke={8}>
            <div className="text-center leading-none">
              <div className="tabular text-xl font-extrabold">{hydrated ? doneToday : '–'}</div>
              <div className="mt-0.5 text-[10px] text-muted">已复习</div>
            </div>
          </Ring>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold">今日任务</h2>
            {!hydrated ? (
              <p className="mt-1 text-sm text-muted">正在读取本地进度…</p>
            ) : total === 0 ? (
              <p className="mt-1 text-sm text-muted">{doneToday > 0 ? '今日任务已全部完成，可以做薄弱突击或随机速刷巩固。' : '暂无到期卡片。去章节页开始学习新卡吧。'}</p>
            ) : (
              <p className="mt-1 text-sm text-muted">
                <span className="font-semibold text-ink">{data.due.length}</span> 张到期 · <span className="font-semibold text-ink">{data.fresh.length}</span> 张新卡
                {data.fc[1] > 0 && <span className="ml-1 text-muted/80">· 明天 {data.fc[1]}</span>}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/study?mode=daily" className={cn(total === 0 && 'pointer-events-none')} aria-disabled={total === 0} tabIndex={total === 0 ? -1 : 0}>
                <Button variant="primary" size="lg" disabled={!hydrated || total === 0} className="min-w-36">
                  <Icon.Play /> 开始 {total > 0 && `(${total})`}
                </Button>
              </Link>
              <Link href="/study?mode=cram">
                <Button size="lg" disabled={!hydrated}>
                  <Icon.Shuffle /> 随机速刷
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* 倒计时 + 总览 */}
      <div className="anim-rise delay-1 mt-3 grid grid-cols-3 gap-2">
        <Stat label="距考试" value={hydrated ? (data.left > 0 ? `${data.left} 天` : '加油') : '–'} sub={s.settings.examDate.slice(5).replace('-', '/')} />
        <Stat label="已学卡片" value={hydrated ? `${data.all.learned}` : '–'} sub={`/ ${data.all.total}`} />
        <Stat label="平均记忆率" value={hydrated && data.all.avgR != null ? `${Math.round(data.all.avgR * 100)}%` : '–'} sub={hydrated ? `${data.all.mature} 张已稳固` : ''} />
      </div>

      {/* 模式 */}
      <section className="anim-rise delay-2 mt-6">
        <SectionTitle>专项模式</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <ModeCard href="/study?mode=weak" icon={<Icon.Bolt />} title="薄弱突击" desc="记忆率最低的 20 张" disabled={!hydrated || data.all.learned === 0} tone="bad" />
          <ModeCard href="/study?mode=flag" icon={<Icon.Flag />} title="标记复习" desc={`${data.flags} 张标记卡`} disabled={!hydrated || data.flags === 0} tone="gold" />
          <ModeCard href="/study?mode=leech" icon={<Icon.Fire />} title="顽固卡" desc={data.leech ? `${data.leech} 张反复遗忘` : '暂无，保持'} disabled={!hydrated || data.leech === 0} tone="accent" />
          <ModeCard href="/browse" icon={<Icon.Search />} title="公式速查" desc="按关键词找卡片" tone="good" />
        </div>
      </section>

      {/* 章节 */}
      <section className="anim-rise delay-3 mt-6">
        <SectionTitle
          action={
            <Link href="/chapters" className="text-xs font-semibold text-accent-ink">
              全部章节 →
            </Link>
          }
        >
          最需要关注
        </SectionTitle>
        <div className="flex flex-col gap-2">
          {data.chapters.map(({ c, st }) => (
            <Link key={c.id} href={`/chapters/${c.id}`} className="block">
              <Card className="pressable flex items-center gap-3 p-3 hover:border-line-strong">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-black text-white" style={{ background: chapterColor(c.id) }}>
                  {c.short.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-[15px] font-semibold">{c.title}</div>
                    <div className="tabular shrink-0 text-xs text-muted">
                      {st.learned}/{st.total}
                    </div>
                  </div>
                  <Bar value={st.mastery} color={chapterColor(c.id)} className="mt-1.5" height={5} />
                  <div className="mt-1 flex gap-2 text-[11px] text-muted">
                    {st.due > 0 && <span className="font-semibold text-bad">{st.due} 到期</span>}
                    {st.weak > 0 && <span>{st.weak} 薄弱</span>}
                    {st.learned === 0 && <span>尚未开始</span>}
                  </div>
                </div>
                <Icon.Right className="shrink-0 text-muted" />
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Sheet open={(hydrated && !s.onboarded) || showHelp} onClose={() => (setShowHelp(false), setOnboarded())} title="如何使用">
        <Onboarding
          onDone={() => {
            setShowHelp(false);
            setOnboarded();
          }}
          dailyNew={s.settings.dailyNew}
        />
      </Sheet>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card className="px-3 py-2.5">
      <div className="text-[11px] text-muted">{label}</div>
      <div className="tabular mt-0.5 text-lg font-extrabold leading-tight">{value}</div>
      {sub && <div className="text-[11px] text-muted">{sub}</div>}
    </Card>
  );
}

function ModeCard({ href, icon, title, desc, disabled, tone }: { href: string; icon: React.ReactNode; title: string; desc: string; disabled?: boolean; tone: 'bad' | 'gold' | 'accent' | 'good' }) {
  const toneCls = { bad: 'bg-bad-soft text-bad', gold: 'bg-gold-soft text-gold', accent: 'bg-accent-soft text-accent-ink', good: 'bg-good-soft text-good' }[tone];
  return (
    <Link href={href} className={cn(disabled && 'pointer-events-none opacity-50')} aria-disabled={disabled} tabIndex={disabled ? -1 : 0}>
      <Card className="pressable flex h-full items-center gap-3 p-3 hover:border-line-strong">
        <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', toneCls)}>{icon}</span>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold">{title}</div>
          <div className="truncate text-xs text-muted">{desc}</div>
        </div>
      </Card>
    </Link>
  );
}

function Onboarding({ onDone, dailyNew }: { onDone: () => void; dailyNew: number }) {
  const [n, setN] = useState(dailyNew);
  return (
    <div className="space-y-5 text-[15px] leading-relaxed">
      <ol className="space-y-3">
        <li className="flex gap-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent-ink">1</span>
          <div>
            <b>先回忆，再揭示。</b>看到题面后先在脑中（最好在纸上）写出公式、条件与易错点，再点「显示答案」核对。
          </div>
        </li>
        <li className="flex gap-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent-ink">2</span>
          <div>
            <b>诚实评分。</b>忘了 / 模糊 / 记得 / 轻松 四档，FSRS 会据此安排下次出现时间。宁可评低，也不要高估。
          </div>
        </li>
        <li className="flex gap-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent-ink">3</span>
          <div>
            <b>每天清空到期。</b>到期卡片是记忆即将掉到 90% 以下的卡；每天 10–20 分钟清空它们，比周末一次刷完有效得多。
          </div>
        </li>
      </ol>
      <div className="rounded-2xl bg-card2 p-4">
        <div className="flex items-center justify-between">
          <label htmlFor="ob-new" className="font-semibold">
            每日新卡上限
          </label>
          <span className="tabular text-lg font-extrabold text-accent-ink">{n}</span>
        </div>
        <input id="ob-new" type="range" min={5} max={40} step={5} value={n} onChange={(e) => setN(Number(e.target.value))} className="mt-3" />
        <p className="mt-2 text-xs text-muted">全部近 300 张，每天 15 张约 3 周学完一轮；后续复习量约为新卡量的 3–5 倍。可随时在设置中调整。</p>
      </div>
      <p className="text-xs text-muted">数据保存在本机浏览器。若要在手机与电脑间同步，请在「设置 → 跨设备同步」生成同步码。</p>
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={() => {
          updateSettings({ dailyNew: n });
          onDone();
        }}
      >
        开始使用
      </Button>
    </div>
  );
}
