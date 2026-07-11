'use client';

import { useCallback, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Form, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import { useConfirm } from '@/hooks/useConfirm';
import { filterHospitalRows } from '@/features/human-resource/api/mock-hospitals';
import {
  HOSPITAL_FILTER_INITIAL_VALUES,
} from '@/features/human-resource/pages/add-hospital/hospital-fields';
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
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(HOSPITAL_FILTER_INITIAL_VALUES);

  const { data: rows = [], isLoading } = useGetHospitalsQuery();
  const [createHospital] = useAddHospitalMutation();
  const [updateHospital] = useUpdateHospitalMutation();
  const [deleteHospital] = useDeleteHospitalMutation();

  const openModal = useCallback(() => {
    form.resetFields();
    setEditingRow(null);
    setIsModalOpen(true);
  }, [form]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRow(null);
    form.resetFields();
  }, [form]);

  const handleEditRow = useCallback((record) => {
    setEditingRow(record);
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
    try {
      const values = await form.validateFields();
      const hospitalIdValue = Number(editingRow?.hospitalId ?? values.hospitalId);

      if (
        editingRow &&
        (!editingRow.hospitalId || !Number.isInteger(hospitalIdValue) || hospitalIdValue <= 0)
      ) {
        message.error('Hospital ID is required and must be a positive number.');
        return;
      }

      const payload = {
        ...(editingRow ? { hospitalId: hospitalIdValue } : {}),
        name: values.name.trim(),
        abbreviation: (values.abbreviation ?? '').trim(),
        address: (values.address ?? '').trim(),
        city: values.city,
        phone: (values.phone ?? '').trim(),
        fax: (values.fax ?? '').trim(),
        logo: values.logo ?? null,
      };

      if (editingRow) {
        await updateHospital({ id: editingRow.id, ...payload }).unwrap();
        closeModal();
        message.success('Hospital updated.');
        return;
      }

      await createHospital(payload).unwrap();
      closeModal();
      message.success('Hospital created.');
    } catch {
      // validation errors are shown by antd Form
    }
  }, [form, editingRow, createHospital, updateHospital, closeModal, message]);

  const handleSearch = useCallback(
    (values) => {
      setAppliedFilters({ ...values });
    },
    [],
  );

  const handleClear = useCallback(() => {
    filterForm.resetFields();
    setAppliedFilters(HOSPITAL_FILTER_INITIAL_VALUES);
  }, [filterForm]);

  const filteredRows = useMemo(
    () => filterHospitalRows(rows, appliedFilters),
    [rows, appliedFilters],
  );

  const columns = useMemo(
    () => [
      { title: 'Hospital ID', dataIndex: 'hospitalId', key: 'hospitalId', width: 100 },
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
        form={filterForm}
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
        title={editingRow ? 'Edit Hospital' : 'Add Hospital'}
        form={form}
        onSave={handleSave}
        record={editingRow}
      />
    </div>
  );
}
