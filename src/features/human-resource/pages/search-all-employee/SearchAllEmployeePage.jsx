'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { App, Button, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import { ROUTES } from '@/config/routes';
import { createEmployeeSearchFilters } from '@/features/human-resource/api/mock-employee-search';
import {
  useDeleteEmployeeMutation,
  useSearchEmployeesQuery,
} from '@/features/human-resource/api/employeeApi';
import { useConfirm } from '@/hooks/useConfirm';
import EmployeeSearchFilterForm from './EmployeeSearchFilterForm';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function SearchAllEmployeePage() {
  const { message } = App.useApp();
  const router = useRouter();
  const { confirmDelete } = useConfirm();
  const [filters, setFilters] = useState(createEmployeeSearchFilters);
  const [appliedFilters, setAppliedFilters] = useState(createEmployeeSearchFilters);
  const [hasSearched, setHasSearched] = useState(true);
  const { data: results = [], isFetching } = useSearchEmployeesQuery(appliedFilters);
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const patchFilter = useCallback((patch) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
    setHasSearched(true);
  };

  const handleClear = () => {
    const resetFilters = createEmployeeSearchFilters();
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setHasSearched(true);
  };

  const handleEdit = useCallback(
    (record) => {
      router.push(`${ROUTES.humanResource.employeeEntry}?employeeId=${record.id}`);
    },
    [router],
  );

  const handleDelete = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.empName });
      if (!confirmed) {
        return;
      }

      try {
        await deleteEmployee(record.id).unwrap();
        message.success('Employee deleted.');
      } catch {
        message.error('Failed to delete employee.');
      }
    },
    [confirmDelete, deleteEmployee, message],
  );

  const columns = useMemo(
    () => [
      {
        title: '#',
        dataIndex: 'serial',
        key: 'serial',
        width: 56,
      },
      {
        title: 'Emp ID',
        dataIndex: 'empId',
        key: 'empId',
        width: 90,
      },
      {
        title: 'Emp No',
        dataIndex: 'empNo',
        key: 'empNo',
        width: 100,
      },
      {
        title: 'Emp Name',
        dataIndex: 'empName',
        key: 'empName',
        width: 180,
      },
      {
        title: 'CNIC',
        dataIndex: 'cnic',
        key: 'cnic',
        width: 160,
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        width: 160,
      },
      {
        title: 'SubDepartment',
        dataIndex: 'subDepartment',
        key: 'subDepartment',
        width: 150,
      },
      {
        title: 'Designation',
        dataIndex: 'designation',
        key: 'designation',
        width: 140,
      },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <div className="employee-search-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label={`Edit ${record.empName}`}
                icon={
                  <AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />
                }
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label={`Delete ${record.empName}`}
                icon={
                  <AppIcon icon="mdi:delete-outline" className={ACTION_ICON_CLASS} />
                }
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [handleDelete, handleEdit],
  );

  return (
    <div className="patient-registration-page search-all-employee-page">
      <EmployeeSearchFilterForm
        filters={filters}
        onPatchFilter={patchFilter}
        onSubmit={handleSearch}
        onClear={handleClear}
        loading={isFetching}
      />

      <section className="employee-search-results" aria-label="Employee search results">
        <DataTable
          columns={columns}
          dataSource={results}
          loading={isFetching}
          rowKey="id"
          columnAlign="left"
          pagination={false}
          locale={{
            emptyText: hasSearched
              ? 'No employees found'
              : 'Use the search form above to find employees',
          }}
        />
      </section>
    </div>
  );
}
