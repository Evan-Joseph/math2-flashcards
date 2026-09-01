---
name: 数学二识记
description: 离线主动回忆的单一阅读面板设计系统。
colors:
  canvas: "#e9f0f5"
  paper: "#ffffff"
  paper-soft: "#f7fafc"
  ink: "#13213b"
  ink-soft: "#3c506d"
  muted: "#586b80"
  line: "#d9e3ed"
  line-strong: "#bac9d7"
  navy: "#17395d"
  navy-deep: "#102b4a"
  signal: "#c63f2a"
  signal-deep: "#c9462c"
  mint: "#e4f4ee"
  mint-ink: "#116658"
  amber: "#fff3d7"
  amber-ink: "#8a5908"
  violet: "#efecff"
  violet-ink: "#5941a6"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, Avenir Next, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
    fontSize: "clamp(2rem, 4.1vw, 4.25rem)"
    fontWeight: 780
    lineHeight: 1.04
    letterSpacing: "-0.045em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Avenir Next, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
    fontSize: "16px"
    lineHeight: 1.55
  math:
    fontFamily: "STIX Two Math, Cambria Math, Times New Roman, serif"
rounded:
  shell: "16px"
  control: "10px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "#fff"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.signal-deep}"
  button-default:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "46px"
  sheet:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.shell}"
---

# Design System: 数学二识记

## Overview

**Creative North Star: "矿物蓝考场工作台"**

系统以低干扰的白色学习纸张置于浅矿物蓝画布上。深海军蓝负责标题与阅读重心，朱红只用于“先写，再核对”的动作提示和主操作；筛选、进度与本机标记保持紧凑，避免把导航状态误读为学习结论。

单张卡始终是一块连续阅读面板：题面先占据主阅读区，答案在用户显式操作后于其下方展开。该设计拒绝双面叠放与 3D 翻转；答案的可见性、可交互性与 ARIA 状态保持一致。

**Key Characteristics:**

- 白色学习纸张、矿物蓝文字与克制的朱红信号。
- 单一题面优先，条件答案按需展开。
- 紧凑筛选轨道、明确的本机状态芯片与键盘可达控件。

## Colors

调色板以冷白和蓝灰承载长时间阅读，海军蓝建立层级，朱红保留给主动揭示，薄荷、琥珀与浅紫仅用于范围和本机状态的语义区分。

### Primary

- **朱红信号：** 用于主答案操作、主动回忆提示与少量强调，不承担大面积背景。
- **深海军蓝：** 用于主标题、题面标题和关键文字重心。

### Secondary

- **薄荷状态：** 表示当前已输入范围与“已会”本机标记。
- **琥珀状态：** 表示“待复习”本机标记。
- **浅紫范围：** 表示数学二范围内但当前尚未学到。

### Neutral

- **矿物画布与学习纸张：** 区分页面背景、主表面与较柔和的答案表面。
- **墨色、柔和墨色与静默文字：** 按阅读层级承载正文、辅助正文与说明。
- **细线与强调线：** 分隔表面、字段与控件，不替代阴影承担层级。

**The Signal Reserve Rule.** 朱红只指向当前的主动操作、提示或细小强调；大块阅读区始终保持冷白与蓝灰。

## Typography

**Display Font:** 系统无衬线栈；数学显示使用独立的数学字体栈。

**Body Font:** 系统无衬线栈，覆盖 macOS、Windows 与中文系统回退。

**Character:** 采用紧实但不装饰的字重和微负字距建立题面层级，正文以较宽松行高保持公式条件与辨析可连续阅读。

### Hierarchy

- **Display：** 用于题面标题；采用前置 token 中的显示级字型。
- **Masthead：** 页面主标题使用 `clamp(2rem, 4vw, 3.75rem)`、780 字重、0.98 行高与 `-0.045em` 字距。
- **Body：** 页面基准为 16px 与 1.55 行高；题面说明使用 `clamp(1rem, 1.75vw, 1.22rem)` 与 1.76 行高，最大宽度为 58ch。
- **Label：** 控件标签与范围芯片使用 10–12px、较高字重和轻微正字距；不使用全大写转换。

**The Reading-First Type Rule.** 大字号只给页面与题面标题；公式、条件和辨析由清晰的正文行高与宽度承担，而不是用展示字体抢占注意力。

## Layout

页面容器为 `min(1420px, calc(100% - 40px))`，上方为标题和范围说明，下方是最小 238px、最大 272px 的粘性筛选轨道与主学习区两列布局，列间距为 20px。主学习区由会话条、单一学习纸张、导航和本机标记组成。

在 1050px 及以下，筛选轨道变为三列网格，筛选字段为两列；在 720px 及以下，主学习区前置，筛选轨道改为单列，答案字段、页脚和标记区按页面规则重排；在 430px 及以下，筛选、导航与答案标题进一步单列化。页面最小宽度为 320px。间距以 8–25px 的紧凑间隙与响应式面板内边距构成，未定义独立 spacing token。

## Elevation & Depth

系统采用柔和的结构性阴影与冷白表面共同表达层级。主学习纸张使用 `--shadow-sheet`，筛选轨道和常规控件使用 `--shadow-control`；悬停时控件仅上移 1px 并略加深阴影，不产生漂浮感。

### Shadow Vocabulary

- **学习纸张：** `--shadow-sheet`；用于承载完整单卡阅读和条件答案。
- **控制表面：** `--shadow-control`；用于筛选轨道、常规按钮、图标按钮和本机标记。

**The Sheet-Above-Controls Rule.** 只有完整学习纸张可使用较深的 `--shadow-sheet`；其他可操作元素保持 `--shadow-control`，通过状态变化而非持续强阴影表达可点击性。

## Shapes

大表面采用 16px 的圆角，小型可操作控件采用 10px 的圆角。范围芯片和进度轨道使用胶囊形，键帽与公式块保留页面现有的局部圆角；这些局部值未提升为全局 token。边界主要由细线和裁切明确，学习纸张和筛选轨道均以 `overflow: hidden` 保持完整轮廓。

## Components

### Buttons

常规按钮、主操作、安静操作和图标操作使用同一控制圆角与触控尺寸。主操作以朱红信号填充；默认按钮为白色表面加细线；安静操作透明且无常驻阴影。控件以 160ms 状态过渡响应悬停，`focus-visible` 使用页面现有的 3px 外轮廓；按下时按各组件现有规则缩放。

### Chips

范围芯片使用紧凑胶囊形和语义浅色底。核心范围配薄荷状态，尚未学到范围配浅紫状态；文字必须保留范围含义，不能把颜色当作唯一信息源。

### Cards / Containers

学习纸张是系统的主容器：白色、16px 圆角、`--shadow-sheet`、隐藏溢出。题面元数据、主动回忆提示和条件答案位于同一容器的连续纵向阅读流中；答案区以柔和纸面和顶部分隔线与题面相接。

### Inputs / Fields

筛选字段为浅色表面、透明默认边框、10px 圆角和至少 44px 高度。悬停时背景与细线加深；键盘焦点切换为朱红边框和页面既有的三层环形阴影。

### Navigation

上一张、下一张和随机按钮使用白色控件表面。导航在桌面为双列，720px 及以下随页脚重排，430px 及以下变为单列；状态不改变题面与答案的连续阅读结构。

### 单一阅读面板

题面是唯一常驻阅读面，答案区初始带 `hidden` 与 `inert`，并同时设置 `aria-hidden="true"`。显式揭示后，答案在同一纸张内向下进入，揭示按钮同步更新 `aria-expanded` 并隐藏；重新遮挡恢复初始状态。该组件没有 3D 双面卡，也不使用同坐标叠放的翻转面。

## Do's and Don'ts

### Do:

- **Do** 用白色学习纸张和矿物画布承载长阅读，把朱红保留给当前的主动揭示和提示。
- **Do** 保持题面、条件答案和来源说明处于同一纵向阅读容器，并同步 `hidden`、`inert` 与 ARIA 状态。
- **Do** 在 1050px、720px、430px 使用已实现的重排规则，并保留至少 44px 的主要触控控件高度。
- **Do** 用文字、范围标签与 `aria-pressed` 说明本机状态；颜色只作补充。

### Don't:

- **Don't** 将答案恢复为 3D 双面翻卡、同坐标叠放卡面或纯视觉的翻转状态。
- **Don't** 将“已会”或“待复习”的本机标记设计成掌握、订正或长期保持的证明。
- **Don't** 扩张朱红为大面积背景，或用强阴影、炫技动效破坏题面阅读优先级。
- **Don't** 把页面现有的局部字距、半径、边框和悬停色未经验证地提升为全局 token。
