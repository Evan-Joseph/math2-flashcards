'use client';

import { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Study } from '@/components/Study';
import { useHydrated } from '@/lib/store';
import { planDaily, planChapter, planChapterBrowse, planWeak, planFlag, planLeech, planAll, planCustom, type SessionPlan } from '@/lib/session';
import { CARD_MAP, CHAPTER_MAP } from '@/data';
import { Button } from '@/components/ui';
import Link from 'next/link';

function buildPlan(sp: URLSearchParams): SessionPlan | null {
  const mode = sp.get('mode') ?? 'daily';
  const ch = sp.get('ch') ?? '';
  const start = Math.max(0, Number(sp.get('start') ?? 0) || 0);
  switch (mode) {
    case 'daily':
      return planDaily();
    case 'chapter':
      return CHAPTER_MAP[ch] ? planChapter(ch) : null;
    case 'browse':
      return CHAPTER_MAP[ch] ? planChapterBrowse(ch, start) : null;
    case 'weak':
      return planWeak();
    case 'flag':
      return planFlag();
    case 'leech':
      return planLeech();
    case 'all':
      return planAll(start);
    case 'custom': {
      const ids = (sp.get('ids') ?? '').split(',').filter((id) => CARD_MAP[id]);
      return ids.length ? planCustom(ids, sp.get('title') ?? '自测') : null;
    }
    default:
      return null;
  }
}

function StudyInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const hydrated = useHydrated();
  const key = sp.toString();
  // 只在 hydrated 且参数变化时重建计划，避免横竖屏切换 / 重渲染导致队列重排
  const plan = useMemo<{ key: string; plan: SessionPlan | null } | null>(() => (hydrated ? { key, plan: buildPlan(new URLSearchParams(key)) } : null), [hydrated, key]);

  const exit = useMemo(
    () => () => {
      if (window.history.length > 1) router.back();
      else router.push('/');
    },
    [router],
  );

  if (!hydrated || !plan) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-line border-t-accent" aria-label="加载中" />
      </div>
    );
  }
  if (!plan.plan) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-base font-medium">无效的学习入口</p>
        <p className="text-sm text-muted">链接参数不正确或对应章节不在当前考试范围内。</p>
        <Link href="/">
          <Button variant="primary">返回首页</Button>
        </Link>
      </div>
    );
  }
  return <Study key={plan.key} plan={plan.plan} onExit={exit} />;
}

export default function StudyPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <StudyInner />
    </Suspense>
  );
}
