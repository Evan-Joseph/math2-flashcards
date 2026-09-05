import { defineChapter, r, type CardInput, type KCard } from './types';

/** 数学一专属增补：id 形如 h4-m01，与主卡 / x 增补隔离 */
function defineM1(ch: string, items: CardInput[]): KCard[] {
  return items.map((it, i) => ({ ...it, scope: 'm1' as const, id: `${ch}-m${String(i + 1).padStart(2, '0')}`, ch }));
}

/* ------------------------------------------------------------------ */
/* g：向量代数与空间解析几何（仅数学一）                               */
/* ------------------------------------------------------------------ */
export const g = defineChapter('g', [
  {
    sec: '向量运算', k: 'cloze', s: 3,
    q: r`数量积 $\mathbf a\cdot\mathbf b=⟦|\mathbf a||\mathbf b|\cos\theta⟧=a_xb_x+a_yb_y+a_zb_z$；向量积 $|\mathbf a\times\mathbf b|=⟦|\mathbf a||\mathbf b|\sin\theta⟧$，$\mathbf a\times\mathbf b=⟦\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\a_x&a_y&a_z\\b_x&b_y&b_z\end{vmatrix}⟧$`,
    cond: r`$\theta\in[0,\pi]$ 为两向量夹角；$\mathbf a\times\mathbf b$ 方向按右手法则，垂直于 $\mathbf a,\mathbf b$。`,
    hook: r`$|\mathbf a\times\mathbf b|$ 是以 $\mathbf a,\mathbf b$ 为邻边的平行四边形面积；$\mathbf a\times\mathbf b=-\mathbf b\times\mathbf a$。`,
    trap: r`$\mathbf a\parallel\mathbf b\iff\mathbf a\times\mathbf b=\mathbf 0$；$\mathbf a\perp\mathbf b\iff\mathbf a\cdot\mathbf b=0$。零向量与任何向量既平行又垂直。`,
  },
  {
    sec: '向量运算', k: 'cloze', s: 2,
    q: r`混合积 $[\mathbf a\,\mathbf b\,\mathbf c]=(\mathbf a\times\mathbf b)\cdot\mathbf c=⟦\begin{vmatrix}a_x&a_y&a_z\\b_x&b_y&b_z\\c_x&c_y&c_z\end{vmatrix}⟧$；三向量共面 $\iff$ ⟦混合积 $=0$⟧；其绝对值是以三向量为棱的 ⟦平行六面体体积⟧`,
    hook: '轮换不变：[a b c]=[b c a]=[c a b]；交换任意两个变号。',
  },
  {
    sec: '向量运算', k: 'cloze', s: 2,
    q: r`$\mathbf a$ 在 $\mathbf b$ 上的投影 $\operatorname{Prj}_{\mathbf b}\mathbf a=⟦\dfrac{\mathbf a\cdot\mathbf b}{|\mathbf b|}⟧$；方向余弦 $\cos\alpha=⟦\dfrac{a_x}{|\mathbf a|}⟧$，且 $\cos^2\alpha+\cos^2\beta+\cos^2\gamma=⟦1⟧$`,
    cond: r`$\mathbf b\ne\mathbf 0$、$\mathbf a\ne\mathbf 0$。`,
  },
  {
    sec: '平面', k: 'qa', s: 3,
    q: '平面方程的四种形式（点法式、一般式、截距式、三点式）及法向量',
    a: r`**点法式**：$A(x-x_0)+B(y-y_0)+C(z-z_0)=0$，法向量 $\mathbf n=(A,B,C)$。
**一般式**：$Ax+By+Cz+D=0$（$A,B,C$ 不全为零）。
**截距式**：$\dfrac xa+\dfrac yb+\dfrac zc=1$（$abc\ne0$）。
**三点式**：$\begin{vmatrix}x-x_1&y-y_1&z-z_1\\x_2-x_1&y_2-y_1&z_2-z_1\\x_3-x_1&y_3-y_1&z_3-z_1\end{vmatrix}=0$（三点不共线）。`,
    hook: r`法向量 $=$ 平面内两个不平行向量的叉积。缺哪个变量，平面就平行于哪个坐标轴。`,
  },
  {
    sec: '平面', k: 'cloze', s: 3,
    q: r`点 $(x_0,y_0,z_0)$ 到平面 $Ax+By+Cz+D=0$ 的距离 $d=⟦\dfrac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}}⟧$；两平面夹角 $\cos\theta=⟦\dfrac{|\mathbf n_1\cdot\mathbf n_2|}{|\mathbf n_1||\mathbf n_2|}⟧$`,
    cond: r`两平面夹角取锐角（或直角），$\theta\in[0,\frac\pi2]$，故分子加绝对值。`,
  },
  {
    sec: '直线', k: 'qa', s: 3,
    q: '空间直线的三种方程形式及相互转化；方向向量如何求',
    a: r`**对称式（点向式）**：$\dfrac{x-x_0}{m}=\dfrac{y-y_0}{n}=\dfrac{z-z_0}{p}$，方向向量 $\mathbf s=(m,n,p)$。
**参数式**：$x=x_0+mt,\ y=y_0+nt,\ z=z_0+pt$。
**一般式**：$\begin{cases}A_1x+B_1y+C_1z+D_1=0\\A_2x+B_2y+C_2z+D_2=0\end{cases}$，方向向量 $\mathbf s=\mathbf n_1\times\mathbf n_2$。
一般式 → 对称式：先由 $\mathbf n_1\times\mathbf n_2$ 得 $\mathbf s$，再令某坐标为 0 解出直线上一点。`,
    trap: r`对称式中允许某个分母为 0，如 $\frac{x-1}{0}=\frac{y}{2}=\frac{z}{3}$ 表示 $x\equiv1$，不是除以零。`,
  },
  {
    sec: '直线', k: 'cloze', s: 2,
    q: r`直线 $L$（方向 $\mathbf s$）与平面 $\Pi$（法向 $\mathbf n$）的夹角 $\sin\varphi=⟦\dfrac{|\mathbf s\cdot\mathbf n|}{|\mathbf s||\mathbf n|}⟧$；$L\parallel\Pi\iff$ ⟦$\mathbf s\cdot\mathbf n=0$⟧；$L\perp\Pi\iff$ ⟦$\mathbf s\parallel\mathbf n$⟧`,
    hook: '线面角用 sin（法向量与直线的夹角的余角），面面角、线线角用 cos。',
  },
  {
    sec: '直线', k: 'cloze', s: 2,
    q: r`点 $P$ 到直线 $L$（过 $M_0$，方向 $\mathbf s$）的距离 $d=⟦\dfrac{|\overrightarrow{M_0P}\times\mathbf s|}{|\mathbf s|}⟧$；两异面直线（过 $M_1,M_2$，方向 $\mathbf s_1,\mathbf s_2$）的距离 $d=⟦\dfrac{|(\mathbf s_1\times\mathbf s_2)\cdot\overrightarrow{M_1M_2}|}{|\mathbf s_1\times\mathbf s_2|}⟧$`,
    hook: '点线距 = 平行四边形面积 ÷ 底；异面距 = 平行六面体体积 ÷ 底面积。',
  },
  {
    sec: '平面束', k: 'cloze', s: 2,
    q: r`过直线 $\begin{cases}A_1x+B_1y+C_1z+D_1=0\\A_2x+B_2y+C_2z+D_2=0\end{cases}$ 的平面束方程：$⟦A_1x+B_1y+C_1z+D_1+\lambda(A_2x+B_2y+C_2z+D_2)=0⟧$`,
    trap: r`该形式**不含**第二个平面本身（$\lambda\to\infty$）；若所求平面可能就是第二个平面，需单独验证，或写成 $\mu(\cdots)+\lambda(\cdots)=0$。`,
  },
  {
    sec: '曲面', k: 'qa', s: 3,
    q: '常见二次曲面的标准方程：椭球面、单叶/双叶双曲面、椭圆抛物面、双曲抛物面、二次锥面',
    a: r`**椭球面** $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}+\dfrac{z^2}{c^2}=1$
**单叶双曲面** $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}-\dfrac{z^2}{c^2}=1$（一个负号）
**双叶双曲面** $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}-\dfrac{z^2}{c^2}=1$（两个负号）
**椭圆抛物面** $z=\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}$
**双曲抛物面（马鞍面）** $z=\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}$
**二次锥面** $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=\dfrac{z^2}{c^2}$`,
    hook: r`用「截痕法」看形状：令 $z=h$ 看截口。$z^2=x^2+y^2$ 是锥面，$z=x^2+y^2$ 是抛物面，$z=\sqrt{x^2+y^2}$ 是上半锥面。`,
  },
  {
    sec: '曲面', k: 'qa', s: 3,
    q: r`旋转曲面方程怎么写？柱面方程有什么特征？`,
    a: r`**旋转曲面**：$yOz$ 面上曲线 $f(y,z)=0$ 绕 $z$ 轴旋转：保留 $z$，把 $y$ 换成 $\pm\sqrt{x^2+y^2}$，得 $f(\pm\sqrt{x^2+y^2},z)=0$；绕 $y$ 轴则保留 $y$，$z\to\pm\sqrt{x^2+z^2}$。
**柱面**：方程缺哪个变量，母线就平行于哪个坐标轴。如 $x^2+y^2=R^2$ 是母线平行 $z$ 轴的圆柱面。`,
    trap: r`绕哪个轴转，哪个变量不动；另一个变量换成「含其余两个变量的根号」。$x^2+y^2=1$ 在空间中是柱面，不是圆。`,
  },
  {
    sec: '曲线', k: 'qa', s: 2,
    q: r`空间曲线 $\begin{cases}F(x,y,z)=0\\G(x,y,z)=0\end{cases}$ 在 $xOy$ 面上的投影曲线怎么求？`,
    a: r`从方程组中**消去 $z$**，得投影柱面 $H(x,y)=0$；投影曲线为 $\begin{cases}H(x,y)=0\\z=0\end{cases}$。
常用于确定三重积分、曲面积分的投影区域 $D_{xy}$。`,
    trap: r`消元后可能引入多余部分，须结合原曲线的范围（如 $z\ge0$）截取。`,
  },
]);

/* ------------------------------------------------------------------ */
/* h4 增补：多元微分学的数学一专属内容                                 */
/* ------------------------------------------------------------------ */
export const h4m1 = defineM1('h4', [
  {
    sec: '方向导数与梯度', k: 'cloze', s: 3,
    q: r`$f$ 在点 $P$ 可微时，沿单位向量 $\mathbf l=(\cos\alpha,\cos\beta,\cos\gamma)$ 的方向导数 $\dfrac{\partial f}{\partial\mathbf l}=⟦f_x\cos\alpha+f_y\cos\beta+f_z\cos\gamma⟧=\operatorname{grad}f\cdot\mathbf l$；梯度 $\operatorname{grad}f=⟦(f_x,f_y,f_z)⟧$`,
    cond: r`公式要求 $f$ 在 $P$ 点**可微**；仅偏导存在时方向导数可能不存在或公式不成立。$\mathbf l$ 须化为单位向量。`,
    trap: r`方向导数是数（标量），梯度是向量。$f_x$ 存在只说明沿 $x$ 轴正、负两个方向的方向导数存在且互为相反数——注意方向导数沿 $-\mathbf l$ 的值是沿 $\mathbf l$ 的相反数（可微时）。`,
  },
  {
    sec: '方向导数与梯度', k: 'qa', s: 3,
    q: '梯度的几何意义：方向导数何时最大 / 最小 / 为零？梯度与等值线（面）的关系？',
    a: r`$\dfrac{\partial f}{\partial\mathbf l}=|\operatorname{grad}f|\cos\theta$（$\theta$ 为 $\mathbf l$ 与梯度夹角）。
- 沿梯度方向方向导数**最大**，最大值 $=|\operatorname{grad}f|$；
- 沿梯度反方向**最小**，为 $-|\operatorname{grad}f|$；
- 与梯度垂直的方向方向导数为 0。
梯度垂直于过该点的等值线 $f(x,y)=c$（等值面 $f(x,y,z)=c$），指向 $f$ 增大一侧。`,
    hook: '「梯度 = 最陡上升方向」。求「沿什么方向增加最快」直接答梯度方向。',
  },
  {
    sec: '几何应用', k: 'qa', s: 3,
    q: r`空间曲线的切线与法平面：参数式 $x=x(t),y=y(t),z=z(t)$ 与一般式 $\begin{cases}F=0\\G=0\end{cases}$ 各如何求切向量？`,
    a: r`**参数式**：$t=t_0$ 处切向量 $\mathbf T=(x'(t_0),y'(t_0),z'(t_0))$。
切线 $\dfrac{x-x_0}{x'(t_0)}=\dfrac{y-y_0}{y'(t_0)}=\dfrac{z-z_0}{z'(t_0)}$，法平面 $x'(t_0)(x-x_0)+y'(t_0)(y-y_0)+z'(t_0)(z-z_0)=0$。
**一般式**：切向量 $\mathbf T=\nabla F\times\nabla G$（两曲面法向量的叉积），或把 $x$ 视为参数，由隐函数求 $y'(x),z'(x)$ 得 $\mathbf T=(1,y',z')$。`,
    cond: r`参数式要求 $x'(t_0),y'(t_0),z'(t_0)$ 不全为零；一般式要求 $\nabla F\times\nabla G\ne\mathbf 0$。`,
  },
  {
    sec: '几何应用', k: 'cloze', s: 3,
    q: r`曲面 $F(x,y,z)=0$ 在点 $P_0$ 处的法向量 $\mathbf n=⟦(F_x,F_y,F_z)\big|_{P_0}⟧$；曲面 $z=f(x,y)$ 的法向量 $\mathbf n=⟦(f_x,f_y,-1)⟧$ 或 $(-f_x,-f_y,1)$`,
    cond: r`$F$ 在 $P_0$ 具有连续偏导且 $\nabla F\ne\mathbf 0$。`,
    hook: r`切平面 $F_x(x-x_0)+F_y(y-y_0)+F_z(z-z_0)=0$，法线 $\frac{x-x_0}{F_x}=\frac{y-y_0}{F_y}=\frac{z-z_0}{F_z}$。$z=f(x,y)$ 时令 $F=f(x,y)-z$。`,
    trap: r`曲线的切「线」配法「平面」，曲面的切「平面」配法「线」。`,
  },
  {
    sec: '偏导与全微分', k: 'qa', s: 2,
    q: '全微分存在的必要条件与充分条件分别是什么？如何用定义验证可微？',
    a: r`**必要**：可微 $\Rightarrow$ 连续，且 $f_x,f_y$ 存在，$dz=f_xdx+f_ydy$。
**充分**：$f_x,f_y$ 在该点**连续** $\Rightarrow$ 可微。
**定义验证**：$\lim\limits_{(\Delta x,\Delta y)\to(0,0)}\dfrac{\Delta z-f_x\Delta x-f_y\Delta y}{\sqrt{\Delta x^2+\Delta y^2}}=0$。`,
    trap: r`偏导存在 $\nRightarrow$ 连续（$f=\frac{xy}{x^2+y^2}$ 补 $f(0,0)=0$ 在原点偏导存在但不连续）；偏导连续是充分非必要条件。`,
  },
]);

/* ------------------------------------------------------------------ */
/* h7：三重积分（仅数学一）                                             */
/* ------------------------------------------------------------------ */
export const h7 = defineChapter('h7', [
  {
    sec: '计算方法', k: 'qa', s: 3,
    q: '三重积分的「先一后二」（投影法）与「先二后一」（截面法）分别适用什么区域？',
    a: r`**先一后二**：$\Omega=\{(x,y)\in D_{xy},\ z_1(x,y)\le z\le z_2(x,y)\}$，
$$\iiint_\Omega f\,dv=\iint_{D_{xy}}dx\,dy\int_{z_1(x,y)}^{z_2(x,y)}f\,dz$$
适用于上下曲面明确、投影区域易求的区域。
**先二后一**：$\Omega=\{a\le z\le b,\ (x,y)\in D_z\}$，
$$\iiint_\Omega f\,dv=\int_a^b dz\iint_{D_z}f\,dx\,dy$$
适用于被积函数只含 $z$（或截面 $D_z$ 面积易求）的情形，如旋转体、椭球。`,
    hook: r`被积函数只有 $z$、截面是圆或椭圆 → 先二后一；$f$ 一般、上下曲面清楚 → 先一后二。`,
  },
  {
    sec: '计算方法', k: 'cloze', s: 3,
    q: r`柱面坐标：$x=r\cos\theta,y=r\sin\theta,z=z$，$dv=⟦r\,dr\,d\theta\,dz⟧$；球面坐标：$x=\rho\sin\varphi\cos\theta,\ y=\rho\sin\varphi\sin\theta,\ z=\rho\cos\varphi$，$dv=⟦\rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta⟧$`,
    cond: r`$r\ge0$；$\rho\ge0$，$\varphi\in[0,\pi]$（与 $z$ 轴正向的夹角），$\theta\in[0,2\pi]$。`,
    hook: r`球坐标下 $x^2+y^2+z^2=\rho^2$，$x^2+y^2=\rho^2\sin^2\varphi$；锥面 $z=\sqrt{x^2+y^2}$ 即 $\varphi=\frac\pi4$；球面 $x^2+y^2+z^2=2az$ 即 $\rho=2a\cos\varphi$。`,
    trap: r`球坐标体积元是 $\rho^2\sin\varphi$，不是 $\rho^2$；$\varphi$ 上限由锥面确定，$\rho$ 上限由球面确定。`,
  },
  {
    sec: '对称性', k: 'qa', s: 3,
    q: '三重积分的对称性与轮换对称性怎么用？',
    a: r`**奇偶对称**：$\Omega$ 关于 $xOy$ 面对称时，$f$ 关于 $z$ 为奇函数则积分为 0，偶函数则为上半部分的 2 倍（其他坐标面同理）。
**轮换对称**：若 $\Omega$ 的表达式中 $x,y,z$ 轮换后不变（如球、正方体），则 $\iiint x^2dv=\iiint y^2dv=\iiint z^2dv=\frac13\iiint(x^2+y^2+z^2)dv$。
**形心公式反用**：$\iiint_\Omega x\,dv=\bar x\cdot V$。`,
    trap: r`奇偶性看「被积函数关于哪个变量」，对称性看「区域关于哪个坐标面」，二者必须对应。`,
  },
  {
    sec: '应用', k: 'cloze', s: 2,
    q: r`密度 $\mu(x,y,z)$ 的物体：质量 $M=⟦\iiint_\Omega\mu\,dv⟧$；质心 $\bar x=⟦\dfrac{\iiint_\Omega x\mu\,dv}{M}⟧$；对 $z$ 轴的转动惯量 $I_z=⟦\iiint_\Omega(x^2+y^2)\mu\,dv⟧$`,
    hook: r`转动惯量：到转轴的距离平方 × 质量微元。对 $z$ 轴距离平方是 $x^2+y^2$。`,
  },
  {
    sec: '常用结论', k: 'cloze', s: 2,
    q: r`球体 $x^2+y^2+z^2\le R^2$：$\iiint(x^2+y^2+z^2)dv=⟦\dfrac{4}{5}\pi R^5⟧$，$\iiint z^2dv=⟦\dfrac{4}{15}\pi R^5⟧$`,
    hook: r`用球坐标：$\int_0^{2\pi}d\theta\int_0^\pi\sin\varphi\,d\varphi\int_0^R\rho^4d\rho=2\pi\cdot2\cdot\frac{R^5}{5}$；$z^2$ 用轮换对称取三分之一。`,
  },
]);

/* ------------------------------------------------------------------ */
/* h8：曲线积分与曲面积分（仅数学一）                                   */
/* ------------------------------------------------------------------ */
export const h8 = defineChapter('h8', [
  {
    sec: '第一类曲线积分', k: 'cloze', s: 3,
    q: r`$L:\ x=\varphi(t),y=\psi(t)\ (\alpha\le t\le\beta)$，则 $\displaystyle\int_Lf(x,y)\,ds=⟦\int_\alpha^\beta f(\varphi(t),\psi(t))\sqrt{\varphi'^2(t)+\psi'^2(t)}\,dt⟧$；$y=y(x)$ 时 $ds=⟦\sqrt{1+y'^2}\,dx⟧$；极坐标 $r=r(\theta)$ 时 $ds=⟦\sqrt{r^2+r'^2}\,d\theta⟧$`,
    cond: r`$\alpha<\beta$（下限必须小于上限，$ds>0$）；$\varphi,\psi$ 一阶连续导数且不同时为零。`,
    trap: r`第一类曲线积分与方向无关，上下限一定「小到大」。可以把曲线方程代入被积函数化简（如在 $x^2+y^2=R^2$ 上 $\oint(x^2+y^2)ds=R^2\cdot2\pi R$）。`,
  },
  {
    sec: '第一类曲线积分', k: 'qa', s: 2,
    q: '第一类曲线积分的对称性与物理意义',
    a: r`**对称性**：$L$ 关于 $y$ 轴对称，$f$ 关于 $x$ 为奇函数则积分为 0，偶函数则为一半的 2 倍。**轮换对称**：曲线方程中 $x,y$（$z$）地位相同时可轮换。
**物理**：$\int_L\mu\,ds$ 为曲线质量；$\int_L ds$ 为弧长；质心 $\bar x=\frac{\int_L x\mu ds}{\int_L\mu ds}$。`,
  },
  {
    sec: '第二类曲线积分', k: 'cloze', s: 3,
    q: r`$L:\ x=\varphi(t),y=\psi(t)$，$t$ 从 $\alpha$ 变到 $\beta$（对应起点到终点），则 $\displaystyle\int_LP\,dx+Q\,dy=⟦\int_\alpha^\beta\big[P(\varphi,\psi)\varphi'(t)+Q(\varphi,\psi)\psi'(t)\big]dt⟧$；两类曲线积分的关系：$\displaystyle\int_LP\,dx+Q\,dy=\int_L⟦(P\cos\alpha+Q\cos\beta)⟧\,ds$`,
    cond: r`$\alpha$ 对应起点、$\beta$ 对应终点，**不要求** $\alpha<\beta$；$(\cos\alpha,\cos\beta)$ 为 $L$ 在该点与方向一致的单位切向量。`,
    trap: r`第二类曲线积分与方向有关：反向则变号。`,
  },
  {
    sec: '格林公式', k: 'cloze', s: 3,
    q: r`格林公式：$\displaystyle\oint_LP\,dx+Q\,dy=⟦\iint_D\Big(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\Big)dx\,dy⟧$`,
    cond: r`① $L$ 为 $D$ 的**正向**边界（沿 $L$ 走，$D$ 在左侧；外边界逆时针，内边界顺时针）；② $L$ 分段光滑闭曲线；③ $P,Q$ 在 **$D$ 上（含边界）** 一阶偏导连续。`,
    trap: r`$D$ 内含奇点（如原点处 $P,Q$ 无定义）时**不能直接用**：须挖去以奇点为中心的小圆（或椭圆）后在复连通区域上用，再单独算小闭曲线上的积分。`,
    hook: r`口诀「Q 对 x 减 P 对 y」。面积公式：$A=\frac12\oint_Lx\,dy-y\,dx=\oint_Lx\,dy=-\oint_Ly\,dx$。`,
  },
  {
    sec: '格林公式', k: 'steps', s: 3,
    q: r`曲线 $L$ 不封闭时用格林公式计算 $\int_LP\,dx+Q\,dy$ 的步骤（补线法）`,
    a: r`1. 检查 $P,Q$ 在拟围区域内是否一阶偏导连续（有奇点须绕开或挖去）。
2. 补一条简单曲线 $L_1$（通常是直线段、坐标轴上的线段），使 $L+L_1$ 成为闭曲线，判断整体方向是正向还是负向。
3. $\int_L=\oint_{L+L_1}-\int_{L_1}$，闭曲线部分用格林公式化为二重积分（负向时加负号）。
4. $\int_{L_1}$ 直接用参数式计算（在 $y=0$ 的线段上 $dy=0$）。`,
    hook: r`当 $\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}$ 很简单（常数、0）时，补线法最划算。`,
  },
  {
    sec: '路径无关', k: 'qa', s: 3,
    q: r`平面曲线积分 $\int_LP\,dx+Q\,dy$ 与路径无关的四个等价条件（需要什么区域条件？）`,
    a: r`设 $P,Q$ 在**单连通区域** $G$ 内一阶偏导连续，则下列等价：
① 沿 $G$ 内任意分段光滑闭曲线积分为 0；
② 积分与路径无关；
③ 存在 $u(x,y)$ 使 $du=P\,dx+Q\,dy$（$P\,dx+Q\,dy$ 是全微分）；
④ $\dfrac{\partial P}{\partial y}=\dfrac{\partial Q}{\partial x}$ 在 $G$ 内恒成立。
此时 $\int_{(x_0,y_0)}^{(x_1,y_1)}P\,dx+Q\,dy=u(x_1,y_1)-u(x_0,y_0)$，$u$ 可沿折线（先 $x$ 后 $y$）积分求得。`,
    trap: r`「单连通」不可省：$\frac{-y\,dx+x\,dy}{x^2+y^2}$ 满足 $P_y=Q_x$（$x^2+y^2\ne0$），但绕原点一周积分为 $2\pi\ne0$，因为区域挖去原点后不再单连通。`,
  },
  {
    sec: '第一类曲面积分', k: 'cloze', s: 3,
    q: r`曲面 $\Sigma:\ z=z(x,y)$，$(x,y)\in D_{xy}$，则 $\displaystyle\iint_\Sigma f(x,y,z)\,dS=⟦\iint_{D_{xy}}f(x,y,z(x,y))\sqrt{1+z_x^2+z_y^2}\,dx\,dy⟧$`,
    cond: r`$z(x,y)$ 在 $D_{xy}$ 上具有连续偏导数；$\Sigma$ 与平行于 $z$ 轴的直线至多交于一点（否则分片）。`,
    hook: r`$dS=\sqrt{1+z_x^2+z_y^2}\,dx\,dy$ 是「一投二代三换」：投影到 $D_{xy}$、把 $z=z(x,y)$ 代入、$dS$ 换掉。球面 $x^2+y^2+z^2=R^2$ 上 $dS=\frac{R}{\sqrt{R^2-x^2-y^2}}dx\,dy$。`,
    trap: r`与方向无关；同样可把曲面方程代入被积函数化简；对称性、轮换对称同样适用。`,
  },
  {
    sec: '第二类曲面积分', k: 'cloze', s: 3,
    q: r`$\Sigma:\ z=z(x,y)$ 取**上侧**，则 $\displaystyle\iint_\Sigma R(x,y,z)\,dx\,dy=⟦+\iint_{D_{xy}}R(x,y,z(x,y))\,dx\,dy⟧$；取下侧则取 ⟦负号⟧。$\Sigma:\ x=x(y,z)$ 取前侧（$x$ 轴正向一侧）为正`,
    cond: r`$dx\,dy$ 型对 $xOy$ 面投影，上侧正、下侧负；$dy\,dz$ 型对 $yOz$ 面投影，前侧正、后侧负；$dz\,dx$ 型对 $zOx$ 面投影，右侧正、左侧负。曲面与坐标面垂直时对应投影积分为 0。`,
    trap: r`「一投二代三定号」。母线平行于 $z$ 轴的柱面上 $\iint R\,dx\,dy=0$。`,
  },
  {
    sec: '第二类曲面积分', k: 'cloze', s: 2,
    q: r`两类曲面积分的关系：$\displaystyle\iint_\Sigma P\,dy\,dz+Q\,dz\,dx+R\,dx\,dy=\iint_\Sigma⟦(P\cos\alpha+Q\cos\beta+R\cos\gamma)⟧\,dS$；对 $z=z(x,y)$ 的上侧，可统一化为 $\displaystyle\iint_{D_{xy}}⟦\big[P\cdot(-z_x)+Q\cdot(-z_y)+R\big]⟧dx\,dy$`,
    cond: r`$(\cos\alpha,\cos\beta,\cos\gamma)$ 为 $\Sigma$ 指定侧的单位法向量；上侧法向量 $\propto(-z_x,-z_y,1)$，下侧整体变号。`,
    hook: '「转换投影法」：把 dy dz、dz dx 全部转成 dx dy 一次算完。',
  },
  {
    sec: '高斯公式', k: 'cloze', s: 3,
    q: r`高斯公式：$\displaystyle\oiint_\Sigma P\,dy\,dz+Q\,dz\,dx+R\,dx\,dy=⟦\iiint_\Omega\Big(\frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}+\frac{\partial R}{\partial z}\Big)dv⟧$`,
    cond: r`① $\Sigma$ 为 $\Omega$ 的整个边界曲面且取**外侧**；② $\Sigma$ 分片光滑；③ $P,Q,R$ 在 **$\Omega$ 上（含边界）** 一阶偏导连续——$\Omega$ 内有奇点（如 $\frac{(x,y,z)}{(x^2+y^2+z^2)^{3/2}}$ 在原点）时须挖去小球后使用。`,
    trap: r`曲面不封闭要**补面**（常补平面 $z=c$），且补的面上积分往往用「投影为 0 / 代入常数」直接算；内侧取负。`,
  },
  {
    sec: '斯托克斯公式', k: 'cloze', s: 2,
    q: r`斯托克斯公式：$\displaystyle\oint_\Gamma P\,dx+Q\,dy+R\,dz=\iint_\Sigma⟦\begin{vmatrix}dy\,dz&dz\,dx&dx\,dy\\\dfrac{\partial}{\partial x}&\dfrac{\partial}{\partial y}&\dfrac{\partial}{\partial z}\\P&Q&R\end{vmatrix}⟧=\iint_\Sigma\begin{vmatrix}\cos\alpha&\cos\beta&\cos\gamma\\\dfrac{\partial}{\partial x}&\dfrac{\partial}{\partial y}&\dfrac{\partial}{\partial z}\\P&Q&R\end{vmatrix}dS$`,
    cond: r`$\Gamma$ 的方向与 $\Sigma$ 的侧符合**右手法则**；$P,Q,R$ 在含 $\Sigma$ 的区域内一阶偏导连续。$\Sigma$ 可取以 $\Gamma$ 为边界的任意光滑曲面（常取平面）。`,
    hook: r`空间闭曲线积分：先看能否用斯托克斯化为平面区域上的曲面积分，再用第一类曲面积分或投影计算；$\Gamma$ 是平面 $ax+by+cz=d$ 与曲面的交线时，$\Sigma$ 就取该平面片。`,
  },
  {
    sec: '场论初步', k: 'cloze', s: 2,
    q: r`向量场 $\mathbf A=(P,Q,R)$：散度 $\operatorname{div}\mathbf A=⟦\dfrac{\partial P}{\partial x}+\dfrac{\partial Q}{\partial y}+\dfrac{\partial R}{\partial z}⟧$；旋度 $\operatorname{rot}\mathbf A=⟦\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\\dfrac{\partial}{\partial x}&\dfrac{\partial}{\partial y}&\dfrac{\partial}{\partial z}\\P&Q&R\end{vmatrix}⟧$`,
    hook: r`高斯公式 $=\oiint\mathbf A\cdot d\mathbf S=\iiint\operatorname{div}\mathbf A\,dv$；斯托克斯 $=\oint\mathbf A\cdot d\mathbf r=\iint\operatorname{rot}\mathbf A\cdot d\mathbf S$。散度是标量，旋度是向量。`,
  },
  {
    sec: '路径无关', k: 'qa', s: 2,
    q: r`空间曲线积分 $\int_\Gamma P\,dx+Q\,dy+R\,dz$ 与路径无关的条件；已知全微分 $du=P\,dx+Q\,dy$ 如何求 $u$？`,
    a: r`**空间**：在（一维）单连通区域内 $P,Q,R$ 一阶偏导连续，则与路径无关 $\iff\operatorname{rot}\mathbf A=\mathbf 0$，即 $\dfrac{\partial R}{\partial y}=\dfrac{\partial Q}{\partial z},\ \dfrac{\partial P}{\partial z}=\dfrac{\partial R}{\partial x},\ \dfrac{\partial Q}{\partial x}=\dfrac{\partial P}{\partial y}$。
**求原函数** $u$：① 沿折线 $(x_0,y_0)\to(x,y_0)\to(x,y)$ 积分：$u=\int_{x_0}^xP(t,y_0)dt+\int_{y_0}^yQ(x,t)dt$；② 偏积分：$u=\int P\,dx+\varphi(y)$，再由 $u_y=Q$ 定 $\varphi$；③ 凑微分。`,
  },
]);

/* ------------------------------------------------------------------ */
/* h9：无穷级数（仅数学一）                                             */
/* ------------------------------------------------------------------ */
export const h9 = defineChapter('h9', [
  {
    sec: '常数项级数', k: 'qa', s: 3,
    q: '级数收敛的定义与基本性质（线性、去掉有限项、加括号、必要条件）',
    a: r`$\sum u_n$ 收敛 $\iff$ 部分和 $S_n=\sum_{k=1}^nu_k$ 的极限存在。
① 收敛级数可逐项相加、乘常数（$k\ne0$ 时 $\sum ku_n$ 与 $\sum u_n$ 敛散性相同）；
② 增减、改变有限项不改变敛散性；
③ 收敛级数任意加括号后仍收敛且和不变；
④ **必要条件**：$\sum u_n$ 收敛 $\Rightarrow\lim u_n=0$。`,
    trap: r`④ 的逆不成立：$\sum\frac1n$ 发散但 $\frac1n\to0$。加括号后收敛推不出原级数收敛：$(1-1)+(1-1)+\cdots$。收敛 + 发散 = 发散；发散 + 发散 敛散不定。`,
  },
  {
    sec: '常数项级数', k: 'cloze', s: 3,
    q: r`几何级数 $\sum\limits_{n=0}^\infty aq^n$（$a\ne0$）收敛 $\iff$ ⟦$|q|<1$⟧，和为 ⟦$\dfrac{a}{1-q}$⟧；$p$-级数 $\sum\dfrac1{n^p}$ 收敛 $\iff$ ⟦$p>1$⟧；$\sum\dfrac{1}{n\ln^pn}$ 收敛 $\iff$ ⟦$p>1$⟧`,
    hook: r`$p$-级数与 $\int_1^{+\infty}\frac{dx}{x^p}$ 同敛散（积分判别法）。调和级数 $p=1$ 发散。`,
  },
  {
    sec: '正项级数', k: 'qa', s: 3,
    q: '正项级数的比较判别法（一般形式与极限形式）',
    a: r`设 $u_n,v_n\ge0$。
**一般形式**：$u_n\le Cv_n$（$n$ 充分大），$\sum v_n$ 收敛 $\Rightarrow\sum u_n$ 收敛；$\sum u_n$ 发散 $\Rightarrow\sum v_n$ 发散。
**极限形式**：$\lim\dfrac{u_n}{v_n}=l$：
- $0<l<+\infty$：同敛散；
- $l=0$：$\sum v_n$ 收敛 $\Rightarrow\sum u_n$ 收敛；
- $l=+\infty$：$\sum v_n$ 发散 $\Rightarrow\sum u_n$ 发散。
基准常取 $p$-级数：找 $u_n\sim\dfrac{C}{n^p}$（等价无穷小、泰勒展开）。`,
    cond: '只适用于正项级数（或从某项起非负的级数）。',
    hook: '正项级数收敛 ⟺ 部分和有界。',
  },
  {
    sec: '正项级数', k: 'cloze', s: 3,
    q: r`比值法：$\lim\dfrac{u_{n+1}}{u_n}=\rho$；根值法：$\lim\sqrt[n]{u_n}=\rho$。$\rho<1$ ⟦收敛⟧，$\rho>1$ ⟦发散⟧，$\rho=1$ ⟦不能判定⟧`,
    cond: r`$u_n>0$。$\rho=1$ 时改用比较法（如 $p$-级数：比值极限均为 1 但敛散不同）。`,
    hook: r`含 $n!$、$a^n$ 用比值法；含 $n^n$、$(\cdot)^n$ 用根值法。$\lim\sqrt[n]{n}=1$，$\lim\frac{n!}{n^n}$ 型用 $\frac{u_{n+1}}{u_n}\to\frac1e$。`,
  },
  {
    sec: '交错级数', k: 'qa', s: 3,
    q: r`莱布尼茨判别法的内容；交错级数 $\sum(-1)^{n-1}u_n$ 不满足单调性时怎么办？`,
    a: r`**莱布尼茨**：若 $u_n\ge0$，$u_n$ **单调递减**且 $\lim u_n=0$，则 $\sum(-1)^{n-1}u_n$ 收敛，且余项 $|r_n|\le u_{n+1}$。
两个条件只是**充分**条件。单调性不成立时不能用莱布尼茨否定收敛，应改用：拆项（$u_n=$ 主部 + 高阶项）、泰勒展开、绝对收敛判别或部分和定义。`,
    trap: r`$\sum\frac{(-1)^n}{\sqrt n+(-1)^n}$：$u_n\to0$ 但不单调，实际**发散**（拆项后含 $\sum\frac1{n-1}$）。别把「$u_n\to0$」当成交错级数收敛的充分条件。`,
  },
  {
    sec: '绝对收敛', k: 'qa', s: 3,
    q: '绝对收敛与条件收敛的定义及关系；相关的重要结论',
    a: r`$\sum|u_n|$ 收敛 $\Rightarrow\sum u_n$ 收敛，此时称 $\sum u_n$ **绝对收敛**；$\sum u_n$ 收敛但 $\sum|u_n|$ 发散称**条件收敛**。
结论：
① 绝对收敛级数任意重排后仍绝对收敛且和不变；条件收敛级数重排可得任何和（黎曼定理）。
② $\sum u_n$ 绝对收敛 $\Rightarrow\sum u_n^2$ 收敛；$\sum u_n$ 条件收敛 $\nRightarrow\sum u_n^2$ 收敛（$u_n=\frac{(-1)^n}{\sqrt n}$）。
③ 条件收敛级数的正项部分与负项部分都发散。
④ 若用比值 / 根值法判断出 $\sum|u_n|$ 发散（$\rho>1$），则 $\sum u_n$ 也发散（因 $u_n\not\to0$）。`,
    trap: r`$\sum u_n$ 收敛推不出 $\sum u_n^2$ 收敛，也推不出 $\sum u_{2n}$ 收敛；但 $\sum u_n$ 收敛 $\Rightarrow\sum(u_{2n-1}+u_{2n})$ 收敛。`,
  },
  {
    sec: '幂级数', k: 'qa', s: 3,
    q: r`阿贝尔定理的内容；幂级数 $\sum a_nx^n$ 的收敛半径怎么求？`,
    a: r`**阿贝尔定理**：若 $\sum a_nx^n$ 在 $x_0\ne0$ 收敛，则对 $|x|<|x_0|$ **绝对收敛**；若在 $x_0$ 发散，则对 $|x|>|x_0|$ 发散。
**收敛半径**：$\lim\Big|\dfrac{a_{n+1}}{a_n}\Big|=\rho$ 或 $\lim\sqrt[n]{|a_n|}=\rho$，则 $R=\dfrac1\rho$（$\rho=0$ 时 $R=+\infty$，$\rho=+\infty$ 时 $R=0$）。
收敛区间 $(-R,R)$；收敛域还须**单独判断端点** $x=\pm R$。`,
    cond: r`比值公式要求相邻系数均非零；对缺项级数（如只有 $x^{2n}$ 项）应直接对通项用比值法 $\lim\Big|\frac{u_{n+1}(x)}{u_n(x)}\Big|<1$ 解出 $x$ 的范围。`,
    trap: r`已知在 $x=x_0$ 条件收敛，则 $R=|x_0-\text{中心}|$（条件收敛点只能在端点）。`,
  },
  {
    sec: '幂级数', k: 'qa', s: 3,
    q: '幂级数和函数的分析性质（连续、逐项积分、逐项求导）及对收敛半径 / 收敛域的影响',
    a: r`设 $S(x)=\sum a_nx^n$，收敛半径 $R>0$：
① $S(x)$ 在收敛域上**连续**；
② 在 $(-R,R)$ 内可**逐项求导**：$S'(x)=\sum na_nx^{n-1}$；
③ 在收敛域内可**逐项积分**：$\int_0^xS(t)dt=\sum\dfrac{a_n}{n+1}x^{n+1}$。
逐项求导、积分后**收敛半径不变**，但端点敛散性可能改变：求导可能失去端点，积分可能获得端点。`,
    hook: r`求和函数：先记下收敛域，含 $n$ 因子的先积分再求导（$\sum nx^{n-1}$），含 $\frac1n$ 的先求导再积分（$\sum\frac{x^n}{n}$）；最后别忘了 $S(0)$ 与端点单独讨论。`,
  },
  {
    sec: '幂级数', k: 'cloze', s: 3,
    q: r`$\sum\limits_{n=0}^\infty x^n=⟦\dfrac1{1-x}⟧$，$\sum\limits_{n=1}^\infty nx^{n-1}=⟦\dfrac{1}{(1-x)^2}⟧$，$\sum\limits_{n=1}^\infty\dfrac{x^n}{n}=⟦-\ln(1-x)⟧$，$\sum\limits_{n=0}^\infty\dfrac{x^n}{n!}=⟦e^x⟧$`,
    cond: r`前三式 $|x|<1$（第三式在 $x=-1$ 也成立，为 $-\ln2$）；第四式 $x\in\mathbb R$。`,
  },
  {
    sec: '函数展开', k: 'qa', s: 3,
    q: r`常用函数的麦克劳林级数及收敛域（$e^x,\sin x,\cos x,\ln(1+x),\frac1{1+x},(1+x)^\alpha,\arctan x$）`,
    a: r`$$e^x=\sum_{n=0}^\infty\frac{x^n}{n!},\quad x\in\mathbb R$$
$$\sin x=\sum_{n=0}^\infty\frac{(-1)^nx^{2n+1}}{(2n+1)!},\qquad\cos x=\sum_{n=0}^\infty\frac{(-1)^nx^{2n}}{(2n)!},\quad x\in\mathbb R$$
$$\frac1{1+x}=\sum_{n=0}^\infty(-1)^nx^n,\quad(-1,1);\qquad\ln(1+x)=\sum_{n=1}^\infty\frac{(-1)^{n-1}x^n}{n},\quad(-1,1]$$
$$\arctan x=\sum_{n=0}^\infty\frac{(-1)^nx^{2n+1}}{2n+1},\quad[-1,1];\qquad(1+x)^\alpha=1+\sum_{n=1}^\infty\frac{\alpha(\alpha-1)\cdots(\alpha-n+1)}{n!}x^n,\quad(-1,1)$$`,
    hook: r`间接展开：有理函数拆部分分式后套 $\frac1{1-x}$；含 $\ln$、$\arctan$ 的先求导再逐项积分；展开在 $x_0$ 处就把 $x$ 换成 $x-x_0$ 后配凑。`,
    trap: r`收敛域要写对：$\ln(1+x)$ 右端点闭；$\frac1{1+x}$ 两端都开；$(1+x)^\alpha$ 的端点与 $\alpha$ 有关。`,
  },
  {
    sec: '函数展开', k: 'qa', s: 2,
    q: '函数能展开成泰勒级数的充要条件；泰勒级数与泰勒公式的区别',
    a: r`$f$ 在 $x_0$ 的邻域内能展开成泰勒级数 $\iff$ 泰勒公式的余项 $R_n(x)\to0\ (n\to\infty)$。
**泰勒公式**是有限项 + 余项的恒等式（只要求 $n$ 阶可导）；**泰勒级数**是无穷级数，需要 $f$ 无穷阶可导且余项趋于零，才能写「$=$」。
展开式若存在则**唯一**，且系数 $a_n=\dfrac{f^{(n)}(x_0)}{n!}$——由此可用展开式反求 $f^{(n)}(x_0)$。`,
    trap: r`无穷阶可导不保证可展开：$f(x)=e^{-1/x^2}$（$f(0)=0$）在 0 处各阶导数全为 0，泰勒级数恒为 0，但 $f\not\equiv0$。`,
  },
  {
    sec: '傅里叶级数', k: 'cloze', s: 3,
    q: r`周期为 $2\pi$ 的 $f(x)$：$a_n=⟦\dfrac1\pi\displaystyle\int_{-\pi}^{\pi}f(x)\cos nx\,dx⟧\ (n\ge0)$，$b_n=⟦\dfrac1\pi\displaystyle\int_{-\pi}^{\pi}f(x)\sin nx\,dx⟧\ (n\ge1)$，级数为 $\dfrac{a_0}{2}+\sum\limits_{n=1}^\infty(a_n\cos nx+b_n\sin nx)$`,
    cond: r`周期为 $2l$ 时：$a_n=\frac1l\int_{-l}^lf(x)\cos\frac{n\pi x}{l}dx$，$b_n=\frac1l\int_{-l}^lf(x)\sin\frac{n\pi x}{l}dx$，级数中 $\cos nx\to\cos\frac{n\pi x}{l}$。`,
    hook: r`常数项写成 $\frac{a_0}{2}$ 是为了让 $a_0$ 与 $a_n$ 公式统一。奇函数只有正弦项（$a_n=0$），偶函数只有余弦项（$b_n=0$）。`,
  },
  {
    sec: '傅里叶级数', k: 'qa', s: 3,
    q: '狄利克雷收敛定理的条件与结论；如何求傅里叶级数在指定点的和？',
    a: r`设 $f$ 以 $2\pi$ 为周期，在一个周期内**连续或只有有限个第一类间断点**，且**至多有有限个极值点**，则傅里叶级数处处收敛，且和函数
$$S(x)=\begin{cases}f(x),&x\text{ 为连续点}\\[2pt]\dfrac{f(x^-)+f(x^+)}{2},&x\text{ 为间断点}\end{cases}$$
**求指定点的和**：先把点按周期平移到 $[-\pi,\pi)$（或给定区间）内，再判断是连续点还是间断点（区间端点 $\pm\pi$ 处按周期延拓看左右极限：$S(\pm\pi)=\frac{f(-\pi^+)+f(\pi^-)}{2}$）。`,
    trap: r`区间端点最容易错：$f$ 在 $[-\pi,\pi)$ 上定义，$x=\pi$ 处的和是 $\frac{f(-\pi^+)+f(\pi^-)}{2}$，不是 $f(\pi)$。`,
  },
  {
    sec: '傅里叶级数', k: 'qa', s: 2,
    q: r`定义在 $[0,l]$ 上的函数如何展开成正弦级数 / 余弦级数？`,
    a: r`**正弦级数**：作**奇延拓**（再周期延拓），$a_n=0$，$b_n=\dfrac2l\displaystyle\int_0^lf(x)\sin\dfrac{n\pi x}{l}dx$，$f(x)\sim\sum b_n\sin\dfrac{n\pi x}{l}$。
**余弦级数**：作**偶延拓**，$b_n=0$，$a_n=\dfrac2l\displaystyle\int_0^lf(x)\cos\dfrac{n\pi x}{l}dx$，$f(x)\sim\dfrac{a_0}2+\sum a_n\cos\dfrac{n\pi x}{l}$。
延拓后再用狄利克雷定理确定和函数：奇延拓时 $x=0$ 处和为 0。`,
  },
  {
    sec: '常数项级数', k: 'qa', s: 2,
    q: '常数项级数求和的常用方法',
    a: r`① **裂项**：$\dfrac1{n(n+1)}=\dfrac1n-\dfrac1{n+1}$，部分和取极限；
② **化为幂级数在某点的值**：$\sum\dfrac{n}{2^n}=S(\frac12)$，其中 $S(x)=\sum nx^n=\dfrac{x}{(1-x)^2}$；
③ **利用已知展开式**：$\sum\dfrac{1}{n!}=e$，$\sum\dfrac{(-1)^{n-1}}n=\ln2$，$\sum\dfrac{(-1)^n}{2n+1}=\dfrac\pi4$；
④ **傅里叶级数取特殊点**：如由 $x^2$ 的展开得 $\sum\dfrac1{n^2}=\dfrac{\pi^2}6$。`,
  },
]);

/* ------------------------------------------------------------------ */
/* h6 增补：微分方程的数学一专属内容                                     */
/* ------------------------------------------------------------------ */
export const h6m1 = defineM1('h6', [
  {
    sec: '一阶方程', k: 'qa', s: 2,
    q: r`全微分方程 $P(x,y)\,dx+Q(x,y)\,dy=0$ 的判定与解法`,
    a: r`**判定**：在单连通区域内 $P,Q$ 一阶偏导连续，且 $\dfrac{\partial P}{\partial y}=\dfrac{\partial Q}{\partial x}$。
**解法**：求 $u(x,y)$ 使 $du=P\,dx+Q\,dy$（折线积分 / 偏积分 / 凑微分），通解为 $u(x,y)=C$。
**积分因子**：若不满足条件，可乘 $\mu(x,y)$ 使之成为全微分方程；常见 $\mu=\frac1{x^2},\frac1{y^2},\frac1{xy},\frac1{x^2+y^2}$，对应 $d\big(\frac yx\big),d\big(\frac xy\big),d(\ln|xy|),d\big(\arctan\frac yx\big)$ 等。`,
    hook: r`$x\,dy+y\,dx=d(xy)$，$x\,dy-y\,dx=x^2d\big(\frac yx\big)$，$\frac{x\,dy-y\,dx}{x^2+y^2}=d\big(\arctan\frac yx\big)$。`,
  },
  {
    sec: '高阶线性方程', k: 'cloze', s: 2,
    q: r`欧拉方程 $x^2y''+pxy'+qy=f(x)$：令 $x=⟦e^t⟧$（$x>0$），记 $D=\dfrac{d}{dt}$，则 $xy'=⟦Dy⟧$，$x^2y''=⟦D(D-1)y⟧$，化为常系数线性方程`,
    cond: r`$x<0$ 时令 $x=-e^t$。三阶：$x^3y'''=D(D-1)(D-2)y$。`,
    hook: r`记忆：$x^ky^{(k)}=D(D-1)\cdots(D-k+1)y$，形如「下降阶乘」。`,
  },
]);

export const M1_HS_CARDS: KCard[] = [...g, ...h4m1, ...h7, ...h8, ...h9, ...h6m1];
