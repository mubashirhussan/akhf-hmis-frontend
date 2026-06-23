'use client';

import { Input, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { DOCTOR_OPTIONS } from '@/features/admin-pathology/api/mock-report-consultant';

const controlClass = FIELD_CONTROL_CLASS;

export default function ReportConsultantForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
}) {
  const fieldId = (name) => `report-consultant-${name}`;

  return (
    <FormGrid columns={1} className="report-consultant-form-grid">
      <FormField
        label="Doctor Name"
        required
        error={errors?.doctorName}
      >
        <Select
          id={fieldId('doctor-name')}
          className={controlClass}
          status={errors?.doctorName ? 'error' : ''}
          value={form.doctorName || undefined}
          options={DOCTOR_OPTIONS}
          placeholder="Select doctor"
          showSearch
          optionFilterProp="label"
          onChange={(doctorName) => {
            const selectedDoctor = DOCTOR_OPTIONS.find(
              (option) => option.value === doctorName,
            );

            onPatchForm({
              doctorName,
              doctorQualification: selectedDoctor?.doctorQualification ?? '',
              doctorDesignation: selectedDoctor?.doctorDesignation ?? '',
            });
            onClearError?.('doctorName');
          }}
        />
      </FormField>

    

      <FormField
        label="Doctor Designation"
        required
        error={errors?.doctorDesignation}
      >
        <Input
          id={fieldId('doctor-designation')}
          className={controlClass}
          status={errors?.doctorDesignation ? 'error' : ''}
          value={form.doctorDesignation}
          onChange={(e) => {
            onPatchForm({ doctorDesignation: e.target.value });
            onClearError?.('doctorDesignation');
          }}
        />
      </FormField>
        <FormField
        label="Doctor Qualification"
        required
        error={errors?.doctorQualification}
      >
        <Input.TextArea
          id={fieldId('doctor-qualification')}
          className={controlClass}
          status={errors?.doctorQualification ? 'error' : ''}
          rows={3}
          value={form.doctorQualification}
          onChange={(e) => {
            onPatchForm({ doctorQualification: e.target.value });
            onClearError?.('doctorQualification');
          }}
        />
      </FormField>
    </FormGrid>
  );
}
