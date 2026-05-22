import { findNavItemByHref } from '@/lib/navigation-utils';

export default function ModulePlaceholder({ pathname }) {
  const item = findNavItemByHref(pathname);
  const title = item?.label ?? 'Page';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
      <p className="mt-2 text-slate-500">
        Module content goes here. Route: <code className="text-sm text-[var(--hmis-primary)]">{pathname}</code>
      </p>
    </div>
  );
}
