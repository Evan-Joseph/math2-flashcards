'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CARD_MAP, CHAPTER_MAP, IMPORTANCE_LABEL, KIND_LABEL, chapterColor, sourceOf, prerequisitesOf, relatedOf, EXAMS, OFFICIAL, type KCard } from '@/data';
import { MathText } from '@/lib/math';
import { useStore, toggleFlag, setNote, forgetCard, cardStateOf, retrievability, State, useExam } from '@/lib/store';
import { relDue } from '@/lib/cn';
import { Sheet, Chip, Icon } from './ui';

export function CardBadges({ card, showScope = true }: { card: KCard; showScope?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Chip style={{ color: chapterColor(card.ch, 0.45, 0.14), background: chapterColor(card.ch, 0.95, 0.03), borderColor: 'transparent' }}>{CHAPTER_MAP[card.ch]?.short}</Chip>
      <Chip>{card.sec}</Chip>
      <Chip>{KIND_LABEL[card.k]}</Chip>
      {card.s === 3 && <Chip className="text-bad" style={{ background: 'var(--bad-soft)', borderColor: 'transparent' }}>{IMPORTANCE_LABEL[3]}</Chip>}
      {showScope && card.scope === 'm1' && <Chip style={{ background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: 'transparent' }}>仅{EXAMS.m1.short}</Chip>}
      {card.status === 'pending' && <Chip style={{ background: 'var(--warn-soft)', color: 'oklch(0.5 0.12 75)', borderColor: 'transparent' }}>待确认</Chip>}
    </div>
  );
}

/** 详情正文（可嵌入 Sheet 或页面） */
export function CardDetail({ card, onNavigate }: { card: KCard; onNavigate?: (id: string) => void }) {
  const exam = useExam();
  const flagged = useStore((s) => s.flags.includes(card.id));
  const note = useStore((s) => s.notes[card.id] ?? '');
  const st = useStore((s) => s.cards[card.id]);
  const [draft, setDraft] = useState<string | null>(null);
  const src = sourceOf(card);
  const pre = prerequisitesOf(card);
  const rel = relatedOf(card, exam);
  const r = retrievability(card.id);

  return (
    <div className="space-y-5">
      <CardBadges card={card} />

      <section>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">正面</div>
        <MathText text={card.q} mode="plain" className="text-[1.02rem]" />
      </section>

      {card.k === 'mcq' && card.opts && (
        <section className="space-y-1.5">
          {card.opts.map((o, i) => (
            <div key={i} className={`rounded-xl border px-3 py-2 text-sm ${i === card.ans ? 'border-good bg-good-soft' : 'border-line'}`}>
              <span className="mr-2 font-mono text-xs text-muted">{String.fromCharCode(65 + i)}</span>
              <MathText text={o} className="inline" />
            </div>
          ))}
        </section>
      )}

      {card.a && (
        <section>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{card.k === 'judge' ? '判断与解析' : card.k === 'steps' ? '步骤' : '答案'}</div>
          <MathText text={card.a} mode="show" />
        </section>
      )}

      {card.cond && (
        <section className="rounded-xl border border-line bg-paper-2 px-3 py-2.5">
          <div className="mb-1 text-xs font-semibold text-ink-2">适用条件 / 前提</div>
          <MathText text={card.cond} className="text-sm" />
        </section>
      )}
      {card.hook && (
        <section className="rounded-xl bg-accent-soft/60 px-3 py-2.5">
          <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-accent">
            <Icon.Bulb size={14} /> 记忆锚点
          </div>
          <MathText text={card.hook} className="text-sm" />
        </section>
      )}
      {card.trap && (
        <section className="rounded-xl bg-bad-soft/60 px-3 py-2.5">
          <div className="mb-1 text-xs font-semibold text-bad">易错 / 反例</div>
          <MathText text={card.trap} className="text-sm" />
        </section>
      )}

      <section className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-xl border border-line px-3 py-2.5">
          <div className="mb-1 text-xs font-semibold text-muted">来源定位</div>
          {src ? (
            <div className="space-y-0.5">
              <div className="font-medium">{src.book.title}</div>
              <div className="text-muted">{src.book.edition}{src.book.isbn ? ` · ISBN ${src.book.isbn}` : ''}</div>
              <div>{src.lecture.title}</div>
              <div className="text-muted">{src.pages} · {src.pdf}</div>
            </div>
          ) : (
            <div className="text-muted">—</div>
          )}
          <div className="mt-1.5 border-t border-line pt-1.5 text-muted">教材：{CHAPTER_MAP[card.ch]?.book}</div>
          <div className="text-muted">大纲：{CHAPTER_MAP[card.ch]?.ref}</div>
        </div>
        <div className="rounded-xl border border-line px-3 py-2.5">
          <div className="mb-1 text-xs font-semibold text-muted">知识层级</div>
          <div>
            {CHAPTER_MAP[card.ch]?.title} › {card.sec}
          </div>
          <div className="mt-1 text-muted">范围：{card.scope === 'm1' ? '仅数学一' : '数学一 / 数学二共同'}</div>
          {pre.chapters.length > 0 && (
            <div className="mt-1.5 border-t border-line pt-1.5">
              <span className="text-muted">前置：</span>
              {pre.chapters.map((c) => (
                <Link key={c.id} href={`/chapters/${c.id}`} className="mr-2 text-accent underline-offset-2 hover:underline">
                  {c.short}
                </Link>
              ))}
            </div>
          )}
          {card.status === 'pending' && <div className="mt-1.5 border-t border-line pt-1.5 text-xs text-muted">{OFFICIAL.note}</div>}
        </div>
      </section>

      {rel.length > 0 && (
        <section>
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">相似 / 易混知识点</div>
          <div className="space-y-1.5">
            {rel.map((c) => (
              <button key={c.id} type="button" onClick={() => onNavigate?.(c.id)} className="flex w-full items-center gap-2 rounded-xl border border-line px-3 py-2 text-left text-sm hover:bg-paper-2">
                <span className="line-clamp-2 min-w-0 flex-1">
                  <MathText text={c.q.split('\n')[0]} className="inline" />
                </span>
                <Icon.Chevron size={16} className="shrink-0 text-muted" />
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-line px-3 py-2.5 text-sm">
        <div className="mb-1 text-xs font-semibold text-muted">复习状态</div>
        {st && st.state !== State.New ? (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>下次：{relDue(st.due)}</span>
            <span>稳定性：{st.stability.toFixed(1)} 天</span>
            <span>难度：{st.difficulty.toFixed(1)}</span>
            <span>复习 {st.reps} 次 · 遗忘 {st.lapses} 次</span>
            {r != null && <span>可提取率：{Math.round(r * 100)}%</span>}
          </div>
        ) : (
          <div className="text-muted">尚未学习</div>
        )}
      </section>

      <section>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">我的笔记</div>
        <textarea className="field min-h-24 py-2 leading-relaxed" placeholder="自己的理解、口诀或错因（仅保存在本机）" value={draft ?? note} onChange={(e) => setDraft(e.target.value)} onBlur={() => draft != null && (setNote(card.id, draft), setDraft(null))} />
      </section>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn" onClick={() => toggleFlag(card.id)} aria-pressed={flagged}>
          <Icon.Star size={16} filled={flagged} className={flagged ? 'text-warn' : ''} />
          {flagged ? '已收藏' : '收藏'}
        </button>
        {st && st.state !== State.New && (
          <button type="button" className="btn" onClick={() => confirm('重置这张卡的复习进度？') && forgetCard(card.id)}>
            重置进度
          </button>
        )}
        <Link href={`/study?mode=custom&ids=${card.id}`} className="btn btn-primary ml-auto">
          <Icon.Play size={14} /> 自测这张
        </Link>
      </div>
    </div>
  );
}

export function CardSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const [cur, setCur] = useState<string | null>(null);
  const active = cur ?? id;
  const card = active ? CARD_MAP[active] : null;
  const close = () => {
    setCur(null);
    onClose();
  };
  return (
    <Sheet open={!!id} onClose={close} title={card ? `${CHAPTER_MAP[card.ch]?.title} · ${card.sec}` : ''} wide>
      {card && <CardDetail card={card} onNavigate={setCur} />}
    </Sheet>
  );
}
