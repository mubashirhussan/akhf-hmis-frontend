'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Select, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import AssignOpdServicesModal from '@/features/service-admin/pages/assign-opd-services/AssignOpdServicesModal';
import { useConfirm } from '@/hooks/useConfirm';
import {
  useGetHospitalsQuery,
  useGetSubDepartmentsQuery,
} from '@/features/human-resource/api/employeeApi';
import {
  useGetPatientTypesQuery,
  useGetServiceCategoriesQuery,
  useGetServiceAdminsQuery,
  useGetAssignOpdServicesQuery,
  useCreateAssignOpdServiceMutation,
  useUpdateAssignOpdServiceMutation,
  useDeleteAssignOpdServiceMutation,
} from '@/features/service-admin/api/serviceAdminApi';
import '@/features/service-admin/pages/assign-opd-services/assign-opd-services.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function getLabelFromOptions(options, value) {
  return options.find((o) => o.value === value)?.label ?? value ?? '—';
}

export default function AssignOpdServicesPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);

  const [filterHospital, setFilterHospital] = useState(undefined);
  const [filterServiceCategory, setFilterServiceCategory] = useState(undefined);
  const [filterService, setFilterService] = useState(undefined);
  const [filterSubDepartment, setFilterSubDepartment] = useState(undefined);

  const { data: hospitals = [] } = useGetHospitalsQuery();
  const { data: allSubDepartments = [] } = useGetSubDepartmentsQuery();
  const { data: patientTypeRows = [] } = useGetPatientTypesQuery();
  const { data: categoryRows = [] } = useGetServiceCategoriesQuery();
  const { data: serviceAdminRows = [] } = useGetServiceAdminsQuery();
  const { data: rows = [], isLoading } = useGetAssignOpdServicesQuery();
  const [createAssignOpdService] = useCreateAssignOpdServiceMutation();
  const [updateAssignOpdService] = useUpdateAssignOpdServiceMutation();
  const [deleteAssignOpdService] = useDeleteAssignOpdServiceMutation();

  const watchedCategory = Form.useWatch('serviceCategory', form);

  const patientTypeOptions = useMemo(
    () => patientTypeRows.map((r) => ({ value: r.id, label: r.patientType })),
    [patientTypeRows],
  );

  const serviceCategoryOptions = useMemo(
    () => categoryRows.map((r) => ({ value: r.value, label: r.serviceName })),
    [categoryRows],
  );

  const serviceOptions = useMemo(() => {
    if (!watchedCategory) return [];
    return serviceAdminRows
      .filter((r) => r.serviceCategory === watchedCategory && r.activeStatus === 'active')
      .map((r) => ({ value: r.id, label: r.serviceName }));
  }, [serviceAdminRows, watchedCategory]);

  const filterServiceOptions = useMemo(() => {
    const base = serviceAdminRows.filter((r) => r.activeStatus === 'active');
    const filtered = filterServiceCategory
      ? base.filter((r) => r.serviceCategory === filterServiceCategory)
      : base;
    return filtered.map((r) => ({ value: r.id, label: r.serviceName }));
  }, [serviceAdminRows, filterServiceCategory]);

  const hospitalOptions = useMemo(
    () => hospitals.map((h) => ({ value: h.id, label: h.name })),
    [hospitals],
  );

  const subDepartmentOptions = useMemo(
    () => allSubDepartments.map((s) => ({ value: s.id, label: s.subDepartmentName })),
    [allSubDepartments],
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
      form.setFieldsValue({
        hospital: record.hospital ?? undefined,
        patientType: record.patientType ?? undefined,
        serviceCategory: record.serviceCategory ?? undefined,
        service: record.service ?? undefined,
        subDepartment: record.subDepartment ?? undefined,
        amount: record.amount ?? null,
      });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

  const handleDeleteRow = useCallback(
    async (record) => {
      const hospitalLabel = getLabelFromOptions(hospitalOptions, record.hospital);
      const confirmed = await confirmDelete({
        itemName: `OPD assignment for ${hospitalLabel}`,
      });
      if (!confirmed) return;
      await deleteAssignOpdService(record.id).unwrap();
      message.success('OPD service assignment deleted.');
    },
    [confirmDelete, deleteAssignOpdService, message, hospitalOptions],
  );

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();

      const hospitalLabel = getLabelFromOptions(hospitalOptions, values.hospital);
      const patientTypeLabel = getLabelFromOptions(patientTypeOptions, values.patientType);
      const serviceCategoryLabel = getLabelFromOptions(
        serviceCategoryOptions,
        values.serviceCategory,
      );
      const serviceLabel = getLabelFromOptions(
        serviceAdminRows.map((r) => ({ value: r.id, label: r.serviceName })),
        values.service,
      );
      const subDepartmentLabel = getLabelFromOptions(subDepartmentOptions, values.subDepartment);

      const payload = {
        hospital: values.hospital,
        hospitalLabel,
        patientType: values.patientType,
        patientTypeLabel,
        serviceCategory: values.serviceCategory,
        serviceCategoryLabel,
        service: values.service,
        serviceLabel,
        subDepartment: values.subDepartment,
        subDepartmentLabel,
        amount: values.amount,
      };

      if (editingRowId) {
        await updateAssignOpdService({ id: editingRowId, ...payload }).unwrap();
        message.success('OPD service assignment updated.');
      } else {
        await createAssignOpdService(payload).unwrap();
        message.success('OPD service assignment added.');
      }
    } catch {
      // validation errors are shown by antd Form
    }
  }, [
    form,
    editingRowId,
    hospitalOptions,
    patientTypeOptions,
    serviceCategoryOptions,
    subDepartmentOptions,
    serviceAdminRows,
    createAssignOpdService,
    updateAssignOpdService,
    message,
  ]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (filterHospital && row.hospital !== filterHospital) return false;
      if (filterServiceCategory && row.serviceCategory !== filterServiceCategory) return false;
      if (filterService && row.service !== filterService) return false;
      if (filterSubDepartment && row.subDepartment !== filterSubDepartment) return false;
      return true;
    });
  }, [rows, filterHospital, filterServiceCategory, filterService, filterSubDepartment]);

  const columns = useMemo(
    () => [
      { title: 'Hospital', dataIndex: 'hospitalLabel', key: 'hospitalLabel', width: 200 },
      { title: 'Patient Type', dataIndex: 'patientTypeLabel', key: 'patientTypeLabel', width: 140 },
      {
        title: 'Service Category',
        dataIndex: 'serviceCategoryLabel',
        key: 'serviceCategoryLabel',
        width: 160,
      },
      { title: 'Service', dataIndex: 'serviceLabel', key: 'serviceLabel', width: 200 },
      {
        title: 'Sub Department',
        dataIndex: 'subDepartmentLabel',
        key: 'subDepartmentLabel',
        width: 150,
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 110,
        render: (val) => (val != null ? val.toLocaleString() : '—'),
      },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        render: (_, record) => (
          <div
            className="assign-opd-services-actions-cell"
            style={{ display: 'flex', gap: 8, justifyContent: 'center' }}
          >
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label="Edit OPD service"
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label="Delete OPD service"
                icon={<AppIcon icon="mdi:delete-outline" className={ACTION_ICON_CLASS} />}
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
    <div className="services-billing-page assign-opd-services-page">
      <div
        className="assign-opd-services-table-toolbar"
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}
      >
        <div className="assign-opd-services-filters" style={{ display: 'flex', gap: 12 }}>
          <Select
            placeholder="Hospital"
            value={filterHospital}
            options={hospitalOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 240 }}
            onChange={(val) => {
              setFilterHospital(val);
              setFilterService(undefined);
            }}
          />
          <Select
            placeholder="Service Category"
            value={filterServiceCategory}
            options={serviceCategoryOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 220 }}
            onChange={(val) => {
              setFilterServiceCategory(val);
              setFilterService(undefined);
            }}
          />
          <Select
            placeholder="Service"
            value={filterService}
            options={filterServiceOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 220 }}
            disabled={!filterServiceCategory}
            onChange={(val) => setFilterService(val)}
          />
          <Select
            placeholder="Sub Department"
            value={filterSubDepartment}
            options={subDepartmentOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 220 }}
            onChange={(val) => setFilterSubDepartment(val)}
          />
        </div>

        <Button type="primary" onClick={openModal}>
          Assign OPD Service
        </Button>
      </div>

      <section className="services-billing-results" aria-label="assign opd services">
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

      <AssignOpdServicesModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit OPD Service Assignment' : 'Assign OPD Service'}
        form={form}
        onSave={handleSave}
        hospitalOptions={hospitalOptions}
        patientTypeOptions={patientTypeOptions}
        serviceCategoryOptions={serviceCategoryOptions}
        serviceOptions={serviceOptions}
        subDepartmentOptions={subDepartmentOptions}
        serviceAdminRows={serviceAdminRows}
      />
    </div>
  );
}
