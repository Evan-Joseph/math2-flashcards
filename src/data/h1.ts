import { defineChapter, r } from './types';

export const h1 = defineChapter('h1', [
  {
    sec: '极限定义', k: 'cloze', s: 2,
    q: r`数列极限 $\lim\limits_{n\to\infty}x_n=a$：$\forall\varepsilon>0$，$⟦\exists N>0⟧$，当 $⟦n>N⟧$ 时，恒有 $⟦|x_n-a|<\varepsilon⟧$`,
    hook: 'ε 是「任意小的误差」，N 是「够大之后」。',
  },
  {
    sec: '极限定义', k: 'cloze', s: 2,
    q: r`函数极限 $\lim\limits_{x\to x_0}f(x)=A$：$\forall\varepsilon>0$，$\exists\delta>0$，当 $⟦0<|x-x_0|<\delta⟧$ 时，恒有 $⟦|f(x)-A|<\varepsilon⟧$`,
    trap: r`$0<|x-x_0|$ 意味着极限与 $f(x_0)$ 是否有定义、取值多少**无关**。`,
  },
  {
    sec: '极限性质', k: 'qa', s: 3,
    q: '极限存在的充要条件（x→x₀ 与 x→∞ 两种情形）',
    a: r`$\lim\limits_{x\to x_0}f(x)=A\iff f(x_0^-)=f(x_0^+)=A$
$\lim\limits_{x\to\infty}f(x)=A\iff\lim\limits_{x\to-\infty}f(x)=\lim\limits_{x\to+\infty}f(x)=A$
数列：$\lim x_n=a\iff\lim x_{2k}=\lim x_{2k+1}=a$`,
    trap: r`含 $e^{1/x}$、$\arctan\frac1x$、$|x|$、$[x]$ 的极限，$x\to0$ 时必须分左右！如 $\lim\limits_{x\to0}e^{1/x}$ 不存在。`,
  },
  {
    sec: '极限性质', k: 'qa', s: 3,
    q: '极限的局部保号性（两个方向）',
    a: r`① 若 $\lim\limits_{x\to x_0}f(x)=A>0$（或 $<0$），则存在去心邻域使 $f(x)>0$（或 $<0$）。
② 若在某去心邻域内 $f(x)\ge0$ 且极限存在为 $A$，则 $A\ge0$。`,
    trap: r`反方向只能得到 $\ge$：$f(x)=x^2>0$ 但 $\lim\limits_{x\to0}x^2=0$。`,
  },
  {
    sec: '极限性质', k: 'judge', s: 2,
    q: r`若 $\lim\limits_{x\to x_0}[f(x)+g(x)]$ 存在且 $\lim\limits_{x\to x_0}f(x)$ 存在，则 $\lim\limits_{x\to x_0}g(x)$ 必存在。`,
    a: r`✓ 正确。$g=(f+g)-f$，两个存在极限之差存在。但「和存在」推不出「各自存在」，「积存在」也推不出各自存在（如 $x\cdot\frac1x$）。`,
  },
  {
    sec: '极限存在准则', k: 'qa', s: 3,
    q: '夹逼准则与单调有界准则的内容，以及各自典型应用场景',
    a: r`**夹逼**：若 $y_n\le x_n\le z_n$ 且 $\lim y_n=\lim z_n=a$，则 $\lim x_n=a$。用于 n 项和、含 $[x]$、含 $\sin$ 等有界因子的极限。
**单调有界**：单调递增有上界（或递减有下界）数列必收敛。用于递推数列 $x_{n+1}=f(x_n)$：先证单调有界，再对 $a=f(a)$ 解出极限。`,
    hook: r`递推数列 $x_{n+1}=f(x_n)$：若 $f$ 单调增，则 $\{x_n\}$ 单调（方向由 $x_2$ 与 $x_1$ 决定）；若 $f$ 单调减，则奇偶子列单调性相反，分别处理。`,
  },
  {
    sec: '重要极限', k: 'cloze', s: 3,
    q: r`$\lim\limits_{x\to0}\dfrac{\sin x}{x}=⟦1⟧$，$\lim\limits_{x\to\infty}\Big(1+\dfrac1x\Big)^x=⟦e⟧$，$\lim\limits_{x\to0}(1+x)^{1/x}=⟦e⟧$`,
    trap: r`$\lim\limits_{x\to\infty}\frac{\sin x}{x}=0$（有界×无穷小），别和第一个重要极限混淆。`,
  },
  {
    sec: '重要极限', k: 'cloze', s: 3,
    q: r`$1^\infty$ 型极限公式：若 $\lim u=1,\ \lim v=\infty$，则 $\lim u^v = ⟦e^{\lim (u-1)v}⟧$`,
    hook: r`推导：$u^v=e^{v\ln u}$，而 $\ln u=\ln(1+(u-1))\sim u-1$。`,
    trap: '只对 1^∞ 型有效；0^0、∞^0 型请用 e^{v ln u} 直接处理。',
  },
  {
    sec: '等价无穷小', k: 'qa', s: 3,
    q: r`$x\to0$ 时的 10 个基本等价无穷小`,
    a: r`$$\sin x\sim\tan x\sim\arcsin x\sim\arctan x\sim x$$
$$\ln(1+x)\sim x,\qquad e^x-1\sim x,\qquad a^x-1\sim x\ln a$$
$$1-\cos x\sim\tfrac12x^2,\qquad (1+x)^\alpha-1\sim\alpha x,\qquad \sqrt[n]{1+x}-1\sim\tfrac xn$$
另：$\log_a(1+x)\sim\dfrac{x}{\ln a}$，$1-\cos^a x\sim\dfrac{a}{2}x^2$`,
    hook: r`$x$ 可换成任意趋于 0 的表达式，如 $\ln(1+x^2)\sim x^2$、$e^{\sin x}-1\sim\sin x\sim x$。`,
  },
  {
    sec: '等价无穷小', k: 'qa', s: 3,
    q: r`$x\to0$ 时的高阶等价无穷小（三角、反三角、对数的「差」）`,
    a: r`$$x-\sin x\sim\tfrac{x^3}{6},\qquad \arcsin x-x\sim\tfrac{x^3}{6}$$
$$\tan x-x\sim\tfrac{x^3}{3},\qquad x-\arctan x\sim\tfrac{x^3}{3}$$
$$\tan x-\sin x\sim\tfrac{x^3}{2},\qquad x-\ln(1+x)\sim\tfrac{x^2}{2}$$
$$e^x-1-x\sim\tfrac{x^2}{2},\qquad 1-\cos x - \tfrac{x^2}{2}\sim -\tfrac{x^4}{24}$$`,
    hook: r`全部来自泰勒展开：$\sin x=x-\frac{x^3}{6}+\cdots$，$\tan x=x+\frac{x^3}{3}+\cdots$。记法：「正弦 6，正切 3，正弦正切差为 2」。`,
  },
  {
    sec: '等价无穷小', k: 'qa', s: 3,
    q: '等价无穷小替换的使用原则（乘除、加减各什么条件下可用）',
    a: r`**乘除因子**：可以直接替换。
**加减**：设 $\alpha\sim\alpha'$，$\beta\sim\beta'$，
- 若 $\lim\dfrac{\alpha'}{\beta'}=A\ne1$，则 $\alpha-\beta\sim\alpha'-\beta'$；
- 若 $\lim\dfrac{\alpha'}{\beta'}=A\ne-1$，则 $\alpha+\beta\sim\alpha'+\beta'$。
条件不满足时（如 $\tan x-\sin x$）改用泰勒展开到「首个非零项」。`,
    trap: r`$\lim\limits_{x\to0}\dfrac{\tan x-\sin x}{x^3}$ 若把分子换成 $x-x=0$ 就错了，正确答案是 $\frac12$。`,
  },
  {
    sec: '泰勒展开', k: 'qa', s: 3,
    q: r`$x\to0$ 时 8 个常用麦克劳林展开式（写到能体现规律的项）`,
    a: r`$$e^x=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots+\frac{x^n}{n!}+o(x^n)$$
$$\sin x=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots,\qquad \cos x=1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots$$
$$\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}-\cdots+(-1)^{n-1}\frac{x^n}{n}+o(x^n)$$
$$(1+x)^\alpha=1+\alpha x+\frac{\alpha(\alpha-1)}{2!}x^2+\cdots$$
$$\frac{1}{1-x}=1+x+x^2+\cdots,\qquad \frac{1}{1+x}=1-x+x^2-\cdots$$
$$\arctan x=x-\frac{x^3}{3}+\frac{x^5}{5}-\cdots,\qquad \arcsin x=x+\frac{x^3}{6}+\cdots,\qquad \tan x=x+\frac{x^3}{3}+\cdots$$`,
    hook: '展开到几阶？——「上下同阶」：分母是 x^k 就把分子展开到 x^k；「幂次最低」：加减后保留最低非零幂。',
  },
  {
    sec: '无穷小与无穷大', k: 'qa', s: 2,
    q: '无穷小的阶的比较：高阶、低阶、同阶、等价、k 阶的定义',
    a: r`设 $\lim\dfrac{\beta}{\alpha}=c$：
- $c=0$：$\beta$ 是 $\alpha$ 的高阶无穷小，记 $\beta=o(\alpha)$；
- $c=\infty$：低阶；
- $c\ne0$ 有限：同阶；$c=1$：等价 $\beta\sim\alpha$；
- $\lim\dfrac{\beta}{\alpha^k}=c\ne0$：$\beta$ 是 $\alpha$ 的 $k$ 阶无穷小。`,
    hook: r`求阶数的万能方法：泰勒展开取首项。变限积分 $\int_0^x f(t)dt$ 的阶 = $f$ 的阶 + 1。`,
  },
  {
    sec: '无穷小与无穷大', k: 'qa', s: 2,
    q: '无穷小的运算性质；无穷大与无界的关系',
    a: r`有限个无穷小的和、积仍是无穷小；**有界量 × 无穷小 = 无穷小**。
无穷大 $\Rightarrow$ 无界，但无界 $\nRightarrow$ 无穷大。
无穷大的倒数是无穷小；非零无穷小的倒数是无穷大。`,
    trap: r`$f(x)=x\sin x$ 在 $x\to\infty$ 时无界但不是无穷大（在 $x=k\pi$ 处为 0）。两个无穷大之和不一定是无穷大。`,
  },
  {
    sec: '常见极限', k: 'qa', s: 3,
    q: '7 个必背的常见极限结论',
    a: r`$$\lim_{n\to\infty}\sqrt[n]{n}=1,\qquad \lim_{n\to\infty}\sqrt[n]{a}=1\ (a>0)$$
$$\lim_{x\to0^+}x^x=1,\qquad \lim_{x\to0^+}x^\alpha\ln x=0\ (\alpha>0)$$
$$\lim_{x\to+\infty}\frac{\ln x}{x^\alpha}=0,\qquad \lim_{x\to+\infty}\frac{x^\alpha}{a^x}=0\ (a>1),\qquad \lim_{n\to\infty}\frac{a^n}{n!}=0$$
$$\lim_{n\to\infty}\sqrt[n]{a_1^n+\cdots+a_m^n}=\max\{a_i\}\ (a_i>0)$$`,
    hook: r`增长速度：$\ln^\alpha n\ll n^\beta\ll a^n\ll n!\ll n^n$（$n\to\infty$）。`,
  },
  {
    sec: '常见极限', k: 'cloze', s: 2,
    q: r`$\lim\limits_{x\to\infty}\dfrac{a_nx^n+\cdots+a_0}{b_mx^m+\cdots+b_0}=$ ⟦$\dfrac{a_n}{b_m}$（$n=m$）；$0$（$n<m$）；$\infty$（$n>m$）⟧`,
    hook: '「抓大头」：x→∞ 看最高次，x→0 看最低次。',
  },
  {
    sec: '连续与间断', k: 'cloze', s: 3,
    q: r`$f(x)$ 在 $x_0$ 连续 $\iff$ $⟦\lim\limits_{x\to x_0}f(x)=f(x_0)⟧$ $\iff$ 左连续且右连续 $\iff \lim\limits_{\Delta x\to0}\Delta y=⟦0⟧$`,
  },
  {
    sec: '连续与间断', k: 'qa', s: 3,
    q: '间断点的分类及各自判定',
    a: r`**第一类**（左右极限都存在）：
- 可去间断点：$f(x_0^-)=f(x_0^+)\ne f(x_0)$ 或 $f(x_0)$ 无定义；
- 跳跃间断点：$f(x_0^-)\ne f(x_0^+)$。
**第二类**（左右极限至少一个不存在）：
- 无穷间断点：如 $\frac1x$ 在 $0$；
- 振荡间断点：如 $\sin\frac1x$ 在 $0$。`,
    hook: r`找间断点：无定义点、分段点。典型：$\frac{\sin x}{x}$ 在 0 可去；$\frac{|x|}{x}$ 在 0 跳跃；$e^{1/x}$ 在 0 是第二类（右极限 ∞）；$\arctan\frac1x$ 在 0 跳跃。`,
  },
  {
    sec: '闭区间连续函数', k: 'qa', s: 3,
    q: '闭区间上连续函数的四大性质',
    a: r`设 $f\in C[a,b]$：
1. **有界性**：$f$ 在 $[a,b]$ 上有界；
2. **最值定理**：存在最大值 $M$ 与最小值 $m$；
3. **介值定理**：对任意 $\mu\in[m,M]$，存在 $\xi\in[a,b]$ 使 $f(\xi)=\mu$；
4. **零点定理**：若 $f(a)f(b)<0$，则存在 $\xi\in(a,b)$ 使 $f(\xi)=0$。`,
    trap: '开区间不成立：1/x 在 (0,1) 连续但无界。证明「存在 ξ 使 f(ξ)=某平均值」时用介值定理；证「方程有根」用零点定理。',
  },
  {
    sec: '函数有界性', k: 'qa', s: 2,
    q: '判断函数在区间上有界的三个常用充分条件',
    a: r`1. $f$ 在闭区间 $[a,b]$ 上连续 $\Rightarrow$ 有界；
2. $f$ 在开区间 $(a,b)$ 上连续，且 $f(a^+)$、$f(b^-)$ 都存在 $\Rightarrow$ 在 $(a,b)$ 有界；
3. $f'$ 在有限区间 $I$ 上有界 $\Rightarrow$ $f$ 在 $I$ 上有界（拉格朗日中值定理）。`,
    hook: '无穷区间上有界：看 x→±∞ 的极限是否存在（存在则有界）。',
  },
  {
    sec: '数列极限', k: 'judge', s: 2,
    q: r`若数列 $\{x_{2k}\}$ 与 $\{x_{2k+1}\}$ 都收敛，则 $\{x_n\}$ 收敛。`,
    a: r`✗ 错误。如 $x_n=(-1)^n$，奇、偶子列分别收敛于 $-1$ 和 $1$，但原数列发散。正确表述：奇偶子列**收敛于同一极限** $\iff$ 数列收敛。反之，收敛数列的任一子列都收敛于同一极限。`,
    trap: '收敛数列必有界；有界数列未必收敛，但必有收敛子列（致密性定理）。',
  },
  {
    sec: '极限计算', k: 'steps', s: 3,
    q: r`求极限的通用流程（$\frac00$、$\frac\infty\infty$、$0\cdot\infty$、$\infty-\infty$、$1^\infty$、$0^0$、$\infty^0$）`,
    a: r`1. 先判断类型；能先代入的部分（非零因子极限）先算出来。
2. 化简：有理化、通分、提取公因子、变量代换（$x\to\infty$ 令 $t=\frac1x$）。
3. 等价无穷小替换乘除因子。
4. $\frac00,\frac\infty\infty$：洛必达或泰勒；$0\cdot\infty$：改写为分式；$\infty-\infty$：通分或倒代换。
5. 幂指型：$u^v=e^{v\ln u}$；$1^\infty$ 用 $e^{\lim(u-1)v}$。
6. 检查：洛必达前提是否满足，分左右极限的情形是否分了。`,
  },
  {
    sec: '极限计算', k: 'cloze', s: 3,
    q: r`定积分定义求 $n$ 项和极限：$\lim\limits_{n\to\infty}\dfrac1n\displaystyle\sum_{i=1}^n f\Big(\dfrac in\Big)=⟦\int_0^1 f(x)\,dx⟧$`,
    hook: r`识别特征：$\frac1n$ 提出来、剩余部分是 $\frac in$ 的函数。若是 $\sum\frac{i}{n^2+i}$ 这类分母不「齐」，先夹逼再判断。`,
    trap: r`求和上下限差 1 项、乘子是 $\frac{1}{n+1}$ 等，不影响极限（可夹逼）。`,
  },
  {
    sec: '连续与间断', k: 'judge', s: 2,
    q: r`若 $f(x)$ 在 $x_0$ 处连续，$g(x)$ 在 $x_0$ 处间断，则 $f(x)g(x)$ 在 $x_0$ 处必间断。`,
    a: r`✗ 错误。例如 $f(x)=0$，$g(x)=\operatorname{sgn}x$，乘积恒为 0 连续。但 $f\pm g$ 必间断。`,
  },
  {
    sec: '连续与间断', k: 'judge', s: 2,
    q: r`初等函数在其定义区间内处处连续。`,
    a: r`✓ 正确。因此初等函数的间断点只可能出现在**无定义的点**；分段函数还需检查分段点。`,
  },
  {
    sec: '极限性质', k: 'qa', s: 2,
    q: '海涅定理（归结原则）的内容及用途',
    a: r`$\lim\limits_{x\to x_0}f(x)=A\iff$ 对任意满足 $x_n\to x_0\ (x_n\ne x_0)$ 的数列，都有 $\lim\limits_{n\to\infty}f(x_n)=A$。
用途：① 把数列极限转化为函数极限（从而可用洛必达）；② 证明函数极限不存在：找两个趋于 $x_0$ 的数列使 $f(x_n)$ 极限不同。`,
    trap: '洛必达法则不能直接对数列使用，需先换成函数极限再用海涅定理回代。',
  },
  {
    sec: '常见极限', k: 'cloze', s: 2,
    q: r`$\lim\limits_{x\to0}\dfrac{a^x-b^x}{x}=⟦\ln\dfrac ab⟧$，$\lim\limits_{x\to0}\dfrac{(1+x)^{1/x}-e}{x}=⟦-\dfrac e2⟧$，$\lim\limits_{n\to\infty}n\big(\sqrt[n]{a}-1\big)=⟦\ln a⟧$`,
    hook: r`第二个：$(1+x)^{1/x}=e^{\frac{\ln(1+x)}{x}}=e^{1-\frac x2+o(x)}=e\,(1-\frac x2+o(x))$。`,
  },
  {
    sec: '连续与间断', k: 'qa', s: 2,
    q: r`含参数极限型函数 $f(x)=\lim\limits_{n\to\infty}\dfrac{x^{2n}\cdot g(x)+h(x)}{x^{2n}+1}$ 如何求其表达式并讨论间断点？`,
    a: r`按 $|x|$ 分段：
- $|x|<1$：$x^{2n}\to0$，$f(x)=h(x)$；
- $|x|>1$：$x^{2n}\to\infty$，$f(x)=g(x)$；
- $|x|=1$：$x^{2n}=1$，$f(x)=\dfrac{g(x)+h(x)}{2}$。
然后在 $x=\pm1$ 处比较左右极限与函数值，判定间断点类型。`,
    hook: r`同类题：$\lim\limits_{n\to\infty}\sqrt[n]{1+x^n}$（$x>0$）$=\max\{1,x\}$。`,
  },
]);
