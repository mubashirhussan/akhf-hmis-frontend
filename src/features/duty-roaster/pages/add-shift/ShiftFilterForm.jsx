'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { RELAXATION_TIME_OPTIONS } from '@/features/duty-roaster/api/mock-shifts';

const controlClass = FIELD_CONTROL_CLASS;

function parseTime(value) {
  if (!value) return null;
  const parsed = dayjs(value, 'HH:mm');
  return parsed.isValid() ? parsed : null;
}

export default function ShiftFilterForm({
  filters,
  onPatchFilter,
  onSubmit,
  onClear,
  loading = false,
}) {
  const fieldId = (name) => `shift-filter-${name}`;

  return (
    <section className="hr-filter-panel" aria-label="Shift search filters">
      <div className="walk-in-add-record-layout hr-search-layout">
        <FormGrid
          as="form"
          columns={4}
          className="walk-in-add-record-form hr-search-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <FloatingField label="Shift Name" htmlFor={fieldId('shiftName')}>
            <Input
              id={fieldId('shiftName')}
              className={controlClass}
              value={filters.shiftName}
              allowClear
              onChange={(e) => onPatchFilter({ shiftName: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Shift Description" htmlFor={fieldId('shiftDescription')}>
            <Input
              id={fieldId('shiftDescription')}
              className={controlClass}
              value={filters.shiftDescription}
              allowClear
              onChange={(e) => onPatchFilter({ shiftDescription: e.target.value })}
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

          <FloatingField label="Start Time" htmlFor={fieldId('startTime')}>
            <TimePicker
              id={fieldId('startTime')}
              className={controlClass}
              style={{ width: '100%' }}
              use12Hours
              format="h:mm A"
              allowClear
              value={parseTime(filters.startTime)}
              onChange={(time) =>
                onPatchFilter({ startTime: time ? time.format('HH:mm') : '' })
              }
            />
          </FloatingField>

          <FloatingField label="End Time" htmlFor={fieldId('endTime')}>
            <TimePicker
              id={fieldId('endTime')}
              className={controlClass}
              style={{ width: '100%' }}
              use12Hours
              format="h:mm A"
              allowClear
              value={parseTime(filters.endTime)}
              onChange={(time) =>
                onPatchFilter({ endTime: time ? time.format('HH:mm') : '' })
              }
            />
          </FloatingField>

          <FloatingField label="Time Relaxation" htmlFor={fieldId('relaxationTime')}>
            <Select
              id={fieldId('relaxationTime')}
              className={controlClass}
              value={filters.relaxationTime}
              allowClear
              placeholder=""
              options={RELAXATION_TIME_OPTIONS}
              onChange={(val) => onPatchFilter({ relaxationTime: val ?? null })}
            />
          </FloatingField>

          <div className="hr-search-actions">
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
