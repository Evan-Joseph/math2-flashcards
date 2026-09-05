'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { CARD_MAP, CHAPTER_MAP, KIND_LABEL, chapterColor, type KCard } from '@/data';
import { MathText, countCloze, countLines } from '@/lib/math';
import { rate, undoRate, previewIntervals, toggleFlag, useStore, Rating, setCursor, useExam, type Grade, type Card } from '@/lib/store';
import { requeue, type SessionPlan } from '@/lib/session';
import { cn, vibrate } from '@/lib/cn';
import { Icon, useMotionOn, fmtMs } from './ui';
import { CardBadges, CardSheet } from './CardSheet';

interface Props {
  plan: SessionPlan;
  onExit: () => void;
}

type Phase = 'front' | 'back';

interface Done {
  id: string;
  grade: Grade;
  prev: Card | undefined;
  wasNew: boolean;
  ms: number;
}

const GRADES: { g: Grade; label: string; key: string; cls: string }[] = [
  { g: Rating.Again, label: '忘了', key: '1', cls: 'text-bad border-bad/40 bg-bad-soft/60' },
  { g: Rating.Hard, label: '模糊', key: '2', cls: 'text-warn border-warn/40 bg-warn-soft/60' },
  { g: Rating.Good, label: '记住', key: '3', cls: 'text-good border-good/40 bg-good-soft/60' },
  { g: Rating.Easy, label: '轻松', key: '4', cls: 'text-accent border-accent/40 bg-accent-soft/60' },
];

export function Study({ plan, onExit }: Props) {
  const router = useRouter();
  const exam = useExam();
  const hintFirst = useStore((s) => s.settings.hintFirst);
  const haptics = useStore((s) => s.settings.haptics);
  const order = useStore((s) => s.settings.order);
  const flags = useStore((s) => s.flags);
  const motionOn = useMotionOn();

  const [queue, setQueue] = useState<string[]>(() => plan.ids.slice(plan.startIndex ?? 0));
  const [phase, setPhase] = useState<Phase>('front');
  const [hint, setHint] = useState(false);
  const [reveal, setReveal] = useState(0); // 已揭示的挖空数 / 步骤数
  const [choice, setChoice] = useState<number | null>(null); // judge: 0=✓ 1=✗ ; mcq: index
  const [done, setDone] = useState<Done[]>([]);
  const [detail, setDetail] = useState<string | null>(null);
  const [seq, setSeq] = useState(0); // 用于动画 key
  const startRef = useRef(0);
  const sessionStart = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = Date.now();
    if (!sessionStart.current) sessionStart.current = t;
    if (!startRef.current) startRef.current = t;
  }, []);
  const total = plan.ids.length - (plan.startIndex ?? 0);

  const id = queue[0];
  const card: KCard | undefined = id ? CARD_MAP[id] : undefined;
  const finished = !card;
  const blanks = card?.k === 'cloze' ? countCloze(card.q) : 0;
  const steps = card?.k === 'steps' && card.a ? countLines(card.a) : 0;
  const isCram = !!plan.cram;

  // 记住全库顺序通读的进度（用于首页「顺序续学」）
  useEffect(() => {
    if (!card || order !== 'sequential' || plan.mode !== 'all') return;
    const idx = plan.ids.indexOf(card.id);
    if (idx >= 0) setCursor(exam, idx);
  }, [card, order, plan, exam]);

  const resetCard = useCallback(() => {
    setPhase('front');
    setHint(false);
    setReveal(0);
    setChoice(null);
    startRef.current = Date.now();
    setSeq((n) => n + 1);
  }, []);

  const showAnswer = useCallback(() => {
    if (!card || phase === 'back') return;
    if (card.k === 'cloze') setReveal(blanks);
    if (card.k === 'steps') setReveal(steps);
    setPhase('back');
  }, [card, phase, blanks, steps]);

  const revealNext = useCallback(() => {
    if (!card) return;
    if (card.k === 'cloze') {
      const n = Math.min(blanks, reveal + 1);
      setReveal(n);
      if (n >= blanks) setPhase('back');
    } else if (card.k === 'steps') {
      const n = Math.min(steps, reveal + 1);
      setReveal(n);
      if (n >= steps) setPhase('back');
    }
  }, [card, blanks, steps, reveal]);

  const revealBlank = useCallback(
    (i: number) => {
      if (!card || card.k !== 'cloze') return;
      // 点按某个空：揭示到该空为止（保持顺序感），至少 +1
      const n = Math.max(reveal + 1, Math.min(blanks, i + 1));
      setReveal(n);
      if (n >= blanks) setPhase('back');
    },
    [card, reveal, blanks],
  );

  const grade = useCallback(
    (g: Grade) => {
      if (!card || phase !== 'back') return;
      const ms = Date.now() - startRef.current;
      if (haptics) vibrate(g === Rating.Again ? [30, 40, 30] : 12);
      let entry: Done;
      if (isCram) {
        entry = { id: card.id, grade: g, prev: undefined, wasNew: false, ms };
      } else {
        const r = rate(card.id, g, ms);
        entry = { id: card.id, grade: g, prev: r.prev, wasNew: r.wasNew, ms };
      }
      setDone((d) => [...d, entry]);
      setElapsed(sessionStart.current ? Date.now() - sessionStart.current : 0);
      setQueue((q) => {
        const rest = q.slice(1);
        // 忘了 / 模糊（新卡）稍后再出现一次，避免立即重复
        if (g === Rating.Again || (g === Rating.Hard && entry.wasNew)) return requeue([card.id, ...rest], card.id, 3);
        return rest;
      });
      resetCard();
    },
    [card, phase, haptics, isCram, resetCard],
  );

  /** 巩固模式：直接下一张 / 上一张 */
  const skip = useCallback(
    (dir: 1 | -1) => {
      if (!card) return;
      if (dir === 1) {
        setQueue((q) => q.slice(1));
      } else {
        const idx = plan.ids.indexOf(card.id);
        if (idx > 0) setQueue((q) => [plan.ids[idx - 1], ...q]);
      }
      resetCard();
    },
    [card, plan.ids, resetCard],
  );

  const undo = useCallback(() => {
    const last = done[done.length - 1];
    if (!last) return;
    if (!isCram) undoRate(last.id, last.prev, last.grade, last.ms, last.wasNew);
    setDone((d) => d.slice(0, -1));
    setQueue((q) => [last.id, ...q.filter((x) => x !== last.id)]);
    resetCard();
  }, [done, isCram, resetCard]);

  // 键盘
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (detail) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Escape') return onExit();
      if (!card) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (phase === 'front') {
          if (card.k === 'cloze' || card.k === 'steps') revealNext();
          else if (card.k === 'judge' || card.k === 'mcq') return; // 需先作答
          else showAnswer();
        }
        return;
      }
      if (phase === 'front' && card.k === 'judge' && (e.key === 'y' || e.key === 'n')) {
        setChoice(e.key === 'y' ? 0 : 1);
        setPhase('back');
        return;
      }
      if (phase === 'front' && card.k === 'mcq' && /^[a-dA-D]$/.test(e.key)) {
        const i = e.key.toLowerCase().charCodeAt(0) - 97;
        if (card.opts && i < card.opts.length) {
          setChoice(i);
          setPhase('back');
        }
        return;
      }
      if (phase === 'back' && ['1', '2', '3', '4'].includes(e.key)) return grade(Number(e.key) as Grade);
      if (e.key === 'h' || e.key === 'H') return setHint(true);
      if (e.key === 'f' || e.key === 'F') return toggleFlag(card.id);
      if (e.key === 'u' || e.key === 'U') return undo();
      if (e.key === 'i' || e.key === 'I') return setDetail(card.id);
      if (isCram && e.key === 'ArrowRight') return skip(1);
      if (isCram && e.key === 'ArrowLeft') return skip(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, phase, detail, grade, undo, showAnswer, revealNext, onExit, isCram, skip]);

  const intervals = useMemo(() => (card && !isCram && phase === 'back' ? previewIntervals(card.id) : null), [card, isCram, phase]);
  const progress = total > 0 ? Math.min(1, done.length / Math.max(total, done.length + queue.length)) : 0;

  /* ---------------- 结束页 ---------------- */
  if (finished) {
    const again = done.filter((d) => d.grade === Rating.Again).length;
    const ms = elapsed;
    const unique = new Set(done.map((d) => d.id)).size;
    return (
      <div className="flex min-h-dvh flex-col px-4 py-6 md:px-8">
        <div className="mx-auto w-full max-w-md flex-1">
          <div className="card px-6 py-8 text-center">
            <div className="text-sm font-semibold text-muted">{plan.title}</div>
            <div className="mt-1 text-2xl font-bold tracking-tight">{done.length === 0 ? '没有需要学习的卡片' : isCram ? '自测完成' : '本轮完成'}</div>
            {done.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <Stat label="卡片" value={String(unique)} />
                <Stat label="忘了" value={String(again)} tone={again ? 'bad' : undefined} />
                <Stat label="用时" value={fmtMs(ms)} />
              </div>
            )}
            {done.length === 0 && <p className="mt-3 text-sm text-muted">{plan.mode === 'daily' ? '今天的复习与新卡都已完成，明天再来；也可以从章节里主动学习。' : '换个章节或模式试试。'}</p>}
            {isCram && done.length > 0 && <p className="mt-4 text-xs text-muted">自测不写入复习调度与统计。</p>}
            <div className="mt-6 flex flex-col gap-2">
              {!isCram && done.length > 0 && (
                <button type="button" className="btn btn-primary" onClick={() => router.replace('/study?mode=daily')}>
                  继续今日任务
                </button>
              )}
              <Link href="/" className="btn">
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const c = card!;
  const flagged = flags.includes(c.id);
  const judgeCorrect = c.k === 'judge' && choice != null ? (c.a?.startsWith('✓') ? 0 : 1) === choice : null;
  const mcqCorrect = c.k === 'mcq' && choice != null ? choice === c.ans : null;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* 顶栏 */}
      <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 pt-[max(env(safe-area-inset-top),0.5rem)] pb-2">
          <button type="button" className="btn btn-ghost btn-icon" onClick={onExit} aria-label="退出学习">
            <Icon.Back />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{plan.title}</div>
            <div className="text-xs text-muted">
              {done.length} / {Math.max(total, done.length + queue.length)} · 剩 {queue.length}
              {isCram ? ' · 自测' : ''}
              {order === 'random' ? ' · 随机' : ' · 顺序'}
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-icon" onClick={undo} disabled={done.length === 0} aria-label="撤销上一张 (U)">
            <Icon.Undo />
          </button>
          <button type="button" className={cn('btn btn-ghost btn-icon', flagged && 'text-warn')} onClick={() => toggleFlag(c.id)} aria-pressed={flagged} aria-label="收藏 (F)">
            <Icon.Star filled={flagged} />
          </button>
          <button type="button" className="btn btn-ghost btn-icon" onClick={() => setDetail(c.id)} aria-label="知识详情 (I)">
            <Icon.Info />
          </button>
        </div>
        <div className="mx-auto max-w-3xl px-3">
          <div className="progress" style={{ height: 3 }}>
            <i style={{ width: `${progress * 100}%`, background: chapterColor(c.ch) }} />
          </div>
        </div>
      </header>

      {/* 卡片 */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-3 py-3 md:px-6 md:py-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={`${c.id}-${seq}`}
            initial={motionOn ? { opacity: 0, y: 14, scale: 0.99 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={motionOn ? { opacity: 0, y: -10, scale: 0.99, transition: { duration: 0.14 } } : { opacity: 0, transition: { duration: 0 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            className="card overflow-hidden"
            aria-live="polite"
          >
            <div className="h-1" style={{ background: chapterColor(c.ch) }} />
            <div className="px-4 pt-4 pb-3 md:px-6 md:pt-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <CardBadges card={c} />
                <span className="chip">{KIND_LABEL[c.k]}</span>
              </div>

              {/* 正面 */}
              <div className="text-[1.08rem] leading-relaxed md:text-[1.14rem]">
                <MathText text={c.q} mode={c.k === 'cloze' ? 'hide' : 'plain'} reveal={reveal} onBlank={c.k === 'cloze' && phase === 'front' ? revealBlank : undefined} />
              </div>

              {/* 判断 / 选择 作答区 */}
              {c.k === 'judge' && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {['正确', '错误'].map((t, i) => (
                    <button
                      key={t}
                      type="button"
                      disabled={phase === 'back'}
                      aria-pressed={choice === i}
                      onClick={() => {
                        setChoice(i);
                        setPhase('back');
                      }}
                      className={cn('btn min-h-12 text-base', choice === i && (judgeCorrect ? 'border-good bg-good-soft text-good' : 'border-bad bg-bad-soft text-bad'), phase === 'back' && choice !== i && (c.a?.startsWith(i === 0 ? '✓' : '✗') ? 'border-good/50' : ''))}
                    >
                      {i === 0 ? '✓' : '✗'} {t} <kbd className="ml-1">{i === 0 ? 'Y' : 'N'}</kbd>
                    </button>
                  ))}
                </div>
              )}
              {c.k === 'mcq' && c.opts && (
                <div className="mt-4 space-y-2">
                  {c.opts.map((o, i) => {
                    const isAns = i === c.ans;
                    const picked = choice === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={phase === 'back'}
                        aria-pressed={picked}
                        onClick={() => {
                          setChoice(i);
                          setPhase('back');
                        }}
                        className={cn('btn w-full justify-start gap-3 py-2 text-left text-[0.98rem] font-normal', phase === 'back' && isAns && 'border-good bg-good-soft', phase === 'back' && picked && !isAns && 'border-bad bg-bad-soft')}
                      >
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-paper-2 font-mono text-xs text-muted">{String.fromCharCode(65 + i)}</span>
                        <span className="min-w-0 flex-1">
                          <MathText text={o} className="inline" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 提示（先于答案） */}
              {c.hook && (hint || (hintFirst && phase === 'back')) && (
                <motion.div initial={motionOn ? { opacity: 0, height: 0 } : false} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                  <div className="mt-4 rounded-xl bg-accent-soft/60 px-3 py-2.5 text-sm">
                    <div className="mb-0.5 flex items-center gap-1 text-xs font-semibold text-accent">
                      <Icon.Bulb size={14} /> 提示
                    </div>
                    <MathText text={c.hook} />
                  </div>
                </motion.div>
              )}
            </div>

            {/* 背面：与正面互斥的答案区域（正面保持可见，答案区仅在 back 阶段渲染） */}
            {(phase === 'back' || (c.k === 'steps' && reveal > 0)) && (
              <motion.div key="back" initial={motionOn ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="border-t border-line bg-paper-2/50 px-4 py-4 md:px-6">
                {c.k === 'judge' && choice != null && (
                  <div className={cn('mb-2 text-sm font-semibold', judgeCorrect ? 'text-good' : 'text-bad')}>{judgeCorrect ? '判断正确' : '判断错误'}</div>
                )}
                {c.k === 'mcq' && choice != null && <div className={cn('mb-2 text-sm font-semibold', mcqCorrect ? 'text-good' : 'text-bad')}>{mcqCorrect ? '选择正确' : `选择错误，正确答案 ${String.fromCharCode(65 + (c.ans ?? 0))}`}</div>}
                {c.a && (
                  <div className="text-[1.02rem] leading-relaxed">
                    <MathText text={c.a} mode="show" maxLines={c.k === 'steps' && phase === 'front' ? reveal : undefined} />
                  </div>
                )}
                {c.k === 'steps' && phase === 'front' && (
                  <div className="mt-2 text-xs text-muted">
                    第 {reveal} / {steps} 步
                  </div>
                )}
                {phase === 'back' && c.cond && (
                  <div className="mt-3 rounded-xl border border-line bg-paper px-3 py-2 text-sm">
                    <span className="mr-1 font-semibold text-ink-2">条件</span>
                    <MathText text={c.cond} className="inline" />
                  </div>
                )}
                {phase === 'back' && c.trap && (
                  <div className="mt-3 rounded-xl bg-bad-soft/60 px-3 py-2 text-sm">
                    <span className="mr-1 font-semibold text-bad">易错</span>
                    <MathText text={c.trap} className="inline" />
                  </div>
                )}
              </motion.div>
            )}
          </motion.article>
        </AnimatePresence>
      </div>

      {/* 底部操作 */}
      <footer className="sticky bottom-0 z-30 border-t border-line bg-paper/90 backdrop-blur-md safe-b">
        <div className="mx-auto max-w-3xl px-3 pt-2 pb-1">
          {phase === 'front' ? (
            <div className="flex gap-2">
              {isCram && (
                <button type="button" className="btn btn-icon" onClick={() => skip(-1)} disabled={plan.ids.indexOf(c.id) <= 0} aria-label="上一张 (←)">
                  <Icon.Back />
                </button>
              )}
              {c.hook && !hint && (
                <button type="button" className="btn" onClick={() => setHint(true)}>
                  <Icon.Bulb size={16} /> 提示 <kbd>H</kbd>
                </button>
              )}
              {c.k === 'cloze' || c.k === 'steps' ? (
                <>
                  <button type="button" className="btn flex-1" onClick={revealNext}>
                    {c.k === 'cloze' ? `揭示下一空（${reveal}/${blanks}）` : `下一步（${reveal}/${steps}）`}
                    <kbd>␣</kbd>
                  </button>
                  <button type="button" className="btn btn-primary" onClick={showAnswer}>
                    全部
                  </button>
                </>
              ) : c.k === 'judge' || c.k === 'mcq' ? (
                <div className="flex flex-1 items-center justify-center text-sm text-muted">先作答，再查看解析</div>
              ) : (
                <button type="button" className="btn btn-primary flex-1 text-base" onClick={showAnswer}>
                  回忆完毕，显示答案 <kbd className="ml-1 opacity-80">␣</kbd>
                </button>
              )}
              {isCram && (
                <button type="button" className="btn btn-icon" onClick={() => skip(1)} aria-label="下一张 (→)">
                  <Icon.Chevron />
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {GRADES.map((g) => (
                <button key={g.g} type="button" onClick={() => grade(g.g)} className={cn('btn min-h-[3.25rem] flex-col gap-0 border', g.cls)} aria-label={`${g.label}（快捷键 ${g.key}）`}>
                  <span className="text-[0.95rem]">{g.label}</span>
                  <span className="text-[0.68rem] font-medium opacity-75">{intervals ? intervals[g.g] : isCram ? (g.g === Rating.Again ? '稍后再出' : '下一张') : ''}</span>
                </button>
              ))}
            </div>
          )}
          <div className="mt-1 hidden justify-center gap-3 text-[0.68rem] text-muted md:flex">
            <span>
              <kbd>␣</kbd> 显示
            </span>
            <span>
              <kbd>1</kbd>–<kbd>4</kbd> 评分
            </span>
            <span>
              <kbd>H</kbd> 提示
            </span>
            <span>
              <kbd>F</kbd> 收藏
            </span>
            <span>
              <kbd>U</kbd> 撤销
            </span>
            <span>
              <kbd>I</kbd> 详情
            </span>
            <span>
              <kbd>Esc</kbd> 退出
            </span>
          </div>
        </div>
      </footer>

      <CardSheet id={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'bad' }) {
  return (
    <div className="rounded-xl bg-paper-2 px-2 py-3">
      <div className={cn('text-xl font-bold tabular-nums', tone === 'bad' && 'text-bad')}>{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}

export function chapterTitleOf(ch: string) {
  return CHAPTER_MAP[ch]?.title ?? ch;
}
