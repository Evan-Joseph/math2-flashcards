'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Play, Star } from 'lucide-react';
import { CHAPTER_MAP, sectionsOf, chapterColor, chapterInExam, KIND_LABEL, STATUS_LABEL, isStudyable, sourceOf, countKnowledge } from '@/data';
import { useStore, useHydrated, chapterStat, cardMastery } from '@/lib/store';
import { MathText } from '@/lib/math';
import { Button, Badge, Progress, Empty } from '@/components/ui';
import { CardSheet, MASTERY_LABEL, MASTERY_TONE } from '@/components/CardSheet';
import { cn } from '@/lib/cn';

export default function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useStore((st) => st);
  const exam = s.settings.exam;
  const ch = CHAPTER_MAP[id];
  const [detail, setDetail] = useState<string | null>(null);
  const sections = useMemo(() => (ch ? sectionsOf(ch.id, exam) : []), [ch, exam]);
  const st = ch && hydrated ? chapterStat(ch.id, new Date(), s) : null;
  const sources = useMemo(() => {
    if (!ch) return [];
    const seen = new Map<string, string>();
    for (const sec of sections) for (const c of sec.cards) {
      const src = sourceOf(c);
      if (src && !seen.has(src.lecture.key)) seen.set(src.lecture.key, `${src.lecture.title} · ${src.pages}`);
    }
    return [...seen.values()];
  }, [ch, sections]);

  if (!ch || !chapterInExam(ch, exam)) {
    return (
      <Empty
        title="该章节不在当前考试范围内"
        desc={ch ? `《${ch.title}》仅数学一考查。切换到数学一模式后可查看。` : '章节不存在。'}
        action={
          <Link href="/chapters">
            <Button>返回章节列表</Button>
          </Link>
        }
      />
    );
  }

  const color = chapterColor(ch.id);
  const pct = st && st.knowledge ? st.kLearned / st.knowledge : 0;

  return (
    <div>
      <Link href="/chapters" className="mb-3 inline-flex h-9 items-center gap-1 rounded-lg pr-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> 章节
      </Link>
      <header className="card mb-5 overflow-hidden">
        <div className="h-1" style={{ background: color }} aria-hidden />
        <div className="px-5 py-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="outline">{ch.ref}</Badge>
            {ch.scope === 'm1' && <Badge tone="accent">仅数一</Badge>}
          </div>
          <h1 className="mt-2 text-[22px] font-semibold leading-8 tracking-[-0.01em]">{ch.title}</h1>
          <p className="mt-0.5 text-sm text-muted">{ch.desc}</p>
          {st && (
            <>
              <div className="tnum mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span>
                  <b className="font-semibold">{st.kLearned}</b> / {st.knowledge} 知识点已学
                </span>
                <span className="text-muted">卡片 {st.learned} / {st.cards}</span>
                <span className="text-muted">稳固 {st.kMastered}</span>
                {st.due > 0 && <span className="text-warn">到期 {st.due}</span>}
                {st.excluded > 0 && <span className="text-muted">不进队列 {st.excluded}</span>}
              </div>
              <Progress value={pct} className="mt-2" color={color} />
            </>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => router.push(`/study?mode=chapter&ch=${ch.id}`)} disabled={!st || (st.due === 0 && st.learned === st.cards)}>
              <Play /> 学习本章
            </Button>
            <Button onClick={() => router.push(`/study?mode=browse&ch=${ch.id}`)}>
              <BookOpen /> 顺序通读
            </Button>
          </div>
        </div>
        <div className="border-t border-line bg-paper-2/40 px-5 py-3 text-xs text-muted">
          <div>教材：{ch.book}</div>
          {sources.length > 0 && <div className="mt-0.5">讲义：{sources.join('；')}</div>}
        </div>
      </header>

      {sections.map((sec) => (
        <section key={sec.sec} className="mb-5">
          <div className="mb-2 flex items-baseline justify-between px-0.5">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">{sec.sec}</h2>
            <span className="tnum text-xs text-muted">
              {countKnowledge(sec.cards)} 知识点 · {sec.cards.length} 卡
            </span>
          </div>
          <ul className="card divide-y divide-line overflow-hidden">
            {sec.cards.map((c) => {
              const m = hydrated ? cardMastery(c.id, s) : 'new';
              const flagged = s.flags.includes(c.id);
              const studyable = isStudyable(c);
              return (
                <li key={c.id}>
                  <button type="button" onClick={() => setDetail(c.id)} className={cn('flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-paper-2', !studyable && 'opacity-70')}>
                    <span className={cn('mt-2 size-2 shrink-0 rounded-full', m === 'mature' ? 'bg-good' : m === 'review' ? 'bg-accent' : m === 'learning' ? 'bg-warn' : 'bg-line-2')} aria-label={MASTERY_LABEL[m]} />
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-2 text-[15px] leading-6">
                        <MathText text={c.q} mode="plain" className="!text-[15px] !leading-6" />
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge tone="outline" className="h-5 px-1.5 text-[10px]">
                          {KIND_LABEL[c.k]}
                        </Badge>
                        {c.s === 3 && <Badge tone="warn" className="h-5 px-1.5 text-[10px]">必背</Badge>}
                        {c.scope === 'm1' && <Badge tone="accent" className="h-5 px-1.5 text-[10px]">仅数一</Badge>}
                        {!studyable && <Badge tone="bad" className="h-5 px-1.5 text-[10px]">{STATUS_LABEL[c.status ?? 'ok']} · 不进队列</Badge>}
                        {hydrated && m !== 'new' && <Badge tone={MASTERY_TONE[m]} className="h-5 px-1.5 text-[10px]">{MASTERY_LABEL[m]}</Badge>}
                        {flagged && <Star className="size-3.5 fill-warn text-warn" />}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <CardSheet id={detail} onClose={() => setDetail(null)} onOpenCard={setDetail} />
    </div>
  );
}
