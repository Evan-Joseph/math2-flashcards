'use client';

import { forwardRef, useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Dialog as RDialog, Switch as RSwitch, Slider as RSlider, ToggleGroup as RToggle, Tooltip as RTooltip } from 'radix-ui';
import { Drawer } from 'vaul';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';

/* ------------------------------------------------------------------ */
/* hooks                                                               */
/* ------------------------------------------------------------------ */

export function useMediaQuery(q: string, initial = false) {
  const [m, setM] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

export function useMotionOn(): boolean {
  const pref = useStore((s) => s.settings.motion);
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)');
  if (pref === 'off') return false;
  if (pref === 'on') return true;
  return !reduce;
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

export const buttonVariants = cva(
  'inline-flex shrink-0 select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-xl font-medium leading-none transition-[background-color,color,border-color,transform,box-shadow] duration-150 ease-out active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-ink shadow-[0_1px_0_oklch(0_0_0/0.06)] hover:brightness-105',
        secondary: 'bg-paper-2 text-ink hover:bg-line',
        outline: 'border border-line-2 bg-paper text-ink hover:bg-paper-2',
        ghost: 'text-ink-2 hover:bg-paper-2 hover:text-ink',
        soft: 'bg-accent-soft text-accent hover:brightness-[0.98]',
        danger: 'bg-bad-soft text-bad hover:brightness-[0.98]',
      },
      size: {
        sm: 'h-9 px-3 text-[13px] [&_svg]:size-4',
        md: 'h-11 px-4 text-sm [&_svg]:size-[18px]',
        lg: 'h-12 px-5 text-[15px] [&_svg]:size-5',
        icon: 'h-11 w-11 [&_svg]:size-5',
        'icon-sm': 'h-9 w-9 rounded-lg [&_svg]:size-[18px]',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className, variant, size, type = 'button', ...props }, ref) {
  return <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});

/* ------------------------------------------------------------------ */
/* Badge / Kbd / Progress                                              */
/* ------------------------------------------------------------------ */

export function Badge({ children, tone = 'neutral', className, style }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'good' | 'warn' | 'bad' | 'outline'; className?: string; style?: React.CSSProperties }) {
  const tones = {
    neutral: 'bg-paper-2 text-ink-2',
    accent: 'bg-accent-soft text-accent',
    good: 'bg-good-soft text-good',
    warn: 'bg-warn-soft text-warn',
    bad: 'bg-bad-soft text-bad',
    outline: 'border border-line-2 text-ink-2',
  };
  return (
    <span style={style} className={cn('inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs font-medium leading-none whitespace-nowrap', tones[tone], className)}>
      {children}
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-line-2 bg-paper px-1.5 font-mono text-[11px] font-medium text-muted">{children}</kbd>;
}

export function Progress({ value, className, color }: { value: number; className?: string; color?: string }) {
  return (
    <div className={cn('bar', className)} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${Math.min(100, Math.max(0, value * 100))}%`, background: color }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Switch / Slider / Segmented                                         */
/* ------------------------------------------------------------------ */

export function Switch({ checked, onCheckedChange, id, ariaLabel }: { checked: boolean; onCheckedChange: (v: boolean) => void; id?: string; ariaLabel?: string }) {
  return (
    <RSwitch.Root id={id} checked={checked} onCheckedChange={onCheckedChange} aria-label={ariaLabel} className="relative h-7 w-12 shrink-0 rounded-full bg-line-2 transition-colors data-[state=checked]:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
      <RSwitch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white shadow-[0_1px_3px_oklch(0_0_0/0.25)] transition-transform duration-200 ease-out data-[state=checked]:translate-x-[22px]" />
    </RSwitch.Root>
  );
}

export function Slider({ value, min, max, step, onValueChange, ariaLabel }: { value: number; min: number; max: number; step: number; onValueChange: (v: number) => void; ariaLabel: string }) {
  return (
    <RSlider.Root className="relative flex h-11 w-full touch-none select-none items-center" value={[value]} min={min} max={max} step={step} onValueChange={(v) => onValueChange(v[0])}>
      <RSlider.Track className="relative h-1.5 grow rounded-full bg-line">
        <RSlider.Range className="absolute h-full rounded-full bg-accent" />
      </RSlider.Track>
      <RSlider.Thumb aria-label={ariaLabel} className="block size-6 rounded-full border border-line-2 bg-paper shadow-[0_1px_4px_oklch(0_0_0/0.2)] transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-110" />
    </RSlider.Root>
  );
}

export function Segmented<T extends string>({ value, onValueChange, options, ariaLabel, className, size = 'md' }: { value: T; onValueChange: (v: T) => void; options: { value: T; label: ReactNode }[]; ariaLabel: string; className?: string; size?: 'sm' | 'md' }) {
  return (
    <RToggle.Root type="single" value={value} onValueChange={(v) => v && onValueChange(v as T)} aria-label={ariaLabel} className={cn('inline-flex rounded-xl bg-paper-2 p-1', className)}>
      {options.map((o) => (
        <RToggle.Item key={o.value} value={o.value} className={cn('flex-1 rounded-[9px] px-3 font-medium leading-none text-muted transition-[background-color,color,box-shadow] duration-150 data-[state=on]:bg-paper data-[state=on]:text-ink data-[state=on]:shadow-[0_1px_2px_oklch(0_0_0/0.08)] focus-visible:outline-2 focus-visible:outline-accent whitespace-nowrap', size === 'sm' ? 'h-8 text-[13px]' : 'h-9 text-sm')}>
          {o.label}
        </RToggle.Item>
      ))}
    </RToggle.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Tooltip                                                             */
/* ------------------------------------------------------------------ */

export function Tip({ children, label, side = 'top' }: { children: ReactNode; label: string; side?: 'top' | 'bottom' | 'left' | 'right' }) {
  return (
    <RTooltip.Provider delayDuration={400}>
      <RTooltip.Root>
        <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
        <RTooltip.Portal>
          <RTooltip.Content side={side} sideOffset={6} className="z-[60] rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-canvas shadow-pop">
            {label}
          </RTooltip.Content>
        </RTooltip.Portal>
      </RTooltip.Root>
    </RTooltip.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Dialog（居中弹窗，用于确认 / 放大公式）                              */
/* ------------------------------------------------------------------ */

export function Dialog({ open, onOpenChange, title, description, children, size = 'md' }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; description?: string; children?: ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  const w = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' }[size];
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      <RDialog.Portal>
        <RDialog.Overlay className="overlay fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px]" />
        <RDialog.Content className={cn('dialog fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-paper p-5 shadow-pop outline-none max-h-[calc(100dvh-2rem)] overflow-y-auto', w)}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <RDialog.Title className="text-base font-semibold leading-6">{title}</RDialog.Title>
              {description ? <RDialog.Description className="mt-1 text-sm text-muted">{description}</RDialog.Description> : <RDialog.Description className="sr-only">{title}</RDialog.Description>}
            </div>
            <RDialog.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label="关闭" className="-mr-1.5 -mt-1.5">
                <X />
              </Button>
            </RDialog.Close>
          </div>
          {children}
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Sheet：移动端底部抽屉，桌面端右侧面板                                 */
/* ------------------------------------------------------------------ */

export function Sheet({ open, onOpenChange, title, children, footer }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; children: ReactNode; footer?: ReactNode }) {
  const desktop = useMediaQuery('(min-width: 1024px)');
  if (desktop) {
    return (
      <RDialog.Root open={open} onOpenChange={onOpenChange}>
        <RDialog.Portal>
          <RDialog.Overlay className="overlay fixed inset-0 z-50 bg-ink/30" />
          <RDialog.Content className="side-sheet fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-line bg-paper shadow-pop outline-none">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5">
              <RDialog.Title className="truncate text-[15px] font-semibold">{title}</RDialog.Title>
              <RDialog.Description className="sr-only">{title}</RDialog.Description>
              <RDialog.Close asChild>
                <Button variant="ghost" size="icon-sm" aria-label="关闭">
                  <X />
                </Button>
              </RDialog.Close>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
            {footer ? <div className="shrink-0 border-t border-line px-5 py-3">{footer}</div> : null}
          </RDialog.Content>
        </RDialog.Portal>
      </RDialog.Root>
    );
  }
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-2xl border-t border-line bg-paper outline-none" aria-describedby={undefined}>
          <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-line-2" aria-hidden />
          <div className="flex h-12 shrink-0 items-center justify-between px-4">
            <Drawer.Title className="truncate text-[15px] font-semibold">{title}</Drawer.Title>
            <Drawer.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label="关闭">
                <X />
              </Button>
            </Drawer.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4">{children}</div>
          {footer ? <div className="shrink-0 border-t border-line px-4 py-3 safe-b">{footer}</div> : <div className="safe-b" />}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

/* ------------------------------------------------------------------ */
/* 页面骨架                                                            */
/* ------------------------------------------------------------------ */

export function PageHeader({ title, subtitle, action, back }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode; back?: ReactNode }) {
  return (
    <header className="mb-5 flex items-end justify-between gap-3">
      <div className="min-w-0">
        {back}
        <h1 className="truncate text-[22px] font-semibold leading-8 tracking-[-0.01em] sm:text-2xl">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function Section({ title, aside, children, className }: { title?: ReactNode; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('mb-6', className)}>
      {title ? (
        <div className="mb-2.5 flex items-center justify-between gap-3 px-0.5">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">{title}</h2>
          {aside}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Empty({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-10 text-center">
      <p className="text-[15px] font-medium">{title}</p>
      {desc ? <p className="mt-1 max-w-xs text-sm text-muted">{desc}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Stat({ label, value, sub, className }: { label: string; value: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <div className={cn('card px-4 py-3.5', className)}>
      <div className="text-xs font-medium text-muted">{label}</div>
      <div className="tnum mt-1 text-[22px] font-semibold leading-7 tracking-tight">{value}</div>
      {sub ? <div className="mt-0.5 text-xs text-muted">{sub}</div> : null}
    </div>
  );
}
