'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Info, Lightbulb, Star, Undo2 } from 'lucide-react';
import { CARD_MAP, chapterColor, type KCard } from '@/data';
import { MathText, countCloze, countLines } from '@/lib/math';
import { rate, undoRate, previewIntervals, toggleFlag, useStore, Rating, setCursor, useExam, type Grade, type Card } from '@/lib/store';
import { requeue, type SessionPlan } from '@/lib/session';
import { cn, vibrate, fmtMs } from '@/lib/cn';
import { Button, Kbd, useMotionOn, useMediaQuery, Tip } from './ui';
import { CardBadges, CardSheet } from './CardSheet';

interface Props {
  plan: SessionPlan;
  onExit: () => void;
}
/** 单卡交互状态：所有切换都通过 setView 原子更新，保证互斥 */
interface View {
  phase: 'front' | 'back';
  hint: boolean;
  reveal: number; // 已揭示的挖空 / 步骤数
  choice: number | null; // judge: 0=✓ 1=✗；mcq: 选项下标
  seq: number; // 用于动画 key
}

interface Done {
  id: string;
  grade: Grade;
  prev: Card | undefined;
  wasNew: boolean;
  ms: number;
}

const GRADES: { g: Grade; label: string; key: string; cls: string }[] = [
  { g: Rating.Again, label: '忘了', key: '1', cls: 'text-bad bg-bad-soft hover:brightness-[0.98]' },
  { g: Rating.Hard, label: '模糊', key: '2', cls: 'text-warn bg-warn-soft hover:brightness-[0.98]' },
  { g: Rating.Good, label: '记住', key: '3', cls: 'text-good bg-good-soft hover:brightness-[0.98]' },
  { g: Rating.Easy, label: '轻松', key: '4', cls: 'text-accent bg-accent-soft hover:brightness-[0.98]' },
];

const FRESH: View = { phase: 'front', hint: false, reveal: 0, choice: null, seq: 0 };

export function Study({ plan, onExit }: Props) {
  const router = useRouter();
  const exam = useExam();
  const haptics = useStore((s) => s.settings.haptics);
  const order = useStore((s) => s.settings.order);
  const flags = useStore((s) => s.flags);
  const motionOn = useMotionOn();
  const desktop = useMediaQuery('(min-width: 1024px)');

  const [queue, setQueue] = useState<string[]>(() => plan.ids.slice(plan.startIndex ?? 0));
  const [view, setView] = useState<View>(FRESH);
  const [done, setDone] = useState<Done[]>([]);
  const [detail, setDetail] = useState<string | null>(null);
  const startRef = useRef(0);
  const sessionStart = useRef(0);
  const lockRef = useRef(false); // 切卡过渡中忽略输入
  const [elapsed, setElapsed] = useState(0);
  const total = plan.ids.length - (plan.startIndex ?? 0);
  const isCram = !!plan.cram;

  useEffect(() => {
    const t = Date.now();
    sessionStart.current = sessionStart.current || t;
    startRef.current = startRef.current || t;
  }, []);

  const id = queue[0];
  const card: KCard | undefined = id ? CARD_MAP[id] : undefined;
  const blanks = card?.k === 'cloze' ? countCloze(card.q) : 0;
  const steps = card?.k === 'steps' && card.a ? countLines(card.a) : 0;

  // 顺序通读进度
  useEffect(() => {
    if (!card || order !== 'sequential' || plan.mode !== 'all') return;
    const idx = plan.ids.indexOf(card.id);
    if (idx >= 0) setCursor(exam, idx);
  }, [card, order, plan, exam]);

  // 切卡后回到顶部，避免长卡片停留在底部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [view.seq]);

  const next = useCallback(() => {
    lockRef.current = true;
    startRef.current = Date.now();
    setView((v) => ({ ...FRESH, seq: v.seq + 1 }));
    window.setTimeout(() => {
      lockRef.current = false;
    }, 160);
  }, []);

  const showAnswer = useCallback(() => {
    if (!card) return;
    setView((v) => {
      if (v.phase === 'back') return v;
      const reveal = card.k === 'cloze' ? blanks : card.k === 'steps' ? steps : v.reveal;
      return { ...v, phase: 'back', reveal };
    });
  }, [card, blanks, steps]);

  const revealNext = useCallback(() => {
    if (!card) return;
    setView((v) => {
      if (v.phase === 'back') return v;
      const max = card.k === 'cloze' ? blanks : card.k === 'steps' ? steps : 0;
      if (max === 0) return { ...v, phase: 'back' };
      const n = Math.min(max, v.reveal + 1);
      return { ...v, reveal: n, phase: n >= max ? 'back' : 'front' };
    });
  }, [card, blanks, steps]);

  const revealBlank = useCallback(
    (i: number) => {
      if (!card || card.k !== 'cloze') return;
      setView((v) => {
        if (v.phase === 'back') return v;
        const n = Math.max(v.reveal + 1, Math.min(blanks, i + 1));
        return { ...v, reveal: n, phase: n >= blanks ? 'back' : 'front' };
      });
    },
    [card, blanks],
  );

  const answer = useCallback(
    (choice: number) => {
      setView((v) => (v.phase === 'back' ? v : { ...v, choice, phase: 'back' }));
    },
    [],
  );

  const grade = useCallback(
    (g: Grade) => {
      if (!card || view.phase !== 'back' || lockRef.current) return;
      const ms = Date.now() - startRef.current;
      if (haptics) vibrate(g === Rating.Again ? [30, 40, 30] : 12);
      let entry: Done;
      if (isCram) entry = { id: card.id, grade: g, prev: undefined, wasNew: false, ms };
      else {
        const r = rate(card.id, g, ms);
        entry = { id: card.id, grade: g, prev: r.prev, wasNew: r.wasNew, ms };
      }
      setDone((d) => [...d, entry]);
      setElapsed(Date.now() - sessionStart.current);
      setQueue((q) => {
        const rest = q.slice(1);
        if (g === Rating.Again || (g === Rating.Hard && entry.wasNew)) return requeue([card.id, ...rest], card.id, 3);
        return rest;
      });
      next();
    },
    [card, view.phase, haptics, isCram, next],
  );

  const skip = useCallback(
    (dir: 1 | -1) => {
      if (!card || lockRef.current) return;
      if (dir === 1) setQueue((q) => q.slice(1));
      else {
        const idx = plan.ids.indexOf(card.id);
        if (idx <= 0) return;
        setQueue((q) => [plan.ids[idx - 1], ...q]);
      }
      next();
    },
    [card, plan.ids, next],
  );

  const undo = useCallback(() => {
    const last = done[done.length - 1];
    if (!last || lockRef.current) return;
    if (!isCram) undoRate(last.id, last.prev, last.grade, last.ms, last.wasNew);
    setDone((d) => d.slice(0, -1));
    setQueue((q) => [last.id, ...q.filter((x) => x !== last.id)]);
    next();
  }, [done, isCram, next]);

  // 键盘
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (detail || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Escape') return onExit();
      if (!card) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (view.phase !== 'front') return;
        if (card.k === 'cloze' || card.k === 'steps') revealNext();
        else if (card.k !== 'judge' && card.k !== 'mcq') showAnswer();
        return;
      }
      if (view.phase === 'front' && card.k === 'judge' && (e.key === 'y' || e.key === 'n')) return answer(e.key === 'y' ? 0 : 1);
      if (view.phase === 'front' && card.k === 'mcq' && /^[a-dA-D]$/.test(e.key)) {
        const i = e.key.toLowerCase().charCodeAt(0) - 97;
        if (card.opts && i < card.opts.length) answer(i);
        return;
      }
      if (view.phase === 'back' && ['1', '2', '3', '4'].includes(e.key)) return grade(Number(e.key) as Grade);
      if (e.key === 'h' || e.key === 'H') return setView((v) => ({ ...v, hint: true }));
      if (e.key === 'f' || e.key === 'F') return toggleFlag(card.id);
      if (e.key === 'u' || e.key === 'U') return undo();
      if (e.key === 'i' || e.key === 'I') return setDetail(card.id);
      if (isCram && e.key === 'ArrowRight') return skip(1);
      if (isCram && e.key === 'ArrowLeft') return skip(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, view.phase, detail, grade, undo, showAnswer, revealNext, answer, onExit, isCram, skip]);

  const intervals = useMemo(() => (card && !isCram && view.phase === 'back' ? previewIntervals(card.id) : null), [card, isCram, view.phase]);
  const denominator = Math.max(total, done.length + queue.length);
  const progress = denominator > 0 ? done.length / denominator : 0;

  /* ---------------- 结束页 ---------------- */
  if (!card) {
    const again = done.filter((d) => d.grade === Rating.Again).length;
    const unique = new Set(done.map((d) => d.id)).size;
    const kids = new Set(done.map((d) => CARD_MAP[d.id]?.kid ?? d.id)).size;
    return (
      <div className="flex min-h-dvh flex-col px-4 pb-[calc(var(--sab)+1.5rem)] pt-[calc(var(--sat)+1.5rem)]">
        <div className="m-auto w-full max-w-md">
          <motion.div initial={motionOn ? { opacity: 0, y: 12 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="card px-6 py-8 text-center">
            <div className="text-sm font-medium text-muted">{plan.title}</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">{done.length === 0 ? '没有可学习的卡片' : isCram ? '自测完成' : '本轮完成'}</div>
            {done.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-2 text-left sm:grid-cols-4">
                <Mini label="评分次数" value={String(done.length)} />
                <Mini label="卡片 / 知识点" value={`${unique} / ${kids}`} />
                <Mini label="忘了" value={String(again)} tone={again ? 'bad' : undefined} />
                <Mini label="用时" value={fmtMs(elapsed)} />
              </div>
            )}
            {done.length === 0 && <p className="mt-3 text-sm text-muted">{plan.mode === 'daily' ? '今天的复习与新卡都已完成。可以从章节里主动学习，或调整每日新卡上限。' : '该集合当前没有卡片。'}</p>}
            {isCram && done.length > 0 && <p className="mt-4 text-xs text-muted">自测不写入复习调度与统计。</p>}
            <div className="mt-6 flex flex-col gap-2">
              {!isCram && done.length > 0 && plan.mode !== 'daily' && (
                <Button variant="primary" size="lg" onClick={() => router.replace('/study?mode=daily')}>
                  继续今日任务
                </Button>
              )}
              <Button size="lg" onClick={onExit}>
                返回
              </Button>
              <Link href="/" className="text-sm text-muted hover:text-ink">
                回到首页
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const c = card;
  const flagged = flags.includes(c.id);
  const judgeTruth = c.k === 'judge' ? (c.a?.trimStart().startsWith('✓') ? 0 : 1) : null;
  const judgeCorrect = c.k === 'judge' && view.choice != null ? judgeTruth === view.choice : null;
  const mcqCorrect = c.k === 'mcq' && view.choice != null ? view.choice === c.ans : null;
  const isBack = view.phase === 'back';
  const canShowHint = !!c.hook && !view.hint && !isBack;
  const color = chapterColor(c.ch);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* 顶栏 */}
      <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-1 px-2 pb-1.5 pt-[max(var(--sat),0.5rem)] sm:px-4">
          <Button variant="ghost" size="icon" onClick={onExit} aria-label="退出学习">
            <ArrowLeft />
          </Button>
          <div className="min-w-0 flex-1 px-1">
            <div className="truncate text-sm font-semibold">{plan.title}</div>
            <div className="tnum text-xs text-muted">
              {done.length} / {denominator} · 剩 {queue.length}
              {isCram ? ' · 自测' : ''}
            </div>
          </div>
          <Tip label="撤销上一张 (U)">
            <Button variant="ghost" size="icon" onClick={undo} disabled={done.length === 0} aria-label="撤销上一张">
              <Undo2 />
            </Button>
          </Tip>
          <Tip label={flagged ? '取消收藏 (F)' : '收藏 (F)'}>
            <Button variant="ghost" size="icon" className={cn(flagged && 'text-warn')} onClick={() => toggleFlag(c.id)} aria-pressed={flagged} aria-label="收藏">
              <Star className={cn(flagged && 'fill-current')} />
            </Button>
          </Tip>
          <Tip label="知识详情 (I)">
            <Button variant="ghost" size="icon" onClick={() => setDetail(c.id)} aria-label="知识详情">
              <Info />
            </Button>
          </Tip>
        </div>
        <div className="mx-auto max-w-3xl px-3 sm:px-4">
          <div className="bar" style={{ height: 3 }}>
            <i style={{ width: `${progress * 100}%`, background: color }} />
          </div>
        </div>
      </header>

      {/* 卡片 */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-3 pb-[calc(6.5rem+var(--sab))] pt-3 sm:px-4 md:pt-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={`${c.id}-${view.seq}`}
            initial={motionOn ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={motionOn ? { opacity: 0, y: -6, transition: { duration: 0.12, ease: 'easeIn' } } : { opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="card overflow-hidden"
          >
            <div className="h-1" style={{ background: color }} aria-hidden />
            <div className="px-4 pb-4 pt-4 sm:px-6 sm:pt-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <CardBadges card={c} compact />
                <span className="shrink-0 text-xs text-muted">{c.sec}</span>
              </div>

              {/* 正面 */}
              <div className="text-[18px] leading-relaxed sm:text-[19px]">
                {c.k === 'cloze' ? (
                  <MathText text={c.q} mode={isBack ? 'show' : 'hide'} reveal={view.reveal} onBlank={isBack ? undefined : revealBlank} />
                ) : (
                  <MathText text={c.q} mode="plain" />
                )}
              </div>

              {c.k === 'judge' && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {(['正确', '错误'] as const).map((label, i) => {
                    const chosen = view.choice === i;
                    const truthy = isBack && judgeTruth === i;
                    return (
                      <Button key={label} size="lg" variant="outline" disabled={isBack} onClick={() => answer(i)} aria-pressed={chosen} className={cn('h-12 justify-center text-[15px] disabled:opacity-100', truthy && 'border-good bg-good-soft text-good', isBack && chosen && !truthy && 'border-bad bg-bad-soft text-bad')}>
                        {label}
                        <span className="ml-1 text-xs opacity-60">{i === 0 ? 'Y' : 'N'}</span>
                      </Button>
                    );
                  })}
                </div>
              )}

              {c.k === 'mcq' && c.opts && (
                <ol className="mt-4 space-y-2">
                  {c.opts.map((o, i) => {
                    const chosen = view.choice === i;
                    const truthy = isBack && i === c.ans;
                    return (
                      <li key={i}>
                        <button type="button" disabled={isBack} onClick={() => answer(i)} aria-pressed={chosen} className={cn('flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors', isBack ? 'cursor-default' : 'hover:bg-paper-2', truthy ? 'border-good bg-good-soft/60' : isBack && chosen ? 'border-bad bg-bad-soft/60' : 'border-line-2')}>
                          <span className={cn('mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold', truthy ? 'bg-good text-white' : isBack && chosen ? 'bg-bad text-white' : 'bg-paper-2 text-muted')}>{String.fromCharCode(65 + i)}</span>
                          <span className="min-w-0 flex-1">
                            <MathText text={o} />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              )}

              {/* 提示 */}
              <AnimatePresence initial={false}>
                {view.hint && c.hook && !isBack && (
                  <motion.div key="hint" initial={motionOn ? { opacity: 0, height: 0 } : false} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="mt-4 rounded-xl border border-warn/25 bg-warn-soft/50 px-3.5 py-3 text-[15px]">
                      <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-warn">
                        <Lightbulb className="size-3.5" /> 提示
                      </div>
                      <MathText text={c.hook} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 步骤：逐步揭示 */}
              {c.k === 'steps' && c.a && view.reveal > 0 && !isBack && (
                <div className="mt-4 border-t border-line pt-4 text-[16px]">
                  <MathText text={c.a} maxLines={view.reveal} />
                  <div className="mt-2 text-xs text-muted">
                    已显示 {view.reveal} / {steps} 步
                  </div>
                </div>
              )}
            </div>

            {/* 背面（仅 back 阶段渲染，互斥） */}
            <AnimatePresence initial={false}>
              {isBack && (
                <motion.div key="back" initial={motionOn ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} className="border-t border-line bg-paper-2/40 px-4 py-4 sm:px-6">
                  {judgeCorrect != null && (
                    <div className={cn('mb-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium', judgeCorrect ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad')}>{judgeCorrect ? '判断正确' : '判断错误'}</div>
                  )}
                  {mcqCorrect != null && (
                    <div className={cn('mb-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium', mcqCorrect ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad')}>
                      {mcqCorrect ? '选择正确' : `选择错误 · 正确答案 ${String.fromCharCode(65 + (c.ans ?? 0))}`}
                    </div>
                  )}
                  {c.a && c.k !== 'cloze' && (
                    <div className="text-[16px] sm:text-[17px]">
                      <MathText text={c.k === 'judge' ? c.a.replace(/^\s*[✓✗]\s*/, '') : c.a} />
                    </div>
                  )}
                  {c.a && c.k === 'cloze' && (
                    <div className="text-[16px]">
                      <MathText text={c.a} />
                    </div>
                  )}
                  {c.cond && (
                    <Note label="适用条件" tone="accent">
                      <MathText text={c.cond} />
                    </Note>
                  )}
                  {c.hook && (
                    <Note label="记忆锚点">
                      <MathText text={c.hook} />
                    </Note>
                  )}
                  {c.trap && (
                    <Note label="易错 · 反例" tone="bad">
                      <MathText text={c.trap} />
                    </Note>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        </AnimatePresence>

        {desktop && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 px-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1"><Kbd>空格</Kbd> 显示 / 下一空</span>
            <span className="inline-flex items-center gap-1"><Kbd>1</Kbd>–<Kbd>4</Kbd> 评分</span>
            <span className="inline-flex items-center gap-1"><Kbd>H</Kbd> 提示</span>
            <span className="inline-flex items-center gap-1"><Kbd>F</Kbd> 收藏</span>
            <span className="inline-flex items-center gap-1"><Kbd>U</Kbd> 撤销</span>
            <span className="inline-flex items-center gap-1"><Kbd>I</Kbd> 详情</span>
            <span className="inline-flex items-center gap-1"><Kbd>Esc</Kbd> 退出</span>
          </div>
        )}
      </div>

      {/* 底部操作栏（固定） */}
      <div className="action-bar">
        <div className="mx-auto max-w-3xl">
          {!isBack ? (
            <div className="flex items-center gap-2">
              {isCram && (
                <Button size="lg" variant="ghost" className="w-12 px-0" onClick={() => skip(-1)} aria-label="上一张" disabled={plan.ids.indexOf(c.id) <= 0}>
                  <ChevronLeft />
                </Button>
              )}
              {canShowHint && (
                <Button size="lg" variant="outline" onClick={() => setView((v) => ({ ...v, hint: true }))} className="shrink-0">
                  <Lightbulb />
                  提示
                </Button>
              )}
              {c.k === 'judge' || c.k === 'mcq' ? (
                <div className="flex h-12 flex-1 items-center justify-center text-sm text-muted">先作答再看解析</div>
              ) : c.k === 'cloze' ? (
                <>
                  <Button size="lg" variant="outline" className="flex-1" onClick={revealNext}>
                    下一空 <span className="tnum text-xs opacity-60">{view.reveal}/{blanks}</span>
                  </Button>
                  <Button size="lg" variant="primary" className="flex-1" onClick={showAnswer}>
                    全部显示
                  </Button>
                </>
              ) : c.k === 'steps' ? (
                <>
                  <Button size="lg" variant="outline" className="flex-1" onClick={revealNext}>
                    下一步 <span className="tnum text-xs opacity-60">{view.reveal}/{steps}</span>
                  </Button>
                  <Button size="lg" variant="primary" className="flex-1" onClick={showAnswer}>
                    全部显示
                  </Button>
                </>
              ) : (
                <Button size="lg" variant="primary" className="flex-1" onClick={showAnswer}>
                  显示答案
                </Button>
              )}
              {isCram && (
                <Button size="lg" variant="ghost" className="w-12 px-0" onClick={() => skip(1)} aria-label="下一张">
                  <ChevronRight />
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {GRADES.map((g) => (
                <button key={g.g} type="button" onClick={() => grade(g.g)} className={cn('flex h-[3.25rem] flex-col items-center justify-center rounded-xl text-[15px] font-semibold leading-none transition-[transform,filter] active:scale-[0.97]', g.cls)} aria-label={`${g.label}（${g.key}）`}>
                  {g.label}
                  <span className="tnum mt-1 text-[11px] font-medium opacity-70">{intervals ? intervals[g.g] : isCram ? '自测' : ''}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <CardSheet id={detail} onClose={() => setDetail(null)} onOpenCard={(cid) => setDetail(cid)} />
    </div>
  );
}

function Note({ label, tone, children }: { label: string; tone?: 'bad' | 'accent'; children: React.ReactNode }) {
  return (
    <div className={cn('mt-3 rounded-xl border px-3.5 py-3 text-[15px]', tone === 'bad' ? 'border-bad/20 bg-bad-soft/40' : tone === 'accent' ? 'border-accent/20 bg-accent-soft/40' : 'border-line bg-paper')}>
      <div className={cn('mb-1 text-[11px] font-semibold uppercase tracking-wide', tone === 'bad' ? 'text-bad' : tone === 'accent' ? 'text-accent' : 'text-muted')}>{label}</div>
      {children}
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: 'bad' }) {
  return (
    <div className="rounded-xl border border-line px-3 py-2">
      <div className="text-[11px] text-muted">{label}</div>
      <div className={cn('tnum mt-0.5 text-lg font-semibold', tone === 'bad' && 'text-bad')}>{value}</div>
    </div>
  );
}
