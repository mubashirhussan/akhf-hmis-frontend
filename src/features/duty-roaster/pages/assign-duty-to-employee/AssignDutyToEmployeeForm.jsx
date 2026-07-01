'use client';

import { Checkbox, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  ALTERNATIVE_OPTIONS,
  WEEK_DAY_OPTIONS,
  getAdminDutyDepartments,
  getAdminDutySubDepartments,
  getAssignDutyEmployees,
} from '@/features/duty-roaster/api/mock-assign-duty-to-employee';
import { useGetShiftsQuery } from '@/features/duty-roaster/api/dutyRoasterApi';

const controlClass = FIELD_CONTROL_CLASS;

function parseDate(value) {
  if (!value) return null;
  const parsed = dayjs(value, 'DD/MM/YYYY');
  return parsed.isValid() ? parsed : null;
}

export default function AssignDutyToEmployeeForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
}) {
  const fieldId = (name) => `assign-duty-employee-${name}`;
  const { data: shifts = [] } = useGetShiftsQuery();

  const departmentOptions = getAdminDutyDepartments().map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const employeeSubDepartmentOptions = getAdminDutySubDepartments(form.employeeDepartmentId).map(
    (d) => ({
      value: d.id,
      label: d.name,
    }),
  );

  const dutyRosterSubDepartmentOptions = getAdminDutySubDepartments(
    form.dutyRosterDepartmentId,
  ).map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const shiftOptions = shifts.map((s) => ({
    value: s.id,
    label: s.shiftName,
  }));

  const employeeOptions = getAssignDutyEmployees(
    form.employeeDepartmentId,
    form.employeeSubDepartmentId,
  ).map((employee) => ({
    value: employee.id,
    label: `${employee.name} (${employee.employeeNo})`,
  }));

  return (
    <FormGrid columns={2} className="assign-duty-employee-form-grid">
      <FormField label="Start From" required error={errors?.startFrom}>
        <DatePicker
          id={fieldId('startFrom')}
          className={controlClass}
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          value={parseDate(form.startFrom)}
          status={errors?.startFrom ? 'error' : ''}
          onChange={(date) => {
            onPatchForm({ startFrom: date ? date.format('DD/MM/YYYY') : '' });
            onClearError?.('startFrom');
          }}
        />
      </FormField>

      <FormField label="End Date" required error={errors?.endDate}>
        <DatePicker
          id={fieldId('endDate')}
          className={controlClass}
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          value={parseDate(form.endDate)}
          status={errors?.endDate ? 'error' : ''}
          onChange={(date) => {
            onPatchForm({ endDate: date ? date.format('DD/MM/YYYY') : '' });
            onClearError?.('endDate');
          }}
        />
      </FormField>

      <FormField label="Employees of Department" required error={errors?.employeeDepartmentId}>
        <Select
          id={fieldId('employeeDepartmentId')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.employeeDepartmentId}
          options={departmentOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select department"
          status={errors?.employeeDepartmentId ? 'error' : ''}
          onChange={(val, opt) => {
            onPatchForm({
              employeeDepartmentId: val ?? null,
              employeeDepartmentName: opt?.label ?? '',
              employeeSubDepartmentId: null,
              employeeSubDepartmentName: '',
              employeeIds: [],
            });
            onClearError?.('employeeDepartmentId');
          }}
        />
      </FormField>

      <FormField label="Employee of Sub Department" required error={errors?.employeeSubDepartmentId}>
        <Select
          id={fieldId('employeeSubDepartmentId')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.employeeSubDepartmentId}
          options={employeeSubDepartmentOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select sub department"
          disabled={!form.employeeDepartmentId}
          status={errors?.employeeSubDepartmentId ? 'error' : ''}
          onChange={(val, opt) => {
            onPatchForm({
              employeeSubDepartmentId: val ?? null,
              employeeSubDepartmentName: opt?.label ?? '',
              employeeIds: [],
            });
            onClearError?.('employeeSubDepartmentId');
          }}
        />
      </FormField>

      <FormField label="Duty Roster For Department" required error={errors?.dutyRosterDepartmentId}>
        <Select
          id={fieldId('dutyRosterDepartmentId')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.dutyRosterDepartmentId}
          options={departmentOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select department"
          status={errors?.dutyRosterDepartmentId ? 'error' : ''}
          onChange={(val, opt) => {
            onPatchForm({
              dutyRosterDepartmentId: val ?? null,
              dutyRosterDepartmentName: opt?.label ?? '',
              dutyRosterSubDepartmentId: null,
              dutyRosterSubDepartmentName: '',
            });
            onClearError?.('dutyRosterDepartmentId');
          }}
        />
      </FormField>

      <FormField
        label="Duty Roster For Sub Department"
        required
        error={errors?.dutyRosterSubDepartmentId}
      >
        <Select
          id={fieldId('dutyRosterSubDepartmentId')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.dutyRosterSubDepartmentId}
          options={dutyRosterSubDepartmentOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select sub department"
          disabled={!form.dutyRosterDepartmentId}
          status={errors?.dutyRosterSubDepartmentId ? 'error' : ''}
          onChange={(val, opt) => {
            onPatchForm({
              dutyRosterSubDepartmentId: val ?? null,
              dutyRosterSubDepartmentName: opt?.label ?? '',
            });
            onClearError?.('dutyRosterSubDepartmentId');
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
            onPatchForm({
              shiftId: val ?? null,
              shiftName: opt?.label ?? '',
            });
            onClearError?.('shiftId');
          }}
        />
      </FormField>

      <FormField label="Double Duty">
        <Checkbox
          checked={form.doubleDuty}
          onChange={(e) => onPatchForm({ doubleDuty: e.target.checked })}
        >
          Double Duty
        </Checkbox>
      </FormField>

      <FormField
        label="Employee Name"
        required
        className="form-grid-row"
        error={errors?.employeeIds}
      >
        <Select
          id={fieldId('employeeIds')}
          mode="multiple"
          className={controlClass}
          style={{ width: '100%' }}
          value={form.employeeIds}
          options={employeeOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select employees"
          disabled={!form.employeeSubDepartmentId}
          status={errors?.employeeIds ? 'error' : ''}
          onChange={(vals) => {
            onPatchForm({ employeeIds: vals ?? [] });
            onClearError?.('employeeIds');
          }}
        />
      </FormField>

      <FormField label="Alternative" required error={errors?.alternative}>
        <Select
          id={fieldId('alternative')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.alternative}
          options={ALTERNATIVE_OPTIONS}
          status={errors?.alternative ? 'error' : ''}
          onChange={(val) => {
            onPatchForm({ alternative: val ?? 'week-days' });
            onClearError?.('alternative');
          }}
        />
      </FormField>

      <FormField label="Day of Week" required error={errors?.daysOfWeek}>
        <Select
          id={fieldId('daysOfWeek')}
          mode="multiple"
          className={controlClass}
          style={{ width: '100%' }}
          value={form.daysOfWeek}
          options={WEEK_DAY_OPTIONS}
          placeholder="Select days"
          status={errors?.daysOfWeek ? 'error' : ''}
          onChange={(vals) => {
            onPatchForm({ daysOfWeek: vals ?? [] });
            onClearError?.('daysOfWeek');
          }}
        />
      </FormField>
    </FormGrid>
  );
}
