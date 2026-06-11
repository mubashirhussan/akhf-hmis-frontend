'use client';

import { Input, InputNumber, Select } from 'antd';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function DynamicResultField({ field, value, onChange, id }) {
  const commonProps = {
    id,
    className: controlClass,
    value: value ?? '',
    onChange: (nextValue) => onChange(nextValue),
  };

  switch (field.type) {
    case 'textarea':
      return (
        <Input.TextArea
          {...commonProps}
          rows={field.rows ?? 1}
          onChange={(event) => onChange(event.target.value)}
        />
      );

    case 'select':
      return (
        <Select
          {...commonProps}
          style={{ width: '100%' }}
          options={field.options ?? []}
          onChange={(nextValue) => onChange(nextValue)}
        />
      );

    case 'number':
      return (
        <InputNumber
          id={id}
          className={controlClass}
          value={value === '' ? null : value}
          onChange={(nextValue) => onChange(nextValue ?? '')}
          style={{ width: '100%' }}
        />
      );

    case 'text':
    default:
      return (
        <Input
          {...commonProps}
          autoComplete="off"
          onChange={(event) => onChange(event.target.value)}
        />
      );
  }
}
