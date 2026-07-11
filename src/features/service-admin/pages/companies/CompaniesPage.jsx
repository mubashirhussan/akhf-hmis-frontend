'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import DynamicForm from '@/components/form/DynamicForm';
import CompanyModal from '@/features/service-admin/pages/companies/CompanyModal';
import CompanyDetailsModal from '@/features/service-admin/pages/companies/CompanyDetailsModal';
import {
  COMPANY_FILTER_FIELDS,
  COMPANY_FILTER_INITIAL_VALUES,
} from '@/features/service-admin/pages/companies/company-fields';
import { useConfirm } from '@/hooks/useConfirm';
import {
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useGetCompaniesQuery,
  useUpdateCompanyMutation,
} from '@/features/service-admin/api/serviceAdminApi';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function CompaniesPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [viewingRow, setViewingRow] = useState(null);
  const [filters, setFilters] = useState(COMPANY_FILTER_INITIAL_VALUES);

  const { data: rows = [], isLoading } = useGetCompaniesQuery();
  const [createCompany] = useCreateCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();

  const handleClear = useCallback(() => {
    filterForm.resetFields();
    setFilters(COMPANY_FILTER_INITIAL_VALUES);
  }, [filterForm]);

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
      form.setFieldsValue({
        companyType: record.companyType || undefined,
        companyName: record.companyName ?? '',
        ntn: record.ntn ?? null,
        city: record.city ?? '',
        address: record.address ?? '',
        contactPersonName: record.contactPersonName ?? '',
        cnic: record.cnic ?? '',
        phone: record.phone ?? '',
        fax: record.fax ?? null,
        email: record.email ?? '',
        website: record.website ?? '',
        str: record.str ?? null,
        bankAccount: record.bankAccount ?? '',
        status: record.status || undefined,
      });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

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
    try {
      const values = await form.validateFields();
      const payload = {
        companyType: values.companyType,
        companyName: values.companyName.trim(),
        ntn: values.ntn,
        city: values.city.trim(),
        address: (values.address ?? '').trim(),
        contactPersonName: (values.contactPersonName ?? '').trim(),
        cnic: values.cnic,
        phone: values.phone,
        fax: values.fax,
        email: values.email.trim(),
        website: values.website.trim(),
        str: values.str,
        bankAccount: values.bankAccount,
        status: values.status,
      };

      if (editingRowId) {
        await updateCompany({ id: editingRowId, ...payload }).unwrap();
        message.success('Company updated.');
      } else {
        await createCompany(payload).unwrap();
        message.success('Company created.');
      }

      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [closeModal, createCompany, editingRowId, form, message, updateCompany]);

  const filteredRows = useMemo(() => {
    const termTitle = (filters.title ?? '').trim().toLowerCase();
    const termCity = (filters.city ?? '').trim().toLowerCase();
    const termEmail = (filters.email ?? '').trim().toLowerCase();
    const termWebsite = (filters.website ?? '').trim().toLowerCase();
    return rows.filter((row) => {
      const matchesType = !filters.companyType || row.companyType === filters.companyType;
      const matchesTitle = !termTitle || row.companyName?.toLowerCase().includes(termTitle);
      const matchesCity = !termCity || row.city?.toLowerCase().includes(termCity);
      const matchesEmail = !termEmail || row.email?.toLowerCase().includes(termEmail);
      const matchesWebsite = !termWebsite || row.website?.toLowerCase().includes(termWebsite);
      const matchesStatus = !filters.status || row.status === filters.status;
      return (
        matchesType &&
        matchesTitle &&
        matchesCity &&
        matchesEmail &&
        matchesWebsite &&
        matchesStatus
      );
    });
  }, [filters, rows]);

  const columns = useMemo(
    () => [
      { title: 'Company Type', dataIndex: 'companyType', key: 'companyType', width: 140 },
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
      { title: 'City', dataIndex: 'city', key: 'city', width: 140 },
      { title: 'Address', dataIndex: 'address', key: 'address', width: 220 },
      { title: 'Email', dataIndex: 'email', key: 'email', width: 180 },
      { title: 'Website', dataIndex: 'website', key: 'website', width: 180 },
      { title: 'Status', dataIndex: 'status', key: 'status', width: 140 },
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
          <Form
            form={filterForm}
            layout="vertical"
            initialValues={COMPANY_FILTER_INITIAL_VALUES}
            className="walk-in-add-record-form company-search-form"
            onValuesChange={(_, allValues) => setFilters(allValues)}
            onFinish={() => setFilters(filterForm.getFieldsValue())}
          >
            <DynamicForm fields={COMPANY_FILTER_FIELDS} gutter={[16, 12]} />
            <div className="company-search-actions">
              <Button type="link" className="patient-reg-btn-clear" onClick={handleClear}>
                Clear
              </Button>
              <Button
                type="default"
                className="hr-search-btn"
                icon={<SearchOutlined />}
                htmlType="submit"
                loading={isLoading}
              >
                Search
              </Button>
            </div>
          </Form>
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
        onSave={handleSave}
      />

      <CompanyDetailsModal
        open={Boolean(viewingRow)}
        onClose={() => setViewingRow(null)}
        company={viewingRow}
      />
    </div>
  );
}
