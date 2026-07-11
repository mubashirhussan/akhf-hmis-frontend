'use client';

import { useMemo } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import DynamicForm from '@/components/form/DynamicForm';
import {
  getAdminDutyDepartments,
  getAdminDutySubDepartments,
  getAssignDutyEmployees,
} from '@/features/duty-roaster/api/mock-assign-duty-to-employee';
import { useGetShiftsQuery } from '@/features/duty-roaster/api/dutyRoasterApi';
import {
  ASSIGN_DUTY_FILTER_INITIAL_VALUES,
  getAssignDutyFilterFields,
} from '@/features/duty-roaster/pages/assign-duty-to-employee/assign-duty-to-employee-fields';

export default function AssignDutyToEmployeeFilterForm({
  form,
  onSubmit,
  onClear,
  loading = false,
}) {
  const { data: shifts = [] } = useGetShiftsQuery();
  const employeeDepartmentId = Form.useWatch('employeeDepartmentId', form);
  const employeeSubDepartmentId = Form.useWatch('employeeSubDepartmentId', form);
  const dutyRosterDepartmentId = Form.useWatch('dutyRosterDepartmentId', form);

  const departmentOptions = useMemo(
    () => getAdminDutyDepartments().map((d) => ({ value: d.id, label: d.name })),
    [],
  );

  const employeeSubDepartmentOptions = useMemo(
    () =>
      getAdminDutySubDepartments(employeeDepartmentId).map((d) => ({
        value: d.id,
        label: d.name,
      })),
    [employeeDepartmentId],
  );

  const dutyRosterSubDepartmentOptions = useMemo(
    () =>
      getAdminDutySubDepartments(dutyRosterDepartmentId).map((d) => ({
        value: d.id,
        label: d.name,
      })),
    [dutyRosterDepartmentId],
  );

  const shiftOptions = useMemo(
    () => shifts.map((s) => ({ value: s.id, label: s.shiftName })),
    [shifts],
  );

  const employeeOptions = useMemo(
    () =>
      getAssignDutyEmployees(employeeDepartmentId, employeeSubDepartmentId).map(
        (employee) => ({
          value: employee.id,
          label: `${employee.name} (${employee.employeeNo})`,
        }),
      ),
    [employeeDepartmentId, employeeSubDepartmentId],
  );

  const fields = useMemo(
    () =>
      getAssignDutyFilterFields({
        departmentOptions,
        employeeSubDepartmentOptions,
        dutyRosterSubDepartmentOptions,
        shiftOptions,
        employeeOptions,
        hasEmployeeDepartment: Boolean(employeeDepartmentId),
        hasDutyRosterDepartment: Boolean(dutyRosterDepartmentId),
        hasEmployeeSubDepartment: Boolean(employeeSubDepartmentId),
      }),
    [
      departmentOptions,
      employeeSubDepartmentOptions,
      dutyRosterSubDepartmentOptions,
      shiftOptions,
      employeeOptions,
      employeeDepartmentId,
      dutyRosterDepartmentId,
      employeeSubDepartmentId,
    ],
  );

  return (
    <section className="hr-filter-panel" aria-label="Assign duty to employee search filters">
      <div className="walk-in-add-record-layout hr-search-layout">
        <Form
          form={form}
          layout="vertical"
          initialValues={ASSIGN_DUTY_FILTER_INITIAL_VALUES}
          className="walk-in-add-record-form hr-search-form"
          onValuesChange={(changed) => {
            if ('employeeDepartmentId' in changed) {
              form.setFieldsValue({
                employeeSubDepartmentId: undefined,
                employeeIds: [],
              });
            }
            if ('employeeSubDepartmentId' in changed) {
              form.setFieldsValue({ employeeIds: [] });
            }
            if ('dutyRosterDepartmentId' in changed) {
              form.setFieldsValue({ dutyRosterSubDepartmentId: undefined });
            }
          }}
          onFinish={onSubmit}
        >
          <DynamicForm fields={fields} gutter={[16, 12]} />
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
        </Form>
      </div>
    </section>
  );
}
