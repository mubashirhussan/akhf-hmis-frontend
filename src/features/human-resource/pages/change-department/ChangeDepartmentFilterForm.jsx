'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import {
  DEPARTMENT_FILTER_OPTIONS,
  DESIGNATION_FILTER_OPTIONS,
  HOSPITAL_FILTER_OPTIONS,
} from '@/features/human-resource/api/mock-employee-search';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function ChangeDepartmentFilterForm({
  filters,
  onPatchFilter,
  onSubmit,
  onClear,
  loading = false,
}) {
  const fieldId = (name) => `change-department-filter-${name}`;

  return (
    <section className="hr-filter-panel" aria-label="Change department search filters">
      <div className="walk-in-add-record-layout change-department-search-layout">
        <FormGrid
          as="form"
          columns={3}
          className="walk-in-add-record-form change-department-search-form"
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
              onChange={(val) => onPatchFilter({ hospital: val })}
            />
          </FloatingField>

          <FloatingField label="Department">
            <Select
              aria-label="Department"
              className={controlClass}
              value={filters.department}
              options={DEPARTMENT_FILTER_OPTIONS}
              onChange={(val) => onPatchFilter({ department: val })}
            />
          </FloatingField>

          <FloatingField label="Designation">
            <Select
              aria-label="Designation"
              className={controlClass}
              value={filters.designation}
              options={DESIGNATION_FILTER_OPTIONS}
              onChange={(val) => onPatchFilter({ designation: val })}
            />
          </FloatingField>

          <FloatingField label="Employee Name" htmlFor={fieldId('emp-name')}>
            <Input
              id={fieldId('emp-name')}
              className={controlClass}
              value={filters.employeeName}
              allowClear
              onChange={(e) => onPatchFilter({ employeeName: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="CNIC #" htmlFor={fieldId('cnic')}>
            <Input
              id={fieldId('cnic')}
              className={controlClass}
              value={filters.cnicNo}
              allowClear
              onChange={(e) => onPatchFilter({ cnicNo: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Emp No" htmlFor={fieldId('emp-no')}>
            <Input
              id={fieldId('emp-no')}
              className={controlClass}
              value={filters.employeeNo}
              allowClear
              onChange={(e) => onPatchFilter({ employeeNo: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <div className="change-department-search-actions">
            <Button type="link" className="patient-reg-btn-clear" onClick={onClear}>
              Clear
            </Button>
            <Button
              type="default"
              className="hr-search-btn"
              icon={<SearchOutlined />}
              htmlType="submit"
              loading={loading}
            >
              Search
            </Button>
          </div>
        </FormGrid>
      </div>
    </section>
  );
}