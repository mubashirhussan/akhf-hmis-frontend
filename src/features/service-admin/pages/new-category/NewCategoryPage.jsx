'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Input, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import NewCategoryModal from '@/features/service-admin/pages/new-category/NewCategoryModal';
import { useConfirm } from '@/hooks/useConfirm';
import {
  useCreateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
  useGetServiceCategoriesQuery,
  useUpdateServiceCategoryMutation,
} from '@/features/service-admin/api/serviceAdminApi';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function NewCategoryPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: rows = [], isLoading } = useGetServiceCategoriesQuery();
  const [createServiceCategory] = useCreateServiceCategoryMutation();
  const [updateServiceCategory] = useUpdateServiceCategoryMutation();
  const [deleteServiceCategory] = useDeleteServiceCategoryMutation();

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
      form.setFieldsValue({ serviceName: record.serviceName ?? '' });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.serviceName });
      if (!confirmed) return;

      await deleteServiceCategory(record.id).unwrap();
      message.success('Category deleted.');
    },
    [confirmDelete, deleteServiceCategory, message],
  );

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const serviceName = values.serviceName.trim();

      if (editingRowId) {
        await updateServiceCategory({ id: editingRowId, serviceName }).unwrap();
        message.success('Category updated.');
      } else {
        await createServiceCategory(serviceName).unwrap();
        message.success('Category created.');
      }

      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [
    form,
    editingRowId,
    createServiceCategory,
    updateServiceCategory,
    message,
    closeModal,
  ]);

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return rows.filter((row) => {
      const name = row.serviceName?.toLowerCase() ?? '';
      return !term || name.includes(term);
    });
  }, [rows, searchTerm]);

  const columns = useMemo(
    () => [
      {
        title: 'Service ID',
        dataIndex: 'id',
        key: 'id',
        width: 120,
      },
      {
        title: 'Service Category',
        dataIndex: 'serviceName',
        key: 'serviceName',
        width: 260,
      },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        render: (_, record) => (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                className="new-category-actions-cell"
                aria-label="Edit service"
                icon={
                  <AppIcon
                    icon="mdi:pencil-outline"
                    className={ACTION_ICON_CLASS}
                  />
                }
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
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
          </div>
        ),
      },
    ],
    [handleEditRow, handleDeleteRow],
  );

  return (
    <div className="services-billing-page new-category-page">
      <div
        className="new-category-table-toolbar"
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}
      >
        <Input
          placeholder="Filter by Category Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          style={{ width: 260 }}
        />

        <Button type="primary" onClick={openModal}>
          Add Service Category
        </Button>
      </div>

      <section className="services-billing-results" aria-label="new category services">
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

      <NewCategoryModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Service Category' : 'Add Service Category'}
        form={form}
        onSave={handleSave}
      />
    </div>
  );
}
