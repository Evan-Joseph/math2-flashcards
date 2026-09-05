import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="card mx-auto mt-10 max-w-md px-6 py-10 text-center">
      <div className="text-lg font-semibold">页面不存在</div>
      <Link href="/" className="btn btn-primary mt-5">
        回到首页
      </Link>
    </div>
  );
}
