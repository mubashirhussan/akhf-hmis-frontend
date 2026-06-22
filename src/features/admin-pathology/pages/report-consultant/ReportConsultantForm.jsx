'use client';

import { Input } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

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
        <Input
          id={fieldId('doctor-name')}
          className={controlClass}
          status={errors?.doctorName ? 'error' : ''}
          value={form.doctorName}
          onChange={(e) => {
            onPatchForm({ doctorName: e.target.value });
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
