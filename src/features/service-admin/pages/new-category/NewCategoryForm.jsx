'use client';

import { Input } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function NewCategoryForm({ form, errors = {}, onPatchForm, onClearError }) {
  const fieldId = (name) => `new-category-${name}`;

  return (
    <FormGrid columns={1} className="new-category-form-grid">
      <FormField label="Service Category" required error={errors?.serviceName}>
        <Input
          id={fieldId('service-name')}
          className={controlClass}
          status={errors?.serviceName ? 'error' : ''}
          value={form.serviceName}
          onChange={(e) => {
            onPatchForm({ serviceName: e.target.value });
            onClearError?.('serviceName');
          }}
        />
      </FormField>
    </FormGrid>
  );
}
