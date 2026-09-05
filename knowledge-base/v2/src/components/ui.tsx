'use client';

import { useEffect, useRef, type ReactNode, type SVGProps } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/cn';
import { renderTex, useZoom, closeZoom } from '@/lib/math';
import { useStore } from '@/lib/store';

/* ---------------- Icons ---------------- */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };
const base = (p: IconProps) => ({
  width: p.size ?? 20,
  height: p.size ?? 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});
export const Icon = {
  Home: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
  Book: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z" />
      <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
    </svg>
  ),
  Search: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  Chart: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  ),
  Settings: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
  Star: (p: IconProps & { filled?: boolean }) => (
    <svg {...base(p)} {...p} fill={p.filled ? 'currentColor' : 'none'}>
      <path d="m12 3 2.7 5.6 6.1.8-4.4 4.3 1.1 6.1L12 17l-5.5 2.8 1.1-6.1L3.2 9.4l6.1-.8z" />
    </svg>
  ),
  Back: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  ),
  Close: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  Undo: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
    </svg>
  ),
  Bulb: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2.2h5c.1-1 .5-1.7 1.1-2.2A6 6 0 0 0 12 3z" />
    </svg>
  ),
  Shuffle: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  ),
  List: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  ),
  Play: (p: IconProps) => (
    <svg {...base(p)} {...p} fill="currentColor" stroke="none">
      <path d="M7 4.5v15l12-7.5z" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  ),
  Info: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  ),
  Chevron: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
  Flame: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <path d="M12 3s1 3 3.5 5.5S19 13 19 15a7 7 0 0 1-14 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3 1-6 3-10.5z" />
    </svg>
  ),
  Link: (p: IconProps) => (
    <svg {...base(p)} {...p}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </svg>
  ),
};

/* ---------------- Motion helpers ---------------- */
export function useMotionOn() {
  const setting = useStore((s) => s.settings.motion);
  const reduced = useReducedMotion();
  if (setting === 'off') return false;
  if (setting === 'on') return true;
  return !reduced;
}

/* ---------------- Sheet ---------------- */
export function Sheet({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; wide?: boolean }) {
  const motionOn = useMotionOn();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey, true);
    document.body.style.overflow = 'hidden';
    setTimeout(() => ref.current?.focus(), 30);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: motionOn ? 0.18 : 0 }} onClick={onClose} />
          <motion.div
            ref={ref}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className={cn('relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-paper shadow-pop outline-none sm:max-h-[86dvh] sm:rounded-2xl', wide ? 'sm:max-w-3xl' : 'sm:max-w-xl')}
            initial={motionOn ? { y: 40, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            exit={motionOn ? { y: 40, opacity: 0 } : { opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <div className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-2">{title}</div>
              <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label="关闭">
                <Icon.Close />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 safe-b">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ---------------- 公式放大层 ---------------- */
export function ZoomLayer() {
  const z = useZoom();
  useEffect(() => {
    if (!z) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeZoom();
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [z]);
  if (!z || typeof document === 'undefined') return null;
  const html = renderTex(z.tex, true);
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="放大公式" onClick={closeZoom}>
      <div className="max-h-[90dvh] w-full max-w-4xl overflow-auto rounded-2xl bg-paper p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
        <div className="mathtext" style={{ fontSize: '1.6rem' }} dangerouslySetInnerHTML={{ __html: html }} />
        <div className="mt-4 flex justify-end">
          <button type="button" className="btn" onClick={closeZoom}>
            关闭
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ---------------- 小组件 ---------------- */
export function Chip({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={cn('chip', className)} style={style}>
      {children}
    </span>
  );
}

export function Progress({ value, className, color }: { value: number; className?: string; color?: string }) {
  return (
    <div className={cn('progress', className)} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${Math.min(100, Math.max(0, value * 100))}%`, background: color }} />
    </div>
  );
}

export function Empty({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-10 text-center">
      <div className="text-base font-semibold">{title}</div>
      {desc && <div className="max-w-sm text-sm text-muted">{desc}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function PageTitle({ title, sub, right }: { title: ReactNode; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[1.6rem] font-bold tracking-tight">{title}</h1>
        {sub && <div className="mt-0.5 text-sm text-muted">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

export function fmtMs(ms: number) {
  const m = Math.round(ms / 60000);
  if (m < 1) return '<1 分钟';
  if (m < 60) return `${m} 分钟`;
  return `${Math.floor(m / 60)} 小时 ${m % 60} 分`;
}
