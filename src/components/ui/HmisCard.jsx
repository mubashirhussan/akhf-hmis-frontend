export default function HmisCard({
  children,
  className = '',
  title,
  description,
  headerExtra,
  headerLayout = 'stacked',
  ...props
}) {
  const hasHeader = Boolean(title || description || headerExtra);

  return (
    <div
      className={['hmis-card', 'rounded-[10px]', 'px-5', 'py-5', className].filter(Boolean).join(' ')}
      {...props}
    >
      {hasHeader && (
        <div className={`hmis-card-header hmis-card-header--${headerLayout}`}>
          {(title || description) && (
            <div className="hmis-card-header-text">
              {title && <h2 className="hmis-card-title">{title}</h2>}
              {description && <p className="hmis-card-description">{description}</p>}
            </div>
          )}
          {headerExtra && <div className="hmis-card-header-extra">{headerExtra}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
