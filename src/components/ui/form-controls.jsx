const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-[#6C6C6C] placeholder:font-medium placeholder:text-[11px] placeholder:leading-none placeholder:tracking-[0.04em] focus:border-[var(--hmis-primary)] focus:ring-2 focus:ring-[var(--hmis-primary)]/15';

export function TextInput({ className = '', ...props }) {
  return <input className={`${inputClass} ${className}`} {...props} />;
}

export function SelectInput({ className = '', children, ...props }) {
  return (
    <select className={`${inputClass} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function TextArea({ className = '', rows = 3, ...props }) {
  return <textarea className={`${inputClass} resize-y ${className}`} rows={rows} {...props} />;
}

export function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((opt) => (
        <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="h-4 w-4 accent-[var(--hmis-primary)]"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export function BtnPrimary({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`rounded-lg bg-[var(--hmis-primary)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#005a94] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function BtnSecondary({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function BtnOutline({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`rounded-lg border border-[var(--hmis-primary)] bg-white px-4 py-2 text-sm font-medium text-[var(--hmis-primary)] transition hover:bg-[var(--hmis-primary)]/5 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
