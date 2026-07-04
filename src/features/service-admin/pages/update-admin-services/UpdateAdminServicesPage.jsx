'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Input, InputNumber, Select, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import UpdateAdminServicesModal from '@/features/service-admin/pages/update-admin-services/UpdateAdminServicesModal';
import {
  createEmptyServiceAdminForm,
  rowToServiceAdminForm,
  getServiceCategoryLabel,
  getBooleanLabel,
  getActiveStatusLabel,
} from '@/features/service-admin/api/mock-service-admin';
import {
  useGetServiceAdminsQuery,
  useGetServiceCategoriesQuery,
  useUpdateServiceAdminMutation,
} from '@/features/service-admin/api/serviceAdminApi';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function UpdateAdminServicesPage() {
  const { message } = App.useApp();

  const [form, setForm] = useState(createEmptyServiceAdminForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
   const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingAmountId, setEditingAmountId] = useState(null);
  const [editingAmount, setEditingAmount] = useState(null);

  const { data: rows = [], isLoading } = useGetServiceAdminsQuery();
  const { data: categories = [] } = useGetServiceCategoriesQuery();
  const [updateServiceAdmin] = useUpdateServiceAdminMutation();

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ value: category.value, label: category.serviceName })),
    [categories],
  );

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

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRowId(null);
    setFieldErrors({});
  }, []);

  const handleEditRow = useCallback((record) => {
    setForm(rowToServiceAdminForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleAmountSave = useCallback(async (record) => {
    if (editingAmount == null || editingAmount < 0) return;
    await updateServiceAdmin({ id: record.id, serviceCharges: editingAmount }).unwrap();
    message.success('Amount updated.');
    setEditingAmountId(null);
    setEditingAmount(null);
  }, [editingAmount, updateServiceAdmin, message]);

  const handleExport = useCallback(() => {
    const exportRows = rows.filter((row) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term || row.serviceName?.toLowerCase().includes(term);
      const matchesCategory = !categoryFilter || row.serviceCategory === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    const headers = ['Service Name', 'Service Category', 'Service Amount', 'Edit Status', 'Active Status'];
    const csvRows = [
      headers.join(','),
      ...exportRows.map((row) =>
        [
          `"${row.serviceName ?? ''}"`,
          `"${getServiceCategoryLabel(row.serviceCategory)}"`,
          row.serviceCharges ?? 0,
          `"${getBooleanLabel(row.serviceEditPrice)}"`,
          `"${getActiveStatusLabel(row.activeStatus)}"`,
        ].join(','),
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admin-services.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [rows, searchTerm, categoryFilter]);

  const handleSave = useCallback(async () => {
    const serviceName = form.serviceName.trim();
    const serviceCategory = form.serviceCategory?.trim();
    const serviceHead = form.serviceHead?.trim();

    const errors = {};
    if (!serviceName) errors.serviceName = 'Service Name is required.';
    if (!serviceCategory) errors.serviceCategory = 'Service Category is required.';
    if (form.serviceCharges == null || form.serviceCharges < 0) {
      errors.serviceCharges = 'Service Charges is required.';
    }
    if (!serviceHead) errors.serviceHead = 'Service Head is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    await updateServiceAdmin({
      id: editingRowId,
      serviceName,
      serviceCategory,
      serviceCharges: form.serviceCharges ?? 0,
      serviceChargesBefore: form.serviceChargesBefore,
      serviceEditPrice: form.serviceEditPrice,
      serviceHead,
    }).unwrap();

    setIsModalOpen(false);
    setEditingRowId(null);
    message.success('Service updated.');
  }, [form, editingRowId, updateServiceAdmin, message]);

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const category = categoryFilter.trim();
    return rows.filter((row) => {
      const matchesSearch = !term || row.serviceName?.toLowerCase().includes(term);
      const matchesCategory = !category || row.serviceCategory === category;
      return matchesSearch && matchesCategory;
    });
  }, [rows, searchTerm, categoryFilter]);

  const columns = useMemo(
    () => [
      {
        title: 'Service Name',
        dataIndex: 'serviceName',
        key: 'serviceName',
        width: 220,
      },
      {
        title: 'Service Category',
        dataIndex: 'serviceCategory',
        key: 'serviceCategory',
        width: 180,
        render: (value) => getServiceCategoryLabel(value),
      },
      {
        title: 'Service Amount',
        dataIndex: 'serviceCharges',
        key: 'serviceCharges',
        width: 180,
        render: (value, record) =>
          editingAmountId === record.id ? (
            <InputNumber
              autoFocus
              min={0}
              value={editingAmount}
              onChange={(v) => setEditingAmount(v ?? 0)}
              onPressEnter={() => handleAmountSave(record)}
              style={{ width: '100%' }}
            />
          ) : (
            value != null ? value.toLocaleString() : ''
          ),
      },
      {
        title: 'Edit Status',
        dataIndex: 'serviceEditPrice',
        key: 'serviceEditPrice',
        width: 120,
        render: (value) => getBooleanLabel(value),
      },
      {
        title: 'Active Status',
        dataIndex: 'activeStatus',
        key: 'activeStatus',
        width: 120,
        render: (value) => getActiveStatusLabel(value),
      },
      {
        title: 'Action',
        key: 'action',
        width: 110,
        align: 'center',
        render: (_, record) => (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {editingAmountId === record.id ? (
              <>
                <Tooltip title="Save">
                  <Button
                    type="link"
                    size="small"
                    aria-label="Save amount"
                    icon={
                      <AppIcon
                        icon="mdi:check"
                        className={ACTION_ICON_CLASS}
                      />
                    }
                    onClick={() => handleAmountSave(record)}
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    type="link"
                    size="small"
                    danger
                    aria-label="Cancel edit"
                    icon={
                      <AppIcon
                        icon="mdi:close"
                        className={ACTION_ICON_CLASS}
                      />
                    }
                    onClick={() => {
                      setEditingAmountId(null);
                      setEditingAmount(null);
                    }}
                  />
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Edit">
                <Button
                  type="link"
                  size="small"
                  className="update-admin-services-actions-cell"
                  aria-label="Edit amount"
                  icon={
                    <AppIcon
                      icon="mdi:pencil-outline"
                      className={ACTION_ICON_CLASS}
                    />
                  }
                  onClick={() => {
                    setEditingAmountId(record.id);
                    setEditingAmount(record.serviceCharges ?? 0);
                  }}
                />
              </Tooltip>
            )}
          </div>
        ),
      },
    ],
    [handleEditRow, handleAmountSave, editingAmountId, editingAmount],
  );

  return (
    <div className="services-billing-page update-admin-services-page">
      <div
        className="update-admin-services-table-toolbar"
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}
      >
        <div className="update-admin-services-filters" style={{ display: 'flex', gap: 12 }}>
          <Input
            placeholder="Filter by Service Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            style={{ width: 260 }}
          />
          <Select
            placeholder="Filter by Service Category"
            value={categoryFilter || undefined}
            onChange={(value) => setCategoryFilter(value || '')}
            allowClear
            showSearch
            optionFilterProp="label"
            options={categoryOptions}
            style={{ width: 260 }}
          />
        </div>

        <Button type="primary" onClick={handleExport}>
          Export
        </Button>
      </div>

      <section className="services-billing-results" aria-label="update admin services">
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

      <UpdateAdminServicesModal
        open={isModalOpen}
        onClose={closeModal}
        title="Edit Service"
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
        serviceCategoryOptions={categoryOptions}
      />
    </div>
  );
}