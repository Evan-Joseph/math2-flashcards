# 考研数学识记 · 数学一 / 数学二

面向长期备考的公式、定理与易错点主动回忆应用：先回忆，后揭示，按 FSRS 间隔复习。

- **内容**：数学二 291 张卡片 / 256 个知识点；数学一 378 张 / 343 个知识点（含向量代数与空间解析几何、三重积分、曲线曲面积分、无穷级数、概率统计）。每张卡带适用条件、记忆锚点、易错反例、来源讲次与页码、教材章级定位、考试范围与核验状态。
- **学习**：今日任务（到期 + 每日新卡）、章节学习 / 顺序通读、薄弱点、收藏、顽固卡片、随机 / 顺序自测、检索结果自测；问答 / 填空（逐空揭示）/ 判断 / 选择 / 步骤（逐步提示）。
- **统计**：卡片数、唯一知识点数、复习次数、掌握状态分别统计；热力图使用自适应窗口并区分「开始前」「未学习」。
- **数据**：本地优先（localStorage）；支持 JSON 导入导出与 PWA 离线。

## 开发

```bash
npm install
npm run dev
```

## 校验

```bash
npx tsx scripts/check-data.ts
npx tsx scripts/check-render.tsx
npx tsx scripts/check-schedule.ts
npm run typecheck && npm run build
```

## 目录

```
src/data/         卡片数据、章节、来源登记、知识点聚合表（knowledge.ts）
src/lib/          store（FSRS + 本地持久化 + 统计）、session（出题计划）、math（KaTeX / 挖空 / 表格）
src/components/   Shell、Study、CardSheet、ui（Radix / Vaul 二次封装）
src/app/          今日、学习、章节、检索、统计、设置、离线页
docs/             内容审计、页码索引、验收清单
scripts/          数据 / 渲染 / 调度检查
```
