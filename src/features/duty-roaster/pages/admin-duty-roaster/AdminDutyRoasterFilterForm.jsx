'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, InputNumber, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  getAdminDutyDepartments,
  getAdminDutySubDepartments,
} from '@/features/duty-roaster/api/mock-admin-duty-roaster';
import { useGetShiftsQuery } from '@/features/duty-roaster/api/dutyRoasterApi';

const controlClass = FIELD_CONTROL_CLASS;

function parseTime(value) {
  if (!value) return null;
  const parsed = dayjs(value, 'HH:mm');
  return parsed.isValid() ? parsed : null;
}

export default function AdminDutyRoasterFilterForm({
  filters,
  onPatchFilter,
  onSubmit,
  onClear,
  loading = false,
}) {
  const fieldId = (name) => `admin-duty-roaster-filter-${name}`;
  const { data: shifts = [] } = useGetShiftsQuery();

  const departmentOptions = getAdminDutyDepartments().map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const subDepartmentOptions = getAdminDutySubDepartments(filters.departmentId).map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const shiftOptions = shifts.map((s) => ({
    value: s.id,
    label: s.shiftName,
  }));

  return (
    <section className="hr-filter-panel" aria-label="Admin duty roaster search filters">
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
          <FloatingField label="Department Name" htmlFor={fieldId('departmentId')}>
            <Select
              id={fieldId('departmentId')}
              className={controlClass}
              value={filters.departmentId}
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder=""
              options={departmentOptions}
              onChange={(val) =>
                onPatchFilter({
                  departmentId: val ?? null,
                  subDepartmentId: null,
                })
              }
            />
          </FloatingField>

          <FloatingField label="Sub Department Name" htmlFor={fieldId('subDepartmentId')}>
            <Select
              id={fieldId('subDepartmentId')}
              className={controlClass}
              value={filters.subDepartmentId}
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder=""
              disabled={!filters.departmentId}
              options={subDepartmentOptions}
              onChange={(val) => onPatchFilter({ subDepartmentId: val ?? null })}
            />
          </FloatingField>

          <FloatingField label="Shift Name" htmlFor={fieldId('shiftId')}>
            <Select
              id={fieldId('shiftId')}
              className={controlClass}
              value={filters.shiftId}
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder=""
              options={shiftOptions}
              onChange={(val) => onPatchFilter({ shiftId: val ?? null })}
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

          <FloatingField label="Duration (hr.)" htmlFor={fieldId('durationHours')}>
            <InputNumber
              id={fieldId('durationHours')}
              className={controlClass}
              style={{ width: '100%' }}
              min={0}
              max={23}
              precision={0}
              value={filters.durationHours}
              onChange={(val) => onPatchFilter({ durationHours: val ?? null })}
            />
          </FloatingField>

          <FloatingField label="Duration (min)" htmlFor={fieldId('durationMinutes')}>
            <InputNumber
              id={fieldId('durationMinutes')}
              className={controlClass}
              style={{ width: '100%' }}
              min={0}
              max={59}
              precision={0}
              value={filters.durationMinutes}
              onChange={(val) => onPatchFilter({ durationMinutes: val ?? null })}
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
