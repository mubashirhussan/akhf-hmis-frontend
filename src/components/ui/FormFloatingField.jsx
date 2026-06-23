'use client';

import { Form } from 'antd';
import FloatingField from '@/components/ui/FloatingField';
import { formFieldId, useFormFieldPrefix } from '@/components/ui/FormFieldPrefixContext';

export default function FormFloatingField({
  name,
  label,
  rules,
  validateTrigger,
  required = false,
  col,
  colStart,
  variant = 'control',
  htmlFor,
  className = '',
  valuePropName,
  children,
}) {
  const prefix = useFormFieldPrefix();
  const fieldId = name != null ? formFieldId(prefix, name) : undefined;
  const fieldClass =
    name != null
      ? [`${prefix}-field`, `${prefix}-field--${name}`, className].filter(Boolean).join(' ')
      : className;

  const formItemProps = {
    noStyle: true,
    ...(name != null ? { name, id: fieldId } : {}),
    ...(rules ? { rules } : {}),
    validateTrigger: validateTrigger ?? ['onChange', 'onSubmit'],
    ...(valuePropName ? { valuePropName } : {}),
  };

  return (
    <FloatingField
      label={label}
      htmlFor={htmlFor ?? fieldId}
      required={required}
      col={col}
      colStart={colStart}
      variant={variant}
      className={fieldClass}
    >
      <Form.Item {...formItemProps}>{children}</Form.Item>
    </FloatingField>
  );
}
