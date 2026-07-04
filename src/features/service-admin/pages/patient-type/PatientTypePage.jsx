'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Input, Select, Tag, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import PatientTypeModal from '@/features/service-admin/pages/patient-type/PatientTypeModal';
import { useConfirm } from '@/hooks/useConfirm';
import {
  useGetPatientTypesQuery,
  useCreatePatientTypeMutation,
  useUpdatePatientTypeMutation,
  useDeletePatientTypeMutation,
} from '@/features/service-admin/api/serviceAdminApi';
import {
  B2B_LABS_OPTIONS,
  ACTIVE_STATUS_OPTIONS,
} from '@/features/service-admin/api/mock-service-admin';
import '@/features/service-admin/pages/patient-type/patient-type.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function createEmptyForm() {
  return { patientType: '', b2bLabs: '', status: 'active' };
}

export default function PatientTypePage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [form, setForm] = useState(createEmptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // filter state
  const [filterPatientType, setFilterPatientType] = useState('');
  const [filterB2b, setFilterB2b] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const { data: rows = [], isLoading } = useGetPatientTypesQuery();
  const [createPatientType] = useCreatePatientTypeMutation();
  const [updatePatientType] = useUpdatePatientTypeMutation();
  const [deletePatientType] = useDeletePatientTypeMutation();

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
      patientType: record.patientType ?? '',
      b2bLabs: record.b2bLabs ?? '',
      status: record.status ?? 'active',
    });
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.patientType });
      if (!confirmed) return;
      await deletePatientType(record.id).unwrap();
      message.success('Patient type deleted.');
    },
    [confirmDelete, deletePatientType, message],
  );

  const handleSave = useCallback(async () => {
    const patientType = form.patientType.trim();
    const errors = {};

    if (!patientType) errors.patientType = 'Patient Type is required.';
    if (!form.b2bLabs) errors.b2bLabs = 'B2B LABS is required.';
    if (editingRowId && !form.status) errors.status = 'Status is required.';

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    if (editingRowId) {
      await updatePatientType({
        id: editingRowId,
        patientType,
        b2bLabs: form.b2bLabs,
        status: form.status,
      }).unwrap();
      message.success('Patient type updated.');
    } else {
      await createPatientType({ patientType, b2bLabs: form.b2bLabs }).unwrap();
      message.success('Patient type added.');
    }

    closeModal();
  }, [form, editingRowId, createPatientType, updatePatientType, message, closeModal]);

  const filteredRows = useMemo(() => {
    const term = filterPatientType.trim().toLowerCase();
    return rows.filter((row) => {
      if (term && !row.patientType?.toLowerCase().includes(term)) return false;
      if (filterB2b && row.b2bLabs !== filterB2b) return false;
      if (filterStatus && row.status !== filterStatus) return false;
      return true;
    });
  }, [rows, filterPatientType, filterB2b, filterStatus]);

  const columns = useMemo(
    () => [
      {
        title: 'Patient Type ID',
        dataIndex: 'id',
        key: 'id',
        width: 140,
      },
      {
        title: 'Patient Type',
        dataIndex: 'patientType',
        key: 'patientType',
        width: 220,
      },
      {
        title: 'B2B LABS',
        dataIndex: 'b2bLabs',
        key: 'b2bLabs',
        width: 120,
        render: (val) =>
          B2B_LABS_OPTIONS.find((o) => o.value === val)?.label ?? val ?? '—',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 110,
        render: (val) => (
          <Tag color={val === 'active' ? 'green' : 'default'}>
            {val === 'active' ? 'Active' : 'Inactive'}
          </Tag>
        ),
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
                aria-label="Edit patient type"
                icon={
                  <AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />
                }
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label="Delete patient type"
                icon={
                  <AppIcon icon="mdi:delete-outline" className={ACTION_ICON_CLASS} />
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
    <div className="services-billing-page patient-type-page">
      <div
        className="patient-type-table-toolbar"
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}
      >
        <div className="patient-type-filters" style={{ display: 'flex', gap: 12 }}>
          <Input
            placeholder="Filter by Patient Type"
            value={filterPatientType}
            onChange={(e) => setFilterPatientType(e.target.value)}
            allowClear
            style={{ width: 220 }}
          />
          <Select
            placeholder="B2B LABS"
            value={filterB2b || undefined}
            options={B2B_LABS_OPTIONS}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 140 }}
            onChange={(val) => setFilterB2b(val ?? '')}
          />
          <Select
            placeholder="Status"
            value={filterStatus || undefined}
            options={ACTIVE_STATUS_OPTIONS}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 140 }}
            onChange={(val) => setFilterStatus(val ?? '')}
          />
        </div>
        <Button type="primary" onClick={openModal}>
          Add Patient Type
        </Button>
      </div>

      <section className="services-billing-results" aria-label="patient types">
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

      <PatientTypeModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Patient Type' : 'Add Patient Type'}
        form={form}
        errors={fieldErrors}
        isEdit={Boolean(editingRowId)}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
      />
    </div>
  );
}