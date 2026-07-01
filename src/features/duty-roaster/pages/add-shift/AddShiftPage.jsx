'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import { useConfirm } from '@/hooks/useConfirm';
import {
  createEmptyShiftForm,
  createShiftFilters,
  rowToShiftForm,
  filterShiftRows,
} from '@/features/duty-roaster/api/mock-shifts';
import {
  useGetShiftsQuery,
  useAddShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} from '@/features/duty-roaster/api/dutyRoasterApi';
import ShiftFilterForm from './ShiftFilterForm';
import ShiftModal from './ShiftModal';
import './add-shift.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function AddShiftPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [form, setForm] = useState(createEmptyShiftForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [filters, setFilters] = useState(createShiftFilters);
  const [appliedFilters, setAppliedFilters] = useState(createShiftFilters);

  const { data: rows = [], isLoading } = useGetShiftsQuery();
  const [addShift] = useAddShiftMutation();
  const [updateShift] = useUpdateShiftMutation();
  const [deleteShift] = useDeleteShiftMutation();

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
    setForm(createEmptyShiftForm());
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
    setForm(rowToShiftForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.shiftName });
      if (!confirmed) return;
      await deleteShift(record.id).unwrap();
      message.success('Shift deleted.');
    },
    [confirmDelete, deleteShift, message],
  );

  const handleSave = useCallback(async () => {
    const errors = {};
    if (!form.shiftName?.trim()) errors.shiftName = 'Shift Name is required.';
    if (!form.abbreviation?.trim()) errors.abbreviation = 'Abbreviation is required.';
    if (!form.startTime) errors.startTime = 'Start Time is required.';
    if (!form.endTime) errors.endTime = 'End Time is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const payload = {
      shiftName: form.shiftName.trim(),
      shiftDescription: form.shiftDescription?.trim() ?? '',
      abbreviation: form.abbreviation.trim(),
      startTime: form.startTime,
      endTime: form.endTime,
      relaxationTime: form.relaxationTime ?? 0,
    };

    if (editingRowId) {
      await updateShift({ id: editingRowId, ...payload }).unwrap();
      setIsModalOpen(false);
      setEditingRowId(null);
      message.success('Shift updated.');
      return;
    }

    await addShift(payload).unwrap();
    setIsModalOpen(false);
    message.success('Shift added.');
  }, [form, editingRowId, addShift, updateShift, message]);

  const handleSearch = () => setAppliedFilters({ ...filters });

  const handleClear = () => {
    const empty = createShiftFilters();
    setFilters(empty);
    setAppliedFilters(empty);
  };

  const filteredRows = useMemo(
    () => filterShiftRows(rows, appliedFilters),
    [rows, appliedFilters],
  );

  const columns = useMemo(
    () => [
      {
        title: 'Serial No.',
        key: 'serialNo',
        width: 90,
        render: (_, __, index) => index + 1,
      },
      {
        title: 'Shift Name',
        dataIndex: 'shiftName',
        key: 'shiftName',
        width: 200,
      },
      {
        title: 'Abbreviation',
        dataIndex: 'abbreviation',
        key: 'abbreviation',
        width: 120,
      },
      {
        title: 'Description',
        dataIndex: 'shiftDescription',
        key: 'shiftDescription',
        width: 220,
      },
      {
        title: 'Relaxation Time',
        dataIndex: 'relaxationTime',
        key: 'relaxationTime',
        width: 130,
      },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <div className="shift-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label={`Edit ${record.shiftName}`}
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label={`Delete ${record.shiftName}`}
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
    <div className="services-billing-page add-shift-page">
      <ShiftFilterForm
        filters={filters}
        onPatchFilter={(patch) => setFilters((c) => ({ ...c, ...patch }))}
        onSubmit={handleSearch}
        onClear={handleClear}
        loading={isLoading}
      />

      <section className="services-billing-results" aria-label="Shifts">
        <div className="hr-table-toolbar">
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Add Shift
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

      <ShiftModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Shift' : 'Add Shift'}
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
      />
    </div>
  );
}
