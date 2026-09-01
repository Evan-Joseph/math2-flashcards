(function () {
  "use strict";

  const source = {
    "高数1": "《基础 30 讲·高等数学》第 1 讲“函数极限与连续”，实体 1–75 页 / PDF 6–80 页。",
    "高数2": "《基础 30 讲·高等数学》第 2 讲“数列极限”，实体 76–98 页 / PDF 81–103 页。",
    "高数3": "《基础 30 讲·高等数学》第 3 讲“一元函数微分学的概念”，实体 99–118 页 / PDF 104–123 页。",
    "高数4": "《基础 30 讲·高等数学》第 4 讲“一元函数微分学的计算”，实体 119–138 页 / PDF 124–143 页。",
    "高数5": "《基础 30 讲·高等数学》第 5 讲“导数的几何应用”，实体 139–163 页 / PDF 144–168 页。",
    "高数6": "《基础 30 讲·高等数学》第 6 讲“中值定理、微分等式与不等式”，实体 164–185 页 / PDF 169–190 页。",
    "高数7": "《基础 30 讲·高等数学》第 7 讲“物理应用与经济应用”，实体 186–194 页 / PDF 191–199 页。",
    "高数8": "《基础 30 讲·高等数学》第 8 讲“积分学的概念与性质”，实体 195–229 页 / PDF 200–234 页。",
    "高数9": "《基础 30 讲·高等数学》第 9 讲“积分学的计算”，实体 230–262 页 / PDF 235–267 页。",
    "高数10": "《基础 30 讲·高等数学》第 10 讲“积分学的几何应用”，实体 263–281 页 / PDF 268–286 页。",
    "高数11": "《基础 30 讲·高等数学》第 11 讲“积分等式与积分不等式”，实体 282–293 页 / PDF 287–298 页。",
    "高数12": "《基础 30 讲·高等数学》第 12 讲“物理应用与经济应用”，实体 294–303 页 / PDF 299–308 页。",
    "高数13": "《基础 30 讲·高等数学》第 13 讲“多元函数微分学”，实体 304–337 页 / PDF 309–342 页。",
    "高数14": "《基础 30 讲·高等数学》第 14 讲“二重积分”，实体 338–376 页 / PDF 343–381 页。",
    "高数15": "《基础 30 讲·高等数学》第 15 讲“微分方程”，实体 377–408 页 / PDF 382–413 页。",
    "线代1": "《基础 30 讲·线性代数》第 1 讲“行列式”，实体 11–44 页 / PDF 15–48 页。",
    "线代2": "《基础 30 讲·线性代数》第 2 讲“矩阵”，实体 45–81 页 / PDF 49–85 页。",
    "线代3": "《基础 30 讲·线性代数》第 3 讲“向量组”，实体 82–113 页 / PDF 86–117 页。",
    "线代4": "《基础 30 讲·线性代数》第 4 讲“线性方程组”，实体 114–138 页 / PDF 118–142 页。",
    "线代5": "《基础 30 讲·线性代数》第 5 讲“相似理论”，实体 139–177 页 / PDF 143–181 页。",
    "线代6": "《基础 30 讲·线性代数》第 6 讲“二次型”，实体 178–206 页 / PDF 182–210 页。"
  };

  function card(id, subject, unit, scope, title, prompt, formulas, condition, distinction, ref) {
    return {
      id: id,
      subject: subject,
      unit: unit,
      scope: scope,
      title: title,
      prompt: prompt,
      formulas: formulas,
      condition: condition,
      distinction: distinction,
      source: source[ref]
    };
  }

  const input = "数学二核心（当前已输入）";
  const pending = "数学二范围内但当前尚未学到";
  const cards = [];
  window.MATH2_FLASHCARDS = cards;

  cards.push(
    card("function-composite-domain", "高等数学", "函数与极限", input, "复合函数的定义域", "写出 $f(g(x))$ 有意义的两个同时条件。", ["x\\in D_g,\\qquad g(x)\\in D_f"], "先保证内层 $g(x)$ 有意义，再要求其函数值落入外层 $f$ 的定义域。", "只求 $g(x)$ 的定义域不够；复合后还要检查 $g(x)$ 的取值。", "高数1"),
    card("function-parity", "高等数学", "函数与极限", input, "奇偶性的判定", "分别写出奇函数、偶函数的代数判别式。", ["f(-x)=-f(x)\\quad\\text{(奇函数)}", "f(-x)=f(x)\\quad\\text{(偶函数)}"], "定义域必须关于原点对称。", "定义域不对称时，不能仅凭一个代数式就判为奇或偶。", "高数1"),
    card("limit-left-right", "高等数学", "函数与极限", input, "二侧极限存在的充要条件", "函数在 $x_0$ 处的极限何时存在？", ["\\lim_{x\\to x_0}f(x)=A\\iff\\lim_{x\\to x_0^-}f(x)=\\lim_{x\\to x_0^+}f(x)=A"], "左右极限都存在且相等。", "函数值 $f(x_0)$ 是否存在不影响极限；连续性才额外要求函数值。", "高数1"),
    card("limit-operations", "高等数学", "函数与极限", input, "极限四则运算", "若 $\\lim f=A,\\ \\lim g=B$，商的极限需要什么额外条件？", ["\\lim_{x\\to x_0}\\frac{f(x)}{g(x)}=\\frac{A}{B}\\qquad(B\\ne0)"], "先确认分母极限非零。", "$B=0$ 时不能直接相除，应回到等价、洛必达或其他极限方法。", "高数1"),
    card("limit-squeeze", "高等数学", "函数与极限", input, "夹逼准则", "用一句话写出夹逼准则的结构。", ["\\varphi(x)\\le f(x)\\le\\psi(x),\\quad\\lim\\varphi(x)=\\lim\\psi(x)=A\\ \\Longrightarrow\\ \\lim f(x)=A"], "不等式在 $x_0$ 的去心邻域内成立。", "两侧极限必须同为一个有限数；仅有“夹住”不足以下结论。", "高数1"),
    card("limit-important-sin", "高等数学", "函数与极限", input, "第一个重要极限", "补全 $x\\to0$ 时的标准极限。", ["\\lim_{x\\to0}\\frac{\\sin x}{x}=1"], "使用弧度制。", "角度制不能直接使用；常用于把三角函数极限转成 $\\sin u/u$。", "高数1"),
    card("limit-important-e", "高等数学", "函数与极限", input, "第二个重要极限", "写出生成 $e$ 的两个常见形式。", ["\\lim_{x\\to0}(1+x)^{1/x}=e", "\\lim_{n\\to\\infty}\\left(1+\\frac1n\\right)^n=e"], "第一式要求底数在邻域内有意义。", "遇到 $(1+u)^{v}$ 时，先把它凑成 $[(1+u)^{1/u}]^{uv}$。", "高数1"),
    card("equiv-definition", "高等数学", "函数与极限", input, "等价无穷小的定义", "在 $x\\to x_0$ 时，$\\alpha(x)$ 与 $\\beta(x)$ 何时等价？", ["\\alpha(x)\\sim\\beta(x)\\iff\\lim_{x\\to x_0}\\frac{\\alpha(x)}{\\beta(x)}=1"], "两者在去心邻域内有意义，且在该极限过程中都是无穷小。", "“$\\sim$”不等于恒等；它只描述主导阶相同。", "高数1"),
    card("equiv-list", "高等数学", "函数与极限", input, "常用等价无穷小", "列出 $x\\to0$ 的第一组等价链。", ["\\sin x\\sim\\tan x\\sim\\arcsin x\\sim\\arctan x\\sim\\ln(1+x)\\sim e^x-1\\sim x", "1-\\cos x\\sim\\frac{x^2}{2},\\qquad(1+x)^\\alpha-1\\sim\\alpha x"], "都只在 $x\\to0$ 时使用；后一式取常数 $\\alpha\\ne0$。", "等价替换适于乘除、幂指数等结构；出现加减抵消时要保留高阶项。", "高数1"),
    card("equiv-no-addition", "高等数学", "函数与极限", input, "等价替换的禁区", "为什么 $x-\\sin x$ 不能直接把 $\\sin x$ 替成 $x$？", ["x-\\sin x\\sim\\frac{x^3}{6}\\qquad(x\\to0)"], "相减结构可能发生主项抵消。", "先做恒等变形或泰勒展开；直接替换会把决定极限的最低非零项消掉。", "高数1"),
    card("limit-growth-order", "高等数学", "函数与极限", input, "无穷远处的增长阶", "当 $x\\to+\\infty$ 时，$\\ln x$、$x^\\alpha$、$a^x$ 的相对增长如何？", ["\\ln x=o(x^\\alpha),\\qquad x^\\alpha=o(a^x)\\quad(\\alpha>0,\\ a>1)"], "只讨论 $x\\to+\\infty$，且 $\\alpha>0,a>1$。", "这是增长阶比较，不是 $x\\to0$ 的等价无穷小链。", "高数1"),
    card("limit-lhopital", "高等数学", "函数与极限", input, "洛必达法则的触发条件", "何时可把 $\\lim f/g$ 改写为 $\\lim f'/g'$？", ["\\frac{f(x)}{g(x)}\\xrightarrow[x\\to x_0]{}\\frac{0}{0}\\ \\text{或}\\ \\frac{\\infty}{\\infty},\\qquad\\lim\\frac{f'(x)}{g'(x)}=A\\ \\Longrightarrow\\ \\lim\\frac{f(x)}{g(x)}=A"], "在去心邻域可导，$g'(x)\\ne0$；导数比的极限存在或为无穷。", "$0\\cdot\\infty$、$\\infty-\\infty$、$1^\\infty$ 等先变形为商型。", "高数1"),
    card("continuity-definition", "高等数学", "函数与极限", input, "连续的三件事", "函数在 $x_0$ 连续需要同时满足什么？", ["\\lim_{x\\to x_0}f(x)=f(x_0)"], "等式隐含：函数值存在、二侧极限存在、二者相等。", "单侧连续改为对应的单侧极限等于函数值。", "高数1"),
    card("discontinuity-types", "高等数学", "函数与极限", input, "间断点类型", "可去、跳跃、无穷、振荡间断点的核心区别是什么？", ["\\text{可去：}\\lim_{x\\to x_0}f(x)\\ \\text{存在但}\\ne f(x_0)"], "先分别检查左右极限与函数值。", "左右极限有限但不等是跳跃；至少一侧无穷是无穷间断；极限不存在且非上述情形常为振荡。", "高数1"),
    card("continuous-properties", "高等数学", "函数与极限", input, "闭区间连续函数的性质", "闭区间连续最常用的三个结论是什么？", ["f\\in C[a,b]\\ \\Longrightarrow\\ f\\ \\text{有界，能取到最大最小值，并具有介值性}"], "必须是闭区间连续。", "有界、最值、介值的前提不能从开区间连续直接搬用。", "高数1"),

    card("sequence-definition", "高等数学", "数列极限", input, "数列极限的语言", "用 $\\varepsilon$–$N$ 语言说明 $a_n\\to A$。", ["\\forall\\varepsilon>0,\\ \\exists N,\\ n>N\\Rightarrow|a_n-A|<\\varepsilon"], "量词顺序固定：先任意 $\\varepsilon$，再找到对应 $N$。", "$N$ 允许依赖 $\\varepsilon$，但不能依赖之后任取的 $n$。", "高数2"),
    card("sequence-monotone-bounded", "高等数学", "数列极限", input, "单调有界准则", "什么条件足以保证数列极限存在？", ["\\{a_n\\}\\ \\text{单调且有界}\\ \\Longrightarrow\\ \\lim_{n\\to\\infty}a_n\\ \\text{存在}"], "递增数列要有上界；递减数列要有下界。", "先证单调再证有界；仅有其中一个条件不能推出收敛。", "高数2"),
    card("sequence-squeeze", "高等数学", "数列极限", input, "数列夹逼准则", "若 $a_n\\le b_n\\le c_n$，哪两个极限相同可推出 $b_n$ 的极限？", ["\\lim_{n\\to\\infty}a_n=\\lim_{n\\to\\infty}c_n=A\\ \\Longrightarrow\\ \\lim_{n\\to\\infty}b_n=A"], "不等式从某一项起成立即可。", "有限个初始项不会改变数列极限。", "高数2"),
    card("sequence-contraction", "高等数学", "数列极限", input, "递推数列的压缩估计", "若数列到候选极限 $A$ 的距离每步都按固定比例缩小，能推出什么？", ["|a_{n+1}-A|\\le q|a_n-A|,\\qquad 0<q<1\\ \\Longrightarrow\\ a_n\\to A"], "不等式从某一项起成立即可；通常先由递推式确定候选 $A$。", "压缩估计直接给出收敛；只写不动点方程仍不能证明收敛。", "高数2"),
    card("sequence-recursion", "高等数学", "数列极限", input, "递推数列求极限的顺序", "递推式 $a_{n+1}=\\varphi(a_n)$ 的极限题，先做什么再做什么？", ["a_n\\to A\\ \\Longrightarrow\\ A=\\varphi(A)"], "先用单调有界或压缩等方法证明收敛，再解不动点方程。", "直接令 $a_{n+1}=a_n=A$ 只能给候选值，不能证明极限存在。", "高数2"),

    card("derivative-definition", "高等数学", "导数与微分", input, "导数的定义", "写出 $f'(x_0)$ 的差商极限。", ["f'(x_0)=\\lim_{\\Delta x\\to0}\\frac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}"], "极限存在且有限。", "分母是自变量增量；不要把 $\\Delta x$ 与 $x_0$ 混写。", "高数3"),
    card("derivative-continuity", "高等数学", "导数与微分", input, "可导、连续、可微的关系", "一元函数在一点的可导与可微、连续之间如何蕴含？", ["\\text{可导}\\iff\\text{可微}\\Longrightarrow\\text{连续}"], "只讨论一元函数的一阶情形。", "连续不必可导，典型反例是 $f(x)=|x|$ 在 $0$ 处。", "高数3"),
    card("derivative-one-sided", "高等数学", "导数与微分", input, "左右导数与可导", "函数在 $x_0$ 可导的充要条件是什么？", ["f'_-(x_0)=f'_+(x_0)\\ \\text{且二者有限}"], "左右导数都要存在。", "左右导数不等时，函数即使连续也不可导。", "高数3"),
    card("derivative-geometry", "高等数学", "导数与微分", input, "切线与法线", "曲线 $y=f(x)$ 在 $(x_0,y_0)$ 的切线、法线方程如何写？", ["y-y_0=f'(x_0)(x-x_0)", "y-y_0=-\\frac{1}{f'(x_0)}(x-x_0)"], "法线第二式要求 $f'(x_0)\\ne0$；斜率为零时法线是 $x=x_0$。", "先分清切线斜率是 $f'(x_0)$，法线斜率才是负倒数。", "高数3"),
    card("differential-definition", "高等数学", "导数与微分", input, "微分的主部", "一元函数可微时，$\\Delta y$ 怎样拆成主部和高阶小量？", ["\\Delta y=f'(x)\\Delta x+o(\\Delta x),\\qquad\\mathrm{d}y=f'(x)\\,\\mathrm{d}x"], "在函数可导的点，一元函数可微。", "$\\mathrm{d}y$ 是线性主部，不等同于全部增量 $\\Delta y$。", "高数3"),
    card("derivative-basic-table", "高等数学", "导数与微分", input, "基本导数表：幂、指数、对数", "写出最常用的三组基本导数。", ["(x^\\alpha)'=\\alpha x^{\\alpha-1}", "(e^x)'=e^x,\\qquad(a^x)'=a^x\\ln a", "(\\ln|x|)'=\\frac1x"], "幂函数按定义域使用；$a>0,a\\ne1$。", "$\\ln|x|$ 的导数统一覆盖正负区间，不能忘记绝对值。", "高数4"),
    card("derivative-trig-table", "高等数学", "导数与微分", input, "基本导数表：三角与反三角", "写出 $\\sin x,\\cos x,\\tan x,\\arctan x,\\arcsin x$ 的导数。", ["(\\sin x)'=\\cos x,\\quad(\\cos x)'=-\\sin x,\\quad(\\tan x)'=\\sec^2x", "(\\arctan x)'=\\frac1{1+x^2},\\qquad(\\arcsin x)'=\\frac1{\\sqrt{1-x^2}}"], "在各自定义域的内部使用。", "反三角函数导数的根式是 $\\sqrt{1-x^2}$，不要与积分公式混淆。", "高数4"),
    card("derivative-rules", "高等数学", "导数与微分", input, "乘、商、链式法则", "写出三条最常用求导规则。", ["(uv)'=u'v+uv'", "\\left(\\frac uv\\right)'=\\frac{u'v-uv'}{v^2}", "[f(g(x))]'=f'(g(x))g'(x)"], "商法则要求 $v\\ne0$。", "复合函数的内层导数不能漏；商法则分子顺序是“上导下减上乘下导”。", "高数4"),
    card("derivative-implicit", "高等数学", "导数与微分", input, "隐函数求导", "方程 $F(x,y)=0$ 给出 $y(x)$ 时，$y'$ 的公式是什么？", ["\\frac{\\mathrm{d}y}{\\mathrm{d}x}=-\\frac{F_x}{F_y}"], "在所考察点 $F_y\\ne0$，并满足隐函数存在条件。", "对含 $y$ 的每一项求导时要带上 $y'$；最后再解出 $y'$。", "高数4"),
    card("derivative-parametric", "高等数学", "导数与微分", input, "参数方程求导", "若 $x=x(t),y=y(t)$，怎样求一、二阶导数？", ["\\frac{\\mathrm{d}y}{\\mathrm{d}x}=\\frac{y'(t)}{x'(t)},\\qquad\\frac{\\mathrm{d}^2y}{\\mathrm{d}x^2}=\\frac{\\mathrm{d}}{\\mathrm{d}t}\\left(\\frac{y'}{x'}\\right)\\bigg/x'(t)"], "要求相应分母 $x'(t)\\ne0$。", "二阶导数要再除一次 $\\mathrm{d}x/\\mathrm{d}t$，不能只对商求一次 $t$ 导数。", "高数4"),
    card("derivative-inverse", "高等数学", "导数与微分", input, "反函数的导数", "反函数 $y=f^{-1}(x)$ 的导数怎样写？", ["(f^{-1})'(x)=\\frac1{f'(f^{-1}(x))}"], "原函数在对应点可导且导数非零，并在邻域内存在反函数。", "分母取原函数在反函数值处的导数，不是简单写成 $1/f'(x)$。", "高数4"),
    card("derivative-higher", "高等数学", "导数与微分", input, "高阶导数：Leibniz 公式", "两个函数乘积的 $n$ 阶导数怎样展开？", ["(uv)^{(n)}=\\sum_{k=0}^{n}\\binom{n}{k}u^{(k)}v^{(n-k)}"], "两函数有足够阶可导。", "组合数下标与导数阶数应互补相加为 $n$。", "高数4")
  );

  cards.push(
    card("application-monotonicity", "高等数学", "导数应用", input, "单调性的导数判别", "在区间内，$f'$ 的符号与 $f$ 的单调性如何对应？", ["f'(x)>0\\Longrightarrow f\\ \\text{递增},\\qquad f'(x)<0\\Longrightarrow f\\ \\text{递减}"], "在整个区间内可导；非严格版用 $\\ge0$、$\\le0$。", "临界点处 $f'=0$ 不决定单调性，要看两侧符号。", "高数5"),
    card("application-extreme-necessary", "高等数学", "导数应用", input, "极值点的必要条件", "内点极值且可导时，导数必须满足什么？", ["f\\ \\text{在 }x_0\\text{ 处取极值且可导}\\Longrightarrow f'(x_0)=0"], "必须是区间内点且在该点可导。", "$f'(x_0)=0$ 只是候选点；不可导点也可能是极值点。", "高数5"),
    card("application-first-test", "高等数学", "导数应用", input, "极值的第一充分条件", "如何由 $f'$ 在临界点两侧的符号判断极大、极小？", ["+\\to-\\Longrightarrow\\text{极大值},\\qquad-\\to+\\Longrightarrow\\text{极小值}"], "在 $x_0$ 邻域内考察一阶导数的变号。", "只看 $f'(x_0)=0$ 没有结论，必须看左右符号。", "高数5"),
    card("application-second-test", "高等数学", "导数应用", input, "极值的第二充分条件", "当 $f'(x_0)=0$ 时，$f''(x_0)$ 的符号如何判别极值？", ["f''(x_0)>0\\Longrightarrow\\text{极小值},\\qquad f''(x_0)<0\\Longrightarrow\\text{极大值}"], "要求二阶导数存在且非零。", "$f''(x_0)=0$ 时本判别法失效，转用高阶导数或第一充分条件。", "高数5"),
    card("application-concavity", "高等数学", "导数应用", input, "凹凸性与拐点", "用二阶导数如何判断图像的弯曲方向？拐点如何筛选？", ["f''(x)>0\\Longrightarrow\\text{图像位于切线的上方（通常称下凹）}", "f''(x)<0\\Longrightarrow\\text{图像位于切线的下方（通常称上凹）}"], "拐点候选来自 $f''=0$ 或 $f''$ 不存在处，最终要检验凹凸性改变。", "术语“上凹/下凹”在不同教材中口径可能相反；以切线位置和二阶导数符号为准。", "高数5"),
    card("application-asymptotes", "高等数学", "导数应用", input, "三类渐近线", "水平、铅直、斜渐近线各怎样求？", ["\\lim_{x\\to\\infty}f(x)=b\\Rightarrow y=b", "\\lim_{x\\to x_0}f(x)=\\infty\\Rightarrow x=x_0", "k=\\lim_{x\\to\\infty}\\frac{f(x)}x,\\quad b=\\lim_{x\\to\\infty}[f(x)-kx]"], "斜渐近线要求上述 $k,b$ 都存在且有限。", "铅直渐近线来自函数值无界，不是函数值等于零。", "高数5"),
    card("application-closed-extreme", "高等数学", "导数应用", input, "闭区间最值的候选点", "求闭区间最值时必须比较哪些点？", ["\\text{端点}\\ +\\ \\text{区间内 }f'=0\\text{ 或 }f'\\text{不存在的候选点}"], "连续于闭区间，内点处按可导性列候选。", "只找驻点会漏掉端点最值。", "高数5"),
    card("application-curvature", "高等数学", "导数应用", input, "曲率与曲率半径", "平面曲线 $y=f(x)$ 的曲率公式是什么？", ["K=\\frac{|y''|}{[1+(y')^2]^{3/2}},\\qquad R=\\frac1K"], "需要二阶可导；$K\\ne0$ 时曲率半径有意义。", "曲率半径是曲率的倒数，不是导数的倒数。", "高数5"),
    card("application-motion", "高等数学", "导数应用", input, "位移、速度、加速度", "若位移为 $s(t)$，速度和加速度如何对应？", ["v(t)=s'(t),\\qquad a(t)=v'(t)=s''(t)"], "变量是时间 $t$。", "速率是 $|v(t)|$；速度为零不必然意味着加速度为零。", "高数7"),
    card("mean-rolle", "高等数学", "中值定理与泰勒", input, "罗尔定理", "罗尔定理的三项前提与结论是什么？", ["f\\in C[a,b],\\ f\\ \\text{在 }(a,b)\\text{可导},\\ f(a)=f(b)\\Longrightarrow\\exists\\xi\\in(a,b):f'(\\xi)=0"], "闭区间连续、开区间可导、端点等值，三项都要检查。", "图像直观为某处切线水平；没有端点等值不能直接使用。", "高数6"),
    card("mean-lagrange", "高等数学", "中值定理与泰勒", input, "拉格朗日中值定理", "拉格朗日中值定理的结论怎样写？", ["\\exists\\xi\\in(a,b):\\quad f'(\\xi)=\\frac{f(b)-f(a)}{b-a}"], "前提：$f\\in C[a,b]$ 且在 $(a,b)$ 可导。", "右边是割线斜率，不是端点导数的平均。", "高数6"),
    card("mean-cauchy", "高等数学", "中值定理与泰勒", input, "柯西中值定理", "如何把两个函数的增量比写成导数比？", ["\\exists\\xi\\in(a,b):\\quad\\frac{f(b)-f(a)}{g(b)-g(a)}=\\frac{f'(\\xi)}{g'(\\xi)}"], "两函数闭区间连续、开区间可导，且 $g'(x)\\ne0$；分母增量也须非零。", "它是拉格朗日中值定理的推广；不能漏掉分母条件。", "高数6"),
    card("taylor-peano", "高等数学", "中值定理与泰勒", input, "泰勒公式的 Peano 余项", "在 $x_0$ 附近，$n$ 阶泰勒展开的结构是什么？", ["f(x)=\\sum_{k=0}^{n}\\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k+o\\bigl((x-x_0)^n\\bigr)"], "需要相应阶导数和余项条件。", "展开中心是 $x_0$；麦克劳林公式只是 $x_0=0$ 的特例。", "高数6"),
    card("taylor-common", "高等数学", "中值定理与泰勒", input, "麦克劳林常用展开", "写出 $e^x,\\sin x,\\cos x,\\ln(1+x)$ 的常用阶数展开。", ["e^x=1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+o(x^3)", "\\sin x=x-\\frac{x^3}{6}+o(x^3),\\quad\\cos x=1-\\frac{x^2}{2}+\\frac{x^4}{24}+o(x^4)", "\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}+o(x^3)"], "均在 $x\\to0$ 的适用邻域内。", "加减抵消题需要保留到抵消后最低非零项；展开阶数由抵消结构决定。", "高数6")
  );

  cards.push(
    card("application-related-rates", "高等数学", "相关变化率", input, "相关变化率的通用链条", "若变量满足关系式 $F(x(t),y(t),\\ldots)=0$，怎样求未知变量的变化率？", ["F_x\\frac{\\mathrm{d}x}{\\mathrm{d}t}+F_y\\frac{\\mathrm{d}y}{\\mathrm{d}t}+\\cdots=0"], "先建立变量关系，再对时间 $t$ 求导，最后代入题目给出的时刻和已知变化率。", "不能先代入特殊时刻再把变量当常数；相关变量都要按链式法则求导。", "高数7")
  );

  cards.push(
    card("formula-power", "高等数学", "积分计算", pending, "幂函数与对数型原函数", "补全 $\\int x^\\alpha\\,\\mathrm{d}x$；当 $\\alpha=-1$ 时怎么办？", ["\\int x^\\alpha\\,\\mathrm{d}x=\\frac{x^{\\alpha+1}}{\\alpha+1}+C\\quad(\\alpha\\ne-1)", "\\int\\frac1x\\,\\mathrm{d}x=\\ln|x|+C"], "$\\alpha$ 为常数；对数型要避开 $x=0$。", "$\\alpha=-1$ 是幂函数公式的例外，不能把它硬代入分母。", "高数9"),
    card("formula-exp", "高等数学", "积分计算", pending, "指数函数原函数", "分别写出 $e^{ax}$ 与 $a^x$ 的不定积分。", ["\\int e^{ax}\\,\\mathrm{d}x=\\frac{e^{ax}}a+C\\quad(a\\ne0)", "\\int a^x\\,\\mathrm{d}x=\\frac{a^x}{\\ln a}+C\\quad(a>0,a\\ne1)"], "常数 $a$ 满足对应条件。", "$e^{ax}$ 的分母是 $a$；$a^x$ 的分母是 $\\ln a$。", "高数9"),
    card("formula-sin-cos", "高等数学", "积分计算", pending, "正弦与余弦原函数", "不定积分中，谁导出谁？", ["\\int\\sin x\\,\\mathrm{d}x=-\\cos x+C", "\\int\\cos x\\,\\mathrm{d}x=\\sin x+C"], "在所讨论的连续区间内使用。", "对结果再求导复核：$-\\cos x$ 的导数才是 $\\sin x$。", "高数9"),
    card("formula-tan-cot", "高等数学", "积分计算", pending, "正切与余切原函数", "写出 $\\int\\tan x\\,\\mathrm{d}x$ 与 $\\int\\cot x\\,\\mathrm{d}x$。", ["\\int\\tan x\\,\\mathrm{d}x=-\\ln|\\cos x|+C", "\\int\\cot x\\,\\mathrm{d}x=\\ln|\\sin x|+C"], "分别在 $\\cos x\\ne0$、$\\sin x\\ne0$ 的连续区间内使用。", "对数内的绝对值不能省略；$\\tan x$ 的原函数前有负号。", "高数9"),
    card("formula-sec-csc", "高等数学", "积分计算", pending, "正割与余割原函数", "写出 $\\int\\sec x\\,\\mathrm{d}x$ 与 $\\int\\csc x\\,\\mathrm{d}x$。", ["\\int\\sec x\\,\\mathrm{d}x=\\ln|\\sec x+\\tan x|+C", "\\int\\csc x\\,\\mathrm{d}x=\\ln|\\csc x-\\cot x|+C"], "在相应三角函数有定义的连续区间内使用。", "第二式是 $\\csc x-\\cot x$；两式都保留绝对值。", "高数9"),
    card("formula-arctan-arcsin", "高等数学", "积分计算", pending, "反三角型标准积分", "看到 $x^2+a^2$ 或 $\\sqrt{a^2-x^2}$，分别联想什么？", ["\\int\\frac{\\mathrm{d}x}{x^2+a^2}=\\frac1a\\arctan\\frac xa+C\\quad(a>0)", "\\int\\frac{\\mathrm{d}x}{\\sqrt{a^2-x^2}}=\\arcsin\\frac xa+C\\quad(a>0)"], "取 $a>0$，且根式被开方数要有意义。", "前者对应 $\\arctan$，后者对应 $\\arcsin$；先看分母结构。", "高数9"),
    card("formula-quadratic", "高等数学", "积分计算", pending, "平方差分母", "分别写出分母 $x^2-a^2$ 与 $a^2-x^2$ 的结果。", ["\\int\\frac{\\mathrm{d}x}{x^2-a^2}=\\frac1{2a}\\ln\\left|\\frac{x-a}{x+a}\\right|+C", "\\int\\frac{\\mathrm{d}x}{a^2-x^2}=\\frac1{2a}\\ln\\left|\\frac{a+x}{a-x}\\right|+C"], "$a>0$，且积分区间不能穿过分母为零处。", "分母整体变号会改变对数比；先因式分解核对。", "高数9"),
    card("formula-root", "高等数学", "积分计算", pending, "根式分母的对数型", "写出 $\\int\\mathrm{d}x/\\sqrt{x^2\\pm a^2}$。", ["\\int\\frac{\\mathrm{d}x}{\\sqrt{x^2+a^2}}=\\ln\\left|x+\\sqrt{x^2+a^2}\\right|+C", "\\int\\frac{\\mathrm{d}x}{\\sqrt{x^2-a^2}}=\\ln\\left|x+\\sqrt{x^2-a^2}\\right|+C"], "$a>0$，并限定在根式有意义的区间。", "两式外观近似，定义域不同；第二式要求 $|x|\\ge a$。", "高数9"),
    card("formula-trig-square", "高等数学", "积分计算", pending, "平方三角函数", "如何先降幂再积 $\\sin^2x$、$\\cos^2x$？", ["\\sin^2x=\\frac{1-\\cos2x}{2},\\qquad\\cos^2x=\\frac{1+\\cos2x}{2}"], "适合偶次幂的三角函数积分。", "先用降幂公式，不要把 $\\sin^2x$ 误写成 $\\sin2x$。", "高数9"),
    card("formula-tan-square", "高等数学", "积分计算", pending, "正切、正割平方关系", "写出将 $\\tan^2x$ 与 $\\sec^2x$ 互换的恒等式。", ["\\tan^2x=\\sec^2x-1,\\qquad(\\tan x)'=\\sec^2x"], "在三角函数有定义的区间使用。", "若只差一个 $\\sec^2x$，可优先令 $u=\\tan x$。", "高数9"),
    card("formula-exp-trig", "高等数学", "积分计算", pending, "指数三角型积分", "如何积 $\\int e^{ax}\\cos bx\\,\\mathrm{d}x$？", ["\\int e^{ax}\\cos bx\\,\\mathrm{d}x=\\frac{e^{ax}}{a^2+b^2}(a\\cos bx+b\\sin bx)+C"], "$a,b$ 为常数，$a^2+b^2\\ne0$。", "同类 $e^{ax}\\sin bx$ 可由分部积分两次后回代。", "高数9"),
    card("method-substitution-trigger", "高等数学", "积分计算", pending, "换元积分法的触发信号", "何时令 $u=\\varphi(x)$ 最自然？", ["\\int f(\\varphi(x))\\varphi'(x)\\,\\mathrm{d}x=\\int f(u)\\,\\mathrm{d}u"], "新元与微分要成对出现；换元后要完整改写被积式。", "只换表达式不换 $\\mathrm{d}x$ 会丢掉链式因子。", "高数9"),
    card("method-substitution-bounds", "高等数学", "积分计算", pending, "定积分换元的上下限", "定积分换元后，积分限怎样变化？", ["\\int_a^b f(\\varphi(x))\\varphi'(x)\\,\\mathrm{d}x=\\int_{\\varphi(a)}^{\\varphi(b)}f(u)\\,\\mathrm{d}u"], "换元函数在积分区间上满足相应连续、可导条件。", "若已经换成 $u$，上下限也必须写成 $u$ 的值；不要混用旧限。", "高数9"),
    card("method-parts", "高等数学", "积分计算", pending, "分部积分公式", "不定积分和定积分的分部积分式各是什么？", ["\\int u\\,\\mathrm{d}v=uv-\\int v\\,\\mathrm{d}u", "\\int_a^b u(x)v'(x)\\,\\mathrm{d}x=[uv]_a^b-\\int_a^b u'(x)v(x)\\,\\mathrm{d}x"], "选取 $u$ 后，$\\mathrm{d}v$ 必须容易积分。", "目标是让剩余积分更简单；定积分的边界项不能漏。", "高数9"),
    card("definite-orientation", "高等数学", "定积分与变上限", input, "定积分的方向", "交换积分上下限会发生什么？", ["\\int_a^b f(x)\\,\\mathrm{d}x=-\\int_b^a f(x)\\,\\mathrm{d}x,\\qquad\\int_a^a f(x)\\,\\mathrm{d}x=0"], "积分存在。", "定积分是带方向的代数和，不总是面积。", "高数8"),
    card("definite-additivity", "高等数学", "定积分与变上限", input, "定积分的可加性", "中间点 $c$ 怎样拆分积分区间？", ["\\int_a^b f(x)\\,\\mathrm{d}x=\\int_a^c f(x)\\,\\mathrm{d}x+\\int_c^b f(x)\\,\\mathrm{d}x"], "积分在对应子区间上存在。", "即使 $c$ 不在大小顺序之间，带方向公式仍成立。", "高数8"),
    card("definite-linearity", "高等数学", "定积分与变上限", input, "定积分的线性性", "常数可如何提出积分号？", ["\\int_a^b[\\alpha f(x)+\\beta g(x)]\\,\\mathrm{d}x=\\alpha\\int_a^bf(x)\\,\\mathrm{d}x+\\beta\\int_a^bg(x)\\,\\mathrm{d}x"], "相关积分都存在。", "线性性处理加减与常数倍，不可把乘积错误拆开。", "高数8"),
    card("definite-comparison", "高等数学", "定积分与变上限", input, "定积分的保序性", "若 $f\\le g$，积分之间有什么关系？", ["f(x)\\le g(x)\\Longrightarrow\\int_a^bf(x)\\,\\mathrm{d}x\\le\\int_a^bg(x)\\,\\mathrm{d}x\\quad(a<b)"], "在 $[a,b]$ 上积分存在，且 $a<b$。", "若交换上下限，不等号的使用要回到带方向定义。", "高数8"),
    card("definite-bounds-mean", "高等数学", "定积分与变上限", input, "定积分估值与中值定理", "若 $m\\le f\\le M$，如何夹逼定积分？连续函数的积分中值式是什么？", ["m(b-a)\\le\\int_a^bf(x)\\,\\mathrm{d}x\\le M(b-a)", "\\int_a^bf(x)\\,\\mathrm{d}x=f(\\xi)(b-a),\\quad\\xi\\in[a,b]"], "第一式取 $a<b$；第二式要求 $f$ 在 $[a,b]$ 连续。", "积分中值中的 $\\xi$ 一般未知，不能随意取中点。", "高数8"),
    card("definite-newton-leibniz", "高等数学", "定积分与变上限", pending, "牛顿—莱布尼茨公式", "若 $F'=f$，如何计算 $\\int_a^b f(x)\\,\\mathrm{d}x$？", ["\\int_a^bf(x)\\,\\mathrm{d}x=F(b)-F(a)"], "被积函数连续或满足保证原函数与定积分可用的条件。", "先找原函数，再代“上减下”；不要把下限项漏掉。", "高数9"),
    card("definite-absolute", "高等数学", "定积分与变上限", input, "绝对值积分的拆点", "计算 $\\int_a^b|f(x)|\\,\\mathrm{d}x$ 的首步是什么？", ["\\int_a^b|f(x)|\\,\\mathrm{d}x=\\sum\\int_{I_k}\\pm f(x)\\,\\mathrm{d}x"], "先找 $f(x)=0$ 的分界点并判定每段符号。", "不能把绝对值直接去掉；积分值应非负。", "高数8"),
    card("upper-definition", "高等数学", "定积分与变上限", input, "积分上限函数", "写出 $\\Phi(x)$ 的定义并说明它是函数。", ["\\Phi(x)=\\int_a^x f(t)\\,\\mathrm{d}t"], "积分变量 $t$ 是哑变量；$x$ 是上限与自变量。", "不要把被积函数中的 $t$ 误当成外部自变量 $x$。", "高数8"),
    card("upper-continuity", "高等数学", "定积分与变上限", input, "积分上限函数的连续性", "若 $f$ 可积，$\\Phi(x)=\\int_a^x f(t)\\,\\mathrm{d}t$ 至少具有什么性质？", ["\\Phi(x)\\ \\text{在定义区间内连续}"], "被积函数在相应区间可积。", "连续性不等于处处可导；可导性还需更强条件。", "高数8"),
    card("upper-derivative", "高等数学", "定积分与变上限", input, "变上限积分求导", "若 $f$ 连续，$\\Phi'(x)$ 等于什么？", ["\\Phi(x)=\\int_a^xf(t)\\,\\mathrm{d}t\\quad\\Longrightarrow\\quad\\Phi'(x)=f(x)"], "被积函数在所考察点连续。", "求导后把哑变量 $t$ 换成上限变量 $x$。", "高数8"),
    card("upper-chain", "高等数学", "定积分与变上限", input, "变上限积分的链式法则", "上限为 $\\varphi(x)$ 时怎样求导？", ["\\frac{\\mathrm{d}}{\\mathrm{d}x}\\int_a^{\\varphi(x)}f(t)\\,\\mathrm{d}t=f(\\varphi(x))\\varphi'(x)"], "在对应范围内连续、可导。", "代入上限后还要乘外层上限函数的导数。", "高数8"),
    card("upper-two-bounds", "高等数学", "定积分与变上限", input, "上下限都含 $x$ 的求导", "写出 $\\int_{\\alpha(x)}^{\\beta(x)}f(t)\\,\\mathrm{d}t$ 的导数。", ["\\frac{\\mathrm{d}}{\\mathrm{d}x}\\int_{\\alpha(x)}^{\\beta(x)}f(t)\\,\\mathrm{d}t=f(\\beta(x))\\beta'(x)-f(\\alpha(x))\\alpha'(x)"], "上下限函数可导，被积函数在相应区间连续。", "下限项前是减号，来自积分方向。", "高数8"),
    card("upper-parity", "高等数学", "定积分与变上限", input, "从 $0$ 积到 $x$ 的奇偶性", "令 $H(x)=\\int_0^xh(t)\\,\\mathrm{d}t$。$h$ 为奇、偶函数时，$H$ 分别是什么？", ["h\\ \\text{奇}\\Longrightarrow H\\ \\text{偶},\\qquad h\\ \\text{偶}\\Longrightarrow H\\ \\text{奇}"], "定义域关于原点对称，相关积分存在。", "被积函数的奇偶性不能直接照搬给变上限积分函数；二者恰好互换。", "高数8"),
    card("definite-parity", "高等数学", "定积分与变上限", input, "对称区间上的奇偶性", "在 $[-a,a]$ 上，奇函数、偶函数的定积分如何化简？", ["\\int_{-a}^af(x)\\,\\mathrm{d}x=0\\quad(f\\ \\text{奇})", "\\int_{-a}^af(x)\\,\\mathrm{d}x=2\\int_0^af(x)\\,\\mathrm{d}x\\quad(f\\ \\text{偶})"], "积分区间关于原点对称，函数满足相应奇偶性。", "定积分的奇偶性与上一张“变上限积分的奇偶性”是不同对象。", "高数8")
  );

  cards.push(
    card("improper-infinite", "高等数学", "反常积分", input, "无穷区间的反常积分", "写出 $\\int_a^{+\\infty}f(x)\\,\\mathrm{d}x$ 的定义。", ["\\int_a^{+\\infty}f(x)\\,\\mathrm{d}x=\\lim_{b\\to+\\infty}\\int_a^bf(x)\\,\\mathrm{d}x"], "右侧极限存在且有限才称收敛。", "$+\\infty$ 不是普通积分上限，不能跳过极限直接代原函数。", "高数8"),
    card("improper-whole-line", "高等数学", "反常积分", input, "全实轴反常积分", "如何定义 $\\int_{-\\infty}^{+\\infty}f(x)\\,\\mathrm{d}x$？", ["\\int_{-\\infty}^{+\\infty}f(x)\\,\\mathrm{d}x=\\int_{-\\infty}^{c}f(x)\\,\\mathrm{d}x+\\int_c^{+\\infty}f(x)\\,\\mathrm{d}x"], "右侧两段都分别收敛；$c$ 为任意有限拆点。", "正负两端的发散不能相互抵消；柯西主值不是此处的收敛定义。", "高数8"),
    card("improper-singularity", "高等数学", "反常积分", input, "端点与内部瑕点", "被积函数在端点或内部点无界时，首步是什么？", ["\\int_a^bf(x)\\,\\mathrm{d}x=\\lim_{t\\to a^+}\\int_t^bf(x)\\,\\mathrm{d}x", "\\int_a^bf(x)\\,\\mathrm{d}x=\\int_a^cf(x)\\,\\mathrm{d}x+\\int_c^bf(x)\\,\\mathrm{d}x"], "端点瑕点取单侧极限；内部瑕点必须分段，两个单侧都收敛。", "跨过瑕点“一笔带过”没有定义。", "高数8"),
    card("improper-direct-comparison", "高等数学", "反常积分", input, "正项比较判别法", "若 $0\\le f\\le g$，收敛与发散分别该看谁？", ["\\int g\\ \\text{收敛}\\Longrightarrow\\int f\\ \\text{收敛}", "\\int f\\ \\text{发散}\\Longrightarrow\\int g\\ \\text{发散}"], "在无穷端或瑕点附近，$f,g$ 非负且满足比较。", "记忆为“收敛找大、发散找小”；两个逆向都不成立。", "高数8"),
    card("improper-limit-comparison", "高等数学", "反常积分", input, "极限比较判别法", "正项 $f,g$ 的比值极限为正有限数时，敛散性怎样？", ["\\lim\\frac{f(x)}{g(x)}=A,\\quad0<A<+\\infty\\Longrightarrow\\int f\\ \\text{与}\\int g\\ \\text{同敛散}"], "在所考察端点附近 $f,g$ 为正。", "极限为 $0$ 或 $+\\infty$ 时不能直接套“同敛散”，改用单向比较。", "高数8"),
    card("improper-p-infinity", "高等数学", "反常积分", input, "$p$ 型积分：无穷远处", "何时 $\\int_1^{+\\infty}x^{-p}\\,\\mathrm{d}x$ 收敛？", ["\\int_1^{+\\infty}\\frac{\\mathrm{d}x}{x^p}\\ \\text{收敛}\\iff p>1"], "$p$ 为实常数。", "无穷远处的临界是 $p>1$ 收敛。", "高数8"),
    card("improper-p-zero", "高等数学", "反常积分", input, "$p$ 型积分：$0$ 附近", "何时 $\\int_0^1x^{-p}\\,\\mathrm{d}x$ 收敛？", ["\\int_0^1\\frac{\\mathrm{d}x}{x^p}\\ \\text{收敛}\\iff p<1"], "$x=0$ 为瑕点，按单侧极限定义。", "它与无穷远处的结论方向相反。", "高数8"),
    card("improper-log-power", "高等数学", "反常积分", input, "对数幂的比较", "当 $x\\to+\\infty$，$\\ln x$ 与任意正幂 $x^\\alpha$ 如何比较？", ["\\ln x=o(x^\\alpha)\\qquad(\\alpha>0)"], "考察 $x\\to+\\infty$。", "这能把对数增长归到幂函数比较基准，但不等于 $x\\to0$ 的等价关系。", "高数8"),
    card("integral-area", "高等数学", "积分应用", pending, "平面面积的定积分表达", "曲线 $y=f(x)\\ge0$ 与 $x$ 轴在 $[a,b]$ 围成的面积是什么？", ["S=\\int_a^bf(x)\\,\\mathrm{d}x"], "要求 $a<b$ 且曲线在区间内非负。", "一般面积用 $\\int|f(x)-g(x)|\\,\\mathrm{d}x$ 或先按交点分段。", "高数10"),
    card("integral-volume", "高等数学", "积分应用", pending, "旋转体体积：圆盘法", "曲线 $y=f(x)\\ge0$ 绕 $x$ 轴旋转的体积公式是什么？", ["V=\\pi\\int_a^b[f(x)]^2\\,\\mathrm{d}x"], "绕 $x$ 轴，且半径由 $|f(x)|$ 给出。", "绕 $y$ 轴或有内外半径时要改用相应截面面积。", "高数10"),
    card("integral-arc", "高等数学", "积分应用", pending, "平面曲线弧长", "曲线 $y=f(x)$ 在 $[a,b]$ 的弧长如何计算？", ["L=\\int_a^b\\sqrt{1+[f'(x)]^2}\\,\\mathrm{d}x"], "函数在区间内足够光滑，且积分存在。", "根号内是 $1+(y')^2$，不是 $1+y^2$。", "高数10"),
    card("integral-average", "高等数学", "积分应用", pending, "函数的平均值", "连续函数 $f$ 在 $[a,b]$ 上的平均值是什么？", ["f_{\\mathrm{avg}}=\\frac1{b-a}\\int_a^bf(x)\\,\\mathrm{d}x"], "$a<b$，定积分存在。", "积分中值定理说明某个 $\\xi$ 使 $f(\\xi)=f_{\\mathrm{avg}}$，但 $\\xi$ 不一定是中点。", "高数10")
  );

  cards.push(
    card("integral-between-curves", "高等数学", "积分应用", pending, "两曲线之间的面积", "若在一段区间内 $y_{\\text{上}}(x)\\ge y_{\\text{下}}(x)$，两曲线围成的面积怎样写？", ["S=\\int_a^b\\bigl[y_{\\text{上}}(x)-y_{\\text{下}}(x)\\bigr]\\,\\mathrm{d}x"], "先求交点并判断每一段的上下关系。", "曲线交叉时不能整段固定相减；应按交点分段，或使用绝对值后再正确拆分。", "高数10"),
    card("integral-polar-area", "高等数学", "积分应用", pending, "极坐标下的面积", "极坐标曲线 $r=r(\\theta)$ 与射线围成的扇形区域面积怎样表达？", ["S=\\frac12\\int_\\alpha^\\beta r^2(\\theta)\\,\\mathrm{d}\\theta"], "曲线在 $[\\alpha,\\beta]$ 上按题意恰当描出区域，且半径取非负表示。", "系数是 $\\frac12$；还要检查角度范围是否重复覆盖区域。", "高数10"),
    card("integral-washer", "高等数学", "积分应用", pending, "旋转体体积：垫片法", "垂直于旋转轴的截面有外半径 $R(x)$、内半径 $r(x)$ 时，体积怎样写？", ["V=\\pi\\int_a^b\\bigl[R^2(x)-r^2(x)\\bigr]\\,\\mathrm{d}x"], "在区间内 $R(x)\\ge r(x)\\ge0$，且截面与旋转轴垂直。", "有空心部分时要减去内圆盘；不能只套外半径的圆盘公式。", "高数10"),
    card("integral-shell", "高等数学", "积分应用", pending, "旋转体体积：柱壳法", "用平行于竖直旋转轴的薄条生成柱壳时，体积微元怎样写？", ["V=2\\pi\\int_a^b|x-c|\\bigl[y_{\\text{上}}(x)-y_{\\text{下}}(x)\\bigr]\\,\\mathrm{d}x"], "绕竖直直线 $x=c$ 旋转，并按不穿过旋转轴的区间或分段处理。", "柱壳微元是“周长 × 高 × 厚度”；半径是到旋转轴的距离。", "高数10"),
    card("integral-arc-parametric", "高等数学", "积分应用", pending, "参数与极坐标弧长", "曲线用参数方程或极坐标表示时，弧长公式分别是什么？", ["L=\\int_\\alpha^\\beta\\sqrt{[x'(t)]^2+[y'(t)]^2}\\,\\mathrm{d}t", "L=\\int_\\alpha^\\beta\\sqrt{r^2(\\theta)+[r'(\\theta)]^2}\\,\\mathrm{d}\\theta"], "参数函数或极坐标函数足够光滑，并按题意取不重复的参数区间。", "极坐标弧长根号内同时有 $r^2$ 与 $[r'(\\theta)]^2$，不能漏掉任一项。", "高数10"),
    card("integral-surface-area", "高等数学", "积分应用", pending, "旋转曲面的面积", "曲线 $y=f(x)$ 绕 $x$ 轴旋转一周所得侧面积怎样写？", ["S=2\\pi\\int_a^b|f(x)|\\sqrt{1+[f'(x)]^2}\\,\\mathrm{d}x"], "曲线光滑，且旋转曲面按题意不重复计数。", "算体积用面积截面；算侧面积要用弧长微元 $\\mathrm{d}s$ 与旋转半径相乘。", "高数10"),
    card("integral-centroid", "高等数学", "积分应用", pending, "平面图形的形心", "对 $D=\\{(x,y):a\\le x\\le b,\\ 0\\le y\\le f(x)\\}$，形心坐标怎样写？", ["S=\\int_a^bf(x)\\,\\mathrm{d}x,\\qquad\\bar{x}=\\frac1S\\int_a^bxf(x)\\,\\mathrm{d}x,\\qquad\\bar{y}=\\frac1{2S}\\int_a^b[f(x)]^2\\,\\mathrm{d}x"], "要求 $f(x)\\ge0$ 且 $S>0$；若下边界不是 $0$，应先改写上下边界。", "形心坐标是面积矩除以总面积；$\\bar y$ 的分子来自水平条的矩。", "高数10"),
    card("integral-cross-section-volume", "高等数学", "积分应用", pending, "平行截面求体积", "若垂直于 $x$ 轴的截面面积为 $A(x)$，立体体积如何表达？", ["V=\\int_a^bA(x)\\,\\mathrm{d}x"], "截面面积函数在 $[a,b]$ 上可积，且每个截面与题设方向一致。", "旋转体体积只是 $A(x)$ 取圆盘或垫片面积的特例。", "高数10")
  );

  cards.push(
    card("integral-weighted-mean", "高等数学", "积分等式与不等式", pending, "积分形式的中值定理", "若 $f$ 连续、$g$ 不变号，两个函数的乘积积分怎样取中值？", ["\\int_a^bf(x)g(x)\\,\\mathrm{d}x=f(\\xi)\\int_a^bg(x)\\,\\mathrm{d}x,\\qquad\\xi\\in[a,b]"], "通常要求 $f$ 在 $[a,b]$ 连续，$g$ 可积且不变号，且不在区间上恒为零。", "中值点 $\\xi$ 一般不能指定；$g$ 的符号条件决定能否把它作为权函数。", "高数11"),
    card("integral-reflection", "高等数学", "积分等式与不等式", pending, "定积分的区间反射", "把变量换成 $u=a+b-x$ 后，定积分可以改写成什么对称形式？", ["\\int_a^bf(x)\\,\\mathrm{d}x=\\int_a^bf(a+b-x)\\,\\mathrm{d}x"], "被积函数在对应区间上可积。", "换元后积分上下限同时反向，两个负号相抵；不能只替换被积函数而不处理限。", "高数11"),
    card("integral-squeeze-limit", "高等数学", "积分等式与不等式", pending, "用夹逼准则处理积分极限", "若 $0\\le f_n(x)\\le g_n(x)$，且大函数的积分趋于 $0$，能推出什么？", ["0\\le f_n\\le g_n,\\quad\\lim_{n\\to\\infty}\\int_a^bg_n(x)\\,\\mathrm{d}x=0\\ \\Longrightarrow\\ \\lim_{n\\to\\infty}\\int_a^bf_n(x)\\,\\mathrm{d}x=0"], "不等式在 $[a,b]$ 上成立，且相关函数可积、非负。", "先把函数不等式积分成数列不等式，再使用数列夹逼；不能直接交换极限与积分。", "高数11")
  );

  cards.push(
    card("integral-variable-work", "高等数学", "积分物理应用", pending, "变力沿直线做功", "物体沿直线移动，力的方向分量为 $F(x)$ 时，区间 $[a,b]$ 上的功怎样表达？", ["W=\\int_a^bF(x)\\,\\mathrm{d}x"], "位移方向取为积分变量方向，且 $F(x)$ 表示沿位移方向的力分量。", "功的微元是 $\\mathrm{d}W=F(x)\\,\\mathrm{d}x$；反向力分量会贡献负功。", "高数12"),
    card("integral-pumping-work", "高等数学", "积分物理应用", pending, "抽水做功", "在高度 $y$ 处厚度为 $\\mathrm{d}y$ 的水层截面积为 $A(y)$，提升距离为 $D(y)$ 时总功怎样写？", ["W=\\rho g\\int_a^bA(y)D(y)\\,\\mathrm{d}y"], "水密度为 $\\rho$、重力加速度为 $g$，并正确建立截面面积和提升距离。", "最容易漏的是水平截面面积 $A(y)$ 或提升距离 $D(y)$；先画坐标并相似三角形求截面。", "高数12"),
    card("integral-hydrostatic-pressure", "高等数学", "积分物理应用", pending, "静水压力", "深度为 $d(y)$、水平条宽度为 $w(y)$ 的平板微元受到的压力怎样积分？", ["P=\\rho g\\int_a^bd(y)w(y)\\,\\mathrm{d}y"], "液体静止，$d(y)\\ge0$ 为液面以下深度，且条带宽度按同一坐标描述。", "压力密度随深度线性增加；微元是“压强 × 面积”，不是只积宽度。", "高数12"),
    card("integral-linear-centroid", "高等数学", "积分物理应用", pending, "连续线密度的质量与质心", "一根沿 $x$ 轴分布、线密度为 $\\lambda(x)$ 的细棒，其总质量和质心怎样写？", ["M=\\int_a^b\\lambda(x)\\,\\mathrm{d}x,\\qquad\\bar{x}=\\frac1M\\int_a^bx\\lambda(x)\\,\\mathrm{d}x"], "线密度可积、非负且 $M>0$。", "质心是质量加权平均位置；均匀密度时可退化为几何中点（对称区间情形）。", "高数12"),
    card("integral-center-terms", "高等数学", "积分物理应用", pending, "重心、质心与形心", "在什么条件下重心、质心和形心重合？", ["\\text{均匀重力场} + \\text{均质}\\quad\\Longrightarrow\\quad\\text{重心} = \\text{质心} = \\text{形心}"], "讨论同一物体，且重力场均匀、密度均匀。", "质心由质量分布决定，形心由几何分布决定，重心还依赖重力场；三者不能无条件混称。", "高数12")
  );

  cards.push(
    card("multi-limit-path", "高等数学", "多元函数微分", pending, "二重极限的路径检验", "若沿两条趋近 $(x_0,y_0)$ 的路径得到不同极限，可以推出什么？", ["\\lim_{t\\to0}f(x_1(t),y_1(t))\\ne\\lim_{t\\to0}f(x_2(t),y_2(t))\\ \\Longrightarrow\\ \\lim_{(x,y)\\to(x_0,y_0)}f(x,y)\\ \\text{不存在}"], "两条路径都趋于 $(x_0,y_0)$，且各自的极限存在并不相等。", "路径结果相同只能保留‘可能存在’，不能单独证明二重极限存在。", "高数13"),
    card("multi-continuity", "高等数学", "多元函数微分", pending, "二元函数的连续性", "二元函数在 $(x_0,y_0)$ 连续的判定式是什么？", ["\\lim_{(x,y)\\to(x_0,y_0)}f(x,y)=f(x_0,y_0)"], "函数值存在，且二重极限存在并等于该函数值。", "连续性要求所有趋近方式都给出同一结果；只检查坐标轴路径不够。", "高数13"),
    card("double-estimate-mean", "高等数学", "二重积分", pending, "二重积分的估值与中值", "若在区域 $D$ 上 $m\\le f\\le M$，二重积分怎样估值？连续时的中值式怎样写？", ["mS_D\\le\\iint_Df(x,y)\\,\\mathrm{d}\\sigma\\le MS_D", "\\iint_Df(x,y)\\,\\mathrm{d}\\sigma=f(\\xi,\\eta)S_D"], "区域 $D$ 为有界闭区域，$S_D$ 为面积；中值式还要求 $f$ 在 $D$ 上连续。", "二重积分的估值本质是‘函数值 × 区域面积’的夹逼；$(\\xi,\\eta)$ 一般未知。", "高数14")
  );

  cards.push(
    card("multi-partial-definition", "高等数学", "多元函数微分", pending, "偏导数的定义", "二元函数在 $(x_0,y_0)$ 处对 $x$ 的偏导数怎样定义？", ["f_x(x_0,y_0)=\\lim_{\\Delta x\\to0}\\frac{f(x_0+\\Delta x,y_0)-f(x_0,y_0)}{\\Delta x}"], "求 $f_x$ 时把 $y$ 视为常数；求 $f_y$ 时反之。", "偏导数只沿坐标轴方向，不能替代全微分或任意方向变化。", "高数13"),
    card("multi-higher-partial", "高等数学", "多元函数微分", pending, "混合偏导的交换", "在什么常用条件下 $f_{xy}=f_{yx}$？", ["f_{xy}=f_{yx}"], "若二阶偏导数在邻域内连续，混合偏导可以交换。", "只知道两者在单点存在时，不能无条件交换。", "高数13"),
    card("multi-differentiability", "高等数学", "多元函数微分", pending, "可微的线性主部", "二元函数在 $(x_0,y_0)$ 可微的定义结构是什么？", ["\\Delta z=A\\Delta x+B\\Delta y+o(\\rho),\\qquad\\rho=\\sqrt{(\\Delta x)^2+(\\Delta y)^2}"], "余项相对 $\\rho$ 为高阶无穷小。", "偏导数存在不必然可微；可微比偏导存在更强。", "高数13"),
    card("multi-total-differential", "高等数学", "多元函数微分", pending, "全微分公式", "可微时 $\\mathrm{d}z$ 怎样写？", ["\\mathrm{d}z=f_x\\,\\mathrm{d}x+f_y\\,\\mathrm{d}y"], "在所考察点可微。", "若 $f_x,f_y$ 在邻域内连续，则它们存在是可微的充分条件。", "高数13"),
    card("multi-composite", "高等数学", "多元函数微分", pending, "多元复合函数求导", "若 $z=f(u,v)$，$u=u(x,y),v=v(x,y)$，$z_x$ 如何写？", ["z_x=f_u u_x+f_v v_x,\\qquad z_y=f_u u_y+f_v v_y"], "相关偏导数存在。", "先沿依赖图列链条；每条路径的贡献相加。", "高数13"),
    card("multi-implicit", "高等数学", "多元函数微分", pending, "二元隐函数求偏导", "由 $F(x,y,z)=0$ 确定 $z(x,y)$ 时，$z_x,z_y$ 是什么？", ["z_x=-\\frac{F_x}{F_z},\\qquad z_y=-\\frac{F_y}{F_z}"], "在所考察点 $F_z\\ne0$，并满足隐函数存在条件。", "求 $z_x$ 时 $y$ 固定，求 $z_y$ 时 $x$ 固定。", "高数13"),
    card("multi-extreme-necessary", "高等数学", "多元函数微分", pending, "二元函数极值的必要条件", "内点极值且偏导存在时，必须满足什么？", ["f_x(x_0,y_0)=0,\\qquad f_y(x_0,y_0)=0"], "极值点是定义域内点，且两个一阶偏导存在。", "驻点只是候选点；边界点与偏导不存在点也要单列检查。", "高数13"),
    card("multi-hessian", "高等数学", "多元函数微分", pending, "二元函数极值的二阶判别", "在驻点，$A=f_{xx},B=f_{xy},C=f_{yy},D=AC-B^2$ 如何判别？", ["D>0,\\ A>0\\Rightarrow\\text{极小};\\qquad D>0,\\ A<0\\Rightarrow\\text{极大};\\qquad D<0\\Rightarrow\\text{鞍点}"], "二阶偏导在邻域连续，且在驻点计算。", "$D=0$ 时此法无结论。", "高数13"),
    card("multi-lagrange", "高等数学", "多元函数微分", pending, "拉格朗日乘数法", "在约束 $\\varphi(x,y)=0$ 下求条件极值的方程组是什么？", ["\\nabla f(x,y)=\\lambda\\nabla\\varphi(x,y),\\qquad\\varphi(x,y)=0"], "约束曲线光滑且 $\\nabla\\varphi\\ne0$ 的常规情形。", "求出候选点后仍需比较目标函数值，不能把 $\\lambda$ 当最终答案。", "高数13"),
    card("multi-closed-extreme", "高等数学", "多元函数微分", pending, "多元函数的最大最小值", "在有界闭区域上求全局最值，要比较哪两类点？", ["\\text{区域内部驻点}\\quad\\text{与}\\quad\\text{边界上的候选点}"], "连续函数在有界闭区域上必能取到最大、最小值。", "只解内部 $f_x=f_y=0$ 会漏掉边界最值。", "高数13"),

    card("double-definition", "高等数学", "二重积分", pending, "二重积分的定义直觉", "二重积分 $\\iint_Df(x,y)\\,\\mathrm{d}\\sigma$ 是什么极限？", ["\\iint_Df(x,y)\\,\\mathrm{d}\\sigma=\\lim_{\\max\\Delta\\sigma_i\\to0}\\sum_{i=1}^nf(\\xi_i,\\eta_i)\\Delta\\sigma_i"], "在区域 $D$ 上可积。", "$\\mathrm{d}\\sigma$ 表示面积元；不要与一元积分的 $\\mathrm{d}x$ 混用。", "高数14"),
    card("double-rectangular", "高等数学", "二重积分", pending, "直角坐标：$x$ 型区域", "若 $D=\\{a\\le x\\le b,\\ \\varphi_1(x)\\le y\\le\\varphi_2(x)\\}$，二重积分怎样化累次积分？", ["\\iint_Df(x,y)\\,\\mathrm{d}\\sigma=\\int_a^b\\mathrm{d}x\\int_{\\varphi_1(x)}^{\\varphi_2(x)}f(x,y)\\,\\mathrm{d}y"], "固定 $x$ 后，$y$ 的上下界由区域边界给出。", "内层先积 $y$，所以 $y$ 的界限可以依赖 $x$。", "高数14"),
    card("double-horizontal", "高等数学", "二重积分", pending, "直角坐标：$y$ 型区域", "若固定 $y$ 先积 $x$，如何写累次积分？", ["\\iint_Df(x,y)\\,\\mathrm{d}\\sigma=\\int_c^d\\mathrm{d}y\\int_{\\psi_1(y)}^{\\psi_2(y)}f(x,y)\\,\\mathrm{d}x"], "固定 $y$ 后，$x$ 的界限由区域边界给出。", "换积分顺序时，必须重新画区域并重写内层上下限。", "高数14"),
    card("double-polar", "高等数学", "二重积分", pending, "极坐标变换与面积元", "二重积分换极坐标时最容易漏掉哪一项？", ["x=r\\cos\\theta,\\qquad y=r\\sin\\theta,\\qquad\\mathrm{d}\\sigma=r\\,\\mathrm{d}r\\,\\mathrm{d}\\theta"], "区域要正确改写成 $r,\\theta$ 的范围。", "雅可比因子 $r$ 不能漏；$r\\ge0$。", "高数14"),
    card("double-symmetry", "高等数学", "二重积分", pending, "二重积分的对称性", "区域关于 $y$ 轴对称时，$f$ 对 $x$ 为奇函数会怎样？", ["\\iint_Df(x,y)\\,\\mathrm{d}\\sigma=0"], "区域关于相应坐标轴或原点对称，且被积函数对对应变量具奇性。", "先确认区域与被积函数的对称性同时成立。", "高数14"),
    card("double-separable", "高等数学", "二重积分", pending, "矩形区域上的可分离被积函数", "在矩形 $D=[a,b]\\times[c,d]$ 上，$f(x,y)=g(x)h(y)$ 如何拆？", ["\\iint_Dg(x)h(y)\\,\\mathrm{d}\\sigma=\\left(\\int_a^bg(x)\\,\\mathrm{d}x\\right)\\left(\\int_c^dh(y)\\,\\mathrm{d}y\\right)"], "区域是直积矩形，相关积分存在。", "一般区域或一般被积函数不能这样拆成两个一元积分。", "高数14"),
    card("double-area", "高等数学", "二重积分", pending, "二重积分与面积", "区域 $D$ 的面积怎样由二重积分表达？", ["S_D=\\iint_D1\\,\\mathrm{d}\\sigma"], "区域面积有限且可积。", "若要求质量、形心等，应把 $1$ 换为相应面密度或加权函数。", "高数14"),

    card("ode-terms", "高等数学", "微分方程", pending, "微分方程的基本术语", "什么是阶、通解、特解与初始条件？", ["F(x,y,y',\\ldots,y^{(n)})=0"], "最高阶导数的阶数是方程的阶。", "通解含任意常数；代入初始条件后得到满足条件的特解。", "高数15"),
    card("ode-separable", "高等数学", "微分方程", pending, "可分离变量方程", "若 $y'=X(x)Y(y)$，基本解法是什么？", ["\\frac{\\mathrm{d}y}{Y(y)}=X(x)\\,\\mathrm{d}x\\quad\\Longrightarrow\\quad\\int\\frac{\\mathrm{d}y}{Y(y)}=\\int X(x)\\,\\mathrm{d}x+C"], "先单独检查被除掉的 $Y(y)=0$ 是否给出常值解。", "分离变量后两边分别积分；不能遗漏可能被约掉的特解。", "高数15"),
    card("ode-homogeneous-first", "高等数学", "微分方程", pending, "一阶齐次微分方程", "若 $y'=F(y/x)$，应作什么代换？", ["y=ux,\\qquad y'=u+x\\frac{\\mathrm{d}u}{\\mathrm{d}x}"], "方程右端只依赖于 $y/x$ 或可化为该形式。", "代换后把 $y'$ 同时改写，通常得到可分离变量方程。", "高数15"),
    card("ode-linear-first", "高等数学", "微分方程", pending, "一阶线性方程", "怎样解 $y'+P(x)y=Q(x)$？", ["\\mu(x)=e^{\\int P(x)\\,\\mathrm{d}x},\\qquad y=\\frac{\\int\\mu(x)Q(x)\\,\\mathrm{d}x+C}{\\mu(x)}"], "系数在所考察区间内连续。", "先乘积分因子把左边化为 $(\\mu y)'$，不要把 $\\mu$ 漏乘到 $Q$。", "高数15"),
    card("ode-reducible-x", "高等数学", "微分方程", pending, "二阶可降阶：$y''=f(x)$", "右端只含 $x$ 时怎么降阶？", ["y'=\\int f(x)\\,\\mathrm{d}x+C_1,\\qquad y=\\iint f(x)\\,\\mathrm{d}x\\,\\mathrm{d}x+C_1x+C_2"], "右端可积。", "需要两次积分，因此通解含两个独立常数。", "高数15"),
    card("ode-reducible-y", "高等数学", "微分方程", pending, "二阶可降阶：$y''=f(y)$", "右端只含 $y$ 时常用什么操作？", ["y''y'=f(y)y'\\quad\\Longrightarrow\\quad\\frac12(y')^2=\\int f(y)\\,\\mathrm{d}y+C"], "把方程两边乘 $y'$ 后积分。", "此后再分离变量；注意根号正负支和初始条件。", "高数15"),
    card("ode-characteristic", "高等数学", "微分方程", pending, "二阶常系数齐次方程", "如何由特征方程求 $y''+py'+qy=0$ 的通解？", ["r^2+pr+q=0"], "先解特征方程，再按根的类型写基础解组。", "不是直接把 $r$ 当作 $y$；$r$ 是试探解 $e^{rx}$ 的指数。", "高数15"),
    card("ode-roots", "高等数学", "微分方程", pending, "特征根的三种通解", "不同实根、重根、共轭复根时通解是什么？", ["r_1\\ne r_2:\\ y=C_1e^{r_1x}+C_2e^{r_2x}", "r:\\ y=(C_1+C_2x)e^{rx}", "\\alpha\\pm\\beta i:\\ y=e^{\\alpha x}(C_1\\cos\\beta x+C_2\\sin\\beta x)"], "对应二阶常系数齐次方程。", "重根必须乘 $x$；复根的三角函数角频率是 $\\beta$。", "高数15"),
    card("ode-nonhomogeneous", "高等数学", "微分方程", pending, "非齐次线性方程的结构", "非齐次方程的通解如何由齐次解与特解构成？", ["y=y_h+y_p"], "线性非齐次方程，$y_h$ 为对应齐次通解，$y_p$ 为任一特解。", "不能把两个“通解”相加；非齐次部分只需找一个特解。", "高数15"),
    card("ode-undetermined", "高等数学", "微分方程", pending, "待定系数法的共振处理", "试探特解与齐次解重合时，怎样修正试探式？", ["y_p^*=x^s y_p"], "取 $s$ 为重合特征根的重数，使修正后与齐次解线性无关。", "不修正会得到已包含在齐次通解中的项，无法确定待定系数。", "高数15"),
    card("ode-exponential-model", "高等数学", "微分方程", pending, "指数增长与衰减模型", "若变化率与当前量成正比，方程与解是什么？", ["\\frac{\\mathrm{d}y}{\\mathrm{d}x}=ky\\quad\\Longrightarrow\\quad y=Ce^{kx}"], "$k$ 为常数；初始条件确定 $C$。", "$k>0$ 为增长，$k<0$ 为衰减。", "高数15")
  );

  cards.push(
    card("determinant-triangular", "线性代数", "行列式", pending, "三角行列式", "上、下三角行列式如何计算？", ["\\det A=\\prod_{i=1}^na_{ii}"], "矩阵为上三角或下三角。", "只有主对角线相乘，不需要展开。", "线代1"),
    card("determinant-row-ops", "线性代数", "行列式", pending, "行列式的三种行变换", "交换、倍乘、倍加对行列式各有什么影响？", ["R_i\\leftrightarrow R_j:\\ \\det\\text{变号}", "R_i\\leftarrow kR_i:\\ \\det\\text{乘 }k", "R_i\\leftarrow R_i+kR_j:\\ \\det\\text{不变}"], "列变换有完全对应的结论。", "矩阵初等变换和行列式数值变化不能混为一谈。", "线代1"),
    card("determinant-product", "线性代数", "行列式", pending, "行列式乘法性质", "写出转置、乘积、逆矩阵的行列式关系。", ["|A^T|=|A|,\\qquad|AB|=|A||B|,\\qquad|A^{-1}|=\\frac1{|A|}"], "逆矩阵式要求 $|A|\\ne0$。", "一般 $AB\\ne BA$，但 $|AB|=|BA|$ 都等于 $|A||B|$。", "线代1"),
    card("determinant-cofactor", "线性代数", "行列式", pending, "代数余子式展开", "沿第 $i$ 行展开行列式的公式是什么？", ["|A|=\\sum_{j=1}^na_{ij}A_{ij},\\qquad A_{ij}=(-1)^{i+j}M_{ij}"], "可沿任一行或任一列展开。", "余子式 $M_{ij}$ 与代数余子式 $A_{ij}$ 只差符号因子。", "线代1"),
    card("determinant-inverse", "线性代数", "行列式", pending, "伴随矩阵与逆矩阵", "可逆矩阵的伴随矩阵公式是什么？", ["A^{-1}=\\frac1{|A|}A^*"], "要求 $|A|\\ne0$。", "$A^*$ 是伴随矩阵，不是普通转置；公式顺序不能写反。", "线代1"),
    card("determinant-cramer", "线性代数", "行列式", pending, "克拉默法则", "方阵方程组 $Ax=b$ 何时可用克拉默法则？", ["|A|\\ne0\\quad\\Longrightarrow\\quad x_i=\\frac{|A_i|}{|A|}"], "系数矩阵为 $n\\times n$，且 $|A|\\ne0$。", "第 $i$ 列替换为常数列得到 $A_i$，不是替换第 $i$ 行。", "线代1"),

    card("matrix-multiplication", "线性代数", "矩阵", pending, "矩阵乘法的维数", "$A_{m\\times n}B_{?\\times?}$ 何时有定义，结果维数是什么？", ["A_{m\\times n}B_{n\\times p}=C_{m\\times p}"], "左矩阵列数等于右矩阵行数。", "矩阵乘法通常不可交换；维数不符时 $AB$ 根本无定义。", "线代2"),
    card("matrix-inverse-condition", "线性代数", "矩阵", pending, "可逆的等价判据", "方阵 $A$ 可逆最常用的三个等价条件是什么？", ["A\\ \\text{可逆}\\iff|A|\\ne0\\iff r(A)=n"], "只针对 $n$ 阶方阵。", "非方阵没有通常意义下的双侧逆矩阵。", "线代2"),
    card("matrix-inverse-product", "线性代数", "矩阵", pending, "逆矩阵的运算", "写出乘积、转置、数乘的逆矩阵公式。", ["(AB)^{-1}=B^{-1}A^{-1},\\qquad(A^T)^{-1}=(A^{-1})^T,\\qquad(kA)^{-1}=\\frac1kA^{-1}"], "相关矩阵都可逆，且 $k\\ne0$。", "乘积取逆顺序反转。", "线代2"),
    card("matrix-rank", "线性代数", "矩阵", pending, "秩的定义与初等变换", "矩阵秩如何从初等变换后的标准形读取？", ["r(A)=\\text{A 的非零行阶梯数}"], "初等行、列变换不改变矩阵秩。", "秩不是非零元素个数，也不是矩阵行列式的绝对值。", "线代2"),
    card("matrix-rank-inequalities", "线性代数", "矩阵", pending, "矩阵秩的常用不等式", "写出 $AB$ 与 $A+B$ 的秩不等式。", ["r(AB)\\le\\min\\{r(A),r(B)\\},\\qquad r(A+B)\\le r(A)+r(B)"], "矩阵维数可运算。", "一般没有 $r(AB)=r(A)r(B)$；秩不会按普通数相乘。", "线代2"),
    card("matrix-elementary", "线性代数", "矩阵", pending, "初等矩阵的作用", "左乘、右乘初等矩阵分别对应什么？", ["E A:\\ \\text{对 }A\\text{ 作初等行变换},\\qquad A E:\\ \\text{对 }A\\text{ 作初等列变换}"], "$E$ 是与某一次初等变换对应的初等矩阵。", "左乘改行，右乘改列。", "线代2"),
    card("matrix-similar-congruent", "线性代数", "矩阵", pending, "相似与合同的区分", "相似、合同变换分别是什么？", ["B=P^{-1}AP\\quad\\text{(相似)},\\qquad B=C^TAC\\quad\\text{(合同)}"], "$P,C$ 都应可逆。", "相似主要服务特征结构；合同主要服务二次型与正定性。", "线代2"),

    card("vector-dependence", "线性代数", "向量组", pending, "线性相关与无关", "向量组何时线性无关？", ["k_1\\alpha_1+\\cdots+k_s\\alpha_s=0\\ \\Longrightarrow\\ k_1=\\cdots=k_s=0"], "讨论齐次线性组合。", "存在非零系数解即线性相关。", "线代3"),
    card("vector-rank", "线性代数", "向量组", pending, "向量组的秩", "向量组的秩是什么？", ["r(\\alpha_1,\\ldots,\\alpha_s)=\\text{该向量组成极大无关组所含向量个数}"], "把向量作为矩阵列（或行）可转为矩阵秩计算。", "极大无关组未必唯一，但其向量个数唯一。", "线代3"),
    card("vector-basis", "线性代数", "向量组", pending, "基与坐标的唯一性", "向量组何时成为 $n$ 维空间的一组基？", ["\\alpha_1,\\ldots,\\alpha_n\\ \\text{线性无关}\\iff\\text{它们构成 }n\\text{ 维空间的一组基}"], "需要恰有 $n$ 个 $n$ 维向量。", "基既要能张成空间，又要线性无关。", "线代3"),
    card("vector-representation", "线性代数", "向量组", pending, "可表示与唯一表示", "向量 $\\beta$ 可由无关向量组线性表示时，表示是否唯一？", ["\\beta=k_1\\alpha_1+\\cdots+k_s\\alpha_s"], "当 $\\alpha_1,\\ldots,\\alpha_s$ 线性无关时，若表示存在则唯一。", "相关向量组的表示可能不唯一；“能表示”不等于“唯一表示”。", "线代3"),
    card("vector-matrix-rank", "线性代数", "向量组", pending, "向量组与矩阵秩", "把 $\\alpha_1,\\ldots,\\alpha_s$ 排成列矩阵 $A$，二者的秩关系是什么？", ["r(\\alpha_1,\\ldots,\\alpha_s)=r(A)"], "向量维数一致。", "列向量组的相关性可直接转化为矩阵列的秩问题。", "线代3")
  );

  cards.push(
    card("system-rank-criterion", "线性代数", "线性方程组", pending, "解存在的秩判据", "非齐次方程组 $Ax=b$ 何时有解？", ["r(A)=r(\\bar A)"], "$\\bar A=(A\\mid b)$ 为增广矩阵。", "若两秩不等，方程组无解；不要继续讨论自由变量。", "线代4"),
    card("system-unique-infinite", "线性代数", "线性方程组", pending, "唯一解与无穷多解", "有解时，未知数个数为 $n$，怎样区分唯一解与无穷多解？", ["r(A)=r(\\bar A)=n\\Rightarrow\\text{唯一解}", "r(A)=r(\\bar A)<n\\Rightarrow\\text{无穷多解}"], "方程组先满足有解条件。", "自由变量数是 $n-r(A)$。", "线代4"),
    card("system-homogeneous", "线性代数", "线性方程组", pending, "齐次方程组的非零解", "$Ax=0$ 何时有非零解？", ["Ax=0\\ \\text{有非零解}\\iff r(A)<n"], "$n$ 是未知数个数。", "齐次方程组总有零解；题目问非零解时才用秩小于未知数个数。", "线代4"),
    card("system-solution-structure", "线性代数", "线性方程组", pending, "非齐次解的结构", "若 $x_p$ 是 $Ax=b$ 的一个特解，通解如何表示？", ["x=x_p+x_h,\\qquad Ax_h=0"], "方程组有解。", "任意两个非齐次特解之差是对应齐次方程的解。", "线代4"),
    card("system-coefficient-vectors", "线性代数", "线性方程组", pending, "方程组与列向量表示", "$Ax=b$ 的可解性在列向量语言中是什么意思？", ["b\\in\\mathrm{span}\\{\\alpha_1,\\ldots,\\alpha_n\\}"], "$A=(\\alpha_1,\\ldots,\\alpha_n)$。", "这把方程组是否有解转化为常数列是否可由系数列线性表示。", "线代4"),

    card("eigen-definition", "线性代数", "特征值与相似", pending, "特征值与特征向量", "定义 $A\\alpha=\\lambda\\alpha$ 中各对象的要求。", ["A\\alpha=\\lambda\\alpha,\\qquad\\alpha\\ne0"], "$\\lambda$ 为特征值，$\\alpha$ 为对应非零特征向量。", "零向量不能作为特征向量。", "线代5"),
    card("eigen-characteristic", "线性代数", "特征值与相似", pending, "特征方程", "怎样由行列式求特征值？", ["|\\lambda E-A|=0"], "$A$ 为 $n$ 阶方阵。", "特征值是特征多项式的根；不要把 $\\lambda E-A$ 当成普通数相减。", "线代5"),
    card("eigen-trace-det", "线性代数", "特征值与相似", pending, "特征值的和与积", "若 $\\lambda_1,\\ldots,\\lambda_n$ 计重数，和与积分别是什么？", ["\\sum_{i=1}^n\\lambda_i=\\operatorname{tr}(A),\\qquad\\prod_{i=1}^n\\lambda_i=|A|"], "$A$ 为 $n$ 阶方阵，特征值按代数重数计。", "迹是主对角线元素和；不要把它误当作矩阵秩。", "线代5"),
    card("eigen-eigenspace", "线性代数", "特征值与相似", pending, "特征子空间", "求特征值 $\\lambda$ 对应特征向量的核心方程是什么？", ["(\\lambda E-A)x=0"], "解空间去掉零向量后的非零向量都是特征向量。", "先求特征值，再代入齐次方程；每个特征值单独求解。", "线代5"),
    card("eigen-similarity-invariants", "线性代数", "特征值与相似", pending, "相似矩阵的不变量", "相似矩阵一定共享哪些常用量？", ["A\\sim B\\Longrightarrow |A|=|B|,\\ \\operatorname{tr}(A)=\\operatorname{tr}(B),\\ \\text{特征值相同}"], "相似变换 $B=P^{-1}AP$。", "相似矩阵的元素、具体行列通常不相同；保存的是结构性量。", "线代5"),
    card("eigen-diagonalizable", "线性代数", "特征值与相似", pending, "可相似对角化的判据", "$n$ 阶矩阵何时可相似对角化？", ["A\\ \\text{可相似对角化}\\iff A\\ \\text{有 }n\\text{ 个线性无关的特征向量}"], "这些特征向量可组成可逆矩阵 $P$。", "有 $n$ 个不同特征值是充分条件，但不是必要条件。", "线代5"),
    card("eigen-symmetric", "线性代数", "特征值与相似", pending, "实对称矩阵的谱性质", "实对称矩阵最重要的三个结论是什么？", ["A=A^T\\Longrightarrow\\text{特征值全为实数，且不同特征值的特征向量正交}", "A=Q\\Lambda Q^T\\quad(Q^TQ=E)"], "$A$ 为实对称矩阵。", "正交对角化中 $Q^{-1}=Q^T$，比一般相似对角化更强。", "线代5"),
    card("eigen-powers", "线性代数", "特征值与相似", pending, "对角化计算矩阵幂", "若 $A=P\\Lambda P^{-1}$，如何计算 $A^m$？", ["A^m=P\\Lambda^mP^{-1}"], "$A$ 可相似对角化，$m$ 为非负整数。", "先把难算的 $A^m$ 转成对角矩阵幂；$\\Lambda^m$ 逐个对角元取幂。", "线代5"),

    card("quadratic-matrix", "线性代数", "二次型", pending, "二次型的矩阵表示", "二次型与对称矩阵怎样对应？", ["f(x_1,\\ldots,x_n)=x^TAx,\\qquad A=A^T"], "交叉项 $2a_{ij}x_ix_j$ 对应对称位置的两个 $a_{ij}$。", "交叉项系数要先除以 $2$ 才填入矩阵的非对角元。", "线代6"),
    card("quadratic-congruence", "线性代数", "二次型", pending, "合同变换", "变量替换 $x=Cy$ 后，二次型矩阵怎样变？", ["x^TAx=y^T(C^TAC)y"], "$C$ 可逆。", "这是合同 $C^TAC$，不是相似 $C^{-1}AC$。", "线代6"),
    card("quadratic-standard-normal", "线性代数", "二次型", pending, "标准形与规范形", "二次型化标准形、规范形的目标是什么？", ["f=\\lambda_1y_1^2+\\cdots+\\lambda_ny_n^2", "f=z_1^2+\\cdots+z_p^2-z_{p+1}^2-\\cdots-z_{p+q}^2"], "通过可逆线性变换化为对角型。", "规范形只保留正、负、零平方项的个数；标准形保留具体对角系数。", "线代6"),
    card("quadratic-inertia", "线性代数", "二次型", pending, "惯性定理", "实二次型的正、负惯性指数是否依赖所选合同变换？", ["p,q\\ \\text{在任意合同变换下保持不变}"], "讨论实二次型的规范形。", "标准形的具体系数可变，但正、负平方项个数不变。", "线代6"),
    card("quadratic-positive-definition", "线性代数", "二次型", pending, "正定二次型的定义", "二次型 $f(x)=x^TAx$ 正定是什么意思？", ["\\forall x\\ne0,\\qquad x^TAx>0"], "$A$ 取实对称矩阵。", "只要求“存在某个非零 $x$ 为正”不够；必须对所有非零向量为正。", "线代6"),
    card("quadratic-positive-sylvester", "线性代数", "二次型", pending, "顺序主子式判别法", "实对称矩阵 $A$ 正定的充要条件是什么？", ["\\Delta_1>0,\\ \\Delta_2>0,\\ \\ldots,\\ \\Delta_n>0"], "$\\Delta_k$ 是前 $k$ 阶顺序主子式，且 $A$ 为实对称矩阵。", "这是正定的 Sylvester 判别法；负定的符号交替，不要混用。", "线代6"),
    card("quadratic-positive-eigen", "线性代数", "二次型", pending, "特征值判别正定", "实对称矩阵何时正定？", ["A\\ \\text{正定}\\iff\\lambda_i>0\\quad(i=1,\\ldots,n)"], "$A$ 为实对称矩阵。", "该判据依赖对称性；一般矩阵的特征值正性不能直接替代二次型正定判定。", "线代6")
  );

}());
