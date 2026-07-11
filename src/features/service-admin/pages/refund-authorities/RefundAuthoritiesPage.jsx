'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Input, Tooltip } from 'antd';
import DataTable from '@/components/ui/DataTable';
import RefundAuthorityModal from '@/features/service-admin/pages/refund-authorities/RefundAuthorityModal';
import { useConfirm } from '@/hooks/useConfirm';
import { useGetActiveEmployeesQuery } from '@/features/human-resource/api/employeeApi';
import {
  useCreateRefundAuthorityMutation,
  useDeleteRefundAuthorityMutation,
  useGetRefundAuthoritiesQuery,
} from '@/features/service-admin/api/serviceAdminApi';
import AppIcon from '@/components/icons/AppIcon';

export default function RefundAuthoritiesPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();

  const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: activeEmployees = [] } = useGetActiveEmployeesQuery();
  const { data: rows = [], isLoading } = useGetRefundAuthoritiesQuery();
  const [createRefundAuthority] = useCreateRefundAuthorityMutation();
  const [deleteRefundAuthority] = useDeleteRefundAuthorityMutation();

  const employeeOptions = useMemo(
    () =>
      activeEmployees.map((employee) => ({
        value: employee.id,
        label: [employee.firstName, employee.middleName, employee.lastName]
          .filter(Boolean)
          .join(' '),
      })),
    [activeEmployees],
  );

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return rows.filter((row) => {
      const name = row.employeeName?.toLowerCase() ?? '';
      return !term || name.includes(term) || String(row.employeeId).includes(term);
    });
  }, [rows, searchTerm]);

  const openModal = useCallback(() => {
    form.resetFields();
    setIsModalOpen(true);
  }, [form]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    form.resetFields();
  }, [form]);

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const employeeId = values.employeeId;
      const employee = activeEmployees.find((emp) => emp.id === employeeId);
      await createRefundAuthority({
        employeeId,
        employeeName: employee
          ? [employee.firstName, employee.middleName, employee.lastName].filter(Boolean).join(' ')
          : '',
      }).unwrap();
      message.success('Refund authority added.');
      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [form, activeEmployees, createRefundAuthority, closeModal, message]);

  const handleDeleteRow = useCallback(
    async (row) => {
      const confirmed = await confirmDelete({ itemName: row.employeeName });
      if (!confirmed) return;
      await deleteRefundAuthority(row.id).unwrap();
      message.success('Refund authority removed.');
    },
    [confirmDelete, deleteRefundAuthority, message],
  );

  const columns = useMemo(
    () => [
      {
        title: 'Employee ID',
        dataIndex: 'employeeId',
        key: 'employeeId',
        width: 180,
      },
      {
        title: 'Employee Name',
        dataIndex: 'employeeName',
        key: 'employeeName',
        width: 260,
      },
      {
        title: 'Action',
        key: 'action',
        width: 100,
        align: 'center',
        render: (_, record) => (
          <Tooltip title="Delete">
            <Button
              type="link"
              danger
              size="small"
              aria-label="Delete service"
              icon={
                <AppIcon
                  icon="mdi:delete-outline"
                  className={ACTION_ICON_CLASS}
                />
              }
              onClick={() => handleDeleteRow(record)}
            />
          </Tooltip>
        ),
      },
    ],
    [handleDeleteRow],
  );

  return (
    <div className="services-billing-page refund-authorities-page">
      <div
        className="refund-authorities-table-toolbar"
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}
      >
        <Input
          placeholder="Filter by employee"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          style={{ width: 260 }}
        />
        <Button type="primary" onClick={openModal}>
          Add Authority
        </Button>
      </div>

      <section className="services-billing-results" aria-label="refund authorities">
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

      <RefundAuthorityModal
        open={isModalOpen}
        onClose={closeModal}
        title="Add Refund Authority"
        form={form}
        onSave={handleSave}
        employeeOptions={employeeOptions}
      />
    </div>
  );
}
