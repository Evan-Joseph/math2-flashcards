import { useRef, useState } from 'react';
import { CHAPTERS, ALL_CARDS } from '../data';
import { exportData, importData, resetAll, resetProgressOnly, updateSettings, useStore } from '../lib/store';
import { Button } from './ui';
import { cn } from '../utils/cn';

export function Settings() {
  const s = useStore((st) => st.settings);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const flash = (m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg(null), 2500);
  };

  const download = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `math2-memo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    flash('已导出进度文件');
  };

  const upload = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(String(reader.result));
      flash(ok ? '导入成功' : '文件格式不正确');
    };
    reader.readAsText(f);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-6 sm:pt-10">
      <h1 className="text-2xl font-bold tracking-tight">设置</h1>
      <p className="mt-1 text-sm text-muted">所有数据仅保存在本设备浏览器中，建议定期导出备份。</p>

      {msg && <div className="mt-4 rounded-xl bg-accent-soft px-4 py-2 text-sm text-accent">{msg}</div>}

      <Section title="学习节奏">
        <Row label="每日新卡上限" hint={`共 ${ALL_CARDS.length} 张，按 ${s.dailyNew} 张/天约需 ${Math.ceil(ALL_CARDS.length / s.dailyNew)} 天学完一轮`}>
          <div className="flex items-center gap-3">
            <input type="range" min={5} max={50} step={5} value={s.dailyNew} onChange={(e) => updateSettings({ dailyNew: Number(e.target.value) })} className="w-40 accent-[var(--accent)]" />
            <span className="w-8 text-right text-sm font-semibold tabular-nums">{s.dailyNew}</span>
          </div>
        </Row>
        <Row label="目标记忆保持率" hint="越高复习越频繁。考前 1 个月建议 0.92–0.95，平时 0.9。">
          <div className="flex gap-1.5">
            {[0.85, 0.9, 0.93, 0.95].map((v) => (
              <button key={v} onClick={() => updateSettings({ retention: v })} className={cn('rounded-lg px-2.5 py-1.5 text-sm tabular-nums transition', s.retention === v ? 'bg-ink text-paper' : 'bg-card2 text-muted hover:text-ink')}>
                {Math.round(v * 100)}%
              </button>
            ))}
          </div>
        </Row>
        <Row label="翻面后默认展开锚点与易错点">
          <Toggle on={s.showHookFirst} onChange={(v) => updateSettings({ showHookFirst: v })} />
        </Row>
      </Section>

      <Section title="纳入每日任务的章节">
        <div className="flex flex-wrap gap-1.5">
          {CHAPTERS.map((c) => {
            const on = s.chapters.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => updateSettings({ chapters: on ? s.chapters.filter((x) => x !== c.id) : [...s.chapters, c.id] })}
                className={cn('rounded-full border px-3 py-1.5 text-sm transition', on ? 'border-transparent bg-ink text-paper' : 'border-line bg-card text-muted hover:text-ink')}
              >
                {c.short}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2 text-xs">
          <button className="text-muted hover:text-ink" onClick={() => updateSettings({ chapters: CHAPTERS.map((c) => c.id) })}>
            全选
          </button>
          <button className="text-muted hover:text-ink" onClick={() => updateSettings({ chapters: CHAPTERS.filter((c) => c.subject === 'hs').map((c) => c.id) })}>
            只选高数
          </button>
          <button className="text-muted hover:text-ink" onClick={() => updateSettings({ chapters: CHAPTERS.filter((c) => c.subject === 'la').map((c) => c.id) })}>
            只选线代
          </button>
        </div>
      </Section>

      <Section title="外观">
        <Row label="主题">
          <div className="flex gap-1.5">
            {(
              [
                ['auto', '跟随系统'],
                ['light', '浅色'],
                ['dark', '深色'],
              ] as const
            ).map(([v, label]) => (
              <button key={v} onClick={() => updateSettings({ theme: v })} className={cn('rounded-lg px-2.5 py-1.5 text-sm transition', s.theme === v ? 'bg-ink text-paper' : 'bg-card2 text-muted hover:text-ink')}>
                {label}
              </button>
            ))}
          </div>
        </Row>
        <Row label="字号">
          <div className="flex items-center gap-3">
            <input type="range" min={0.9} max={1.25} step={0.05} value={s.fontScale} onChange={(e) => updateSettings({ fontScale: Number(e.target.value) })} className="w-40 accent-[var(--accent)]" />
            <span className="w-10 text-right text-sm tabular-nums">{Math.round(s.fontScale * 100)}%</span>
          </div>
        </Row>
        <Row label="界面动效">
          <Toggle on={s.motion} onChange={(v) => updateSettings({ motion: v })} />
        </Row>
      </Section>

      <Section title="数据">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={download}>
            导出进度
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            导入进度
          </Button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          <Button
            variant="danger"
            onClick={() => {
              if (confirm('清空全部学习记录（保留设置、标记与笔记）？此操作不可撤销。')) {
                resetProgressOnly();
                flash('学习记录已清空');
              }
            }}
          >
            重置学习记录
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (confirm('恢复出厂：清空所有数据（含设置、笔记、标记）？')) {
                resetAll();
                flash('已恢复初始状态');
              }
            }}
          >
            恢复出厂
          </Button>
        </div>
      </Section>

      <Section title="关于方法">
        <ul className="space-y-2 text-sm leading-relaxed text-muted">
          <li>
            <b className="text-ink">主动回忆</b>：先在心里作答再看答案。回忆的努力本身就是记忆巩固的关键——看懂 ≠ 记住。
          </li>
          <li>
            <b className="text-ink">间隔重复（FSRS）</b>：根据你每张卡的难度、稳定性和上次复习时间预测遗忘概率，在快忘时安排复习。评分请如实：「忘了」不是失败，而是给算法的有效信号。
          </li>
          <li>
            <b className="text-ink">交错练习</b>：每日任务把不同章节的卡片打乱混排，模拟考场中「不知道考哪章」的提取情境。
          </li>
          <li>
            <b className="text-ink">精细加工</b>：每张卡附带「记忆锚点」与「易错点」，把孤立公式挂到推导、口诀与反例上；也鼓励你写下自己的笔记。
          </li>
          <li>
            <b className="text-ink">知识范围</b>：覆盖考研数学二大纲（高等数学 + 线性代数），不含概率论、级数、空间解析几何与曲线曲面积分。
          </li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">{title}</h2>
      <div className="space-y-4 rounded-2xl border border-line bg-card p-4">{children}</div>
    </section>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={() => onChange(!on)} className={cn('relative h-6 w-11 rounded-full transition', on ? 'bg-accent' : 'bg-line')}>
      <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left]', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  );
}
