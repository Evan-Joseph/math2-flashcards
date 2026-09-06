import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function vibrate(pattern: number | number[]) {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

export function fmtMs(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} 秒`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} 分${s % 60 ? ` ${s % 60} 秒` : ''}`;
  const h = Math.floor(m / 60);
  return `${h} 时 ${m % 60} 分`;
}

export function fmtPct(x: number | null | undefined, digits = 0): string {
  if (x == null || Number.isNaN(x)) return '—';
  return `${(x * 100).toFixed(digits)}%`;
}

export function fmtDate(d: string | Date, opts: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric' }) {
  const date = typeof d === 'string' ? new Date(d.length === 10 ? `${d}T00:00:00` : d) : d;
  return date.toLocaleDateString('zh-CN', opts);
}

export function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

export function heatLevel(n: number) {
  if (n <= 0) return 0;
  if (n < 10) return 1;
  if (n < 30) return 2;
  if (n < 60) return 3;
  return 4;
}
