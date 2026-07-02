'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { App, Button, Input, InputNumber, Select, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import HospitalServicesModal from '@/features/service-admin/pages/hospital-services/HospitalServicesModal';
import {
  SERVICE_CATEGORY_OPTIONS,
  getServiceHeadLabel,
} from '@/features/service-admin/api/mock-service-admin';
import {
  useGetHospitalServicesQuery,
  useUpdateHospitalServicePriceMutation,
  useBulkUpdateHospitalServicePricesMutation,
} from '@/features/service-admin/api/serviceAdminApi';
import { useGetHospitalsQuery } from '@/features/human-resource/api/employeeApi';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function createEmptyBulkForm() {
  return { adjustType: '', percentage: null };
}

export default function HospitalServicesPage() {
  const { message } = App.useApp();

const [hospitalId, setHospitalId] = useState(undefined);
const [categoryFilter, setCategoryFilter] = useState('laboratory');
  const [nameFilter, setNameFilter] = useState('');

  const [selectedIds, setSelectedIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkForm, setBulkForm] = useState(createEmptyBulkForm);
  const [fieldErrors, setFieldErrors] = useState({});

  const [inlineEditId, setInlineEditId] = useState(null);
  const [inlineEditPrice, setInlineEditPrice] = useState(null);

  const { data: hospitals = [] } = useGetHospitalsQuery();

const hospitalOptions = useMemo(
  () => hospitals.map((h) => ({ value: h.id, label: h.name })),
  [hospitals],
);

useEffect(() => {
  if (hospitalOptions.length > 0 && hospitalId === undefined) {
    setHospitalId(hospitalOptions[0].value);
  }
}, [hospitalOptions, hospitalId]);

  const { data: rows = [], isLoading } = useGetHospitalServicesQuery(
    { hospitalId, categoryFilter: categoryFilter ?? '', nameFilter },
    { skip: !hospitalId },
  );

  const [updateHospitalServicePrice] = useUpdateHospitalServicePriceMutation();
  const [bulkUpdatePrices] = useBulkUpdateHospitalServicePricesMutation();

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
    setInlineEditId(null);
  }, [allSelected, allIds]);

  const toggleRow = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setInlineEditId(null);
  }, []);

  const openModal = useCallback(() => {
    setBulkForm(createEmptyBulkForm());
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
    if (!bulkForm.percentage || bulkForm.percentage <= 0) errors.percentage = 'Percentage is required.';
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    await bulkUpdatePrices({
      hospitalId,
      serviceIds: selectedIds,
      type: bulkForm.adjustType,
      percentage: bulkForm.percentage,
    }).unwrap();
    message.success('Prices updated successfully.');
    setSelectedIds([]);
    setIsModalOpen(false);
  }, [bulkForm, hospitalId, selectedIds, bulkUpdatePrices, message]);

  const openInlineEdit = useCallback((record) => {
    setInlineEditId(record.id);
    setInlineEditPrice(record.price);
  }, []);

  const cancelInlineEdit = useCallback(() => {
    setInlineEditId(null);
    setInlineEditPrice(null);
  }, []);

  const saveInlineEdit = useCallback(async () => {
    if (inlineEditPrice == null || inlineEditPrice < 0) {
      message.error('Please enter a valid price.');
      return;
    }
    await updateHospitalServicePrice({
      hospitalId,
      serviceId: inlineEditId,
      price: inlineEditPrice,
    }).unwrap();
    message.success('Price updated.');
    setInlineEditId(null);
    setInlineEditPrice(null);
  }, [hospitalId, inlineEditId, inlineEditPrice, updateHospitalServicePrice, message]);

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
        render: (value, record) => {
          if (inlineEditId === record.id) {
            return (
              <div className="hospital-services-inline-edit">
                <InputNumber
                  min={0}
                  value={inlineEditPrice}
                  onChange={(v) => setInlineEditPrice(v ?? 0)}
                  autoFocus
                />
                <Tooltip title="Save">
                  <Button
                    type="link"
                    size="small"
                    icon={<AppIcon icon="mdi:check" className={ACTION_ICON_CLASS} />}
                    onClick={saveInlineEdit}
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<AppIcon icon="mdi:close" className={ACTION_ICON_CLASS} />}
                    onClick={cancelInlineEdit}
                  />
                </Tooltip>
              </div>
            );
          }
          return value != null ? value.toLocaleString() : '';
        },
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
            <div className="hospital-services-actions-cell">
              <Tooltip title="Edit Price">
                <Button
                  type="link"
                  size="small"
                  disabled={!isThisRowSelected || inlineEditId != null}
                  className="hospital-services-actions-cell"
                  aria-label="Edit price"
                  icon={
                    <AppIcon
                      icon="mdi:pencil-outline"
                      className={ACTION_ICON_CLASS}
                    />
                  }
                  onClick={() => openInlineEdit(record)}
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
      inlineEditId,
      inlineEditPrice,
      singleSelected,
      saveInlineEdit,
      cancelInlineEdit,
      openInlineEdit,
    ],
  );

  return (
    <div className="services-billing-page hospital-services-page">
      <div
        className="hospital-services-table-toolbar"
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}
      >
        <div className="hospital-services-filters" style={{ display: 'flex', gap: 12 }}>
          <Select
            placeholder="Select Hospital"
            value={hospitalId}
            onChange={(v) => {
              setHospitalId(v);
              setSelectedIds([]);
              setInlineEditId(null);
            }}
            showSearch
            optionFilterProp="label"
            options={hospitalOptions}
            style={{ width: 240 }}
          />
          <Select
            placeholder="Select Service Category"
            value={categoryFilter}
            onChange={(v) => {
              setCategoryFilter(v);
              setSelectedIds([]);
              setInlineEditId(null);
            }}
            allowClear
            showSearch
            optionFilterProp="label"
            options={SERVICE_CATEGORY_OPTIONS}
            style={{ width: 220 }}
            disabled={!hospitalId}
          />
          <Input
            placeholder="Filter by Service Name"
            value={nameFilter}
            onChange={(e) => {
              setNameFilter(e.target.value);
              setSelectedIds([]);
              setInlineEditId(null);
            }}
            allowClear
            style={{ width: 220 }}
            disabled={!hospitalId}
          />
        </div>

        <Tooltip title={!updatePricesEnabled ? 'Select 2 or more services to update prices' : ''}>
          <Button
            type="primary"
            disabled={!updatePricesEnabled}
            onClick={openModal}
          >
            Update Prices
          </Button>
        </Tooltip>
      </div>

      <section className="services-billing-results" aria-label="hospital services">
        {!hospitalId ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--app-text-secondary, #999)' }}>
            Please select a hospital to view services.
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

      <HospitalServicesModal
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