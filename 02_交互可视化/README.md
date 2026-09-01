# 交互可视化

## 数学二离线识记闪卡

- 文件：[积分与反常积分识记闪卡.html](积分与反常积分识记闪卡.html)
- 数据：[math2-flashcards-data.js](math2-flashcards-data.js)
- 数学渲染：[katex-0.18.4.min.js](katex-0.18.4.min.js)
- 直接打开 HTML 即可使用；不依赖 CDN、网络字体或构建步骤。

### 手机与网页部署

- 手机端默认先显示当前卡；筛选按需展开，横屏同样优先保留卡片。
- 从 HTTPS 页面打开后可“添加到主屏幕”；首次加载完成后，页面与公式资源可离线打开。
- Pages 产物通过 `node build-flashcards-site.mjs` 写入忽略目录 `.flashcards-site/`；发布命令为 `wrangler pages deploy .flashcards-site --project-name math2-flashcards`。
- 网页端的“已会／待复习”仅保存在该浏览器和该站点域名的 localStorage 中，不上传答卷、材料或学习记录。

### 当前覆盖

当前共 172 张卡片：

- 高等数学 134 张：函数与极限、数列极限、导数与微分、导数应用、中值定理与泰勒、积分计算、定积分与变上限、反常积分、积分应用、积分等式与不等式、积分物理应用、多元函数微分、二重积分、微分方程。
- 线性代数 38 张：行列式、矩阵、向量组、线性方程组、特征值与相似、二次型。
- 范围状态：数学二核心（当前已输入）68 张；数学二范围内但当前尚未学到 104 张。

“当前已输入”只表示已核验到当前教材停点，不表示作答正确、订正完成或长期掌握。尚未学到的卡片保留在同一套闪卡中，便于后续按讲次筛选。

### 公式与 Markdown 数学语法

- 数据文件保留 LaTeX 源文本，不把公式预先转成图片或手工排版。
- 卡片正文支持 $...$、\(...\) 行内数学语法；$$...$$ 可用于块级数学语法。
- 答案公式使用结构化 TeX 数组，由本地 KaTeX 0.18.4 渲染为 MathML，浏览器可直接阅读和辅助技术可读取。
- KaTeX 不可用时保留原始 TeX 文本作为降级显示，不伪装成已渲染结果。

### 本地来源与范围

- 《张宇 2027 基础 30 讲·高等数学分册》各讲页码见[高数页码索引](../01_教材与讲义/02_页码索引/zy-30-gaoshu-2027_章节页码映射.md)。本轮新增并定位了第 11 讲实体页 282–293 / PDF 页 287–298，以及第 12 讲实体页 294–303 / PDF 页 299–308。
- 当前教材输入停点为高数第 8 讲；第 9–15 讲卡片属于数学二范围候选，按“尚未学到”展示。第 7 讲的相关变化率卡片沿用已输入范围。
- 线性代数 6 讲的页码见[线代页码索引](../01_教材与讲义/02_页码索引/zy-30-xiandai-2027_章节页码映射.md)，当前均标为尚未学到。
- 数学二边界按[材料索引](../02_材料索引.md)和[中国教育考试网考试大纲入口](https://yankao.neea.edu.cn/xhtml1/category/1509/6235-1.htm)维护。2027 正式目录与细目发布前，相关范围均保留“暂按数学二，待官方确认”。
- 无穷级数及其他数学一特有章节没有混入当前卡组；概率论也未纳入本数学二闪卡。

### 交互与数据边界

- 页面已移除双面 3D 翻卡。题面是唯一常驻内容面；答案区初始为 `hidden + inert`，查看答案后在同一阅读流中展开，因此没有正反面重叠渲染的路径。
- 支持科目、模块、范围和复习状态筛选，查看/重新遮挡答案、随机抽取、触控滑动、键盘快捷键及本机标记。
- 标记只写入当前浏览器的 localStorage，不写入 study-ledger，不替代原题作答、官方解析核对、订正或间隔复习证据。
- 页面不读取教材图片；知识定位以本地可检索教材文本、MinerU 解析和持久页码索引为导航与交叉核验依据。

### GitHub 二次开发基线与开源参考

- 当前静态页面以 [manderwall/aplusstudyapp](https://github.com/manderwall/aplusstudyapp/tree/9b4c9ec8c9512e4bf0fec2d1f47ef2f7b3af479b) 的单一卡片内容树、条件揭示答案、键盘与本地优先交互作为二次开发基线。该项目采用 [MIT License](https://github.com/manderwall/aplusstudyapp/blob/9b4c9ec8c9512e4bf0fec2d1f47ef2f7b3af479b/LICENSE)（Copyright 2026 Amanda Kondrat'yev）。
- 本页面没有引入其题库、FSRS 排程、同步、加密或 PWA 模块；数学数据、范围状态与本地 KaTeX 继续由本仓库维护。
- 下列项目仅提供离线优先、LaTeX/KaTeX、键盘操作和主动提取的补充参考，不作为数学事实来源：

- [zsh-eng/spaced2](https://github.com/zsh-eng/spaced2)：local-first 闪卡和离线体验。
- [davisilva169/quanta-flashcards](https://github.com/davisilva169/quanta-flashcards)：Markdown、LaTeX 与本地数据边界。
- [alexthillen/better-markdown-anki](https://github.com/alexthillen/better-markdown-anki)：Markdown/KaTeX 和可访问交互提示。
- [open-spaced-repetition/fsrs.js](https://github.com/open-spaced-repetition/fsrs.js)：间隔重复算法参考；当前页面只保留手动复习标记，未宣称实现 FSRS。

闪卡用于主动回忆：先闭卷写出公式、条件和辨析，再展开答案核对。它不改变本科目的学习状态、题目批阅和结构化学习记录。
