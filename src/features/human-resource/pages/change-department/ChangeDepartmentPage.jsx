'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import {
  createChangeDepartmentFilters,
  filterChangeDepartmentEmployees,
} from '@/features/human-resource/api/mock-employee-search';
import {
  useGetEmployeesQuery,
  useChangeDepartmentMutation,
} from '@/features/human-resource/api/employeeApi';
import ChangeDepartmentFilterForm from './ChangeDepartmentFilterForm';
import ChangeDepartmentModal from './ChangeDepartmentModal';
import './change-department.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function createEmptyChangeDeptForm() {
  return {
    department: '',
    subDepartment: '',
    designation: '',
    shift: '',
    reason: '',
  };
}

export default function ChangeDepartmentPage() {
  const { message } = App.useApp();

  const [filters, setFilters] = useState(createChangeDepartmentFilters);
  const [appliedFilters, setAppliedFilters] = useState(createChangeDepartmentFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState(createEmptyChangeDeptForm);
  const [fieldErrors, setFieldErrors] = useState({});

  const { data: _employees = [], isFetching } = useGetEmployeesQuery();
  const [changeDepartment] = useChangeDepartmentMutation();

  const results = useMemo(
    () => filterChangeDepartmentEmployees(appliedFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appliedFilters, _employees],
  );

  const patchFilter = useCallback((patch) => {
    setFilters((cur) => ({ ...cur, ...patch }));
  }, []);

  const handleSearch = () => setAppliedFilters({ ...filters });

  const handleClear = () => {
    const reset = createChangeDepartmentFilters();
    setFilters(reset);
    setAppliedFilters(reset);
  };

  const patchForm = useCallback((patch) => {
    setForm((cur) => ({ ...cur, ...patch }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setFieldErrors((cur) => {
      if (!cur[field]) return cur;
      const next = { ...cur };
      delete next[field];
      return next;
    });
  }, []);

  const handleEditRow = useCallback((record) => {
    setEditingRecord(record);
    setForm({
      department: record.department ?? '',
      subDepartment: record.subDepartment ?? '',
      designation: record.designation ?? '',
      shift: record.shift ?? '',
      reason: '',
    });
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setFieldErrors({});
  }, []);

  const handleSave = useCallback(async () => {
    const errors = {};
    if (!form.department) errors.department = 'Department is required.';
    if (!form.subDepartment) errors.subDepartment = 'Sub Department is required.';
    if (!form.designation) errors.designation = 'Designation is required.';
    if (!form.shift) errors.shift = 'Shift is required.';
    if (!form.reason?.trim()) errors.reason = 'Reason is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    try {
      await changeDepartment({
        id: editingRecord.id,
        department: form.department,
        subDepartment: form.subDepartment,
        designation: form.designation,
        shift: form.shift,
        reason: form.reason.trim(),
      }).unwrap();
      message.success('Department changed successfully.');
      closeModal();
    } catch {
      message.error('Failed to change department.');
    }
  }, [form, editingRecord, changeDepartment, message, closeModal]);

  const handleExport = useCallback(() => {
    const headers = [
      'Employee ID',
      'Employee No',
      'Employee Name',
      'Relation Name',
      'CNIC',
      'Join Date',
      'Designation Name',
      'Department Name',
      'Shift Name',
    ];
    const rows = results.map((r) => [
      r.empId,
      r.empNo,
      r.empName,
      r.relationName,
      r.cnic,
      r.joinDate,
      r.designationName,
      r.departmentName,
      r.shiftName,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'change-department.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [results]);

  const columns = useMemo(
    () => [
      { title: 'Employee ID', dataIndex: 'empId', key: 'empId', width: 100 },
      { title: 'Employee No', dataIndex: 'empNo', key: 'empNo', width: 110 },
      { title: 'Employee Name', dataIndex: 'empName', key: 'empName', width: 180 },
      { title: 'Relation Name', dataIndex: 'relationName', key: 'relationName', width: 160 },
      { title: 'CNIC', dataIndex: 'cnic', key: 'cnic', width: 160 },
      { title: 'Join Date', dataIndex: 'joinDate', key: 'joinDate', width: 110 },
      { title: 'Designation Name', dataIndex: 'designationName', key: 'designationName', width: 150 },
      { title: 'Department Name', dataIndex: 'departmentName', key: 'departmentName', width: 150 },
      { title: 'Shift Name', dataIndex: 'shiftName', key: 'shiftName', width: 110 },
      {
        title: 'Action',
        key: 'action',
        width: 80,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <Tooltip title="Change Department">
            <Button
              type="link"
              size="small"
              aria-label={`Change department for ${record.empName}`}
              icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
              onClick={() => handleEditRow(record)}
            />
          </Tooltip>
        ),
      },
    ],
    [handleEditRow],
  );

  return (
    <div className="services-billing-page change-department-page">
      <ChangeDepartmentFilterForm
        filters={filters}
        onPatchFilter={patchFilter}
        onSubmit={handleSearch}
        onClear={handleClear}
        loading={isFetching}
      />

      <section className="services-billing-results" aria-label="Change Department">
        <div className="hr-table-toolbar">
          <Button type="default" className="hr-search-btn" onClick={handleExport}>
            Export
          </Button>
        </div>

        <DataTable
          rowKey="id"
          columns={columns}
          dataSource={results}
          loading={isFetching}
          columnAlign="left"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Total ${total} items`,
          }}
          locale={{ emptyText: 'No employees found' }}
        />
      </section>

      <ChangeDepartmentModal
        open={isModalOpen}
        onClose={closeModal}
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
      />
    </div>
  );
}