'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import {
  DEPARTMENT_FILTER_OPTIONS,
  DESIGNATION_FILTER_OPTIONS,
  EMPLOYEE_STATUS_FILTER_OPTIONS,
  EMPLOYEE_TYPE_FILTER_OPTIONS,
  HOSPITAL_FILTER_OPTIONS,
} from '@/features/human-resource/api/mock-employee-search';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function EmployeeSearchFilterForm({
  filters,
  onPatchFilter,
  onSubmit,
  onClear,
  loading = false,
}) {
  const fieldId = (name) => `employee-search-${name}`;

  return (
    <div className="walk-in-add-record-layout employee-search-layout">
      <FormGrid
        as="form"
        columns={4}
        className="walk-in-add-record-form employee-search-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <FloatingField label="Hospital">
          <Select
            aria-label="Hospital"
            className={controlClass}
            value={filters.hospital}
            options={HOSPITAL_FILTER_OPTIONS.filter((option) => option.value !== 'all')}
            onChange={(hospital) => onPatchFilter({ hospital })}
          />
        </FloatingField>

        <FloatingField label="Department">
          <Select
            aria-label="Department"
            className={controlClass}
            value={filters.department}
            options={DEPARTMENT_FILTER_OPTIONS}
            onChange={(department) => onPatchFilter({ department })}
          />
        </FloatingField>

        <FloatingField label="Employee" htmlFor={fieldId('employee')}>
          <Input
            id={fieldId('employee')}
            className={controlClass}
            value={filters.employeeQuery}
            placeholder="Filter by name, emp no, emp id or CNIC"
            allowClear
            onChange={(event) => onPatchFilter({ employeeQuery: event.target.value })}
            autoComplete="off"
          />
        </FloatingField>

        <FloatingField label="Designation">
          <Select
            aria-label="Designation"
            className={controlClass}
            value={filters.designation}
            options={DESIGNATION_FILTER_OPTIONS}
            onChange={(designation) => onPatchFilter({ designation })}
          />
        </FloatingField>

        <FloatingField label="Employee Type">
          <Select
            aria-label="Employee Type"
            className={controlClass}
            value={filters.employeeType}
            options={EMPLOYEE_TYPE_FILTER_OPTIONS}
            onChange={(employeeType) => onPatchFilter({ employeeType })}
          />
        </FloatingField>

        <FloatingField label="Employee Status">
          <Select
            aria-label="Employee Status"
            className={controlClass}
            value={filters.status}
            options={EMPLOYEE_STATUS_FILTER_OPTIONS}
            onChange={(status) => onPatchFilter({ status })}
          />
        </FloatingField>

        <div className="employee-search-actions">
          <Button type="link" className="patient-reg-btn-clear" onClick={onClear}>
            Clear
          </Button>
          <Button
            type="primary"
            className="patient-reg-btn-save"
            icon={<SearchOutlined />}
            htmlType="submit"
            loading={loading}
          >
            Search
          </Button>
        </div>
      </FormGrid>
    </div>
  );
}
