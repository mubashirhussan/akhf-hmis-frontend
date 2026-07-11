'use client';

import { useCallback, useMemo, useState } from 'react';

import { ExclamationCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import { App, Button, Form, Tag, Tooltip } from 'antd';
import DataTable from '@/components/ui/DataTable';
import {
  createActivateDeactivateFilters,
  filterActivateDeactivateEmployees,
} from '@/features/human-resource/api/mock-employee-search';
import {
  useGetEmployeesQuery,
  useToggleEmployeeActiveMutation,
} from '@/features/human-resource/api/employeeApi';
import ActivateDeactivateFilterForm from './ActivateDeactivateFilterForm';
import './activate-deactivate-user.css';
import AppIcon from '@/components/icons/AppIcon';

export default function ActivateDeactivatePage() {
  const { message, modal } = App.useApp();
  const [filterForm] = Form.useForm();
  const [appliedFilters, setAppliedFilters] = useState(createActivateDeactivateFilters);

  const { data: _employees = [], isFetching } = useGetEmployeesQuery();
  const [toggleActive, { isLoading: isToggling }] = useToggleEmployeeActiveMutation();

  const results = useMemo(
    () => filterActivateDeactivateEmployees(appliedFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appliedFilters, _employees],
  );

  const handleSearch = useCallback((values) => {
    setAppliedFilters({ ...values });
  }, []);

  const handleClear = useCallback(() => {
    const reset = createActivateDeactivateFilters();
    filterForm.setFieldsValue(reset);
    setAppliedFilters(reset);
  }, [filterForm]);

  const handleToggle = useCallback(
    (record) => {
      const isActivating = !record.isActive;

      modal.confirm({
        title: isActivating
          ? `Do you want to activate ${record.empName}?`
          : `Do you want to deactivate ${record.empName}?`,
        icon: isActivating ? (
          <QuestionCircleFilled style={{ color: '#1677ff' }} />
        ) : (
          <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />
        ),
        okText: isActivating ? 'Activate' : 'Deactivate',
        okType: isActivating ? 'primary' : 'danger',
        cancelText: 'Cancel',
        className: isActivating
          ? 'activate-confirm-modal activate-confirm-modal--blue'
          : 'activate-confirm-modal activate-confirm-modal--red',
        onOk: async () => {
          try {
            await toggleActive(record.id).unwrap();
            message.success(
              isActivating
                ? `${record.empName} activated successfully.`
                : `${record.empName} deactivated successfully.`,
            );
          } catch {
            message.error('Failed to update employee status.');
          }
        },
      });
    },
    [toggleActive, message, modal],
  );

  const columns = useMemo(
    () => [
      { title: 'EmpID', dataIndex: 'empId', key: 'empId', width: 80 },
      { title: 'EmpNo', dataIndex: 'empNo', key: 'empNo', width: 100 },
      { title: 'Emp Name', dataIndex: 'empName', key: 'empName', width: 180 },
      { title: 'Dept Name', dataIndex: 'deptName', key: 'deptName', width: 150 },
      { title: 'SubDept Name', dataIndex: 'subDeptName', key: 'subDeptName', width: 150 },
      { title: 'User Name', dataIndex: 'userName', key: 'userName', width: 140 },
      { title: 'Joining Date', dataIndex: 'joiningDate', key: 'joiningDate', width: 120 },
      { title: 'Designation', dataIndex: 'designation', key: 'designation', width: 140 },
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'status',
        width: 100,
        render: (isActive) => (
          <Tag className={isActive ? 'status-active' : 'status-inactive'}>
            {isActive ? 'Active' : 'Inactive'}
          </Tag>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        width: 110,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <Tooltip title="Update Status">
            <Button
              type="link"
              size="small"
              disabled={isToggling}
              aria-label={`Update status for ${record.empName}`}
              icon={
                <AppIcon
                  icon="mdi:pencil-outline"
                  className="h-[16px] w-[16px] text-[var(--app-primary)]"
                />
              }
              onClick={() => handleToggle(record)}
            />
          </Tooltip>
        ),
      },
    ],
    [handleToggle, isToggling],
  );

  return (
    <div className="patient-registration-page activate-deactivate-page">
      <ActivateDeactivateFilterForm
        form={filterForm}
        onSubmit={handleSearch}
        onClear={handleClear}
        loading={isFetching}
      />

      <section className="activate-deactivate-results" aria-label="Activate deactivate results">
        <DataTable
          columns={columns}
          dataSource={results}
          loading={isFetching}
          rowKey="id"
          columnAlign="left"
          pagination={false}
          locale={{ emptyText: 'No employees found' }}
        />
      </section>
    </div>
  );
}
