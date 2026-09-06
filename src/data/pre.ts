import { defineChapter, r } from './types';

export const pre = defineChapter('pre', [
  {
    sec: '三角公式', k: 'cloze', s: 3,
    q: r`倍角公式：$\sin 2x = ⟦2\sin x\cos x⟧$，$\cos 2x = \cos^2x-\sin^2x = ⟦2\cos^2 x - 1⟧ = ⟦1-2\sin^2 x⟧$`,
    hook: '余弦倍角三种写法都要熟，积分里常用它「降幂」。',
  },
  {
    sec: '三角公式', k: 'cloze', s: 3,
    q: r`降幂公式：$\sin^2 x = ⟦\dfrac{1-\cos 2x}{2}⟧$，$\cos^2 x = ⟦\dfrac{1+\cos 2x}{2}⟧$`,
    hook: '「正弦减、余弦加」——从 cos2x 的两种展开反解而来。',
    trap: r`$\int \sin^2 x\,dx$、$\int\cos^2 x\,dx$ 必须先降幂，别死记结果。`,
  },
  {
    sec: '三角公式', k: 'cloze', s: 2,
    q: r`万能公式（令 $t=\tan\frac{x}{2}$）：$\sin x = ⟦\dfrac{2t}{1+t^2}⟧$，$\cos x = ⟦\dfrac{1-t^2}{1+t^2}⟧$，$dx = ⟦\dfrac{2\,dt}{1+t^2}⟧$`,
    hook: '三角有理式积分的最后手段；能用 u=tan x 或 u=sin/cos 换元就别用万能代换。',
  },
  {
    sec: '三角公式', k: 'cloze', s: 3,
    q: r`平方关系：$1+\tan^2 x = ⟦\sec^2 x⟧$，$1+\cot^2 x = ⟦\csc^2 x⟧$`,
    hook: r`两边同除 $\cos^2x$ 或 $\sin^2 x$ 即得。积分中 $\sqrt{1+x^2}$ 令 $x=\tan t$ 就靠它。`,
  },
  {
    sec: '三角公式', k: 'qa', s: 2,
    q: '积化和差三个公式（sin·cos，cos·cos，sin·sin）',
    a: r`$$\sin\alpha\cos\beta=\tfrac12[\sin(\alpha+\beta)+\sin(\alpha-\beta)]$$
$$\cos\alpha\cos\beta=\tfrac12[\cos(\alpha+\beta)+\cos(\alpha-\beta)]$$
$$\sin\alpha\sin\beta=-\tfrac12[\cos(\alpha+\beta)-\cos(\alpha-\beta)]$$`,
    hook: '只有 sin·sin 前面带负号；结果里「同名得 cos，异名得 sin」。',
  },
  {
    sec: '三角公式', k: 'qa', s: 2,
    q: '和差化积公式（sin+sin，sin−sin，cos+cos，cos−cos）',
    a: r`$$\sin\alpha+\sin\beta=2\sin\tfrac{\alpha+\beta}{2}\cos\tfrac{\alpha-\beta}{2}$$
$$\sin\alpha-\sin\beta=2\cos\tfrac{\alpha+\beta}{2}\sin\tfrac{\alpha-\beta}{2}$$
$$\cos\alpha+\cos\beta=2\cos\tfrac{\alpha+\beta}{2}\cos\tfrac{\alpha-\beta}{2}$$
$$\cos\alpha-\cos\beta=-2\sin\tfrac{\alpha+\beta}{2}\sin\tfrac{\alpha-\beta}{2}$$`,
    hook: '口诀：正加正，正在前；正减正，余在前；余加余，余并肩；余减余，负正弦。',
  },
  {
    sec: '反三角函数', k: 'cloze', s: 3,
    q: r`$\arcsin x+\arccos x = ⟦\dfrac{\pi}{2}⟧$，$\arctan x+\operatorname{arccot} x = ⟦\dfrac{\pi}{2}⟧$，$\arctan x+\arctan\dfrac1x = ⟦\dfrac{\pi}{2}⟧\ (x>0)$`,
    trap: r`$x<0$ 时 $\arctan x+\arctan\frac1x=-\frac{\pi}{2}$。$\arcsin$ 值域 $[-\frac\pi2,\frac\pi2]$，$\arccos$ 值域 $[0,\pi]$，$\arctan$ 值域 $(-\frac\pi2,\frac\pi2)$。`,
  },
  {
    sec: '数列求和', k: 'cloze', s: 2,
    q: r`$\displaystyle\sum_{k=1}^n k = ⟦\frac{n(n+1)}{2}⟧$，$\displaystyle\sum_{k=1}^n k^2 = ⟦\frac{n(n+1)(2n+1)}{6}⟧$，$\displaystyle\sum_{k=1}^n k^3 = ⟦\Big[\frac{n(n+1)}{2}\Big]^2⟧$`,
    hook: '立方和 = 和的平方。夹逼求极限时需要它们的最高次项。',
  },
  {
    sec: '数列求和', k: 'cloze', s: 2,
    q: r`等比数列前 $n$ 项和（$q\neq1$）：$\displaystyle\sum_{k=0}^{n-1} a q^k = ⟦\frac{a(1-q^n)}{1-q}⟧$；$|q|<1$ 时 $\displaystyle\sum_{k=0}^{\infty} aq^k=⟦\frac{a}{1-q}⟧$`,
  },
  {
    sec: '代数恒等式', k: 'cloze', s: 2,
    q: r`$a^n-b^n = (a-b)\,⟦(a^{n-1}+a^{n-2}b+\cdots+ab^{n-2}+b^{n-1})⟧$`,
    hook: r`用于 $\lim\frac{x^n-1}{x-1}=n$ 及 $\sqrt[n]{1+x}-1$ 的有理化。`,
  },
  {
    sec: '重要不等式', k: 'qa', s: 3,
    q: '考研常用的 6 个基本不等式（含三角、对数、指数、均值）',
    a: r`1. $|a\pm b|\le|a|+|b|$，$\big||a|-|b|\big|\le|a-b|$
2. $\sqrt{ab}\le\dfrac{a+b}{2}\le\sqrt{\dfrac{a^2+b^2}{2}}\ (a,b>0)$
3. $\sin x<x<\tan x\ \ (0<x<\frac\pi2)$
4. $\dfrac{x}{1+x}<\ln(1+x)<x\ \ (x>0)$
5. $e^x\ge 1+x$（$x=0$ 取等），$\ln x\le x-1$
6. $\arctan x\le x\le\arcsin x\ \ (0\le x<1)$`,
    hook: '不等式 3、4、5 都是「切线放缩」：在 x=0 处的切线夹住曲线。',
  },
  {
    sec: '初等函数', k: 'cloze', s: 2, status: 'pending',
    cond: '考试大纲未单列双曲函数（仅同济教材第一章介绍），是否需要识记待 2027 正式大纲确认；此卡不进入默认复习队列。',
    q: r`双曲函数：$\sinh x = ⟦\dfrac{e^x-e^{-x}}{2}⟧$，$\cosh x = ⟦\dfrac{e^x+e^{-x}}{2}⟧$，$\cosh^2x-\sinh^2x = ⟦1⟧$，$(\sinh x)'=⟦\cosh x⟧$`,
    hook: '悬链线 y = a cosh(x/a) 的弧长题常考。',
  },
  {
    sec: '常见曲线', k: 'qa', s: 3,
    q: '写出下列曲线的方程：心形线、双纽线、阿基米德螺线、摆线、星形线',
    a: r`**心形线** $r=a(1+\cos\theta)$（面积 $\frac32\pi a^2$，全长 $8a$）
**双纽线** $r^2=a^2\cos2\theta$（$\theta\in[-\frac\pi4,\frac\pi4]\cup[\frac{3\pi}4,\frac{5\pi}4]$）
**阿基米德螺线** $r=a\theta$
**摆线** $x=a(t-\sin t),\ y=a(1-\cos t)$（一拱面积 $3\pi a^2$，弧长 $8a$）
**星形线** $x=a\cos^3t,\ y=a\sin^3t$，即 $x^{2/3}+y^{2/3}=a^{2/3}$（面积 $\frac38\pi a^2$，全长 $6a$）`,
    hook: '心形线 2 条腿是 1+cosθ；双纽线两个瓣，所以是 r² 与 cos2θ。',
  },
  {
    sec: '代数恒等式', k: 'cloze', s: 1,
    q: r`双阶乘：$(2n)!! = ⟦2^n\,n!⟧$，$(2n-1)!! = ⟦\dfrac{(2n)!}{2^n\,n!}⟧$`,
    hook: '华里士公式的分子分母就是双阶乘。',
  },
  {
    sec: '几何公式', k: 'cloze', s: 2,
    q: r`球体积 $⟦\frac43\pi R^3⟧$，球面积 $⟦4\pi R^2⟧$，椭圆面积 $⟦\pi ab⟧$，扇形面积 $⟦\frac12 r^2\theta⟧$，圆锥体积 $⟦\frac13\pi r^2 h⟧$`,
    hook: '定积分里遇到 ∫√(a²−x²) 直接用几何意义：四分之一圆面积。',
  },
  {
    sec: '函数性质', k: 'qa', s: 2,
    q: '奇偶函数的运算规律；任一函数如何拆成奇函数与偶函数之和？',
    a: r`奇×奇=偶，偶×偶=偶，奇×偶=奇；奇±奇=奇，偶±偶=偶。
$f(x)+f(-x)$ 为偶函数，$f(x)-f(-x)$ 为奇函数。
任意 $f(x)=\underbrace{\tfrac{f(x)+f(-x)}{2}}_{\text{偶}}+\underbrace{\tfrac{f(x)-f(-x)}{2}}_{\text{奇}}$`,
    trap: r`$f(x)$ 为偶函数不代表 $f(x+1)$ 是偶函数；复合函数 $f(g(x))$：内偶则偶，内奇则同外。`,
  },
  {
    sec: '函数性质', k: 'cloze', s: 2,
    q: r`若 $f(x)$ 以 $T$ 为周期，则 $f(ax+b)\ (a\ne0)$ 的周期为 $⟦\dfrac{T}{|a|}⟧$；周期函数的导函数 ⟦仍是周期函数⟧，但原函数 ⟦不一定⟧ 是周期函数`,
    trap: r`$\int_0^x \sin t\,dt = 1-\cos x$ 仍是周期函数，但 $\int_0^x (1+\sin t)\,dt = x+1-\cos x$ 不是。判据：$\int_0^T f(x)\,dx=0$ 时原函数才是周期的。`,
  },
  {
    sec: '函数性质', k: 'qa', s: 2,
    q: '反函数的图像关系与求导公式',
    a: r`$y=f(x)$ 与 $x=f^{-1}(y)$ 是**同一条曲线**；$y=f^{-1}(x)$ 与 $y=f(x)$ 关于直线 $y=x$ 对称。
$$\big(f^{-1}\big)'(y)=\frac{1}{f'(x)},\qquad \frac{d^2x}{dy^2}=-\frac{y''}{(y')^3}$$
**严格单调**函数必有反函数，且反函数与原函数单调性相同。`,
    cond: r`求导公式要求 $f$ 可导且 $f'(x)\ne0$；二阶公式还要求 $f''$ 存在。`,
    trap: r`「单调函数必有反函数」应写成「严格单调」；反之，有反函数的函数不一定单调，如 $f(x)=\begin{cases}x,&x\in\mathbb{Q}\\-x,&x\notin\mathbb{Q}\end{cases}$ 是一一对应但处处不单调。仅当 $f$ 在区间上**连续**时，「有反函数 $\iff$ 严格单调」。二阶导公式别写成 $1/y''$：要对 $1/y'$ 关于 $y$ 再求导，乘一个 $dx/dy$。`,
  },
]);
