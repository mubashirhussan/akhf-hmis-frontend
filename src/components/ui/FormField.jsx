export default function FormField({
  label,
  required = false,
  hint,
  error,
  children,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-slate-600">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[11px] text-slate-400">{hint}</p>}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
