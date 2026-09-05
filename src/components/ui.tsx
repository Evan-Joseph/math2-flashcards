'use client';

import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';

/* ---------------- Button ---------------- */

type Variant = 'primary' | 'default' | 'ghost' | 'soft' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export function Button({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type="button"
      className={cn(
        'pressable inline-flex items-center justify-center gap-2 rounded-xl font-medium select-none disabled:cursor-not-allowed disabled:opacity-45',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-11 px-4 text-[15px]',
        size === 'lg' && 'h-13 px-5 text-base',
        variant === 'primary' && 'bg-accent text-white shadow-card hover:brightness-110',
        variant === 'default' && 'border border-line bg-card text-ink shadow-card hover:border-line-strong',
        variant === 'ghost' && 'text-ink-soft hover:bg-ink/5',
        variant === 'soft' && 'bg-accent-soft text-accent-ink hover:brightness-97',
        variant === 'danger' && 'bg-bad-soft text-bad hover:brightness-97',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function IconButton({ label, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn('pressable inline-grid h-11 w-11 place-items-center rounded-xl text-ink-soft hover:bg-ink/6 disabled:opacity-40', className)}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---------------- Chip ---------------- */

export function Chip({ children, tone = 'neutral', className, style }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'gold' | 'good' | 'bad' | 'ch'; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      style={style}
      className={cn(
        'inline-flex h-6 items-center gap-1 rounded-full px-2 text-[11px] font-semibold tracking-wide whitespace-nowrap',
        tone === 'neutral' && 'bg-ink/6 text-ink-soft',
        tone === 'accent' && 'bg-accent-soft text-accent-ink',
        tone === 'gold' && 'bg-gold-soft text-gold',
        tone === 'good' && 'bg-good-soft text-good',
        tone === 'bad' && 'bg-bad-soft text-bad',
        tone === 'ch' && 'bg-ch-soft text-ch',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Stars({ n, className }: { n: 1 | 2 | 3; className?: string }) {
  const label = n === 3 ? '必背' : n === 2 ? '重点' : '了解';
  return (
    <span className={cn('inline-flex items-center text-[11px] leading-none tracking-tight text-gold', className)} aria-label={`重要度：${label}`} title={label}>
      <span aria-hidden>{'★'.repeat(n)}</span>
      <span aria-hidden className="opacity-30">
        {'★'.repeat(3 - n)}
      </span>
    </span>
  );
}

/* ---------------- Progress ---------------- */

export function Ring({ value, size = 56, stroke = 6, className, children, color }: { value: number; size?: number; stroke?: number; className?: string; children?: ReactNode; color?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className={cn('relative inline-grid place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color ?? 'var(--accent)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export function Bar({ value, color, className, height = 6 }: { value: number; color?: string; className?: string; height?: number }) {
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-line', className)} style={{ height }} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, value * 100))}%`, background: color ?? 'var(--accent)', transition: 'width 600ms cubic-bezier(.2,.8,.2,1)' }} />
    </div>
  );
}

/* ---------------- Sheet / Modal ---------------- */

export function Sheet({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
      <div className="anim-fade absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn('anim-sheet relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-card shadow-pop outline-none sm:rounded-3xl', wide ? 'sm:max-w-3xl' : 'sm:max-w-lg')}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-card/90 px-5 pt-4 pb-2 backdrop-blur">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-line-strong sm:hidden" aria-hidden />
        </div>
        <div className="flex items-center justify-between px-5 pb-2">
          {title ? <h2 className="text-lg font-bold">{title}</h2> : <span />}
          <IconButton label="关闭" onClick={onClose} className="-mr-2">
            <Icon.X />
          </IconButton>
        </div>
        <div className="safe-b px-5 pb-6">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Section ---------------- */

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 flex items-end justify-between gap-3 px-1">
      <h2 className="text-[13px] font-bold tracking-wide text-muted uppercase">{children}</h2>
      {action}
    </div>
  );
}

export function Card({ children, className, style, onClick, as: Tag = 'div' }: { children: ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void; as?: 'div' | 'button' }) {
  return (
    <Tag
      onClick={onClick}
      style={style}
      className={cn('rounded-2xl border border-line bg-card shadow-card', onClick && 'pressable text-left hover:border-line-strong', className)}
      {...(Tag === 'button' ? { type: 'button' as const } : {})}
    >
      {children}
    </Tag>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="inline-grid h-5 min-w-5 place-items-center rounded border border-line-strong bg-card2 px-1 font-mono text-[10px] text-muted">{children}</kbd>;
}

export function useMotion() {
  return useStore((s) => s.settings.motion);
}

/* ---------------- Icons ---------------- */

const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const Icon = {
  Home: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  Book: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  Search: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  ),
  Chart: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-5 3 3 5-7" />
    </svg>
  ),
  Gear: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
  X: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Back: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Right: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  Flag: (p: { className?: string; filled?: boolean }) => (
    <svg {...base} className={p.className} fill={p.filled ? 'currentColor' : 'none'}>
      <path d="M4 22V4a1 1 0 0 1 1-1h10l1 2h4v11h-9l-1-2H6" />
    </svg>
  ),
  Undo: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
    </svg>
  ),
  Note: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  ),
  Play: (p: { className?: string }) => (
    <svg {...base} {...p} fill="currentColor" stroke="none">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Check: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  Bolt: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9z" />
    </svg>
  ),
  Fire: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M12 22c4.4 0 7-2.9 7-6.6 0-3.2-2-5.3-3.4-6.6.1 2-1 3.2-2 3.2.3-2.6-.9-6-3.6-8 .3 3-1.6 4.3-3 6.4C5.6 12.6 5 14 5 15.4 5 19.1 7.6 22 12 22z" />
    </svg>
  ),
  Sync: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
      <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
      <path d="M3 21v-5h5M21 3v5h-5" />
    </svg>
  ),
  Eye: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Shuffle: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  ),
  Keyboard: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
    </svg>
  ),
  Info: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  Zoom: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  ),
  Trash: (p: { className?: string }) => (
    <svg {...base} {...p}>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  ),
};
