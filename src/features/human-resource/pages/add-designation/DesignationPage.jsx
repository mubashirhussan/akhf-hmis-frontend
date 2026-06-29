'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Input, InputNumber, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import FloatingField from '@/components/ui/FloatingField';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { useConfirm } from '@/hooks/useConfirm';
import {
  createEmptyDesignationForm,
  rowToDesignationForm,
  filterDesignationRows,
} from '@/features/human-resource/api/mock-designations';
import {
  useGetDesignationsQuery,
  useAddDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
} from '@/features/human-resource/api/employeeApi';
import DesignationModal from './DesignationModal';
import './add-designation.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';
const controlClass = FIELD_CONTROL_CLASS;

export default function DesignationPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [form, setForm] = useState(createEmptyDesignationForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [designationFilter, setDesignationFilter] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');

  const { data: rows = [], isLoading } = useGetDesignationsQuery();
  const [addDesignation] = useAddDesignationMutation();
  const [updateDesignation] = useUpdateDesignationMutation();
  const [deleteDesignation] = useDeleteDesignationMutation();

  const patchForm = useCallback((patch) => setForm((c) => ({ ...c, ...patch })), []);

  const clearFieldError = useCallback((field) => {
    setFieldErrors((c) => {
      if (!c[field]) return c;
      const next = { ...c };
      delete next[field];
      return next;
    });
  }, []);

  const openModal = useCallback(() => {
    setForm(createEmptyDesignationForm());
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
    setForm(rowToDesignationForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.designation });
      if (!confirmed) return;
      await deleteDesignation(record.id).unwrap();
      message.success('Designation deleted.');
    },
    [confirmDelete, deleteDesignation, message],
  );

  const handleSave = useCallback(async () => {
    const errors = {};
    if (!form.designation?.trim()) errors.designation = 'Designation is required.';
    if (form.minPayScale === '' || form.minPayScale === null || form.minPayScale === undefined)
      errors.minPayScale = 'Minimum Pay Scale is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const payload = {
      designation: form.designation.trim(),
      minPayScale: Number(form.minPayScale),
    };

    if (editingRowId) {
      await updateDesignation({ id: editingRowId, ...payload }).unwrap();
      setIsModalOpen(false);
      setEditingRowId(null);
      message.success('Designation updated.');
      return;
    }

    await addDesignation(payload).unwrap();
    setIsModalOpen(false);
    message.success('Designation added.');
  }, [form, editingRowId, addDesignation, updateDesignation, message]);

  const handleSearch = () => setAppliedFilter(designationFilter);

  const handleClear = () => {
    setDesignationFilter('');
    setAppliedFilter('');
  };

  const filteredRows = useMemo(
    () => filterDesignationRows(rows, { designation: appliedFilter }),
    [rows, appliedFilter],
  );

  const columns = useMemo(
    () => [
      {
        title: 'Designation ID',
        dataIndex: 'designationId',
        key: 'designationId',
        width: 130,
      },
      {
        title: 'Designation',
        dataIndex: 'designation',
        key: 'designation',
        width: 220,
      },
      {
        title: 'Minimum Pay Scale',
        dataIndex: 'minPayScale',
        key: 'minPayScale',
        width: 180,
        render: (val) => (val !== null && val !== undefined ? val.toLocaleString() : '—'),
      },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <div className="designation-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label={`Edit ${record.designation}`}
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label={`Delete ${record.designation}`}
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
    <div className="services-billing-page designation-page">

      <div className="designation-table-toolbar">
        <Button type="primary" onClick={openModal}>
          Add Designation
        </Button>
      </div>

      <div className="walk-in-add-record-layout designation-search-layout">
        <form
          className="designation-search-form"
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
        >
          <FloatingField label="Designation Name">
            <Input
              className={controlClass}
              value={designationFilter}
              allowClear
              onChange={(e) => setDesignationFilter(e.target.value)}
              autoComplete="off"
            />
          </FloatingField>

          <div className="designation-search-actions">
            <Button type="link" className="patient-reg-btn-clear" onClick={handleClear}>
              Clear
            </Button>
            <Button
              type="primary"
              className="patient-reg-btn-save"
              icon={<SearchOutlined />}
              htmlType="submit"
              loading={isLoading}
            >
              Search
            </Button>
          </div>
        </form>
      </div>

      <section className="services-billing-results" aria-label="Designations">
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

      <DesignationModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Designation' : 'Add Designation'}
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
        isEdit={!!editingRowId}
      />
    </div>
  );
}