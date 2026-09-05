import { defineExtra, r } from './types';

/**
 * 增补卡片：按 2025/2026 数学二大纲逐项对照后补足的知识点。
 * 只收数学二范围内容；伯努利方程、欧拉方程、全微分方程、无穷级数、方向导数等数一专属内容不收录。
 */

export const preX = defineExtra('pre', [
  {
    sec: '常见曲线', k: 'qa', s: 2,
    q: '极坐标下三条必背曲线：心形线、双纽线、阿基米德螺线的方程与图形特征',
    a: r`**心形线** $r=a(1+\cos\theta)$：关于极轴对称，过极点，$\theta=0$ 处 $r=2a$；面积 $\frac32\pi a^2$，全长 $8a$。
**双纽线** $r^2=a^2\cos2\theta$：两瓣「∞」形，仅在 $\cos2\theta\ge0$ 即 $\theta\in[-\frac\pi4,\frac\pi4]\cup[\frac{3\pi}4,\frac{5\pi}4]$ 有定义；一瓣面积 $\frac{a^2}2$。
**阿基米德螺线** $r=a\theta$（$\theta\ge0$）。`,
    trap: '双纽线积分时先确定 θ 的取值范围，漏掉 cos2θ≥0 会得到虚数半径。',
  },
  {
    sec: '常见曲线', k: 'qa', s: 2,
    q: '摆线、星形线的参数方程及一拱/一周的弧长、面积',
    a: r`**摆线** $x=a(t-\sin t),\ y=a(1-\cos t)$，$t\in[0,2\pi]$ 为一拱：弧长 $8a$，与 $x$ 轴围成面积 $3\pi a^2$。
**星形线** $x=a\cos^3t,\ y=a\sin^3t$（即 $x^{2/3}+y^{2/3}=a^{2/3}$）：全长 $6a$，面积 $\frac38\pi a^2$。`,
    hook: '摆线：8a 与 3πa²；星形线：6a 与 (3/8)πa²。',
  },
  {
    sec: '重要不等式', k: 'cloze', s: 2,
    q: r`常用不等式：当 $x>0$ 时 $⟦\dfrac{x}{1+x}⟧<\ln(1+x)<⟦x⟧$；当 $0<x<\dfrac\pi2$ 时 $⟦\dfrac{2}{\pi}x⟧<\sin x<x$；对任意 $x$，$e^x\ge ⟦1+x⟧$`,
    hook: '三条都来自「切线在下、弦在上」的凹凸性，或对 f(x)−g(x) 求导。',
  },
  {
    sec: '函数性质', k: 'qa', s: 2,
    q: '奇偶性、周期性的常见推论：导数与原函数的奇偶性、周期性如何传递？',
    a: r`- 可导奇函数的导数是**偶**函数；可导偶函数的导数是**奇**函数。
- 奇函数的任一原函数都是偶函数；偶函数**只有** $\int_0^x f(t)\,dt$ 这一个原函数是奇函数。
- 周期函数的导数仍是同周期函数；周期函数的原函数是周期函数 $\iff \int_0^T f(x)\,dx=0$。`,
    trap: r`偶函数的原函数不一定是奇函数，如 $\int\cos x\,dx=\sin x+C$，$C\ne0$ 时不是奇函数。`,
  },
]);

export const h1X = defineExtra('h1', [
  {
    sec: '数列极限', k: 'qa', s: 2,
    q: '海涅定理（归结原则）的内容及其在「证明极限不存在」中的用法',
    a: r`$\lim\limits_{x\to x_0}f(x)=A\iff$ 对任意满足 $x_n\ne x_0$、$x_n\to x_0$ 的数列 $\{x_n\}$，都有 $\lim\limits_{n\to\infty}f(x_n)=A$。
**用法**：找两个趋于 $x_0$ 的数列使 $f(x_n)$ 趋于不同值，即证函数极限不存在。如 $\lim\limits_{x\to0}\sin\frac1x$：取 $x_n=\frac1{n\pi}$ 与 $x_n=\frac1{2n\pi+\pi/2}$。`,
    hook: '函数极限 ⇄ 所有子路径上的数列极限。',
  },
  {
    sec: '极限计算', k: 'steps', s: 3,
    q: '求极限的通用顺序（七种未定式的处理流程）',
    a: r`1. 先化简：等价无穷小替换（乘除因子）、提出非零因子、有理化、变量代换。
2. 判断类型：$\frac00,\frac\infty\infty$ 直接洛必达或泰勒；$0\cdot\infty$ 化为分式；$\infty-\infty$ 通分或倒代换。
3. 幂指型 $1^\infty,0^0,\infty^0$：写成 $e^{v\ln u}$，其中 $1^\infty$ 可用 $e^{\lim(u-1)v}$。
4. 洛必达前确认可导且分母导数不为 0；出现循环或振荡时改用泰勒。
5. 数列极限：先用函数极限（洛必达不能直接对 n 用），或夹逼、单调有界、定积分定义。`,
    trap: '洛必达是充分条件：极限不存在（非∞）时不能反推原极限不存在。',
  },
  {
    sec: '无穷小与无穷大', k: 'judge', s: 2,
    q: r`无穷大量一定是无界变量；无界变量一定是无穷大量。`,
    a: r`✗ 前半句对，后半句错。$x_n=n\cdot\frac{1+(-1)^n}{2}$（即 $0,2,0,4,0,6,\dots$）无界但不是无穷大。无穷大要求「从某项起所有项」都很大。`,
  },
  {
    sec: '连续与间断', k: 'qa', s: 2,
    q: '一致连续与闭区间上连续函数的四条性质各是什么？（数二只需闭区间性质）',
    a: r`设 $f$ 在 $[a,b]$ 上连续：
① **有界性**；② **最值性**：存在最大值 $M$、最小值 $m$；
③ **介值性**：对 $m\le\mu\le M$，存在 $\xi$ 使 $f(\xi)=\mu$；
④ **零点定理**：$f(a)f(b)<0\Rightarrow\exists\xi\in(a,b),\ f(\xi)=0$。`,
    hook: '证 f(ξ)=某值 → 介值/零点；证 f(ξ)=平均值 → 先用最值性夹住再用介值性。',
  },
  {
    sec: '等价无穷小', k: 'cloze', s: 3,
    q: r`$x\to0$ 时的「差型」等价无穷小：$x-\sin x\sim⟦\dfrac{x^3}{6}⟧$，$\tan x-x\sim⟦\dfrac{x^3}{3}⟧$，$x-\ln(1+x)\sim⟦\dfrac{x^2}{2}⟧$，$\arcsin x-x\sim⟦\dfrac{x^3}{6}⟧$，$x-\arctan x\sim⟦\dfrac{x^3}{3}⟧$`,
    hook: '全部来自泰勒展开的第二项；sin/arcsin 系数 1/6，tan/arctan 系数 1/3，正负号看谁大。',
    trap: r`$\tan x-\sin x\sim\frac{x^3}{2}$（不是两者之差再相减为 0）。`,
  },
]);

export const h2X = defineExtra('h2', [
  {
    sec: '曲率', k: 'cloze', s: 2,
    q: r`曲率公式：$y=y(x)$ 时 $K=⟦\dfrac{|y''|}{(1+y'^2)^{3/2}}⟧$；参数方程时 $K=⟦\dfrac{|x'y''-x''y'|}{(x'^2+y'^2)^{3/2}}⟧$；曲率半径 $\rho=⟦\dfrac1K⟧$`,
    hook: '分子二阶、分母一阶的 3/2 次方。曲率圆圆心在法线上凹侧，距离 ρ。',
    trap: '曲率是几何量（非负），求曲率半径别忘记绝对值。',
  },
  {
    sec: '导数应用', k: 'cloze', s: 2,
    q: r`弧微分：直角坐标 $ds=⟦\sqrt{1+y'^2}\,dx⟧$；参数方程 $ds=⟦\sqrt{x'^2(t)+y'^2(t)}\,dt⟧$；极坐标 $ds=⟦\sqrt{r^2+r'^2}\,d\theta⟧$`,
    hook: '三种形式都是「勾股定理」：(ds)² = (dx)² + (dy)²。',
  },
  {
    sec: '导数应用', k: 'steps', s: 2,
    q: '相关变化率问题的标准解法',
    a: r`1. 设出随时间变化的量 $x(t),y(t)$，写出它们之间的几何/物理关系式 $F(x,y)=0$。
2. 关系式两边对 $t$ 求导（隐函数求导），得到 $\frac{dx}{dt}$ 与 $\frac{dy}{dt}$ 的关系。
3. 代入题设时刻的各量值与已知变化率，解出待求变化率。`,
    trap: '先求导再代数值；如果先代数值再求导，变量就被固定成常数了。',
  },
  {
    sec: '中值定理', k: 'steps', s: 3,
    q: '「证明存在 ξ 使等式成立」的辅助函数构造思路',
    a: r`1. 把待证式中的 $\xi$ 换成 $x$，整理成 $[F(x)]'=0$ 的形式，对 $F$ 用罗尔定理。
2. 常见配对：$f'+f=0\to(e^xf)'$；$f'-\lambda f=0\to(e^{-\lambda x}f)'$；$xf'+f=0\to(xf)'$；$xf'-f=0\to(\frac fx)'$；$f'g-fg'=0\to(\frac fg)'$。
3. 出现两个中值 $\xi,\eta$：分别在同一或不同区间用两次拉格朗日/柯西。
4. 出现 $f''(\xi)$ 且给出 $f$ 在三点的值：两次罗尔，或用泰勒展开到二阶。`,
    hook: '看到 f′(ξ)+g′(ξ)f(ξ)=0，乘以 e^{∫g} 就是导数为零。',
  },
  {
    sec: '中值定理', k: 'cloze', s: 3,
    q: r`带拉格朗日余项的泰勒公式：$f(x)=\sum\limits_{k=0}^{n}\dfrac{f^{(k)}(x_0)}{k!}(x-x_0)^k+⟦\dfrac{f^{(n+1)}(\xi)}{(n+1)!}(x-x_0)^{n+1}⟧$，$\xi$ 介于 $x_0$ 与 $x$ 之间；佩亚诺余项则写作 $⟦o((x-x_0)^n)⟧$`,
    hook: '算极限用佩亚诺（局部）；证不等式或估计误差用拉格朗日（整体）。',
  },
  {
    sec: '单调与极值', k: 'steps', s: 2,
    q: '判断方程 f(x)=0 实根个数的标准步骤',
    a: r`1. 求 $f'(x)$，找驻点与不可导点，划分单调区间。
2. 求各单调区间端点处的极限或函数值（含 $\pm\infty$ 处）。
3. 每个单调区间内，若端点值异号（或一端为 $\pm\infty$ 且另一端异号），恰有一个根；同号则无根。
4. 含参数时，讨论参数使极值与 0 的大小关系变化。`,
    trap: '别忘记检查区间端点处的极限（如 x→+∞ 时 f→0⁻ 就不能算作跨越零点）。',
  },
]);

export const h3X = defineExtra('h3', [
  {
    sec: '定积分应用', k: 'cloze', s: 3,
    q: r`平面曲线弧长：$y=f(x),\ a\le x\le b$：$s=⟦\displaystyle\int_a^b\sqrt{1+f'^2(x)}\,dx⟧$；参数方程：$s=⟦\displaystyle\int_\alpha^\beta\sqrt{x'^2(t)+y'^2(t)}\,dt⟧$；极坐标 $r=r(\theta)$：$s=⟦\displaystyle\int_\alpha^\beta\sqrt{r^2(\theta)+r'^2(\theta)}\,d\theta⟧$`,
    hook: '弧长 = ∫ds，ds 由勾股定理给出。',
  },
  {
    sec: '定积分应用', k: 'cloze', s: 2,
    q: r`曲线 $y=f(x)\ge0$（$a\le x\le b$）绕 $x$ 轴旋转所得**侧面积** $S=⟦2\pi\displaystyle\int_a^b f(x)\sqrt{1+f'^2(x)}\,dx⟧$；参数方程时 $S=2\pi\displaystyle\int_\alpha^\beta ⟦|y(t)|\sqrt{x'^2+y'^2}⟧\,dt$`,
    hook: '侧面积 = ∫2πy·ds（圆周长 × 弧微分），不是 ∫2πy dx。',
    trap: '旋转体体积用 dx（薄圆盘），侧面积必须用 ds，否则漏掉斜率贡献。',
  },
  {
    sec: '定积分应用', k: 'qa', s: 2,
    q: '定积分的物理应用：变力做功、液体静压力、引力的微元表达式',
    a: r`**变力做功**：$W=\displaystyle\int_a^b F(x)\,dx$；抽水做功：$dW=\rho g\cdot(\text{提升高度})\cdot A(y)\,dy$。
**液体静压力**：深度 $h$ 处压强 $p=\rho gh$，竖直薄板宽 $w(h)$：$P=\displaystyle\int\rho g\,h\,w(h)\,dh$。
**引力**：细棒对质点，微元 $dF=\dfrac{Gm\,\rho\,dx}{r^2}$，先按方向分解再积分。`,
    hook: '微元法三步：取微段 → 把它当匀质/常力写 dW、dP、dF → 积分。',
    trap: '压力题深度从液面算起，不是从板顶算；抽水题提升高度是「液面到出口」的距离。',
  },
  {
    sec: '定积分应用', k: 'cloze', s: 2,
    q: r`平面薄片（由 $y=f(x)\ge0$、$x=a,b$ 与 $x$ 轴围成，密度均匀）的形心：$\bar x=⟦\dfrac{\int_a^b xf(x)\,dx}{\int_a^b f(x)\,dx}⟧$，$\bar y=⟦\dfrac{\frac12\int_a^b f^2(x)\,dx}{\int_a^b f(x)\,dx}⟧$`,
    hook: '分母是面积，分子是对 x、y 的「一阶矩」；ȳ 分子的 1/2 来自每根细条的中点高度 f/2。',
  },
  {
    sec: '定积分应用', k: 'cloze', s: 2,
    q: r`函数 $f(x)$ 在 $[a,b]$ 上的平均值 $\bar f=⟦\dfrac1{b-a}\displaystyle\int_a^b f(x)\,dx⟧$；极坐标曲线 $r=r(\theta)$（$\alpha\le\theta\le\beta$）围成的扇形面积 $A=⟦\dfrac12\displaystyle\int_\alpha^\beta r^2(\theta)\,d\theta⟧$`,
    trap: '极坐标面积的 1/2 与 r² 都容易丢；先画图确定 θ 范围再积分。',
  },
  {
    sec: '定积分计算', k: 'cloze', s: 3,
    q: r`华里士（Wallis）公式：$I_n=\displaystyle\int_0^{\pi/2}\sin^nx\,dx=\int_0^{\pi/2}\cos^nx\,dx=$ 当 $n$ 为偶数时 $⟦\dfrac{n-1}{n}\cdot\dfrac{n-3}{n-2}\cdots\dfrac12\cdot\dfrac\pi2⟧$，当 $n$ 为奇数时 $⟦\dfrac{n-1}{n}\cdot\dfrac{n-3}{n-2}\cdots\dfrac23\cdot1⟧$`,
    hook: '偶数「到 1/2 乘 π/2」，奇数「到 2/3 乘 1」。',
    trap: r`积分区间为 $[0,\pi]$ 时：$\sin^n$ 是 $2I_n$；$\cos^n$ 偶数为 $2I_n$、奇数为 0。区间 $[0,2\pi]$ 时两者偶数均为 $4I_n$，奇数均为 0。`,
  },
  {
    sec: '反常积分', k: 'cloze', s: 2,
    q: r`两类反常积分的敛散判据（$p$ 积分）：$\displaystyle\int_a^{+\infty}\dfrac{dx}{x^p}$（$a>0$）当 $⟦p>1⟧$ 时收敛；$\displaystyle\int_0^a\dfrac{dx}{x^p}$ 当 $⟦p<1⟧$ 时收敛；$\displaystyle\int_2^{+\infty}\dfrac{dx}{x\ln^p x}$ 当 $⟦p>1⟧$ 时收敛`,
    hook: '无穷远处要「衰减快」（p 大），奇点处要「爆得慢」（p 小）。',
    trap: r`$\int_{-\infty}^{+\infty}f\,dx$ 收敛要求两半各自收敛，不能只算对称极限 $\lim_{A\to\infty}\int_{-A}^{A}$。`,
  },
]);

export const h4X = defineExtra('h4', [
  {
    sec: '偏导与全微分', k: 'qa', s: 3,
    q: '二元函数在一点处：连续、偏导存在、可微、偏导连续四者的蕴含关系',
    a: r`偏导数连续 $\Rightarrow$ 可微 $\Rightarrow$ 连续，且可微 $\Rightarrow$ 偏导存在。
其余方向均不成立：偏导存在推不出连续（如 $f=\frac{xy}{x^2+y^2}$ 在原点），连续推不出偏导存在（如 $\sqrt{x^2+y^2}$）。`,
    hook: '「偏连 → 可微 → 连续 & 偏存」，一条主链加一个分叉。',
    trap: '一元函数「可导⇔可微」，二元函数偏导存在远弱于可微，这是最常考的概念题。',
  },
  {
    sec: '偏导与全微分', k: 'steps', s: 3,
    q: '按定义判定 f(x,y) 在 (0,0) 处是否可微的步骤',
    a: r`1. 先算 $f_x(0,0)=\lim\limits_{x\to0}\frac{f(x,0)-f(0,0)}{x}$、$f_y(0,0)$，任一不存在则不可微。
2. 计算 $\lim\limits_{(x,y)\to(0,0)}\dfrac{f(x,y)-f(0,0)-f_x(0,0)x-f_y(0,0)y}{\sqrt{x^2+y^2}}$。
3. 若极限为 0 则可微；若不为 0 或不存在（常取 $y=kx$ 路径得到与 $k$ 有关的值）则不可微。`,
    trap: '第 2 步的分母是 ρ=√(x²+y²)，不是 x 或 y。',
  },
  {
    sec: '极值', k: 'steps', s: 3,
    q: '拉格朗日乘数法求条件极值的完整流程',
    cond: r`$f,\varphi$ 一阶连续偏导，且可疑点处 $\nabla\varphi\ne\mathbf 0$；多约束时要求各约束梯度线性无关。`,
    a: r`1. 构造 $L(x,y,\lambda)=f(x,y)+\lambda\varphi(x,y)$（约束 $\varphi=0$；多个约束加多个乘子）。
2. 解方程组 $L_x=0,\ L_y=0,\ L_\lambda=\varphi=0$，得到所有可疑点。
3. 由问题的实际意义或比较各可疑点函数值确定最大/最小值（不做二阶判别）。
4. 若约束可显式解出，也可直接代入化为一元极值问题。`,
    hook: '解方程组时常用「两式相除消 λ」或「分别乘 x、y 再相加」。',
    trap: '拉格朗日只给必要条件；有界闭区域最值还要比较区域内部驻点与边界上的条件极值。',
  },
  {
    sec: '复合函数求导', k: 'qa', s: 3,
    q: r`设 $z=f(u,v)$，$u=u(x,y),\ v=v(x,y)$，$f$ 具有二阶连续偏导。写出 $\dfrac{\partial z}{\partial x}$ 与 $\dfrac{\partial^2 z}{\partial x\partial y}$，并说明记号 $f_1',f_{12}''$ 的含义`,
    a: r`$\dfrac{\partial z}{\partial x}=f_1'u_x+f_2'v_x$。
$\dfrac{\partial^2z}{\partial x\partial y}=(f_{11}''u_y+f_{12}''v_y)u_x+f_1'u_{xy}+(f_{21}''u_y+f_{22}''v_y)v_x+f_2'v_{xy}$。
$f_1'$ 表示 $f$ 对第一个中间变量的偏导；$f_{12}''=f_{21}''$（二阶连续偏导时）。`,
    trap: r`对 $f_1'$ 再求导时，它仍是 $u,v$ 的复合函数，必须再走一遍链式法则——最常见的失分点。`,
  },
]);

export const h5X = defineExtra('h5', [
  {
    sec: '概念与性质', k: 'cloze', s: 2,
    q: r`二重积分中值定理：若 $f$ 在有界闭区域 $D$ 上连续，$D$ 面积为 $\sigma$，则存在 $(\xi,\eta)\in D$ 使 $\displaystyle\iint_D f\,d\sigma=⟦f(\xi,\eta)\,\sigma⟧$；估值：$m\sigma\le\iint_Df\,d\sigma\le ⟦M\sigma⟧$`,
    hook: '与一元积分中值定理完全类比：积分 = 平均值 × 区域大小。',
  },
  {
    sec: '极坐标', k: 'qa', s: 3,
    q: '什么情况下二重积分优先选用极坐标？极坐标下面积元素与常见区域的 r 范围',
    a: r`**优先极坐标**：被积函数含 $x^2+y^2$、$\frac yx$；积分区域是圆、圆环、扇形或由 $x^2+y^2=2ax$ 等圆围成。
面积元素 $d\sigma=r\,dr\,d\theta$。
常见边界：$x^2+y^2=a^2\Rightarrow r=a$；$x^2+y^2=2ax\Rightarrow r=2a\cos\theta$（$-\frac\pi2\le\theta\le\frac\pi2$）；$x^2+y^2=2ay\Rightarrow r=2a\sin\theta$（$0\le\theta\le\pi$）。`,
    trap: '极坐标下 dσ 多一个 r；直角坐标积分限中出现 √(a²−x²) 时通常提示改用极坐标。',
  },
  {
    sec: '计算技巧', k: 'steps', s: 3,
    q: '交换二次积分次序的操作步骤',
    a: r`1. 由内外积分限写出区域 $D$ 的不等式表示，画出 $D$ 的草图。
2. 按新的积分顺序重新描述 $D$：外层变量取常数范围，内层变量用外层变量的函数表示上下限。
3. 若 $D$ 不是单一的 X 型/Y 型区域，则先分块再分别写出。
4. 极坐标与直角坐标互换时，同样先画图，再由图写限。`,
    hook: '「先画图，后写限」。内层上下限一定是外层变量的函数或常数，绝不能含内层变量。',
  },
  {
    sec: '对称性', k: 'qa', s: 3,
    q: '二重积分的轮换对称性是什么？举一个典型用法',
    a: r`若区域 $D$ 关于直线 $y=x$ 对称（即 $(x,y)\in D\Rightarrow(y,x)\in D$），则
$$\iint_Df(x,y)\,d\sigma=\iint_Df(y,x)\,d\sigma.$$
**典型用法**：$I=\iint_D\frac{af(x)+bf(y)}{f(x)+f(y)}d\sigma$，与轮换后的式子相加得 $2I=(a+b)\sigma(D)$。`,
    trap: '轮换对称性要求区域关于 y=x 对称，与被积函数无关；奇偶对称性要求区域关于坐标轴对称。',
  },
]);

export const h6X = defineExtra('h6', [
  {
    sec: '可降阶方程', k: 'qa', s: 3,
    q: '三类可降阶高阶方程的形式与降阶方法',
    a: r`① $y^{(n)}=f(x)$：逐次积分 $n$ 次。
② $y''=f(x,y')$（**不显含 $y$**）：令 $y'=p(x)$，则 $y''=p'$，化为关于 $p$ 的一阶方程。
③ $y''=f(y,y')$（**不显含 $x$**）：令 $y'=p(y)$，则 $y''=p\dfrac{dp}{dy}$，化为关于 $p(y)$ 的一阶方程。`,
    hook: '缺 y 则 p 是 x 的函数；缺 x 则 p 是 y 的函数，且 y″=p·dp/dy。',
    trap: '第③类若同时缺 x、y，两种换元都可用，通常选 y′=p(y) 更简洁；别忘记 p=0（即 y=C）这种特解。',
  },
  {
    sec: '常系数齐次', k: 'qa', s: 2,
    q: 'n 阶常系数齐次线性方程：特征根与通解基本项的对应关系（含重根与复根）',
    a: r`| 特征根 | 对应通解项 |
| 单实根 $r$ | $Ce^{rx}$ |
| $k$ 重实根 $r$ | $(C_1+C_2x+\cdots+C_kx^{k-1})e^{rx}$ |
| 单复根 $\alpha\pm\beta i$ | $e^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x)$ |
| $k$ 重复根 $\alpha\pm\beta i$ | $e^{\alpha x}[(C_1+\cdots+C_kx^{k-1})\cos\beta x+(D_1+\cdots+D_kx^{k-1})\sin\beta x]$ |`,
    hook: '重根就乘 x 的幂；复根就换成 e^{αx}(cos, sin)。',
  },
  {
    sec: '线性方程理论', k: 'steps', s: 2,
    q: '已知微分方程的通解（或若干特解），反求二阶常系数线性方程的步骤',
    a: r`1. 从齐次部分（含任意常数的项）读出特征根 $r_1,r_2$，写出特征方程 $(r-r_1)(r-r_2)=0$，得到 $y''+py'+qy$ 的左端。
2. 若给的是非齐次方程的特解 $y_1,y_2,y_3$，则 $y_1-y_2$、$y_1-y_3$ 是齐次解，先据此得到齐次通解。
3. 把某一特解 $y^*$ 代入左端算出右端 $f(x)$。`,
    trap: r`若给出 $y=C_1e^{x}+C_2e^{2x}+xe^{x}$，$xe^x$ 是非齐次特解而不是重根项；因为 $e^x$ 只对应单根。`,
  },
  {
    sec: '一阶方程', k: 'steps', s: 3,
    q: '一阶方程识别与求解顺序',
    a: r`1. 能否分离变量 $g(y)\,dy=f(x)\,dx$？能则直接积分。
2. 是否齐次 $y'=\varphi(\frac yx)$？令 $u=\frac yx$，则 $y'=u+xu'$。
3. 是否一阶线性 $y'+P(x)y=Q(x)$？通解 $y=e^{-\int P\,dx}\left(\int Qe^{\int P\,dx}\,dx+C\right)$。
4. 若对 $y$ 不线性但对 $x$ 线性，把 $x$ 视为 $y$ 的函数：$\dfrac{dx}{dy}+P(y)x=Q(y)$。`,
    hook: '分离 → 齐次 → 线性 → 反着看（x 作因变量）。',
    trap: '一阶线性公式中的 ∫P dx 不加常数；分离变量后别漏掉使 g(y)=0 的常数解。',
  },
  {
    sec: '应用', k: 'steps', s: 2,
    q: '用微分方程解决几何/物理应用题的建模步骤',
    a: r`1. 设未知函数（如曲线 $y=y(x)$、温度 $T(t)$、位移 $x(t)$）。
2. 利用几何意义（切线斜率 $y'$、法线、切线截距、曲边面积 $\int_0^x y\,dt$）或物理定律（牛顿第二定律 $m\frac{d^2x}{dt^2}=F$、冷却定律 $\frac{dT}{dt}=-k(T-T_0)$）列出方程。
3. 从题设读出初始条件，如「曲线过点 $(1,2)$」即 $y(1)=2$。
4. 求解并检验是否满足所有条件。`,
    trap: '含变限积分的方程先对 x 求导化成微分方程，同时由原式取 x=x₀ 得到初始条件。',
  },
]);

export const laX = defineExtra('l2', [
  {
    sec: '特殊矩阵', k: 'qa', s: 2,
    q: '正交矩阵的定义与四条常用性质',
    a: r`定义：$A^TA=AA^T=E$（等价于 $A^{-1}=A^T$，或 $A$ 的列/行向量组是标准正交组）。
性质：① $|A|=\pm1$；② $A^{-1}=A^T$ 也是正交矩阵，两正交矩阵之积仍正交；③ 实特征值只能是 $\pm1$；④ 保持内积与长度：$(Ax)^T(Ay)=x^Ty$，$\|Ax\|=\|x\|$。`,
    trap: '|A|=±1 是必要条件不是充分条件；单位向量组两两正交才叫标准正交组。',
  },
  {
    sec: '秩', k: 'cloze', s: 3,
    q: r`秩的重要不等式：$r(AB)\le⟦\min\{r(A),r(B)\}⟧$；$r(A+B)\le⟦r(A)+r(B)⟧$；若 $A_{m\times n}B_{n\times s}=O$，则 $r(A)+r(B)\le⟦n⟧$；$r(A^TA)=⟦r(A)⟧$`,
    hook: 'AB=O 说明 B 的列都是 Ax=0 的解，所以 r(B) ≤ n − r(A)。',
    trap: 'r(A^TA)=r(A) 只对实矩阵成立。',
  },
]);

export const l5X = defineExtra('l5', [
  {
    sec: '相似', k: 'steps', s: 3,
    q: '判断两个矩阵 A、B 是否相似的完整思路',
    a: r`1. 先看必要条件：$|A|=|B|$、$\operatorname{tr}A=\operatorname{tr}B$、$r(A)=r(B)$、特征值相同；任一不满足即不相似。
2. 若都可对角化且特征值相同，则都相似于同一对角阵，从而 $A\sim B$。
3. 若有重特征值 $\lambda$，比较 $r(A-\lambda E)$ 与 $r(B-\lambda E)$，不相等则不相似。
4. 实对称矩阵：特征值相同 $\iff$ 相似 $\iff$ 合同且相似。`,
    trap: '特征值相同不能推出相似（如单位阵与含约当块的矩阵）；但对实对称矩阵可以。',
  },
  {
    sec: '对角化', k: 'steps', s: 3,
    q: '实对称矩阵正交对角化的完整步骤',
    a: r`1. 解 $|\lambda E-A|=0$ 求全部特征值。
2. 对每个特征值求 $(\lambda E-A)x=0$ 的基础解系。
3. 对**重特征值**的基础解系做施密特正交化，再全部单位化（不同特征值的特征向量已自动正交）。
4. 以单位正交特征向量为列组成 $Q$，则 $Q^TAQ=Q^{-1}AQ=\Lambda$，$\Lambda$ 对角元按 $Q$ 列的顺序排列。`,
    hook: '只有重根对应的向量需要施密特；顺序一一对应。',
  },
]);

export const EXTRA_CARDS = [...preX, ...h1X, ...h2X, ...h3X, ...h4X, ...h5X, ...h6X, ...laX, ...l5X];
