'use client';

import { Select } from 'antd';
import { Form, Input } from 'antd';
import FormGrid from '@/components/ui/FormGrid';
import FormFloatingField from '@/components/ui/FormFloatingField';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

const LANGUAGE_PROFICIENCY_OPTIONS = [
  { label: 'High Proficiency', value: 'high_proficiency' },
  { label: 'Medium Proficiency', value: 'medium_proficiency' },
  { label: 'Low Proficiency', value: 'low_proficiency' },
];

export default function EmployeeAdditionalInfoTab() {
  return (
    <div className="employee-entry-list-tab">
      <div className="employee-entry-list-row">
        <div className="employee-entry-list-row-header">
          <span className="employee-entry-list-row-title">Record</span>
        </div>

        <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
          <FormFloatingField
            name={['additionalInfos', 0, 'languageEnglish']}
            label="Language (English)"
          >
            <Select
              className={controlClass}
              options={LANGUAGE_PROFICIENCY_OPTIONS}
              allowClear
            />
          </FormFloatingField>
        </FormGrid>

        <FormGrid columns={2} className="patient-reg-section-grid employee-entry-section-grid employee-additional-info-grid">
          <FormFloatingField
            name={['additionalInfos', 0, 'objective']}
            label="Objective"
          >
            <Input.TextArea className={controlClass} rows={3} />
          </FormFloatingField>

          <FormFloatingField
            name={['additionalInfos', 0, 'strengths']}
            label="Strengths"
          >
            <Input.TextArea className={controlClass} rows={3} />
          </FormFloatingField>

          <FormFloatingField
            name={['additionalInfos', 0, 'awards']}
            label="Awards"
          >
            <Input.TextArea className={controlClass} rows={3} />
          </FormFloatingField>

          <FormFloatingField
            name={['additionalInfos', 0, 'hobbies']}
            label="Hobbies"
          >
            <Input.TextArea className={controlClass} rows={3} />
          </FormFloatingField>
        </FormGrid>
      </div>
    </div>
  );
}