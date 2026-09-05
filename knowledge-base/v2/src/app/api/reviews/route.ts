import { db } from '@/db';
import { reviewLogs } from '@/db/schema';
import { eq, sql, desc, and, gte } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CODE_RE = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/;

/**
 * 服务器端复习日志汇总：总量、近 30 天评分分布、最常遗忘的卡片。
 * 用于「统计」页的云端视角，本地统计不依赖此接口。
 */
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code')?.toUpperCase() ?? '';
  if (!CODE_RE.test(code)) return NextResponse.json({ ok: false, error: '同步码格式不正确' }, { status: 400 });
  const since = new Date(Date.now() - 30 * 86400000);

  const [totals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      again: sql<number>`sum(case when ${reviewLogs.grade} = 1 then 1 else 0 end)::int`,
      avgMs: sql<number>`coalesce(avg(${reviewLogs.elapsedMs}), 0)::int`,
      first: sql<string | null>`min(${reviewLogs.reviewedAt})`,
    })
    .from(reviewLogs)
    .where(eq(reviewLogs.profileCode, code));

  const dist = await db
    .select({ grade: reviewLogs.grade, n: sql<number>`count(*)::int` })
    .from(reviewLogs)
    .where(and(eq(reviewLogs.profileCode, code), gte(reviewLogs.reviewedAt, since)))
    .groupBy(reviewLogs.grade);

  const lapses = await db
    .select({ cardId: reviewLogs.cardId, n: sql<number>`count(*)::int` })
    .from(reviewLogs)
    .where(and(eq(reviewLogs.profileCode, code), eq(reviewLogs.grade, 1)))
    .groupBy(reviewLogs.cardId)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  return NextResponse.json({ ok: true, totals, dist, lapses });
}
