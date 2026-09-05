import type { NextConfig } from 'next';

const staticExport = process.env.STATIC_EXPORT === '1';

const nextConfig: NextConfig = {
  // STATIC_EXPORT=1 时输出纯静态站点（out/），用于 Cloudflare Pages；默认输出用于 Vercel / Node
  output: staticExport ? 'export' : undefined,
  reactStrictMode: true,
  poweredByHeader: false,
  ...(staticExport ? {} : {
    headers: async () => [
      { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }, { key: 'Service-Worker-Allowed', value: '/' }] },
    ],
  }),
};

export default nextConfig;
