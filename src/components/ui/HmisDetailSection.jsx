function DetailField({ label, value, span = 1 }) {
  const spanClass =
    span === 4
      ? 'hmis-detail-field--span-4'
      : span === 2
        ? 'hmis-detail-field--span-2'
        : '';

  return (
    <div className={`hmis-detail-field ${spanClass}`.trim()}>
      <span className="hmis-detail-label">{label}</span>
      <span className="hmis-detail-value">{value ?? '—'}</span>
    </div>
  );
}

export default function HmisDetailSection({ title, fields = [], className = '' }) {
  if (!fields.length) return null;

  return (
    <section className={`hmis-detail-section ${className}`.trim()}>
      {title && <h3 className="hmis-detail-section-title">{title}</h3>}
      <div className="hmis-detail-grid">
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
