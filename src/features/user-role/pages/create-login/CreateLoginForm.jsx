'use client';

import { Input, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  getCreateLoginDepartments,
  getCreateLoginEmployees,
  getCreateLoginSubDepartments,
  MAIN_PAGE_OPTIONS,
} from '@/features/user-role/api/mock-create-login';

const controlClass = FIELD_CONTROL_CLASS;

const BRANCH_ACCESS_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

export default function CreateLoginForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
}) {
  const fieldId = (name) => `create-login-${name}`;

  const departmentOptions = getCreateLoginDepartments().map((department) => ({
    value: department.id,
    label: department.name,
  }));

  const subDepartmentOptions = getCreateLoginSubDepartments(form.departmentId).map(
    (subDepartment) => ({
      value: subDepartment.id,
      label: subDepartment.name,
    }),
  );

  const employeeOptions = getCreateLoginEmployees(
    form.departmentId,
    form.subDepartmentId,
  ).map((employee) => ({
    value: employee.id,
    label: employee.name,
  }));

  return (
    <FormGrid columns={4} className="create-login-form-grid">
      <FormField label="Department" required error={errors?.departmentId}>
        <Select
          id={fieldId('department')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.departmentId || undefined}
          options={departmentOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select department"
          status={errors?.departmentId ? 'error' : ''}
          onChange={(value, option) => {
            onPatchForm({
              departmentId: value ?? null,
              departmentName: option?.label ?? '',
              subDepartmentId: null,
              subDepartmentName: '',
              employeeId: null,
              employeeName: '',
            });
            onClearError?.('departmentId');
          }}
        />
      </FormField>

      <FormField label="Sub Department" required error={errors?.subDepartmentId}>
        <Select
          id={fieldId('sub-department')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.subDepartmentId || undefined}
          options={subDepartmentOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select sub department"
          disabled={!form.departmentId}
          status={errors?.subDepartmentId ? 'error' : ''}
          onChange={(value, option) => {
            onPatchForm({
              subDepartmentId: value ?? null,
              subDepartmentName: option?.label ?? '',
              employeeId: null,
              employeeName: '',
            });
            onClearError?.('subDepartmentId');
          }}
        />
      </FormField>

      <FormField label="Employee" required error={errors?.employeeId}>
        <Select
          id={fieldId('employee')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.employeeId || undefined}
          options={employeeOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select employee"
          disabled={!form.subDepartmentId}
          status={errors?.employeeId ? 'error' : ''}
          onChange={(value, option) => {
            onPatchForm({
              employeeId: value ?? null,
              employeeName: option?.label ?? '',
            });
            onClearError?.('employeeId');
          }}
        />
      </FormField>

      <FormField label="Select Main page" required error={errors?.mainPage}>
        <Select
          id={fieldId('main-page')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.mainPage || undefined}
          options={MAIN_PAGE_OPTIONS}
          showSearch
          optionFilterProp="label"
          placeholder="Select main page"
          status={errors?.mainPage ? 'error' : ''}
          onChange={(value) => {
            onPatchForm({ mainPage: value ?? null });
            onClearError?.('mainPage');
          }}
        />
      </FormField>

      <FormField label="Branch Access">
        <Select
          id={fieldId('branch-access')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.branchAccess}
          options={BRANCH_ACCESS_OPTIONS}
          onChange={(value) => onPatchForm({ branchAccess: value })}
        />
      </FormField>

      <FormField label="User name" required error={errors?.userName}>
        <Input
          id={fieldId('user-name')}
          className={controlClass}
          value={form.userName}
          autoComplete="off"
          status={errors?.userName ? 'error' : ''}
          onChange={(event) => {
            onPatchForm({ userName: event.target.value });
            onClearError?.('userName');
          }}
        />
      </FormField>

      <FormField label="Create a password" required error={errors?.password}>
        <Input.Password
          id={fieldId('password')}
          className={controlClass}
          value={form.password}
          autoComplete="new-password"
          status={errors?.password ? 'error' : ''}
          onChange={(event) => {
            onPatchForm({ password: event.target.value });
            onClearError?.('password');
          }}
        />
      </FormField>

      <FormField label="Confirm your password" required error={errors?.confirmPassword}>
        <Input.Password
          id={fieldId('confirm-password')}
          className={controlClass}
          value={form.confirmPassword}
          autoComplete="new-password"
          status={errors?.confirmPassword ? 'error' : ''}
          onChange={(event) => {
            onPatchForm({ confirmPassword: event.target.value });
            onClearError?.('confirmPassword');
          }}
        />
      </FormField>
    </FormGrid>
  );
}
