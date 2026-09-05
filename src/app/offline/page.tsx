import Link from 'next/link';

export const metadata = { title: '离线' };

export default function Offline() {
  return (
    <div className="card mx-auto mt-10 max-w-md px-6 py-10 text-center">
      <div className="text-lg font-semibold">当前离线</div>
      <p className="mt-2 text-sm text-muted">这个页面还没有被缓存。已访问过的页面与全部学习数据都保存在本机，可以继续使用。</p>
      <Link href="/" className="btn btn-primary mt-5">
        回到首页
      </Link>
    </div>
  );
}
