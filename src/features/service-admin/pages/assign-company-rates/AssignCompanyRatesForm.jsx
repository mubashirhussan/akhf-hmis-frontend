'use client';

import { InputNumber, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const ADJUST_TYPE_OPTIONS = [
  { label: 'Increase', value: 'increase' },
  { label: 'Decrease', value: 'decrease' },
];

const ADJUST_MODE_OPTIONS = [
  { label: 'Percentage', value: 'percentage' },
  { label: 'Fixed Amount', value: 'fixed' },
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
        label="Adjustment Mode"
        required
        error={errors?.adjustMode}
      >
        <Select
          id={fieldId('adjust-mode')}
          className={controlClass}
          status={errors?.adjustMode ? 'error' : ''}
          value={form.adjustMode || undefined}
          options={ADJUST_MODE_OPTIONS}
          onChange={(adjustMode) => {
            onPatchForm({ adjustMode, percentage: null, fixedAmount: null });
            onClearError?.('adjustMode');
            onClearError?.('percentage');
            onClearError?.('fixedAmount');
          }}
        />
      </FormField>

      {form.adjustMode === 'percentage' && (
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
      )}

      {form.adjustMode === 'fixed' && (
        <FormField
          label="Fixed Amount"
          required
          error={errors?.fixedAmount}
        >
          <InputNumber
            id={fieldId('fixed-amount')}
            className={`${controlClass} assign-company-rates-percentage-input`}
            status={errors?.fixedAmount ? 'error' : ''}
            value={form.fixedAmount}
            min={1}
            onChange={(fixedAmount) => {
              onPatchForm({ fixedAmount: fixedAmount ?? null });
              onClearError?.('fixedAmount');
            }}
          />
        </FormField>
      )}
    </FormGrid>
  );
}