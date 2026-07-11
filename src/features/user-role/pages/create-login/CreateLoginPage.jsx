'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Select, Tag } from 'antd';
import DataTable from '@/components/ui/DataTable';
import {
  getCreateLoginDepartments,
  getCreateLoginEmployees,
  getCreateLoginSubDepartments,
  MAIN_PAGE_OPTIONS,
} from '@/features/user-role/api/mock-create-login';
import {
  useCreateUserLoginMutation,
  useGetUserLoginsQuery,
} from '@/features/user-role/api/userRoleApi';
import { CREATE_LOGIN_INITIAL_VALUES } from '@/features/user-role/pages/create-login/create-login-fields';
import CreateLoginForm from './CreateLoginForm';
import './create-login.css';

export default function CreateLoginPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [employeeFilter, setEmployeeFilter] = useState(undefined);
  const { data: rows = [], isLoading } = useGetUserLoginsQuery();
  const [createUserLogin, { isLoading: isSaving }] = useCreateUserLoginMutation();

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();

      const departmentName =
        getCreateLoginDepartments().find((d) => d.id === values.departmentId)?.name ?? '';
      const subDepartmentName =
        getCreateLoginSubDepartments(values.departmentId).find(
          (d) => d.id === values.subDepartmentId,
        )?.name ?? '';
      const employeeName =
        getCreateLoginEmployees(values.departmentId, values.subDepartmentId).find(
          (e) => e.id === values.employeeId,
        )?.name ?? '';
      const mainPageLabel =
        MAIN_PAGE_OPTIONS.find((option) => option.value === values.mainPage)?.label ?? '';

      await createUserLogin({
        departmentId: values.departmentId,
        departmentName,
        subDepartmentId: values.subDepartmentId,
        subDepartmentName,
        employeeId: values.employeeId,
        employeeName,
        mainPage: values.mainPage,
        mainPageLabel,
        branchAccess: values.branchAccess ?? false,
        userName: values.userName.trim(),
      }).unwrap();

      message.success('Login created successfully.');
      form.resetFields();
    } catch (error) {
      if (error?.errorFields) return;
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
      { title: 'Employee', dataIndex: 'employeeName', key: 'employeeName', width: 200 },
      { title: 'Department', dataIndex: 'departmentName', key: 'departmentName', width: 180 },
      {
        title: 'Sub Department',
        dataIndex: 'subDepartmentName',
        key: 'subDepartmentName',
        width: 160,
      },
      { title: 'User Name', dataIndex: 'userName', key: 'userName', width: 160 },
      { title: 'Main Page', dataIndex: 'mainPageLabel', key: 'mainPageLabel', width: 160 },
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
        <Form
          form={form}
          layout="vertical"
          requiredMark
          initialValues={CREATE_LOGIN_INITIAL_VALUES}
          onValuesChange={(changed) => {
            if ('departmentId' in changed) {
              form.setFieldsValue({
                subDepartmentId: undefined,
                employeeId: undefined,
              });
            }
            if ('subDepartmentId' in changed) {
              form.setFieldsValue({ employeeId: undefined });
            }
          }}
        >
          <CreateLoginForm form={form} />
        </Form>

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
