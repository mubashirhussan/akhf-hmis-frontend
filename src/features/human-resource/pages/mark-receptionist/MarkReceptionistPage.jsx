'use client';

import { useCallback, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Input, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import { useConfirm } from '@/hooks/useConfirm';
import {
  useGetEmployeesQuery,
  useGetReceptionistsQuery,
  useAddReceptionistMutation,
  useUpdateReceptionistMutation,
  useDeleteReceptionistMutation,
} from '@/features/human-resource/api/employeeApi';
import MarkReceptionistModal from './MarkReceptionistModal';
import './mark-receptionist.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function createEmptyReceptionistForm() {
  return { employeeId: '', employeeName: '', counterType: '' };
}

export default function MarkReceptionistPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [employeeNameFilter, setEmployeeNameFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [form, setForm] = useState(createEmptyReceptionistForm);
  const [fieldErrors, setFieldErrors] = useState({});

  const { data: employees = [] } = useGetEmployeesQuery();
  const { data: rows = [], isFetching } = useGetReceptionistsQuery();
  const [addReceptionist] = useAddReceptionistMutation();
  const [updateReceptionist] = useUpdateReceptionistMutation();
  const [deleteReceptionist] = useDeleteReceptionistMutation();

  const filteredRows = useMemo(() => {
    const term = employeeNameFilter.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => r.employeeName?.toLowerCase().includes(term));
  }, [rows, employeeNameFilter]);

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

  const openModal = useCallback(() => {
    setForm(createEmptyReceptionistForm());
    setEditingRowId(null);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleEditRow = useCallback((record) => {
    setForm({
      employeeId: record.employeeId ?? '',
      employeeName: record.employeeName ?? '',
      counterType: record.counterType ?? '',
    });
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRowId(null);
    setFieldErrors({});
  }, []);

  const handleSave = useCallback(async () => {
    const errors = {};
    if (!form.employeeId) errors.employeeId = 'Employee ID is required.';
    if (!form.counterType) errors.counterType = 'Counter Type is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const payload = {
      employeeId: form.employeeId,
      employeeName: form.employeeName,
      counterType: form.counterType,
    };

    try {
      if (editingRowId) {
        await updateReceptionist({ id: editingRowId, ...payload }).unwrap();
        setIsModalOpen(false);
        setEditingRowId(null);
        message.success('Receptionist updated.');
        return;
      }
      await addReceptionist(payload).unwrap();
      setIsModalOpen(false);
      message.success('Receptionist marked successfully.');
    } catch {
      message.error('Failed to save receptionist.');
    }
  }, [form, editingRowId, addReceptionist, updateReceptionist, message]);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.employeeName });
      if (!confirmed) return;
      await deleteReceptionist(record.id).unwrap();
      message.success('Receptionist removed.');
    },
    [confirmDelete, deleteReceptionist, message],
  );

  const columns = useMemo(
    () => [
      { title: 'Receptionist ID', dataIndex: 'receptionistId', key: 'receptionistId', width: 130 },
      { title: 'Employee Name', dataIndex: 'employeeName', key: 'employeeName', width: 220 },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <div className="mark-receptionist-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label={`Edit ${record.employeeName}`}
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label={`Delete ${record.employeeName}`}
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
    <div className="services-billing-page mark-receptionist-page">
      <div
        className="mark-receptionist-table-toolbar"
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}
      >
        <div className="mark-receptionist-filters" style={{ display: 'flex', gap: 12 }}>
          <Input
            placeholder="Filter by Employee Name"
            value={employeeNameFilter}
            onChange={(e) => setEmployeeNameFilter(e.target.value)}
            allowClear
            style={{ width: 260 }}
          />
        </div>

        <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
          Mark Receptionist
        </Button>
      </div>

      <section className="services-billing-results" aria-label="Receptionists">
        <DataTable
          rowKey="id"
          columns={columns}
          dataSource={filteredRows}
          loading={isFetching}
          columnAlign="left"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Total ${total} items`,
          }}
          locale={{ emptyText: 'No receptionists found' }}
        />
      </section>

      <MarkReceptionistModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Receptionist' : 'Mark Receptionist'}
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
        employees={employees}
        isEdit={!!editingRowId}
      />
    </div>
  );
}