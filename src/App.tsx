import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { View } from './lib/nav';
import { setOnboarded, updateSettings, useStore } from './lib/store';
import { planChapter, planCustom, planDaily, planFlags, planWeak, type SessionPlan } from './lib/session';
import { Home } from './components/Home';
import { Chapters, ChapterDetail } from './components/Chapters';
import { Sheet } from './components/Sheet';
import { Stats } from './components/Stats';
import { Settings } from './components/Settings';
import { Study } from './components/Study';
import { Button, Icon } from './components/ui';
import { cn } from './utils/cn';

const TABS: { key: View['name']; label: string; icon: (p: { className?: string }) => React.ReactNode; to: View }[] = [
  { key: 'home', label: '今日', icon: Icon.Home, to: { name: 'home' } },
  { key: 'chapters', label: '章节', icon: Icon.Book, to: { name: 'chapters' } },
  { key: 'sheet', label: '清单', icon: Icon.List, to: { name: 'sheet' } },
  { key: 'stats', label: '统计', icon: Icon.Chart, to: { name: 'stats' } },
  { key: 'settings', label: '设置', icon: Icon.Gear, to: { name: 'settings' } },
];

export default function App() {
  const [view, setView] = useState<View>({ name: 'home' });
  const stackRef = useRef<View[]>([]);
  const theme = useStore((s) => s.settings.theme);
  const fontScale = useStore((s) => s.settings.fontScale);
  const onboarded = useStore((s) => s.onboarded);

  /* 主题 */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'auto' && mq.matches);
      document.documentElement.classList.toggle('dark', dark);
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#121315' : '#f7f5f0');
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
  }, [fontScale]);

  const go = useCallback(
    (v: View) => {
      // 顶级 Tab 之间切换不入栈，避免「返回」在 Tab 间来回
      const isTab = (x: View) => TABS.some((t) => t.key === x.name);
      if (!(isTab(v) && isTab(view))) stackRef.current = [...stackRef.current, view].slice(-20);
      setView(v);
      window.scrollTo({ top: 0 });
    },
    [view],
  );

  const back = useCallback(() => {
    const prev = stackRef.current[stackRef.current.length - 1] ?? { name: 'home' };
    stackRef.current = stackRef.current.slice(0, -1);
    setView(prev);
    window.scrollTo({ top: 0 });
  }, []);

  /* 会话计划（进入 study 时构建一次） */
  const plan: SessionPlan | null = useMemo(() => {
    if (view.name === 'study') {
      if (view.plan === 'daily') return planDaily();
      if (view.plan === 'weak') return planWeak(20);
      return planFlags();
    }
    if (view.name === 'study-chapter') return planChapter(view.ch, view.all);
    if (view.name === 'study-custom') return planCustom(view.title, view.ids);
    return null;
  }, [view]);

  const studying = plan !== null;
  const tabKey: View['name'] = view.name === 'chapter' ? 'chapters' : view.name;

  return (
    <div className="min-h-dvh bg-paper text-ink">
      {!studying && (
        <header className="sticky top-0 z-30 hidden border-b border-line/70 bg-paper/80 backdrop-blur sm:block">
          <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
            <button onClick={() => go({ name: 'home' })} className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink font-serif text-sm font-bold text-paper">∫</span>
              <span className="font-semibold tracking-tight">数学二 · 识记</span>
            </button>
            <nav className="flex items-center gap-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => go(t.to)}
                  className={cn('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition', tabKey === t.key ? 'bg-card2 font-medium text-ink' : 'text-muted hover:text-ink')}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        </header>
      )}

      <main key={view.name + ('id' in view ? view.id : '') + ('ch' in view ? view.ch ?? '' : '')}>
        {plan ? (
          <Study plan={plan} onExit={back} />
        ) : view.name === 'home' ? (
          <Home go={go} />
        ) : view.name === 'chapters' ? (
          <Chapters go={go} />
        ) : view.name === 'chapter' ? (
          <ChapterDetail id={view.id} go={go} back={back} />
        ) : view.name === 'sheet' ? (
          <Sheet ch={view.ch} q={view.q} go={go} />
        ) : view.name === 'stats' ? (
          <Stats go={go} />
        ) : (
          <Settings />
        )}
      </main>

      {!studying && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-paper/90 backdrop-blur sm:hidden">
          <div className="grid grid-cols-5 pb-safe pt-1">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => go(t.to)} className={cn('flex flex-col items-center gap-0.5 py-1.5 text-[11px]', tabKey === t.key ? 'text-accent' : 'text-muted')}>
                <t.icon className="h-5 w-5" />
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      {!onboarded && <Onboarding />}
    </div>
  );
}

/* ---------- 首次引导 ---------- */
function Onboarding() {
  const [step, setStep] = useState(0);
  const [daily, setDaily] = useState(15);
  const steps = [
    {
      emoji: '🧠',
      title: '先想，再看',
      body: '每张卡片先在心里作答，再显示答案。「努力回忆」这个动作本身，就是记忆被写牢的过程；只是反复看，会产生「熟悉感」的错觉。',
    },
    {
      emoji: '⏱️',
      title: '如实评分，算法安排复习',
      body: '看完答案后选择「忘了 / 模糊 / 记得 / 轻松」。FSRS 算法会据此预测你何时会忘，在最合适的时间再次安排——你只需要每天打开，做完今日任务。',
    },
    {
      emoji: '🎯',
      title: '设定你的节奏',
      body: '每天学多少新知识？全库约 280 张卡，覆盖数学二高数与线代所有必背结论。可随时在设置中调整。',
    },
  ];
  const s = steps[step];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl">
        <div className="text-4xl">{s.emoji}</div>
        <h2 className="mt-3 text-xl font-bold">{s.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
        {step === 2 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              [10, '稳步', '约 4 周学完'],
              [15, '推荐', '约 3 周学完'],
              [25, '冲刺', '约 2 周学完'],
            ].map(([n, label, sub]) => (
              <button
                key={n}
                onClick={() => setDaily(Number(n))}
                className={cn('rounded-2xl border p-3 text-left transition', daily === n ? 'border-accent bg-accent-soft' : 'border-line hover:border-ink/20')}
              >
                <div className="text-lg font-bold tabular-nums">
                  {n}
                  <span className="text-xs font-normal text-muted"> 张/天</span>
                </div>
                <div className="text-xs font-medium">{label}</div>
                <div className="text-[10px] text-muted">{sub}</div>
              </button>
            ))}
          </div>
        )}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <span key={i} className={cn('h-1.5 rounded-full transition-all', i === step ? 'w-5 bg-accent' : 'w-1.5 bg-line')} />
            ))}
          </div>
          <div className="flex gap-2">
            {step < steps.length - 1 ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setOnboarded()}>
                  跳过
                </Button>
                <Button size="sm" onClick={() => setStep(step + 1)}>
                  下一步
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  updateSettings({ dailyNew: daily });
                  setOnboarded();
                }}
              >
                开始学习
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
