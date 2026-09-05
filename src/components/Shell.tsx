'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useStore, useSaveError, updateSettings, useHydrated } from '@/lib/store';
import { EXAMS } from '@/data';
import { Icon, ZoomLayer } from './ui';

const NAV = [
  { href: '/', label: '首页', icon: Icon.Home },
  { href: '/chapters', label: '章节', icon: Icon.Book },
  { href: '/browse', label: '检索', icon: Icon.Search },
  { href: '/stats', label: '统计', icon: Icon.Chart },
  { href: '/settings', label: '设置', icon: Icon.Settings },
];

/** 应用主题 / 动效 / 字号到 <html> */
function useApplyPreferences() {
  const s = useStore((st) => st.settings);
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = s.theme === 'dark' || (s.theme === 'auto' && mq.matches);
      root.classList.toggle('dark', dark);
      root.classList.toggle('motion-off', s.motion === 'off');
      root.classList.toggle('motion-on', s.motion === 'on');
      root.style.setProperty('--font-scale', String(s.fontScale));
      root.style.setProperty('--math-scale', String(s.mathScale));
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', dark ? '#1b1c22' : '#f8f7f3');
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [s.theme, s.motion, s.fontScale, s.mathScale]);
}

function useRegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);
}

export function ExamSwitch({ compact }: { compact?: boolean }) {
  const exam = useStore((s) => s.settings.exam);
  return (
    <div className="seg" role="group" aria-label="考试模式">
      {(['m2', 'm1'] as const).map((e) => (
        <button key={e} type="button" aria-pressed={exam === e} onClick={() => updateSettings({ exam: e })} title={EXAMS[e].desc}>
          {compact ? EXAMS[e].short : EXAMS[e].title}
        </button>
      ))}
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  useApplyPreferences();
  useRegisterSW();
  const pathname = usePathname();
  const saveError = useSaveError();
  const hydrated = useHydrated();
  const immersive = pathname.startsWith('/study');

  return (
    <div className="min-h-dvh md:flex">
      {!immersive && (
        <aside className="hidden md:sticky md:top-0 md:flex md:h-dvh md:w-56 md:shrink-0 md:flex-col md:border-r md:border-line md:bg-paper/60 md:px-3 md:py-5">
          <Link href="/" className="mb-6 flex items-center gap-2 px-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-accent-ink font-bold">∫</span>
            <span className="text-base font-bold tracking-tight">考研数学识记</span>
          </Link>
          <nav className="flex flex-col gap-1" aria-label="主导航">
            {NAV.map((n) => {
              const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} aria-current={active ? 'page' : undefined} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', active ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-paper-2')}>
                  <n.icon size={19} />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto px-2">
            <ExamSwitch />
          </div>
        </aside>
      )}
      <div className="min-w-0 flex-1">
        {saveError && (
          <div role="alert" className="bg-bad-soft px-4 py-2 text-center text-sm text-bad">
            本地存储写入失败（{saveError}）。请在设置中导出备份，或清理浏览器空间。
          </div>
        )}
        <main className={cn('mx-auto w-full min-w-0', immersive ? 'max-w-3xl' : 'max-w-3xl px-4 pt-4 pb-24 md:px-8 md:pt-8 md:pb-12')} style={{ visibility: hydrated ? 'visible' : 'hidden' }}>
          {children}
        </main>
      </div>
      {!immersive && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/90 backdrop-blur-md md:hidden safe-b" aria-label="主导航">
          <div className="mx-auto grid max-w-lg grid-cols-5">
            {NAV.map((n) => {
              const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} aria-current={active ? 'page' : undefined} className={cn('flex min-h-[3.4rem] flex-col items-center justify-center gap-0.5 text-[0.68rem] font-medium', active ? 'text-accent' : 'text-muted')}>
                  <n.icon size={22} />
                  {n.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
      <ZoomLayer />
    </div>
  );
}
