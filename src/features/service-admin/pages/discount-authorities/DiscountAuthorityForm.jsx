'use client';

import { Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function DiscountAuthorityForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
  employeeOptions = [],
}) {
  const fieldId = (name) => `discount-authority-${name}`;

  return (
    <FormGrid columns={1} className="discount-authority-form-grid">
      <FormField label="Employee" required error={errors?.employeeId}>
        <Select
          id={fieldId('employee')}
          className={controlClass}
          status={errors?.employeeId ? 'error' : ''}
          value={form.employeeId || undefined}
          options={employeeOptions}
          showSearch
          optionFilterProp="label"
          onChange={(employeeId) => {
            onPatchForm({ employeeId });
            onClearError?.('employeeId');
          }}
        />
      </FormField>
    </FormGrid>
  );
}
