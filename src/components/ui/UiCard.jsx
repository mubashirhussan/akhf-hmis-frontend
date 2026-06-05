export default function UiCard({
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
      className={['ui-card', 'rounded-[10px]', 'px-5', 'py-5', className].filter(Boolean).join(' ')}
      {...props}
    >
      {hasHeader && (
        <div className={`ui-card-header ui-card-header--${headerLayout}`}>
          {(title || description) && (
            <div className="ui-card-header-text">
              {title && <h2 className="ui-card-title">{title}</h2>}
              {description && <p className="ui-card-description">{description}</p>}
            </div>
          )}
          {headerExtra && <div className="ui-card-header-extra">{headerExtra}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
