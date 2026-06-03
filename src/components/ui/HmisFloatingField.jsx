import { resolveGridColumn } from '@/lib/hmis-grid-column';

export default function HmisFloatingField({
  label,
  htmlFor,
  children,
  className = '',
  variant = 'control',
  /** Columns this field spans in HmisFormGrid (1–N, or "full" for entire row). */
  col,
  /** Fixed column start (1-based) — keeps width when sibling fields are hidden. */
  colStart,
  /** @deprecated Use `col` instead */
  Col,
  /** @deprecated Use `col` instead */
  colSpan,
}) {
  const isRadios = variant === 'radios';
  const radioLabel = isRadios && label && !label.endsWith(':') ? `${label} :` : label;
  const resolvedCol = col ?? Col ?? colSpan ?? (isRadios ? 'full' : 1);

  return (
    <div
      className={[
        'hmis-floating-field',
        isRadios ? 'hmis-floating-field--radios' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={resolveGridColumn(resolvedCol, colStart)}
    >
      {isRadios ? (
        <>
          <span className="hmis-floating-label hmis-floating-label--inline">{radioLabel}</span>
          <div className="hmis-floating-control">{children}</div>
        </>
      ) : (
        <>
          <label className="hmis-floating-label" htmlFor={htmlFor}>
            {label}
          </label>
          <div className="hmis-floating-control">{children}</div>
        </>
      )}
    </div>
  );
}
