export default function FormSection({ title, description, children, action }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-[var(--hmis-header-bg)] px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
