'use client';

import { InputNumber, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const ADJUST_TYPE_OPTIONS = [
  { label: 'Increase', value: 'increase' },
  { label: 'Decrease', value: 'decrease' },
];

const controlClass = FIELD_CONTROL_CLASS;

export default function AssignCompanyRatesForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
}) {
  const fieldId = (name) => `assign-company-rates-${name}`;

  return (
    <FormGrid columns={1} className="assign-company-rates-form-grid">
      <FormField
        label="Adjustment Type"
        required
        error={errors?.adjustType}
      >
        <Select
          id={fieldId('adjust-type')}
          className={controlClass}
          status={errors?.adjustType ? 'error' : ''}
          value={form.adjustType || undefined}
          options={ADJUST_TYPE_OPTIONS}
          onChange={(adjustType) => {
            onPatchForm({ adjustType });
            onClearError?.('adjustType');
          }}
        />
      </FormField>

      <FormField
        label="Percentage"
        required
        error={errors?.percentage}
      >
        <InputNumber
          id={fieldId('percentage')}
          className={`${controlClass} assign-company-rates-percentage-input`}
          status={errors?.percentage ? 'error' : ''}
          value={form.percentage}
          min={0.01}
          max={100}
          onChange={(percentage) => {
            onPatchForm({ percentage: percentage ?? null });
            onClearError?.('percentage');
          }}
        />
      </FormField>
    </FormGrid>
  );
}