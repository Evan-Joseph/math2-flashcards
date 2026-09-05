'use client';

import { useRef, useState } from 'react';
import { CHAPTERS, SUBJECTS, SUBJECT_ORDER, chapterColor } from '@/data';
import { updateSettings, useStoreState, exportData, importData, resetAll, resetProgressOnly, useHydrated, daysToExam, DEFAULT_SETTINGS } from '@/lib/store';
import { syncNow, genCode, normalizeCode, disconnectSync } from '@/lib/sync';
import { Button, Card, Chip, Icon, SectionTitle } from '@/components/ui';
import { cn } from '@/lib/cn';

export default function SettingsPage() {
  const s = useStoreState();
  const hydrated = useHydrated();
  const st = s.settings;
  const [codeInput, setCodeInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 2500);
  };

  const toggleChapter = (id: string) => {
    const set = new Set(st.chapters);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    if (set.size === 0) return flash('至少保留一个章节');
    updateSettings({ chapters: [...set] });
  };

  const connect = async (code: string) => {
    const c = normalizeCode(code);
    if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(c)) return flash('同步码应为 8 位字母数字');
    setBusy(true);
    const ok = await syncNow(c);
    setBusy(false);
    flash(ok ? '同步成功' : '同步失败，请检查网络或同步码');
    setCodeInput('');
  };

  const onImport = (file: File) => {
    file.text().then((t) => flash(importData(t) ? '导入成功' : '文件格式不正确'));
  };

  const download = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `math2-flashcards-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-10">
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">设置</h1>
        <p className="mt-1 text-sm text-muted">所有设置立即生效并保存在本机。</p>
      </header>

      {/* 复习计划 */}
      <section className="mb-6">
        <SectionTitle>复习计划</SectionTitle>
        <Card className="divide-y divide-line">
          <Row label="每日新卡上限" value={`${st.dailyNew} 张`} hint="到期复习不受此限制。建议 10–20，遗忘率高时先降新卡。">
            <input type="range" min={0} max={50} step={5} value={st.dailyNew} onChange={(e) => updateSettings({ dailyNew: Number(e.target.value) })} aria-label="每日新卡上限" />
          </Row>
          <Row label="目标记忆率" value={`${Math.round(st.retention * 100)}%`} hint="FSRS 的期望提取率。越高复习越频繁；90% 是效率与稳固的平衡点，考前一个月可调到 93–95%。">
            <input type="range" min={0.8} max={0.97} step={0.01} value={st.retention} onChange={(e) => updateSettings({ retention: Number(e.target.value) })} aria-label="目标记忆率" />
          </Row>
          <Row label="考试日期" value={hydrated ? `${daysToExam(new Date(), st)} 天后` : ''} hint="复习间隔不会被安排到考试之后。2027 考研初试预计 2026 年 12 月下旬，以研招网公告为准。">
            <input type="date" value={st.examDate} onChange={(e) => e.target.value && updateSettings({ examDate: e.target.value })} className="h-10 rounded-xl border border-line bg-card2 px-3 text-sm" aria-label="考试日期" />
          </Row>
          <Row label="新卡顺序" hint="按章节：循序渐进；按重要度：先背必背公式。">
            <Seg
              value={st.newOrder}
              onChange={(v) => updateSettings({ newOrder: v as 'chapter' | 'importance' })}
              options={[
                ['chapter', '按章节'],
                ['importance', '先必背'],
              ]}
            />
          </Row>
        </Card>
      </section>

      {/* 章节范围 */}
      <section className="mb-6" id="chapters">
        <SectionTitle
          action={
            <button type="button" className="text-xs font-semibold text-accent-ink" onClick={() => updateSettings({ chapters: CHAPTERS.map((c) => c.id) })}>
              全选
            </button>
          }
        >
          学习范围
        </SectionTitle>
        <Card className="p-3">
          <p className="mb-3 px-1 text-xs text-muted">尚未学到的章节可以先停用，避免新卡穿插进来；停用不影响已有进度。</p>
          {SUBJECT_ORDER.map((sub) => (
            <div key={sub} className="mb-2 last:mb-0">
              <div className="mb-1 px-1 text-[11px] font-bold text-muted">{SUBJECTS[sub].title}</div>
              <div className="flex flex-wrap gap-1.5">
                {CHAPTERS.filter((c) => c.subject === sub).map((c) => {
                  const on = st.chapters.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="switch"
                      aria-checked={on}
                      onClick={() => toggleChapter(c.id)}
                      className={cn('pressable h-9 rounded-full border px-3 text-sm font-semibold', on ? 'border-transparent text-white' : 'border-line bg-card text-muted')}
                      style={on ? { background: chapterColor(c.id) } : undefined}
                    >
                      {c.short}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* 外观与阅读 */}
      <section className="mb-6">
        <SectionTitle>外观与阅读</SectionTitle>
        <Card className="divide-y divide-line">
          <Row label="主题">
            <Seg
              value={st.theme}
              onChange={(v) => updateSettings({ theme: v as 'auto' | 'light' | 'dark' })}
              options={[
                ['auto', '跟随系统'],
                ['light', '浅色'],
                ['dark', '深色'],
              ]}
            />
          </Row>
          <Row label="文字大小" value={`${Math.round(st.fontScale * 100)}%`}>
            <input type="range" min={0.9} max={1.3} step={0.05} value={st.fontScale} onChange={(e) => updateSettings({ fontScale: Number(e.target.value) })} aria-label="文字大小" />
          </Row>
          <Row label="公式大小" value={`${Math.round(st.mathScale * 100)}%`} hint="单独放大公式，正文保持不变。块级公式点击可全屏查看。">
            <input type="range" min={0.9} max={1.35} step={0.05} value={st.mathScale} onChange={(e) => updateSettings({ mathScale: Number(e.target.value) })} aria-label="公式大小" />
          </Row>
          <Toggle label="动效" hint="关闭后去除卡片进出场与揭示动画（系统「减少动态效果」会自动生效）。" on={st.motion} onChange={(v) => updateSettings({ motion: v })} />
        </Card>
      </section>

      {/* 交互 */}
      <section className="mb-6">
        <SectionTitle>学习交互</SectionTitle>
        <Card className="divide-y divide-line">
          <Toggle label="揭示后默认展开记忆锚点" on={st.showHookFirst} onChange={(v) => updateSettings({ showHookFirst: v })} />
          <Toggle label="简化评分（只显示忘了 / 记得）" hint="减少决策负担；FSRS 用两档也能正常工作。" on={st.simpleGrading} onChange={(v) => updateSettings({ simpleGrading: v })} />
          <Toggle label="滑动评分" hint="揭示答案后左滑「忘了」、右滑「记得」。" on={st.swipe} onChange={(v) => updateSettings({ swipe: v })} />
          <Toggle label="触感反馈" hint="支持的设备上评分时轻微震动。" on={st.haptics} onChange={(v) => updateSettings({ haptics: v })} />
        </Card>
      </section>

      {/* 同步 */}
      <section className="mb-6">
        <SectionTitle>跨设备同步</SectionTitle>
        <Card className="p-4">
          {s.sync.code ? (
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted">同步码</span>
                <code className="rounded-lg bg-card2 px-2.5 py-1 font-mono text-lg font-bold tracking-widest select-all">{s.sync.code}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard?.writeText(s.sync.code!).then(() => flash('已复制'));
                  }}
                >
                  复制
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted">
                {s.sync.lastError ? <span className="text-bad">上次同步失败：{s.sync.lastError}</span> : s.sync.lastSyncAt ? `上次同步 ${new Date(s.sync.lastSyncAt).toLocaleString('zh-CN', { hour12: false })}` : '尚未同步'}
                {s.pending.length > 0 && ` · ${s.pending.length} 条待上传`}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted">在另一台设备的此页面输入该同步码即可合并进度。请勿泄露同步码——它是唯一的访问凭证。</p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    const ok = await syncNow();
                    setBusy(false);
                    flash(ok ? '同步成功' : '同步失败');
                  }}
                >
                  <Icon.Sync className={cn('h-4 w-4', busy && 'animate-spin')} /> 立即同步
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm('断开后本机数据保留，但不再上传。确定？')) disconnectSync();
                  }}
                >
                  断开
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm leading-relaxed text-ink-soft">数据默认只存在本机。生成一个同步码，就能在手机与电脑之间合并复习进度，并把每次评分备份到服务器。</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="primary" disabled={busy || !hydrated} onClick={() => connect(genCode())}>
                  <Icon.Sync className="h-4 w-4" /> 生成新同步码
                </Button>
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  placeholder="输入已有同步码，如 AB3D-9KXQ"
                  className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-card2 px-3 font-mono text-sm tracking-wider uppercase outline-none focus:border-accent"
                  aria-label="已有同步码"
                  autoCapitalize="characters"
                />
                <Button disabled={busy || codeInput.replace(/[^A-Z0-9]/g, '').length < 8} onClick={() => connect(codeInput)}>
                  连接
                </Button>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* 数据 */}
      <section className="mb-6">
        <SectionTitle>数据</SectionTitle>
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={download} disabled={!hydrated}>
              导出 JSON
            </Button>
            <Button onClick={() => fileRef.current?.click()}>导入 JSON</Button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
            <Button
              variant="ghost"
              onClick={() => {
                updateSettings({ ...DEFAULT_SETTINGS, chapters: st.chapters, examDate: st.examDate });
                flash('已恢复默认设置');
              }}
            >
              恢复默认设置
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (confirm('清空全部复习进度（保留设置、标记与笔记）？此操作不可撤销。')) {
                  resetProgressOnly();
                  flash('复习进度已清空');
                }
              }}
            >
              <Icon.Trash className="h-4 w-4" /> 清空复习进度
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (confirm('删除本机全部数据（进度、设置、标记、笔记、同步码）？') && confirm('再次确认：此操作不可撤销。')) {
                  resetAll();
                  flash('已重置');
                }
              }}
            >
              全部重置
            </Button>
          </div>
        </Card>
      </section>

      <footer className="mb-6 px-1 text-[11px] leading-relaxed text-muted">
        <p>卡片内容以 2025/2026 全国硕士研究生招生考试数学（二）大纲为准，参考张宇《基础 30 讲》与同济《高等数学》。伯努利方程、欧拉方程、无穷级数、方向导数等数一专属内容未收录。</p>
        <p className="mt-1">调度算法：ts-fsrs（FSRS-5），启用短期学习步与间隔模糊。</p>
        <p className="mt-1 flex items-center gap-1">
          <Chip>{`v2 · ${CHAPTERS.length} 章`}</Chip>
        </p>
      </footer>

      {msg && (
        <div className="anim-pop pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-8" role="status">
          <div className="rounded-xl bg-ink px-4 py-2 text-sm font-medium text-paper shadow-pop">{msg}</div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, hint, children }: { label: string; value?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[15px] font-semibold">{label}</div>
        {value && <div className="tabular text-sm font-bold text-accent-ink">{value}</div>}
      </div>
      <div className="mt-2.5">{children}</div>
      {hint && <p className="mt-2 text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}

function Toggle({ label, hint, on, onChange }: { label: string; hint?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex w-full items-center gap-3 p-4 text-left">
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold">{label}</div>
        {hint && <p className="mt-0.5 text-xs leading-relaxed text-muted">{hint}</p>}
      </div>
      <span className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', on ? 'bg-accent' : 'bg-line-strong')} aria-hidden>
        <span className={cn('absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform', on ? 'translate-x-5.5' : 'translate-x-0.5')} />
      </span>
    </button>
  );
}

function Seg({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="inline-flex rounded-xl bg-card2 p-1" role="radiogroup">
      {options.map(([v, l]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(v)} className={cn('pressable h-9 rounded-lg px-3.5 text-sm font-semibold', value === v ? 'bg-card text-ink shadow-card' : 'text-muted')}>
          {l}
        </button>
      ))}
    </div>
  );
}
