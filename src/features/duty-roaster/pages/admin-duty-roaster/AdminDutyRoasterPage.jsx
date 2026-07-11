'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import { useConfirm } from '@/hooks/useConfirm';
import {
  getAdminDutyDepartments,
  getAdminDutySubDepartments,
  filterAdminDutyRoasterRows,
  calculateEndTime,
  formatTimeWithSeconds,
} from '@/features/duty-roaster/api/mock-admin-duty-roaster';
import {
  useGetAdminDutyRoastersQuery,
  useAddAdminDutyRoasterMutation,
  useUpdateAdminDutyRoasterMutation,
  useDeleteAdminDutyRoasterMutation,
  useGetShiftsQuery,
} from '@/features/duty-roaster/api/dutyRoasterApi';
import {
  ADMIN_DUTY_ROASTER_FILTER_INITIAL_VALUES,
} from '@/features/duty-roaster/pages/admin-duty-roaster/admin-duty-roaster-fields';
import AdminDutyRoasterFilterForm from './AdminDutyRoasterFilterForm';
import AdminDutyRoasterModal from './AdminDutyRoasterModal';
import './admin-duty-roaster.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function parseTime(value) {
  if (!value) return null;
  const parsed = dayjs(value, 'HH:mm');
  return parsed.isValid() ? parsed : null;
}

function formatTime(value) {
  if (!value) return '';
  if (dayjs.isDayjs(value)) return value.format('HH:mm');
  return value;
}

export default function AdminDutyRoasterPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(
    ADMIN_DUTY_ROASTER_FILTER_INITIAL_VALUES,
  );

  const { data: rows = [], isLoading } = useGetAdminDutyRoastersQuery();
  const { data: shifts = [] } = useGetShiftsQuery();
  const [addAdminDutyRoaster] = useAddAdminDutyRoasterMutation();
  const [updateAdminDutyRoaster] = useUpdateAdminDutyRoasterMutation();
  const [deleteAdminDutyRoaster] = useDeleteAdminDutyRoasterMutation();

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
        departmentId: record.departmentId ?? undefined,
        subDepartmentId: record.subDepartmentId ?? undefined,
        shiftId: record.shiftId ?? undefined,
        startTime: parseTime(record.startTime),
        durationHours: record.durationHours ?? 0,
        durationMinutes: record.durationMinutes ?? 0,
      });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({
        itemName: `${record.departmentName} - ${record.subDepartmentName}`,
      });
      if (!confirmed) return;
      await deleteAdminDutyRoaster(record.id).unwrap();
      message.success('Admin duty roaster entry deleted.');
    },
    [confirmDelete, deleteAdminDutyRoaster, message],
  );

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const startTime = formatTime(values.startTime);
      const departmentName =
        getAdminDutyDepartments().find((d) => d.id === values.departmentId)?.name ?? '';
      const subDepartmentName =
        getAdminDutySubDepartments(values.departmentId).find(
          (d) => d.id === values.subDepartmentId,
        )?.name ?? '';
      const shiftName = shifts.find((s) => s.id === values.shiftId)?.shiftName ?? '';

      const payload = {
        departmentId: values.departmentId,
        departmentName,
        subDepartmentId: values.subDepartmentId,
        subDepartmentName,
        shiftId: values.shiftId,
        shiftName,
        startTime,
        durationHours: Number(values.durationHours) || 0,
        durationMinutes: Number(values.durationMinutes) || 0,
        endTime: calculateEndTime(
          startTime,
          values.durationHours,
          values.durationMinutes,
        ),
      };

      if (editingRowId) {
        await updateAdminDutyRoaster({ id: editingRowId, ...payload }).unwrap();
        message.success('Admin duty roaster entry updated.');
      } else {
        await addAdminDutyRoaster(payload).unwrap();
        message.success('Admin duty roaster entry added.');
      }

      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [
    form,
    editingRowId,
    shifts,
    addAdminDutyRoaster,
    updateAdminDutyRoaster,
    message,
    closeModal,
  ]);

  const handleSearch = useCallback(() => {
    const values = filterForm.getFieldsValue();
    setAppliedFilters({
      ...values,
      startTime: formatTime(values.startTime),
    });
  }, [filterForm]);

  const handleClear = useCallback(() => {
    filterForm.resetFields();
    setAppliedFilters(ADMIN_DUTY_ROASTER_FILTER_INITIAL_VALUES);
  }, [filterForm]);

  const filteredRows = useMemo(
    () => filterAdminDutyRoasterRows(rows, appliedFilters),
    [rows, appliedFilters],
  );

  const columns = useMemo(
    () => [
      {
        title: 'Department Name',
        dataIndex: 'departmentName',
        key: 'departmentName',
        width: 220,
      },
      {
        title: 'Sub Department Name',
        dataIndex: 'subDepartmentName',
        key: 'subDepartmentName',
        width: 180,
      },
      { title: 'Shift Name', dataIndex: 'shiftName', key: 'shiftName', width: 200 },
      {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 120,
        render: (value) => formatTimeWithSeconds(value),
      },
      {
        title: 'End Time',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 120,
        render: (value) => formatTimeWithSeconds(value),
      },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <div className="admin-duty-roaster-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label={`Edit ${record.departmentName}`}
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label={`Delete ${record.departmentName}`}
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
    <div className="services-billing-page admin-duty-roaster-page">
      <AdminDutyRoasterFilterForm
        form={filterForm}
        onSubmit={handleSearch}
        onClear={handleClear}
        loading={isLoading}
      />

      <section className="services-billing-results" aria-label="Admin duty roaster entries">
        <div className="hr-table-toolbar">
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Add Admin Duty Roaster
          </Button>
        </div>

        <DataTable
          rowKey="id"
          columns={columns}
          dataSource={filteredRows}
          loading={isLoading}
          columnAlign="left"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </section>

      <AdminDutyRoasterModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Admin Duty Roaster' : 'Add Admin Duty Roaster'}
        form={form}
        onSave={handleSave}
      />
    </div>
  );
}
