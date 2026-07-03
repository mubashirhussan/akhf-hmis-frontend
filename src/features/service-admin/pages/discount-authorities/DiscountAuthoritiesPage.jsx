'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Input } from 'antd';
import DataTable from '@/components/ui/DataTable';
import DiscountAuthorityModal from '@/features/service-admin/pages/discount-authorities/DiscountAuthorityModal';
import { useConfirm } from '@/hooks/useConfirm';
import { useGetActiveEmployeesQuery } from '@/features/human-resource/api/employeeApi';
import {
  useCreateDiscountAuthorityMutation,
  useDeleteDiscountAuthorityMutation,
  useGetDiscountAuthoritiesQuery,
} from '@/features/service-admin/api/serviceAdminApi';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function DiscountAuthoritiesPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const { data: activeEmployees = [] } = useGetActiveEmployeesQuery();
  const { data: rows = [], isLoading } = useGetDiscountAuthoritiesQuery();
  const [createDiscountAuthority] = useCreateDiscountAuthorityMutation();
  const [deleteDiscountAuthority] = useDeleteDiscountAuthorityMutation();

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
    setForm({ employeeId: '' });
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setFieldErrors({});
  }, []);

  const patchForm = useCallback((patch) => {
    setForm((current) => ({ ...current, ...patch }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    const employeeId = form.employeeId;
    const errors = {};
    if (!employeeId) {
      errors.employeeId = 'Employee is required.';
    }

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    const employee = activeEmployees.find((emp) => emp.id === employeeId);
    await createDiscountAuthority({
      employeeId,
      employeeName: employee ? [employee.firstName, employee.middleName, employee.lastName].filter(Boolean).join(' ') : '',
    }).unwrap();
    message.success('Discount authority added.');
    closeModal();
  }, [form.employeeId, activeEmployees, createDiscountAuthority, closeModal, message]);

  const handleDelete = useCallback(
    async (row) => {
      const confirmed = await confirmDelete({ itemName: row.employeeName });
      if (!confirmed) return;
      await deleteDiscountAuthority(row.id).unwrap();
      message.success('Discount authority removed.');
    },
    [confirmDelete, deleteDiscountAuthority, message],
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
          <Button
            type="link"
            danger
            size="small"
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        ),
      },
    ],
    [handleDelete],
  );

  return (
    <div className="services-billing-page discount-authorities-page">
      <div
        className="discount-authorities-table-toolbar"
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

      <section className="services-billing-results" aria-label="discount authorities">
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

      <DiscountAuthorityModal
        open={isModalOpen}
        onClose={closeModal}
        title="Add Discount Authority"
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
        employeeOptions={employeeOptions}
      />
    </div>
  );
}
