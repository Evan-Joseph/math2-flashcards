'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Download, Upload, Trash2 } from 'lucide-react';
import { EXAMS, type Exam } from '@/data';
import { useStore, useHydrated, updateSettings, exportData, importData, resetAll, resetProgressOnly, daysToExam, type Order, type Settings } from '@/lib/store';
import { PageHeader, Section, Segmented, Switch, Slider, Button, Dialog } from '@/components/ui';
import { cn } from '@/lib/cn';

function Row({ label, desc, children, stack }: { label: string; desc?: string; children: React.ReactNode; stack?: boolean }) {
  return (
    <div className={cn('flex gap-4 px-4 py-3.5', stack ? 'flex-col' : 'items-center justify-between')}>
      <div className="min-w-0">
        <div className="text-[15px] font-medium">{label}</div>
        {desc ? <div className="mt-0.5 text-xs leading-5 text-muted">{desc}</div> : null}
      </div>
      <div className={cn('shrink-0', stack && 'w-full')}>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const hydrated = useHydrated();
  const st = useStore((s) => s.settings);
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirm, setConfirm] = useState<'progress' | 'all' | null>(null);

  if (!hydrated) return <div className="card h-40 animate-pulse" />;
  const set = (p: Partial<Settings>) => updateSettings(p);

  return (
    <div>
      <PageHeader title="设置" />

      <Section title="学习">
        <div className="card divide-y divide-line">
          <Row label="考试" desc={EXAMS[st.exam].desc}>
            <Segmented<Exam> ariaLabel="考试" size="sm" value={st.exam} onValueChange={(v) => set({ exam: v })} options={[{ value: 'm2', label: '数学二' }, { value: 'm1', label: '数学一' }]} />
          </Row>
          <Row label="出题顺序" desc="随机：跨章节交错；顺序：按知识库顺序，可续读">
            <Segmented<Order> ariaLabel="出题顺序" size="sm" value={st.order} onValueChange={(v) => set({ order: v })} options={[{ value: 'random', label: '随机' }, { value: 'sequential', label: '顺序' }]} />
          </Row>
          <Row label={`每日新卡上限 · ${st.dailyNew}`} desc="到期复习不受此限制" stack>
            <Slider ariaLabel="每日新卡上限" value={st.dailyNew} min={0} max={60} step={5} onValueChange={(v) => set({ dailyNew: v })} />
          </Row>
          <Row label={`目标记忆保持率 · ${Math.round(st.retention * 100)}%`} desc="越高复习越频繁；FSRS 推荐 85%–92%" stack>
            <Slider ariaLabel="目标记忆保持率" value={st.retention} min={0.8} max={0.97} step={0.01} onValueChange={(v) => set({ retention: Number(v.toFixed(2)) })} />
          </Row>
          <Row label="考试日期" desc={`距今 ${daysToExam(new Date(), st)} 天 · 用于限制最长复习间隔`}>
            <input type="date" value={st.examDate} onChange={(e) => e.target.value && set({ examDate: e.target.value })} className="h-10 rounded-lg border border-line bg-paper px-2.5 text-sm" aria-label="考试日期" />
          </Row>
          <Row label="触感反馈" desc="评分时轻微振动（支持的设备）">
            <Switch checked={st.haptics} onCheckedChange={(v) => set({ haptics: v })} ariaLabel="触感反馈" />
          </Row>
        </div>
      </Section>

      <Section title="外观">
        <div className="card divide-y divide-line">
          <Row label="主题">
            <Segmented<Settings['theme']> ariaLabel="主题" size="sm" value={st.theme} onValueChange={(v) => set({ theme: v })} options={[{ value: 'auto', label: '跟随系统' }, { value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }]} />
          </Row>
          <Row label="动态效果" desc="「跟随系统」尊重减少动态效果设置">
            <Segmented<Settings['motion']> ariaLabel="动态效果" size="sm" value={st.motion} onValueChange={(v) => set({ motion: v })} options={[{ value: 'auto', label: '跟随系统' }, { value: 'on', label: '开' }, { value: 'off', label: '关' }]} />
          </Row>
          <Row label={`界面字号 · ${Math.round(st.fontScale * 100)}%`} stack>
            <Slider ariaLabel="界面字号" value={st.fontScale} min={0.9} max={1.25} step={0.05} onValueChange={(v) => set({ fontScale: Number(v.toFixed(2)) })} />
          </Row>
          <Row label={`公式字号 · ${Math.round(st.mathScale * 100)}%`} desc="只影响卡片正文与公式" stack>
            <Slider ariaLabel="公式字号" value={st.mathScale} min={0.9} max={1.3} step={0.05} onValueChange={(v) => set({ mathScale: Number(v.toFixed(2)) })} />
          </Row>
        </div>
      </Section>

      <Section title="数据">
        <div className="card divide-y divide-line">
          <div className="flex flex-wrap gap-2 px-4 py-3.5">
            <Button
              onClick={() => {
                const blob = new Blob([exportData()], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `kaoyan-math-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                setTimeout(() => URL.revokeObjectURL(a.href), 1000);
              }}
            >
              <Download /> 导出 JSON
            </Button>
            <Button onClick={() => fileRef.current?.click()}>
              <Upload /> 导入 JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (!f) return;
                const r = importData(await f.text());
                if (r.ok) toast.success(`已导入 ${r.cards} 张卡片进度 · ${r.reviews} 条记录`);
                else toast.error(r.error);
              }}
            />
          </div>
          <Row label="重置学习进度" desc="清除复习状态、日志与历史，保留收藏、笔记与设置">
            <Button variant="danger" size="sm" onClick={() => setConfirm('progress')}>
              重置
            </Button>
          </Row>
          <Row label="清除全部数据" desc="包括收藏、笔记与设置">
            <Button variant="danger" size="sm" onClick={() => setConfirm('all')}>
              <Trash2 /> 清除
            </Button>
          </Row>
        </div>
      </Section>

      <Section title="关于">
        <div className="card px-4 py-3.5 text-sm leading-6 text-muted">
          <p>范围基线：中国教育考试网公布的最近可核验大纲（2026 版数学一 / 数学二）。来源讲次与页码来自张宇 2027《基础 30 讲》三分册已核验的讲次级映射；教材定位到同济《高等数学》第七版、同济《线性代数》第六版、浙大《概率论与数理统计》第四版章级。</p>
          <p className="mt-2">标为「待确认」或「拓展」的卡片可检索，不进入默认复习队列。复习调度使用 FSRS（ts-fsrs）。所有数据保存在本浏览器，可通过 JSON 导入导出备份。</p>
        </div>
      </Section>

      <Dialog open={confirm != null} onOpenChange={(v) => !v && setConfirm(null)} title={confirm === 'all' ? '清除全部数据？' : '重置学习进度？'} description={confirm === 'all' ? '此操作不可撤销。建议先导出 JSON。' : '将清除全部复习状态与统计记录，收藏、笔记与设置保留。'}>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={() => setConfirm(null)}>取消</Button>
          <Button
            variant="danger"
            onClick={() => {
              if (confirm === 'all') resetAll();
              else resetProgressOnly();
              setConfirm(null);
              toast('已完成');
            }}
          >
            确认
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
