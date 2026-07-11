'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  getAdminDutyDepartments,
  getAdminDutySubDepartments,
  getAssignDutyEmployees,
} from '@/features/duty-roaster/api/mock-assign-duty-to-employee';
import { useGetShiftsQuery } from '@/features/duty-roaster/api/dutyRoasterApi';
import {
  ASSIGN_DUTY_INITIAL_VALUES,
  getAssignDutyFields,
} from '@/features/duty-roaster/pages/assign-duty-to-employee/assign-duty-to-employee-fields';

export default function AssignDutyToEmployeeModal({
  open,
  onClose,
  title = 'Assign Duty to Employee',
  form,
  onSave,
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
      getAssignDutyFields({
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
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={720}
      className="assign-duty-employee-modal"
      rootClassName="assign-duty-employee-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="assign-duty-employee-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark
        preserve={false}
        initialValues={ASSIGN_DUTY_INITIAL_VALUES}
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
      >
        <DynamicForm fields={fields} className="assign-duty-employee-form-grid" />
      </Form>
    </AppModal>
  );
}
