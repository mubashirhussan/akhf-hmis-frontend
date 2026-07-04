'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Select, Tag } from 'antd';
import DataTable from '@/components/ui/DataTable';
import {
  createEmptyCreateLoginForm,
  getCreateLoginEmployees,
  MAIN_PAGE_OPTIONS,
} from '@/features/user-role/api/mock-create-login';
import {
  useCreateUserLoginMutation,
  useGetUserLoginsQuery,
} from '@/features/user-role/api/userRoleApi';
import CreateLoginForm from './CreateLoginForm';
import './create-login.css';

export default function CreateLoginPage() {
  const { message } = App.useApp();
  const [form, setForm] = useState(createEmptyCreateLoginForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [employeeFilter, setEmployeeFilter] = useState(undefined);
  const { data: rows = [], isLoading } = useGetUserLoginsQuery();
  const [createUserLogin, { isLoading: isSaving }] = useCreateUserLoginMutation();

  const patchForm = useCallback((patch) => {
    setForm((current) => ({ ...current, ...patch }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    const errors = {};

    if (!form.departmentId) errors.departmentId = 'Department is required.';
    if (!form.subDepartmentId) errors.subDepartmentId = 'Sub Department is required.';
    if (!form.employeeId) errors.employeeId = 'Employee is required.';
    if (!form.mainPage) errors.mainPage = 'Main page is required.';

    const userName = form.userName.trim();
    if (!userName) errors.userName = 'User name is required.';

    if (!form.password) {
      errors.password = 'Password is required.';
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required.';
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      message.error('Please complete all required fields.');
      return;
    }

    setFieldErrors({});

    const mainPageLabel =
      MAIN_PAGE_OPTIONS.find((option) => option.value === form.mainPage)?.label ?? '';

    try {
      await createUserLogin({
        departmentId: form.departmentId,
        departmentName: form.departmentName,
        subDepartmentId: form.subDepartmentId,
        subDepartmentName: form.subDepartmentName,
        employeeId: form.employeeId,
        employeeName: form.employeeName,
        mainPage: form.mainPage,
        mainPageLabel,
        branchAccess: form.branchAccess ?? false,
        userName,
      }).unwrap();

      message.success('Login created successfully.');
      setForm(createEmptyCreateLoginForm());
    } catch {
      message.error('Failed to create login.');
    }
  }, [createUserLogin, form, message]);

  const employeeFilterOptions = useMemo(
    () =>
      getCreateLoginEmployees().map((employee) => ({
        value: employee.id,
        label: employee.name,
      })),
    [],
  );

  const filteredRows = useMemo(() => {
    if (!employeeFilter) return rows;
    return rows.filter((row) => row.employeeId === employeeFilter);
  }, [rows, employeeFilter]);

  const columns = useMemo(
    () => [
      {
        title: 'Employee',
        dataIndex: 'employeeName',
        key: 'employeeName',
        width: 200,
      },
      {
        title: 'Department',
        dataIndex: 'departmentName',
        key: 'departmentName',
        width: 180,
      },
      {
        title: 'Sub Department',
        dataIndex: 'subDepartmentName',
        key: 'subDepartmentName',
        width: 160,
      },
      {
        title: 'User Name',
        dataIndex: 'userName',
        key: 'userName',
        width: 160,
      },
      {
        title: 'Main Page',
        dataIndex: 'mainPageLabel',
        key: 'mainPageLabel',
        width: 160,
      },
      {
        title: 'Branch Access',
        dataIndex: 'branchAccess',
        key: 'branchAccess',
        width: 120,
        render: (value) => (
          <Tag color={value ? 'processing' : 'default'}>{value ? 'Yes' : 'No'}</Tag>
        ),
      },
    ],
    [],
  );

  return (
    <div className="services-billing-page create-login-page">
      <section className="create-login-panel" aria-label="Create login form">
        <CreateLoginForm
          form={form}
          errors={fieldErrors}
          onPatchForm={patchForm}
          onClearError={clearFieldError}
        />

        <div className="create-login-actions">
          <Button type="primary" loading={isSaving} onClick={handleSave}>
            Save
          </Button>
        </div>
      </section>

      <div className="create-login-table-toolbar">
        <Select
          placeholder="Filter by Employee"
          value={employeeFilter}
          onChange={setEmployeeFilter}
          allowClear
          showSearch
          optionFilterProp="label"
          options={employeeFilterOptions}
          style={{ width: 280 }}
        />
      </div>

      <section className="services-billing-results" aria-label="Created user logins">
        <DataTable
          rowKey="id"
          columns={columns}
          dataSource={filteredRows}
          loading={isLoading}
          columnAlign="left"
          scroll={{ x: 980 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Total ${total} items`,
          }}
          locale={{ emptyText: 'No user logins created yet' }}
        />
      </section>
    </div>
  );
}
