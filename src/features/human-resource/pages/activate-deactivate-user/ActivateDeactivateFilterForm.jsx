'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import {
  DEPARTMENT_FILTER_OPTIONS,
  EMPLOYEE_NAME_OPTIONS,
  HOSPITAL_FILTER_OPTIONS,
  SUB_DEPARTMENT_FILTER_OPTIONS,
} from '@/features/human-resource/api/mock-employee-search';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function ActivateDeactivateFilterForm({
  filters,
  onPatchFilter,
  onSubmit,
  onClear,
  loading = false,
}) {
  const fieldId = (name) => `activate-deactivate-${name}`;

  return (
    <div className="walk-in-add-record-layout activate-deactivate-search-layout">
      <FormGrid
        as="form"
        columns={3}
        className="walk-in-add-record-form activate-deactivate-search-form"
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
            options={HOSPITAL_FILTER_OPTIONS}
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

        <FloatingField label="Sub Department">
          <Select
            aria-label="Sub Department"
            className={controlClass}
            value={filters.subDepartment}
            options={SUB_DEPARTMENT_FILTER_OPTIONS}
            onChange={(subDepartment) => onPatchFilter({ subDepartment })}
          />
        </FloatingField>

        <FloatingField label="Employee No." htmlFor={fieldId('emp-no')}>
          <Input
            id={fieldId('emp-no')}
            className={controlClass}
            value={filters.employeeNo}
            placeholder=""
            allowClear
            onChange={(event) => onPatchFilter({ employeeNo: event.target.value })}
            autoComplete="off"
          />
        </FloatingField>

        <FloatingField label="Employee Name">
          <Select
            aria-label="Employee Name"
            className={controlClass}
            value={filters.employeeName}
            options={EMPLOYEE_NAME_OPTIONS}
            onChange={(employeeName) => onPatchFilter({ employeeName })}
          />
        </FloatingField>

        <div className="activate-deactivate-search-actions">
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