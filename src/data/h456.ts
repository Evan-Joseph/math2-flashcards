import { defineChapter, r } from './types';

export const h4 = defineChapter('h4', [
  {
    sec: '极限与连续', k: 'qa', s: 3,
    q: '二元函数极限的定义特点；如何证明二元极限不存在？',
    a: r`$\lim\limits_{(x,y)\to(x_0,y_0)}f(x,y)=A$ 要求点 $(x,y)$ 以**任意方式**趋于 $(x_0,y_0)$ 时 $f\to A$。
证明不存在：取两条不同路径（如 $y=kx$、$y=kx^2$）得到不同极限，或沿某路径极限不存在。
求极限：夹逼（$|xy|\le\frac{x^2+y^2}{2}$）、极坐标 $x=r\cos\theta,y=r\sin\theta$（结果须与 $\theta$ 无关）、等价无穷小。`,
    trap: r`沿所有直线 $y=kx$ 极限相同也不能说明极限存在，如 $\frac{x^2y}{x^4+y^2}$ 沿 $y=kx^2$ 得 $\frac{k}{1+k^2}$。`,
  },
  {
    sec: '偏导与全微分', k: 'qa', s: 3,
    q: '二元函数连续、偏导存在、可微、偏导连续之间的关系图',
    a: r`$$\text{偏导数连续}\ \Rightarrow\ \text{可微}\ \Rightarrow\ \begin{cases}\text{连续}\\ \text{偏导数存在}\end{cases}$$
所有箭头都**不可逆**；且「连续」与「偏导存在」**互不蕴含**。
反例：$f=\sqrt{x^2+y^2}$ 在原点连续但偏导不存在；$f=\begin{cases}\frac{xy}{x^2+y^2},&(x,y)\ne0\\0\end{cases}$ 在原点偏导存在（都为 0）但不连续。`,
    hook: '与一元最大区别：偏导存在 ⇏ 连续。因为偏导只管两条坐标轴方向。',
  },
  {
    sec: '偏导与全微分', k: 'cloze', s: 3,
    q: r`$f_x(x_0,y_0)=\lim\limits_{\Delta x\to0}⟦\dfrac{f(x_0+\Delta x,y_0)-f(x_0,y_0)}{\Delta x}⟧$；求 $f_x(x_0,y_0)$ 的技巧：先令 ⟦$y=y_0$⟧ 得一元函数 $f(x,y_0)$ 再对 $x$ 求导`,
    trap: r`分段函数在分段点处的偏导数**必须用定义**求。`,
  },
  {
    sec: '偏导与全微分', k: 'steps', s: 3,
    q: r`判断 $f(x,y)$ 在 $(x_0,y_0)$ 处是否可微的标准步骤`,
    a: r`1. 检查连续性：若不连续，直接不可微。
2. 用定义求 $f_x(x_0,y_0)$、$f_y(x_0,y_0)$：若有一个不存在，不可微。
3. 计算极限
$$\lim_{(\Delta x,\Delta y)\to(0,0)}\frac{\Delta z-f_x\Delta x-f_y\Delta y}{\sqrt{\Delta x^2+\Delta y^2}}$$
若为 0 则可微，否则不可微（常取路径 $\Delta y=k\Delta x$ 验证不为 0）。
4. 可微时 $dz=f_x\,dx+f_y\,dy$。`,
  },
  {
    sec: '偏导与全微分', k: 'cloze', s: 2,
    q: r`二阶混合偏导数 $f_{xy}$ 与 $f_{yx}$ 相等的充分条件：两者在该点 ⟦连续⟧；全微分形式不变性：无论 $u,v$ 是自变量还是中间变量，都有 $dz=⟦\dfrac{\partial z}{\partial u}du+\dfrac{\partial z}{\partial v}dv⟧$`,
  },
  {
    sec: '复合函数求导', k: 'qa', s: 3,
    q: r`设 $z=f(u,v)$，$u=u(x,y)$，$v=v(x,y)$，写出 $\frac{\partial z}{\partial x}$；抽象函数记号 $f_1',f_{12}''$ 的含义与求二阶偏导的要点`,
    a: r`$$\frac{\partial z}{\partial x}=f_1'\cdot\frac{\partial u}{\partial x}+f_2'\cdot\frac{\partial v}{\partial x}$$
$f_1'$ 表示对第一个位置变量求偏导，$f_{12}''$ 表示先对第一个再对第二个位置求导。
**要点**：$f_1'$、$f_2'$ 仍是 $u,v$ 的复合函数，再求导时要**继续用链式法则**：$\dfrac{\partial f_1'}{\partial y}=f_{11}''u_y+f_{12}''v_y$。`,
    trap: '最常见错误：对 f₁′ 再求导时忘记它依然是复合函数，漏掉 f₁₁″、f₁₂″ 项。',
  },
  {
    sec: '隐函数求导', k: 'cloze', s: 3,
    q: r`$F(x,y)=0$：$\dfrac{dy}{dx}=⟦-\dfrac{F_x}{F_y}⟧$；$F(x,y,z)=0$：$\dfrac{\partial z}{\partial x}=⟦-\dfrac{F_x}{F_z}⟧$，$\dfrac{\partial z}{\partial y}=⟦-\dfrac{F_y}{F_z}⟧$`,
    trap: r`公式中 $F_x$ 是把 $x,y,z$ 都看作独立变量求的偏导；负号别丢。求二阶偏导时建议直接对方程两边求导，把 $z$ 看成 $z(x,y)$。`,
  },
  {
    sec: '隐函数求导', k: 'qa', s: 2,
    q: '隐函数存在定理的条件与结论',
    a: r`设 $F(x,y,z)$ 在点 $P_0(x_0,y_0,z_0)$ 某邻域有连续偏导，$F(P_0)=0$，$F_z(P_0)\ne0$，则方程 $F(x,y,z)=0$ 在 $P_0$ 附近唯一确定一个连续可微函数 $z=z(x,y)$，满足 $z_0=z(x_0,y_0)$，且 $z_x=-\frac{F_x}{F_z},\ z_y=-\frac{F_y}{F_z}$。`,
    hook: r`$F_z\ne0$ 才能「解出 z」；若 $F_z=0$ 但 $F_x\ne0$，则可确定 $x=x(y,z)$。`,
  },
  {
    sec: '极值', k: 'qa', s: 3,
    q: '二元函数无条件极值的必要条件与充分条件（判别式）',
    a: r`**必要**：可偏导的极值点必为驻点 $f_x=f_y=0$。
**充分**：设驻点处 $A=f_{xx},B=f_{xy},C=f_{yy}$，
- $AC-B^2>0$：极值点，$A>0$ 极小，$A<0$ 极大；
- $AC-B^2<0$：不是极值点；
- $AC-B^2=0$：无法判定，需用定义（沿特殊路径比较）。`,
    trap: r`偏导不存在的点也可能是极值点（$z=\sqrt{x^2+y^2}$ 在原点取极小）。$AC-B^2=0$ 时用定义：考察 $f(x,y)-f(x_0,y_0)$ 在邻域内的符号。`,
  },
  {
    sec: '极值', k: 'steps', s: 3,
    q: r`拉格朗日乘数法求条件极值的步骤（约束 $\varphi(x,y,z)=0$）`,
    a: r`1. 构造 $L(x,y,z,\lambda)=f(x,y,z)+\lambda\varphi(x,y,z)$。
2. 解方程组 $L_x=L_y=L_z=0,\ \varphi=0$，得所有可能极值点。
3. 比较各点的 $f$ 值，由问题实际意义或有界闭区域上的最值存在性确定最大/最小。
多约束时 $L=f+\lambda\varphi+\mu\psi$。
技巧：解方程组时常用「消去 $\lambda$」——把前几个方程两两相除或交叉相乘。`,
    hook: '若约束可显式解出，直接代入化为无条件极值更快。',
  },
  {
    sec: '极值', k: 'steps', s: 3,
    q: '求有界闭区域 D 上连续函数的最大值与最小值的步骤',
    a: r`1. **内部**：求 $D$ 内部的驻点及偏导不存在的点，计算函数值。
2. **边界**：把边界方程代入化为一元函数求最值，或用拉格朗日乘数法；边界分段时每段分别做，并包含各段端点（角点）。
3. 比较所有候选值，最大者为最大值，最小者为最小值。`,
    trap: '边界上的一元函数求最值也要考虑该一元函数的端点。',
  },
  {
    sec: '复合函数求导', k: 'steps', s: 2,
    q: r`变量代换化简偏微分方程（如已知 $u=x+ay,v=x+by$，把关于 $z(x,y)$ 的方程化为关于 $u,v$ 的方程）的步骤`,
    a: r`1. 写出 $z_x=z_u u_x+z_v v_x$，$z_y=z_u u_y+z_v v_y$。
2. 对一阶结果再求导，注意 $z_u,z_v$ 仍是 $u,v$ 的函数，展开得 $z_{xx},z_{xy},z_{yy}$（含 $z_{uu},z_{uv},z_{vv}$）。
3. 代入原方程，合并同类项。
4. 通常要求某系数为 0 以确定 $a,b$，使方程化为 $z_{uv}=0$ 之类的简单形式，进而积分求通解 $z=\varphi(u)+\psi(v)$。`,
  },
  {
    sec: '偏导与全微分', k: 'judge', s: 2,
    q: r`若 $f(x,y)$ 在 $(x_0,y_0)$ 处两个偏导数都存在，则 $f$ 在该点连续。`,
    a: r`✗ 错误。偏导数只反映沿坐标轴方向的变化率。反例 $f=\begin{cases}\dfrac{xy}{x^2+y^2},&(x,y)\ne(0,0)\\0,&(x,y)=(0,0)\end{cases}$，$f_x(0,0)=f_y(0,0)=0$，但沿 $y=x$ 极限为 $\frac12\ne0$。`,
  },
  {
    sec: '极值', k: 'judge', s: 2,
    q: r`若 $(x_0,y_0)$ 是 $f(x,y)$ 的极值点，则 $x_0$ 是一元函数 $f(x,y_0)$ 的极值点，$y_0$ 是 $f(x_0,y)$ 的极值点。`,
    a: r`✓ 正确。因此若 $f(x,y_0)$ 在 $x_0$ 可导则 $f_x(x_0,y_0)=0$。反过来不成立：两个方向都是极值不代表二元极值（如 $z=xy$ 在原点沿两轴恒为 0，但不是极值点）。`,
  },
  {
    sec: '偏导与全微分', k: 'qa', s: 2,
    q: r`已知全微分 $dz=P(x,y)dx+Q(x,y)dy$，如何求 $z(x,y)$？`,
    a: r`方法一（偏积分）：$z=\int P\,dx+\varphi(y)$，再对 $y$ 求偏导与 $Q$ 比较确定 $\varphi'(y)$。
方法二（凑微分）：把 $P\,dx+Q\,dy$ 凑成 $d(\cdots)$ 的形式。
方法三（曲线积分，数一）。
先验条件：$P_y=Q_x$（数二题目通常直接给出可微前提）。`,
  },
  {
    sec: '极值', k: 'qa', s: 2,
    q: r`求 $z=f(x,y)$ 由方程 $F(x,y,z)=0$ 确定时的极值（隐函数极值）的步骤`,
    a: r`1. 对方程两边分别对 $x,y$ 求偏导，令 $z_x=z_y=0$，与原方程联立解出驻点 $(x_0,y_0,z_0)$。
2. 对一阶方程继续求导得 $z_{xx},z_{xy},z_{yy}$，代入驻点（此时 $z_x=z_y=0$ 简化计算）。
3. 用 $AC-B^2$ 判别。`,
    hook: r`代入 $z_x=z_y=0$ 后，二阶导公式中所有含 $z_x,z_y$ 的项都消失，计算量大减。`,
  },
]);

export const h5 = defineChapter('h5', [
  {
    sec: '概念与性质', k: 'qa', s: 2,
    q: '二重积分的几何意义及主要性质（线性、可加、比较、估值、中值）',
    a: r`$\iint_Df\,d\sigma$：$f\ge0$ 时为以 $D$ 为底、$z=f(x,y)$ 为顶的曲顶柱体体积；$\iint_D1\,d\sigma=D$ 的面积。
**比较**：$f\le g\Rightarrow\iint f\le\iint g$；**估值**：$mS\le\iint f\le MS$；
**中值定理**：$f\in C(D)\Rightarrow\exists(\xi,\eta)\in D$，$\iint_Df=f(\xi,\eta)\cdot S_D$。`,
    hook: r`比较两个二重积分大小：在 $D$ 上比较被积函数（注意 $D$ 内 $x+y$ 与 1 的大小决定 $(x+y)^2$ 与 $(x+y)^3$ 的大小）。`,
  },
  {
    sec: '直角坐标', k: 'qa', s: 3,
    q: 'X 型区域与 Y 型区域的化累次积分公式；交换积分次序的步骤',
    a: r`**X 型** $D:a\le x\le b,\ \varphi_1(x)\le y\le\varphi_2(x)$：$\int_a^bdx\int_{\varphi_1(x)}^{\varphi_2(x)}f\,dy$
**Y 型** $D:c\le y\le d,\ \psi_1(y)\le x\le\psi_2(y)$：$\int_c^ddy\int_{\psi_1(y)}^{\psi_2(y)}f\,dx$
**交换次序**：① 由累次积分限**画出** $D$；② 按另一类型重新写限（必要时分块）。`,
    trap: r`内层积分限可含外层变量，外层积分限必须是常数。`,
  },
  {
    sec: '直角坐标', k: 'qa', s: 3,
    q: '哪些被积函数「积不出来」，必须交换积分次序？',
    a: r`$$e^{\pm y^2},\quad \sin y^2,\quad\cos y^2,\quad\frac{\sin y}{y},\quad\frac{\cos y}{y},\quad\frac{1}{\ln y},\quad\frac{e^y}{y},\quad e^{\frac{1}{y}},\quad\sqrt{1+y^3}$$
（对 $x$ 同理）看到它们作为**内层**积分，先交换次序。`,
    hook: '「先 y 后 x 积不了就先 x 后 y」——这类题的考点就是交换次序本身。',
  },
  {
    sec: '极坐标', k: 'cloze', s: 3,
    q: r`极坐标换元：$x=r\cos\theta,\ y=r\sin\theta$，$dx\,dy=⟦r\,dr\,d\theta⟧$；一般 $\displaystyle\iint_Df\,d\sigma=\int_\alpha^\beta d\theta\int_{r_1(\theta)}^{r_2(\theta)}⟦f(r\cos\theta,r\sin\theta)\,r⟧\,dr$`,
    trap: '最常丢的就是那个 r！适用信号：圆域/扇形/环形；被积函数含 x²+y²、y/x、arctan(y/x)。',
  },
  {
    sec: '极坐标', k: 'cloze', s: 3,
    q: r`圆 $x^2+y^2=2ax$ 的极坐标方程 $r=⟦2a\cos\theta⟧$，$\theta\in⟦[-\frac\pi2,\frac\pi2]⟧$；圆 $x^2+y^2=2ay$：$r=⟦2a\sin\theta⟧$，$\theta\in⟦[0,\pi]⟧$`,
    hook: '圆心在 x 轴上 → cos；圆心在 y 轴上 → sin。极点在圆周上，r 从 0 开始。',
  },
  {
    sec: '对称性', k: 'qa', s: 3,
    q: '二重积分的奇偶对称性与轮换对称性',
    a: r`**奇偶对称**：若 $D$ 关于 $x$ 轴对称，则 $\iint_Df=\begin{cases}0,&f(x,-y)=-f(x,y)\\2\iint_{D_{y\ge0}}f,&f(x,-y)=f(x,y)\end{cases}$；$D$ 关于 $y$ 轴对称时看 $f$ 关于 $x$ 的奇偶性。
**轮换对称**：若 $D$ 关于直线 $y=x$ 对称，则 $\iint_Df(x,y)d\sigma=\iint_Df(y,x)d\sigma$。
应用：$\iint_Dx^2=\iint_Dy^2=\frac12\iint_D(x^2+y^2)$（$D$ 为圆域时）。`,
    trap: r`先用对称性去掉奇函数部分（如 $\iint_D(x+y^2)$ 在关于 $y$ 轴对称的 $D$ 上，$x$ 部分为 0），再算剩下的。`,
  },
  {
    sec: '极坐标', k: 'qa', s: 2,
    q: '极点在区域内部、边界上、外部三种情况下极坐标积分限怎么定？',
    a: r`**极点在 $D$ 内部**：$\theta\in[0,2\pi]$，$r\in[0,r(\theta)]$。
**极点在边界上**：$\theta\in[\alpha,\beta]$（由过极点的两条切线方向确定），$r\in[0,r(\theta)]$。
**极点在外部**：$\theta\in[\alpha,\beta]$，$r\in[r_1(\theta),r_2(\theta)]$（射线穿入、穿出的边界）。`,
    hook: '「从极点发射线」：射线先碰到的是下限，后离开的是上限。',
  },
  {
    sec: '计算技巧', k: 'cloze', s: 2,
    q: r`$\displaystyle\iint_{x^2+y^2\le R^2}\sqrt{R^2-x^2-y^2}\,d\sigma=⟦\frac23\pi R^3⟧$（半球体积）；$\displaystyle\iint_{x^2+y^2\le R^2}(x^2+y^2)\,d\sigma=⟦\frac{\pi R^4}{2}⟧$`,
    hook: r`第二个：$\int_0^{2\pi}d\theta\int_0^Rr^3dr=2\pi\cdot\frac{R^4}{4}$。`,
  },
  {
    sec: '计算技巧', k: 'cloze', s: 2,
    q: r`广义极坐标（椭圆域 $\frac{x^2}{a^2}+\frac{y^2}{b^2}\le1$）：$x=ar\cos\theta,\ y=br\sin\theta$，$dx\,dy=⟦ab\,r\,dr\,d\theta⟧$，$r\in⟦[0,1]⟧$`,
  },
  {
    sec: '计算技巧', k: 'steps', s: 2,
    q: r`含参数区域的二重积分函数 $F(t)=\iint_{x^2+y^2\le t^2}f(x^2+y^2)d\sigma$ 求导的步骤`,
    a: r`1. 极坐标化为累次积分：$F(t)=\int_0^{2\pi}d\theta\int_0^tf(r^2)\,r\,dr=2\pi\int_0^tf(r^2)r\,dr$。
2. 此时 $F(t)$ 是普通变上限积分，直接求导：$F'(t)=2\pi t f(t^2)$。
3. 若求 $\lim_{t\to0^+}\dfrac{F(t)}{t^k}$，洛必达或用 $F(t)\sim$ 首项。`,
    hook: '思路：二重积分 → 一元变限积分，永远先「降维」。',
  },
  {
    sec: '应用', k: 'qa', s: 2,
    q: '二重积分的应用：面积、体积、形心（质心）',
    a: r`面积 $S=\iint_Dd\sigma$；曲顶柱体体积 $V=\iint_D[f_上-f_下]d\sigma$。
形心：$\bar x=\dfrac{\iint_Dx\,d\sigma}{S}$，$\bar y=\dfrac{\iint_Dy\,d\sigma}{S}$（有密度 $\rho$ 时上下都乘 $\rho$）。
反用形心公式：$\iint_Dx\,d\sigma=\bar x\cdot S$，当 $D$ 是圆盘、三角形等已知形心的区域时可直接写出结果。`,
    hook: r`圆盘 $(x-a)^2+y^2\le R^2$ 上 $\iint x\,d\sigma=a\cdot\pi R^2$。`,
  },
  {
    sec: '直角坐标', k: 'judge', s: 2,
    q: r`$\displaystyle\int_0^1dx\int_0^xf(x,y)dy=\int_0^1dy\int_0^yf(x,y)dx$。`,
    a: r`✗ 错误。左边区域 $0\le y\le x\le1$，交换后应为 $\int_0^1dy\int_y^1f(x,y)dx$。交换次序一定要画图，不能机械地互换字母。`,
  },
  {
    sec: '计算技巧', k: 'qa', s: 2,
    q: '二重积分中「分块」的三个常见触发条件',
    a: r`1. 被积函数含**绝对值** $|y-x^2|$、**取整**、**max/min**、**分段函数**：按符号变化的曲线分块。
2. 区域的上（下）边界由**不同曲线**拼成：按交点分块（或换个方向积分避免分块）。
3. 极坐标下 $r$ 的上限由不同曲线给出：按 $\theta$ 分段。`,
    hook: r`$\iint_D|y-x^2|$：先画 $y=x^2$ 把 $D$ 一分为二，各去绝对值。`,
  },
  {
    sec: '概念与性质', k: 'judge', s: 1,
    q: r`若 $f(x,y)$ 在有界闭区域 $D$ 上连续且 $\iint_Df\,d\sigma=0$，则 $f\equiv0$。`,
    a: r`✗ 错误。需要额外条件 $f\ge0$（或 $f$ 不变号）。例如 $f=x$ 在单位圆上积分为 0 但不恒为零。`,
  },
]);

export const h6 = defineChapter('h6', [
  {
    sec: '一阶方程', k: 'qa', s: 3,
    q: '可分离变量方程与齐次方程的识别与解法',
    a: r`**可分离**：$\dfrac{dy}{dx}=f(x)g(y)\Rightarrow\int\dfrac{dy}{g(y)}=\int f(x)dx$。
**齐次**：$\dfrac{dy}{dx}=\varphi\Big(\dfrac yx\Big)$，令 $u=\dfrac yx$，$y'=u+xu'$，化为 $xu'=\varphi(u)-u$（可分离）。`,
    trap: r`分离变量时除以 $g(y)$ 会丢掉 $g(y)=0$ 的常数解；有初值时最后检查。若方程写成 $\frac{dx}{dy}=\cdots$ 形式更简单，就把 $x$ 看成 $y$ 的函数。`,
  },
  {
    sec: '一阶方程', k: 'cloze', s: 3,
    q: r`一阶线性方程 $y'+P(x)y=Q(x)$ 的通解公式：$y=⟦e^{-\int P\,dx}\Big(\int Q\,e^{\int P\,dx}dx+C\Big)⟧$`,
    hook: r`推导：两边乘积分因子 $e^{\int P dx}$，左边变成 $\big(ye^{\int P}\big)'$。公式中三处 $\int P$ 完全相同、不加常数。`,
    trap: r`用公式前必须把方程化成 $y'$ 系数为 1 的标准形式；分辨清楚 $P(x)$ 的符号。`,
  },
  {
    sec: '一阶方程', k: 'cloze', s: 1,
    q: r`伯努利方程 $y'+P(x)y=Q(x)y^n$：两边除以 $y^n$，令 $z=⟦y^{1-n}⟧$，得线性方程 $z'+⟦(1-n)P(x)⟧z=(1-n)Q(x)$`,
    hook: '数二大纲已不单列伯努利方程，但换元思想在题中仍会出现（作拓展）。',
  },
  {
    sec: '可降阶方程', k: 'qa', s: 3,
    q: '三类可降阶高阶方程的降阶方法',
    a: r`① $y^{(n)}=f(x)$：逐次积分 $n$ 次。
② $y''=f(x,y')$（**不显含 $y$**）：令 $p=y'$，$y''=p'$，化为关于 $p(x)$ 的一阶方程。
③ $y''=f(y,y')$（**不显含 $x$**）：令 $p=y'$，$y''=p\dfrac{dp}{dy}$，化为关于 $p(y)$ 的一阶方程。`,
    trap: r`类型③中 $y''=\frac{dp}{dx}=\frac{dp}{dy}\cdot\frac{dy}{dx}=p\frac{dp}{dy}$，别写成 $\frac{dp}{dy}$。有初值条件时**每积分一次就代入一次**确定常数。`,
  },
  {
    sec: '线性方程理论', k: 'qa', s: 3,
    q: '二阶线性微分方程解的结构（齐次、非齐次、叠加原理）',
    a: r`齐次 $y''+py'+qy=0$：若 $y_1,y_2$ 为线性无关解（$\frac{y_1}{y_2}\ne$常数），通解 $Y=C_1y_1+C_2y_2$。
非齐次 $y''+py'+qy=f(x)$：通解 $y=Y+y^*$（齐次通解 + 一个非齐次特解）。
**叠加原理**：$f=f_1+f_2$ 时，$y^*=y_1^*+y_2^*$。
**解的性质**：两个非齐次解之差是齐次解；非齐次解 + 齐次解仍是非齐次解。`,
    hook: r`若 $y_1,y_2,y_3$ 是非齐次方程三个线性无关解，则通解 $y=C_1(y_1-y_3)+C_2(y_2-y_3)+y_3$。`,
  },
  {
    sec: '常系数齐次', k: 'qa', s: 3,
    q: r`二阶常系数齐次 $y''+py'+qy=0$：特征方程与三种情形的通解`,
    a: r`特征方程 $r^2+pr+q=0$：
| 特征根 | 通解 |
|---|---|
| 两不等实根 $r_1\ne r_2$ | $y=C_1e^{r_1x}+C_2e^{r_2x}$ |
| 二重实根 $r_1=r_2=r$ | $y=(C_1+C_2x)e^{rx}$ |
| 共轭复根 $\alpha\pm\beta i$ | $y=e^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x)$ |`,
    hook: r`高阶同理：$k$ 重实根 $r$ 贡献 $(C_1+C_2x+\cdots+C_kx^{k-1})e^{rx}$；$k$ 重复根同样在三角项前配多项式。`,
  },
  {
    sec: '常系数非齐次', k: 'qa', s: 3,
    q: r`$f(x)=P_m(x)e^{\lambda x}$ 型的特解形式`,
    a: r`$$y^*=x^k\,Q_m(x)\,e^{\lambda x}$$
其中 $Q_m$ 是与 $P_m$ **同次**的待定多项式，$k=\begin{cases}0,&\lambda\text{ 不是特征根}\\1,&\lambda\text{ 是单特征根}\\2,&\lambda\text{ 是二重特征根}\end{cases}$`,
    trap: r`$f(x)=P_m(x)$（无指数）相当于 $\lambda=0$，此时看 0 是否为特征根。$Q_m$ 必须写全所有次数的项（如 $ax^2+bx+c$），不能只写最高次。`,
  },
  {
    sec: '常系数非齐次', k: 'qa', s: 3,
    q: r`$f(x)=e^{\lambda x}[P_l(x)\cos\omega x+P_n(x)\sin\omega x]$ 型的特解形式`,
    a: r`$$y^*=x^k\,e^{\lambda x}\big[R_m^{(1)}(x)\cos\omega x+R_m^{(2)}(x)\sin\omega x\big]$$
其中 $m=\max\{l,n\}$，$k=\begin{cases}0,&\lambda\pm\omega i\text{ 不是特征根}\\1,&\lambda\pm\omega i\text{ 是特征根}\end{cases}$`,
    trap: r`即使 $f$ 中只有 $\cos$（或只有 $\sin$），特解也**必须同时含 $\cos$ 和 $\sin$**。`,
  },
  {
    sec: '常系数非齐次', k: 'steps', s: 3,
    q: '求解二阶常系数非齐次线性方程的完整步骤',
    a: r`1. 写特征方程，求特征根，写出齐次通解 $Y$。
2. 根据 $f(x)$ 的类型判断 $\lambda$（或 $\lambda\pm\omega i$）是否为特征根，确定 $k$，设特解 $y^*$。
3. 把 $y^*$ 代入原方程，比较系数求出待定系数。
4. 通解 $y=Y+y^*$。
5. 有初始条件则代入求 $C_1,C_2$（注意 $y'$ 要对完整通解求导）。`,
  },
  {
    sec: '线性方程理论', k: 'steps', s: 3,
    q: '由已知的通解（或几个特解）反求微分方程的方法',
    a: r`1. 从通解中识别齐次部分的基本解组：$e^{r_1x}$、$xe^{rx}$、$e^{\alpha x}\cos\beta x$ 等 → 得特征根。
2. 由特征根写出特征方程 $(r-r_1)(r-r_2)=0$ → 展开得齐次方程。
3. 通解中剩余的不含任意常数的项就是特解 $y^*$，代入左端算出 $f(x)$。
例：$y=C_1e^x+C_2e^{2x}+xe^x$ → 特征根 $1,2$ → $y''-3y'+2y=f$，代入 $y^*=xe^x$ 得 $f=-e^x$。`,
    hook: r`已知非齐次三个特解：先两两相减得齐次解，再照上面做。`,
  },
  {
    sec: '应用', k: 'steps', s: 3,
    q: '微分方程几何应用题的建模流程',
    a: r`1. 设曲线 $y=y(x)$，过点 $(x,y)$。
2. 把题目中的几何量翻译为 $x,y,y'$ 的表达式：
   - 切线 $Y-y=y'(X-x)$；$y$ 轴截距 $y-xy'$，$x$ 轴截距 $x-\dfrac{y}{y'}$；
   - 法线 $Y-y=-\dfrac1{y'}(X-x)$；
   - 曲边梯形面积 $\int_a^xy\,dt$（含变限积分则两边求导）；
   - 旋转体体积 $\pi\int_a^xy^2dt$；弧长 $\int_a^x\sqrt{1+y'^2}dt$。
3. 列方程，注意从「过某点」提取初始条件（变限积分方程令 $x=a$ 得初值）。
4. 解方程，代初值。`,
  },
  {
    sec: '应用', k: 'qa', s: 2,
    q: '微分方程物理应用中常见的三种模型',
    a: r`**牛顿第二定律**：$m\dfrac{dv}{dt}=F$（阻力 $-kv$ 或 $-kv^2$）；若要 $v$ 与位移 $s$ 的关系，用 $\dfrac{dv}{dt}=v\dfrac{dv}{ds}$。
**冷却 / 衰变 / 增长**：$\dfrac{dT}{dt}=-k(T-T_0)$，$\dfrac{dN}{dt}=\pm kN$，解为指数型。
**流入流出（混合问题）**：$\dfrac{dQ}{dt}=$ 流入速率 $-$ 流出速率，流出浓度 $=\dfrac{Q}{V(t)}$。`,
  },
  {
    sec: '线性方程理论', k: 'judge', s: 2,
    q: r`若 $y_1,y_2$ 是二阶齐次线性方程的两个解，则 $C_1y_1+C_2y_2$ 一定是该方程的通解。`,
    a: r`✗ 错误。还需 $y_1,y_2$ **线性无关**（即 $\frac{y_1}{y_2}$ 不是常数）。例如 $y_1=e^x,y_2=2e^x$ 时 $C_1y_1+C_2y_2=Ce^x$ 只含一个独立常数。`,
  },
  {
    sec: '一阶方程', k: 'steps', s: 2,
    q: '把含变限积分的函数方程转化为微分方程的步骤',
    a: r`1. 观察方程，若 $x$ 与积分变量 $t$ 混在被积函数中（如 $\int_0^x(x-t)f(t)dt$），先拆开或换元，把 $x$ 移出积分号。
2. 两边对 $x$ 求导（可能需要求两次），得到微分方程。
3. **初值条件**：在原方程及一阶导方程中令 $x$ = 积分下限，得 $f(a)$、$f'(a)$。
4. 解微分方程并代初值。`,
    trap: '忘记提取初始条件是这类题最常见的失分点——通解不是最终答案。',
  },
  {
    sec: '常系数齐次', k: 'cloze', s: 2,
    q: r`若 $y_1=e^{2x}\cos 3x$ 是某二阶常系数齐次方程的解，则特征根为 $⟦2\pm3i⟧$，特征方程为 $⟦r^2-4r+13=0⟧$，方程为 $⟦y''-4y'+13y=0⟧$`,
    hook: r`$\alpha\pm\beta i$ 对应 $r^2-2\alpha r+(\alpha^2+\beta^2)=0$。`,
  },
  {
    sec: '一阶方程', k: 'qa', s: 2,
    q: r`形如 $y'=f(ax+by+c)$ 的方程怎么解？`,
    a: r`令 $u=ax+by+c$，则 $u'=a+by'=a+bf(u)$，是可分离变量方程：$\displaystyle\int\frac{du}{a+bf(u)}=x+C$。
类似地，$y'=\varphi\Big(\dfrac{ax+by+c}{a_1x+b_1y+c_1}\Big)$ 可通过平移消去常数化为齐次方程（数二很少考）。`,
  },
  {
    sec: '应用', k: 'cloze', s: 2,
    q: r`曲线 $y=y(x)$ 上点 $(x,y)$ 处法线过原点 $\iff$ ⟦$x+yy'=0$⟧，解得曲线族为 ⟦$x^2+y^2=C$⟧；切线过原点 $\iff$ ⟦$y=xy'$⟧，曲线族为 ⟦$y=Cx$⟧`,
    hook: r`法线过原点：法线斜率 $-\frac1{y'}$ 等于 $\frac{y}{x}$。`,
  },
  {
    sec: '常系数非齐次', k: 'qa', s: 2,
    q: r`方程 $y''+y=\sin x$、$y''-y=xe^{x}$、$y''+2y'+y=e^{-x}$ 的特解应各设成什么形式？`,
    a: r`① $y''+y=\sin x$：特征根 $\pm i$，$\lambda\pm\omega i=\pm i$ 是特征根，$k=1$：$y^*=x(a\cos x+b\sin x)$。
② $y''-y=xe^x$：特征根 $\pm1$，$\lambda=1$ 是单根：$y^*=x(ax+b)e^x$。
③ $y''+2y'+y=e^{-x}$：特征根 $-1$（二重），$\lambda=-1$ 是二重根：$y^*=ax^2e^{-x}$。`,
  },
]);
