function DetailField({ label, value, span = 1 }) {
  const spanClass =
    span === 4
      ? 'detail-field--span-4'
      : span === 2
        ? 'detail-field--span-2'
        : '';

  return (
    <div className={`detail-field ${spanClass}`.trim()}>
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value ?? '—'}</span>
    </div>
  );
}

export default function DetailSection({ title, fields = [], className = '' }) {
  if (!fields.length) return null;

  return (
    <section className={`detail-section ${className}`.trim()}>
      {title && <h3 className="detail-section-title">{title}</h3>}
      <div className="detail-grid">
        {fields.map((field) => (
          <DetailField
            key={field.key}
            label={field.label}
            value={field.value}
            span={field.span}
          />
        ))}
      </div>
    </section>
  );
}
