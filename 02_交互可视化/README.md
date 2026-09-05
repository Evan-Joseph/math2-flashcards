# 数学二识记平台

数学二高等数学与线性代数的本地优先识记应用，面向主动回忆、间隔复习与移动端刷卡。

## 代码与知识库

- 应用入口：`index.html`
- 页面与交互：`src/`
- 数学知识库：`src/data/`
- LaTeX / Markdown 渲染：`src/lib/math.tsx`
- 本地状态与复习排程：`src/lib/store.ts`、`src/lib/session.ts`

公式通过 KaTeX 在构建时打包，不依赖 CDN。卡片支持行内与块级 LaTeX、表格、列表、粗体和挖空。

## 本地运行与发布

```bash
cd 02_交互可视化
npm ci
npm run dev
npm run build
wrangler pages deploy dist --project-name math2-flashcards
```

Cloudflare Pages 生产地址：<https://math2-flashcards.pages.dev/>

## 维护

新 Agent 先阅读 `src/data/`、`src/lib/` 和本文件，再根据最新数学二官方大纲、教材与权威解析核验知识变更。GitHub、经验贴和其他开源项目只用于产品、交互和工程方案参考。
