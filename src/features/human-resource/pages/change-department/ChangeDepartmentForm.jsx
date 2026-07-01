'use client';

import { Input, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import {
  DEPARTMENT_FILTER_OPTIONS,
  DESIGNATION_FILTER_OPTIONS,
  SUB_DEPARTMENT_FILTER_OPTIONS,
} from '@/features/human-resource/api/mock-employee-search';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

const SHIFT_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
];

export default function ChangeDepartmentForm({ form, errors = {}, onPatchForm, onClearError }) {
  const fieldId = (name) => `change-dept-${name}`;

  return (
    <FormGrid columns={2} className="change-department-form-grid">
      <FormField label="Department" required error={errors?.department}>
        <Select
          id={fieldId('department')}
          className={controlClass}
          value={form.department || undefined}
          options={DEPARTMENT_FILTER_OPTIONS.filter((o) => o.value !== 'All')}
          status={errors?.department ? 'error' : ''}
          onChange={(val) => {
            onPatchForm({ department: val });
            onClearError?.('department');
          }}
        />
      </FormField>

      <FormField label="Sub Department" required error={errors?.subDepartment}>
        <Select
          id={fieldId('subDepartment')}
          className={controlClass}
          value={form.subDepartment || undefined}
          options={SUB_DEPARTMENT_FILTER_OPTIONS.filter((o) => o.value !== 'All')}
          status={errors?.subDepartment ? 'error' : ''}
          onChange={(val) => {
            onPatchForm({ subDepartment: val });
            onClearError?.('subDepartment');
          }}
        />
      </FormField>

      <FormField label="Designation Name" required error={errors?.designation}>
        <Select
          id={fieldId('designation')}
          className={controlClass}
          value={form.designation || undefined}
          options={DESIGNATION_FILTER_OPTIONS.filter((o) => o.value !== 'All')}
          status={errors?.designation ? 'error' : ''}
          onChange={(val) => {
            onPatchForm({ designation: val });
            onClearError?.('designation');
          }}
        />
      </FormField>

      <FormField label="Shift Name" required error={errors?.shift}>
        <Select
          id={fieldId('shift')}
          className={controlClass}
          value={form.shift || undefined}
          options={SHIFT_OPTIONS}
          status={errors?.shift ? 'error' : ''}
          onChange={(val) => {
            onPatchForm({ shift: val });
            onClearError?.('shift');
          }}
        />
      </FormField>

      <FormField
        label="Reason"
        required
        error={errors?.reason}
        className="change-department-form-field-full"
      >
        <Input.TextArea
          id={fieldId('reason')}
          className={controlClass}
          rows={3}
          value={form.reason}
          status={errors?.reason ? 'error' : ''}
          onChange={(e) => {
            onPatchForm({ reason: e.target.value });
            onClearError?.('reason');
          }}
        />
      </FormField>
    </FormGrid>
  );
}