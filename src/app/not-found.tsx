import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60dvh] max-w-md place-items-center px-4 text-center">
      <div>
        <div className="text-5xl font-black text-accent">∅</div>
        <h1 className="mt-3 text-xl font-bold">页面不存在</h1>
        <p className="mt-1 text-sm text-muted">这个章节或页面没有找到。</p>
        <Link href="/" className="mt-5 inline-flex h-11 items-center rounded-xl bg-accent px-5 font-medium text-white">
          返回首页
        </Link>
      </div>
    </div>
  );
}
