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
  createEmptySubDepartmentForm,
  rowToSubDepartmentForm,
  createSubDepartmentFilters,
  filterSubDepartmentRows,
} from '@/features/human-resource/api/mock-sub-departments';
import {
  useGetSubDepartmentsQuery,
  useAddSubDepartmentMutation,
  useUpdateSubDepartmentMutation,
  useDeleteSubDepartmentMutation,
  useGetHospitalsQuery,
  useGetDeptTypesQuery,
  useGetDepartmentsQuery,
} from '@/features/human-resource/api/employeeApi';
import SubDepartmentModal from './SubDepartmentModal';
import './add-sub-department.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';
const controlClass = FIELD_CONTROL_CLASS;

export default function AddSubDepartmentPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [form, setForm] = useState(createEmptySubDepartmentForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [filters, setFilters] = useState(createSubDepartmentFilters);
  const [appliedFilters, setAppliedFilters] = useState(createSubDepartmentFilters);

  const { data: rows = [], isLoading } = useGetSubDepartmentsQuery();
  const { data: hospitals = [] } = useGetHospitalsQuery();
  const { data: deptTypes = [] } = useGetDeptTypesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const [addSubDepartment] = useAddSubDepartmentMutation();
  const [updateSubDepartment] = useUpdateSubDepartmentMutation();
  const [deleteSubDepartment] = useDeleteSubDepartmentMutation();

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
    setForm(createEmptySubDepartmentForm());
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
    setForm(rowToSubDepartmentForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.subDepartmentName });
      if (!confirmed) return;
      await deleteSubDepartment(record.id).unwrap();
      message.success('Sub Department deleted.');
    },
    [confirmDelete, deleteSubDepartment, message],
  );

  const handleSave = useCallback(async () => {
    const errors = {};
    if (!form.hospitalId) errors.hospitalId = 'Hospital Name is required.';
    if (!form.deptTypeId) errors.deptTypeId = 'Department Type is required.';
    if (!form.departmentId) errors.departmentId = 'Department Name is required.';
    if (!form.subDeptTypeId) errors.subDeptTypeId = 'Sub Department Type is required.';
    if (!form.subDepartmentName?.trim()) errors.subDepartmentName = 'Sub Department Name is required.';

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
      subDeptTypeId: form.subDeptTypeId,
      subDepartmentType: form.subDepartmentType,
      subDepartmentName: form.subDepartmentName.trim(),
      costCenter: form.costCenter.trim(),
      location: form.location.trim(),
      phone: form.phone.trim(),
      fax: form.fax.trim(),
    };

    if (editingRowId) {
      await updateSubDepartment({ id: editingRowId, ...payload }).unwrap();
      setIsModalOpen(false);
      setEditingRowId(null);
      message.success('Sub Department updated.');
      return;
    }

    await addSubDepartment(payload).unwrap();
    setIsModalOpen(false);
    message.success('Sub Department added.');
  }, [form, editingRowId, addSubDepartment, updateSubDepartment, message]);

  const patchFilter = useCallback((patch) => setFilters((c) => ({ ...c, ...patch })), []);

  const handleSearch = () => setAppliedFilters({ ...filters });

  const handleClear = () => {
    const reset = createSubDepartmentFilters();
    setFilters(reset);
    setAppliedFilters(reset);
  };

  const filteredRows = useMemo(
    () => filterSubDepartmentRows(rows, appliedFilters),
    [rows, appliedFilters],
  );

  // Filter bar: dept type options filtered by selected hospital
  const filterDeptTypeOptions = useMemo(() => {
    if (!filters.hospitalId) return deptTypes.map((d) => ({ value: d.id, label: d.departmentType }));
    return deptTypes
      .filter((d) => d.hospitalId === filters.hospitalId)
      .map((d) => ({ value: d.id, label: d.departmentType }));
  }, [deptTypes, filters.hospitalId]);

  // Filter bar: department options filtered by selected deptTypeId
  const filterDepartmentOptions = useMemo(() => {
    if (!filters.deptTypeId) return departments.map((d) => ({ value: d.id, label: d.departmentName }));
    return departments
      .filter((d) => d.deptTypeId === filters.deptTypeId)
      .map((d) => ({ value: d.id, label: d.departmentName }));
  }, [departments, filters.deptTypeId]);

  const columns = useMemo(
    () => [
      { title: 'Sub Dept. ID', dataIndex: 'subDepartmentId', key: 'subDepartmentId', width: 110 },
      { title: 'Department Type', dataIndex: 'departmentType', key: 'departmentType', width: 160 },
      { title: 'Department Name', dataIndex: 'departmentName', key: 'departmentName', width: 180 },
      { title: 'Sub Dept. Type', dataIndex: 'subDepartmentType', key: 'subDepartmentType', width: 180 },
      { title: 'Sub Dept. Name', dataIndex: 'subDepartmentName', key: 'subDepartmentName', width: 180 },
      { title: 'Location', dataIndex: 'location', key: 'location', width: 180 },
      { title: 'Phone No.', dataIndex: 'phone', key: 'phone', width: 130 },
      { title: 'Fax #', dataIndex: 'fax', key: 'fax', width: 120 },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <div className="sub-dept-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label={`Edit ${record.subDepartmentName}`}
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label={`Delete ${record.subDepartmentName}`}
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
    <div className="services-billing-page add-sub-department-page">
      <section className="hr-filter-panel" aria-label="Sub department search filters">
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
                onChange={(val) =>
                  patchFilter({ hospitalId: val ?? null, deptTypeId: null, departmentId: null })
                }
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
                options={filterDeptTypeOptions}
                onChange={(val) =>
                  patchFilter({ deptTypeId: val ?? null, departmentId: null })
                }
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

            <FloatingField label="Sub Department Name">
              <Input
                className={controlClass}
                value={filters.subDepartmentName}
                allowClear
                onChange={(e) => patchFilter({ subDepartmentName: e.target.value })}
                autoComplete="off"
              />
            </FloatingField>

            <FloatingField label="Cost Center">
              <Input
                className={controlClass}
                value={filters.costCenter}
                allowClear
                onChange={(e) => patchFilter({ costCenter: e.target.value })}
                autoComplete="off"
              />
            </FloatingField>

            <FloatingField label="Location">
              <Input
                className={controlClass}
                value={filters.location}
                allowClear
                onChange={(e) => patchFilter({ location: e.target.value })}
                autoComplete="off"
              />
            </FloatingField>

            <FloatingField label="Phone">
              <Input
                className={controlClass}
                value={filters.phone}
                allowClear
                onChange={(e) => patchFilter({ phone: e.target.value })}
                autoComplete="off"
              />
            </FloatingField>

            <FloatingField label="Fax #">
              <Input
                className={controlClass}
                value={filters.fax}
                allowClear
                onChange={(e) => patchFilter({ fax: e.target.value })}
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

      <section className="services-billing-results" aria-label="Sub Departments">
        <div className="hr-table-toolbar">
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Add Sub Department
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

      <SubDepartmentModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Sub Department' : 'Add Sub Department'}
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