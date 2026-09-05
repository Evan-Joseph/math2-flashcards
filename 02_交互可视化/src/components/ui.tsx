import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import gsap from 'gsap';
import { cn } from '../utils/cn';
import { useStore } from '../lib/store';

/* ---------- 动效开关 ---------- */
export function useMotion() {
  const motion = useStore((s) => s.settings.motion);
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return motion && !reduce;
}

/* ---------- 按钮 ---------- */
type Variant = 'primary' | 'ghost' | 'soft' | 'outline' | 'danger';
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' | 'lg' }) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition-[transform,background-color,box-shadow] duration-150 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none select-none';
  const sizes = { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-[15px]', lg: 'h-12 px-6 text-base' };
  const variants: Record<Variant, string> = {
    primary: 'bg-accent text-white shadow-sm shadow-accent/30 hover:brightness-110',
    ghost: 'text-muted hover:bg-card2 hover:text-ink',
    soft: 'bg-accent-soft text-accent hover:brightness-95',
    outline: 'border border-line bg-card text-ink hover:bg-card2',
    danger: 'bg-bad/10 text-bad hover:bg-bad/15',
  };
  return <button className={cn(base, sizes[size], variants[variant], className)} {...rest} />;
}

/* ---------- 标签 ---------- */
export function Chip({ children, className, color }: { children: ReactNode; className?: string; color?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', className)}
      style={color ? { backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`, color } : undefined}
    >
      {children}
    </span>
  );
}

/* ---------- 星级 ---------- */
export function Stars({ n, className }: { n: number; className?: string }) {
  return (
    <span className={cn('inline-flex text-gold', className)} aria-label={`重要度 ${n}`}>
      {[1, 2, 3].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={cn('h-3.5 w-3.5', i > n && 'opacity-20')} fill="currentColor">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8z" />
        </svg>
      ))}
    </span>
  );
}

/* ---------- 进度环 ---------- */
export function Ring({
  value,
  size = 64,
  stroke = 6,
  color = 'var(--accent)',
  children,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: ReactNode;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const ref = useRef<SVGCircleElement>(null);
  const motion = useMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = c * (1 - Math.min(1, Math.max(0, value)));
    if (motion) gsap.to(el, { strokeDashoffset: target, duration: 1, ease: 'power3.out' });
    else el.style.strokeDashoffset = String(target);
  }, [value, c, motion]);
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--line)" strokeWidth={stroke} fill="none" />
        <circle
          ref={ref}
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/* ---------- 数字滚动 ---------- */
export function CountUp({ value, className, suffix }: { value: number; className?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motion = useMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motion) {
      el.textContent = String(Math.round(value));
      return;
    }
    const obj = { v: Number(el.dataset.v ?? 0) };
    gsap.to(obj, {
      v: value,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v));
      },
    });
    el.dataset.v = String(value);
  }, [value, motion]);
  return (
    <span className={className}>
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

/* ---------- 进度条 ---------- */
export function Bar({ value, color = 'var(--accent)', className, height = 6 }: { value: number; color?: string; className?: string; height?: number }) {
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-line/70', className)} style={{ height }}>
      <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%`, backgroundColor: color }} />
    </div>
  );
}

/* ---------- 空状态 ---------- */
export function Empty({ icon, title, desc, action }: { icon: ReactNode; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line px-6 py-12 text-center">
      <div className="text-4xl">{icon}</div>
      <div className="text-base font-semibold">{title}</div>
      {desc && <div className="max-w-xs text-sm text-muted">{desc}</div>}
      {action}
    </div>
  );
}

/* ---------- 图标 ---------- */
export const Icon = {
  Home: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  Book: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    </svg>
  ),
  List: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  ),
  Chart: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-6" />
    </svg>
  ),
  Gear: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
  Flag: (p: { className?: string; filled?: boolean }) => (
    <svg viewBox="0 0 24 24" fill={p.filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M4 22V4a1 1 0 0 1 1-1h11l-1.5 4L20 11H5" />
    </svg>
  ),
  Back: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Close: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Undo: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
    </svg>
  ),
  Search: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  ),
  Play: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5z" />
    </svg>
  ),
  Fire: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}>
      <path d="M12 2c.6 3.2 2.5 5 4.5 7 2 2.1 3.5 4.3 3.5 7a8 8 0 1 1-16 0c0-2.4 1-4.4 2.5-6 .3 1.6 1.1 2.8 2.5 3.5C9 9.5 10 6 12 2z" />
    </svg>
  ),
  Bolt: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
    </svg>
  ),
  Eye: (p: { className?: string; off?: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {p.off && <path d="M3 3l18 18" />}
    </svg>
  ),
  Check: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M5 12l5 5L20 7" />
    </svg>
  ),
};
