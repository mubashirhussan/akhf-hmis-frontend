'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { App, Button, Form, Input, Select, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import HospitalServicesModal from '@/features/service-admin/pages/hospital-services/HospitalServicesModal';
import { getServiceHeadLabel } from '@/features/service-admin/api/mock-service-admin';
import {
  useGetHospitalServicesQuery,
  useGetServiceCategoriesQuery,
  useBulkUpdateHospitalServicePricesMutation,
} from '@/features/service-admin/api/serviceAdminApi';
import { useGetHospitalsQuery } from '@/features/human-resource/api/employeeApi';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function HospitalServicesPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [hospitalId, setHospitalId] = useState(undefined);
  const [categoryFilter, setCategoryFilter] = useState('laboratory');
  const [nameFilter, setNameFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const { data: categories = [] } = useGetServiceCategoriesQuery();
  const categoryOptions = useMemo(
    () => categories.map((category) => ({ value: category.value, label: category.serviceName })),
    [categories],
  );

  const { data: rows = [], isLoading } = useGetHospitalServicesQuery(
    { hospitalId, categoryFilter: categoryFilter ?? '', nameFilter },
    { skip: !hospitalId },
  );

  const [bulkUpdatePrices] = useBulkUpdateHospitalServicePricesMutation();

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

  const openModal = useCallback(
    (record) => {
      form.resetFields();
      form.setFieldsValue({ currentAmount: record?.price ?? null });
      setIsModalOpen(true);
    },
    [form],
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    form.resetFields();
  }, [form]);

  const handleBulkSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      await bulkUpdatePrices({
        hospitalId,
        serviceIds: selectedIds,
        type: values.adjustType,
        percentage: values.adjustMode === 'percentage' ? values.percentage : null,
        fixedAmount: values.adjustMode === 'fixed' ? values.fixedAmount : null,
      }).unwrap();
      message.success('Prices updated successfully.');
      setSelectedIds([]);
      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [form, hospitalId, selectedIds, bulkUpdatePrices, message, closeModal]);

  const updatePricesEnabled = selectedIds.length >= 2;
  const singleSelected = selectedIds.length === 1;

  const columns = useMemo(
    () => [
      {
        title: (
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected;
            }}
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
            <div className="hospital-services-actions-cell">
              <Tooltip title="Edit Price">
                <Button
                  type="link"
                  size="small"
                  disabled={!isThisRowSelected}
                  className="hospital-services-actions-cell"
                  aria-label="Edit price"
                  icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                  onClick={() => openModal(record)}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [allSelected, someSelected, toggleSelectAll, selectedIds, toggleRow, singleSelected, openModal],
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
            }}
            allowClear
            showSearch
            optionFilterProp="label"
            options={categoryOptions}
            style={{ width: 220 }}
            disabled={!hospitalId}
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
            disabled={!hospitalId}
          />
        </div>

        <Tooltip title={!updatePricesEnabled ? 'Select 2 or more services to update prices' : ''}>
          <Button type="primary" disabled={!updatePricesEnabled} onClick={() => openModal()}>
            Update Prices
          </Button>
        </Tooltip>
      </div>

      <section className="services-billing-results" aria-label="hospital services">
        {!hospitalId ? (
          <div
            style={{
              padding: '40px 0',
              textAlign: 'center',
              color: 'var(--app-text-secondary, #999)',
            }}
          >
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
        form={form}
        onSave={handleBulkSave}
      />
    </div>
  );
}
