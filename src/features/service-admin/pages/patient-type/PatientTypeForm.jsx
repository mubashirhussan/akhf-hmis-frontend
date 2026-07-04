'use client';

import { Input, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  B2B_LABS_OPTIONS,
  ACTIVE_STATUS_OPTIONS,
} from '@/features/service-admin/api/mock-service-admin';

const controlClass = FIELD_CONTROL_CLASS;

export default function PatientTypeForm({
  form,
  errors = {},
  isEdit = false,
  onPatchForm,
  onClearError,
}) {
  const fieldId = (name) => `patient-type-${name}`;

  return (
    <FormGrid columns={1} className="patient-type-form-grid">
      <FormField label="Patient Type" required error={errors?.patientType}>
        <Input
          id={fieldId('name')}
          className={controlClass}
          status={errors?.patientType ? 'error' : ''}
          value={form.patientType}
          onChange={(e) => {
            onPatchForm({ patientType: e.target.value });
            onClearError?.('patientType');
          }}
        />
      </FormField>

      <FormField label="B2B LABS" required error={errors?.b2bLabs}>
        <Select
          id={fieldId('b2b-labs')}
          className={controlClass}
          status={errors?.b2bLabs ? 'error' : ''}
          value={form.b2bLabs || undefined}
          options={B2B_LABS_OPTIONS}
          placeholder="Select"
          onChange={(val) => {
            onPatchForm({ b2bLabs: val });
            onClearError?.('b2bLabs');
          }}
        />
      </FormField>

      {isEdit ? (
        <FormField label="Status" required error={errors?.status}>
          <Select
            id={fieldId('status')}
            className={controlClass}
            status={errors?.status ? 'error' : ''}
            value={form.status || undefined}
            options={ACTIVE_STATUS_OPTIONS}
            placeholder="Select"
            onChange={(val) => {
              onPatchForm({ status: val });
              onClearError?.('status');
            }}
          />
        </FormField>
      ) : null}
    </FormGrid>
  );
}