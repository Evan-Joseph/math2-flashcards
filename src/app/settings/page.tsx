'use client';

import { useRef, useState } from 'react';
import { useStoreState, updateSettings, exportData, importData, resetAll, resetProgressOnly, DEFAULT_SETTINGS } from '@/lib/store';
import { EXAMS, OFFICIAL, BOOKS, ALL_CARDS, cardsFor } from '@/data';
import { PageTitle } from '@/components/ui';

export default function SettingsPage() {
  const s = useStoreState();
  const st = s.settings;
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const doExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `kaoyan-math-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    setMsg({ ok: true, text: '已导出备份文件' });
  };
  const doImport = async (f: File | undefined) => {
    if (!f) return;
    if (!confirm('导入将覆盖本机现有学习数据，是否继续？建议先导出备份。')) return;
    const text = await f.text();
    const r = importData(text);
    setMsg(r.ok ? { ok: true, text: `已恢复 ${r.cards} 张卡片的进度、${r.reviews} 条复习记录` } : { ok: false, text: `导入失败：${r.error}` });
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      <PageTitle title="设置" />
      <div className="space-y-4">
        <Section title="考试模式">
          <div className="grid grid-cols-2 gap-2">
            {(['m2', 'm1'] as const).map((e) => (
              <button key={e} type="button" onClick={() => updateSettings({ exam: e })} aria-pressed={st.exam === e} className={`card px-4 py-3 text-left ${st.exam === e ? 'border-accent ring-2 ring-accent/30' : ''}`}>
                <div className="font-semibold">{EXAMS[e].title}</div>
                <div className="text-xs text-muted">{EXAMS[e].desc}</div>
                <div className="mt-1 text-xs text-muted">{cardsFor(e).length} 张卡片</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted">切换后章节、检索、统计与复习队列都只包含该科目范围；共同内容的复习进度在两种模式间共享。</p>
        </Section>

        <Section title="学习">
          <Row label="出题顺序" desc="随机：交错章节、避免连续重复；顺序：按知识库顺序">
            <div className="seg">
              <button type="button" aria-pressed={st.order === 'random'} onClick={() => updateSettings({ order: 'random' })}>
                随机
              </button>
              <button type="button" aria-pressed={st.order === 'sequential'} onClick={() => updateSettings({ order: 'sequential' })}>
                顺序
              </button>
            </div>
          </Row>
          <Row label={`每日新卡上限 ${st.dailyNew}`} desc="超出后仍可在章节中主动学习">
            <input type="range" min={0} max={60} step={5} value={st.dailyNew} onChange={(e) => updateSettings({ dailyNew: Number(e.target.value) })} aria-label="每日新卡上限" />
          </Row>
          <Row label={`目标记忆保持率 ${Math.round(st.retention * 100)}%`} desc="越高复习越频繁（FSRS）">
            <input type="range" min={0.8} max={0.97} step={0.01} value={st.retention} onChange={(e) => updateSettings({ retention: Number(e.target.value) })} aria-label="目标记忆保持率" />
          </Row>
          <Row label="显示答案时附带记忆锚点" desc="关闭后需按 H 手动查看提示">
            <Toggle checked={st.hintFirst} onChange={(v) => updateSettings({ hintFirst: v })} />
          </Row>
          <Row label="考试日期" desc="用于限制最长复习间隔与倒计时">
            <input type="date" className="field w-auto" value={st.examDate} onChange={(e) => updateSettings({ examDate: e.target.value || DEFAULT_SETTINGS.examDate })} aria-label="考试日期" />
          </Row>
        </Section>

        <Section title="显示">
          <Row label="主题">
            <div className="seg">
              {(['auto', 'light', 'dark'] as const).map((t) => (
                <button key={t} type="button" aria-pressed={st.theme === t} onClick={() => updateSettings({ theme: t })}>
                  {t === 'auto' ? '跟随系统' : t === 'light' ? '浅色' : '深色'}
                </button>
              ))}
            </div>
          </Row>
          <Row label="动态效果" desc="「自动」尊重系统的减少动态效果设置">
            <div className="seg">
              {(['auto', 'on', 'off'] as const).map((t) => (
                <button key={t} type="button" aria-pressed={st.motion === t} onClick={() => updateSettings({ motion: t })}>
                  {t === 'auto' ? '自动' : t === 'on' ? '开启' : '关闭'}
                </button>
              ))}
            </div>
          </Row>
          <Row label={`正文字号 ${Math.round(st.fontScale * 100)}%`}>
            <input type="range" min={0.9} max={1.25} step={0.05} value={st.fontScale} onChange={(e) => updateSettings({ fontScale: Number(e.target.value) })} aria-label="正文字号" />
          </Row>
          <Row label={`公式大小 ${Math.round(st.mathScale * 100)}%`}>
            <input type="range" min={0.9} max={1.3} step={0.05} value={st.mathScale} onChange={(e) => updateSettings({ mathScale: Number(e.target.value) })} aria-label="公式大小" />
          </Row>
          <Row label="触感反馈" desc="评分时轻微震动（支持的设备）">
            <Toggle checked={st.haptics} onChange={(v) => updateSettings({ haptics: v })} />
          </Row>
        </Section>

        <Section title="数据">
          <p className="text-sm text-muted">全部数据只保存在本机浏览器（localStorage），不上传。更换设备或清理浏览器前请导出备份。</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn" onClick={doExport}>
              导出备份（JSON）
            </button>
            <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
              导入恢复
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => doImport(e.target.files?.[0])} aria-label="选择备份文件" />
          </div>
          {msg && (
            <div role="status" className={`rounded-xl px-3 py-2 text-sm ${msg.ok ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad'}`}>
              {msg.text}
            </div>
          )}
          <div className="flex flex-wrap gap-2 border-t border-line pt-3">
            <button type="button" className="btn text-bad" onClick={() => confirm('清除全部复习进度与记录（保留设置、收藏与笔记）？此操作不可撤销。') && (resetProgressOnly(), setMsg({ ok: true, text: '已清除复习进度' }))}>
              清除复习进度
            </button>
            <button type="button" className="btn text-bad" onClick={() => confirm('恢复出厂：删除全部本地数据（包括设置、收藏、笔记）？此操作不可撤销。') && (resetAll(), setMsg({ ok: true, text: '已恢复出厂设置' }))}>
              恢复出厂
            </button>
          </div>
          <div className="text-xs text-muted">最近保存：{s.updatedAt.startsWith('1970') ? '—' : new Date(s.updatedAt).toLocaleString('zh-CN')}</div>
        </Section>

        <Section title="内容与来源">
          <p className="text-sm">
            共 {ALL_CARDS.length} 张卡片（数学二 {cardsFor('m2').length} · 数学一 {cardsFor('m1').length}），{ALL_CARDS.filter((c) => c.status === 'pending').length} 张标记为「待确认」，不进入默认复习队列。
          </p>
          <p className="text-xs text-muted">{OFFICIAL.note}</p>
          <ul className="space-y-1 text-xs text-muted">
            {Object.values(BOOKS).map((b) => (
              <li key={b.id}>
                {b.title} · {b.edition}
                {b.isbn ? ` · ISBN ${b.isbn}` : ''}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 text-xs">
            <a className="text-accent underline-offset-2 hover:underline" href={OFFICIAL.neea} target="_blank" rel="noreferrer">
              中国教育考试网 · 全国统考大纲
            </a>
            <a className="text-accent underline-offset-2 hover:underline" href={OFFICIAL.chsi} target="_blank" rel="noreferrer">
              研招网
            </a>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card px-4 py-4">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="text-xs text-muted">{desc}</div>}
      </div>
      <div className="sm:w-56 sm:shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative h-7 w-12 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-line-2'}`}>
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
    </button>
  );
}
