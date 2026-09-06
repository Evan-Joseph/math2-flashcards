'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';
import { Home, Layers, Search, BarChart3, Settings2, AlertTriangle } from 'lucide-react';
import { useStore, useSaveError, useHydrated } from '@/lib/store';
import { EXAMS } from '@/data';
import { closeZoom, renderTex, useZoom } from '@/lib/math';
import { cn } from '@/lib/cn';
import { Dialog, useMediaQuery } from './ui';
import { SW } from './SW';

const NAV = [
  { href: '/', label: '今日', icon: Home },
  { href: '/chapters', label: '章节', icon: Layers },
  { href: '/browse', label: '检索', icon: Search },
  { href: '/stats', label: '统计', icon: BarChart3 },
  { href: '/settings', label: '设置', icon: Settings2 },
];

function useApplyPrefs() {
  const settings = useStore((s) => s.settings);
  const dark = useMediaQuery('(prefers-color-scheme: dark)');
  useEffect(() => {
    const root = document.documentElement;
    const isDark = settings.theme === 'dark' || (settings.theme === 'auto' && dark);
    root.classList.toggle('dark', isDark);
    root.classList.toggle('motion-on', settings.motion === 'on');
    root.classList.toggle('motion-off', settings.motion === 'off');
    root.style.setProperty('--font-scale', String(settings.fontScale));
    root.style.setProperty('--math-scale', String(settings.mathScale));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#1b1c22' : '#f7f6f3');
  }, [settings.theme, settings.motion, settings.fontScale, settings.mathScale, dark]);
}

export function Shell({ children }: { children: ReactNode }) {
  useApplyPrefs();
  const pathname = usePathname();
  const exam = useStore((s) => s.settings.exam);
  const saveError = useSaveError();
  const hydrated = useHydrated();
  const study = pathname.startsWith('/study');

  return (
    <div className={cn('min-h-dvh', study && 'study-layout')}>
      {!study && (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-paper/70 backdrop-blur lg:flex">
          <div className="px-5 pb-4 pt-6">
            <Link href="/" className="block">
              <div className="text-[17px] font-semibold tracking-tight">考研数学识记</div>
              <div className="mt-0.5 text-xs text-muted">{hydrated ? `${EXAMS[exam].title} · ${EXAMS[exam].code}` : '\u00a0'}</div>
            </Link>
          </div>
          <nav className="flex flex-col gap-0.5 px-3" aria-label="主导航">
            {NAV.map((n) => {
              const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} aria-current={active ? 'page' : undefined} className={cn('flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors', active ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-paper-2 hover:text-ink')}>
                  <n.icon className="size-[18px]" strokeWidth={2} />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto px-5 pb-5 text-[11px] leading-5 text-muted">
            本地优先 · 数据保存在此浏览器
          </div>
        </aside>
      )}

      <div className={cn(!study && 'lg:pl-64')}>
        {saveError && (
          <div role="alert" className="sticky top-0 z-30 flex items-center gap-2 bg-bad-soft px-4 py-2 text-sm text-bad">
            <AlertTriangle className="size-4 shrink-0" />
            本地存储写入失败：{saveError}。请检查浏览器隐私模式或存储空间。
          </div>
        )}
        <main className={cn('mx-auto w-full', study ? '' : 'max-w-3xl px-4 pb-[calc(var(--nav-h)+var(--sab)+1.5rem)] pt-[calc(var(--sat)+1.25rem)] sm:px-6 lg:max-w-4xl lg:pb-12 lg:pt-8')}>{children}</main>
      </div>

      {!study && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/92 backdrop-blur-md lg:hidden" aria-label="主导航" style={{ paddingBottom: 'var(--sab)' }}>
          <ul className="mx-auto flex h-[var(--nav-h)] max-w-lg items-stretch">
            {NAV.map((n) => {
              const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
              return (
                <li key={n.href} className="flex-1">
                  <Link href={n.href} aria-current={active ? 'page' : undefined} className={cn('flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors', active ? 'text-accent' : 'text-muted')}>
                    <n.icon className="size-[22px]" strokeWidth={active ? 2.25 : 1.9} />
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <ZoomDialog />
      <SW />
      <Toaster position="top-center" offset={16} toastOptions={{ className: '!rounded-xl !border-line !bg-paper !text-ink !shadow-pop', duration: 2600 }} />
    </div>
  );
}

function ZoomDialog() {
  const z = useZoom();
  return (
    <Dialog open={!!z} onOpenChange={(v) => !v && closeZoom()} title="公式" size="lg">
      {z ? (
        <div className="mathtext mt-3 overflow-x-auto py-2" style={{ fontSize: 'calc(1.35rem * var(--math-scale))' }}>
          <div dangerouslySetInnerHTML={{ __html: renderTex(z.tex, true) }} />
        </div>
      ) : null}
    </Dialog>
  );
}
