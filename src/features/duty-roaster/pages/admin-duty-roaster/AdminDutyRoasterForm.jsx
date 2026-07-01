'use client';

import { InputNumber, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import FormField from '@/components/ui/FormField';
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

export default function AdminDutyRoasterForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
}) {
  const fieldId = (name) => `admin-duty-roaster-${name}`;
  const { data: shifts = [] } = useGetShiftsQuery();

  const departmentOptions = getAdminDutyDepartments().map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const subDepartmentOptions = getAdminDutySubDepartments(form.departmentId).map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const shiftOptions = shifts.map((s) => ({
    value: s.id,
    label: s.shiftName,
  }));

  return (
    <FormGrid columns={1} className="admin-duty-roaster-form-grid">
      <FormField label="Department Name" required error={errors?.departmentId}>
        <Select
          id={fieldId('departmentId')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.departmentId}
          options={departmentOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select department"
          status={errors?.departmentId ? 'error' : ''}
          onChange={(val, opt) => {
            onPatchForm({
              departmentId: val ?? null,
              departmentName: opt?.label ?? '',
              subDepartmentId: null,
              subDepartmentName: '',
            });
            onClearError?.('departmentId');
          }}
        />
      </FormField>

      <FormField label="Sub Department Name" required error={errors?.subDepartmentId}>
        <Select
          id={fieldId('subDepartmentId')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.subDepartmentId}
          options={subDepartmentOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select sub department"
          disabled={!form.departmentId}
          status={errors?.subDepartmentId ? 'error' : ''}
          onChange={(val, opt) => {
            onPatchForm({
              subDepartmentId: val ?? null,
              subDepartmentName: opt?.label ?? '',
            });
            onClearError?.('subDepartmentId');
          }}
        />
      </FormField>

      <FormField label="Shift Name" required error={errors?.shiftId}>
        <Select
          id={fieldId('shiftId')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.shiftId}
          options={shiftOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select shift"
          status={errors?.shiftId ? 'error' : ''}
          onChange={(val, opt) => {
            const shift = shifts.find((s) => s.id === val);
            onPatchForm({
              shiftId: val ?? null,
              shiftName: opt?.label ?? '',
              startTime: shift?.startTime ?? form.startTime,
            });
            onClearError?.('shiftId');
          }}
        />
      </FormField>

      <FormField label="Start Time" required error={errors?.startTime}>
        <TimePicker
          id={fieldId('startTime')}
          className={controlClass}
          style={{ width: '100%' }}
          use12Hours
          format="h:mm A"
          value={parseTime(form.startTime)}
          status={errors?.startTime ? 'error' : ''}
          onChange={(time) => {
            onPatchForm({ startTime: time ? time.format('HH:mm') : '' });
            onClearError?.('startTime');
          }}
        />
      </FormField>

      <FormField
        label="Duration Time"
        required
        error={errors?.durationHours || errors?.durationMinutes}
      >
        <div className="admin-duty-duration-row">
          <div className="admin-duty-duration-field">
            <InputNumber
              id={fieldId('durationHours')}
              className={controlClass}
              min={0}
              max={23}
              precision={0}
              value={form.durationHours}
              status={errors?.durationHours ? 'error' : ''}
              onChange={(val) => {
                onPatchForm({ durationHours: val ?? 0 });
                onClearError?.('durationHours');
              }}
            />
            <span className="admin-duty-duration-label">hr.</span>
          </div>
          <div className="admin-duty-duration-field">
            <InputNumber
              id={fieldId('durationMinutes')}
              className={controlClass}
              min={0}
              max={59}
              precision={0}
              value={form.durationMinutes}
              status={errors?.durationMinutes ? 'error' : ''}
              onChange={(val) => {
                onPatchForm({ durationMinutes: val ?? 0 });
                onClearError?.('durationMinutes');
              }}
            />
            <span className="admin-duty-duration-label">min</span>
          </div>
        </div>
      </FormField>
    </FormGrid>
  );
}
