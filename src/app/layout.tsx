import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import 'katex/dist/katex.min.css';
import './globals.css';
import { Shell } from '@/components/Shell';

export const metadata: Metadata = {
  title: { default: '数学二识记 · FSRS 间隔复习', template: '%s · 数学二识记' },
  description: '考研数学二公式、定理与易错点的主动回忆闪卡，基于 FSRS 间隔复习算法，手机端优先。',
  applicationName: '数学二识记',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: '数学二识记', statusBarStyle: 'default' },
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
};

export const viewport: Viewport = {
  themeColor: '#f8f7f4',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const themeScript = `(function(){try{var s=JSON.parse(localStorage.getItem('math2-fsrs-v2')||localStorage.getItem('math2-memo-v1')||'{}');var t=s&&s.settings&&s.settings.theme||'auto';var d=t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');if(s&&s.settings){if(s.settings.fontScale)document.documentElement.style.setProperty('--font-scale',s.settings.fontScale);if(s.settings.mathScale)document.documentElement.style.setProperty('--math-scale',s.settings.mathScale);}}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
