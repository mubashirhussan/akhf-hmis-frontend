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
      onChange={(dates) => onChange?.(!dates || (dates[0] == null && dates[1] == null) ? null : dates)}
      format={format}
      allowClear
      allowEmpty={allowEmpty}
    />
  );
}
