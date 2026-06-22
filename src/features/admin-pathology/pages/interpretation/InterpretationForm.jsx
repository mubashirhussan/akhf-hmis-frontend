'use client';

import { Input, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { SERVICE_OPTIONS } from '@/features/admin-pathology/api/mock-interpretation';

const controlClass = FIELD_CONTROL_CLASS;

export default function InterpretationForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
}) {
  const fieldId = (name) => `interpretation-${name}`;

  return (
    <FormGrid columns={2} className="interpretation-form-grid">
      <FormField
        label="Service Name"
        required
        error={errors?.serviceName}
      >
        <Select
          id={fieldId('service-name')}
          className={controlClass}
          status={errors?.serviceName ? 'error' : ''}
          value={form.serviceName || undefined}
          options={SERVICE_OPTIONS}
          placeholder="Select service"
          showSearch
          optionFilterProp="label"
          onChange={(serviceName) => {
            onPatchForm({ serviceName });
            onClearError?.('serviceName');
          }}
        />
      </FormField>

      <FormField
        label="Template Name"
        required
        error={errors?.templateName}
      >
        <Input
          id={fieldId('template-name')}
          className={controlClass}
          status={errors?.templateName ? 'error' : ''}
          value={form.templateName}
          onChange={(e) => {
            onPatchForm({ templateName: e.target.value });
            onClearError?.('templateName');
          }}
        />
      </FormField>

      <FormField
        label="Template Description"
        required
        error={errors?.templateDescription}
        className="interpretation-form-field-full"
      >
        <Input.TextArea
          id={fieldId('template-description')}
          className={controlClass}
          status={errors?.templateDescription ? 'error' : ''}
          rows={4}
          value={form.templateDescription}
          onChange={(e) => {
            onPatchForm({ templateDescription: e.target.value });
            onClearError?.('templateDescription');
          }}
        />
      </FormField>
    </FormGrid>
  );
}
