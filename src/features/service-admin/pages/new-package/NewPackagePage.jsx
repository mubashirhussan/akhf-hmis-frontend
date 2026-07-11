'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Input, Select, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import NewPackageModal from '@/features/service-admin/pages/new-package/NewPackageModal';
import NewPackageLinkageModal from '@/features/service-admin/pages/new-package/NewPackageLinkageModal';
import {
  WARD_OPTIONS,
  rowToPackageForm,
} from '@/features/service-admin/api/mock-service-admin';
import {
  useGetServiceAdminsQuery,
  useGetServiceCategoriesQuery,
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} from '@/features/service-admin/api/serviceAdminApi';
import { useGetDepartmentsQuery } from '@/features/human-resource/api/employeeApi';
import { useConfirm } from '@/hooks/useConfirm';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function NewPackagePage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();

  const [wardFilter, setWardFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);

  const [linkageOpen, setLinkageOpen] = useState(false);
  const [selectedPkgId, setSelectedPkgId] = useState(null);

  const { data: allServiceRows = [] } = useGetServiceAdminsQuery();
  const { data: categories = [] } = useGetServiceCategoriesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: packages = [], isLoading } = useGetPackagesQuery();

  const [createPackage] = useCreatePackageMutation();
  const [updatePackage] = useUpdatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();

  const watchedCategory = Form.useWatch('serviceCategory', form);

  const departmentOptions = useMemo(
    () => departments.map((d) => ({ value: d.id, label: d.departmentName })),
    [departments],
  );

  const serviceOptionsByCategory = useMemo(() => {
    if (!watchedCategory) return [];
    return allServiceRows
      .filter((r) => r.serviceCategory === watchedCategory)
      .map((r) => ({ value: r.serviceName, label: r.serviceName }));
  }, [allServiceRows, watchedCategory]);

  const serviceCategoryOptions = useMemo(
    () => categories.map((category) => ({ value: category.value, label: category.serviceName })),
    [categories],
  );

  const allServiceOptions = useMemo(
    () =>
      allServiceRows.map((r) => ({
        value: r.serviceName,
        label: r.serviceName,
        serviceCategory: r.serviceCategory,
      })),
    [allServiceRows],
  );

  const serviceChargesMap = useMemo(() => {
    const map = {};
    allServiceRows.forEach((r) => {
      map[r.serviceName] = r.serviceCharges ?? 0;
    });
    return map;
  }, [allServiceRows]);

  const selectedPkg = useMemo(
    () => packages.find((p) => p.id === selectedPkgId) ?? null,
    [packages, selectedPkgId],
  );

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
      const values = rowToPackageForm(record);
      form.setFieldsValue({
        ...values,
        ward: values.ward || undefined,
        department: values.department || undefined,
        serviceHead: values.serviceHead || undefined,
        serviceCategory: values.serviceCategory || undefined,
      });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.packageName });
      if (!confirmed) return;
      await deletePackage(record.id).unwrap();
      message.success('Package deleted.');
    },
    [confirmDelete, deletePackage, message],
  );

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ward: values.ward,
        department: values.department,
        packageName: values.packageName.trim(),
        totalAmount: values.totalAmount,
        doctorShare: values.doctorShare,
        description: values.description,
        serviceHead: values.serviceHead,
        serviceCategory: values.serviceCategory,
        services: values.services,
      };

      if (editingRowId) {
        await updatePackage({ id: editingRowId, ...payload }).unwrap();
        message.success('Package updated.');
      } else {
        await createPackage(payload).unwrap();
        message.success('Package created.');
      }
      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [form, editingRowId, createPackage, updatePackage, closeModal, message]);

  const handleLinkageSave = useCallback(
    async (updatedPkg) => {
      await updatePackage({ id: updatedPkg.id, services: updatedPkg.services }).unwrap();
    },
    [updatePackage],
  );

  const filteredRows = useMemo(() => {
    return packages.filter((row) => {
      const matchesWard = !wardFilter || row.ward === wardFilter;
      const matchesDept = !departmentFilter || row.department === departmentFilter;
      const matchesName =
        !nameFilter.trim() ||
        row.packageName?.toLowerCase().includes(nameFilter.trim().toLowerCase());
      return matchesWard && matchesDept && matchesName;
    });
  }, [packages, wardFilter, departmentFilter, nameFilter]);

  const wardFilterOptions = useMemo(
    () => WARD_OPTIONS.filter((o) => o.value !== 'all'),
    [],
  );

  const columns = useMemo(
    () => [
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        width: 160,
        render: (value) =>
          departmentOptions.find((d) => d.value === value)?.label ?? value ?? '—',
      },
      {
        title: 'Package Name',
        dataIndex: 'packageName',
        key: 'packageName',
        width: 180,
        render: (value, record) => (
          <span
            className="new-package-name-link"
            onClick={() => {
              setSelectedPkgId(record.id);
              setLinkageOpen(true);
            }}
          >
            {value}
          </span>
        ),
      },
      {
        title: 'Total Amount',
        key: 'totalAmount',
        width: 130,
        render: (_, record) => {
          const total = (record.services ?? []).reduce(
            (sum, svc) => sum + (serviceChargesMap[svc] ?? 0),
            0,
          );
          return total > 0 ? total.toLocaleString() : '—';
        },
      },
      {
        title: 'Package Amount',
        dataIndex: 'totalAmount',
        key: 'packageAmount',
        width: 140,
        render: (value) => (value != null ? value.toLocaleString() : '—'),
      },
      {
        title: 'Discount Given',
        key: 'discountGiven',
        width: 140,
        render: (_, record) => {
          const servicesTotal = (record.services ?? []).reduce(
            (sum, svc) => sum + (serviceChargesMap[svc] ?? 0),
            0,
          );
          const discount = servicesTotal - (record.totalAmount ?? 0);
          return discount > 0 ? discount.toLocaleString() : '—';
        },
      },
      {
        title: 'Doctor Share',
        dataIndex: 'doctorShare',
        key: 'doctorShare',
        width: 130,
        render: (value) => (value != null ? value.toLocaleString() : '—'),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 200,
        render: (value) => value || '—',
      },
      {
        title: 'On Date',
        dataIndex: 'onDate',
        key: 'onDate',
        width: 160,
        render: (value) => (value ? new Date(value).toLocaleString() : '—'),
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
                className="new-package-actions-cell"
                aria-label="Edit package"
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label="Delete package"
                icon={<AppIcon icon="mdi:delete-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleDeleteRow(record)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [handleEditRow, handleDeleteRow, departmentOptions, serviceChargesMap],
  );

  return (
    <div className="services-billing-page new-package-page">
      <div
        className="new-package-table-toolbar"
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}
      >
        <div className="new-package-filters" style={{ display: 'flex', gap: 12 }}>
          <Select
            placeholder="Filter by Ward"
            value={wardFilter || undefined}
            onChange={(v) => setWardFilter(v || '')}
            allowClear
            options={wardFilterOptions}
            style={{ width: 180 }}
          />
          <Select
            placeholder="Filter by Department"
            value={departmentFilter || undefined}
            onChange={(v) => setDepartmentFilter(v || '')}
            allowClear
            showSearch
            optionFilterProp="label"
            options={departmentOptions}
            style={{ width: 220 }}
          />
          <Input
            placeholder="Filter by Package Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            allowClear
            style={{ width: 220 }}
          />
        </div>

        <Button type="primary" onClick={openModal}>
          Add Package
        </Button>
      </div>

      <section className="services-billing-results" aria-label="packages">
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

      <NewPackageModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Package' : 'Add Package'}
        form={form}
        onSave={handleSave}
        departmentOptions={departmentOptions}
        serviceCategoryOptions={serviceCategoryOptions}
        serviceOptions={serviceOptionsByCategory}
        serviceChargesMap={serviceChargesMap}
      />

      <NewPackageLinkageModal
        open={linkageOpen}
        onClose={() => {
          setLinkageOpen(false);
          setSelectedPkgId(null);
        }}
        pkg={selectedPkg}
        allServices={allServiceOptions}
        allServiceRows={allServiceRows}
        onSave={handleLinkageSave}
      />
    </div>
  );
}
