import Link from 'next/link';

export const metadata = { title: '离线' };

export default function OfflinePage() {
  return (
    <div className="card mx-auto mt-10 max-w-sm px-6 py-8 text-center">
      <p className="text-base font-medium">当前离线</p>
      <p className="mt-1 text-sm text-muted">已访问过的页面可继续使用，学习记录会保存在本机。</p>
      <Link href="/" className="mt-4 inline-flex h-11 items-center rounded-xl bg-accent px-5 text-sm font-medium text-accent-ink">
        返回首页
      </Link>
    </div>
  );
}
