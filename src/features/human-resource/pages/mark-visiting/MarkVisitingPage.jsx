'use client';

import { useCallback, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, Tooltip } from 'antd';
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

export default function MarkVisitingPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();

  const [employeeNameFilter, setEmployeeNameFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

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

  const openModal = useCallback(() => {
    form.resetFields();
    setEditingRow(null);
    setIsModalOpen(true);
  }, [form]);

  const handleEditRow = useCallback((record) => {
    setEditingRow(record);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRow(null);
    form.resetFields();
  }, [form]);

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        employeeId: values.employeeId,
        employeeName: values.employeeName,
      };

      if (editingRow) {
        await updateVisiting({ id: editingRow.id, ...payload }).unwrap();
        closeModal();
        message.success('Visiting updated.');
        return;
      }
      await addVisiting(payload).unwrap();
      closeModal();
      message.success('Visiting marked successfully.');
    } catch (err) {
      if (err?.errorFields) return;
      message.error('Failed to save visiting.');
    }
  }, [form, editingRow, addVisiting, updateVisiting, closeModal, message]);

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
    [handleDeleteRow],
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
        title={editingRow ? 'Edit Visiting' : 'Mark Visiting'}
        form={form}
        onSave={handleSave}
        employees={employees}
        isEdit={!!editingRow}
        record={editingRow}
      />
    </div>
  );
}
