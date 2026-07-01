'use client';

import { Input, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { getEmployeeDisplayName } from '@/features/human-resource/api/mock-employees';

const controlClass = FIELD_CONTROL_CLASS;

const COUNTER_TYPE_OPTIONS = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'pharmacy', label: 'Pharmacy' },
];

export default function MarkVisitingForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
  employees = [],
  isEdit = false,
}) {
  const fieldId = (name) => `mark-visiting-${name}`;

  const handleEmployeeIdChange = (val) => {
    onPatchForm({ employeeId: val });
    onClearError?.('employeeId');
    const found = employees.find((e) => e.empId === val || e.id === val);
    onPatchForm({ employeeName: found ? getEmployeeDisplayName(found) : '' });
  };

  return (
    <FormGrid columns={1} className="mark-visiting-form-grid">
      <FormField label="Employee ID" required error={errors?.employeeId}>
        <Select
          id={fieldId('employee-id')}
          className={controlClass}
          showSearch
          optionFilterProp="label"
          value={form.employeeId || undefined}
          status={errors?.employeeId ? 'error' : ''}
          disabled={isEdit}
          options={employees.map((e) => ({
            value: e.empId ?? e.id,
            label: `${e.empId ?? e.id} — ${getEmployeeDisplayName(e)}`,
          }))}
          onChange={handleEmployeeIdChange}
          placeholder=""
        />
      </FormField>

      <FormField label="Employee Name">
        <Input
          id={fieldId('employee-name')}
          className={controlClass}
          value={form.employeeName}
          disabled
        />
      </FormField>

      <FormField label="Counter Type" required error={errors?.counterType}>
        <Select
          id={fieldId('counter-type')}
          className={controlClass}
          value={form.counterType || undefined}
          options={COUNTER_TYPE_OPTIONS}
          status={errors?.counterType ? 'error' : ''}
          onChange={(val) => {
            onPatchForm({ counterType: val });
            onClearError?.('counterType');
          }}
        />
      </FormField>
    </FormGrid>
  );
}