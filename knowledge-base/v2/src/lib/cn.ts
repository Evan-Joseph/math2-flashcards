export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function fmtDate(d: Date | string, withTime = false) {
  const x = typeof d === 'string' ? new Date(d) : d;
  const m = x.getMonth() + 1;
  const day = x.getDate();
  if (!withTime) return `${m}/${day}`;
  return `${m}/${day} ${String(x.getHours()).padStart(2, '0')}:${String(x.getMinutes()).padStart(2, '0')}`;
}

export function relDue(due: Date, now = new Date()): string {
  const diff = due.getTime() - now.getTime();
  const d = Math.round(diff / 86400000);
  if (diff <= 0) return '已到期';
  if (diff < 3600000) return `${Math.max(1, Math.round(diff / 60000))} 分后`;
  if (diff < 86400000) return `${Math.round(diff / 3600000)} 小时后`;
  if (d === 1) return '明天';
  return `${d} 天后`;
}

export function vibrate(pattern: number | number[]) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}
