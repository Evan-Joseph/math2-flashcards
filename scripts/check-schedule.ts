/**
 * 复习调度 / 随机与顺序 / 模式过滤 / 导入导出 检查（Node 内模拟 localStorage）。
 * 运行：npm run check:schedule
 */
const mem = new Map<string, string>();
const g = globalThis as unknown as Record<string, unknown>;
g.window = globalThis;
g.localStorage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) };
Object.defineProperty(globalThis, 'navigator', { value: { vibrate: () => true }, configurable: true });

let errors = 0;
const fail = (m: string) => {
  errors++;
  console.error('✗', m);
};
const ok = (cond: boolean, m: string) => (cond ? undefined : fail(m));

async function main() {
  const store = await import('../src/lib/store');
  const session = await import('../src/lib/session');
  const data = await import('../src/data');
  const { Rating, State } = store;

  store.resetAll();
  store.updateSettings({ exam: 'm2', order: 'random', dailyNew: 15 });
  const m2New = store.newIds();
  ok(m2New.length === data.studyableFor('m2').length, '初始新卡数应等于数二可学卡片数');
  ok(store.dueIds().length === 0, '初始不应有到期卡');
  ok(!m2New.some((id) => data.CARD_MAP[id].status === 'pending'), '待确认卡不得进入新卡队列');
  ok(!m2New.some((id) => data.CARD_MAP[id].scope === 'm1'), '数二队列不得含数一卡');

  // 今日任务：数量与随机去重
  const daily = session.planDaily();
  ok(daily.ids.length === 15, `今日任务应含 15 张新卡（实际 ${daily.ids.length}）`);
  ok(new Set(daily.ids).size === daily.ids.length, '今日任务不得重复');

  // 评分：Good → 已学、到期在未来；Again → 短间隔
  const now = new Date();
  const a = daily.ids[0];
  const b = daily.ids[1];
  store.rate(a, Rating.Good, 3000, now);
  store.rate(b, Rating.Again, 3000, now);
  ok(store.isLearned(a) && store.isLearned(b), '评分后应标记为已学');
  const ca = store.cardStateOf(a)!;
  const cb = store.cardStateOf(b)!;
  ok(ca.due.getTime() > now.getTime(), 'Good 后到期时间应在未来');
  ok(cb.due.getTime() - now.getTime() < 15 * 60000, 'Again 后应在 15 分钟内再次到期');
  ok(cb.due.getTime() < ca.due.getTime(), 'Again 的间隔应短于 Good');
  ok(store.todayLog().n === 2 && store.todayLog().again === 1 && store.todayLog().new === 2, '今日日志应真实计数');
  ok(store.newRemainingToday() === 13, `新卡余额应为 13（实际 ${store.newRemainingToday()}）`);
  ok(store.recentHistory().length === 2, '复习历史应有 2 条');

  // 撤销
  const r = store.rate(daily.ids[2], Rating.Easy, 1000, now);
  store.undoRate(daily.ids[2], r.prev, Rating.Easy, 1000, r.wasNew, now);
  ok(!store.isLearned(daily.ids[2]), '撤销后应恢复为未学');
  ok(store.todayLog().n === 2, '撤销后日志应回退');

  // 到期查询：把 b 的到期时间拨到过去
  const later = new Date(now.getTime() + 20 * 60000);
  ok(store.dueIds(later).includes(b), 'Again 卡在 20 分钟后应到期');

  // 模式切换：数一队列更大且含数一卡；共同卡进度共享
  store.updateSettings({ exam: 'm1' });
  const m1New = store.newIds();
  ok(m1New.length > m2New.length, '数一新卡应多于数二');
  ok(m1New.some((id) => data.CARD_MAP[id].scope === 'm1'), '数一队列应含数一卡');
  ok(store.isLearned(a), '共同卡进度应在模式间共享');
  ok(store.todayLog().n === 0, '数一模式下今日日志应独立');
  ok(store.overallStat().total === data.studyableFor('m1').length, '数一统计总数应匹配');
  store.updateSettings({ exam: 'm2' });

  // 顺序模式：按知识库顺序
  store.updateSettings({ order: 'sequential' });
  const seq = session.planAll();
  const idx = seq.ids.map((id) => data.ALL_CARDS.findIndex((c) => c.id === id));
  ok(idx.every((v, i) => i === 0 || v > idx[i - 1]), '顺序模式应按知识库顺序');
  ok(seq.mode === 'all' && seq.cram === true, '全库通读为自测模式');
  // 随机模式：与顺序不同且无相邻重复
  store.updateSettings({ order: 'random' });
  const rnd = session.planAll();
  ok(rnd.ids.length === seq.ids.length && rnd.ids.join() !== seq.ids.join(), '随机模式应打乱顺序');
  ok(rnd.ids.every((id, i) => i === 0 || id !== rnd.ids[i - 1]), '随机模式不得相邻重复');

  // 重排：答错卡至少间隔 3 张
  const q = ['x', 'a1', 'a2', 'a3', 'a4', 'a5'];
  const rq = session.requeue(q, 'x', 3);
  ok(rq[0] !== 'x' && rq.indexOf('x') >= 3 && rq.length === q.length, '答错卡应在至少 3 张之后重现');

  // 章节计划只含本章
  const ch = session.planChapter('h1');
  ok(ch.ids.length > 0 && ch.ids.every((id) => data.CARD_MAP[id].ch === 'h1'), '章节计划只含本章卡片');

  // 导出 / 导入往返
  store.toggleFlag(a);
  store.setNote(a, '测试笔记');
  const json = store.exportData();
  store.resetAll();
  ok(!store.isLearned(a), '重置后应清空');
  const res = store.importData(json);
  ok(res.ok && store.isLearned(a) && store.getState().flags.includes(a) && store.getState().notes[a] === '测试笔记', '导入应完整恢复进度、收藏与笔记');
  ok(store.cardStateOf(a)!.state !== State.New && store.cardStateOf(a)!.due instanceof Date, '导入后日期应被还原');
  const bad = store.importData('{"foo":1}');
  ok(!bad.ok, '无效文件应被拒绝');
  const bad2 = store.importData('not json');
  ok(!bad2.ok, '非 JSON 应被拒绝');

  // 旧版本数据迁移
  mem.clear();
  mem.set('math2-fsrs-v2', JSON.stringify({ v: 2, cards: { [a]: ca }, logs: { '2026-01-01': { n: 3, again: 1, ms: 1000, new: 1 } }, settings: { motion: false, dailyNew: 20 } }));
  store.resetAll();
  store.importData(mem.get('math2-fsrs-v2')!);
  const st = store.getState();
  ok(st.settings.motion === 'off' && st.settings.dailyNew === 20 && st.settings.exam === 'm2', '旧设置应迁移');
  ok(!!st.logs['2026-01-01|m2'], '旧日志应归入数二');

  console.log(errors ? `共 ${errors} 处问题` : '✓ 调度 / 模式 / 数据恢复检查通过');
  process.exit(errors ? 1 : 0);
}
main();
