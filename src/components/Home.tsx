import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CHAPTERS, hueVar } from '../data';
import { chapterStat, forecast, newRemainingToday, overallStat, todayLog, useStore, weakIds, dueIds, newIds } from '../lib/store';
import { Bar, Button, CountUp, Icon, Ring, useMotion } from './ui';
import type { View } from '../lib/nav';

export function Home({ go }: { go: (v: View) => void }) {
  // 订阅 store 变化以刷新统计
  useStore((s) => s.cards);
  useStore((s) => s.logs);
  const flags = useStore((s) => s.flags);
  const settings = useStore((s) => s.settings);
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotion();

  const now = new Date();
  const overall = overallStat(now);
  const due = dueIds(now).length;
  const fresh = Math.min(newRemainingToday(), newIds().length);
  const today = todayLog();
  const weak = weakIds(30).length;
  const fc = forecast(7, now);
  const fcMax = Math.max(1, ...fc);
  const acc = today.n ? Math.round(((today.n - today.again) / today.n) * 100) : null;
  const hour = now.getHours();
  const greet = hour < 6 ? '夜深了，注意休息' : hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';
  const dateStr = now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });

  useGSAP(
    () => {
      if (!motion) return;
      gsap.fromTo('.home-item', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' });
    },
    { scope: ref },
  );

  const nothingDue = due === 0 && fresh === 0;

  return (
    <div ref={ref} className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:pt-10">
      {/* 问候 */}
      <div className="home-item flex items-end justify-between">
        <div>
          <p className="text-sm text-muted">{dateStr}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{greet}</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1.5 text-sm font-semibold text-gold">
          <Icon.Fire className="h-4 w-4" />
          连续 {overall.streak} 天
        </div>
      </div>

      {/* 今日任务 */}
      <section className="home-item mt-6 overflow-hidden rounded-3xl border border-line bg-card shadow-[0_12px_40px_-24px_rgba(0,0,0,0.3)]">
        <div className="paper-grid flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <Ring value={overall.mastery} size={104} stroke={9}>
            <div className="text-center">
              <div className="text-2xl font-bold tabular-nums">
                <CountUp value={Math.round(overall.mastery * 100)} />
                <span className="text-sm">%</span>
              </div>
              <div className="text-[10px] text-muted">总体掌握</div>
            </div>
          </Ring>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">今日任务</h2>
            {nothingDue ? (
              <p className="mt-1 text-sm text-muted">
                {overall.learned === 0 ? '还没有开始。先从预备知识或极限章开始学习新卡片吧。' : '今天的复习已全部完成 🎉 可以提前学新卡，或做一次薄弱突击。'}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted">
                到期复习 <b className="text-ink">{due}</b> 张 · 新知识 <b className="text-ink">{fresh}</b> 张，预计 {Math.max(1, Math.round((due * 0.4 + fresh * 0.9)))} 分钟
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="lg" onClick={() => go({ name: 'study', plan: 'daily' })} disabled={nothingDue}>
                <Icon.Play className="h-4 w-4" />
                开始今日任务
              </Button>
              {nothingDue && (
                <Button size="lg" variant="soft" onClick={() => go({ name: 'chapters' })}>
                  去学新章节
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-line border-t border-line bg-card2/50 text-center text-sm">
          <div className="py-3">
            <div className="text-lg font-bold tabular-nums">{today.n}</div>
            <div className="text-xs text-muted">今日已复习</div>
          </div>
          <div className="py-3">
            <div className="text-lg font-bold tabular-nums">{acc === null ? '—' : `${acc}%`}</div>
            <div className="text-xs text-muted">今日记住率</div>
          </div>
          <div className="py-3">
            <div className="text-lg font-bold tabular-nums">
              {overall.learned}
              <span className="text-xs font-normal text-muted"> / {overall.total}</span>
            </div>
            <div className="text-xs text-muted">已学卡片</div>
          </div>
        </div>
      </section>

      {/* 快捷入口 */}
      <section className="home-item mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Quick icon={<Icon.Bolt className="h-5 w-5" />} title="薄弱突击" sub={weak ? `${weak} 张待加强` : '暂无'} onClick={() => go({ name: 'study', plan: 'weak' })} disabled={!weak} tone="bad" />
        <Quick icon={<Icon.Flag className="h-5 w-5" filled />} title="标记复习" sub={flags.length ? `${flags.length} 张已标记` : '暂无'} onClick={() => go({ name: 'study', plan: 'flag' })} disabled={!flags.length} tone="gold" />
        <Quick icon={<Icon.List className="h-5 w-5" />} title="速记清单" sub="考前扫读" onClick={() => go({ name: 'sheet' })} tone="accent" />
        <Quick icon={<Icon.Book className="h-5 w-5" />} title="章节地图" sub={`${settings.chapters.length} 章已启用`} onClick={() => go({ name: 'chapters' })} tone="good" />
      </section>

      {/* 知识地图 */}
      <section className="home-item mt-7">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold">知识掌握地图</h2>
          <button onClick={() => go({ name: 'stats' })} className="text-xs text-muted hover:text-ink">
            详细统计 →
          </button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {CHAPTERS.filter((c) => settings.chapters.includes(c.id)).map((c) => {
            const st = chapterStat(c.id, now);
            const color = hueVar(c.hue);
            return (
              <button
                key={c.id}
                onClick={() => go({ name: 'chapter', id: c.id })}
                className="flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3 text-left transition hover:border-ink/20 hover:shadow-sm"
              >
                <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{c.title}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted">
                      {st.learned}/{st.total}
                      {st.due > 0 && <span className="ml-1.5 rounded-full bg-bad/10 px-1.5 py-0.5 text-[10px] font-semibold text-bad">{st.due} 到期</span>}
                    </span>
                  </div>
                  <Bar value={st.mastery} color={color} className="mt-2" height={5} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 未来 7 天 */}
      <section className="home-item mt-7 rounded-2xl border border-line bg-card p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">未来 7 天到期预测</h2>
          <span className="text-xs text-muted">共 {fc.reduce((a, b) => a + b, 0)} 张</span>
        </div>
        <div className="flex h-20 items-end gap-2">
          {fc.map((n, i) => {
            const d = new Date(now);
            d.setDate(d.getDate() + i);
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] tabular-nums text-muted">{n || ''}</span>
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full rounded-md bg-accent/80 transition-[height] duration-700" style={{ height: `${Math.max(4, (n / fcMax) * 100)}%`, opacity: i === 0 ? 1 : 0.55 }} />
                </div>
                <span className="text-[10px] text-muted">{i === 0 ? '今' : `${d.getMonth() + 1}/${d.getDate()}`}</span>
              </div>
            );
          })}
        </div>
      </section>

      <p className="home-item mt-8 text-center text-xs text-muted">
        方法：主动回忆 · 间隔重复（FSRS）· 交错练习 · 精细加工。每天 15 分钟，胜过考前突击。
      </p>
    </div>
  );
}

function Quick({ icon, title, sub, onClick, disabled, tone }: { icon: React.ReactNode; title: string; sub: string; onClick: () => void; disabled?: boolean; tone: 'bad' | 'gold' | 'accent' | 'good' }) {
  const tones = {
    bad: 'text-bad bg-bad/10',
    gold: 'text-gold bg-gold-soft',
    accent: 'text-accent bg-accent-soft',
    good: 'text-good bg-good/10',
  };
  return (
    <button onClick={onClick} disabled={disabled} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3 text-left transition hover:border-ink/20 hover:shadow-sm disabled:opacity-50 sm:flex-col sm:items-start">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</span>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted">{sub}</div>
      </div>
    </button>
  );
}
