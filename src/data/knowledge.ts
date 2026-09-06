/**
 * 知识点聚合表。
 *
 * 同一知识点常以多张卡片出现（主卡 + 增补卡、问答 + 填空、不同表述）。
 * 为避免统计重复计数，这里为每组卡片声明一个稳定的知识点 ID（kid）。
 * 未出现在此表中的卡片，kid 即其自身 id。
 *
 * 分组原则：核心公式 / 定理 / 结论相同即视为同一知识点；
 * 仅共享主题但考察不同结论的卡片（如「弧微分」与「微分近似」）不合并。
 * 逐组核对记录见 docs/内容审计.md「知识点聚合」。
 */
export const KNOWLEDGE_GROUPS: Record<string, string[]> = {
  'pre.curves': ['pre-13', 'pre-x01', 'pre-x02'],
  'pre.inequalities': ['pre-11', 'pre-x03'],
  'fn.parity-transfer': ['h2-29', 'pre-x04'],
  'lim.heine': ['h1-26', 'h1-x01'],
  'lim.procedure': ['h1-22', 'h1-x02'],
  'lim.infinite-vs-unbounded': ['h1-14', 'h1-x03'],
  'lim.closed-interval': ['h1-19', 'h1-x04'],
  'lim.diff-equivalents': ['h1-10', 'h1-x05'],
  'diff.curvature': ['h2-25', 'h2-x01'],
  'diff.auxiliary-fn': ['h2-16', 'h2-x04'],
  'diff.taylor': ['h2-18', 'h2-x05'],
  'diff.root-count': ['h2-28', 'h2-x06'],
  'int.arc-length-surface': ['h3-28', 'h3-x01', 'h3-x02', 'h2-x02'],
  'int.wallis': ['h3-22', 'h3-x06'],
  'int.physics': ['h3-29', 'h3-x03', 'h3-x04'],
  'int.p-integral': ['h3-23', 'h3-x07'],
  'mv.relations': ['h4-02', 'h4-x01'],
  'mv.differentiable-test': ['h4-04', 'h4-x02'],
  'mv.lagrange': ['h4-10', 'h4-x03'],
  'mv.second-order-chain': ['h4-06', 'h4-x04'],
  'dbl.symmetry': ['h5-06', 'h5-x04'],
  'dbl.polar-limits': ['h5-07', 'h5-x02'],
  'dbl.swap-order': ['h5-02', 'h5-x03'],
  'ode.reducible': ['h6-04', 'h6-x01'],
  'ode.homogeneous-const': ['h6-06', 'h6-x02'],
  'ode.reverse': ['h6-10', 'h6-x03'],
  'ode.modeling': ['h6-11', 'h6-x05'],
  'la.orthogonal': ['l2-11', 'l2-x01'],
  'la.rank-props': ['l2-08', 'l2-x02'],
  'la.similar-test': ['l5-15', 'l5-x01'],
  'la.orth-diag': ['l5-09', 'l5-x02'],
};

/** 卡片 id → 知识点 id */
export const CARD_KID: Record<string, string> = Object.fromEntries(
  Object.entries(KNOWLEDGE_GROUPS).flatMap(([kid, ids]) => ids.map((id) => [id, kid])),
);

/** 大纲未列、教辅拓展：可检索但不进默认队列 */
export const EXT_STATUS: Record<string, true> = {};
