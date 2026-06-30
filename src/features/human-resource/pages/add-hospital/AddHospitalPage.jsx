'use client';

import { useCallback, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import { useConfirm } from '@/hooks/useConfirm';
import {
  createEmptyHospitalForm,
  rowToHospitalForm,
  createHospitalFilters,
  filterHospitalRows,
} from '@/features/human-resource/api/mock-hospitals';
import HospitalFilterForm from './HospitalFilterForm';
import {
  useGetHospitalsQuery,
  useAddHospitalMutation,
  useUpdateHospitalMutation,
  useDeleteHospitalMutation,
} from '@/features/human-resource/api/employeeApi';
import HospitalModal from './HospitalModal';
import './add-hospital.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function AddHospitalPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [form, setForm] = useState(createEmptyHospitalForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [filters, setFilters] = useState(createHospitalFilters);
  const [appliedFilters, setAppliedFilters] = useState(createHospitalFilters);

  const { data: rows = [], isLoading } = useGetHospitalsQuery();
  const [createHospital] = useAddHospitalMutation();
  const [updateHospital] = useUpdateHospitalMutation();
  const [deleteHospital] = useDeleteHospitalMutation();

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
    setForm(createEmptyHospitalForm());
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
    setForm(rowToHospitalForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.name });
      if (!confirmed) return;
      await deleteHospital(record.id).unwrap();
      message.success('Hospital deleted.');
    },
    [confirmDelete, deleteHospital, message],
  );

  const handleSave = useCallback(async () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Hospital Name is required.';
    if (!form.city) errors.city = 'City is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const payload = {
      name: form.name.trim(),
      abbreviation: form.abbreviation.trim(),
      address: form.address.trim(),
      city: form.city,
      phone: form.phone.trim(),
      fax: form.fax.trim(),
      logo: form.logo ?? null,
    };

    if (editingRowId) {
      await updateHospital({ id: editingRowId, ...payload }).unwrap();
      setIsModalOpen(false);
      setEditingRowId(null);
      message.success('Hospital updated.');
      return;
    }

    await createHospital(payload).unwrap();
    setIsModalOpen(false);
    message.success('Hospital created.');
  }, [form, editingRowId, createHospital, updateHospital, message]);

  const patchFilter = useCallback((patch) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
  };

  const handleClear = () => {
    const reset = createHospitalFilters();
    setFilters(reset);
    setAppliedFilters(reset);
  };

  const filteredRows = useMemo(
    () => filterHospitalRows(rows, appliedFilters),
    [rows, appliedFilters],
  );

  const columns = useMemo(
    () => [
      { title: 'Hospital Name', dataIndex: 'name', key: 'name', width: 250 },
      { title: 'Abbreviation', dataIndex: 'abbreviation', key: 'abbreviation', width: 120 },
      { title: 'Address', dataIndex: 'address', key: 'address', width: 200 },
      {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
        width: 120,
      },
      { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 130 },
      { title: 'Fax #', dataIndex: 'fax', key: 'fax', width: 130 },
      {
        title: 'Logo',
        dataIndex: 'logo',
        key: 'logo',
        width: 80,
        align: 'center',
        render: (value) =>
          value ? (
            <img src={value} alt="logo" className="hospital-table-logo" />
          ) : (
            <span className="hospital-table-no-logo">—</span>
          ),
      },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <div className="hospital-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label={`Edit ${record.name}`}
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label={`Delete ${record.name}`}
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
    <div className="services-billing-page add-hospital-page">
      <HospitalFilterForm
        filters={filters}
        onPatchFilter={patchFilter}
        onSubmit={handleSearch}
        onClear={handleClear}
        loading={isLoading}
      />

      <section className="services-billing-results" aria-label="Hospitals">
        <div className="hr-table-toolbar">
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Add Hospital
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

      <HospitalModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Hospital' : 'Add Hospital'}
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
      />
    </div>
  );
}