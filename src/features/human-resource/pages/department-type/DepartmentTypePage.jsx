'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Input, Select, Tag, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { useConfirm } from '@/hooks/useConfirm';
import {
  createEmptyDeptTypeForm,
  rowToDeptTypeForm,
  filterDeptTypeRows,
} from '@/features/human-resource/api/mock-department-types';
import {
  useGetDeptTypesQuery,
  useAddDeptTypeMutation,
  useUpdateDeptTypeMutation,
  useDeleteDeptTypeMutation,
  useGetHospitalsQuery,
} from '@/features/human-resource/api/employeeApi';
import DeptTypeModal from './DeptTypeModal';
import './department-type.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';
const controlClass = FIELD_CONTROL_CLASS;

export default function DepartmentTypePage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [form, setForm] = useState(createEmptyDeptTypeForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [deptTypeFilter, setDeptTypeFilter] = useState({ hospitalId: null, departmentType: '', status: null });
  const [appliedFilter, setAppliedFilter] = useState({});

  const { data: rows = [], isLoading } = useGetDeptTypesQuery();
  const { data: hospitals = [] } = useGetHospitalsQuery();
  const [addDeptType] = useAddDeptTypeMutation();
  const [updateDeptType] = useUpdateDeptTypeMutation();
  const [deleteDeptType] = useDeleteDeptTypeMutation();

  const patchForm = useCallback(
    (patch) => setForm((c) => ({ ...c, ...patch })),
    [],
  );

  const clearFieldError = useCallback((field) => {
    setFieldErrors((c) => {
      if (!c[field]) return c;
      const next = { ...c };
      delete next[field];
      return next;
    });
  }, []);

  const openModal = useCallback(() => {
    setForm(createEmptyDeptTypeForm());
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
    setForm(rowToDeptTypeForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.departmentType });
      if (!confirmed) return;
      await deleteDeptType(record.id).unwrap();
      message.success('Department Type deleted.');
    },
    [confirmDelete, deleteDeptType, message],
  );

  const handleSave = useCallback(async () => {
    const errors = {};
    if (!form.hospitalId) errors.hospitalId = 'Hospital Name is required.';
    if (!form.departmentType?.trim()) errors.departmentType = 'Department Type is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const payload = {
      hospitalId: form.hospitalId,
      hospitalName: form.hospitalName,
      departmentType: form.departmentType.trim(),
      status: form.status ?? 'active',
    };

    if (editingRowId) {
      await updateDeptType({ id: editingRowId, ...payload }).unwrap();
      setIsModalOpen(false);
      setEditingRowId(null);
      message.success('Department Type updated.');
      return;
    }

    await addDeptType(payload).unwrap();
    setIsModalOpen(false);
    message.success('Department Type added.');
  }, [form, editingRowId, addDeptType, updateDeptType, message]);

  const handleSearch = () => setAppliedFilter(deptTypeFilter);

  const handleClear = () => {
    setDeptTypeFilter({ hospitalId: null, departmentType: '', status: null });
    setAppliedFilter({});
  };

  const filteredRows = useMemo(
    () => filterDeptTypeRows(rows, appliedFilter),
    [rows, appliedFilter],
  );

  const columns = useMemo(
    () => [
      {
        title: 'Dept. Type ID',
        dataIndex: 'deptTypeId',
        key: 'deptTypeId',
        width: 120,
      },
      {
        title: 'Hospital Name',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        width: 260,
      },
      {
        title: 'Department Type',
        dataIndex: 'departmentType',
        key: 'departmentType',
        width: 200,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status) => (
          <Tag color={status === 'active' ? 'success' : 'default'}>
            {status === 'active' ? 'Active' : 'Disactive'}
          </Tag>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <div className="dept-type-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label={`Edit ${record.departmentType}`}
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label={`Delete ${record.departmentType}`}
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
    <div className="services-billing-page dept-type-page">
      <section className="hr-filter-panel" aria-label="Department type search filters">
        <div className="walk-in-add-record-layout hr-search-layout">
          <FormGrid
            as="form"
            columns={4}
            className="walk-in-add-record-form hr-search-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <FloatingField label="Hospital Name">
              <Select
                className={controlClass}
                value={deptTypeFilter.hospitalId}
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder=""
                options={hospitals.map((h) => ({ value: h.id, label: h.name }))}
                onChange={(val) => setDeptTypeFilter((c) => ({ ...c, hospitalId: val ?? null }))}
              />
            </FloatingField>

            <FloatingField label="Department Type">
              <Input
                className={controlClass}
                value={deptTypeFilter.departmentType}
                allowClear
                onChange={(e) => setDeptTypeFilter((c) => ({ ...c, departmentType: e.target.value }))}
                autoComplete="off"
              />
            </FloatingField>

            <FloatingField label="Status">
              <Select
                className={controlClass}
                value={deptTypeFilter.status}
                allowClear
                placeholder=""
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'disactive', label: 'Disactive' },
                ]}
                onChange={(val) => setDeptTypeFilter((c) => ({ ...c, status: val ?? null }))}
              />
            </FloatingField>

            <div className="hr-search-actions">
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
          </FormGrid>
        </div>
      </section>

      <section className="services-billing-results" aria-label="Department Types">
        <div className="hr-table-toolbar">
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Add Department Type
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

      <DeptTypeModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Department Type' : 'Add Department Type'}
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