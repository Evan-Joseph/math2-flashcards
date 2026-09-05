'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Study } from '@/components/Study';
import { planDaily, planChapter, planChapterBrowse, planWeak, planFlag, planLeech, planAll, planCustom, type SessionPlan } from '@/lib/session';
import { useHydrated, getState, useExam } from '@/lib/store';
import { CARD_MAP, cardInExam } from '@/data';

function StudyRoute() {
  const params = useSearchParams();
  const router = useRouter();
  const hydrated = useHydrated();
  const exam = useExam();
  const mode = params.get('mode') ?? 'daily';
  const ch = params.get('ch') ?? '';
  const ids = params.get('ids') ?? '';
  const start = Number(params.get('start') ?? '0') || 0;
  const [seed] = useState(() => Date.now());

  const plan: SessionPlan | null = useMemo(() => {
    if (!hydrated) return null;
    void seed;
    switch (mode) {
      case 'chapter':
        return ch ? planChapter(ch) : null;
      case 'browse':
        return ch ? planChapterBrowse(ch, start) : null;
      case 'weak':
        return planWeak();
      case 'leech':
        return planLeech();
      case 'flag':
        return planFlag();
      case 'all':
        return planAll(start || getState().cursor[exam]);
      case 'custom': {
        const list = ids.split(',').filter((id) => CARD_MAP[id] && cardInExam(CARD_MAP[id], exam));
        return planCustom(list, list.length === 1 ? '单卡自测' : '自定义自测');
      }
      default:
        return planDaily();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, mode, ch, ids, start, seed]);

  if (!plan) return <div className="p-8 text-center text-sm text-muted">{hydrated ? '无效的学习入口' : '加载中…'}</div>;
  return <Study key={`${mode}-${ch}-${ids}-${seed}`} plan={plan} onExit={() => router.push(mode === 'chapter' || mode === 'browse' ? `/chapters/${ch}` : '/')} />;
}

export default function StudyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted">加载中…</div>}>
      <StudyRoute />
    </Suspense>
  );
}
