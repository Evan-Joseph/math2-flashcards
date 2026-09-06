import { defineChapter, r } from './types';

export const l1 = defineChapter('l1', [
  {
    sec: '定义与性质', k: 'qa', s: 3,
    q: '行列式的 6 条基本性质',
    a: r`1. $|A^T|=|A|$（行的性质对列同样成立）；
2. 交换两行，行列式**变号**；两行相同 $\Rightarrow|A|=0$；
3. 某行公因子 $k$ 可提到外面；某行全为 0 $\Rightarrow|A|=0$；
4. 两行成比例 $\Rightarrow|A|=0$；
5. 某行为两组数之和，可拆成两个行列式之和（**只拆一行**）；
6. 某行的 $k$ 倍加到另一行，行列式**不变**。`,
    trap: r`$|kA|=k^n|A|$（每一行都提 $k$），不是 $k|A|$；$|A+B|\ne|A|+|B|$。`,
  },
  {
    sec: '展开定理', k: 'cloze', s: 3,
    q: r`代数余子式 $A_{ij}=⟦(-1)^{i+j}M_{ij}⟧$；按第 $i$ 行展开 $|A|=⟦\displaystyle\sum_{j=1}^na_{ij}A_{ij}⟧$；异行相乘 $\displaystyle\sum_{j=1}^na_{ij}A_{kj}=⟦0⟧\ (i\ne k)$`,
    hook: r`求 $\sum_j c_jA_{ij}$（某行代数余子式的线性组合）：把第 $i$ 行**换成** $c_1,\dots,c_n$ 后算行列式。`,
  },
  {
    sec: '特殊行列式', k: 'cloze', s: 3,
    q: r`上（下）三角行列式 $=⟦\text{主对角线元素之积}⟧$；副对角线三角行列式 $=⟦(-1)^{\frac{n(n-1)}{2}}a_{1n}a_{2,n-1}\cdots a_{n1}⟧$`,
  },
  {
    sec: '特殊行列式', k: 'cloze', s: 3,
    q: r`范德蒙德行列式 $\begin{vmatrix}1&1&\cdots&1\\x_1&x_2&\cdots&x_n\\\vdots&\vdots&&\vdots\\x_1^{n-1}&x_2^{n-1}&\cdots&x_n^{n-1}\end{vmatrix}=⟦\displaystyle\prod_{1\le i<j\le n}(x_j-x_i)⟧$`,
    hook: '「后减前」全部相乘。第一行全 1、逐行升幂是标准形，行列可转置。',
  },
  {
    sec: '特殊行列式', k: 'cloze', s: 3,
    q: r`分块三角：$\begin{vmatrix}A&C\\O&B\end{vmatrix}=⟦|A|\,|B|⟧$；副对角分块（$A$ 为 $m$ 阶，$B$ 为 $n$ 阶）$\begin{vmatrix}O&A\\B&O\end{vmatrix}=⟦(-1)^{mn}|A|\,|B|⟧$`,
  },
  {
    sec: '矩阵行列式', k: 'qa', s: 3,
    q: '与矩阵运算相关的 7 个行列式公式',
    cond: r`$A,B$ 均为 $n$ 阶方阵；$|A^{-1}|=1/|A|$ 要求 $A$ 可逆；$|A^*|=|A|^{n-1}$ 对任意 $n\ge2$ 的方阵成立（含 $|A|=0$）；$|A|=\prod\lambda_i$ 中 $\lambda_i$ 计重数、含复特征值。`,
    a: r`$$|kA|=k^n|A|,\quad|AB|=|A||B|,\quad|A^T|=|A|,\quad|A^{-1}|=\frac1{|A|}$$
$$|A^*|=|A|^{n-1},\quad|A^k|=|A|^k,\quad|A|=\prod_{i=1}^n\lambda_i$$
$|E_m+AB|=|E_n+BA|$（$A$ 为 $m\times n$，$B$ 为 $n\times m$）`,
    hook: r`抽象行列式（如 $|A^2+2A|$）：分解成 $|A||A+2E|$，再用特征值 $\prod(\lambda_i+2)$。`,
  },
  {
    sec: '计算技巧', k: 'qa', s: 3,
    q: '数值行列式的 5 种常用计算技巧',
    a: r`1. **化三角形**：用倍加消元。
2. **逐行相加/各行加到第一行**：适用于每行（列）元素之和相等的行列式，提公因子。
3. **爪形（箭形）**：用对角元消去第一行（列）的其余元素。
4. **加边法**：升阶后消元，适用于「主对角线 + 秩 1」型 $|D+\alpha\beta^T|$。
5. **递推法**：三对角行列式 $D_n=aD_{n-1}-bcD_{n-2}$，或按行展开找递推。
6. **拆分法**：某行是两数之和时拆成两个。`,
  },
  {
    sec: '克拉默法则', k: 'qa', s: 2,
    q: '克拉默法则的内容及其对齐次方程组的推论',
    a: r`$n$ 个方程 $n$ 个未知数，系数行列式 $D\ne0$，则有唯一解 $x_i=\dfrac{D_i}{D}$（$D_i$ 为用常数列替换第 $i$ 列所得）。
推论：齐次方程组 $Ax=0$ **只有零解** $\iff|A|\ne0$；**有非零解** $\iff|A|=0$。`,
    trap: r`$|A|=0$ 时非齐次方程组可能无解，也可能有无穷多解，不能直接下结论。`,
  },
  {
    sec: '矩阵行列式', k: 'qa', s: 3,
    q: r`$|A|\ne0$ 的 7 个等价说法`,
    a: r`$|A|\ne0\iff A$ 可逆 $\iff r(A)=n\iff$ 列（行）向量组线性无关 $\iff Ax=0$ 只有零解 $\iff Ax=b$ 有唯一解 $\iff$ 特征值全不为 0 $\iff A$ 可表示为初等矩阵之积 $\iff A\cong E$。`,
    hook: '证 |A|=0 的常用套路：找到非零 x 使 Ax=0，或证 0 是特征值，或证 r(A)<n。',
  },
  {
    sec: '特殊行列式', k: 'qa', s: 2,
    q: '反对称矩阵、正交矩阵、幂等矩阵的行列式取值',
    a: r`**反对称** $A^T=-A$：$n$ 为奇数时 $|A|=0$（因 $|A|=|A^T|=(-1)^n|A|$）。
**正交** $A^TA=E$：$|A|=\pm1$。
**幂等** $A^2=A$：$|A|=0$ 或 $1$。
**对合** $A^2=E$：$|A|=\pm1$。`,
  },
  {
    sec: '计算技巧', k: 'cloze', s: 2,
    q: r`$n$ 阶行列式 $\begin{vmatrix}a&b&\cdots&b\\b&a&\cdots&b\\\vdots&&\ddots&\vdots\\b&b&\cdots&a\end{vmatrix}=⟦[a+(n-1)b](a-b)^{n-1}⟧$`,
    hook: r`各列加到第一列提出 $a+(n-1)b$，再用第一行消去其余行得 $(a-b)^{n-1}$。也可看作 $(a-b)E+b\mathbf{1}\mathbf{1}^T$ 的特征值 $a-b$（$n-1$ 重）与 $a+(n-1)b$。`,
  },
  {
    sec: '展开定理', k: 'judge', s: 2,
    q: r`若 $n$ 阶矩阵 $A$ 满足 $|A|=0$，则 $A$ 的所有代数余子式 $A_{ij}$ 都为零。`,
    a: r`✗ 错误。$|A|=0$ 只说明 $r(A)<n$；若 $r(A)=n-1$，则至少有一个 $n-1$ 阶子式非零，即某个 $A_{ij}\ne0$（此时 $r(A^*)=1$）。全部 $A_{ij}=0\iff r(A)\le n-2$。`,
  },
]);

export const l2 = defineChapter('l2', [
  {
    sec: '矩阵运算', k: 'qa', s: 3,
    q: '矩阵乘法「不成立」的三条规律及正确的转置、幂运算规则',
    a: r`**不成立**：① 交换律 $AB\ne BA$；② 消去律 $AB=AC\nRightarrow B=C$；③ $AB=O\nRightarrow A=O$ 或 $B=O$。
由此 $(A+B)^2=A^2+AB+BA+B^2$，$(AB)^k\ne A^kB^k$，除非 $AB=BA$。
**成立**：$(AB)^T=B^TA^T$，$(A^T)^T=A$，$(kA)^T=kA^T$，$(A+B)^T=A^T+B^T$。`,
    trap: r`$A^2=O\nRightarrow A=O$（如 $\begin{pmatrix}0&1\\0&0\end{pmatrix}$）；但实矩阵 $A^TA=O\Rightarrow A=O$。`,
  },
  {
    sec: '逆矩阵', k: 'cloze', s: 3,
    cond: r`$A,B$ 为同阶**可逆**方阵，$k\ne0$。`,
    q: r`$(AB)^{-1}=⟦B^{-1}A^{-1}⟧$，$(A^T)^{-1}=⟦(A^{-1})^T⟧$，$(kA)^{-1}=⟦\frac1kA^{-1}⟧$，$|A^{-1}|=⟦|A|^{-1}⟧$；而 $(A+B)^{-1}$ ⟦一般 $\ne A^{-1}+B^{-1}$⟧`,
  },
  {
    sec: '伴随矩阵', k: 'cloze', s: 3,
    cond: r`$AA^*=A^*A=|A|E$ 对任意 $n$ 阶方阵成立；后三式要求 $A$ **可逆**（$|A|\ne0$）。`,
    q: r`$AA^*=A^*A=⟦|A|E⟧$；$A^{-1}=⟦\dfrac{A^*}{|A|}⟧$；$A^*=⟦|A|A^{-1}⟧$；$(A^*)^{-1}=(A^{-1})^*=⟦\dfrac{A}{|A|}⟧$`,
    hook: r`一切伴随矩阵的问题都回到 $AA^*=|A|E$ 这一个式子。`,
  },
  {
    sec: '伴随矩阵', k: 'cloze', s: 3,
    cond: r`$A,B$ 为 $n$ 阶方阵且 $n\ge2$（$n=1$ 时约定 $A^*=(1)$，各式不适用）；不要求可逆。`,
    q: r`$|A^*|=⟦|A|^{n-1}⟧$，$(A^*)^*=⟦|A|^{n-2}A⟧$，$(kA)^*=⟦k^{n-1}A^*⟧$，$(AB)^*=⟦B^*A^*⟧$，$(A^T)^*=⟦(A^*)^T⟧$`,
    trap: r`二阶矩阵伴随：**主对角互换，副对角变号**。$(A^*)^*$ 对 $n=2$ 时就是 $A$ 本身。`,
  },
  {
    sec: '伴随矩阵', k: 'cloze', s: 3,
    cond: r`$A$ 为 $n$ 阶方阵，$n\ge2$。`,
    q: r`$r(A^*)=\begin{cases}⟦n⟧,&r(A)=n\\ ⟦1⟧,&r(A)=n-1\\ ⟦0⟧,&r(A)<n-1\end{cases}$`,
    hook: r`$r(A)=n-1$ 时 $AA^*=O$，故 $A^*$ 的列都是 $Ax=0$ 的解，$r(A^*)\le1$；又存在非零 $n-1$ 阶子式，故 $=1$。`,
  },
  {
    sec: '初等变换', k: 'qa', s: 3,
    q: '初等矩阵的三种类型、「左行右列」法则、逆矩阵',
    a: r`三种：交换 $E_{ij}$（对调两行）、倍乘 $E_i(k)$（第 $i$ 行乘 $k\ne0$）、倍加 $E_{ij}(k)$（第 $j$ 行的 $k$ 倍加到第 $i$ 行）。
**左行右列**：左乘初等矩阵 = 对 $A$ 作相应**行**变换，右乘 = **列**变换。
逆：$E_{ij}^{-1}=E_{ij}$，$E_i(k)^{-1}=E_i(\frac1k)$，$E_{ij}(k)^{-1}=E_{ij}(-k)$。
初等矩阵的转置仍是同类型初等矩阵；$|E_{ij}|=-1$，$|E_i(k)|=k$，$|E_{ij}(k)|=1$。`,
    trap: r`$E_{ij}(k)$ 右乘时表示「第 $i$ 列的 $k$ 倍加到第 $j$ 列」——行、列的方向是反的。`,
  },
  {
    sec: '逆矩阵', k: 'qa', s: 3,
    q: '求逆矩阵与解矩阵方程的初等变换法；矩阵方程的三种基本形式',
    a: r`$(A\mid E)\xrightarrow{\text{行变换}}(E\mid A^{-1})$；$(A\mid B)\xrightarrow{\text{行}}(E\mid A^{-1}B)$；$\begin{pmatrix}A\\E\end{pmatrix}\xrightarrow{\text{列}}\begin{pmatrix}E\\A^{-1}\end{pmatrix}$。
矩阵方程：$AX=B\Rightarrow X=A^{-1}B$；$XA=B\Rightarrow X=BA^{-1}$；$AXB=C\Rightarrow X=A^{-1}CB^{-1}$。
若系数矩阵不可逆：设 $X$ 的元素为未知数，按列拆成若干线性方程组求解。`,
    trap: r`先把方程整理成 $(\cdots)X=\cdots$ 的形式再求逆，如 $AX=A+2X\Rightarrow(A-2E)X=A$。`,
  },
  {
    sec: '秩', k: 'qa', s: 3,
    q: '矩阵秩的 10 条重要性质',
    a: r`1. $0\le r(A_{m\times n})\le\min\{m,n\}$；$r(A)=r(A^T)=r(A^TA)=r(AA^T)$
2. $r(kA)=r(A)\ (k\ne0)$
3. $r(A+B)\le r(A)+r(B)$
4. $r(AB)\le\min\{r(A),r(B)\}$
5. $r(AB)\ge r(A)+r(B)-n$（$A$ 为 $m\times n$，$B$ 为 $n\times s$）
6. $AB=O\Rightarrow r(A)+r(B)\le n$
7. $P,Q$ 可逆 $\Rightarrow r(PAQ)=r(A)$
8. $A$ 列满秩 $\Rightarrow r(AB)=r(B)$；$B$ 行满秩 $\Rightarrow r(AB)=r(A)$
9. $r\begin{pmatrix}A&O\\O&B\end{pmatrix}=r(A)+r(B)$；$r\begin{pmatrix}A&C\\O&B\end{pmatrix}\ge r(A)+r(B)$
10. $\max\{r(A),r(B)\}\le r(A,B)\le r(A)+r(B)$`,
    hook: '秩 = 非零子式最高阶数 = 行阶梯形非零行数 = 列向量组的秩。初等变换不改变秩。',
  },
  {
    sec: '分块矩阵', k: 'qa', s: 2,
    q: '三个常用分块矩阵求逆公式',
    a: r`$$\begin{pmatrix}A&O\\O&B\end{pmatrix}^{-1}=\begin{pmatrix}A^{-1}&O\\O&B^{-1}\end{pmatrix},\qquad\begin{pmatrix}O&A\\B&O\end{pmatrix}^{-1}=\begin{pmatrix}O&B^{-1}\\A^{-1}&O\end{pmatrix}$$
$$\begin{pmatrix}A&C\\O&B\end{pmatrix}^{-1}=\begin{pmatrix}A^{-1}&-A^{-1}CB^{-1}\\O&B^{-1}\end{pmatrix},\qquad\begin{pmatrix}A&O\\C&B\end{pmatrix}^{-1}=\begin{pmatrix}A^{-1}&O\\-B^{-1}CA^{-1}&B^{-1}\end{pmatrix}$$`,
    hook: '副对角分块求逆：位置对调再各自求逆。分块对角矩阵的幂：各块分别求幂。',
  },
  {
    sec: '矩阵幂', k: 'qa', s: 3,
    q: r`求 $A^n$ 的 5 种方法`,
    a: r`1. **秩为 1**：$A=\alpha\beta^T\Rightarrow A^n=(\beta^T\alpha)^{n-1}A=(\operatorname{tr}A)^{n-1}A$。
2. **相似对角化**：$A=P\Lambda P^{-1}\Rightarrow A^n=P\Lambda^nP^{-1}$。
3. **二项式展开**：$A=aE+B$ 且 $B$ 幂零（$B^k=O$），$(aE+B)^n=\sum C_n^ia^{n-i}B^i$，只剩前 $k$ 项。
4. **分块对角**：各块分别求幂。
5. **找规律**：算 $A^2,A^3$ 归纳（初等矩阵、旋转矩阵等）。`,
    hook: r`若 $A^2=kA$，则 $A^n=k^{n-1}A$；若 $A=\alpha\beta^T$ 则 $A^2=(\beta^T\alpha)A$。`,
  },
  {
    sec: '特殊矩阵', k: 'qa', s: 3,
    q: '正交矩阵的定义、等价条件与性质',
    a: r`定义：$A^TA=AA^T=E$。
等价：$A^{-1}=A^T$ $\iff$ 列向量组是**标准正交组**（两两正交且单位）$\iff$ 行向量组是标准正交组。
性质：$|A|=\pm1$；$A^{-1},A^T,A^*$ 均正交；两正交矩阵之积正交；正交变换保持内积、长度不变；实特征值只能是 $\pm1$。`,
  },
  {
    sec: '特殊矩阵', k: 'qa', s: 2,
    q: '对称矩阵、反对称矩阵的构造与性质；幂等/对合矩阵的秩关系',
    a: r`任意方阵：$A+A^T$ 对称，$A-A^T$ 反对称，$AA^T$、$A^TA$ 对称；$A=\frac{A+A^T}2+\frac{A-A^T}2$。
$A,B$ 对称，$AB$ 对称 $\iff AB=BA$。
**幂等** $A^2=A\Rightarrow r(A)+r(E-A)=n$；**对合** $A^2=E\Rightarrow r(A+E)+r(A-E)=n$。`,
    hook: r`证明思路：$A(E-A)=O\Rightarrow r(A)+r(E-A)\le n$，又 $r(A)+r(E-A)\ge r(A+E-A)=n$。`,
  },
  {
    sec: '等价', k: 'qa', s: 2,
    q: '矩阵等价的定义、判定与等价标准形',
    a: r`$A\cong B\iff$ 存在可逆 $P,Q$ 使 $PAQ=B\iff A$ 经有限次初等变换变为 $B\iff$ **同型且秩相等**。
等价标准形：$A_{m\times n}$ 秩为 $r$，则 $A\cong\begin{pmatrix}E_r&O\\O&O\end{pmatrix}$。`,
    hook: '等价 ⊃ 相似 ⊃ 正交相似；等价 ⊃ 合同。相似、合同都是方阵的概念，等价对任意同型矩阵。',
  },
  {
    sec: '矩阵运算', k: 'cloze', s: 2,
    q: r`若 $A^k=O$，则 $E-A$ 可逆且 $(E-A)^{-1}=⟦E+A+A^2+\cdots+A^{k-1}⟧$；若 $A^2-A-2E=O$，则 $A^{-1}=⟦\dfrac12(A-E)⟧$`,
    hook: r`抽象矩阵求逆：凑出 $A\cdot(\cdots)=E$ 的形式，括号里就是逆。`,
  },
  {
    sec: '矩阵运算', k: 'cloze', s: 2,
    q: r`迹的性质：$\operatorname{tr}(AB)=⟦\operatorname{tr}(BA)⟧$，$\operatorname{tr}(A)=⟦\sum\lambda_i⟧$，$\operatorname{tr}(\alpha\beta^T)=⟦\beta^T\alpha⟧$`,
  },
  {
    sec: '初等变换', k: 'judge', s: 3,
    q: '对矩阵作初等行变换，不改变其列向量组之间的线性关系。',
    a: r`✓ 正确。行变换相当于左乘可逆矩阵 $P$：若 $\alpha_3=2\alpha_1-\alpha_2$，则 $P\alpha_3=2P\alpha_1-P\alpha_2$。这是「行变换求极大无关组并表示其余向量」的理论基础。但行变换**会改变行向量组**的线性关系（只保持行向量组的秩与生成空间）。`,
  },
  {
    sec: '逆矩阵', k: 'judge', s: 2,
    q: r`若 $A,B$ 均为 $n$ 阶可逆矩阵，则 $A+B$ 可逆。`,
    a: r`✗ 错误。如 $A=E$，$B=-E$。可逆矩阵对加法不封闭，对乘法封闭。`,
  },
  {
    sec: '秩', k: 'judge', s: 2,
    q: r`若 $r(A)=r$，则 $A$ 中所有 $r$ 阶子式都不为零。`,
    a: r`✗ 错误。正确说法：**存在**一个 $r$ 阶子式非零，且**所有** $r+1$ 阶子式（若存在）全为零。`,
  },
  {
    sec: '矩阵运算', k: 'steps', s: 2,
    q: r`已知 $A$ 与 $B=f(A)$（多项式）的关系式求 $B^{-1}$ 或证明可逆的思路`,
    a: r`1. 把已知关系整理为 $g(A)\cdot h(A)=cE$（$c\ne0$）的形式，用多项式因式分解。
2. 若目标是 $(A+kE)^{-1}$，做多项式除法：$f(A)=(A+kE)q(A)+rE$，移项得 $(A+kE)\cdot q(A)=(f(A)-rE)$。
3. 若 $f(A)=O$ 且 $r\ne0$，则 $(A+kE)^{-1}=-\frac1r q(A)$。
4. 反过来判断不可逆：若 $A+kE$ 可逆将导致矛盾（如 $A=cE$ 与题设不符），则不可逆，即 $-k$ 是特征值。`,
  },
]);

export const l3 = defineChapter('l3', [
  {
    sec: '线性表示', k: 'qa', s: 3,
    q: r`$\beta$ 能由 $\alpha_1,\dots,\alpha_s$ 线性表示的等价条件（用方程组、用秩）`,
    a: r`$\beta$ 可由 $\alpha_1,\dots,\alpha_s$ 线性表示
$\iff$ 方程组 $x_1\alpha_1+\cdots+x_s\alpha_s=\beta$（即 $Ax=\beta$）有解
$\iff r(\alpha_1,\dots,\alpha_s)=r(\alpha_1,\dots,\alpha_s,\beta)$。
表示**唯一** $\iff$ 上述秩 $=s$（$\alpha_1,\dots,\alpha_s$ 线性无关）。`,
    trap: r`不能表示 $\iff r(A)+1=r(A,\beta)$。`,
  },
  {
    sec: '线性相关', k: 'qa', s: 3,
    q: '线性相关与线性无关的定义及等价判定',
    a: r`**相关**：存在不全为零的 $k_1,\dots,k_s$ 使 $\sum k_i\alpha_i=0$ $\iff Ax=0$ 有非零解 $\iff r(\alpha_1,\dots,\alpha_s)<s$ $\iff$ 至少一个向量可由其余向量表示。
**无关**：$\sum k_i\alpha_i=0\Rightarrow k_i$ 全为 0 $\iff Ax=0$ 只有零解 $\iff r=s$。
$n$ 个 $n$ 维向量：相关 $\iff|A|=0$。`,
    hook: '证明无关的标准套路：设 k₁α₁+…+kₛαₛ=0，两边左乘某矩阵或与某向量作内积，推出 k 全为 0。',
  },
  {
    sec: '线性相关', k: 'qa', s: 3,
    q: '线性相关性的 6 条重要性质',
    a: r`1. 含零向量的向量组必相关；单个非零向量无关；
2. **部分相关 $\Rightarrow$ 整体相关；整体无关 $\Rightarrow$ 部分无关**；
3. **向量个数 > 维数 $\Rightarrow$ 相关**（$n+1$ 个 $n$ 维向量必相关）；
4. 无关组「加长」（增加分量）仍无关；相关组「截短」仍相关；
5. $\alpha_1,\dots,\alpha_s$ 无关而 $\alpha_1,\dots,\alpha_s,\beta$ 相关 $\Rightarrow\beta$ 可由前者**唯一**表示；
6. 以少表多，多的必相关：若 $\beta_1,\dots,\beta_t$ 可由 $\alpha_1,\dots,\alpha_s$ 表示且 $t>s$，则 $\beta$ 组相关。逆否：$\beta$ 组无关 $\Rightarrow t\le s$。`,
    trap: '两两线性无关 ⇏ 整体线性无关（如平面上三个两两不平行的向量）。',
  },
  {
    sec: '秩与极大无关组', k: 'qa', s: 3,
    q: '极大线性无关组的定义、求法；向量组的秩与矩阵秩的关系',
    a: r`**极大无关组**：部分组 $\alpha_{i_1},\dots,\alpha_{i_r}$ 线性无关，且再添任一向量都相关（等价：组内任一向量可由它表示）。
**求法**：以向量为**列**排成矩阵，作**行变换**化为行阶梯形（或行最简形），主元所在列对应的原向量构成极大无关组，行最简形的列直接给出其余向量的表示系数。
**秩**：向量组的秩 = 极大无关组所含向量个数 = 矩阵的秩 = 行秩 = 列秩。`,
    trap: '极大无关组不唯一，但所含向量个数（秩）唯一。若按行排列则必须用列变换。',
  },
  {
    sec: '等价向量组', k: 'qa', s: 2,
    q: '向量组等价的定义与判定；等价与秩的关系',
    a: r`两向量组可以**互相线性表示**称为等价。
判定：$(\mathrm{I})\cong(\mathrm{II})\iff r(\mathrm{I})=r(\mathrm{II})=r(\mathrm{I},\mathrm{II})$。
等价向量组秩相等；但秩相等**不一定**等价（例如 $(1,0)$ 与 $(0,1)$）。
向量组与其任一极大无关组等价。`,
    trap: '矩阵等价（同型且秩相等）与向量组等价是不同概念：矩阵 A、B 等价 ⇏ 它们的列向量组等价。',
  },
  {
    sec: '内积与正交', k: 'cloze', s: 3,
    q: r`内积 $(\alpha,\beta)=⟦\alpha^T\beta=\sum a_ib_i⟧$；长度 $\|\alpha\|=⟦\sqrt{\alpha^T\alpha}⟧$；$\alpha\perp\beta\iff⟦\alpha^T\beta=0⟧$；柯西不等式 $|(\alpha,\beta)|\le⟦\|\alpha\|\,\|\beta\|⟧$`,
    hook: '非零的正交向量组必线性无关（两边与 αᵢ 作内积）。',
  },
  {
    sec: '内积与正交', k: 'qa', s: 3,
    q: '施密特正交化公式（三个向量）与单位化',
    a: r`$$\beta_1=\alpha_1,\qquad\beta_2=\alpha_2-\frac{(\alpha_2,\beta_1)}{(\beta_1,\beta_1)}\beta_1$$
$$\beta_3=\alpha_3-\frac{(\alpha_3,\beta_1)}{(\beta_1,\beta_1)}\beta_1-\frac{(\alpha_3,\beta_2)}{(\beta_2,\beta_2)}\beta_2$$
单位化：$\gamma_i=\dfrac{\beta_i}{\|\beta_i\|}$。`,
    hook: '几何直觉：减去在已有正交向量上的投影。分母是 β 与自己的内积，分子是新向量与 β 的内积。',
    trap: '实对称矩阵正交对角化时，只有「同一特征值的多个特征向量」才需要施密特正交化；不同特征值的特征向量已自动正交。',
  },
  {
    sec: '线性相关', k: 'qa', s: 3,
    q: r`设 $(\beta_1,\dots,\beta_s)=(\alpha_1,\dots,\alpha_s)C$，$\alpha$ 组线性无关，则 $\beta$ 组线性无关的充要条件是什么？`,
    a: r`$\beta_1,\dots,\beta_s$ 线性无关 $\iff|C|\ne0$（$C$ 可逆）。
一般地 $r(\beta_1,\dots,\beta_t)=r(C)$（当 $\alpha$ 组无关时）。
推论：线性无关组左乘可逆矩阵仍线性无关；$A$ 列满秩时 $AB=O\Rightarrow B=O$。`,
    hook: r`如 $\beta_1=\alpha_1+\alpha_2,\beta_2=\alpha_2+\alpha_3,\beta_3=\alpha_3+\alpha_1$：$|C|=2\ne0$，无关；若是 $\beta_3=\alpha_1-\alpha_3$ 则 $|C|=0$，相关。`,
  },
  {
    sec: '线性相关', k: 'judge', s: 2,
    q: r`若 $\alpha_1,\alpha_2,\alpha_3$ 线性相关，则 $\alpha_1$ 一定可由 $\alpha_2,\alpha_3$ 线性表示。`,
    a: r`✗ 错误。相关只保证「**至少有一个**」向量可由其余表示，不一定是 $\alpha_1$。如 $\alpha_1=(1,0),\alpha_2=\alpha_3=(0,1)$。`,
  },
  {
    sec: '线性相关', k: 'judge', s: 2,
    q: r`若 $Ax=0$ 只有零解，则 $A$ 的列向量组线性无关。`,
    a: r`✓ 正确。这是定义的直接翻译：$Ax=x_1\alpha_1+\cdots+x_n\alpha_n$。同理 $A$ 行向量组无关 $\iff A^Tx=0$ 只有零解 $\iff r(A)=m$。`,
  },
  {
    sec: '线性表示', k: 'steps', s: 2,
    q: r`判断「$\beta$ 能否由 $\alpha_1,\alpha_2,\alpha_3$ 线性表示、表示是否唯一」（含参数）的解题步骤`,
    a: r`1. 写增广矩阵 $(\alpha_1,\alpha_2,\alpha_3\mid\beta)$，作行变换化阶梯形。
2. 若系数部分是方阵，也可先算 $|\alpha_1,\alpha_2,\alpha_3|$：$\ne0$ 时唯一表示。
3. 行列式 $=0$ 的参数值逐一代入：比较 $r(A)$ 与 $r(A,\beta)$——相等则可表示（不唯一），不等则不可表示。
4. 需要写出表示式时，化为行最简形读出系数（含自由变量时写出通式）。`,
  },
  {
    sec: '秩与极大无关组', k: 'judge', s: 2,
    q: r`若向量组 $(\mathrm{I})$ 可由 $(\mathrm{II})$ 线性表示，则 $r(\mathrm{I})\le r(\mathrm{II})$。`,
    a: r`✓ 正确。「被表示的秩不超过表示者的秩」。矩阵语言：$A=BC\Rightarrow r(A)\le r(B)$。它是「以少表多、多的相关」的秩版本。`,
  },
  {
    sec: '内积与正交', k: 'qa', s: 2,
    q: r`已知 $\alpha_1=(1,1,1)^T$，求与之正交的两个线性无关向量并把三者化为标准正交组的思路`,
    a: r`1. 解 $\alpha_1^Tx=0$，即 $x_1+x_2+x_3=0$，得基础解系如 $\alpha_2=(1,-1,0)^T,\alpha_3=(1,0,-1)^T$。
2. $\alpha_2,\alpha_3$ 自动与 $\alpha_1$ 正交，但彼此未必正交：对 $\alpha_2,\alpha_3$ 施密特正交化（$\beta_3=\alpha_3-\frac{(\alpha_3,\alpha_2)}{(\alpha_2,\alpha_2)}\alpha_2=(\frac12,\frac12,-1)^T$）。
3. 全部单位化。
（这就是「实对称矩阵已知一个特征向量求其余」的标准做法。）`,
  },
  {
    sec: '线性相关', k: 'qa', s: 2,
    q: r`若 $\alpha_1,\dots,\alpha_s$ 是 $Ax=0$ 的线性无关解，$\beta$ 是 $Ax=b$ 的解，判断 $\beta,\beta+\alpha_1,\dots,\beta+\alpha_s$ 的相关性`,
    a: r`线性无关。设 $k_0\beta+\sum k_i(\beta+\alpha_i)=0$，即 $(k_0+\sum k_i)\beta+\sum k_i\alpha_i=0$。左乘 $A$：$(k_0+\sum k_i)b=0$，$b\ne0\Rightarrow k_0+\sum k_i=0$，于是 $\sum k_i\alpha_i=0\Rightarrow k_i=0\Rightarrow k_0=0$。
结论：非齐次方程组最多有 $n-r(A)+1$ 个线性无关解。`,
  },
]);

export const l4 = defineChapter('l4', [
  {
    sec: '齐次方程组', k: 'qa', s: 3,
    q: r`齐次方程组 $A_{m\times n}x=0$ 有非零解的充要条件；基础解系的定义与所含向量个数`,
    a: r`有非零解 $\iff r(A)<n\iff$ 列向量组线性相关；（$m=n$ 时 $\iff|A|=0$）；$m<n$ 时必有非零解。
**基础解系** $\xi_1,\dots,\xi_{n-r}$：① 都是解；② 线性无关；③ 任一解可由它们线性表示。个数恒为 $n-r(A)$。
通解 $x=k_1\xi_1+\cdots+k_{n-r}\xi_{n-r}$。`,
    trap: r`证明某组向量是基础解系必须验证**三条**：是解、无关、个数等于 $n-r(A)$（第三条可替代「任一解可表示」）。`,
  },
  {
    sec: '非齐次方程组', k: 'cloze', s: 3,
    q: r`$Ax=b$ 有解 $\iff⟦r(A)=r(A,b)⟧$；唯一解 $\iff⟦r(A)=r(A,b)=n⟧$；无穷多解 $\iff⟦r(A)=r(A,b)<n⟧$；无解 $\iff⟦r(A)+1=r(A,b)⟧$`,
    hook: r`$r(A)=m$（行满秩）$\Rightarrow$ 对任意 $b$ 都有解；$r(A)=n$（列满秩）$\Rightarrow$ 有解时必唯一。`,
  },
  {
    sec: '解的结构', k: 'qa', s: 3,
    q: '非齐次方程组解的结构与解的性质',
    a: r`通解 $=$ 特解 $\eta^*$ $+$ 导出组 $Ax=0$ 的通解：$x=\eta^*+k_1\xi_1+\cdots+k_{n-r}\xi_{n-r}$。
性质：$\eta_1,\eta_2$ 是 $Ax=b$ 的解 $\Rightarrow\eta_1-\eta_2$ 是 $Ax=0$ 的解；
$k_1\eta_1+k_2\eta_2$ 是 $Ax=b$ 的解 $\iff k_1+k_2=1$；是 $Ax=0$ 的解 $\iff k_1+k_2=0$。`,
    hook: r`已知 $Ax=b$ 的几个解，用「相减」造齐次解，用「组合系数和为 1」造非齐次解。`,
  },
  {
    sec: '求解方法', k: 'steps', s: 3,
    q: '用初等行变换求解线性方程组的标准步骤',
    a: r`1. 写增广矩阵 $(A\mid b)$，**只作行变换**化为行阶梯形，读出 $r(A)$ 与 $r(A,b)$，判断解的情况。
2. 继续化为**行最简形**（主元为 1，主元列其余为 0）。
3. 主元列对应的未知数为约束变量，其余为**自由变量**（共 $n-r$ 个）。
4. 求特解：自由变量全取 0。
5. 求基础解系：自由变量依次取 $(1,0,\dots),(0,1,\dots),\dots$，代入求约束变量。
6. 写出通解，检验。`,
    trap: '求解方程组只能用行变换！列变换会改变解。',
  },
  {
    sec: '含参数讨论', k: 'steps', s: 3,
    q: '含参数线性方程组解的讨论的两种策略',
    a: r`1. **策略一（系数矩阵为方阵）**：先算 $|A|$；$|A|\ne0$ 时唯一解（克拉默法则）。
2. $|A|=0$ 的每个参数值分别代入，用行变换比较 $r(A)$ 与 $r(A,b)$，判断无解 / 无穷多解。
3. **策略二（非方阵或行列式难算）**：直接对 $(A\mid b)$ 作行变换，**避免用含参数的式子作除法**，按「使某个主元为 0」的参数取值分类讨论。
4. 写通解时，特解与基础解系都要在对应参数值下重新计算，不能沿用一般参数下的形式。`,
  },
  {
    sec: '公共解与同解', k: 'qa', s: 3,
    q: '两个方程组的公共解的三种求法；同解的判定',
    a: r`**公共解**：
① 两方程组都已知：联立求解；
② 已知各自的通解：令 $k_1\xi_1+k_2\xi_2=l_1\eta_1+l_2\eta_2$，解出 $k,l$ 的关系；
③ 一个已知方程、一个已知通解：把通解代入另一个方程组求参数。
**同解**：$Ax=0$ 与 $Bx=0$ 同解 $\iff r(A)=r(B)=r\begin{pmatrix}A\\B\end{pmatrix}$ $\iff$ 行向量组等价。
特例：$A^TAx=0$ 与 $Ax=0$ 同解（故 $r(A^TA)=r(A)$）。`,
  },
  {
    sec: '齐次方程组', k: 'qa', s: 3,
    q: r`$AB=O$ 蕴含什么？已知 $Ax=0$ 的基础解系如何反求 $A$？`,
    a: r`$AB=O\Rightarrow B$ 的每一列都是 $Ax=0$ 的解 $\Rightarrow r(A)+r(B)\le n$；同时 $A$ 的每一行（转置后）都是 $B^Tx=0$ 的解。
**反求 $A$**：若基础解系为 $\xi_1,\dots,\xi_k$，令 $B=(\xi_1,\dots,\xi_k)$，则 $AB=O\Rightarrow B^TA^T=O$，即 $A$ 的行向量是 $B^Tx=0$ 的解；解出 $B^Tx=0$ 的基础解系，以它们为行构成 $A$（$r(A)=n-k$）。`,
    hook: '「解与系数互为对方齐次方程组的解」——行向量与解向量正交。',
  },
  {
    sec: '非齐次方程组', k: 'judge', s: 2,
    q: r`若 $Ax=0$ 只有零解，则 $Ax=b$ 有唯一解。`,
    a: r`✗ 错误。$Ax=0$ 只有零解说明 $r(A)=n$，但 $Ax=b$ 可能**无解**（$m>n$ 时 $r(A,b)$ 可能为 $n+1$）。正确的是：$Ax=b$ 有唯一解 $\Rightarrow Ax=0$ 只有零解；以及「$Ax=b$ 有解且 $Ax=0$ 只有零解 $\Rightarrow$ 唯一解」。`,
  },
  {
    sec: '解的结构', k: 'judge', s: 2,
    q: r`若 $\eta_1,\eta_2,\eta_3$ 是 $Ax=b$（$b\ne0$）的三个解且 $r(A)=n-1$，则 $\eta_1-\eta_2$ 与 $\eta_1-\eta_3$ 一定线性相关。`,
    a: r`✓ 正确。$r(A)=n-1$ 意味着 $Ax=0$ 的解空间是一维的，而 $\eta_1-\eta_2$、$\eta_1-\eta_3$ 都是齐次解，两个一维空间中的向量必相关。`,
  },
  {
    sec: '解的结构', k: 'qa', s: 2,
    q: r`设 $A$ 为 $4\times3$ 矩阵，$r(A)=2$，$\eta_1,\eta_2,\eta_3$ 为 $Ax=b$ 的解，且 $\eta_1+\eta_2=(2,0,4)^T$，$\eta_3=(1,1,1)^T$，求通解的思路`,
    a: r`$n-r=3-2=1$，基础解系只需一个非零齐次解。
齐次解：$\frac{\eta_1+\eta_2}{2}$ 是非齐次解（系数和为 1），故 $\frac{\eta_1+\eta_2}{2}-\eta_3=(0,-1,1)^T$ 是齐次非零解。
通解：$x=(1,1,1)^T+k(0,-1,1)^T$。`,
    hook: '先数清楚需要几个基础解系向量，再用已知解「凑」出齐次解。',
  },
  {
    sec: '齐次方程组', k: 'cloze', s: 2,
    q: r`$n$ 元齐次方程组 $Ax=0$ 的解空间维数为 ⟦$n-r(A)$⟧；若 $A$ 为 $n$ 阶方阵且 $r(A)=n-1$，则 $A^*x=0$ 的基础解系含 ⟦$n-1$⟧ 个解向量，且 $A$ 的 ⟦列向量⟧ 都是 $A^*x=0$ 的解`,
    hook: r`$A^*A=O$，$r(A^*)=1$，$A$ 的列（有 $n-1$ 个无关的）恰好构成 $A^*x=0$ 的基础解系。`,
  },
  {
    sec: '公共解与同解', k: 'judge', s: 1,
    q: r`若 $Ax=0$ 的解都是 $Bx=0$ 的解，则 $r(A)\ge r(B)$。`,
    a: r`✓ 正确。解空间包含关系 $N(A)\subseteq N(B)\Rightarrow n-r(A)\le n-r(B)$。若还有 $r(A)=r(B)$，则两方程组同解。`,
  },
]);

export const l5 = defineChapter('l5', [
  {
    sec: '定义与求法', k: 'cloze', s: 3,
    q: r`$A\alpha=\lambda\alpha$（$\alpha\ne0$）；特征方程 $⟦|\lambda E-A|=0⟧$；$\lambda_0$ 对应的特征向量是 ⟦$(\lambda_0E-A)x=0$ 的全部非零解⟧`,
    trap: r`特征向量**必须非零**；零向量不是特征向量。同一特征值的特征向量的**非零**线性组合仍是特征向量。`,
  },
  {
    sec: '定义与求法', k: 'cloze', s: 3,
    q: r`$\displaystyle\sum_{i=1}^n\lambda_i=⟦\operatorname{tr}A=\sum a_{ii}⟧$，$\displaystyle\prod_{i=1}^n\lambda_i=⟦|A|⟧$`,
    hook: '已知部分特征值求参数、验算特征值是否算对，全靠这两条。',
  },
  {
    sec: '性质', k: 'qa', s: 3,
    cond: r`$\alpha\ne\mathbf 0$；$A^{-1}$ 行要求 $A$ 可逆（$\lambda\ne0$）；$A^*$ 行的 $|A|/\lambda$ 形式要求 $\lambda\ne0$，若 $A$ 不可逆需回到 $A^*\alpha=\frac{|A|}{\lambda}\alpha$ 的推导另行讨论。`,
    q: r`设 $A\alpha=\lambda\alpha$，写出 $kA,\ A^k,\ f(A),\ A^{-1},\ A^*,\ A^T,\ P^{-1}AP$ 的特征值与特征向量`,
    a: r`| 矩阵 | 特征值 | 特征向量 |
|---|---|---|
| $kA$ | $k\lambda$ | $\alpha$ |
| $A^k$ | $\lambda^k$ | $\alpha$ |
| $f(A)$ | $f(\lambda)$ | $\alpha$ |
| $A^{-1}$ | $\lambda^{-1}$ | $\alpha$ |
| $A^*$ | $\dfrac{|A|}{\lambda}$ | $\alpha$ |
| $A^T$ | $\lambda$ | **不一定**是 $\alpha$ |
| $P^{-1}AP$ | $\lambda$ | $P^{-1}\alpha$ |`,
    trap: r`$A+B$、$AB$ 的特征值一般**不是** $\lambda_A+\lambda_B$、$\lambda_A\lambda_B$。`,
  },
  {
    sec: '性质', k: 'qa', s: 3,
    q: '关于特征向量线性无关性的三条结论',
    a: r`1. **不同特征值**对应的特征向量线性无关；
2. $k$ 重特征值至多有 $k$ 个线性无关的特征向量（几何重数 $\le$ 代数重数）；
3. 不同特征值的特征向量之和**不是**特征向量；一个特征向量只能属于一个特征值。`,
    hook: r`证明 $\alpha_1+\alpha_2$（$\lambda_1\ne\lambda_2$）不是特征向量：假设 $A(\alpha_1+\alpha_2)=\mu(\alpha_1+\alpha_2)$，得 $(\lambda_1-\mu)\alpha_1+(\lambda_2-\mu)\alpha_2=0$，与无关矛盾。`,
  },
  {
    sec: '相似', k: 'qa', s: 3,
    q: '相似矩阵的定义、必要条件（相似不变量）及派生相似关系',
    a: r`$A\sim B\iff\exists$ 可逆 $P$，$P^{-1}AP=B$。
**必要条件**：$|\lambda E-A|=|\lambda E-B|$（特征值相同）、$|A|=|B|$、$\operatorname{tr}A=\operatorname{tr}B$、$r(A)=r(B)$、$r(\lambda E-A)=r(\lambda E-B)$（对每个 $\lambda$）。
**派生**：$A\sim B\Rightarrow A^k\sim B^k,\ A^{-1}\sim B^{-1},\ A^*\sim B^*,\ A^T\sim B^T,\ f(A)\sim f(B)$，且 $P$ 相同。`,
    trap: r`特征值相同 $\nRightarrow$ 相似（如 $\begin{pmatrix}1&1\\0&1\end{pmatrix}$ 与 $E$）。但若 $A,B$ **都可对角化**且特征值相同，则 $A\sim B$。`,
  },
  {
    sec: '对角化', k: 'qa', s: 3,
    q: '矩阵可相似对角化的充要条件与充分条件',
    a: r`**充要**：$A$ 有 $n$ 个线性无关的特征向量 $\iff$ 对每个 $k_i$ 重特征值 $\lambda_i$，都有 $n-r(\lambda_iE-A)=k_i$。
**充分**：① $A$ 有 $n$ 个互异特征值；② $A$ 是实对称矩阵。
**不可对角化的判断**：某个重特征值 $\lambda_i$ 的 $r(\lambda_iE-A)>n-k_i$。`,
    hook: r`判断可否对角化只需检查**重根**；单根天然满足。秩 1 矩阵 $A=\alpha\beta^T$ 可对角化 $\iff\beta^T\alpha\ne0$。`,
  },
  {
    sec: '对角化', k: 'steps', s: 3,
    q: r`求可逆矩阵 $P$ 使 $P^{-1}AP=\Lambda$ 的步骤`,
    a: r`1. 解 $|\lambda E-A|=0$ 得全部特征值（含重数）。
2. 对每个 $\lambda_i$ 解 $(\lambda_iE-A)x=0$，求基础解系（特征向量）。
3. 检查无关特征向量总数是否为 $n$；是则可对角化。
4. $P=(\xi_1,\dots,\xi_n)$，$\Lambda=\operatorname{diag}(\lambda_1,\dots,\lambda_n)$，**特征值顺序与特征向量顺序一一对应**。
5. 应用：$A^n=P\Lambda^nP^{-1}$；$A=P\Lambda P^{-1}$。`,
  },
  {
    sec: '实对称矩阵', k: 'qa', s: 3,
    q: '实对称矩阵的 4 条核心性质',
    a: r`1. 特征值全为**实数**，特征向量可取为实向量；
2. **不同特征值**对应的特征向量**正交**；
3. 必可**正交相似对角化**：存在正交矩阵 $Q$，$Q^TAQ=Q^{-1}AQ=\Lambda$；
4. $k$ 重特征值恰有 $k$ 个线性无关的特征向量（一定可对角化）。
推论：$r(A)=$ 非零特征值的个数。`,
    hook: r`性质 2 证明：$\lambda_1\alpha_1^T\alpha_2=(A\alpha_1)^T\alpha_2=\alpha_1^TA\alpha_2=\lambda_2\alpha_1^T\alpha_2$。`,
  },
  {
    sec: '实对称矩阵', k: 'steps', s: 3,
    q: r`求正交矩阵 $Q$ 使 $Q^TAQ=\Lambda$ 的步骤（$A$ 实对称）`,
    a: r`1. 求特征值 $\lambda_i$。
2. 对每个 $\lambda_i$ 求特征向量（基础解系）。
3. **同一特征值**的多个特征向量：施密特正交化；不同特征值的特征向量已正交，不必处理。
4. 全部**单位化**。
5. 按对应顺序拼成 $Q$，则 $Q^TAQ=\operatorname{diag}(\lambda_1,\dots,\lambda_n)$。`,
    trap: '第 3 步只对重特征值做；第 4 步一个都不能漏，否则 Q 不正交。',
  },
  {
    sec: '反求矩阵', k: 'qa', s: 3,
    q: '由特征值与特征向量反求 A 的两种方法',
    a: r`**一般矩阵**：$A=P\Lambda P^{-1}$（需求 $P^{-1}$）。
**实对称矩阵**：$A=Q\Lambda Q^T=\sum_{i=1}^n\lambda_i\,q_iq_i^T$（谱分解，$q_i$ 为单位特征向量，无需求逆）。
若只知道部分特征向量，先用正交性（实对称）解出其余特征向量。`,
    hook: r`实对称且只有一个非零特征值 $\lambda$、单位特征向量 $q$：$A=\lambda qq^T$。`,
  },
  {
    sec: '性质', k: 'qa', s: 3,
    q: r`秩为 1 的矩阵 $A=\alpha\beta^T$ 的特征值与可对角化条件`,
    a: r`特征值：$\lambda_1=\beta^T\alpha=\operatorname{tr}A$（对应特征向量 $\alpha$），$\lambda_2=\cdots=\lambda_n=0$（对应 $\beta^Tx=0$ 的解，共 $n-1$ 个无关）。
可对角化 $\iff\operatorname{tr}A\ne0$（此时 0 是 $n-1$ 重且 $r(0E-A)=1=n-(n-1)$）。
$\operatorname{tr}A=0$ 时 0 为 $n$ 重特征值但 $r(A)=1$，不可对角化。`,
  },
  {
    sec: '性质', k: 'qa', s: 2,
    q: '求特征值的几个快速技巧',
    a: r`1. **上/下三角、对角矩阵**：特征值 = 对角元。
2. **各行元素之和相等为 $s$**：$s$ 是特征值，特征向量 $(1,\dots,1)^T$。
3. **满足多项式方程** $f(A)=O$：特征值满足 $f(\lambda)=0$（如 $A^2=A\Rightarrow\lambda\in\{0,1\}$；$A^2=E\Rightarrow\lambda=\pm1$；$A^k=O\Rightarrow\lambda=0$）。
4. **秩 1**：$\operatorname{tr}A$ 与 0。
5. 已知 $n-1$ 个特征值，最后一个用迹求。
6. 特征多项式计算：先用行列式性质把某行/列凑出公因子 $(\lambda-a)$。`,
    trap: r`技巧 3 只给出特征值的**可能取值**，不保证每个值都取到（如 $A=E$ 满足 $A^2=E$ 但没有 $-1$）。`,
  },
  {
    sec: '相似', k: 'judge', s: 2,
    q: r`若 $A\sim B$，则 $A$ 与 $B$ 有相同的特征向量。`,
    a: r`✗ 错误。$B=P^{-1}AP$，若 $A\alpha=\lambda\alpha$，则 $B(P^{-1}\alpha)=\lambda(P^{-1}\alpha)$，特征向量是 $P^{-1}\alpha$。相似矩阵有相同的特征**值**，特征**向量**一般不同。`,
  },
  {
    sec: '相似', k: 'judge', s: 2,
    q: r`若 $A$ 与对角矩阵相似，且 $A$ 的所有特征值都相同（均为 $\lambda$），则 $A=\lambda E$。`,
    a: r`✓ 正确。$A=P(\lambda E)P^{-1}=\lambda E$。推论：可对角化且只有一个特征值的矩阵必是数量矩阵；反之若 $A\ne\lambda E$ 但特征值全为 $\lambda$，则 $A$ 不可对角化。`,
  },
  {
    sec: '相似', k: 'steps', s: 2,
    q: r`判断两个矩阵 $A$、$B$ 是否相似的思路`,
    a: r`1. 先比较相似不变量：$\operatorname{tr}$、$|\cdot|$、秩、特征多项式——任一不同则不相似。
2. 特征值相同时：若两者都可对角化 $\Rightarrow$ 相似（都相似于同一 $\Lambda$）。
3. 若有重根：比较每个特征值 $\lambda$ 下 $r(\lambda E-A)$ 与 $r(\lambda E-B)$——不同则不相似。
4. 二、三阶矩阵中，特征值相同且对应 $r(\lambda E-\cdot)$ 全相同即相似（考试范围内可直接用）。
5. 求过渡矩阵：$P_1^{-1}AP_1=\Lambda=P_2^{-1}BP_2\Rightarrow P=P_1P_2^{-1}$ 满足 $P^{-1}AP=B$。`,
  },
  {
    sec: '实对称矩阵', k: 'judge', s: 2,
    q: r`实对称矩阵 $A$ 满足 $A^2=O$，则 $A=O$。`,
    a: r`✓ 正确。$A^2=O\Rightarrow$ 特征值全为 0；实对称可对角化 $\Rightarrow A=Q\cdot O\cdot Q^T=O$。也可由 $A^TA=A^2=O\Rightarrow A=O$。一般矩阵不成立。`,
  },
  {
    sec: '性质', k: 'cloze', s: 2,
    q: r`$A$ 可逆 $\iff$ ⟦0 不是 $A$ 的特征值⟧；$A$ 可对角化时 $r(A)=$ ⟦非零特征值的个数（计重数）⟧；一般矩阵 $r(A)\ge$ ⟦非零特征值个数⟧`,
  },
  {
    sec: '对角化', k: 'qa', s: 2,
    q: r`已知 $A$ 的特征值 $\lambda_1$（$k$ 重）及其他信息，含参数矩阵「可对角化」条件如何转化为方程？`,
    a: r`可对角化 $\iff$ 对 $k$ 重特征值 $\lambda_1$，$r(\lambda_1E-A)=n-k$。
把 $\lambda_1$ 代入 $\lambda_1E-A$，作行变换，令其秩为 $n-k$（通常要求某个含参数的元素为 0），解出参数。
反之「不可对角化」$\iff$ 该秩 $>n-k$。`,
    hook: '三阶矩阵二重根：要求 r(λE−A)=1，即化阶梯后第二行全为零。',
  },
]);

export const l6 = defineChapter('l6', [
  {
    sec: '基本概念', k: 'qa', s: 3,
    q: r`二次型 $f(x)=x^TAx$ 的矩阵写法规则；二次型的秩`,
    a: r`$A$ 必须取**对称矩阵**：$a_{ii}$ = $x_i^2$ 的系数，$a_{ij}=a_{ji}=\frac12\times$（$x_ix_j$ 的系数）。
二次型的秩 $=r(A)$ $=$ 标准形中非零平方项的个数 $=$ 非零特征值个数。`,
    trap: r`$f=x^TBx$ 中 $B$ 若不对称，二次型矩阵是 $\frac{B+B^T}{2}$，而不是 $B$。`,
  },
  {
    sec: '合同', k: 'qa', s: 3,
    q: '合同的定义；实对称矩阵合同的充要条件；相似、合同、等价三者关系',
    a: r`$A\simeq B\iff\exists$ 可逆 $C$，$C^TAC=B$。
实对称矩阵 $A\simeq B\iff$ **正、负惯性指数分别相等**（$\iff$ 规范形相同）。
关系：实对称矩阵 $A\sim B\Rightarrow A\simeq B$（因正交相似 $Q^TAQ=Q^{-1}AQ$ 既是相似又是合同）；合同 $\nRightarrow$ 相似（合同只保特征值**符号个数**）；相似或合同 $\Rightarrow$ 等价。`,
    hook: '等价看秩；合同看正负惯性指数（秩 + 正惯性指数）；相似看特征值（及重根的 r(λE−A)）。',
  },
  {
    sec: '标准形', k: 'qa', s: 3,
    q: '标准形、规范形的定义；惯性定理',
    a: r`**标准形**：只含平方项 $d_1y_1^2+\cdots+d_ry_r^2$（$d_i\ne0$），**不唯一**（取决于变换）。
**规范形**：$y_1^2+\cdots+y_p^2-y_{p+1}^2-\cdots-y_r^2$，**唯一**。
**惯性定理**：无论用什么可逆线性变换化为标准形，正项个数 $p$（正惯性指数）与负项个数 $q=r-p$（负惯性指数）不变。`,
    trap: '正交变换得到的标准形系数一定是特征值；配方法得到的标准形系数一般不是特征值，但正负个数一致。',
  },
  {
    sec: '标准形', k: 'steps', s: 3,
    q: '正交变换法化二次型为标准形的步骤',
    a: r`1. 写出对称矩阵 $A$。
2. 求特征值 $\lambda_1,\dots,\lambda_n$。
3. 求特征向量，重根者施密特正交化，全部单位化，拼成正交矩阵 $Q$。
4. 令 $x=Qy$，则 $f=\lambda_1y_1^2+\cdots+\lambda_ny_n^2$。
5. 写答案时说明「所用正交变换为 $x=Qy$」，并写出 $Q$。`,
    hook: '题目若说「用正交变换化为标准形」并给出标准形，直接得知特征值，可反求参数。',
  },
  {
    sec: '标准形', k: 'steps', s: 3,
    q: '配方法化二次型为标准形的步骤（含无平方项的情形）',
    a: r`1. 若含 $x_1^2$：把所有含 $x_1$ 的项配成一个完全平方 $(x_1+\cdots)^2$，剩余部分不含 $x_1$，对 $x_2$ 重复。
2. 若**不含任何平方项**（只有交叉项，如 $x_1x_2$）：先令 $x_1=y_1+y_2,\ x_2=y_1-y_2,\ x_3=y_3$ 造出平方项，再配方。
3. 令每个平方括号为新变量 $y_i$（确保变换可逆，$n$ 个 $y$ 对应 $n$ 个 $x$），写出 $x=Cy$。
4. 标准形系数即各平方项前的系数。`,
    trap: '配方后新变量个数必须等于 n 且变换矩阵可逆；若少了变量要补上 yₖ = xₖ。',
  },
  {
    sec: '正定', k: 'qa', s: 3,
    q: '正定二次型 / 正定矩阵的定义与 6 个充要条件',
    a: r`定义：$\forall x\ne0$，$f=x^TAx>0$（$A$ 实对称）。
充要条件：
1. 特征值全 $>0$；
2. 正惯性指数 $p=n$；
3. 各阶**顺序主子式**全 $>0$；
4. $A\simeq E$（合同于单位阵）；
5. 存在可逆矩阵 $D$ 使 $A=D^TD$；
6. 标准形系数全 $>0$。`,
    hook: '证抽象矩阵正定：先证对称，再用定义（构造 x^T A x = ‖Dx‖² > 0）或特征值。',
  },
  {
    sec: '正定', k: 'qa', s: 3,
    q: '正定矩阵的必要条件与运算封闭性',
    a: r`**必要条件**：$a_{ii}>0$；$|A|>0$；$A$ 可逆。
**封闭性**：$A$ 正定 $\Rightarrow A^{-1},\ A^*,\ A^k,\ kA\ (k>0)$ 正定；$A,B$ 正定 $\Rightarrow A+B$ 正定（$AB$ 不一定，除非可交换）；$C$ 列满秩 $\Rightarrow C^TAC$ 正定。
$A^TA$ 半正定；$A$ 列满秩 $\iff A^TA$ 正定。`,
    trap: r`$AB$ 一般不对称，谈不上正定；即使对称也不一定正定。`,
  },
  {
    sec: '正定', k: 'cloze', s: 2,
    q: r`$A$ 负定 $\iff$ 顺序主子式 ⟦奇数阶 $<0$、偶数阶 $>0$⟧ $\iff -A$ 正定；$A$ 正定 $\Rightarrow|A|$ ⟦$>0$⟧；$f=x^TAx$ 在 $\|x\|=1$ 上的最大值为 ⟦$\lambda_{\max}$⟧、最小值为 ⟦$\lambda_{\min}$⟧`,
    hook: r`最值结论：正交变换 $x=Qy$ 保长度，$f=\sum\lambda_iy_i^2$，$\sum y_i^2=1$。`,
  },
  {
    sec: '基本概念', k: 'qa', s: 2,
    q: r`形如 $f=(a_1x_1+b_1x_2+c_1x_3)^2+(a_2x_1+\cdots)^2+\cdots$ 的二次型，其秩与正惯性指数怎么快速判断？`,
    a: r`记 $B=\begin{pmatrix}a_1&b_1&c_1\\a_2&b_2&c_2\\\vdots\end{pmatrix}$，则 $f=(Bx)^T(Bx)=x^TB^TBx$，二次型矩阵为 $B^TB$，秩 $=r(B)$，$f\ge0$ 半正定，正惯性指数 $=r(B)$，负惯性指数 $=0$。
若各平方项前有系数 $\pm$，则不能直接用 $r(B)$ 得正负惯性指数（须 $B$ 可逆时才能把括号视为新变量）。`,
    trap: '「几个平方项之和」不等于标准形：括号内变量必须线性无关（B 可逆）才能作为可逆线性变换。',
  },
  {
    sec: '合同', k: 'judge', s: 2,
    q: r`若 $A\sim B$（相似），$A,B$ 均为实对称矩阵，则 $A$ 与 $B$ 合同。`,
    a: r`✓ 正确。相似 $\Rightarrow$ 特征值相同 $\Rightarrow$ 正负惯性指数相同 $\Rightarrow$ 合同。反之不成立：$\operatorname{diag}(1,2)$ 与 $E$ 合同但不相似。`,
  },
  {
    sec: '正定', k: 'judge', s: 2,
    q: r`若 $A$ 的所有顺序主子式均 $\ge0$，则 $A$ 半正定。`,
    a: r`✗ 错误。半正定需要**所有主子式**（不只是顺序主子式）$\ge0$。反例 $A=\begin{pmatrix}0&0\\0&-1\end{pmatrix}$，顺序主子式 $0,0$，但不是半正定。`,
  },
  {
    sec: '标准形', k: 'qa', s: 2,
    q: r`已知二次型经正交变换 $x=Qy$ 化为 $f=ay_1^2+by_2^2+cy_3^2$，能反推出关于 $A$ 的哪些信息？`,
    a: r`1. $A$ 的特征值就是 $a,b,c$（顺序对应 $Q$ 的列）；
2. $\operatorname{tr}A=a+b+c$，$|A|=abc$——用于反求 $A$ 中的参数；
3. $Q$ 的第 $i$ 列是 $A$ 属于第 $i$ 个特征值的单位特征向量；
4. $A=Q\operatorname{diag}(a,b,c)Q^T$。`,
  },
  {
    sec: '基本概念', k: 'cloze', s: 2,
    q: r`二次型 $f=x^TAx$（$A$ 实对称）的正惯性指数 $=$ ⟦正特征值的个数⟧，负惯性指数 $=$ ⟦负特征值的个数⟧，$f$ 的规范形完全由 ⟦$(p,\ q)$⟧ 决定`,
    hook: '判断 A、B 是否合同：数正特征值与负特征值的个数是否分别相同。',
  },
  {
    sec: '正定', k: 'steps', s: 2,
    q: r`「求 $t$ 的取值范围使二次型正定」的解题步骤`,
    a: r`1. 写出对称矩阵 $A$（含 $t$）。
2. 依次计算一阶、二阶、三阶顺序主子式 $\Delta_1,\Delta_2,\Delta_3$。
3. 联立不等式 $\Delta_1>0,\Delta_2>0,\Delta_3>0$，解出 $t$ 范围（取交集）。
4. 若二次型来自 $f=x^TB^TBx$ 或已给标准形，也可改用「特征值全正 / 正惯性指数为 $n$」。`,
  },
  {
    sec: '合同', k: 'qa', s: 2,
    q: r`$A=\begin{pmatrix}1&0\\0&-1\end{pmatrix}$、$B=\begin{pmatrix}2&0\\0&-3\end{pmatrix}$、$C=\begin{pmatrix}-1&0\\0&1\end{pmatrix}$、$D=\begin{pmatrix}1&0\\0&1\end{pmatrix}$ 之间哪些相似、哪些合同？`,
    a: r`$A,B,C$ 都有一正一负特征值 $\Rightarrow$ 两两**合同**；$A\sim C$（特征值 $\{1,-1\}$ 相同且都是对角阵）；$A\not\sim B$（特征值不同）。
$D$ 与其余都不合同（正惯性指数为 2），也不相似。
所有四个都两两**等价**（秩都是 2）。`,
  },
]);
