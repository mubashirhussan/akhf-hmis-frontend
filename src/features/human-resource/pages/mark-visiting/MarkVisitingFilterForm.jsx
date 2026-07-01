'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function MarkVisitingFilterForm({
  filters,
  onPatchFilter,
  onSubmit,
  onClear,
  loading = false,
}) {
  const fieldId = (name) => `mark-visiting-filter-${name}`;

  return (
    <section className="hr-filter-panel" aria-label="Mark visiting search filters">
      <div className="walk-in-add-record-layout mark-visiting-search-layout">
        <FormGrid
          as="form"
          columns={3}
          className="walk-in-add-record-form mark-visiting-search-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
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

          <div className="mark-visiting-search-actions">
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