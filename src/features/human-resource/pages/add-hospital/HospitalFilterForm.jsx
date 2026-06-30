'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function HospitalFilterForm({
  filters,
  onPatchFilter,
  onSubmit,
  onClear,
  loading = false,
}) {
  const fieldId = (name) => `hospital-filter-${name}`;

  return (
    <section className="hospital-filter-panel" aria-label="Hospital search filters">
      <div className="walk-in-add-record-layout hospital-search-layout">
        <FormGrid
          as="form"
          columns={4}
          className="walk-in-add-record-form hospital-search-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <FloatingField label="Hospital Name" htmlFor={fieldId('name')}>
            <Input
              id={fieldId('name')}
              className={controlClass}
              value={filters.name}
              allowClear
              onChange={(e) => onPatchFilter({ name: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Abbreviation" htmlFor={fieldId('abbreviation')}>
            <Input
              id={fieldId('abbreviation')}
              className={controlClass}
              value={filters.abbreviation}
              allowClear
              onChange={(e) => onPatchFilter({ abbreviation: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="City" htmlFor={fieldId('city')}>
            <Input
              id={fieldId('city')}
              className={controlClass}
              value={filters.city}
              allowClear
              placeholder="Enter city"
              onChange={(e) => onPatchFilter({ city: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Address" htmlFor={fieldId('address')}>
            <Input
              id={fieldId('address')}
              className={controlClass}
              value={filters.address}
              allowClear
              onChange={(e) => onPatchFilter({ address: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Phone #" htmlFor={fieldId('phone')}>
            <Input
              id={fieldId('phone')}
              className={controlClass}
              value={filters.phone}
              allowClear
              onChange={(e) => onPatchFilter({ phone: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Fax #" htmlFor={fieldId('fax')}>
            <Input
              id={fieldId('fax')}
              className={controlClass}
              value={filters.fax}
              allowClear
              onChange={(e) => onPatchFilter({ fax: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <div className="hospital-search-actions">
            <Button type="link" className="patient-reg-btn-clear" onClick={onClear}>
              Clear
            </Button>
            <Button
              type="default"
              className="hospital-search-btn"
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
