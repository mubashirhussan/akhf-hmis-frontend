'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import {
  DEPARTMENT_FILTER_OPTIONS,
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
        columns={4}
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

        <FloatingField label="Employee Name" htmlFor={fieldId('emp-name')}>
          <Input
            id={fieldId('emp-name')}
            className={controlClass}
            value={filters.employeeName}
            placeholder=""
            allowClear
            onChange={(event) => onPatchFilter({ employeeName: event.target.value })}
            autoComplete="off"
          />
        </FloatingField>

        <FloatingField label="Status">
          <Select
            aria-label="Status"
            className={controlClass}
            value={filters.status}
            options={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            onChange={(status) => onPatchFilter({ status })}
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