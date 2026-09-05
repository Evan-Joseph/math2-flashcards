import { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { State } from 'ts-fsrs';
import { CHAPTERS, CHAPTER_MAP, SUBJECTS, cardsOf, hueVar } from '../data';
import { cardStateOf, chapterStat, retrievability, useStore, updateSettings } from '../lib/store';
import type { View } from '../lib/nav';
import { Bar, Button, Icon, Ring, useMotion, Chip } from './ui';
import { cn } from '../utils/cn';

export function Chapters({ go }: { go: (v: View) => void }) {
  useStore((s) => s.cards);
  const enabled = useStore((s) => s.settings.chapters);
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotion();
  const now = new Date();

  useGSAP(
    () => {
      if (!motion) return;
      gsap.fromTo('.ch-card', { opacity: 0, y: 14, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.04, ease: 'power3.out' });
    },
    { scope: ref },
  );

  const groups = (['hs', 'la', 'pre'] as const).map((s) => ({ key: s, ...SUBJECTS[s], chapters: CHAPTERS.filter((c) => c.subject === s) }));

  return (
    <div ref={ref} className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:pt-10">
      <h1 className="text-2xl font-bold tracking-tight">章节地图</h1>
      <p className="mt-1 text-sm text-muted">数学二 = 高等数学（约 78%）+ 线性代数（约 22%）。点击章节查看小节并开始学习。</p>

      {groups.map((g) => (
        <section key={g.key} className="mt-7">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-base font-semibold">{g.title}</h2>
            <span className="text-xs text-muted">{g.chapters.reduce((s, c) => s + cardsOf(c.id).length, 0)} 张</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {g.chapters.map((c) => {
              const st = chapterStat(c.id, now);
              const color = hueVar(c.hue);
              const on = enabled.includes(c.id);
              return (
                <div key={c.id} className={cn('ch-card group relative rounded-2xl border border-line bg-card p-4 transition hover:border-ink/20 hover:shadow-sm', !on && 'opacity-60')}>
                  <button onClick={() => go({ name: 'chapter', id: c.id })} className="flex w-full items-center gap-4 text-left">
                    <Ring value={st.mastery} size={56} stroke={5} color={color}>
                      <span className="text-xs font-bold tabular-nums">{Math.round(st.mastery * 100)}</span>
                    </Ring>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold">{c.title}</span>
                        {st.due > 0 && <Chip className="bg-bad/10 text-bad">{st.due} 到期</Chip>}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-muted">{c.desc}</div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                        <span className="tabular-nums">
                          已学 {st.learned}/{st.total}
                        </span>
                        {st.weak > 0 && <span className="text-gold">· {st.weak} 张薄弱</span>}
                      </div>
                    </div>
                    <Icon.Back className="h-4 w-4 rotate-180 text-muted opacity-0 transition group-hover:opacity-100" />
                  </button>
                  <label className="absolute right-3 top-3 flex cursor-pointer items-center gap-1 text-[10px] text-muted" title="是否纳入每日任务">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={(e) => updateSettings({ chapters: e.target.checked ? [...enabled, c.id] : enabled.filter((x) => x !== c.id) })}
                      className="h-3.5 w-3.5 accent-[var(--accent)]"
                    />
                    纳入
                  </label>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ================================================================== */

export function ChapterDetail({ id, go, back }: { id: string; go: (v: View) => void; back: () => void }) {
  useStore((s) => s.cards);
  const flags = useStore((s) => s.flags);
  const ch = CHAPTER_MAP[id];
  const cards = cardsOf(id);
  const color = hueVar(ch.hue);
  const now = new Date();
  const st = chapterStat(id, now);
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotion();

  const sections = useMemo(() => {
    const map = new Map<string, typeof cards>();
    for (const c of cards) {
      if (!map.has(c.sec)) map.set(c.sec, []);
      map.get(c.sec)!.push(c);
    }
    return [...map.entries()];
  }, [cards]);

  useGSAP(
    () => {
      if (!motion) return;
      gsap.fromTo('.sec-item', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out' });
    },
    { scope: ref },
  );

  const pending = st.due + (st.total - st.learned);

  return (
    <div ref={ref} className="mx-auto max-w-3xl px-4 pb-28 pt-4 sm:pt-8">
      <button onClick={back} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <Icon.Back className="h-4 w-4" /> 章节地图
      </button>

      <div className="overflow-hidden rounded-3xl border border-line bg-card">
        <div className="h-1.5" style={{ backgroundColor: color }} />
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <Ring value={st.mastery} size={88} stroke={8} color={color}>
            <div className="text-center">
              <div className="text-xl font-bold tabular-nums">{Math.round(st.mastery * 100)}%</div>
              <div className="text-[10px] text-muted">掌握</div>
            </div>
          </Ring>
          <div className="flex-1">
            <div className="text-xs font-medium" style={{ color }}>
              {SUBJECTS[ch.subject].title}
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{ch.title}</h1>
            <p className="mt-1 text-sm text-muted">{ch.desc}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              <span>
                共 <b className="text-ink">{st.total}</b> 张
              </span>
              <span>
                已学 <b className="text-ink">{st.learned}</b>
              </span>
              <span>
                到期 <b className={st.due ? 'text-bad' : 'text-ink'}>{st.due}</b>
              </span>
              <span>
                薄弱 <b className={st.weak ? 'text-gold' : 'text-ink'}>{st.weak}</b>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-line bg-card2/50 p-4">
          <Button onClick={() => go({ name: 'study-chapter', ch: id, all: false })} disabled={!pending}>
            <Icon.Play className="h-4 w-4" />
            学习本章（{pending} 张待学/到期）
          </Button>
          <Button variant="outline" onClick={() => go({ name: 'study-chapter', ch: id, all: true })}>
            全部过一遍
          </Button>
          <Button variant="ghost" onClick={() => go({ name: 'sheet', ch: id })}>
            <Icon.List className="h-4 w-4" />
            速记清单
          </Button>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-base font-semibold">小节</h2>
      <div className="space-y-2">
        {sections.map(([sec, list]) => {
          const learned = list.filter((c) => {
            const s = cardStateOf(c.id);
            return s && s.state !== State.New;
          }).length;
          return (
            <button
              key={sec}
              onClick={() => go({ name: 'study-custom', title: `${ch.short} · ${sec}`, ids: list.map((c) => c.id) })}
              className="sec-item flex w-full items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3 text-left transition hover:border-ink/20 hover:shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{sec}</span>
                  <span className="text-xs text-muted">{list.length} 张</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {list.map((c) => {
                    const r = retrievability(c.id, now);
                    const bg = r === null ? 'var(--line)' : r >= 0.9 ? 'var(--good)' : r >= 0.7 ? 'var(--gold)' : 'var(--bad)';
                    return (
                      <span
                        key={c.id}
                        className={cn('h-2.5 w-2.5 rounded-sm', flags.includes(c.id) && 'ring-1 ring-gold ring-offset-1 ring-offset-card')}
                        style={{ backgroundColor: bg }}
                        title={`${c.q.slice(0, 40)}… ${r === null ? '未学' : `可提取率 ${Math.round(r * 100)}%`}`}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="text-right text-xs text-muted">
                <div className="tabular-nums">
                  {learned}/{list.length}
                </div>
                <Bar value={learned / list.length} color={color} className="mt-1 w-16" height={4} />
              </div>
              <Icon.Back className="h-4 w-4 rotate-180 text-muted" />
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted">
        色块：<span className="inline-block h-2.5 w-2.5 rounded-sm bg-line align-middle" /> 未学 ·{' '}
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-good align-middle" /> 稳固 ·{' '}
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gold align-middle" /> 需巩固 ·{' '}
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-bad align-middle" /> 薄弱
      </p>
    </div>
  );
}
