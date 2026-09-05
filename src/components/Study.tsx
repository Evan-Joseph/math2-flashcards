'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CARD_MAP, CHAPTER_MAP, KIND_LABEL, chapterColor } from '@/data';
import type { KCard } from '@/data/types';
import { MathText, countLines, hasCloze } from '@/lib/math';
import { previewIntervals, rate, undoRate, toggleFlag, setNote, useStore, humanInterval, type RateResult, type Grade } from '@/lib/store';
import { scheduleSync } from '@/lib/sync';
import type { SessionPlan } from '@/lib/session';
import { Button, Chip, Icon, IconButton, Kbd, Sheet, Stars } from './ui';
import { cn, vibrate } from '@/lib/cn';

interface HistoryItem {
  id: string;
  grade: Grade;
  res: RateResult;
  index: number;
  elapsed: number;
  requeuedAt: number | null;
}

const GRADES: { g: Grade; label: string; sub: string; cls: string; ring: string }[] = [
  { g: 1, label: '忘了', sub: '完全想不起', cls: 'bg-bad-soft text-bad border-bad/20', ring: 'ring-bad/40' },
  { g: 2, label: '模糊', sub: '想起一部分', cls: 'bg-gold-soft text-gold border-gold/20', ring: 'ring-gold/40' },
  { g: 3, label: '记得', sub: '稍作思考', cls: 'bg-accent-soft text-accent-ink border-accent/20', ring: 'ring-accent/40' },
  { g: 4, label: '轻松', sub: '脱口而出', cls: 'bg-good-soft text-good border-good/20', ring: 'ring-good/40' },
];

export function Study({ plan }: { plan: SessionPlan }) {
  const router = useRouter();
  const [queue, setQueue] = useState<string[]>(plan.ids);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [judge, setJudge] = useState<boolean | null>(null);
  const [stepsShown, setStepsShown] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [counts, setCounts] = useState<Record<Grade, number>>({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [cramMiss, setCramMiss] = useState(0);
  const [showNote, setShowNote] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<'left' | 'right' | null>(null);
  const [drag, setDrag] = useState(0);
  const startedAt = useRef(0);
  const cardStart = useRef(0);
  const [spentMs, setSpentMs] = useState(0);
  const answerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState<Set<string>>(() => new Set());

  const flags = useStore((s) => s.flags);
  const notes = useStore((s) => s.notes);
  const showHookFirst = useStore((s) => s.settings.showHookFirst);
  const simple = useStore((s) => s.settings.simpleGrading);
  const swipeOn = useStore((s) => s.settings.swipe);
  const haptics = useStore((s) => s.settings.haptics);
  const motion = useStore((s) => s.settings.motion);

  const id = queue[index];
  const card: KCard | undefined = id ? CARD_MAP[id] : undefined;
  const finished = index >= queue.length;
  const intervals = useMemo(() => (card && revealed ? previewIntervals(card.id) : null), [card, revealed]);
  const stepsTotal = card?.k === 'steps' && card.a ? countLines(card.a) : 0;
  const allStepsShown = card?.k !== 'steps' || stepsShown >= stepsTotal;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    cardStart.current = Date.now();
  }, [index]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  }, []);

  /* --- 揭示 --- */
  const reveal = useCallback(() => {
    if (revealed || finished) return;
    (document.activeElement as HTMLElement | null)?.blur?.();
    setRevealed(true);
    if (card?.k === 'steps') setStepsShown(1);
    if (haptics) vibrate(8);
    window.setTimeout(() => answerRef.current?.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'start' }), 60);
  }, [revealed, finished, card, haptics, motion]);

  const nextStep = useCallback(() => {
    setStepsShown((n) => Math.min(stepsTotal, n + 1));
  }, [stepsTotal]);

  const doJudge = useCallback(
    (choice: boolean) => {
      if (revealed) return;
      setJudge(choice);
      reveal();
    },
    [revealed, reveal],
  );

  const goNext = useCallback(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    setRevealed(false);
    setJudge(null);
    setStepsShown(0);
    setShowNote(false);
    setLeaving(null);
    setDrag(0);
    setIndex((i) => i + 1);
    window.scrollTo({ top: 0 });
  }, []);

  const advance = useCallback(
    (dir: 'left' | 'right') => {
      if (!motion) return goNext();
      setLeaving(dir);
      window.setTimeout(goNext, 180);
    },
    [motion, goNext],
  );

  /* --- 评分 --- */
  const grade = useCallback(
    (g: Grade) => {
      if (!card || !revealed || leaving) return;
      const elapsed = Date.now() - cardStart.current;
      setSpentMs((m) => m + Math.min(elapsed, 10 * 60000));
      if (haptics) vibrate(g === 1 ? [10, 30, 10] : 12);
      if (plan.cram) {
        setCounts((c) => ({ ...c, [g]: c[g] + 1 }));
        if (g === 1) {
          setCramMiss((n) => n + 1);
          const nq = [...queue];
          nq.splice(Math.min(queue.length, index + 1 + 4), 0, card.id);
          setQueue(nq);
        }
        setSeen((x) => new Set(x).add(card.id));
        advance(g === 1 ? 'left' : 'right');
        return;
      }
      const res = rate(card.id, g, elapsed);
      setCounts((c) => ({ ...c, [g]: c[g] + 1 }));
      setSeen((x) => new Set(x).add(card.id));
      let requeuedAt: number | null = null;
      if (res.requeue) {
        const pos = Math.min(queue.length, index + 1 + (g === 1 ? 3 : 6));
        requeuedAt = pos;
        const nq = [...queue];
        nq.splice(pos, 0, card.id);
        setQueue(nq);
      }
      setHistory((h) => [...h, { id: card.id, grade: g, res, index, elapsed, requeuedAt }]);
      if (res.leech) notify('这张卡已遗忘 4 次以上，建议在笔记里写下自己的记忆锚点');
      scheduleSync();
      advance(g === 1 ? 'left' : 'right');
    },
    [card, revealed, leaving, haptics, plan.cram, queue, index, advance, notify],
  );

  const undo = useCallback(() => {
    const last = history[history.length - 1];
    if (!last || plan.cram) return;
    undoRate(last.id, last.res.prev, last.grade, last.elapsed, last.res.wasNew);
    setHistory((h) => h.slice(0, -1));
    setCounts((c) => ({ ...c, [last.grade]: Math.max(0, c[last.grade] - 1) }));
    setQueue((q) => {
      if (last.requeuedAt == null) return q;
      const nq = [...q];
      nq.splice(last.requeuedAt, 1);
      return nq;
    });
    setIndex(last.index);
    setRevealed(true);
    setJudge(null);
    const prevCard = CARD_MAP[last.id];
    setStepsShown(prevCard?.k === 'steps' && prevCard.a ? countLines(prevCard.a) : 0);
    cardStart.current = Date.now() - last.elapsed;
    notify('已撤销上一次评分');
  }, [history, plan.cram, notify]);

  /* --- 键盘 --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      if (e.key === 'Escape') {
        if (showNote || showKeys) return;
        return router.push('/');
      }
      if (finished) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!revealed) return reveal();
        if (!allStepsShown) return nextStep();
        return;
      }
      if (!revealed && card?.k === 'judge') {
        if (e.key.toLowerCase() === 'y' || e.key === 'ArrowLeft') return doJudge(true);
        if (e.key.toLowerCase() === 'n' || e.key === 'ArrowRight') return doJudge(false);
      }
      if (revealed && allStepsShown && ['1', '2', '3', '4'].includes(e.key)) {
        const g = Number(e.key) as Grade;
        if (simple && (g === 2 || g === 4)) return;
        return grade(g);
      }
      if (e.key.toLowerCase() === 'z') return undo();
      if (e.key.toLowerCase() === 'f' && card) return toggleFlag(card.id);
      if (e.key === '?' || e.key === 'h') return setShowKeys(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finished, revealed, allStepsShown, card, reveal, nextStep, doJudge, grade, undo, router, showNote, showKeys, simple]);

  /* --- 滑动手势（揭示后） --- */
  const pointer = useRef<{ x: number; y: number; id: number; active: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (!swipeOn || !revealed || !allStepsShown || e.pointerType === 'mouse') return;
    pointer.current = { x: e.clientX, y: e.clientY, id: e.pointerId, active: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const p = pointer.current;
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (!p.active) {
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        p.active = true;
        (e.currentTarget as HTMLElement).setPointerCapture(p.id);
      } else if (Math.abs(dy) > 12) {
        pointer.current = null;
        return;
      }
    }
    if (p.active) setDrag(Math.max(-160, Math.min(160, dx)));
  };
  const onPointerEnd = () => {
    const p = pointer.current;
    pointer.current = null;
    if (!p?.active) return setDrag(0);
    if (drag <= -90) grade(1);
    else if (drag >= 90) grade(3);
    setDrag(0);
  };

  /* ---------------- 结束页 ---------------- */
  if (finished || !card) {
    const n = Object.values(counts).reduce((a, b) => a + b, 0);
    const mins = Math.max(1, Math.round(spentMs / 60000));
    const ok = n ? Math.round(((counts[3] + counts[4]) / n) * 100) : 0;
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 pt-10 pb-10">
        <div className="anim-pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-good-soft text-good">
          <Icon.Check className="h-10 w-10" />
        </div>
        <h1 className="mt-5 text-center text-2xl font-extrabold">{n === 0 ? '没有需要复习的卡片' : plan.cram ? '速刷完成' : '本轮完成'}</h1>
        <p className="mt-1 text-center text-sm text-muted">
          {plan.title} · {n} 张 · 约 {mins} 分钟
        </p>
        {n > 0 && (
          <div className="anim-rise delay-1 mt-6 grid grid-cols-4 gap-2">
            {GRADES.map((g) => (
              <div key={g.g} className={cn('rounded-xl border p-2 text-center', g.cls)}>
                <div className="tabular text-xl font-extrabold">{counts[g.g]}</div>
                <div className="text-[11px] font-semibold opacity-80">{g.label}</div>
              </div>
            ))}
          </div>
        )}
        {n > 0 && (
          <div className="anim-rise delay-2 mt-4 rounded-2xl border border-line bg-card p-4 text-sm leading-relaxed text-ink-soft">
            {plan.cram ? (
              <>
                巩固模式不写入复习计划。本轮有 <b className="text-ink">{cramMiss}</b> 次「忘了」，这些卡已在轮内重复出现过。
              </>
            ) : (
              <>
                回忆成功率 <b className="text-ink">{ok}%</b>。
                {ok >= 90 ? ' 状态很好，可以适当提高每日新卡量。' : ok >= 70 ? ' 处于理想区间（FSRS 目标 90%），保持每天清空到期即可。' : ' 遗忘偏多，建议今天不再新增新卡，明天优先清空到期。'}
              </>
            )}
          </div>
        )}
        <div className="mt-auto flex flex-col gap-2 pt-8">
          {!plan.cram && history.some((h) => h.grade <= 2) && (
            <Link href={`/study?mode=custom&cram=1&title=${encodeURIComponent('本轮错题巩固')}&ids=${[...new Set(history.filter((h) => h.grade <= 2).map((h) => h.id))].join(',')}`}>
              <Button size="lg" className="w-full">
                <Icon.Shuffle /> 巩固本轮忘了 / 模糊的卡
              </Button>
            </Link>
          )}
          <Link href="/">
            <Button variant="primary" size="lg" className="w-full">
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- 学习页 ---------------- */
  const ch = CHAPTER_MAP[card.ch];
  const flagged = flags.includes(card.id);
  const note = notes[card.id];
  const isCloze = card.k === 'cloze' && hasCloze(card.q);
  const judgeTruth = card.k === 'judge' && card.a ? card.a.trim().startsWith('✓') : null;
  const judgeRight = judge != null && judgeTruth != null ? judge === judgeTruth : null;
  const done = index;
  const progress = queue.length ? done / queue.length : 0;
  const isRepeat = seen.has(card.id);
  const color = chapterColor(card.ch);
  const dragHint = drag <= -60 ? '忘了' : drag >= 60 ? '记得' : null;

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col" style={{ ['--ch' as string]: color, ['--ch-soft' as string]: chapterColor(card.ch, 0.94, 0.04) }}>
      {/* 顶栏 */}
      <header className="safe-t sticky top-0 z-30 bg-paper/85 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-1 px-2">
          <IconButton label="退出学习" onClick={() => router.push('/')}>
            <Icon.X />
          </IconButton>
          <div className="min-w-0 flex-1 text-center">
            <div className="truncate text-sm font-bold">{plan.title}</div>
            <div className="tabular text-[11px] text-muted">
              {done + 1} / {queue.length}
              {plan.cram && ' · 巩固模式'}
            </div>
          </div>
          <IconButton label="快捷键" onClick={() => setShowKeys(true)} className="hidden md:inline-grid">
            <Icon.Keyboard />
          </IconButton>
          <IconButton label="撤销上一次评分" onClick={undo} disabled={!history.length || plan.cram}>
            <Icon.Undo />
          </IconButton>
          <IconButton label={flagged ? '取消标记' : '标记此卡'} onClick={() => toggleFlag(card.id)} className={cn(flagged && 'text-gold')}>
            <Icon.Flag filled={flagged} />
          </IconButton>
        </div>
        <div className="h-1 w-full bg-line">
          <div className="h-full bg-ch" style={{ width: `${progress * 100}%`, transition: 'width 400ms cubic-bezier(.2,.8,.2,1)' }} />
        </div>
      </header>

      {/* 卡片 */}
      <div className="flex-1 px-3 pt-3 pb-40 md:px-6">
        <div
          key={`${card.id}-${index}`}
          ref={cardRef}
          className={cn('anim-card relative rounded-3xl border border-line bg-card shadow-card', leaving && 'opacity-0')}
          style={{
            transform: drag ? `translateX(${drag}px) rotate(${drag / 40}deg)` : leaving ? `translateX(${leaving === 'left' ? -60 : 60}px)` : undefined,
            transition: drag ? 'none' : 'transform 180ms ease, opacity 180ms ease',
            touchAction: 'pan-y',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          {dragHint && (
            <div className={cn('anim-pop pointer-events-none absolute top-4 z-10 rounded-xl border-2 px-3 py-1 text-lg font-black', drag < 0 ? 'right-4 border-bad text-bad' : 'left-4 border-accent text-accent-ink')}>{dragHint}</div>
          )}
          {/* 题面 */}
          <div className="p-5 md:p-7">
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <Chip tone="ch">{ch.short}</Chip>
              <Chip>{card.sec}</Chip>
              <Chip>{KIND_LABEL[card.k]}</Chip>
              <Stars n={card.s} className="ml-1" />
              {isRepeat && <Chip tone="gold">再次出现</Chip>}
              {note && <Chip tone="accent">有笔记</Chip>}
            </div>
            <div className={cn('text-[1.1rem] leading-[1.75] md:text-[1.2rem]', card.k === 'qa' || card.k === 'steps' ? 'font-semibold' : '')}>
              <MathText text={card.q} mode={isCloze ? (revealed ? 'show' : 'hide') : 'plain'} />
            </div>
            {card.k === 'judge' && !revealed && (
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button size="lg" onClick={() => doJudge(true)} className="border-good/30 text-good">
                  ✓ 正确 <Kbd>Y</Kbd>
                </Button>
                <Button size="lg" onClick={() => doJudge(false)} className="border-bad/30 text-bad">
                  ✗ 错误 <Kbd>N</Kbd>
                </Button>
              </div>
            )}
            {!revealed && card.k !== 'judge' && (
              <p className="mt-5 text-xs text-muted">
                {isCloze ? '先在心里（或纸上）补全空格，再显示答案。' : card.k === 'steps' ? '先口述完整步骤，再逐步核对。' : '先完整说出内容、条件与易错点，再显示答案。'}
              </p>
            )}
          </div>

          {/* 答案 */}
          {revealed && (
            <div ref={answerRef} className="scroll-mt-20 border-t border-line bg-card2/60 p-5 md:p-7" aria-live="polite">
              {judgeRight != null && (
                <div className={cn('anim-pop mb-3 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold', judgeRight ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad')}>
                  {judgeRight ? <Icon.Check className="h-4 w-4" /> : <Icon.X className="h-4 w-4" />}
                  你判断为「{judge ? '正确' : '错误'}」，{judgeRight ? '判断正确' : '判断有误'}
                </div>
              )}
              {card.a && card.k !== 'steps' && (
                <div className="anim-rise text-[1.02rem] leading-[1.8]">
                  <MathText text={card.a} />
                </div>
              )}
              {card.k === 'steps' && card.a && (
                <div className="anim-rise text-[1.02rem] leading-[1.8]">
                  <MathText text={card.a} maxLines={stepsShown} />
                  {!allStepsShown && (
                    <Button variant="soft" className="mt-3" onClick={nextStep}>
                      下一步 ({stepsShown}/{stepsTotal}) <Kbd>空格</Kbd>
                    </Button>
                  )}
                </div>
              )}
              {isCloze && !card.a && <p className="anim-rise text-xs text-muted">空格处已高亮显示答案。</p>}
              {card.hook && (
                <details open={showHookFirst} className="anim-rise delay-1 group mt-4 rounded-xl border border-accent/20 bg-accent-soft/50 p-3">
                  <summary className="cursor-pointer text-sm font-bold text-accent-ink select-none">💡 记忆锚点</summary>
                  <div className="mt-1.5 text-[0.98rem] leading-relaxed">
                    <MathText text={card.hook} />
                  </div>
                </details>
              )}
              {card.trap && (
                <div className="anim-rise delay-2 mt-3 rounded-xl border border-bad/20 bg-bad-soft/50 p-3">
                  <div className="text-sm font-bold text-bad">⚠ 易错点</div>
                  <div className="mt-1.5 text-[0.98rem] leading-relaxed">
                    <MathText text={card.trap} />
                  </div>
                </div>
              )}
              <button type="button" onClick={() => setShowNote(true)} className="anim-rise delay-3 mt-3 flex w-full items-start gap-2 rounded-xl border border-dashed border-line-strong p-3 text-left text-sm text-muted hover:bg-ink/4">
                <Icon.Note className="mt-0.5 h-4 w-4 shrink-0" />
                {note ? <span className="text-ink-soft whitespace-pre-wrap">{note}</span> : <span>写一句自己的记忆锚点或错因…</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 底部操作 */}
      <div className="safe-b fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-paper via-paper/95 to-transparent pt-6">
        <div className="mx-auto max-w-2xl px-3 pb-3 md:px-6">
          {!revealed ? (
            card.k !== 'judge' && (
              <Button variant="primary" size="lg" className="h-14 w-full text-base" onClick={reveal}>
                显示答案 <Kbd>空格</Kbd>
              </Button>
            )
          ) : !allStepsShown ? (
            <Button variant="primary" size="lg" className="h-14 w-full text-base" onClick={nextStep}>
              下一步 ({stepsShown}/{stepsTotal})
            </Button>
          ) : plan.cram ? (
            <div className="grid grid-cols-2 gap-2">
              <Button size="lg" className="h-14 border-bad/30 text-bad" onClick={() => grade(1)}>
                没记住，稍后再来
              </Button>
              <Button variant="primary" size="lg" className="h-14" onClick={() => grade(3)}>
                记住了，下一张
              </Button>
            </div>
          ) : (
            <div className={cn('grid gap-2', simple ? 'grid-cols-2' : 'grid-cols-4')}>
              {GRADES.filter((g) => !simple || g.g === 1 || g.g === 3).map((g, i) => (
                <button
                  key={g.g}
                  type="button"
                  onClick={() => grade(g.g)}
                  className={cn('pressable anim-rise flex h-16 flex-col items-center justify-center rounded-2xl border text-center', g.cls, i === 1 && 'delay-1', i === 2 && 'delay-2', i === 3 && 'delay-3')}
                  aria-label={`${g.label}，下次 ${intervals?.[g.g] ?? ''}`}
                >
                  <span className="text-[15px] font-bold">{g.label}</span>
                  <span className="tabular text-[11px] opacity-75">{intervals?.[g.g]}</span>
                </button>
              ))}
            </div>
          )}
          {revealed && allStepsShown && swipeOn && !plan.cram && <p className="mt-1.5 text-center text-[11px] text-muted md:hidden">← 左滑「忘了」 · 右滑「记得」 →</p>}
        </div>
      </div>

      {toast && (
        <div className="anim-pop pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4" role="status">
          <div className="max-w-sm rounded-xl bg-ink px-4 py-2 text-center text-sm font-medium text-paper shadow-pop">{toast}</div>
        </div>
      )}

      <Sheet open={showNote} onClose={() => setShowNote(false)} title="我的笔记">
        <NoteEditor id={card.id} initial={note ?? ''} onClose={() => setShowNote(false)} />
      </Sheet>
      <Sheet open={showKeys} onClose={() => setShowKeys(false)} title="快捷键">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {[
            ['空格 / Enter', '显示答案 / 下一步'],
            ['1 2 3 4', '忘了 / 模糊 / 记得 / 轻松'],
            ['Y / N', '判断题：正确 / 错误'],
            ['Z', '撤销上一次评分'],
            ['F', '标记 / 取消标记'],
            ['Esc', '退出学习'],
          ].map(([k, v]) => (
            <li key={k} className="flex items-center justify-between gap-2 border-b border-line py-1.5">
              <span className="text-muted">{v}</span>
              <Kbd>{k}</Kbd>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">手机上：揭示后左滑 = 忘了，右滑 = 记得；点击块级公式可放大。</p>
      </Sheet>
    </div>
  );
}

function NoteEditor({ id, initial, onClose }: { id: string; initial: string; onClose: () => void }) {
  const [v, setV] = useState(initial);
  return (
    <div>
      <textarea
        autoFocus
        value={v}
        onChange={(e) => setV(e.target.value)}
        rows={5}
        placeholder="例如：把「分子二阶、分母 3/2 次方」念成口诀；或者记下上次为什么错。"
        className="w-full rounded-xl border border-line bg-card2 p-3 text-[15px] leading-relaxed outline-none focus:border-accent"
      />
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          取消
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setNote(id, v);
            scheduleSync();
            onClose();
          }}
        >
          保存
        </Button>
      </div>
    </div>
  );
}

export function nextDueText(ms: number) {
  return humanInterval(ms);
}
