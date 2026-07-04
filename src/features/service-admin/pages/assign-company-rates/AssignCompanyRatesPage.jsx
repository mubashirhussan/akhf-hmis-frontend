'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { App, Button, Input, Select, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import AssignCompanyRatesModal from '@/features/service-admin/pages/assign-company-rates/AssignCompanyRatesModal';
import { getServiceHeadLabel } from '@/features/service-admin/api/mock-service-admin';
import {
  useGetCompaniesQuery,
  useGetServiceCategoriesQuery,
  useGetCompanyServicesQuery,
  useBulkUpdateCompanyServicePricesMutation,
} from '@/features/service-admin/api/serviceAdminApi';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function createEmptyBulkForm() {
  return { adjustType: '', adjustMode: '', percentage: null, fixedAmount: null };
}

export default function AssignCompanyRatesPage() {
  const { message } = App.useApp();

  const [companyId, setCompanyId] = useState(undefined);
  const [categoryFilter, setCategoryFilter] = useState(undefined);
  const [nameFilter, setNameFilter] = useState('');

  const [selectedIds, setSelectedIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkForm, setBulkForm] = useState(createEmptyBulkForm);
  const [fieldErrors, setFieldErrors] = useState({});



  const { data: companies = [] } = useGetCompaniesQuery();
  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: c.companyName })),
    [companies],
  );

  const { data: categories = [] } = useGetServiceCategoriesQuery();
  const categoryOptions = useMemo(
    () => categories.map((cat) => ({ value: cat.value, label: cat.serviceName })),
    [categories],
  );

  useEffect(() => {
    if (companyOptions.length > 0 && companyId === undefined) {
      setCompanyId(companyOptions[0].value);
    }
  }, [companyOptions, companyId]);

  useEffect(() => {
    if (categoryOptions.length > 0 && categoryFilter === undefined) {
      setCategoryFilter(categoryOptions[0].value);
    }
  }, [categoryOptions, categoryFilter]);

  const { data: rows = [], isLoading } = useGetCompanyServicesQuery(
    { companyId, categoryFilter: categoryFilter ?? '', nameFilter },
    { skip: !companyId },
  );

  const [bulkUpdatePrices] = useBulkUpdateCompanyServicePricesMutation();

  const patchBulkForm = useCallback((patch) => {
    setBulkForm((current) => ({ ...current, ...patch }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const allIds = useMemo(() => rows.map((r) => r.id), [rows]);
  const allSelected = allIds.length > 0 && selectedIds.length === allIds.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const toggleSelectAll = useCallback(() => {
    setSelectedIds(allSelected ? [] : [...allIds]);
  }, [allSelected, allIds]);

  const toggleRow = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const openModal = useCallback((record) => {
    setBulkForm({ ...createEmptyBulkForm(), currentAmount: record?.price ?? null });
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setFieldErrors({});
  }, []);

  const handleBulkSave = useCallback(async () => {
    const errors = {};
    if (!bulkForm.adjustType) errors.adjustType = 'Adjustment Type is required.';
    if (!bulkForm.adjustMode) errors.adjustMode = 'Adjustment Mode is required.';
    if (bulkForm.adjustMode === 'percentage' && (!bulkForm.percentage || bulkForm.percentage <= 0)) {
      errors.percentage = 'Percentage is required.';
    }
    if (bulkForm.adjustMode === 'fixed' && (!bulkForm.fixedAmount || bulkForm.fixedAmount <= 0)) {
      errors.fixedAmount = 'Fixed Amount is required.';
    }
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    await bulkUpdatePrices({
      companyId,
      serviceIds: selectedIds,
      type: bulkForm.adjustType,
      percentage: bulkForm.adjustMode === 'percentage' ? bulkForm.percentage : null,
      fixedAmount: bulkForm.adjustMode === 'fixed' ? bulkForm.fixedAmount : null,
    }).unwrap();
    message.success('Prices updated successfully.');
    setSelectedIds([]);
    setIsModalOpen(false);
  }, [bulkForm, companyId, selectedIds, bulkUpdatePrices, message]);

  

  const updatePricesEnabled = selectedIds.length >= 2;
  const singleSelected = selectedIds.length === 1;

  const columns = useMemo(
    () => [
      {
        title: (
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => { if (el) el.indeterminate = someSelected; }}
            onChange={toggleSelectAll}
            style={{ cursor: 'pointer' }}
          />
        ),
        key: 'checkbox',
        width: 40,
        align: 'center',
        render: (_, record) => (
          <input
            type="checkbox"
            checked={selectedIds.includes(record.id)}
            onChange={() => toggleRow(record.id)}
            style={{ cursor: 'pointer' }}
          />
        ),
      },
      {
        title: 'Service Name',
        dataIndex: 'serviceName',
        key: 'serviceName',
        width: 220,
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        width: 180,
        render: (value) => (value != null ? value.toLocaleString() : ''),
      },
      {
        title: 'IPD/OPD',
        dataIndex: 'serviceHead',
        key: 'serviceHead',
        width: 140,
        render: (value) => getServiceHeadLabel(value),
      },
      {
        title: 'Action',
        key: 'action',
        width: 80,
        align: 'center',
        render: (_, record) => {
          const isThisRowSelected = singleSelected && selectedIds[0] === record.id;
          return (
            <div className="assign-company-rates-actions-cell">
              <Tooltip title="Edit Price">
                <Button
                  type="link"
                  size="small"
                  disabled={!isThisRowSelected}
                  className="assign-company-rates-actions-cell"
                  aria-label="Edit price"
                  icon={
                    <AppIcon
                      icon="mdi:pencil-outline"
                      className={ACTION_ICON_CLASS}
                    />
                  }
                  onClick={() => openModal(record)}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [
      allSelected,
      someSelected,
      toggleSelectAll,
      selectedIds,
      toggleRow,
      singleSelected,
      openModal,
    ],
  );

  return (
    <div className="services-billing-page assign-company-rates-page">
      <div
        className="assign-company-rates-table-toolbar"
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}
      >
        <div className="assign-company-rates-filters" style={{ display: 'flex', gap: 12 }}>
          <Select
            placeholder="Select Company"
            value={companyId}
            onChange={(v) => {
              setCompanyId(v);
              setSelectedIds([]);
            }}
            showSearch
            optionFilterProp="label"
            options={companyOptions}
            style={{ width: 240 }}
          />
          <Select
            placeholder="Select Service Category"
            value={categoryFilter}
            onChange={(v) => {
              setCategoryFilter(v);
              setSelectedIds([]);
            }}
            allowClear
            showSearch
            optionFilterProp="label"
            options={categoryOptions}
            style={{ width: 220 }}
            disabled={!companyId}
          />
          <Input
            placeholder="Filter by Service Name"
            value={nameFilter}
            onChange={(e) => {
              setNameFilter(e.target.value);
              setSelectedIds([]);
            }}
            allowClear
            style={{ width: 220 }}
            disabled={!companyId}
          />
        </div>

        <Tooltip title={!updatePricesEnabled ? 'Select 2 or more services to adjust prices' : ''}>
          <Button
            type="primary"
            disabled={!updatePricesEnabled}
            onClick={() => openModal()}
          >
            Adjust Prices
          </Button>
        </Tooltip>
      </div>

      <section className="services-billing-results" aria-label="company services">
        {!companyId ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--app-text-secondary, #999)' }}>
            Please select a company to view services.
          </div>
        ) : (
          <DataTable
            rowKey="id"
            columns={columns}
            dataSource={rows}
            loading={isLoading}
            columnAlign="left"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total) => `Total ${total} items`,
            }}
          />
        )}
      </section>

      <AssignCompanyRatesModal
        open={isModalOpen}
        onClose={closeModal}
        form={bulkForm}
        errors={fieldErrors}
        onPatchForm={patchBulkForm}
        onClearError={clearFieldError}
        onSave={handleBulkSave}
      />
    </div>
  );
}