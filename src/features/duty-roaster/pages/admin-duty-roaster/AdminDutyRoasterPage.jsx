'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import { useConfirm } from '@/hooks/useConfirm';
import {
  createEmptyAdminDutyRoasterForm,
  createAdminDutyRoasterFilters,
  rowToAdminDutyRoasterForm,
  filterAdminDutyRoasterRows,
  calculateEndTime,
  formatTimeWithSeconds,
} from '@/features/duty-roaster/api/mock-admin-duty-roaster';
import {
  useGetAdminDutyRoastersQuery,
  useAddAdminDutyRoasterMutation,
  useUpdateAdminDutyRoasterMutation,
  useDeleteAdminDutyRoasterMutation,
} from '@/features/duty-roaster/api/dutyRoasterApi';
import AdminDutyRoasterFilterForm from './AdminDutyRoasterFilterForm';
import AdminDutyRoasterModal from './AdminDutyRoasterModal';
import './admin-duty-roaster.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function AdminDutyRoasterPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [form, setForm] = useState(createEmptyAdminDutyRoasterForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [filters, setFilters] = useState(createAdminDutyRoasterFilters);
  const [appliedFilters, setAppliedFilters] = useState(createAdminDutyRoasterFilters);

  const { data: rows = [], isLoading } = useGetAdminDutyRoastersQuery();
  const [addAdminDutyRoaster] = useAddAdminDutyRoasterMutation();
  const [updateAdminDutyRoaster] = useUpdateAdminDutyRoasterMutation();
  const [deleteAdminDutyRoaster] = useDeleteAdminDutyRoasterMutation();

  const patchForm = useCallback((patch) => setForm((c) => ({ ...c, ...patch })), []);

  const clearFieldError = useCallback((field) => {
    setFieldErrors((c) => {
      if (!c[field]) return c;
      const next = { ...c };
      delete next[field];
      return next;
    });
  }, []);

  const openModal = useCallback(() => {
    setForm(createEmptyAdminDutyRoasterForm());
    setEditingRowId(null);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRowId(null);
    setFieldErrors({});
  }, []);

  const handleEditRow = useCallback((record) => {
    setForm(rowToAdminDutyRoasterForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

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
    const errors = {};
    if (!form.departmentId) errors.departmentId = 'Department Name is required.';
    if (!form.subDepartmentId) errors.subDepartmentId = 'Sub Department Name is required.';
    if (!form.shiftId) errors.shiftId = 'Shift Name is required.';
    if (!form.startTime) errors.startTime = 'Start Time is required.';
    if (form.durationHours === null || form.durationHours === undefined) {
      errors.durationHours = 'Duration hours is required.';
    }
    if (form.durationMinutes === null || form.durationMinutes === undefined) {
      errors.durationMinutes = 'Duration minutes is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const payload = {
      departmentId: form.departmentId,
      departmentName: form.departmentName,
      subDepartmentId: form.subDepartmentId,
      subDepartmentName: form.subDepartmentName,
      shiftId: form.shiftId,
      shiftName: form.shiftName,
      startTime: form.startTime,
      durationHours: Number(form.durationHours) || 0,
      durationMinutes: Number(form.durationMinutes) || 0,
      endTime: calculateEndTime(
        form.startTime,
        form.durationHours,
        form.durationMinutes,
      ),
    };

    if (editingRowId) {
      await updateAdminDutyRoaster({ id: editingRowId, ...payload }).unwrap();
      setIsModalOpen(false);
      setEditingRowId(null);
      message.success('Admin duty roaster entry updated.');
      return;
    }

    await addAdminDutyRoaster(payload).unwrap();
    setIsModalOpen(false);
    message.success('Admin duty roaster entry added.');
  }, [form, editingRowId, addAdminDutyRoaster, updateAdminDutyRoaster, message]);

  const handleSearch = () => setAppliedFilters({ ...filters });

  const handleClear = () => {
    const empty = createAdminDutyRoasterFilters();
    setFilters(empty);
    setAppliedFilters(empty);
  };

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
      {
        title: 'Shift Name',
        dataIndex: 'shiftName',
        key: 'shiftName',
        width: 200,
      },
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
        filters={filters}
        onPatchFilter={(patch) => setFilters((c) => ({ ...c, ...patch }))}
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
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
      />
    </div>
  );
}
