'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';
import { syncNow } from '@/lib/sync';
import { closeZoom, renderTex, useZoom } from '@/lib/math';
import { Icon, IconButton } from './ui';

const TABS = [
  { href: '/', label: '今日', icon: Icon.Home },
  { href: '/chapters', label: '章节', icon: Icon.Book },
  { href: '/browse', label: '清单', icon: Icon.Search },
  { href: '/stats', label: '统计', icon: Icon.Chart },
  { href: '/settings', label: '设置', icon: Icon.Gear },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const theme = useStore((s) => s.settings.theme);
  const fontScale = useStore((s) => s.settings.fontScale);
  const mathScale = useStore((s) => s.settings.mathScale);
  const motion = useStore((s) => s.settings.motion);
  const syncCode = useStore((s) => s.sync.code);
  const immersive = pathname.startsWith('/study');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'auto' && mq.matches);
      document.documentElement.classList.toggle('dark', dark);
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#1a1b1f' : '#f8f7f4');
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
    document.documentElement.style.setProperty('--math-scale', String(mathScale));
    document.documentElement.classList.toggle('no-motion', !motion);
  }, [fontScale, mathScale, motion]);

  /* 启动 / 回到前台时同步 */
  useEffect(() => {
    if (!syncCode) return;
    void syncNow();
    const onVis = () => document.visibilityState === 'visible' && void syncNow();
    const onOnline = () => void syncNow();
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('online', onOnline);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('online', onOnline);
    };
  }, [syncCode]);

  return (
    <div className="min-h-dvh">
      <div className={cn('mx-auto flex w-full max-w-6xl', !immersive && 'md:gap-6 md:px-6')}>
        {!immersive && (
          <aside className="sticky top-0 hidden h-dvh w-52 shrink-0 flex-col py-8 md:flex">
            <Link href="/" className="mb-8 flex items-center gap-2 px-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-lg font-black text-white">∫</span>
              <div className="leading-tight">
                <div className="text-[15px] font-extrabold">数学二识记</div>
                <div className="text-[11px] text-muted">FSRS 间隔复习</div>
              </div>
            </Link>
            <nav className="flex flex-col gap-1" aria-label="主导航">
              {TABS.map((t) => {
                const active = t.href === '/' ? pathname === '/' : pathname.startsWith(t.href);
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn('pressable flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium', active ? 'bg-accent-soft text-accent-ink' : 'text-ink-soft hover:bg-ink/5')}
                  >
                    <t.icon />
                    {t.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto px-3 text-[11px] leading-relaxed text-muted">
              <p>数据保存在本机浏览器；开启同步码后可跨设备合并。</p>
            </div>
          </aside>
        )}
        <main className={cn('min-w-0 flex-1', !immersive && 'pb-24 md:pb-10')}>{children}</main>
      </div>

      {!immersive && (
        <nav className="safe-b fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/85 backdrop-blur-xl md:hidden" aria-label="主导航">
          <ul className="mx-auto grid max-w-lg grid-cols-5">
            {TABS.map((t) => {
              const active = t.href === '/' ? pathname === '/' : pathname.startsWith(t.href);
              return (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn('flex h-[58px] flex-col items-center justify-center gap-0.5 text-[10.5px] font-semibold', active ? 'text-accent-ink' : 'text-muted')}
                  >
                    <span className={cn('grid h-7 w-12 place-items-center rounded-full transition-colors', active && 'bg-accent-soft')}>
                      <t.icon />
                    </span>
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
      <FormulaZoom />
    </div>
  );
}

function FormulaZoom() {
  const z = useZoom();
  useEffect(() => {
    if (!z) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeZoom();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [z]);
  if (!z) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-paper/95 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="公式放大" onClick={closeZoom}>
      <IconButton label="关闭" onClick={closeZoom} className="absolute top-3 right-3 bg-card shadow-card">
        <Icon.X />
      </IconButton>
      <div className="zoom-view anim-pop w-full max-w-5xl overflow-x-auto rounded-2xl bg-card p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
        <div dangerouslySetInnerHTML={{ __html: renderTex(z.tex, true, 'plain') }} />
      </div>
      <p className="absolute bottom-6 text-xs text-muted">左右滑动查看长公式 · 点击空白处关闭</p>
    </div>
  );
}
