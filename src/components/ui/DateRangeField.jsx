'use client';

import { DatePicker } from 'antd';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

export default function DateRangeField({
  id,
  value,
  onChange,
  className = '',
  format = 'DD / MM / YYYY',
  allowEmpty = [true, true],
}) {
  return (
    <DatePicker.RangePicker
      id={id}
      className={['w-full', FIELD_CONTROL_CLASS, className].filter(Boolean).join(' ')}
      value={value}
      onChange={onChange}
      format={format}
      allowEmpty={allowEmpty}
    />
  );
}
