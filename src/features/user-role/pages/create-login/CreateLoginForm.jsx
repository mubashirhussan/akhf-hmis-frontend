'use client';

import { useMemo } from 'react';
import { Form } from 'antd';
import DynamicForm from '@/components/form/DynamicForm';
import {
  getCreateLoginDepartments,
  getCreateLoginEmployees,
  getCreateLoginSubDepartments,
} from '@/features/user-role/api/mock-create-login';
import { getCreateLoginFields } from '@/features/user-role/pages/create-login/create-login-fields';

export default function CreateLoginForm({ form }) {
  const departmentId = Form.useWatch('departmentId', form);
  const subDepartmentId = Form.useWatch('subDepartmentId', form);

  const departmentOptions = useMemo(
    () =>
      getCreateLoginDepartments().map((department) => ({
        value: department.id,
        label: department.name,
      })),
    [],
  );

  const subDepartmentOptions = useMemo(
    () =>
      getCreateLoginSubDepartments(departmentId).map((subDepartment) => ({
        value: subDepartment.id,
        label: subDepartment.name,
      })),
    [departmentId],
  );

  const employeeOptions = useMemo(
    () =>
      getCreateLoginEmployees(departmentId, subDepartmentId).map((employee) => ({
        value: employee.id,
        label: employee.name,
      })),
    [departmentId, subDepartmentId],
  );

  const fields = useMemo(
    () =>
      getCreateLoginFields({
        departmentOptions,
        subDepartmentOptions,
        employeeOptions,
        hasDepartment: Boolean(departmentId),
        hasSubDepartment: Boolean(subDepartmentId),
      }),
    [
      departmentOptions,
      subDepartmentOptions,
      employeeOptions,
      departmentId,
      subDepartmentId,
    ],
  );

  return <DynamicForm fields={fields} className="create-login-form-grid" />;
}
