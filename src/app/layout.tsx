import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Shell } from '@/components/Shell';

export const metadata: Metadata = {
  title: { default: '考研数学识记', template: '%s · 考研数学识记' },
  description: '数学一 / 数学二公式、定理与易错点的主动回忆与间隔复习',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
  appleWebApp: { capable: true, title: '数学识记', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f8f7f3',
};

const boot = `(function(){try{var s=JSON.parse(localStorage.getItem('kaoyan-math-v3')||'{}').settings||{};var t=s.theme||'auto';var d=t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');if(s.fontScale)document.documentElement.style.setProperty('--font-scale',s.fontScale);if(s.mathScale)document.documentElement.style.setProperty('--math-scale',s.mathScale);}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
