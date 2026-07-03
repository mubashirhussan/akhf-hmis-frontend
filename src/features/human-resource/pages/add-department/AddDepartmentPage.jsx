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
  createEmptyDepartmentForm,
  rowToDepartmentForm,
  createDepartmentFilters,
  filterDepartmentRows,
} from '@/features/human-resource/api/mock-departments';
import {
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetHospitalsQuery,
  useGetDeptTypesQuery,
} from '@/features/human-resource/api/employeeApi';
import DepartmentModal from './DepartmentModal';
import './add-department.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';
const controlClass = FIELD_CONTROL_CLASS;

export default function AddDepartmentPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [form, setForm] = useState(createEmptyDepartmentForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [filters, setFilters] = useState(createDepartmentFilters);
  const [appliedFilters, setAppliedFilters] = useState(createDepartmentFilters);

  const { data: rows = [], isLoading } = useGetDepartmentsQuery();
  const { data: hospitals = [] } = useGetHospitalsQuery();
  const { data: deptTypes = [] } = useGetDeptTypesQuery();
  const [addDepartment] = useAddDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();

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
    setForm(createEmptyDepartmentForm());
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
    setForm(rowToDepartmentForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.departmentName });
      if (!confirmed) return;
      await deleteDepartment(record.id).unwrap();
      message.success('Department deleted.');
    },
    [confirmDelete, deleteDepartment, message],
  );

  const handleSave = useCallback(async () => {
    const errors = {};
    const departmentIdValue = Number(form.departmentId);
    if (editingRowId && (!form.departmentId || !Number.isInteger(departmentIdValue) || departmentIdValue <= 0)) {
      errors.departmentId = 'Department ID is required and must be a positive number.';
    }
    if (!form.hospitalId) errors.hospitalId = 'Hospital Name is required.';
    if (!form.deptTypeId) errors.deptTypeId = 'Department Type is required.';
    if (!form.departmentName?.trim()) errors.departmentName = 'Department Name is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const payload = {
      hospitalId: form.hospitalId,
      hospitalName: form.hospitalName,
      deptTypeId: form.deptTypeId,
      ...(editingRowId ? { departmentId: departmentIdValue } : {}),
      departmentType: form.departmentType,
      departmentName: form.departmentName.trim(),
      location: form.location.trim(),
      phone: form.phone.trim(),
      fax: form.fax.trim(),
    };

    if (editingRowId) {
      await updateDepartment({ id: editingRowId, ...payload }).unwrap();
      setIsModalOpen(false);
      setEditingRowId(null);
      message.success('Department updated.');
      return;
    }

    await addDepartment(payload).unwrap();
    setIsModalOpen(false);
    message.success('Department added.');
  }, [form, editingRowId, addDepartment, updateDepartment, message]);

  const patchFilter = useCallback((patch) => setFilters((c) => ({ ...c, ...patch })), []);

  const handleSearch = () => setAppliedFilters({ ...filters });

  const handleClear = () => {
    const reset = createDepartmentFilters();
    setFilters(reset);
    setAppliedFilters(reset);
  };

  const filteredRows = useMemo(
    () => filterDepartmentRows(rows, appliedFilters),
    [rows, appliedFilters],
  );

  // Filter dept types in filter bar by selected hospitalId
  const filterBarDeptTypeOptions = useMemo(() => {
    if (!filters.hospitalId) return deptTypes.map((d) => ({ value: d.id, label: d.departmentType }));
    return deptTypes
      .filter((d) => d.hospitalId === filters.hospitalId)
      .map((d) => ({ value: d.id, label: d.departmentType }));
  }, [deptTypes, filters.hospitalId]);

  const columns = useMemo(
    () => [
      { title: 'Department ID', dataIndex: 'departmentId', key: 'departmentId', width: 110 },
      { title: 'Department Name', dataIndex: 'departmentName', key: 'departmentName', width: 200 },
      { title: 'Department Type', dataIndex: 'departmentType', key: 'departmentType', width: 180 },
      { title: 'Location', dataIndex: 'location', key: 'location', width: 200 },
      { title: 'Phone No.', dataIndex: 'phone', key: 'phone', width: 140 },
      { title: 'Fax #', dataIndex: 'fax', key: 'fax', width: 130 },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <div className="dept-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label={`Edit ${record.departmentName}`}
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label={`Delete ${record.departmentName}`}
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
    <div className="services-billing-page add-department-page">
      <section className="hr-filter-panel" aria-label="Department search filters">
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
                value={filters.hospitalId}
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder=""
                options={hospitals.map((h) => ({ value: h.id, label: h.name }))}
                onChange={(val) => {
                  patchFilter({ hospitalId: val ?? null, deptTypeId: null });
                }}
              />
            </FloatingField>

            <FloatingField label="Department Type">
              <Select
                className={controlClass}
                value={filters.deptTypeId}
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder=""
                options={filterBarDeptTypeOptions}
                onChange={(val) => patchFilter({ deptTypeId: val ?? null })}
              />
            </FloatingField>

            <FloatingField label="Department Name">
              <Input
                className={controlClass}
                value={filters.departmentName}
                allowClear
                onChange={(e) => patchFilter({ departmentName: e.target.value })}
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

      <section className="services-billing-results" aria-label="Departments">
        <div className="hr-table-toolbar">
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Add Department
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

      <DepartmentModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Department' : 'Add Department'}
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