import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="card mx-auto mt-10 max-w-sm px-6 py-8 text-center">
      <p className="text-base font-medium">页面不存在</p>
      <Link href="/" className="mt-4 inline-flex h-11 items-center rounded-xl bg-accent px-5 text-sm font-medium text-accent-ink">
        返回首页
      </Link>
    </div>
  );
}
