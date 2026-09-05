import { defineChapter, r } from './types';

export const h3 = defineChapter('h3', [
  {
    sec: '原函数', k: 'qa', s: 3,
    q: '原函数存在定理；哪些函数一定没有原函数？',
    a: r`连续函数必有原函数。
含**第一类间断点**（可去、跳跃）或**无穷间断点**的函数在包含该点的区间上**没有**原函数（因为导函数不能有第一类间断点，且导函数若在某点邻域内无界则该点极限不能为有限）。
含**振荡间断点**的函数可能有原函数（如 $\big(x^2\sin\frac1x\big)'$）。`,
    trap: r`「有原函数」与「可积」互不蕴含：$\operatorname{sgn}x$ 在 $[-1,1]$ 可积但无原函数。`,
  },
  {
    sec: '基本积分表', k: 'cloze', s: 3,
    q: r`$\int\tan x\,dx=⟦-\ln|\cos x|+C⟧$，$\int\cot x\,dx=⟦\ln|\sin x|+C⟧$`,
  },
  {
    sec: '基本积分表', k: 'cloze', s: 3,
    q: r`$\int\sec x\,dx=⟦\ln|\sec x+\tan x|+C⟧$，$\int\csc x\,dx=⟦\ln|\csc x-\cot x|+C⟧$`,
    hook: r`$\int\csc x\,dx$ 也可写成 $\ln\big|\tan\frac x2\big|+C$。`,
  },
  {
    sec: '基本积分表', k: 'cloze', s: 3,
    q: r`$\int\sec^2x\,dx=⟦\tan x+C⟧$，$\int\csc^2 x\,dx=⟦-\cot x+C⟧$，$\int\sec x\tan x\,dx=⟦\sec x+C⟧$，$\int\csc x\cot x\,dx=⟦-\csc x+C⟧$`,
  },
  {
    sec: '基本积分表', k: 'cloze', s: 3,
    q: r`$\displaystyle\int\frac{dx}{a^2+x^2}=⟦\frac1a\arctan\frac xa+C⟧$，$\displaystyle\int\frac{dx}{\sqrt{a^2-x^2}}=⟦\arcsin\frac xa+C⟧$，$\displaystyle\int\frac{dx}{x^2-a^2}=⟦\frac{1}{2a}\ln\Big|\frac{x-a}{x+a}\Big|+C⟧$`,
    trap: r`第一个别漏 $\frac1a$；第三个是 $\frac{x-a}{x+a}$（分子在前的 $x-a$）。`,
  },
  {
    sec: '基本积分表', k: 'cloze', s: 3,
    q: r`$\displaystyle\int\frac{dx}{\sqrt{x^2\pm a^2}}=⟦\ln\big|x+\sqrt{x^2\pm a^2}\big|+C⟧$`,
    hook: r`$x=a\tan t$ 或 $x=a\sec t$ 换元可推得；导数验证：$\big(\ln(x+\sqrt{x^2+a^2})\big)'=\frac{1}{\sqrt{x^2+a^2}}$。`,
  },
  {
    sec: '基本积分表', k: 'cloze', s: 2,
    q: r`$\displaystyle\int\sqrt{a^2-x^2}\,dx=⟦\frac{x}{2}\sqrt{a^2-x^2}+\frac{a^2}{2}\arcsin\frac xa+C⟧$`,
    hook: r`定积分 $\int_0^a\sqrt{a^2-x^2}dx=\frac{\pi a^2}{4}$ 直接用几何意义。`,
  },
  {
    sec: '基本积分表', k: 'cloze', s: 2,
    q: r`$\displaystyle\int\sqrt{x^2\pm a^2}\,dx=⟦\frac{x}{2}\sqrt{x^2\pm a^2}\pm\frac{a^2}{2}\ln\big|x+\sqrt{x^2\pm a^2}\big|+C⟧$`,
  },
  {
    sec: '基本积分表', k: 'cloze', s: 2,
    q: r`$\displaystyle\int e^{ax}\sin bx\,dx=⟦\frac{e^{ax}(a\sin bx-b\cos bx)}{a^2+b^2}+C⟧$，$\displaystyle\int e^{ax}\cos bx\,dx=⟦\frac{e^{ax}(a\cos bx+b\sin bx)}{a^2+b^2}+C⟧$`,
    hook: '两次分部积分「循环」后移项；记忆：分母 a²+b²，分子「同名乘 a、异名乘 b，sin 型减、cos 型加」。',
  },
  {
    sec: '基本积分表', k: 'cloze', s: 2,
    q: r`$\int\ln x\,dx=⟦x\ln x-x+C⟧$，$\int\arctan x\,dx=⟦x\arctan x-\frac12\ln(1+x^2)+C⟧$，$\int\arcsin x\,dx=⟦x\arcsin x+\sqrt{1-x^2}+C⟧$`,
    hook: '反三角、对数函数单独积分：一律分部，u 取它本身。',
  },
  {
    sec: '基本积分表', k: 'cloze', s: 2,
    q: r`$\displaystyle\int\frac{dx}{1+\cos x}=⟦\tan\frac x2+C⟧$，$\displaystyle\int\frac{dx}{1-\cos x}=⟦-\cot\frac x2+C⟧$，$\displaystyle\int\frac{dx}{\sin x\cos x}=⟦\ln|\tan x|+C⟧$`,
    hook: r`$1+\cos x=2\cos^2\frac x2$，$1-\cos x=2\sin^2\frac x2$。`,
  },
  {
    sec: '积分方法', k: 'qa', s: 3,
    q: '三角换元的三种情形及 t 的取值范围',
    a: r`| 根式 | 换元 | $t$ 范围 |
|---|---|---|
| $\sqrt{a^2-x^2}$ | $x=a\sin t$ | $[-\frac\pi2,\frac\pi2]$ |
| $\sqrt{a^2+x^2}$ | $x=a\tan t$ | $(-\frac\pi2,\frac\pi2)$ |
| $\sqrt{x^2-a^2}$ | $x=a\sec t$ | $[0,\frac\pi2)$ 或 $(\frac\pi2,\pi]$ |
换元后 $\sqrt{\ }$ 分别化为 $a\cos t$、$a\sec t$、$a\tan t$（取范围保证非负）。回代用直角三角形。`,
    trap: r`$\sqrt{x^2-a^2}$ 型当 $x<-a$ 时要单独处理符号，或先令 $x=-u$。`,
  },
  {
    sec: '积分方法', k: 'cloze', s: 3,
    q: r`分部积分 $\int u\,dv=⟦uv-\int v\,du⟧$；选 $u$ 的优先顺序：⟦反、对、幂、三、指⟧（越靠前越优先当 $u$）`,
    hook: '「反对幂三指」：反三角、对数难积分所以留作 u 求导；指数、三角易积分所以进 dv。多项式×指数/三角可用表格法。',
  },
  {
    sec: '积分方法', k: 'steps', s: 3,
    q: '有理函数积分（部分分式法）的步骤',
    a: r`1. 假分式先多项式除法化为「多项式 + 真分式」。
2. 分母在实数范围内因式分解为 $(x-a)^k$ 与 $(x^2+px+q)^k$（$p^2-4q<0$）之积。
3. 待定系数：$(x-a)^k$ 对应 $\dfrac{A_1}{x-a}+\cdots+\dfrac{A_k}{(x-a)^k}$；$(x^2+px+q)^k$ 对应 $\dfrac{B_1x+C_1}{x^2+px+q}+\cdots$。
4. 求系数：通分比较，或代特殊值、求极限、留数法（$A=\lim_{x\to a}(x-a)f(x)$）。
5. 逐项积分：$\dfrac{Bx+C}{x^2+px+q}$ 拆为 $\dfrac{B}{2}\dfrac{(x^2+px+q)'}{x^2+px+q}+\dfrac{\text{常数}}{(x+\frac p2)^2+\Delta}$。`,
  },
  {
    sec: '积分方法', k: 'qa', s: 2,
    q: '三角有理式 ∫R(sin x, cos x)dx 的换元选择策略',
    a: r`- $R(-\sin x,\cos x)=-R$（关于 $\sin$ 奇）：令 $u=\cos x$；
- $R(\sin x,-\cos x)=-R$（关于 $\cos$ 奇）：令 $u=\sin x$；
- $R(-\sin x,-\cos x)=R$（都变号不变）：令 $u=\tan x$；
- 以上都不行：万能代换 $t=\tan\frac x2$。
另：$\sin^m x\cos^n x$ 中有奇次幂时拆一个出来凑微分；全偶次用降幂公式。`,
  },
  {
    sec: '定积分概念', k: 'qa', s: 3,
    q: '定积分的定义；可积的充分条件与必要条件',
    a: r`$$\int_a^bf(x)dx=\lim_{\lambda\to0}\sum_{i=1}^nf(\xi_i)\Delta x_i\quad(\lambda=\max\Delta x_i)$$
**必要条件**：可积 $\Rightarrow$ 有界。
**充分条件**：① $f\in C[a,b]$；② $f$ 在 $[a,b]$ 有界且只有有限个间断点；③ $f$ 在 $[a,b]$ 单调。`,
    trap: r`可积推不出有原函数；连续既可积又有原函数。$\frac1x$ 在 $[-1,1]$ 无界故不可积（作为反常积分也发散）。`,
  },
  {
    sec: '定积分性质', k: 'qa', s: 3,
    q: '定积分的比较性质、估值定理、积分中值定理（含推广形式）',
    a: r`**比较**：$f\le g$ 于 $[a,b]\Rightarrow\int_a^bf\le\int_a^bg$；$\big|\int_a^bf\big|\le\int_a^b|f|$。
**估值**：$m(b-a)\le\int_a^bf\le M(b-a)$。
**中值定理**：$f\in C[a,b]\Rightarrow\exists\xi\in[a,b]$（可取到开区间 $(a,b)$），$\int_a^bf=f(\xi)(b-a)$。
**推广**：$f\in C[a,b]$，$g$ 可积且不变号 $\Rightarrow\exists\xi$，$\int_a^bfg=f(\xi)\int_a^bg$。`,
    hook: r`若 $f$ 连续、非负且 $\int_a^bf=0$，则 $f\equiv0$。`,
  },
  {
    sec: '变限积分', k: 'cloze', s: 3,
    q: r`$\dfrac{d}{dx}\displaystyle\int_{\varphi(x)}^{\psi(x)}f(t)\,dt=⟦f(\psi(x))\psi'(x)-f(\varphi(x))\varphi'(x)⟧$`,
    trap: r`被积函数含 $x$ 时**不能直接套公式**：先把 $x$ 提到积分号外（如 $\int_0^x xf(t)dt=x\int_0^xf(t)dt$），或换元 $u=x-t$（如 $\int_0^xf(x-t)dt=\int_0^xf(u)du$）。`,
  },
  {
    sec: '变限积分', k: 'qa', s: 3,
    q: r`变限积分 $\Phi(x)=\int_a^xf(t)dt$ 的连续性、可导性、奇偶性结论`,
    a: r`- $f$ 可积 $\Rightarrow\Phi$ 连续；$f$ 连续 $\Rightarrow\Phi$ 可导且 $\Phi'=f$。
- $f$ 在 $x_0$ 有**跳跃间断点** $\Rightarrow\Phi$ 在 $x_0$ 连续但不可导（左右导数为 $f(x_0^\mp)$）；
- $f$ 在 $x_0$ 有**可去间断点** $\Rightarrow\Phi$ 在 $x_0$ 可导，$\Phi'(x_0)=\lim_{x\to x_0}f(x)$。
- $f$ 奇 $\Rightarrow\int_0^xf$ 为偶（起点任意仍为偶）；$f$ 偶 $\Rightarrow\int_0^xf$ 为奇（起点必须为 0）。`,
    hook: '变限积分「比被积函数好一级」：可积→连续，连续→可导。',
  },
  {
    sec: '定积分计算', k: 'qa', s: 3,
    q: '牛顿–莱布尼茨公式及其使用条件；换元法的三个要点',
    a: r`$f\in C[a,b]$，$F'=f$，则 $\int_a^bf(x)dx=F(b)-F(a)$。
换元 $x=\varphi(t)$ 要点：① 换元必换限；② $\varphi$ 单调（或至少 $\varphi'$ 连续、值域不超出 $[a,b]$）；③ 定积分换元后**不需回代**。`,
    trap: r`$\int_{-1}^1\frac{dx}{x^2}\ne-\frac1x\Big|_{-1}^1=-2$：被积函数在 0 处无界，这是发散的反常积分。使用 N–L 公式前检查 $[a,b]$ 内是否有无穷间断点。`,
  },
  {
    sec: '定积分计算', k: 'qa', s: 3,
    q: '对称区间、周期函数、区间再现三类简化公式',
    a: r`**对称区间**：$\int_{-a}^af(x)dx=\int_0^a[f(x)+f(-x)]dx=\begin{cases}0,&f\text{ 奇}\\2\int_0^af,&f\text{ 偶}\end{cases}$
**周期** $T$：$\int_a^{a+T}f=\int_0^Tf$，$\int_0^{nT}f=n\int_0^Tf$
**区间再现**：$\int_a^bf(x)dx=\int_a^bf(a+b-x)dx$
推论：$\int_0^{\frac\pi2}f(\sin x)dx=\int_0^{\frac\pi2}f(\cos x)dx$；$\int_0^\pi xf(\sin x)dx=\frac\pi2\int_0^\pi f(\sin x)dx$`,
    hook: r`遇到 $\int\frac{\sin^n x}{\sin^n x+\cos^n x}$、$\int_{-a}^a\frac{f(x)}{1+e^x}$ 之类，用区间再现两式相加。`,
  },
  {
    sec: '定积分计算', k: 'qa', s: 3,
    q: '华里士（Wallis）公式及其推广到 [0,π]、[0,2π]',
    a: r`$$I_n=\int_0^{\frac\pi2}\sin^nx\,dx=\int_0^{\frac\pi2}\cos^nx\,dx=\begin{cases}\dfrac{n-1}{n}\cdot\dfrac{n-3}{n-2}\cdots\dfrac12\cdot\dfrac\pi2,&n\text{ 偶}\\[2ex]\dfrac{n-1}{n}\cdot\dfrac{n-3}{n-2}\cdots\dfrac23\cdot1,&n\text{ 奇}\end{cases}$$
$\int_0^\pi\sin^nx\,dx=2I_n$；$\int_0^\pi\cos^nx\,dx=\begin{cases}2I_n,&n\text{ 偶}\\0,&n\text{ 奇}\end{cases}$；$\int_0^{2\pi}\sin^nx\,dx=\int_0^{2\pi}\cos^nx\,dx=\begin{cases}4I_n,&n\text{ 偶}\\0,&n\text{ 奇}\end{cases}$`,
    hook: r`递推 $I_n=\frac{n-1}{n}I_{n-2}$，「偶数到底乘 π/2，奇数到底乘 1」。`,
  },
  {
    sec: '反常积分', k: 'qa', s: 3,
    q: '三个基准反常积分的敛散性（p 积分）',
    a: r`$$\int_1^{+\infty}\frac{dx}{x^p}\ \begin{cases}\text{收敛},&p>1\\\text{发散},&p\le1\end{cases}\qquad\int_0^1\frac{dx}{x^p}\ \begin{cases}\text{收敛},&p<1\\\text{发散},&p\ge1\end{cases}$$
$$\int_2^{+\infty}\frac{dx}{x\ln^px}\ \begin{cases}\text{收敛},&p>1\\\text{发散},&p\le1\end{cases}\qquad\int_0^{\frac12}\frac{dx}{x|\ln x|^p}\ \begin{cases}\text{收敛},&p>1\\\text{发散},&p\le1\end{cases}$$`,
    hook: r`无穷远处要「衰减得快」（$p>1$）；瑕点处要「爆得慢」（$p<1$）。$p=1$ 时两者都发散。`,
  },
  {
    sec: '反常积分', k: 'qa', s: 2,
    q: '反常积分敛散性的判别流程（比较法与极限形式）',
    a: r`1. 找出所有「坏点」：$\pm\infty$ 与瑕点（无界点），每个坏点**单独**拆成一个积分，全部收敛才收敛。
2. 对每个坏点，用等价无穷小/无穷大找到 $f(x)\sim\dfrac{C}{x^p}$（或 $\dfrac{C}{(x-a)^p}$），套 $p$ 积分结论。
3. 极限形式：$\lim_{x\to+\infty}x^pf(x)=C$（$0<C<+\infty$）$\Rightarrow$ 与 $\int\frac{dx}{x^p}$ 同敛散。
4. 若 $\lim_{x\to a^+}f(x)$ 有限，则 $a$ 不是瑕点。`,
    trap: r`$\int_{-\infty}^{+\infty}x\,dx$ 发散，不能用「奇函数对称」说它等于 0；须 $\int_{-\infty}^0$ 与 $\int_0^{+\infty}$ 分别收敛。`,
  },
  {
    sec: '反常积分', k: 'cloze', s: 3,
    q: r`$\displaystyle\int_0^{+\infty}e^{-x^2}dx=⟦\frac{\sqrt\pi}{2}⟧$，$\displaystyle\int_0^{+\infty}x^ne^{-x}dx=⟦n!⟧$，$\displaystyle\int_0^{+\infty}\frac{dx}{1+x^2}=⟦\frac\pi2⟧$，$\displaystyle\int_0^{+\infty}e^{-ax}dx=⟦\frac1a⟧\ (a>0)$`,
    hook: r`$\Gamma(n+1)=n!$；$\int_{-\infty}^{+\infty}e^{-x^2}dx=\sqrt\pi$。`,
  },
  {
    sec: '定积分应用', k: 'qa', s: 3,
    q: '平面图形面积：直角坐标、参数方程、极坐标三种公式',
    a: r`**直角坐标**：$A=\int_a^b|f(x)-g(x)|dx$（或对 $y$ 积分）。
**参数方程** $x=\varphi(t),y=\psi(t)$：$A=\int_{t_1}^{t_2}|\psi(t)\varphi'(t)|dt$。
**极坐标** $r=r(\theta)$：$A=\dfrac12\int_\alpha^\beta r^2(\theta)d\theta$；两曲线间 $A=\frac12\int(r_2^2-r_1^2)d\theta$。`,
    trap: r`极坐标画图确定 $\theta$ 范围时注意 $r\ge0$；心形线全面积用对称性 $2\times\frac12\int_0^\pi$。`,
  },
  {
    sec: '定积分应用', k: 'qa', s: 3,
    q: '旋转体体积：绕 x 轴、绕 y 轴（柱壳法）、绕任意直线',
    a: r`曲边梯形 $0\le y\le f(x)$，$a\le x\le b$：
**绕 $x$ 轴**：$V_x=\pi\int_a^bf^2(x)dx$
**绕 $y$ 轴**（柱壳法）：$V_y=2\pi\int_a^bx\,f(x)dx$（$a\ge0$）
**绕直线 $y=c$**：$V=\pi\int_a^b\big[(f(x)-c)^2\big]dx$（区域在直线一侧）
**绕直线 $x=c$**：$V=2\pi\int_a^b|x-c|f(x)dx$
两曲线之间绕 $x$ 轴：$\pi\int(f^2-g^2)dx$，**不是** $\pi\int(f-g)^2dx$。`,
    hook: '柱壳法：薄壳周长 2πx × 高 f(x) × 厚 dx。',
  },
  {
    sec: '定积分应用', k: 'qa', s: 3,
    q: '弧长公式（三种形式）与旋转曲面面积公式',
    a: r`**弧长**：$s=\int_a^b\sqrt{1+y'^2}\,dx=\int_\alpha^\beta\sqrt{x'^2(t)+y'^2(t)}\,dt=\int_{\theta_1}^{\theta_2}\sqrt{r^2+r'^2}\,d\theta$
**旋转曲面面积**（绕 $x$ 轴）：$S=2\pi\int_a^b|y|\sqrt{1+y'^2}\,dx=2\pi\int|y(t)|\sqrt{x'^2+y'^2}\,dt$`,
    hook: r`弧微分 $ds=\sqrt{1+y'^2}dx$；侧面积 $=2\pi\cdot$半径$\cdot ds$。`,
  },
  {
    sec: '定积分应用', k: 'qa', s: 2,
    q: '定积分的物理应用：变力做功、液体静压力、引力、质心/形心',
    a: r`**功**：$W=\int_a^bF(x)dx$（抽水：$W=\int\rho g\,A(h)\,h\,dh$）。
**压力**：$P=\int\rho g\,h\cdot w(h)\,dh$（$h$ 为深度，$w(h)$ 为该深度处的宽度）。
**引力**：$dF=\frac{Gm\,\rho\,dl}{r^2}$，按方向分解后积分。
**形心**（均匀薄片 $a\le x\le b$，$g\le y\le f$）：$\bar x=\dfrac{\int_a^bx[f-g]dx}{\int_a^b[f-g]dx}$，$\bar y=\dfrac{\frac12\int_a^b[f^2-g^2]dx}{\int_a^b[f-g]dx}$。`,
    hook: r`平均值 $\bar f=\frac{1}{b-a}\int_a^bf(x)dx$；已知截面积 $A(x)$ 的立体体积 $V=\int_a^bA(x)dx$。`,
  },
  {
    sec: '定积分性质', k: 'cloze', s: 2,
    q: r`柯西–施瓦茨不等式：$\Big(\displaystyle\int_a^bf(x)g(x)dx\Big)^2\le⟦\int_a^bf^2(x)dx\cdot\int_a^bg^2(x)dx⟧$`,
    hook: r`证明积分不等式的常用工具，取 $g\equiv1$ 得 $\big(\int_a^bf\big)^2\le(b-a)\int_a^bf^2$。`,
  },
  {
    sec: '定积分计算', k: 'judge', s: 2,
    q: r`$\displaystyle\int_0^{2\pi}\sqrt{1-\cos 2x}\,dx=\sqrt2\int_0^{2\pi}\sin x\,dx=0$。`,
    a: r`✗ 错误。$\sqrt{1-\cos2x}=\sqrt2|\sin x|$，开方后必须加绝对值，正确结果为 $4\sqrt2$。同理 $\sqrt{x^2}=|x|$，$\sqrt{1+\cos 2x}=\sqrt2|\cos x|$。`,
  },
  {
    sec: '积分方法', k: 'judge', s: 2,
    q: r`$\displaystyle\int\frac{dx}{x}=\ln x+C$。`,
    a: r`✗ 不完整。应为 $\ln|x|+C$；类似 $\int\tan x\,dx=-\ln|\cos x|+C$。仅当已知 $x>0$ 时可省绝对值。`,
  },
  {
    sec: '定积分应用', k: 'steps', s: 2,
    q: '定积分应用题（面积/体积/弧长）的通用解题流程',
    a: r`1. 画图：确定区域，找交点（联立求解）。
2. 选变量：曲线以 $y=f(x)$ 给出且区域上下界清晰选 $x$；左右界清晰选 $y$；参数/极坐标按其变量。
3. 取微元：写出 $dA$、$dV$、$ds$ 的表达式（面积条、圆盘/柱壳、弧微分）。
4. 定限积分，注意分段与对称性。
5. 检查量纲与符号（面积、体积应为正）。`,
  },
  {
    sec: '变限积分', k: 'qa', s: 2,
    q: r`含变限积分的极限 $\lim\limits_{x\to0}\dfrac{\int_0^x f(t)\,dt}{g(x)}$ 类题目的处理方式`,
    a: r`1. 确认 $\frac00$ 型后洛必达，分子导数为 $f(x)$（复合时乘内层导数）。
2. 若被积函数是 $x$ 与 $t$ 的复合（如 $f(x-t)$、$f(xt)$），先换元把 $x$ 移出积分号。
3. 也可用等价无穷小：若 $f(t)\sim t^k$（$t\to0$），则 $\int_0^xf(t)dt\sim\dfrac{x^{k+1}}{k+1}$。
4. 积分中值定理 $\int_0^xf(t)dt=f(\xi)x$ 一般只在 $f$ 连续时用于粗略估计，注意 $\xi$ 随 $x$ 变化。`,
  },
  {
    sec: '基本积分表', k: 'cloze', s: 2,
    q: r`$\displaystyle\int\frac{dx}{x\sqrt{x^2-a^2}}=⟦\frac1a\arccos\frac{a}{|x|}+C⟧$（或 $\frac1a\operatorname{arcsec}\frac{|x|}{a}$）；$\displaystyle\int\frac{x\,dx}{\sqrt{a^2\pm x^2}}=⟦\pm\sqrt{a^2\pm x^2}+C⟧$`,
    hook: r`第一个常用换元 $x=\frac1t$（倒代换）：分母含 $x^k\sqrt{\cdots}$ 时优先考虑倒代换。`,
  },
  {
    sec: '定积分计算', k: 'qa', s: 2,
    q: r`$\displaystyle\int_0^a x^k\sqrt{a^2-x^2}\,dx$、$\int_0^{\frac\pi2}\frac{dx}{1+\tan^\alpha x}$、$\int_0^{1}\frac{\ln(1+x)}{1+x^2}dx$ 这三类「有固定技巧」的定积分怎么处理？`,
    a: r`① 令 $x=a\sin t$ 化为华里士公式：$\int_0^a x^2\sqrt{a^2-x^2}dx=a^4\int_0^{\frac\pi2}\sin^2t\cos^2t\,dt=\frac{\pi a^4}{16}$。
② 区间再现：$I=\int_0^{\frac\pi2}\frac{dx}{1+\cot^\alpha x}$，相加得 $2I=\frac\pi2$，$I=\frac\pi4$。
③ 令 $x=\tan\theta$：$\int_0^{\frac\pi4}\ln(1+\tan\theta)d\theta$，再区间再现 $\theta\to\frac\pi4-\theta$，得 $\frac\pi8\ln2$。`,
  },
]);
