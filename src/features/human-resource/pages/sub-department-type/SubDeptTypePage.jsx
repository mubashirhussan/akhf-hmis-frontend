'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Input, Select, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { useConfirm } from '@/hooks/useConfirm';
import {
  createEmptySubDeptTypeForm,
  rowToSubDeptTypeForm,
  createSubDeptTypeFilters,
  filterSubDeptTypeRows,
} from '@/features/human-resource/api/mock-subdepartment-types';
import {
  useGetSubDeptTypesQuery,
  useAddSubDeptTypeMutation,
  useUpdateSubDeptTypeMutation,
  useDeleteSubDeptTypeMutation,
  useGetDeptTypesQuery,
  useGetDepartmentsQuery,
} from '@/features/human-resource/api/employeeApi';
import SubDeptTypeModal from './SubDeptTypeModal';
import './subdepartment-type.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';
const controlClass = FIELD_CONTROL_CLASS;

export default function SubDeptTypePage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [form, setForm] = useState(createEmptySubDeptTypeForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [filters, setFilters] = useState(createSubDeptTypeFilters);
  const [appliedFilters, setAppliedFilters] = useState(createSubDeptTypeFilters);

  const { data: rows = [], isLoading } = useGetSubDeptTypesQuery();
  const { data: deptTypes = [] } = useGetDeptTypesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const [addSubDeptType] = useAddSubDeptTypeMutation();
  const [updateSubDeptType] = useUpdateSubDeptTypeMutation();
  const [deleteSubDeptType] = useDeleteSubDeptTypeMutation();

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
    setForm(createEmptySubDeptTypeForm());
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
    setForm(rowToSubDeptTypeForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.subDepartmentType });
      if (!confirmed) return;
      await deleteSubDeptType(record.id).unwrap();
      message.success('Sub Department Type deleted.');
    },
    [confirmDelete, deleteSubDeptType, message],
  );

  const handleSave = useCallback(async () => {
    const errors = {};
    if (!form.hospitalId) errors.hospitalId = 'Hospital Name is required.';
    if (!form.deptTypeId) errors.deptTypeId = 'Department Type is required.';
    if (!form.departmentId) errors.departmentId = 'Department Name is required.';
    if (!form.subDepartmentType?.trim()) errors.subDepartmentType = 'Sub Department Type is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const payload = {
      hospitalId: form.hospitalId,
      hospitalName: form.hospitalName,
      deptTypeId: form.deptTypeId,
      departmentType: form.departmentType,
      departmentId: form.departmentId,
      departmentName: form.departmentName,
      subDepartmentType: form.subDepartmentType.trim(),
    };

    if (editingRowId) {
      await updateSubDeptType({ id: editingRowId, ...payload }).unwrap();
      setIsModalOpen(false);
      setEditingRowId(null);
      message.success('Sub Department Type updated.');
      return;
    }

    await addSubDeptType(payload).unwrap();
    setIsModalOpen(false);
    message.success('Sub Department Type added.');
  }, [form, editingRowId, addSubDeptType, updateSubDeptType, message]);

  const patchFilter = useCallback((patch) => setFilters((c) => ({ ...c, ...patch })), []);

  const handleSearch = () => setAppliedFilters({ ...filters });

  const handleClear = () => {
    const reset = createSubDeptTypeFilters();
    setFilters(reset);
    setAppliedFilters(reset);
  };

  const filteredRows = useMemo(
    () => filterSubDeptTypeRows(rows, appliedFilters),
    [rows, appliedFilters],
  );

  // Filter bar: dept options (all dept types)
  const filterDeptTypeOptions = useMemo(
    () => deptTypes.map((d) => ({ value: d.id, label: d.departmentType })),
    [deptTypes],
  );

  // Filter bar: department options filtered by selected deptTypeId in filter
  const filterDepartmentOptions = useMemo(() => {
    if (!filters.deptTypeId) return departments.map((d) => ({ value: d.id, label: d.departmentName }));
    return departments
      .filter((d) => d.deptTypeId === filters.deptTypeId)
      .map((d) => ({ value: d.id, label: d.departmentName }));
  }, [departments, filters.deptTypeId]);

  const columns = useMemo(
    () => [
      { title: 'Sub Dept. Type ID', dataIndex: 'subDeptTypeId', key: 'subDeptTypeId', width: 150 },
      { title: 'Department Type', dataIndex: 'departmentType', key: 'departmentType', width: 180 },
      { title: 'Department Name', dataIndex: 'departmentName', key: 'departmentName', width: 200 },
      { title: 'Sub Department Type', dataIndex: 'subDepartmentType', key: 'subDepartmentType', width: 200 },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <div className="sub-dept-type-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label={`Edit ${record.subDepartmentType}`}
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label={`Delete ${record.subDepartmentType}`}
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
    <div className="services-billing-page sub-dept-type-page">
      <section className="hr-filter-panel" aria-label="Sub department type search filters">
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
            <FloatingField label="Department Type">
              <Select
                className={controlClass}
                value={filters.deptTypeId}
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder=""
                options={filterDeptTypeOptions}
                onChange={(val) => {
                  patchFilter({ deptTypeId: val ?? null, departmentId: null });
                }}
              />
            </FloatingField>

            <FloatingField label="Department Name">
              <Select
                className={controlClass}
                value={filters.departmentId}
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder=""
                options={filterDepartmentOptions}
                onChange={(val) => patchFilter({ departmentId: val ?? null })}
              />
            </FloatingField>

            <FloatingField label="Sub Department Type">
              <Input
                className={controlClass}
                value={filters.subDepartmentType}
                allowClear
                onChange={(e) => patchFilter({ subDepartmentType: e.target.value })}
                autoComplete="off"
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

      <section className="services-billing-results" aria-label="Sub Department Types">
        <div className="hr-table-toolbar">
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Add Sub Department Type
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

      <SubDeptTypeModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Sub Department Type' : 'Add Sub Department Type'}
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