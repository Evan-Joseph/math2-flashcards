import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Grade } from 'ts-fsrs';
import { CARD_MAP, CHAPTER_MAP, KIND_LABEL, hueVar } from '../data';
import type { KCard } from '../data/types';
import { MathText } from '../lib/math';
import { previewIntervals, rate, undoRate, toggleFlag, setNote, useStore, type RateResult } from '../lib/store';
import type { SessionPlan } from '../lib/session';
import { Button, Chip, Icon, Stars, useMotion } from './ui';
import { cn } from '../utils/cn';

interface HistoryItem {
  id: string;
  grade: Grade;
  res: RateResult;
  index: number;
  requeuedAt: number | null;
}

const GRADES: { g: Grade; label: string; sub: string; key: string; cls: string }[] = [
  { g: 1, label: '忘了', sub: '完全想不起', key: '1', cls: 'bg-bad/10 text-bad hover:bg-bad/20 border-bad/20' },
  { g: 2, label: '模糊', sub: '想起一部分', key: '2', cls: 'bg-gold-soft text-gold hover:brightness-95 border-gold/20' },
  { g: 3, label: '记得', sub: '稍作思考', key: '3', cls: 'bg-accent-soft text-accent hover:brightness-95 border-accent/20' },
  { g: 4, label: '轻松', sub: '脱口而出', key: '4', cls: 'bg-good/10 text-good hover:bg-good/20 border-good/20' },
];

export function Study({ plan, onExit }: { plan: SessionPlan; onExit: () => void }) {
  const [queue, setQueue] = useState<string[]>(plan.ids);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [judge, setJudge] = useState<boolean | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [counts, setCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 } as Record<Grade, number>);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [showNote, setShowNote] = useState(false);
  const startedAt = useRef(Date.now());
  const cardStart = useRef(Date.now());
  const cardRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const motion = useMotion();

  const flags = useStore((s) => s.flags);
  const notes = useStore((s) => s.notes);
  const showHookFirst = useStore((s) => s.settings.showHookFirst);

  const id = queue[index];
  const card: KCard | undefined = id ? CARD_MAP[id] : undefined;
  const finished = index >= queue.length;
  const intervals = useMemo(() => (card ? previewIntervals(card.id) : null), [card, revealed]); // eslint-disable-line react-hooks/exhaustive-deps

  /* --- 卡片入场 --- */
  useGSAP(
    () => {
      if (!cardRef.current || finished) return;
      if (!motion) return;
      gsap.fromTo(cardRef.current, { x: 36, opacity: 0, rotate: 0.6 }, { x: 0, opacity: 1, rotate: 0, duration: 0.42, ease: 'power3.out' });
    },
    { dependencies: [index, finished], scope: cardRef },
  );

  /* --- 答案揭示 --- */
  useGSAP(
    () => {
      if (!revealed || !answerRef.current || !motion) return;
      const items = answerRef.current.querySelectorAll('.reveal-item');
      gsap.fromTo(answerRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      gsap.fromTo(items, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out', delay: 0.08 });
      const btns = document.querySelectorAll('.grade-btn');
      if (btns.length) gsap.fromTo(btns, { opacity: 0, y: 12, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.05, ease: 'back.out(1.6)', delay: 0.12 });
    },
    { dependencies: [revealed] },
  );

  const reveal = useCallback(() => {
    if (revealed || finished) return;
    (document.activeElement as HTMLElement | null)?.blur?.();
    setRevealed(true);
  }, [revealed, finished]);

  const doJudge = useCallback(
    (choice: boolean) => {
      if (revealed) return;
      setJudge(choice);
      setRevealed(true);
    },
    [revealed],
  );

  const goNext = useCallback(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    setRevealed(false);
    setJudge(null);
    setShowNote(false);
    setIndex((i) => i + 1);
    cardStart.current = Date.now();
    window.scrollTo({ top: 0 });
  }, []);

  const grade = useCallback(
    (g: Grade) => {
      if (!card || !revealed) return;
      const elapsed = Date.now() - cardStart.current;
      const res = rate(card.id, g, elapsed);
      setCounts((c) => ({ ...c, [g]: c[g] + 1 }));
      setSeen((s) => new Set(s).add(card.id));
      let requeuedAt: number | null = null;
      if (res.requeue) {
        const pos = Math.min(queue.length, index + 1 + (g === 1 ? 3 : 6));
        requeuedAt = pos;
        const nq = [...queue];
        nq.splice(pos, 0, card.id);
        setQueue(nq);
      }
      setHistory((h) => [...h, { id: card.id, grade: g, res, index, requeuedAt }]);
      // 卡片出场
      if (motion && cardRef.current) {
        gsap.to(cardRef.current, {
          x: -40,
          opacity: 0,
          duration: 0.22,
          ease: 'power2.in',
          onComplete: goNext,
        });
      } else goNext();
    },
    [card, revealed, index, queue, goNext, motion],
  );

  const undo = useCallback(() => {
    const last = history[history.length - 1];
    if (!last) return;
    undoRate(last.id, last.res, last.grade);
    setCounts((c) => ({ ...c, [last.grade]: Math.max(0, c[last.grade] - 1) }));
    setQueue((q) => {
      if (last.requeuedAt !== null && q[last.requeuedAt] === last.id) {
        const nq = [...q];
        nq.splice(last.requeuedAt, 1);
        return nq;
      }
      return q;
    });
    setHistory((h) => h.slice(0, -1));
    setIndex(last.index);
    setRevealed(true);
    setJudge(null);
  }, [history]);

  /* --- 键盘 --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape') return onExit();
      if (finished) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!revealed) {
          if (card?.k === 'judge') return;
          reveal();
        } else grade(3);
        return;
      }
      if (!revealed && card?.k === 'judge') {
        if (e.key.toLowerCase() === 'y' || e.key === 'ArrowLeft') doJudge(true);
        if (e.key.toLowerCase() === 'n' || e.key === 'ArrowRight') doJudge(false);
        return;
      }
      if (revealed && ['1', '2', '3', '4'].includes(e.key)) grade(Number(e.key) as Grade);
      if (e.key.toLowerCase() === 'z') undo();
      if (e.key.toLowerCase() === 'f' && card) toggleFlag(card.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [revealed, finished, card, reveal, grade, doJudge, undo, onExit]);

  /* ------------------------------------------------------------ */
  if (finished || !card) {
    return <Summary plan={plan} counts={counts} seen={seen.size} startedAt={startedAt.current} onExit={onExit} onAgain={() => {
      const againIds = history.filter((h) => h.grade <= 2).map((h) => h.id);
      const uniq = [...new Set(againIds)];
      if (!uniq.length) return onExit();
      setQueue(uniq);
      setIndex(0);
      setHistory([]);
      setCounts({ 1: 0, 2: 0, 3: 0, 4: 0 });
      setRevealed(false);
      startedAt.current = Date.now();
      cardStart.current = Date.now();
    }} />;
  }

  const chapter = CHAPTER_MAP[card.ch];
  const color = hueVar(chapter.hue);
  const total = queue.length;
  const flagged = flags.includes(card.id);
  const judgeAnswer = card.k === 'judge' ? card.a?.trimStart().startsWith('✓') : undefined;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* 顶栏 */}
      <header className="sticky top-0 z-20 border-b border-line/70 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 py-2">
          <button onClick={onExit} className="rounded-lg p-2 text-muted hover:bg-card2 hover:text-ink" aria-label="退出">
            <Icon.Close className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="truncate">{plan.title}</span>
              <span className="tabular-nums">
                {index + 1} / {total}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line/70">
              <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(index / total) * 100}%` }} />
            </div>
          </div>
          <button onClick={undo} disabled={!history.length} className="rounded-lg p-2 text-muted hover:bg-card2 hover:text-ink disabled:opacity-30" aria-label="撤销" title="撤销 (Z)">
            <Icon.Undo className="h-5 w-5" />
          </button>
          <button
            onClick={() => toggleFlag(card.id)}
            className={cn('rounded-lg p-2 hover:bg-card2', flagged ? 'text-gold' : 'text-muted hover:text-ink')}
            aria-label="标记"
            title="标记 (F)"
          >
            <Icon.Flag className="h-5 w-5" filled={flagged} />
          </button>
        </div>
      </header>

      {/* 卡片 */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-3 pb-40 pt-4 sm:px-4">
        <div ref={cardRef} key={`${card.id}-${index}`} className="rounded-3xl border border-line bg-card shadow-[0_1px_0_rgba(0,0,0,0.02),0_12px_40px_-20px_rgba(0,0,0,0.25)]">
          {/* 卡头 */}
          <div className="flex flex-wrap items-center gap-2 border-b border-line/70 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium" style={{ color }}>
              {chapter.title}
            </span>
            <span className="text-muted">·</span>
            <span className="text-sm text-muted">{card.sec}</span>
            <div className="ml-auto flex items-center gap-2">
              <Chip className="bg-card2 text-muted">{KIND_LABEL[card.k]}</Chip>
              <Stars n={card.s} />
            </div>
          </div>

          {/* 题面 */}
          <div className="px-5 pt-5 pb-4 sm:px-7">
            {card.k === 'cloze' && !revealed && <p className="mb-2 text-xs font-medium tracking-wide text-gold">在心里填出空格处的内容</p>}
            {card.k === 'judge' && !revealed && <p className="mb-2 text-xs font-medium tracking-wide text-gold">判断下列说法是否正确</p>}
            {card.k === 'steps' && !revealed && <p className="mb-2 text-xs font-medium tracking-wide text-gold">先在心里复述完整步骤</p>}
            {card.k === 'qa' && !revealed && <p className="mb-2 text-xs font-medium tracking-wide text-gold">先在心里作答，再核对</p>}
            <div className="text-[1.08rem] sm:text-[1.15rem]">
              <MathText text={card.q} mode={card.k === 'cloze' ? (revealed ? 'show' : 'hide') : 'plain'} />
            </div>
          </div>

          {/* 判断题选择 */}
          {card.k === 'judge' && !revealed && (
            <div className="grid grid-cols-2 gap-3 px-5 pb-6 sm:px-7">
              <button onClick={() => doJudge(true)} className="flex h-16 items-center justify-center gap-2 rounded-2xl border border-good/30 bg-good/10 text-lg font-semibold text-good transition active:scale-[0.98]">
                ✓ 正确 <kbd>Y</kbd>
              </button>
              <button onClick={() => doJudge(false)} className="flex h-16 items-center justify-center gap-2 rounded-2xl border border-bad/30 bg-bad/10 text-lg font-semibold text-bad transition active:scale-[0.98]">
                ✗ 错误 <kbd>N</kbd>
              </button>
            </div>
          )}

          {/* 答案 */}
          {revealed && (
            <div ref={answerRef} className="border-t border-dashed border-line px-5 pb-6 pt-5 sm:px-7">
              {card.k === 'judge' && (
                <div
                  className={cn(
                    'reveal-item mb-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium',
                    judge === null ? 'bg-card2 text-muted' : judge === judgeAnswer ? 'bg-good/10 text-good' : 'bg-bad/10 text-bad',
                  )}
                >
                  <span className="text-xl">{judge === null ? '·' : judge === judgeAnswer ? '🎯' : '💥'}</span>
                  <span>
                    {judge === null ? '未作选择。' : judge === judgeAnswer ? '判断正确！' : '判断错了。'} 该说法{judgeAnswer ? '正确' : '错误'}。
                  </span>
                </div>
              )}
              {card.k === 'steps' && card.a ? (
                <ol className="space-y-2.5">
                  {card.a.split('\n').filter(Boolean).map((line, i) => {
                    const m = /^\s*(\d+)\.\s*/.exec(line);
                    const body = m ? line.slice(m[0].length) : line;
                    return (
                      <li key={i} className="reveal-item flex gap-3">
                        {m ? (
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">{m[1]}</span>
                        ) : (
                          <span className="w-6 shrink-0" />
                        )}
                        <div className="flex-1 text-[1.02rem]">
                          <MathText text={body} />
                        </div>
                      </li>
                    );
                  })}
                </ol>
              ) : card.a ? (
                <div className="reveal-item text-[1.02rem] sm:text-[1.08rem]">
                  <MathText text={card.k === 'judge' ? card.a.replace(/^\s*[✓✗]\s*/, '') : card.a} />
                </div>
              ) : null}

              {(card.hook || card.trap) && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {card.hook && <Aside kind="hook" text={card.hook} open={showHookFirst} />}
                  {card.trap && <Aside kind="trap" text={card.trap} open={showHookFirst} />}
                </div>
              )}

              {/* 笔记 */}
              <div className="reveal-item mt-4">
                {showNote || notes[card.id] ? (
                  <textarea
                    defaultValue={notes[card.id] ?? ''}
                    onBlur={(e) => setNote(card.id, e.target.value)}
                    placeholder="写下你自己的理解、口诀或易错提醒…"
                    rows={2}
                    className="w-full resize-y rounded-xl border border-line bg-card2/60 px-3 py-2 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
                  />
                ) : (
                  <button onClick={() => setShowNote(true)} className="text-xs text-muted underline-offset-2 hover:text-ink hover:underline">
                    + 添加我的笔记
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 hidden text-center text-xs text-muted sm:block">
          {revealed ? (
            <>
              按 <kbd>1</kbd>–<kbd>4</kbd> 评分 · <kbd>空格</kbd> 记得 · <kbd>Z</kbd> 撤销 · <kbd>F</kbd> 标记 · <kbd>Esc</kbd> 退出
            </>
          ) : card.k === 'judge' ? (
            <>
              <kbd>Y</kbd> 正确 · <kbd>N</kbd> 错误 · <kbd>Esc</kbd> 退出
            </>
          ) : (
            <>
              按 <kbd>空格</kbd> 显示答案 · <kbd>Esc</kbd> 退出
            </>
          )}
        </p>
      </main>

      {/* 底部操作 */}
      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-line/70 bg-paper/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-3 pt-3 pb-safe sm:px-4">
          {!revealed ? (
            card.k === 'judge' ? (
              <div className="flex h-14 items-center justify-center text-sm text-muted">先选择「正确」或「错误」</div>
            ) : (
              <Button size="lg" className="h-14 w-full text-base" onClick={reveal}>
                显示答案
                <span className="ml-1 hidden text-white/70 sm:inline">（空格）</span>
              </Button>
            )
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {GRADES.map((g) => (
                <button
                  key={g.g}
                  onClick={() => grade(g.g)}
                  className={cn('grade-btn flex h-16 flex-col items-center justify-center rounded-2xl border transition active:scale-[0.97]', g.cls)}
                >
                  <span className="text-[15px] font-semibold leading-tight">{g.label}</span>
                  <span className="mt-0.5 text-[11px] opacity-80 tabular-nums">{intervals?.[g.g] ?? ''}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

/* ---------- 记忆锚点 / 易错点 ---------- */
function Aside({ kind, text, open: initOpen }: { kind: 'hook' | 'trap'; text: string; open: boolean }) {
  const [open, setOpen] = useState(initOpen);
  const isHook = kind === 'hook';
  return (
    <div className={cn('reveal-item rounded-2xl border p-3.5', isHook ? 'border-accent/20 bg-accent-soft/60' : 'border-gold/25 bg-gold-soft/50')}>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2 text-left text-xs font-semibold tracking-wide">
        <span className={cn(isHook ? 'text-accent' : 'text-gold')}>{isHook ? '🧠 记忆锚点' : '⚠️ 易错点'}</span>
        <span className="ml-auto text-muted">{open ? '收起' : '展开'}</span>
      </button>
      {open && (
        <div className="mt-2 text-[0.95rem] leading-relaxed text-ink/90">
          <MathText text={text} />
        </div>
      )}
    </div>
  );
}

/* ---------- 结束总结 ---------- */
function Summary({ plan, counts, seen, startedAt, onExit, onAgain }: { plan: SessionPlan; counts: Record<Grade, number>; seen: number; startedAt: number; onExit: () => void; onAgain: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useMotion();
  const total = counts[1] + counts[2] + counts[3] + counts[4];
  const acc = total ? Math.round(((counts[3] + counts[4]) / total) * 100) : 0;
  const mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
  const hard = counts[1] + counts[2];
  useGSAP(
    () => {
      if (!motion || !ref.current) return;
      gsap.fromTo('.sum-item', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' });
    },
    { scope: ref },
  );
  const msg = total === 0 ? '这一轮没有可复习的卡片。' : acc >= 85 ? '状态很好，记忆非常稳固。' : acc >= 60 ? '不错，模糊的地方系统会更快安排复习。' : '没关系，遗忘是学习的一部分——这些卡片很快会再次出现。';
  return (
    <div ref={ref} className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 py-12 text-center">
      <div className="sum-item text-5xl">{total === 0 ? '📭' : acc >= 85 ? '🏆' : acc >= 60 ? '👍' : '🌱'}</div>
      <h2 className="sum-item mt-4 text-2xl font-bold">{plan.title} · 完成</h2>
      <p className="sum-item mt-2 text-muted">{msg}</p>
      <div className="sum-item mt-8 grid w-full grid-cols-3 gap-3">
        <Stat label="复习次数" value={total} />
        <Stat label="记住率" value={`${acc}%`} />
        <Stat label="用时" value={`${mins} 分`} />
      </div>
      <div className="sum-item mt-4 grid w-full grid-cols-4 gap-2 text-xs">
        {GRADES.map((g) => (
          <div key={g.g} className={cn('rounded-xl border py-2', g.cls)}>
            <div className="text-lg font-bold tabular-nums">{counts[g.g]}</div>
            <div>{g.label}</div>
          </div>
        ))}
      </div>
      <p className="sum-item mt-3 text-xs text-muted">覆盖 {seen} 张不同卡片</p>
      <div className="sum-item mt-8 flex w-full flex-col gap-2 sm:flex-row">
        {hard > 0 && (
          <Button variant="soft" size="lg" className="flex-1" onClick={onAgain}>
            再过一遍「忘了 / 模糊」的 {hard} 张
          </Button>
        )}
        <Button size="lg" className="flex-1" onClick={onExit}>
          返回
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-3">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}
