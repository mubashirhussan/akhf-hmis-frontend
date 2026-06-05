'use client';

import { FORM_GRID_COLUMNS_DEFAULT } from '@/lib/form-grid';

export default function FormGrid({
  columns = FORM_GRID_COLUMNS_DEFAULT,
  className = '',
  as: Component = 'div',
  style,
  children,
  ...props
}) {
  return (
    <Component
      className={['form-grid', className].filter(Boolean).join(' ')}
      style={{ '--form-cols': columns, ...style }}
      {...props}
    >
      {children}
    </Component>
  );
}
