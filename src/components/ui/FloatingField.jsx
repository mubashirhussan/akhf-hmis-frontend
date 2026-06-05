import { resolveGridColumn } from '@/lib/grid-column';

export default function FloatingField({
  label,
  htmlFor,
  children,
  className = '',
  variant = 'control',
  col,
  colStart,
  Col,
  colSpan,
  required = false,
}) {
  const isRadios = variant === 'radios';
  const radioLabel = isRadios && label && !label.endsWith(':') ? `${label} :` : label;
  const resolvedCol = col ?? Col ?? colSpan ?? (isRadios ? 'full' : 1);

  return (
    <div
      className={[
        'floating-field',
        isRadios ? 'floating-field--radios' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={resolveGridColumn(resolvedCol, colStart)}
    >
      {isRadios ? (
        <>
          <span className="floating-label floating-label--inline">{radioLabel}</span>
          <div className="floating-control">{children}</div>
        </>
      ) : (
        <>
          <label className="floating-label" htmlFor={htmlFor}>
            {label}
            {required ? (
              <span className="floating-label-asterisk" aria-hidden>
                *
              </span>
            ) : null}
          </label>
          <div className="floating-control">{children}</div>
        </>
      )}
    </div>
  );
}
