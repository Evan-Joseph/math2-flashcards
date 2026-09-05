'use client';

import { useState } from 'react';
import { CHAPTER_MAP, KIND_LABEL, chapterColor } from '@/data';
import type { KCard } from '@/data/types';
import { MathText, hasCloze } from '@/lib/math';
import { useStore, toggleFlag, forgetCard, retrievability, State } from '@/lib/store';
import { Button, Chip, Icon, Sheet, Stars } from './ui';
import { cn, relDue } from '@/lib/cn';

export function stateLabel(st: { state: number; due: Date } | undefined, now = new Date()): { label: string; tone: 'neutral' | 'accent' | 'gold' | 'good' | 'bad' } {
  if (!st || st.state === State.New) return { label: '新卡', tone: 'neutral' };
  if (new Date(st.due).getTime() <= now.getTime()) return { label: '到期', tone: 'bad' };
  if (st.state === State.Learning || st.state === State.Relearning) return { label: '学习中', tone: 'gold' };
  return { label: relDue(new Date(st.due), now), tone: 'good' };
}

/** 卡片阅读面板：清单/章节页点开查看全部内容（不计入复习） */
export function CardSheet({ card, onClose }: { card: KCard | null; onClose: () => void }) {
  const [hide, setHide] = useState(true);
  const flags = useStore((s) => s.flags);
  const cards = useStore((s) => s.cards);
  const notes = useStore((s) => s.notes);
  if (!card) return null;
  const ch = CHAPTER_MAP[card.ch];
  const st = cards[card.id];
  const r = retrievability(card.id);
  const flagged = flags.includes(card.id);
  const cloze = card.k === 'cloze' && hasCloze(card.q);
  const label = stateLabel(st);
  return (
    <Sheet open={!!card} onClose={onClose} title={card.sec} wide>
      <div style={{ ['--ch' as string]: chapterColor(card.ch), ['--ch-soft' as string]: chapterColor(card.ch, 0.94, 0.04) }}>
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <Chip tone="ch">{ch.short}</Chip>
          <Chip>{KIND_LABEL[card.k]}</Chip>
          <Stars n={card.s} />
          <Chip tone={label.tone}>{label.label}</Chip>
          {r != null && <Chip tone={r < 0.7 ? 'bad' : 'good'}>记忆率 {Math.round(r * 100)}%</Chip>}
          {st && st.lapses > 0 && <Chip tone="gold">遗忘 {st.lapses} 次</Chip>}
        </div>
        <div className="text-[1.05rem] leading-[1.8] font-semibold">
          <MathText text={card.q} mode={cloze ? (hide ? 'hide' : 'show') : 'plain'} />
        </div>
        {cloze && (
          <Button variant="soft" size="sm" className="mt-3" onClick={() => setHide((h) => !h)}>
            <Icon.Eye className="h-4 w-4" /> {hide ? '显示空格答案' : '隐藏空格'}
          </Button>
        )}
        {card.a && (
          <div className="mt-4 rounded-2xl bg-card2 p-4 text-[1rem] leading-[1.8]">
            <MathText text={card.a} />
          </div>
        )}
        {card.hook && (
          <div className="mt-3 rounded-2xl border border-accent/20 bg-accent-soft/50 p-3">
            <div className="text-sm font-bold text-accent-ink">💡 记忆锚点</div>
            <div className="mt-1 leading-relaxed">
              <MathText text={card.hook} />
            </div>
          </div>
        )}
        {card.trap && (
          <div className="mt-3 rounded-2xl border border-bad/20 bg-bad-soft/50 p-3">
            <div className="text-sm font-bold text-bad">⚠ 易错点</div>
            <div className="mt-1 leading-relaxed">
              <MathText text={card.trap} />
            </div>
          </div>
        )}
        {notes[card.id] && (
          <div className="mt-3 rounded-2xl border border-dashed border-line-strong p-3 text-sm">
            <div className="font-bold text-muted">我的笔记</div>
            <p className="mt-1 whitespace-pre-wrap text-ink-soft">{notes[card.id]}</p>
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => toggleFlag(card.id)} className={cn(flagged && 'border-gold/40 text-gold')}>
            <Icon.Flag filled={flagged} className="h-4 w-4" /> {flagged ? '已标记' : '标记'}
          </Button>
          {st && st.state !== State.New && (
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm('重置这张卡的复习进度，作为新卡重新学习？')) forgetCard(card.id);
              }}
            >
              <Icon.Undo className="h-4 w-4" /> 重新学习
            </Button>
          )}
          <span className="ml-auto self-center font-mono text-[11px] text-muted">{card.id}</span>
        </div>
      </div>
    </Sheet>
  );
}
