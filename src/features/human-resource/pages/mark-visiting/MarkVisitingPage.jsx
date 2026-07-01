'use client';

import { useCallback, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Input, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import { useConfirm } from '@/hooks/useConfirm';
import {
  useGetEmployeesQuery,
  useGetVisitingsQuery,
  useAddVisitingMutation,
  useUpdateVisitingMutation,
  useDeleteVisitingMutation,
} from '@/features/human-resource/api/employeeApi';
import MarkVisitingModal from './MarkVisitingModal';
import './mark-visiting.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function createEmptyVisitingForm() {
  return { employeeId: '', employeeName: '' };
}

export default function MarkVisitingPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [employeeNameFilter, setEmployeeNameFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [form, setForm] = useState(createEmptyVisitingForm);
  const [fieldErrors, setFieldErrors] = useState({});

  const { data: employees = [] } = useGetEmployeesQuery();
  const { data: rows = [], isFetching } = useGetVisitingsQuery();
  const [addVisiting] = useAddVisitingMutation();
  const [updateVisiting] = useUpdateVisitingMutation();
  const [deleteVisiting] = useDeleteVisitingMutation();

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
    setForm(createEmptyVisitingForm());
    setEditingRowId(null);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleEditRow = useCallback((record) => {
    setForm({
      employeeId: record.employeeId ?? '',
      employeeName: record.employeeName ?? '',
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

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const payload = {
      employeeId: form.employeeId,
      employeeName: form.employeeName,
    };

    try {
      if (editingRowId) {
        await updateVisiting({ id: editingRowId, ...payload }).unwrap();
        setIsModalOpen(false);
        setEditingRowId(null);
        message.success('Visiting updated.');
        return;
      }
      await addVisiting(payload).unwrap();
      setIsModalOpen(false);
      message.success('Visiting marked successfully.');
    } catch {
      message.error('Failed to save visiting.');
    }
  }, [form, editingRowId, addVisiting, updateVisiting, message]);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.employeeName });
      if (!confirmed) return;
      await deleteVisiting(record.id).unwrap();
      message.success('Visiting removed.');
    },
    [confirmDelete, deleteVisiting, message],
  );

  const columns = useMemo(
    () => [
      { title: 'Visiting ID', dataIndex: 'visitingId', key: 'visitingId', width: 130 },
      { title: 'Employee Name', dataIndex: 'employeeName', key: 'employeeName', width: 220 },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <div className="mark-visiting-actions-cell">
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
    <div className="services-billing-page mark-visiting-page">
      <div
        className="mark-visiting-table-toolbar"
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}
      >
        <div className="mark-visiting-filters" style={{ display: 'flex', gap: 12 }}>
          <Input
            placeholder="Filter by Employee Name"
            value={employeeNameFilter}
            onChange={(e) => setEmployeeNameFilter(e.target.value)}
            allowClear
            style={{ width: 260 }}
          />
        </div>

        <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
          Mark Visiting
        </Button>
      </div>

      <section className="services-billing-results" aria-label="Visitings">
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
          locale={{ emptyText: 'No visitings found' }}
        />
      </section>

      <MarkVisitingModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Visiting' : 'Mark Visiting'}
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
