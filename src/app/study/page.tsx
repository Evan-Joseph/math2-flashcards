'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { CARD_MAP } from '@/data';
import { useHydrated } from '@/lib/store';
import { planChapter, planCram, planCustom, planDaily, planFlags, planLeech, planWeak, type SessionPlan } from '@/lib/session';
import { Study } from '@/components/Study';

function buildPlan(sp: URLSearchParams): SessionPlan {
  const mode = sp.get('mode') ?? 'daily';
  if (mode === 'chapter') return planChapter(sp.get('ch') ?? 'h1', sp.get('all') === '1');
  if (mode === 'weak') return planWeak(20);
  if (mode === 'flag') return planFlags();
  if (mode === 'leech') return planLeech();
  if (mode === 'cram') {
    const ch = sp.get('ch');
    return planCram(Number(sp.get('n') ?? 30), ch ? [ch] : undefined);
  }
  if (mode === 'custom') {
    const ids = (sp.get('ids') ?? '').split(',').filter((id) => CARD_MAP[id]);
    return planCustom(sp.get('title') ?? '自定义', ids, sp.get('cram') === '1');
  }
  return planDaily();
}

function StudyInner() {
  const sp = useSearchParams();
  const hydrated = useHydrated();
  const key = sp.toString();
  const plan = useMemo<SessionPlan | null>(() => (hydrated ? buildPlan(new URLSearchParams(key)) : null), [hydrated, key]);

  if (!plan) {
    return (
      <div className="grid min-h-dvh place-items-center text-sm text-muted" aria-busy>
        正在准备卡片…
      </div>
    );
  }
  return <Study key={key} plan={plan} />;
}

export default function StudyPage() {
  return (
    <Suspense fallback={<div className="grid min-h-dvh place-items-center text-sm text-muted">正在准备卡片…</div>}>
      <StudyInner />
    </Suspense>
  );
}
