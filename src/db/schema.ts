import { pgTable, text, jsonb, timestamp, serial, integer, real, uniqueIndex, index } from 'drizzle-orm/pg-core';

/**
 * 同步档案：以「同步码」作为匿名身份，保存本地进度快照。
 * 本地 localStorage 始终是第一数据源；服务器只负责跨设备合并与备份。
 */
export const profiles = pgTable('profiles', {
  code: text('code').primaryKey(),
  data: jsonb('data').notNull().$type<Record<string, unknown>>(),
  deviceCount: integer('device_count').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/** 逐次复习日志（追加写入），用于统计与将来的 FSRS 参数优化 */
export const reviewLogs = pgTable(
  'review_logs',
  {
    id: serial('id').primaryKey(),
    profileCode: text('profile_code').notNull(),
    clientId: text('client_id').notNull(),
    cardId: text('card_id').notNull(),
    grade: integer('grade').notNull(),
    elapsedMs: integer('elapsed_ms').notNull().default(0),
    state: integer('state').notNull().default(0),
    stability: real('stability'),
    difficulty: real('difficulty'),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('review_logs_profile_client_idx').on(t.profileCode, t.clientId), index('review_logs_profile_card_idx').on(t.profileCode, t.cardId)],
);

export type Profile = typeof profiles.$inferSelect;
export type ReviewLog = typeof reviewLogs.$inferSelect;
