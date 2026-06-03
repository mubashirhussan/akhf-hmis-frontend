'use client';

import { Form } from 'antd';
import HmisFloatingField from '@/components/ui/HmisFloatingField';
import { patientRegFieldId } from '@/lib/hmis-form-validation';

export default function PatientRegField({
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
  const fieldId = name != null ? patientRegFieldId(name) : undefined;
  const fieldClass =
    name != null
      ? ['patient-reg-field', `patient-reg-field--${name}`, className].filter(Boolean).join(' ')
      : className;

  const formItemProps = {
    noStyle: true,
    ...(name != null ? { name, id: fieldId } : {}),
    ...(rules ? { rules } : {}),
    validateTrigger: validateTrigger ?? ['onChange', 'onSubmit'],
    ...(valuePropName ? { valuePropName } : {}),
  };

  return (
    <HmisFloatingField
      label={label}
      htmlFor={htmlFor ?? fieldId}
      required={required}
      col={col}
      colStart={colStart}
      variant={variant}
      className={fieldClass}
    >
      <Form.Item {...formItemProps}>{children}</Form.Item>
    </HmisFloatingField>
  );
}
