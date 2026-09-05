import { defineChapter, r, type KCard } from './types';

/* 概率论与数理统计（仅数学一）。来源：张宇 2027 基础 30 讲·概率分册；浙大《概率论与数理统计》第四版章级定位。 */

export const p1 = defineChapter('p1', [
  {
    sec: '事件运算', k: 'cloze', s: 3,
    q: r`德摩根律：$\overline{A\cup B}=⟦\bar A\cap\bar B⟧$，$\overline{A\cap B}=⟦\bar A\cup\bar B⟧$；差事件 $A-B=⟦A\bar B⟧=A-AB$`,
    hook: '「和的对立是对立的积，积的对立是对立的和」。画文氏图验证最保险。',
  },
  {
    sec: '概率性质', k: 'cloze', s: 3,
    q: r`加法公式 $P(A\cup B)=⟦P(A)+P(B)-P(AB)⟧$；$P(A\cup B\cup C)=P(A)+P(B)+P(C)-P(AB)-P(AC)-P(BC)+⟦P(ABC)⟧$；减法公式 $P(A-B)=⟦P(A)-P(AB)⟧$`,
    trap: r`$P(A-B)=P(A)-P(B)$ 只在 $B\subset A$ 时成立。$P(AB)=0$ 推不出 $AB=\varnothing$（连续型）。`,
  },
  {
    sec: '古典概型', k: 'qa', s: 2,
    q: '古典概型与几何概型的定义及计算要点',
    a: r`**古典概型**：样本空间有限且各样本点等可能，$P(A)=\dfrac{A\text{ 含的样本点数}}{\text{总数}}$。计数用排列 $A_n^m=\dfrac{n!}{(n-m)!}$、组合 $C_n^m=\dfrac{n!}{m!(n-m)!}$，分清「有放回 / 无放回」「有序 / 无序」。
**几何概型**：样本空间为可度量区域且均匀，$P(A)=\dfrac{\text{测度}(A)}{\text{测度}(\Omega)}$，典型为「会面问题」。`,
    trap: '分子分母必须用同一种计数方式（同为有序或同为无序）。',
  },
  {
    sec: '条件概率', k: 'cloze', s: 3,
    q: r`条件概率 $P(B\mid A)=⟦\dfrac{P(AB)}{P(A)}⟧\ (P(A)>0)$；乘法公式 $P(ABC)=⟦P(A)P(B\mid A)P(C\mid AB)⟧$`,
    cond: r`乘法公式要求 $P(AB)>0$。条件概率满足概率的全部性质，如 $P(\bar B\mid A)=1-P(B\mid A)$；但 $P(B\mid\bar A)\ne1-P(B\mid A)$。`,
  },
  {
    sec: '全概率与贝叶斯', k: 'cloze', s: 3,
    q: r`设 $B_1,\dots,B_n$ 为完备事件组（两两互斥、和为 $\Omega$，$P(B_i)>0$）。全概率公式 $P(A)=⟦\displaystyle\sum_{i=1}^nP(B_i)P(A\mid B_i)⟧$；贝叶斯公式 $P(B_k\mid A)=⟦\dfrac{P(B_k)P(A\mid B_k)}{\sum_i P(B_i)P(A\mid B_i)}⟧$`,
    hook: '全概率「由因求果」，贝叶斯「执果索因」；贝叶斯的分母就是全概率。',
  },
  {
    sec: '独立性', k: 'qa', s: 3,
    q: '事件独立的定义；两两独立与相互独立的区别；独立与互斥的关系',
    a: r`$A,B$ 独立 $\iff P(AB)=P(A)P(B)$。$A,B,C$ **相互独立**需 4 个等式：三个两两独立 **且** $P(ABC)=P(A)P(B)P(C)$；两两独立推不出相互独立。
若 $A,B$ 独立，则 $A$ 与 $\bar B$、$\bar A$ 与 $B$、$\bar A$ 与 $\bar B$ 均独立。
**独立 vs 互斥**：$P(A)>0,P(B)>0$ 时，互斥 $\Rightarrow$ 不独立（$P(AB)=0\ne P(A)P(B)$）；独立 $\Rightarrow$ 不互斥。
概率为 0 或 1 的事件与任何事件独立。`,
    trap: r`$P(A)=0$ 不代表 $A=\varnothing$；$P(A)=1$ 不代表 $A=\Omega$。`,
  },
  {
    sec: '独立性', k: 'cloze', s: 2,
    q: r`$n$ 重伯努利试验中事件 $A$（$P(A)=p$）恰好发生 $k$ 次的概率 $=⟦C_n^kp^k(1-p)^{n-k}⟧$；至少发生一次的概率 $=⟦1-(1-p)^n⟧$`,
  },
]);

export const p2 = defineChapter('p2', [
  {
    sec: '分布函数', k: 'qa', s: 3,
    q: r`分布函数 $F(x)=P\{X\le x\}$ 的三条特征性质；如何用 $F$ 表示 $P\{a<X\le b\}$、$P\{X=a\}$、$P\{X<a\}$？`,
    a: r`① 单调不减；② $F(-\infty)=0$，$F(+\infty)=1$；③ **右连续** $F(x^+)=F(x)$。
$P\{a<X\le b\}=F(b)-F(a)$；$P\{X=a\}=F(a)-F(a^-)$；$P\{X<a\}=F(a^-)$；$P\{X\ge a\}=1-F(a^-)$。`,
    trap: r`定义是 $X\le x$（含等号），所以右连续。判断一个函数能否作分布函数就看这三条，尤其是右连续与极限值。`,
  },
  {
    sec: '常见离散分布', k: 'qa', s: 3,
    q: '0–1 分布、二项分布、泊松分布、几何分布、超几何分布的分布律、期望与方差',
    a: r`| 分布 | 分布律 | $E$ | $D$ |
|---|---|---|---|
| $B(1,p)$ | $P\{X=k\}=p^k(1-p)^{1-k},k=0,1$ | $p$ | $p(1-p)$ |
| $B(n,p)$ | $C_n^kp^k(1-p)^{n-k},k=0..n$ | $np$ | $np(1-p)$ |
| $P(\lambda)$ | $\dfrac{\lambda^k}{k!}e^{-\lambda},k=0,1,\dots$ | $\lambda$ | $\lambda$ |
| 几何 $G(p)$ | $(1-p)^{k-1}p,k=1,2,\dots$ | $\dfrac1p$ | $\dfrac{1-p}{p^2}$ |
| 超几何 | $\dfrac{C_M^kC_{N-M}^{n-k}}{C_N^n}$ | $\dfrac{nM}{N}$ | — |`,
    cond: r`泊松：$\lambda>0$；几何分布表示「首次成功在第 $k$ 次」，具有无记忆性。`,
    hook: r`泊松定理：$n$ 大 $p$ 小时 $B(n,p)\approx P(np)$。`,
  },
  {
    sec: '常见连续分布', k: 'qa', s: 3,
    q: '均匀分布、指数分布、正态分布的密度、分布函数、期望与方差',
    a: r`**均匀** $U(a,b)$：$f=\dfrac1{b-a}\ (a<x<b)$；$E=\dfrac{a+b}2$，$D=\dfrac{(b-a)^2}{12}$。
**指数** $E(\lambda)$：$f=\lambda e^{-\lambda x}\ (x>0)$，$F=1-e^{-\lambda x}\ (x>0)$；$E=\dfrac1\lambda$，$D=\dfrac1{\lambda^2}$；**无记忆性** $P\{X>s+t\mid X>s\}=P\{X>t\}$。
**正态** $N(\mu,\sigma^2)$：$f=\dfrac1{\sqrt{2\pi}\sigma}e^{-\frac{(x-\mu)^2}{2\sigma^2}}$；$E=\mu$，$D=\sigma^2$；标准化 $\dfrac{X-\mu}\sigma\sim N(0,1)$。`,
    cond: r`$\lambda>0$，$\sigma>0$。标准正态 $\Phi(-x)=1-\Phi(x)$，$\Phi(0)=\frac12$。`,
    trap: r`指数分布参数 $\lambda$ 与期望互为倒数；若题目给的是 $f=\frac1\theta e^{-x/\theta}$，则 $E=\theta$。`,
  },
  {
    sec: '常见连续分布', k: 'cloze', s: 3,
    q: r`$X\sim N(\mu,\sigma^2)$，则 $P\{a<X\le b\}=⟦\Phi\Big(\dfrac{b-\mu}\sigma\Big)-\Phi\Big(\dfrac{a-\mu}\sigma\Big)⟧$；$P\{|X-\mu|<\sigma\}\approx⟦0.6826⟧$；$aX+b\sim⟦N(a\mu+b,\ a^2\sigma^2)⟧\ (a\ne0)$`,
    hook: r`$P\{|X-\mu|<2\sigma\}\approx0.9544$，$<3\sigma$ 约 $0.9974$。密度关于 $x=\mu$ 对称，故 $P\{X\le\mu\}=\frac12$。`,
  },
  {
    sec: '随机变量函数', k: 'steps', s: 3,
    q: r`已知 $X$ 的密度 $f_X(x)$，求 $Y=g(X)$ 的密度 $f_Y(y)$ 的分布函数法步骤`,
    a: r`1. 确定 $Y$ 的取值范围（由 $X$ 的范围和 $g$ 决定），范围外 $f_Y=0$。
2. 对范围内的 $y$，写 $F_Y(y)=P\{Y\le y\}=P\{g(X)\le y\}$，解不等式化为关于 $X$ 的事件，用 $F_X$ 或积分表示。
3. 对 $y$ 求导得 $f_Y(y)=F_Y'(y)$（变限积分求导）。
4. $g$ 单调可导时可直接用公式 $f_Y(y)=f_X(h(y))|h'(y)|$，其中 $h=g^{-1}$。`,
    trap: r`$g$ 不单调（如 $Y=X^2$）必须分段：$F_Y(y)=P\{-\sqrt y\le X\le\sqrt y\}=F_X(\sqrt y)-F_X(-\sqrt y)$，$y>0$。`,
  },
]);

export const p3 = defineChapter('p3', [
  {
    sec: '联合分布', k: 'qa', s: 3,
    q: r`二维随机变量 $(X,Y)$ 的联合分布函数、边缘分布、条件分布怎么定义与计算？`,
    a: r`$F(x,y)=P\{X\le x,Y\le y\}$；$F_X(x)=F(x,+\infty)$。
**离散**：边缘 $p_{i\cdot}=\sum_jp_{ij}$；条件 $P\{X=x_i\mid Y=y_j\}=\dfrac{p_{ij}}{p_{\cdot j}}$。
**连续**：边缘 $f_X(x)=\displaystyle\int_{-\infty}^{+\infty}f(x,y)\,dy$；条件 $f_{X\mid Y}(x\mid y)=\dfrac{f(x,y)}{f_Y(y)}\ (f_Y(y)>0)$。
$P\{(X,Y)\in D\}=\displaystyle\iint_Df(x,y)\,dx\,dy$。`,
    trap: r`求边缘密度时积分限随 $x$ 变化（区域不是矩形时尤其注意），且要写出 $x$ 的取值范围。`,
  },
  {
    sec: '独立性', k: 'qa', s: 3,
    q: r`$X,Y$ 相互独立的充要条件（分布函数、密度、分布律三种表述）；独立的判别技巧`,
    a: r`$X,Y$ 独立 $\iff F(x,y)=F_X(x)F_Y(y)$ 对一切 $x,y$ 成立
$\iff f(x,y)=f_X(x)f_Y(y)$（几乎处处）$\iff p_{ij}=p_{i\cdot}p_{\cdot j}$ 对一切 $i,j$。
**技巧**：连续型独立的必要条件是 $f(x,y)$ 的非零区域为**矩形**（边平行坐标轴）且 $f$ 可分离变量；离散型独立时分布律表的行（列）成比例。
若 $X,Y$ 独立，则 $g(X)$ 与 $h(Y)$ 独立。`,
    trap: r`非零区域是三角形、圆盘 $\Rightarrow$ 一定不独立。二维正态 $(X,Y)$ 独立 $\iff\rho=0$（仅对二维正态成立）。`,
  },
  {
    sec: '常见二维分布', k: 'qa', s: 2,
    q: r`二维均匀分布与二维正态分布 $N(\mu_1,\mu_2;\sigma_1^2,\sigma_2^2;\rho)$ 的要点`,
    a: r`**二维均匀**：$f=\dfrac1{S_D}$（$(x,y)\in D$），概率 $=$ 面积比；边缘一般**不是**均匀分布（除非 $D$ 是矩形）。
**二维正态**：边缘 $X\sim N(\mu_1,\sigma_1^2)$，$Y\sim N(\mu_2,\sigma_2^2)$；$\rho$ 是相关系数；独立 $\iff\rho=0$；$aX+bY$（不全为零）服从一维正态；条件分布也是正态。`,
    trap: r`两个边缘都是正态推不出联合是二维正态；$X,Y$ 各自正态且**独立**时 $aX+bY\sim N(a\mu_1+b\mu_2,\ a^2\sigma_1^2+b^2\sigma_2^2)$。`,
  },
  {
    sec: '函数的分布', k: 'qa', s: 3,
    q: r`$X,Y$ 独立，$Z=X+Y$ 的卷积公式；$M=\max(X,Y)$、$N=\min(X,Y)$ 的分布函数`,
    a: r`**卷积**：$f_Z(z)=\displaystyle\int_{-\infty}^{+\infty}f_X(x)f_Y(z-x)\,dx=\int_{-\infty}^{+\infty}f_X(z-y)f_Y(y)\,dy$（不独立时用 $f(x,z-x)$）。
**最大值**：$F_M(z)=F_X(z)F_Y(z)$；**最小值**：$F_N(z)=1-[1-F_X(z)][1-F_Y(z)]$。
$n$ 个独立同分布：$F_{\max}=F^n$，$F_{\min}=1-(1-F)^n$。`,
    hook: r`可加性：独立时 $B(n_1,p)+B(n_2,p)=B(n_1+n_2,p)$，$P(\lambda_1)+P(\lambda_2)=P(\lambda_1+\lambda_2)$，$N(\mu_1,\sigma_1^2)+N(\mu_2,\sigma_2^2)=N(\mu_1+\mu_2,\sigma_1^2+\sigma_2^2)$，$\chi^2(n_1)+\chi^2(n_2)=\chi^2(n_1+n_2)$。`,
    trap: r`卷积积分限由「$f_X(x)\ne0$ 且 $f_Y(z-x)\ne0$」联立确定，要对 $z$ 分段。`,
  },
  {
    sec: '函数的分布', k: 'steps', s: 2,
    q: r`一个离散型 $X$ 与一个连续型 $Y$（独立）的函数 $Z=g(X,Y)$，求 $Z$ 的分布的步骤`,
    a: r`1. 对 $X$ 的每个取值 $x_i$ 用全概率公式：$F_Z(z)=\sum_iP\{X=x_i\}P\{g(x_i,Y)\le z\}$。
2. 每一项用 $Y$ 的分布函数表示（利用独立性去掉条件）。
3. 对 $z$ 分段整理，需要密度时再求导。
4. 检查 $F_Z$ 在分段点的连续性，判断 $Z$ 是否为连续型（若有跳跃则既非离散也非连续）。`,
  },
]);

export const p4 = defineChapter('p4', [
  {
    sec: '期望与方差', k: 'cloze', s: 3,
    q: r`$E(aX+bY+c)=⟦aE(X)+bE(Y)+c⟧$；$D(X)=E(X^2)-⟦[E(X)]^2⟧$；$D(aX+b)=⟦a^2D(X)⟧$；$D(X\pm Y)=D(X)+D(Y)⟦\pm2\operatorname{Cov}(X,Y)⟧$`,
    cond: r`期望线性性质**不需要**独立；$D(X\pm Y)=D(X)+D(Y)$ 需要 $X,Y$ 不相关（独立是充分条件）；$E(XY)=E(X)E(Y)$ 同样只需不相关。`,
    trap: r`$D(X-Y)=D(X)+D(Y)-2\operatorname{Cov}$，独立时仍是「加」：$D(X-Y)=D(X)+D(Y)$。`,
  },
  {
    sec: '期望与方差', k: 'cloze', s: 3,
    q: r`$Y=g(X)$：$E(Y)=⟦\displaystyle\int_{-\infty}^{+\infty}g(x)f(x)\,dx⟧$（连续）；$Z=g(X,Y)$：$E(Z)=⟦\displaystyle\iint g(x,y)f(x,y)\,dx\,dy⟧$`,
    cond: '要求相应积分（级数）绝对收敛，否则期望不存在（如柯西分布）。',
    hook: r`不必先求 $Y$ 的分布，直接对 $X$ 的密度积分（LOTUS）。`,
  },
  {
    sec: '协方差与相关系数', k: 'cloze', s: 3,
    q: r`$\operatorname{Cov}(X,Y)=E\{[X-EX][Y-EY]\}=⟦E(XY)-E(X)E(Y)⟧$；$\rho_{XY}=⟦\dfrac{\operatorname{Cov}(X,Y)}{\sqrt{D(X)}\sqrt{D(Y)}}⟧$；$\operatorname{Cov}(aX+bY,Z)=⟦a\operatorname{Cov}(X,Z)+b\operatorname{Cov}(Y,Z)⟧$；$\operatorname{Cov}(X,X)=⟦D(X)⟧$`,
    cond: r`$\rho$ 要求 $D(X)>0,D(Y)>0$。`,
  },
  {
    sec: '协方差与相关系数', k: 'qa', s: 3,
    q: '不相关与独立的关系；相关系数的含义与性质',
    a: r`**不相关**：$\rho=0\iff\operatorname{Cov}=0\iff E(XY)=E(X)E(Y)\iff D(X+Y)=D(X)+D(Y)$。
独立 $\Rightarrow$ 不相关；不相关 $\nRightarrow$ 独立（$\rho$ 只刻画**线性**关系）。
**例外**：二维正态、两点分布（0–1 分布）情形下，不相关 $\iff$ 独立。
$|\rho|\le1$；$|\rho|=1\iff$ 存在 $a\ne0,b$ 使 $P\{Y=aX+b\}=1$（$\rho=1$ 时 $a>0$）。`,
    trap: r`$X\sim U(-1,1)$，$Y=X^2$：$\operatorname{Cov}=E(X^3)-E(X)E(X^2)=0$，不相关但显然不独立。`,
  },
  {
    sec: '常用矩', k: 'qa', s: 2,
    q: r`$X\sim N(0,\sigma^2)$ 时 $E(X^2),E(X^4),E|X|$；$X\sim E(\lambda)$ 时 $E(X^2)$；$X\sim P(\lambda)$ 时 $E(X^2)$`,
    a: r`$N(0,\sigma^2)$：$E(X^2)=\sigma^2$，$E(X^4)=3\sigma^4$，$E|X|=\sigma\sqrt{\dfrac2\pi}$。
$E(\lambda)$：$E(X^2)=D+E^2=\dfrac2{\lambda^2}$。
$P(\lambda)$：$E(X^2)=\lambda+\lambda^2$。
通用：$E(X^2)=D(X)+[E(X)]^2$。`,
    hook: r`$E(X^4)$ 用 $\int x^4e^{-x^2/2}dx$ 分部或 $\chi^2$ 的方差 $D(X^2/\sigma^2)=2$ 反推。`,
  },
]);

export const p5 = defineChapter('p5', [
  {
    sec: '不等式与大数定律', k: 'cloze', s: 3,
    q: r`切比雪夫不等式：$P\{|X-EX|\ge\varepsilon\}\le⟦\dfrac{D(X)}{\varepsilon^2}⟧$，等价地 $P\{|X-EX|<\varepsilon\}\ge⟦1-\dfrac{D(X)}{\varepsilon^2}⟧$`,
    cond: r`$D(X)$ 存在，$\varepsilon>0$。`,
  },
  {
    sec: '不等式与大数定律', k: 'qa', s: 3,
    q: '切比雪夫、伯努利、辛钦三个大数定律的条件与结论',
    a: r`**依概率收敛**：$\forall\varepsilon>0$，$\lim\limits_{n\to\infty}P\{|Y_n-a|<\varepsilon\}=1$，记 $Y_n\xrightarrow{P}a$。
**切比雪夫**：$X_i$ 两两不相关（或独立），方差存在且**有共同上界** $\Rightarrow\frac1n\sum X_i-\frac1n\sum EX_i\xrightarrow{P}0$。
**伯努利**：$n$ 重伯努利试验中频率 $\frac{n_A}{n}\xrightarrow{P}p$。
**辛钦**：$X_i$ **独立同分布**且 $EX_i=\mu$ 存在（不要求方差）$\Rightarrow\frac1n\sum X_i\xrightarrow{P}\mu$。`,
    trap: r`辛钦不需要方差存在，但需要独立同分布；切比雪夫不需要同分布，但需要方差一致有界。`,
  },
  {
    sec: '中心极限定理', k: 'cloze', s: 3,
    q: r`列维–林德伯格：$X_i$ 独立同分布，$EX_i=\mu,\ DX_i=\sigma^2>0$，则 $\displaystyle\lim_{n\to\infty}P\Big\{\dfrac{\sum X_i-n\mu}{\sqrt n\,\sigma}\le x\Big\}=⟦\Phi(x)⟧$，即 $\sum X_i$ 近似服从 ⟦$N(n\mu,n\sigma^2)$⟧；棣莫弗–拉普拉斯：$B(n,p)$ 近似 ⟦$N(np,np(1-p))$⟧`,
    hook: r`解题四步：写出 $\sum X_i$ 的 $E,D$ → 标准化 → 用 $\Phi$ 表示 → 查表。`,
  },
]);

export const p6 = defineChapter('p6', [
  {
    sec: '统计量', k: 'cloze', s: 3,
    q: r`样本均值 $\bar X=⟦\dfrac1n\displaystyle\sum X_i⟧$，样本方差 $S^2=⟦\dfrac1{n-1}\displaystyle\sum(X_i-\bar X)^2⟧$；总体 $EX=\mu,DX=\sigma^2$ 时 $E\bar X=⟦\mu⟧$，$D\bar X=⟦\dfrac{\sigma^2}n⟧$，$E(S^2)=⟦\sigma^2⟧$`,
    cond: r`$X_1,\dots,X_n$ 为简单随机样本（独立同分布）。分母 $n-1$ 保证 $S^2$ 无偏；$\frac1n\sum(X_i-\bar X)^2$ 是有偏的。`,
    hook: r`$\sum(X_i-\bar X)^2=\sum X_i^2-n\bar X^2$。`,
  },
  {
    sec: '三大分布', k: 'qa', s: 3,
    q: r`$\chi^2$ 分布、$t$ 分布、$F$ 分布的定义（典型模式）与主要性质`,
    a: r`**$\chi^2(n)$**：$X_i\overset{iid}\sim N(0,1)$，$\sum_{i=1}^nX_i^2\sim\chi^2(n)$；$E=n$，$D=2n$；可加性。
**$t(n)$**：$X\sim N(0,1)$，$Y\sim\chi^2(n)$，独立，$\dfrac{X}{\sqrt{Y/n}}\sim t(n)$；密度关于 0 对称，$n\to\infty$ 趋于 $N(0,1)$；$t_{1-\alpha}(n)=-t_\alpha(n)$。
**$F(n_1,n_2)$**：$U\sim\chi^2(n_1)$，$V\sim\chi^2(n_2)$，独立，$\dfrac{U/n_1}{V/n_2}\sim F(n_1,n_2)$；$\dfrac1F\sim F(n_2,n_1)$；$F_{1-\alpha}(n_1,n_2)=\dfrac1{F_\alpha(n_2,n_1)}$；$t^2(n)\sim F(1,n)$。`,
    trap: r`识别分布时，分子分母必须**独立**，且 $\chi^2$ 要除以自己的自由度。`,
  },
  {
    sec: '正态总体抽样分布', k: 'qa', s: 3,
    q: r`单个正态总体 $N(\mu,\sigma^2)$ 的四个抽样分布定理`,
    a: r`① $\bar X\sim N\Big(\mu,\dfrac{\sigma^2}n\Big)$，即 $\dfrac{\bar X-\mu}{\sigma/\sqrt n}\sim N(0,1)$；
② $\dfrac{(n-1)S^2}{\sigma^2}\sim\chi^2(n-1)$，且 $\bar X$ 与 $S^2$ **相互独立**；
③ $\dfrac{\bar X-\mu}{S/\sqrt n}\sim t(n-1)$；
④ $\dfrac1{\sigma^2}\displaystyle\sum_{i=1}^n(X_i-\mu)^2\sim\chi^2(n)$。`,
    hook: r`② 由 ①④ 推出：用 $\bar X$ 代替 $\mu$ 少一个自由度；$D(S^2)=\frac{2\sigma^4}{n-1}$。`,
    trap: r`「$\bar X$ 与 $S^2$ 独立」只对正态总体成立。`,
  },
  {
    sec: '正态总体抽样分布', k: 'cloze', s: 2,
    q: r`两个独立正态总体 $N(\mu_1,\sigma^2),N(\mu_2,\sigma^2)$（方差相等）：$\dfrac{(\bar X-\bar Y)-(\mu_1-\mu_2)}{S_w\sqrt{\frac1{n_1}+\frac1{n_2}}}\sim⟦t(n_1+n_2-2)⟧$，其中 $S_w^2=⟦\dfrac{(n_1-1)S_1^2+(n_2-1)S_2^2}{n_1+n_2-2}⟧$；方差不等时 $\dfrac{S_1^2/\sigma_1^2}{S_2^2/\sigma_2^2}\sim⟦F(n_1-1,n_2-1)⟧$`,
  },
  {
    sec: '参数估计', k: 'steps', s: 3,
    q: '矩估计法的步骤',
    a: r`1. 求总体的一阶原点矩 $E(X)=\mu_1(\theta)$（若含 $k$ 个参数则求到 $k$ 阶矩，或用 $E(X)$ 与 $D(X)$）。
2. 令总体矩等于样本矩：$\mu_1(\theta)=\bar X$（二阶：$E(X^2)=\frac1n\sum X_i^2$，或 $D(X)=\frac1n\sum(X_i-\bar X)^2$）。
3. 解出 $\hat\theta$，用 $\bar X$ 等表示。
4. 若 $E(X)$ 不含 $\theta$（如 $U(-\theta,\theta)$），改用二阶矩。`,
    trap: r`矩估计中样本二阶中心矩用 $\frac1n\sum(X_i-\bar X)^2$，不是 $S^2$。`,
  },
  {
    sec: '参数估计', k: 'steps', s: 3,
    q: '最大似然估计法的步骤（含似然函数单调、驻点不存在的情形）',
    a: r`1. 写似然函数 $L(\theta)=\prod_{i=1}^nf(x_i;\theta)$（离散用 $\prod p(x_i;\theta)$），并写清 $x_i$ 的取值范围对 $\theta$ 的限制。
2. 取对数 $\ln L$，对 $\theta$ 求导，令 $\dfrac{d\ln L}{d\theta}=0$ 解出 $\hat\theta$（多参数解方程组）。
3. 若 $\ln L$ 关于 $\theta$ **单调**（导数恒正 / 恒负），则最大值在 $\theta$ 取值范围的**边界**处取到，如 $U(0,\theta)$ 的 $\hat\theta=\max X_i$。
4. 把 $x_i$ 换成 $X_i$ 写出估计量。
不变性：$\hat\theta$ 是 $\theta$ 的 MLE，则 $g(\hat\theta)$ 是 $g(\theta)$ 的 MLE。`,
    hook: r`正态总体：$\hat\mu=\bar X$，$\hat\sigma^2=\frac1n\sum(X_i-\bar X)^2$（不是 $S^2$）。`,
  },
  {
    sec: '估计量评价', k: 'qa', s: 3,
    q: '无偏性、有效性、一致性（相合性）的定义',
    a: r`**无偏**：$E(\hat\theta)=\theta$（对一切 $\theta$）。
**有效**：$\hat\theta_1,\hat\theta_2$ 均无偏，$D(\hat\theta_1)<D(\hat\theta_2)$ 则 $\hat\theta_1$ 更有效。
**一致（相合）**：$\hat\theta_n\xrightarrow{P}\theta$；充分条件：$E\hat\theta_n\to\theta$ 且 $D\hat\theta_n\to0$。`,
    trap: r`$S^2$ 是 $\sigma^2$ 的无偏估计，但 $S$ **不是** $\sigma$ 的无偏估计（$E(S)<\sigma$）；无偏估计的函数一般不再无偏。`,
  },
  {
    sec: '区间估计', k: 'qa', s: 3,
    q: r`单个正态总体均值 $\mu$ 的置信区间（$\sigma^2$ 已知 / 未知）与方差 $\sigma^2$ 的置信区间（置信水平 $1-\alpha$）`,
    a: r`**$\sigma^2$ 已知**：$\Big(\bar X\pm\dfrac{\sigma}{\sqrt n}z_{\alpha/2}\Big)$。
**$\sigma^2$ 未知**：$\Big(\bar X\pm\dfrac{S}{\sqrt n}t_{\alpha/2}(n-1)\Big)$。
**$\sigma^2$**（$\mu$ 未知）：$\Big(\dfrac{(n-1)S^2}{\chi^2_{\alpha/2}(n-1)},\ \dfrac{(n-1)S^2}{\chi^2_{1-\alpha/2}(n-1)}\Big)$。`,
    cond: r`$z_\alpha$ 表示上 $\alpha$ 分位点：$P\{Z>z_\alpha\}=\alpha$。区间长度 $2\frac\sigma{\sqrt n}z_{\alpha/2}$ 随 $n$ 增大而缩短，随置信水平提高而变长。`,
  },
  {
    sec: '假设检验', k: 'qa', s: 3,
    q: '假设检验的基本思想、两类错误、以及单个正态总体均值的 Z 检验与 t 检验的拒绝域',
    a: r`**思想**：小概率原理 —— 在 $H_0$ 成立的前提下，若样本落入概率仅为 $\alpha$ 的拒绝域，则拒绝 $H_0$。
**第一类错误**（弃真）：$H_0$ 真却拒绝，$P=\alpha$（显著性水平）；**第二类错误**（取伪）：$H_0$ 假却接受，$P=\beta$。$n$ 固定时 $\alpha$ 减小 $\beta$ 增大。
**$H_0:\mu=\mu_0$ vs $H_1:\mu\ne\mu_0$**：
$\sigma$ 已知（Z 检验）：拒绝域 $|Z|=\Big|\dfrac{\bar X-\mu_0}{\sigma/\sqrt n}\Big|\ge z_{\alpha/2}$；
$\sigma$ 未知（t 检验）：$|t|=\Big|\dfrac{\bar X-\mu_0}{S/\sqrt n}\Big|\ge t_{\alpha/2}(n-1)$。
单侧 $H_1:\mu>\mu_0$：拒绝域 $Z\ge z_\alpha$（或 $t\ge t_\alpha(n-1)$）。`,
    trap: r`「接受 $H_0$」只是「没有充分证据拒绝」，不等于证明 $H_0$ 为真。大纲对假设检验的要求是「了解」，重点是两类错误概念与正态总体均值、方差的检验。`,
  },
]);

export const M1_PR_CARDS: KCard[] = [...p1, ...p2, ...p3, ...p4, ...p5, ...p6];
