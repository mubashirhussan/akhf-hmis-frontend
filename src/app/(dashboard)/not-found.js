import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-800">Page not found</h1>
      <p className="mt-2 text-slate-500">This module route is not registered in navigation.</p>
      <Link href="/" className="mt-4 inline-block text-[var(--hmis-primary)] hover:underline">
        Go to Home
      </Link>
    </div>
  );
}
