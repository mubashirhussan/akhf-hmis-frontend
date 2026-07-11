'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Tooltip } from 'antd';
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

export default function ChangeDepartmentPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [appliedFilters, setAppliedFilters] = useState(createChangeDepartmentFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const { data: _employees = [], isFetching } = useGetEmployeesQuery();
  const [changeDepartment] = useChangeDepartmentMutation();

  const results = useMemo(
    () => filterChangeDepartmentEmployees(appliedFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appliedFilters, _employees],
  );

  const handleSearch = useCallback((values) => {
    setAppliedFilters({ ...values });
  }, []);

  const handleClear = useCallback(() => {
    const reset = createChangeDepartmentFilters();
    filterForm.setFieldsValue(reset);
    setAppliedFilters(reset);
  }, [filterForm]);

  const handleEditRow = useCallback(
    (record) => {
      setEditingRecord(record);
      form.setFieldsValue({
        department: record.department ?? '',
        subDepartment: record.subDepartment ?? '',
        designation: record.designation ?? '',
        shift: record.shift ?? '',
        reason: '',
      });
      setIsModalOpen(true);
    },
    [form],
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  }, [form]);

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      await changeDepartment({
        id: editingRecord.id,
        department: values.department,
        subDepartment: values.subDepartment,
        designation: values.designation,
        shift: values.shift,
        reason: values.reason.trim(),
      }).unwrap();
      message.success('Department changed successfully.');
      closeModal();
    } catch (error) {
      if (error?.errorFields) return;
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
        form={filterForm}
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
        onSave={handleSave}
      />
    </div>
  );
}
