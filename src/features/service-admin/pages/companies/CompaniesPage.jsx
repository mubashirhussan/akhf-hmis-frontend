'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Input, Select, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import CompanyModal from '@/features/service-admin/pages/companies/CompanyModal';
import CompanyDetailsModal from '@/features/service-admin/pages/companies/CompanyDetailsModal';
import { useConfirm } from '@/hooks/useConfirm';
import {
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useGetCompaniesQuery,
  useUpdateCompanyMutation,
} from '@/features/service-admin/api/serviceAdminApi';

const COMPANY_TYPE_OPTIONS = [
  { label: 'Gov', value: 'gov' },
  { label: 'Semi Gov', value: 'semi-gov' },
  { label: 'Priv', value: 'priv' },
];

const STATUS_OPTIONS = [
  { label: 'Individuals', value: 'individuals' },
  { label: 'NGO', value: 'ngo' },
  { label: 'Business', value: 'business' },
  { label: 'Trust', value: 'trust' },
];

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';
const controlClass = FIELD_CONTROL_CLASS;

function createEmptyForm() {
  return {
    companyType: '',
    companyName: '',
    ntn: '',
    city: '',
    address: '',
    contactPersonName: '',
    cnic: '',
    phone: '',
    fax: '',
    email: '',
    website: '',
    str: '',
    bankAccount: '',
    status: '',
  };
}

export default function CompaniesPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [form, setForm] = useState(createEmptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [viewingRow, setViewingRow] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [filters, setFilters] = useState({
    companyType: '',
    title: '',
    city: '',
    email: '',
    website: '',
    status: '',
  });

  const { data: rows = [], isLoading } = useGetCompaniesQuery();
  const [createCompany] = useCreateCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();

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

  const patchFilters = useCallback((patch) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const handleClear = useCallback(() => {
    setFilters({
      companyType: '',
      title: '',
      city: '',
      email: '',
      website: '',
      status: '',
    });
  }, []);

  const openModal = useCallback(() => {
    setForm(createEmptyForm());
    setEditingRowId(null);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRowId(null);
    setFieldErrors({});
  }, []);

  const handleEditRow = useCallback((record) => {
    setForm({
      companyType: record.companyType ?? '',
      companyName: record.companyName ?? '',
      ntn: record.ntn ?? '',
      city: record.city ?? '',
      address: record.address ?? '',
      contactPersonName: record.contactPersonName ?? '',
      cnic: record.cnic ?? '',
      phone: record.phone ?? '',
      fax: record.fax ?? '',
      email: record.email ?? '',
      website: record.website ?? '',
      str: record.str ?? '',
      bankAccount: record.bankAccount ?? '',
      status: record.status ?? '',
    });
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleViewRow = useCallback((record) => {
    setViewingRow(record);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.companyName });
      if (!confirmed) return;
      await deleteCompany(record.id).unwrap();
      message.success('Company deleted.');
    },
    [confirmDelete, deleteCompany, message],
  );

  const handleSave = useCallback(async () => {
    const errors = {};
    if (!form.companyType) errors.companyType = 'Company Type is required.';
    if (!form.companyName?.trim()) errors.companyName = 'Company Name is required.';
    if (!form.city?.trim()) errors.city = 'City is required.';
    if (!form.email?.trim()) errors.email = 'Email is required.';
    if (!form.website?.trim()) errors.website = 'Website is required.';
    if (!form.status) errors.status = 'Status is required.';

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      companyType: form.companyType,
      companyName: form.companyName.trim(),
      ntn: form.ntn,
      city: form.city.trim(),
      address: form.address.trim(),
      contactPersonName: form.contactPersonName.trim(),
      cnic: form.cnic,
      phone: form.phone,
      fax: form.fax,
      email: form.email.trim(),
      website: form.website.trim(),
      str: form.str,
      bankAccount: form.bankAccount,
      status: form.status,
    };

    if (editingRowId) {
      await updateCompany({ id: editingRowId, ...payload }).unwrap();
      message.success('Company updated.');
    } else {
      await createCompany(payload).unwrap();
      message.success('Company created.');
    }

    closeModal();
  }, [closeModal, createCompany, editingRowId, form, message, updateCompany]);

  const filteredRows = useMemo(() => {
    const termTitle = filters.title.trim().toLowerCase();
    const termCity = filters.city.trim().toLowerCase();
    const termEmail = filters.email.trim().toLowerCase();
    const termWebsite = filters.website.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesType = !filters.companyType || row.companyType === filters.companyType;
      const matchesTitle = !termTitle || row.companyName?.toLowerCase().includes(termTitle);
      const matchesCity = !termCity || row.city?.toLowerCase().includes(termCity);
      const matchesEmail = !termEmail || row.email?.toLowerCase().includes(termEmail);
      const matchesWebsite = !termWebsite || row.website?.toLowerCase().includes(termWebsite);
      const matchesStatus = !filters.status || row.status === filters.status;
      return matchesType && matchesTitle && matchesCity && matchesEmail && matchesWebsite && matchesStatus;
    });
  }, [filters, rows]);

  const columns = useMemo(
    () => [
      {
        title: 'Company Type',
        dataIndex: 'companyType',
        key: 'companyType',
        width: 140,
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 220,
        render: (value, record) => (
          <button
            type="button"
            className="company-name-link"
            onClick={() => handleViewRow(record)}
          >
            {value}
          </button>
        ),
      },
      {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
        width: 140,
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        width: 220,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 180,
      },
      {
        title: 'Website',
        dataIndex: 'website',
        key: 'website',
        width: 180,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 140,
      },
      {
        title: 'Action',
        key: 'action',
        width: 100,
        align: 'center',
        render: (_, record) => (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label="Edit company"
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label="Delete company"
                icon={<AppIcon icon="mdi:delete-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleDeleteRow(record)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [handleDeleteRow, handleEditRow, handleViewRow],
  );

  return (
    <div className="services-billing-page companies-page">
      <section className="company-filter-panel" aria-label="Company search filters">
        <div className="walk-in-add-record-layout company-search-layout">
          <FormGrid
            as="form"
            columns={4}
            className="walk-in-add-record-form company-search-form"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <FloatingField label="Company Type" htmlFor="company-filter-company-type">
              <Select
                id="company-filter-company-type"
                className={controlClass}
                placeholder="Select type"
                value={filters.companyType || undefined}
                onChange={(companyType) => patchFilters({ companyType })}
                options={COMPANY_TYPE_OPTIONS}
                allowClear
                autoComplete="off"
              />
            </FloatingField>

            <FloatingField label="Company Title" htmlFor="company-filter-title">
              <Input
                id="company-filter-title"
                className={controlClass}
                placeholder="Enter title"
                value={filters.title}
                onChange={(e) => patchFilters({ title: e.target.value })}
                allowClear
                autoComplete="off"
              />
            </FloatingField>

            <FloatingField label="City" htmlFor="company-filter-city">
              <Input
                id="company-filter-city"
                className={controlClass}
                placeholder="Enter city"
                value={filters.city}
                onChange={(e) => patchFilters({ city: e.target.value })}
                allowClear
                autoComplete="off"
              />
            </FloatingField>

            <FloatingField label="Status" htmlFor="company-filter-status">
              <Select
                id="company-filter-status"
                className={controlClass}
                placeholder="Select status"
                value={filters.status || undefined}
                onChange={(status) => patchFilters({ status })}
                options={STATUS_OPTIONS}
                allowClear
                autoComplete="off"
              />
            </FloatingField>

            <FloatingField label="Email" htmlFor="company-filter-email">
              <Input
                id="company-filter-email"
                className={controlClass}
                placeholder="Enter email"
                value={filters.email}
                onChange={(e) => patchFilters({ email: e.target.value })}
                allowClear
                autoComplete="off"
              />
            </FloatingField>

            <FloatingField label="Website" htmlFor="company-filter-website">
              <Input
                id="company-filter-website"
                className={controlClass}
                placeholder="Enter website"
                value={filters.website}
                onChange={(e) => patchFilters({ website: e.target.value })}
                allowClear
                autoComplete="off"
              />
            </FloatingField>

            <div className="company-search-actions">
              <Button type="link" className="patient-reg-btn-clear" onClick={handleClear}>
                Clear
              </Button>
              <Button type="default" className="hr-search-btn" icon={<SearchOutlined />} htmlType="submit" loading={isLoading}>
                Search
              </Button>
            </div>
          </FormGrid>
        </div>
      </section>

      <section className="services-billing-results" aria-label="company records">
        <div className="company-table-toolbar">
          <Button type="primary" onClick={openModal}>
            Add New Company
          </Button>
        </div>
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

      <CompanyModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Company' : 'Add New Company'}
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
        companyTypeOptions={COMPANY_TYPE_OPTIONS}
        statusOptions={STATUS_OPTIONS}
      />

      <CompanyDetailsModal
        open={Boolean(viewingRow)}
        onClose={() => setViewingRow(null)}
        company={viewingRow}
      />
    </div>
  );
}
