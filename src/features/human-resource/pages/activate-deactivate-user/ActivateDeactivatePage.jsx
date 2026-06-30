'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Modal } from 'antd';
import { ExclamationCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import { App, Button } from 'antd';
import DataTable from '@/components/ui/DataTable';
import {
  createActivateDeactivateFilters,
  filterActivateDeactivateEmployees,
} from '@/features/human-resource/api/mock-employee-search';
import {
  useGetEmployeesQuery,
  useToggleEmployeeActiveMutation,
} from '@/features/human-resource/api/employeeApi';
import { useConfirm } from '@/hooks/useConfirm';
import ActivateDeactivateFilterForm from './ActivateDeactivateFilterForm';
import './activate-deactivate-user.css';

export default function ActivateDeactivatePage() {
  const { message, modal } = App.useApp();
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [filters, setFilters] = useState(createActivateDeactivateFilters);
  const [appliedFilters, setAppliedFilters] = useState(createActivateDeactivateFilters);

  const { data: _employees = [], isFetching } = useGetEmployeesQuery();
  const [toggleActive, { isLoading: isToggling }] = useToggleEmployeeActiveMutation();

  const results = useMemo(
    () => filterActivateDeactivateEmployees(appliedFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appliedFilters, _employees],
  );

  const patchFilter = useCallback((patch) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
  };

  const handleClear = () => {
    const reset = createActivateDeactivateFilters();
    setFilters(reset);
    setAppliedFilters(reset);
  };

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
    async (record) => {
      const confirmed = await confirmDelete({
        itemName: record.empName,
      });
      if (!confirmed) return;
      try {
        await toggleActive(record.id).unwrap();
        message.success(
          record.isActive
            ? `${record.empName} deactivated successfully.`
            : `${record.empName} activated successfully.`,
        );
      } catch {
        message.error('Failed to update employee status.');
      }
    },
    [toggleActive, message, confirmDelete],
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
        title: 'Action',
        key: 'action',
        width: 110,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <Button
            type="primary"
            size="small"
            danger={record.isActive}
            disabled={isToggling}
            onClick={() => handleToggle(record)}
          >
            {record.isActive ? 'Deactive' : 'Active'}
          </Button>
        ),
      },
    ],
    [handleToggle, isToggling],
  );

  return (
    <div className="patient-registration-page activate-deactivate-page">
      <ActivateDeactivateFilterForm
        filters={filters}
        onPatchFilter={patchFilter}
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