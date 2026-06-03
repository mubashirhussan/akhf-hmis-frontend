'use client';

import { HMIS_FORM_GRID_COLUMNS_DEFAULT } from '@/lib/hmis-form-grid';

export default function HmisFormGrid({
  columns = HMIS_FORM_GRID_COLUMNS_DEFAULT,
  className = '',
  as: Component = 'div',
  style,
  children,
  ...props
}) {
  return (
    <Component
      className={['hmis-form-grid', className].filter(Boolean).join(' ')}
      style={{ '--hmis-form-cols': columns, ...style }}
      {...props}
    >
      {children}
    </Component>
  );
}
