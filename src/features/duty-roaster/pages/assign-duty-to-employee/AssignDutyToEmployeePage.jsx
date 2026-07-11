'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import { useConfirm } from '@/hooks/useConfirm';
import {
  getAdminDutyDepartments,
  getAdminDutySubDepartments,
  filterAssignDutyToEmployeeRows,
  formatAlternative,
  formatDaysOfWeek,
  resolveEmployeeNames,
} from '@/features/duty-roaster/api/mock-assign-duty-to-employee';
import {
  useGetAssignDutyToEmployeesQuery,
  useAddAssignDutyToEmployeeMutation,
  useUpdateAssignDutyToEmployeeMutation,
  useDeleteAssignDutyToEmployeeMutation,
  useGetShiftsQuery,
} from '@/features/duty-roaster/api/dutyRoasterApi';
import {
  ASSIGN_DUTY_FILTER_INITIAL_VALUES,
} from '@/features/duty-roaster/pages/assign-duty-to-employee/assign-duty-to-employee-fields';
import AssignDutyToEmployeeFilterForm from './AssignDutyToEmployeeFilterForm';
import AssignDutyToEmployeeModal from './AssignDutyToEmployeeModal';
import './assign-duty-to-employee.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function parseDate(value) {
  if (!value) return null;
  if (dayjs.isDayjs(value)) return value;
  const parsed = dayjs(value, 'DD/MM/YYYY');
  return parsed.isValid() ? parsed : null;
}

function formatDate(value) {
  if (!value) return '';
  if (dayjs.isDayjs(value)) return value.format('DD/MM/YYYY');
  return value;
}

export default function AssignDutyToEmployeePage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(ASSIGN_DUTY_FILTER_INITIAL_VALUES);

  const { data: rows = [], isLoading } = useGetAssignDutyToEmployeesQuery();
  const { data: shifts = [] } = useGetShiftsQuery();
  const [addAssignDutyToEmployee] = useAddAssignDutyToEmployeeMutation();
  const [updateAssignDutyToEmployee] = useUpdateAssignDutyToEmployeeMutation();
  const [deleteAssignDutyToEmployee] = useDeleteAssignDutyToEmployeeMutation();

  const openModal = useCallback(() => {
    form.resetFields();
    setEditingRowId(null);
    setIsModalOpen(true);
  }, [form]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRowId(null);
    form.resetFields();
  }, [form]);

  const handleEditRow = useCallback(
    (record) => {
      form.setFieldsValue({
        startFrom: parseDate(record.startFrom),
        endDate: parseDate(record.endDate),
        employeeDepartmentId: record.employeeDepartmentId ?? undefined,
        employeeSubDepartmentId: record.employeeSubDepartmentId ?? undefined,
        dutyRosterDepartmentId: record.dutyRosterDepartmentId ?? undefined,
        dutyRosterSubDepartmentId: record.dutyRosterSubDepartmentId ?? undefined,
        shiftId: record.shiftId ?? undefined,
        doubleDuty: record.doubleDuty ?? false,
        employeeIds: record.employeeIds ?? [],
        alternative: record.alternative ?? 'week-days',
        daysOfWeek: record.daysOfWeek ?? [],
      });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({
        itemName: record.employeeNames?.join(', ') || 'duty assignment',
      });
      if (!confirmed) return;
      await deleteAssignDutyToEmployee(record.id).unwrap();
      message.success('Duty assignment deleted.');
    },
    [confirmDelete, deleteAssignDutyToEmployee, message],
  );

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();

      const employeeDepartmentName =
        getAdminDutyDepartments().find((d) => d.id === values.employeeDepartmentId)?.name ??
        '';
      const employeeSubDepartmentName =
        getAdminDutySubDepartments(values.employeeDepartmentId).find(
          (d) => d.id === values.employeeSubDepartmentId,
        )?.name ?? '';
      const dutyRosterDepartmentName =
        getAdminDutyDepartments().find((d) => d.id === values.dutyRosterDepartmentId)?.name ??
        '';
      const dutyRosterSubDepartmentName =
        getAdminDutySubDepartments(values.dutyRosterDepartmentId).find(
          (d) => d.id === values.dutyRosterSubDepartmentId,
        )?.name ?? '';
      const shiftName = shifts.find((s) => s.id === values.shiftId)?.shiftName ?? '';

      const payload = {
        startFrom: formatDate(values.startFrom),
        endDate: formatDate(values.endDate),
        employeeDepartmentId: values.employeeDepartmentId,
        employeeDepartmentName,
        employeeSubDepartmentId: values.employeeSubDepartmentId,
        employeeSubDepartmentName,
        dutyRosterDepartmentId: values.dutyRosterDepartmentId,
        dutyRosterDepartmentName,
        dutyRosterSubDepartmentId: values.dutyRosterSubDepartmentId,
        dutyRosterSubDepartmentName,
        shiftId: values.shiftId,
        shiftName,
        doubleDuty: values.doubleDuty ?? false,
        employeeIds: values.employeeIds,
        employeeNames: resolveEmployeeNames(values.employeeIds),
        alternative: values.alternative,
        daysOfWeek: values.daysOfWeek,
      };

      if (editingRowId) {
        await updateAssignDutyToEmployee({ id: editingRowId, ...payload }).unwrap();
        message.success('Duty assignment updated.');
      } else {
        await addAssignDutyToEmployee(payload).unwrap();
        message.success('Duty assigned to employee.');
      }

      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [
    form,
    editingRowId,
    shifts,
    addAssignDutyToEmployee,
    updateAssignDutyToEmployee,
    message,
    closeModal,
  ]);

  const handleSearch = useCallback(() => {
    const values = filterForm.getFieldsValue();
    setAppliedFilters({
      ...values,
      startFrom: formatDate(values.startFrom),
      endDate: formatDate(values.endDate),
    });
  }, [filterForm]);

  const handleClear = useCallback(() => {
    filterForm.resetFields();
    setAppliedFilters(ASSIGN_DUTY_FILTER_INITIAL_VALUES);
  }, [filterForm]);

  const filteredRows = useMemo(
    () => filterAssignDutyToEmployeeRows(rows, appliedFilters),
    [rows, appliedFilters],
  );

  const columns = useMemo(
    () => [
      { title: 'Start From', dataIndex: 'startFrom', key: 'startFrom', width: 110 },
      { title: 'End Date', dataIndex: 'endDate', key: 'endDate', width: 110 },
      {
        title: 'Department',
        dataIndex: 'employeeDepartmentName',
        key: 'employeeDepartmentName',
        width: 200,
      },
      {
        title: 'Sub Department',
        dataIndex: 'employeeSubDepartmentName',
        key: 'employeeSubDepartmentName',
        width: 180,
      },
      {
        title: 'Duty Roster For Department',
        dataIndex: 'dutyRosterDepartmentName',
        key: 'dutyRosterDepartmentName',
        width: 200,
      },
      {
        title: 'Duty Roster For Sub Department',
        dataIndex: 'dutyRosterSubDepartmentName',
        key: 'dutyRosterSubDepartmentName',
        width: 180,
      },
      { title: 'Shift Name', dataIndex: 'shiftName', key: 'shiftName', width: 180 },
      {
        title: 'Double Duty',
        dataIndex: 'doubleDuty',
        key: 'doubleDuty',
        width: 100,
        render: (value) => (
          <Tag color={value ? 'processing' : 'default'}>{value ? 'Yes' : 'No'}</Tag>
        ),
      },
      {
        title: 'Employee Name',
        dataIndex: 'employeeNames',
        key: 'employeeNames',
        width: 200,
        render: (names) => names?.join(', ') ?? '',
      },
      {
        title: 'Alternative',
        dataIndex: 'alternative',
        key: 'alternative',
        width: 120,
        render: (value) => formatAlternative(value),
      },
      {
        title: 'Day of Week',
        dataIndex: 'daysOfWeek',
        key: 'daysOfWeek',
        width: 200,
        render: (days) => formatDaysOfWeek(days),
      },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <div className="assign-duty-employee-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label="Edit duty assignment"
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label="Delete duty assignment"
                icon={<AppIcon icon="mdi:delete-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleDeleteRow(record)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [handleEditRow, handleDeleteRow],
  );

  return (
    <div className="services-billing-page assign-duty-employee-page">
      <AssignDutyToEmployeeFilterForm
        form={filterForm}
        onSubmit={handleSearch}
        onClear={handleClear}
        loading={isLoading}
      />

      <section
        className="services-billing-results"
        aria-label="Assign duty to employee entries"
      >
        <div className="hr-table-toolbar">
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Assign Duty to Employee
          </Button>
        </div>

        <DataTable
          rowKey="id"
          columns={columns}
          dataSource={filteredRows}
          loading={isLoading}
          columnAlign="left"
          scroll={{ x: 1800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </section>

      <AssignDutyToEmployeeModal
        open={isModalOpen}
        onClose={closeModal}
        title={
          editingRowId ? 'Edit Assign Duty to Employee' : 'Assign Duty to Employee'
        }
        form={form}
        onSave={handleSave}
      />
    </div>
  );
}
