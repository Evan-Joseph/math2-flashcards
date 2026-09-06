/**
 * 调度 / 统计检查：npx tsx scripts/check-schedule.ts
 */
import { rate, undoRate, dueIds, newIds, overallStat, chapterStat, updateSettings, getState, Rating, exportData, importData, resetAll, knowledgeMastery, heat, adaptiveHeatDays, todayLog, totalsAllTime, State } from '../src/lib/store';
import { planDaily, planAll, requeue, bySequence } from '../src/lib/session';
import { ALL_CARDS, KID_CARDS, CARD_MAP } from '../src/data';

const fail: string[] = [];
const ok = (cond: unknown, msg: string) => {
  if (!cond) fail.push(msg);
};

resetAll();
updateSettings({ exam: 'm2', dailyNew: 15, order: 'random' });

// 初始
let st = overallStat();
ok(st.learned === 0 && st.kLearned === 0 && st.due === 0, '初始统计应为 0');
ok(st.cards === 291 && st.knowledge === 256, `数二卡片 / 知识点数 ${st.cards}/${st.knowledge}`);
ok(newIds().length === 291, '初始新卡数');
ok(planDaily().ids.length === 15, '今日计划 = 每日新卡上限');
ok(!planDaily().ids.some((id) => CARD_MAP[id].scope === 'm1'), '数二计划不含数一卡');

// 同一知识点两张卡：学一张 → 知识点已学 1、卡片已学 1
const group = Object.entries(KID_CARDS).find(([, cs]) => cs.length >= 2 && cs.every((c) => c.scope !== 'm1' && c.status === 'ok'))!;
const [kid, cards] = group;
const now = new Date();
rate(cards[0].id, Rating.Good, 3000, now);
st = overallStat(now);
ok(st.learned === 1 && st.kLearned === 1, `学一张卡后 learned=${st.learned} kLearned=${st.kLearned}`);
rate(cards[1].id, Rating.Good, 3000, now);
st = overallStat(now);
ok(st.learned === 2 && st.kLearned === 1, `同知识点第二张卡后 learned=${st.learned} kLearned=${st.kLearned}（应不重复计数）`);
ok(knowledgeMastery(kid) !== 'new', '知识点掌握状态应变化');
ok(todayLog().n === 2 && totalsAllTime().n === 2, '复习次数按评分次数计');

// Again → 立即到期（学习步骤内），Good 间隔更长
const c3 = ALL_CARDS.find((c) => c.scope !== 'm1' && c.status === 'ok' && !getState().cards[c.id])!;
const r = rate(c3.id, Rating.Again, 1000, now);
ok(r.wasNew, 'Again 首次评分 wasNew');
const dueAgain = getState().cards[c3.id].due.getTime() - now.getTime();
undoRate(c3.id, r.prev, Rating.Again, 1000, r.wasNew, now);
ok(!getState().cards[c3.id], '撤销后卡片回到新卡');
ok(todayLog().n === 2, '撤销后日志回退');
rate(c3.id, Rating.Good, 1000, now);
const dueGood = getState().cards[c3.id].due.getTime() - now.getTime();
ok(dueGood > dueAgain, `Good 间隔应大于 Again：${dueGood} > ${dueAgain}`);

// 到期查询
const future = new Date(now.getTime() + 400 * 86400000);
ok(dueIds(future).length === 3, `未来全部到期 ${dueIds(future).length}`);

// 模式切换隔离
updateSettings({ exam: 'm1' });
const m1 = overallStat(now);
ok(m1.cards === 378 && m1.knowledge === 343, `数一卡片 / 知识点 ${m1.cards}/${m1.knowledge}`);
ok(m1.learned === 3, '数一模式下共同卡片进度保留');
ok(todayLog().n === 0, '数一日志与数二隔离');
ok(chapterStat('h9', now).cards > 0 && chapterStat('p1', now).cards > 0, '数一章节可见');
updateSettings({ exam: 'm2' });
ok(chapterStat('h9', now).cards === 0, '数二模式下级数章节为空');

// 顺序 / 随机
updateSettings({ order: 'sequential' });
const seq = planAll().ids;
ok(JSON.stringify(seq) === JSON.stringify(bySequence(seq)), '顺序模式单调');
updateSettings({ order: 'random' });
const rnd = planAll().ids;
ok(rnd.length === seq.length && new Set(rnd).size === rnd.length, '随机模式无重复');
let adjacent = 0;
for (let i = 1; i < rnd.length; i++) if (rnd[i] === rnd[i - 1]) adjacent++;
ok(adjacent === 0, '随机模式无相邻重复');
const q = requeue(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 'a', 3);
ok(q.indexOf('a') >= 3, '答错卡至少间隔 3 张');

// 热力图
ok(heat(14).length === 14 && heat(14)[13].n === 3, `热力图今日次数 ${heat(14)[13].n}`);
ok(adaptiveHeatDays() === 14, '冷启动使用 14 天窗口');
ok(heat(14)[0].before === true && heat(14)[13].before === false, '区分开始前与未学习');

// 导出 / 导入
const json = exportData();
resetAll();
ok(overallStat().learned === 0, '重置后清空');
const imp = importData(json);
ok(imp.ok && overallStat(now).learned === 3, '导入恢复进度');
ok(!importData('{}').ok && !importData('not json').ok, '拒绝无效导入');
ok(getState().cards[c3.id]?.state !== State.New, '导入后状态正确');

resetAll();
if (fail.length) {
  console.error(`${fail.length} 个问题：`);
  for (const f of fail) console.error(' -', f);
  process.exit(1);
}
console.log('调度 / 统计检查通过');
