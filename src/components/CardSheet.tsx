'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Eraser, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { CARD_MAP, CHAPTER_MAP, KIND_LABEL, IMPORTANCE_LABEL, STATUS_LABEL, chapterColor, sourceOf, prerequisitesOf, relatedOf, siblingsOf, BOOKS, type KCard } from '@/data';
import { MathText } from '@/lib/math';
import { useStore, useExam, toggleFlag, setNote, cardStateOf, retrievability, forgetCard, humanInterval, State, cardMastery } from '@/lib/store';
import { cn, fmtPct } from '@/lib/cn';
import { Badge, Button, Sheet, Dialog } from './ui';

export const MASTERY_LABEL: Record<string, string> = { new: '未学', learning: '学习中', review: '复习中', mature: '稳固' };
export const MASTERY_TONE: Record<string, 'neutral' | 'warn' | 'accent' | 'good'> = { new: 'neutral', learning: 'warn', review: 'accent', mature: 'good' };

export function CardBadges({ card, compact }: { card: KCard; compact?: boolean }) {
  const ch = CHAPTER_MAP[card.ch];
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge style={{ color: chapterColor(card.ch, 0.45, 0.14), background: chapterColor(card.ch, 0.95, 0.03) }}>{ch?.short ?? card.ch}</Badge>
      {!compact && <Badge>{card.sec}</Badge>}
      <Badge tone="outline">{KIND_LABEL[card.k]}</Badge>
      {card.s === 3 && <Badge tone="warn">{IMPORTANCE_LABEL[3]}</Badge>}
      {card.scope === 'm1' && <Badge tone="accent">仅数一</Badge>}
      {card.status && card.status !== 'ok' && <Badge tone="bad">{STATUS_LABEL[card.status]}</Badge>}
    </div>
  );
}

function Field({ label, children, tone }: { label: string; children: React.ReactNode; tone?: 'warn' | 'bad' | 'accent' }) {
  return (
    <div className={cn('rounded-xl border px-3.5 py-3', tone === 'bad' ? 'border-bad/20 bg-bad-soft/40' : tone === 'warn' ? 'border-warn/25 bg-warn-soft/40' : tone === 'accent' ? 'border-accent/20 bg-accent-soft/40' : 'border-line bg-paper-2/50')}>
      <div className={cn('mb-1 text-[11px] font-semibold uppercase tracking-wide', tone === 'bad' ? 'text-bad' : tone === 'warn' ? 'text-warn' : tone === 'accent' ? 'text-accent' : 'text-muted')}>{label}</div>
      <div className="text-[15px]">{children}</div>
    </div>
  );
}

export function CardBody({ card }: { card: KCard }) {
  return (
    <div className="space-y-3">
      <div className="text-[17px] leading-relaxed">
        <MathText text={card.q} mode="show" />
      </div>
      {card.k === 'mcq' && card.opts && (
        <ol className="space-y-1.5">
          {card.opts.map((o, i) => (
            <li key={i} className={cn('flex gap-2 rounded-lg border px-3 py-2', i === card.ans ? 'border-good/40 bg-good-soft/50' : 'border-line')}>
              <span className="w-5 shrink-0 font-semibold text-muted">{String.fromCharCode(65 + i)}</span>
              <MathText text={o} />
            </li>
          ))}
        </ol>
      )}
      {card.a && (
        <div className="rounded-xl border border-line bg-paper-2/60 px-3.5 py-3">
          <MathText text={card.a} mode="show" />
        </div>
      )}
      {card.cond && <Field label="适用条件" tone="accent"><MathText text={card.cond} /></Field>}
      {card.hook && <Field label="记忆锚点"><MathText text={card.hook} /></Field>}
      {card.trap && <Field label="易错 · 反例" tone="bad"><MathText text={card.trap} /></Field>}
    </div>
  );
}

export function CardSheet({ id, onClose, onOpenCard }: { id: string | null; onClose: () => void; onOpenCard?: (id: string) => void }) {
  const card = id ? CARD_MAP[id] : undefined;
  return (
    <Sheet open={!!card} onOpenChange={(v) => !v && onClose()} title={card ? `${CHAPTER_MAP[card.ch]?.title ?? ''} · ${card.sec}` : ''}>
      {card ? <CardDetail card={card} onOpenCard={onOpenCard} /> : null}
    </Sheet>
  );
}

function CardDetail({ card, onOpenCard }: { card: KCard; onOpenCard?: (id: string) => void }) {
  const exam = useExam();
  const flagged = useStore((s) => s.flags.includes(card.id));
  const note = useStore((s) => s.notes[card.id] ?? '');
  const st = useStore((s) => cardStateOf(card.id, s));
  const mastery = useStore((s) => cardMastery(card.id, s));
  const [draft, setDraft] = useState<string | null>(null);
  const [confirmForget, setConfirmForget] = useState(false);
  const [now] = useState(() => Date.now());
  const src = sourceOf(card);
  const ch = CHAPTER_MAP[card.ch];
  const pre = prerequisitesOf(card);
  const sib = siblingsOf(card, exam);
  const rel = relatedOf(card, exam).filter((c) => !sib.includes(c));
  const r = st ? retrievability(card.id) : null;

  const open = (cid: string) => (onOpenCard ? onOpenCard(cid) : undefined);

  return (
    <div className="space-y-5 pb-2">
      <div className="flex items-start justify-between gap-3">
        <CardBadges card={card} />
        <Button variant={flagged ? 'soft' : 'ghost'} size="icon-sm" aria-pressed={flagged} aria-label={flagged ? '取消收藏' : '收藏'} onClick={() => toggleFlag(card.id)}>
          <Star className={cn(flagged && 'fill-current')} />
        </Button>
      </div>

      <CardBody card={card} />

      <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <Cell label="状态">
          <Badge tone={MASTERY_TONE[mastery]}>{MASTERY_LABEL[mastery]}</Badge>
        </Cell>
        <Cell label="可提取率">{r == null ? '—' : fmtPct(r)}</Cell>
        <Cell label="稳定性">{st && st.state !== State.New ? `${st.stability.toFixed(1)} 天` : '—'}</Cell>
        <Cell label="下次复习">{st && st.state !== State.New ? (st.due.getTime() <= now ? '已到期' : humanInterval(st.due.getTime() - now)) : '—'}</Cell>
      </div>
      {st && st.state !== State.New && (
        <div className="flex items-center justify-between text-xs text-muted">
          <span>复习 {st.reps} 次 · 遗忘 {st.lapses} 次</span>
          <button type="button" className="inline-flex items-center gap-1 text-xs text-muted hover:text-bad" onClick={() => setConfirmForget(true)}>
            <Eraser className="size-3.5" /> 重置此卡进度
          </button>
        </div>
      )}

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">笔记</div>
        <textarea
          value={draft ?? note}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (draft != null && draft !== note) {
              setNote(card.id, draft);
              toast.success('笔记已保存');
            }
            setDraft(null);
          }}
          rows={2}
          placeholder="写下你自己的理解、易错记录…"
          className="w-full resize-y rounded-xl border border-line bg-paper px-3 py-2 text-[15px] leading-relaxed placeholder:text-muted/70 focus:border-accent focus:outline-none"
        />
      </div>

      {sib.length > 0 && (
        <List title="同一知识点的其他卡片" items={sib} onOpen={open} />
      )}
      {rel.length > 0 && <List title="相似 / 易混" items={rel} onOpen={open} />}

      <div className="space-y-2 rounded-xl border border-line px-3.5 py-3 text-sm">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">来源</div>
        {src ? (
          <div>
            <div className="font-medium">{src.book.title}</div>
            <div className="text-muted">
              {src.lecture.title} · {src.pages} · {src.pdf}
            </div>
          </div>
        ) : null}
        {ch?.book && <div className="text-muted">教材：{ch.book}</div>}
        <div className="text-muted">大纲：{ch?.ref}</div>
        <div className="text-muted">
          考试范围：{card.scope === 'm1' ? '仅数学一' : '数学一 / 数学二共同'} · 核验：{STATUS_LABEL[card.status ?? 'ok']}
        </div>
        {pre.chapters.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-muted">前置：</span>
            {pre.chapters.map((c) => (
              <Link key={c.id} href={`/chapters/${c.id}`} className="inline-flex items-center gap-0.5 rounded-md bg-paper-2 px-2 py-0.5 text-xs font-medium text-ink-2 hover:text-accent">
                {c.short}
                <ExternalLink className="size-3" />
              </Link>
            ))}
          </div>
        )}
        <div className="pt-1 text-xs text-muted">
          卡片 {card.id}
          {card.kid !== card.id ? ` · 知识点 ${card.kid}` : ''}
          {' · '}
          {BOOKS[src?.book.id ?? '']?.edition ?? ''}
        </div>
      </div>

      <Dialog open={confirmForget} onOpenChange={setConfirmForget} title="重置此卡进度？" description="将清除该卡片的复习记录（不影响统计日志），下次作为新卡出现。">
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={() => setConfirmForget(false)}>取消</Button>
          <Button
            variant="danger"
            onClick={() => {
              forgetCard(card.id);
              setConfirmForget(false);
              toast('已重置');
            }}
          >
            重置
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line px-3 py-2">
      <div className="text-[11px] text-muted">{label}</div>
      <div className="tnum mt-0.5 font-medium">{children}</div>
    </div>
  );
}

function List({ title, items, onOpen }: { title: string; items: KCard[]; onOpen: (id: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{title}</div>
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
        {items.map((c) => (
          <li key={c.id}>
            <button type="button" onClick={() => onOpen(c.id)} className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-paper-2">
              <Badge tone="outline" className="mt-0.5 h-5 px-1.5 text-[10px]">
                {KIND_LABEL[c.k]}
              </Badge>
              <span className="line-clamp-2 min-w-0 flex-1">
                <MathText text={c.q} mode="plain" className="!text-sm !leading-6" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
