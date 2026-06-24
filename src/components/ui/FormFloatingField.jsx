'use client';

import { Form } from 'antd';
import FloatingField from '@/components/ui/FloatingField';
import { useFormFieldPrefix } from '@/components/ui/FormFieldPrefixContext';

export default function FormFloatingField({
  name,
  label,
  rules,
  validateTrigger,
  required = false,
  col,
  colStart,
  variant = 'control',
  className = '',
  valuePropName,
  children,
}) {
  const prefix = useFormFieldPrefix();
  const fieldKey = name != null ? (Array.isArray(name) ? name.join('-') : String(name)) : '';
  const fieldClass =
    name != null
      ? [`${prefix}-field`, `${prefix}-field--${fieldKey}`, className].filter(Boolean).join(' ')
      : className;

  return (
    <FloatingField
      label={label}
      required={required}
      col={col}
      colStart={colStart}
      variant={variant}
      className={fieldClass}
    >
      <Form.Item
        noStyle
        {...(name != null ? { name } : {})}
        {...(rules ? { rules } : {})}
        validateTrigger={validateTrigger ?? ['onChange', 'onSubmit']}
        {...(valuePropName ? { valuePropName } : {})}
      >
        {children}
      </Form.Item>
    </FloatingField>
  );
}
