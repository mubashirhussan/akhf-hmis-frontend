'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import FloatingField from '@/components/ui/FloatingField';
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

export default function AssignDutyToEmployeeFilterForm({
  filters,
  onPatchFilter,
  onSubmit,
  onClear,
  loading = false,
}) {
  const fieldId = (name) => `assign-duty-employee-filter-${name}`;
  const { data: shifts = [] } = useGetShiftsQuery();

  const departmentOptions = getAdminDutyDepartments().map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const employeeSubDepartmentOptions = getAdminDutySubDepartments(
    filters.employeeDepartmentId,
  ).map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const dutyRosterSubDepartmentOptions = getAdminDutySubDepartments(
    filters.dutyRosterDepartmentId,
  ).map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const shiftOptions = shifts.map((s) => ({
    value: s.id,
    label: s.shiftName,
  }));

  const employeeOptions = getAssignDutyEmployees(
    filters.employeeDepartmentId,
    filters.employeeSubDepartmentId,
  ).map((employee) => ({
    value: employee.id,
    label: `${employee.name} (${employee.employeeNo})`,
  }));

  return (
    <section className="hr-filter-panel" aria-label="Assign duty to employee search filters">
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
          <FloatingField label="Start From" htmlFor={fieldId('startFrom')}>
            <DatePicker
              id={fieldId('startFrom')}
              className={controlClass}
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              allowClear
              value={parseDate(filters.startFrom)}
              onChange={(date) =>
                onPatchFilter({ startFrom: date ? date.format('DD/MM/YYYY') : '' })
              }
            />
          </FloatingField>

          <FloatingField label="End Date" htmlFor={fieldId('endDate')}>
            <DatePicker
              id={fieldId('endDate')}
              className={controlClass}
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              allowClear
              value={parseDate(filters.endDate)}
              onChange={(date) =>
                onPatchFilter({ endDate: date ? date.format('DD/MM/YYYY') : '' })
              }
            />
          </FloatingField>

          <FloatingField label="Employees of Department" htmlFor={fieldId('employeeDepartmentId')}>
            <Select
              id={fieldId('employeeDepartmentId')}
              className={controlClass}
              value={filters.employeeDepartmentId}
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder=""
              options={departmentOptions}
              onChange={(val) =>
                onPatchFilter({
                  employeeDepartmentId: val ?? null,
                  employeeSubDepartmentId: null,
                  employeeIds: [],
                })
              }
            />
          </FloatingField>

          <FloatingField
            label="Employee of Sub Department"
            htmlFor={fieldId('employeeSubDepartmentId')}
          >
            <Select
              id={fieldId('employeeSubDepartmentId')}
              className={controlClass}
              value={filters.employeeSubDepartmentId}
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder=""
              disabled={!filters.employeeDepartmentId}
              options={employeeSubDepartmentOptions}
              onChange={(val) =>
                onPatchFilter({
                  employeeSubDepartmentId: val ?? null,
                  employeeIds: [],
                })
              }
            />
          </FloatingField>

          <FloatingField
            label="Duty Roster For Department"
            htmlFor={fieldId('dutyRosterDepartmentId')}
          >
            <Select
              id={fieldId('dutyRosterDepartmentId')}
              className={controlClass}
              value={filters.dutyRosterDepartmentId}
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder=""
              options={departmentOptions}
              onChange={(val) =>
                onPatchFilter({
                  dutyRosterDepartmentId: val ?? null,
                  dutyRosterSubDepartmentId: null,
                })
              }
            />
          </FloatingField>

          <FloatingField
            label="Duty Roster For Sub Department"
            htmlFor={fieldId('dutyRosterSubDepartmentId')}
          >
            <Select
              id={fieldId('dutyRosterSubDepartmentId')}
              className={controlClass}
              value={filters.dutyRosterSubDepartmentId}
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder=""
              disabled={!filters.dutyRosterDepartmentId}
              options={dutyRosterSubDepartmentOptions}
              onChange={(val) => onPatchFilter({ dutyRosterSubDepartmentId: val ?? null })}
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

          <FloatingField label="Double Duty" htmlFor={fieldId('doubleDuty')}>
            <Select
              id={fieldId('doubleDuty')}
              className={controlClass}
              value={filters.doubleDuty}
              allowClear
              placeholder=""
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' },
              ]}
              onChange={(val) => onPatchFilter({ doubleDuty: val ?? null })}
            />
          </FloatingField>

          <FloatingField label="Employee Name" htmlFor={fieldId('employeeIds')}>
            <Select
              id={fieldId('employeeIds')}
              mode="multiple"
              className={controlClass}
              value={filters.employeeIds}
              options={employeeOptions}
              showSearch
              optionFilterProp="label"
              placeholder=""
              disabled={!filters.employeeSubDepartmentId}
              onChange={(vals) => onPatchFilter({ employeeIds: vals ?? [] })}
            />
          </FloatingField>

          <FloatingField label="Alternative" htmlFor={fieldId('alternative')}>
            <Select
              id={fieldId('alternative')}
              className={controlClass}
              value={filters.alternative}
              allowClear
              placeholder=""
              options={ALTERNATIVE_OPTIONS}
              onChange={(val) => onPatchFilter({ alternative: val ?? null })}
            />
          </FloatingField>

          <FloatingField label="Day of Week" htmlFor={fieldId('daysOfWeek')}>
            <Select
              id={fieldId('daysOfWeek')}
              mode="multiple"
              className={controlClass}
              value={filters.daysOfWeek}
              options={WEEK_DAY_OPTIONS}
              placeholder=""
              onChange={(vals) => onPatchFilter({ daysOfWeek: vals ?? [] })}
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
