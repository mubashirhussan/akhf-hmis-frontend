'use client';

import { useCallback, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, Tooltip, Select } from 'antd';
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
import { COUNTER_TYPE_OPTIONS } from '@/features/human-resource/pages/mark-receptionist/mark-receptionist-fields';
import MarkReceptionistModal from './MarkReceptionistModal';
import './mark-receptionist.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function MarkReceptionistPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();

  const [employeeNameFilter, setEmployeeNameFilter] = useState('');
  const [counterTypeFilter, setCounterTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const { data: employees = [] } = useGetEmployeesQuery();
  const { data: rows = [], isFetching } = useGetReceptionistsQuery();
  const [addReceptionist] = useAddReceptionistMutation();
  const [updateReceptionist] = useUpdateReceptionistMutation();
  const [deleteReceptionist] = useDeleteReceptionistMutation();

  const filteredRows = useMemo(() => {
    const employeeNameTerm = employeeNameFilter.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesName = employeeNameTerm
        ? r.employeeName?.toLowerCase().includes(employeeNameTerm)
        : true;
      const matchesCounterType = counterTypeFilter
        ? r.counterType === counterTypeFilter
        : true;
      return matchesName && matchesCounterType;
    });
  }, [rows, employeeNameFilter, counterTypeFilter]);

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
        counterType: values.counterType,
      };

      if (editingRow) {
        await updateReceptionist({ id: editingRow.id, ...payload }).unwrap();
        closeModal();
        message.success('Receptionist updated.');
        return;
      }
      await addReceptionist(payload).unwrap();
      closeModal();
      message.success('Receptionist marked successfully.');
    } catch (err) {
      if (err?.errorFields) return;
      message.error('Failed to save receptionist.');
    }
  }, [form, editingRow, addReceptionist, updateReceptionist, closeModal, message]);

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
      { title: 'Counter Type', dataIndex: 'counterType', key: 'counterType', width: 160 },
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
          <Select
            placeholder="Filter by Counter Type"
            value={counterTypeFilter || undefined}
            onChange={(val) => setCounterTypeFilter(val)}
            allowClear
            options={COUNTER_TYPE_OPTIONS}
            style={{ width: 220 }}
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
        title={editingRow ? 'Edit Receptionist' : 'Mark Receptionist'}
        form={form}
        onSave={handleSave}
        employees={employees}
        isEdit={!!editingRow}
        record={editingRow}
      />
    </div>
  );
}
