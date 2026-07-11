'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import DynamicForm from '@/components/form/DynamicForm';
import { useConfirm } from '@/hooks/useConfirm';
import {
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
import {
  DEPARTMENT_FILTER_INITIAL_VALUES,
  getDepartmentFilterFields,
} from './department-fields';
import './add-department.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function AddDepartmentPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(createDepartmentFilters);

  const { data: rows = [], isLoading } = useGetDepartmentsQuery();
  const { data: hospitals = [] } = useGetHospitalsQuery();
  const { data: deptTypes = [] } = useGetDeptTypesQuery();
  const [addDepartment] = useAddDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const filterHospitalId = Form.useWatch('hospitalId', filterForm);

  const hospitalOptions = useMemo(
    () => hospitals.map((h) => ({ value: h.id, label: h.name })),
    [hospitals],
  );

  const filterBarDeptTypeOptions = useMemo(() => {
    if (!filterHospitalId) {
      return deptTypes.map((d) => ({ value: d.id, label: d.departmentType }));
    }
    return deptTypes
      .filter((d) => d.hospitalId === filterHospitalId)
      .map((d) => ({ value: d.id, label: d.departmentType }));
  }, [deptTypes, filterHospitalId]);

  const filterFields = useMemo(
    () =>
      getDepartmentFilterFields({
        hospitalOptions,
        deptTypeOptions: filterBarDeptTypeOptions,
      }),
    [hospitalOptions, filterBarDeptTypeOptions],
  );

  const openModal = useCallback(() => {
    form.resetFields();
    setEditingRowId(null);
    setEditingDepartmentId(null);
    setIsModalOpen(true);
  }, [form]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRowId(null);
    setEditingDepartmentId(null);
    form.resetFields();
  }, [form]);

  const handleEditRow = useCallback(
    (record) => {
      form.setFieldsValue({
        hospitalId: record.hospitalId ?? null,
        deptTypeId: record.deptTypeId ?? null,
        departmentName: record.departmentName ?? '',
        location: record.location ?? '',
        phone: record.phone ?? '',
        fax: record.fax ?? '',
      });
      setEditingRowId(record.id);
      setEditingDepartmentId(record.departmentId ?? null);
      setIsModalOpen(true);
    },
    [form],
  );

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
    try {
      const values = await form.validateFields();
      const hospitalName =
        hospitals.find((h) => h.id === values.hospitalId)?.name ?? '';
      const departmentType =
        deptTypes.find((d) => d.id === values.deptTypeId)?.departmentType ?? '';

      const payload = {
        hospitalId: values.hospitalId,
        hospitalName,
        deptTypeId: values.deptTypeId,
        ...(editingRowId
          ? { departmentId: Number(editingDepartmentId) }
          : {}),
        departmentType,
        departmentName: values.departmentName.trim(),
        location: (values.location ?? '').trim(),
        phone: (values.phone ?? '').trim(),
        fax: (values.fax ?? '').trim(),
      };

      if (editingRowId) {
        await updateDepartment({ id: editingRowId, ...payload }).unwrap();
        message.success('Department updated.');
      } else {
        await addDepartment(payload).unwrap();
        message.success('Department added.');
      }

      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [
    form,
    hospitals,
    deptTypes,
    editingRowId,
    editingDepartmentId,
    addDepartment,
    updateDepartment,
    message,
    closeModal,
  ]);

  const handleSearch = useCallback((values) => {
    setAppliedFilters({
      hospitalId: values.hospitalId ?? null,
      deptTypeId: values.deptTypeId ?? null,
      departmentName: values.departmentName ?? '',
    });
  }, []);

  const handleClear = useCallback(() => {
    const reset = createDepartmentFilters();
    filterForm.resetFields();
    setAppliedFilters(reset);
  }, [filterForm]);

  const filteredRows = useMemo(
    () => filterDepartmentRows(rows, appliedFilters),
    [rows, appliedFilters],
  );

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
          <Form
            form={filterForm}
            layout="vertical"
            className="walk-in-add-record-form hr-search-form"
            initialValues={DEPARTMENT_FILTER_INITIAL_VALUES}
            onFinish={handleSearch}
            onValuesChange={(changed) => {
              if ('hospitalId' in changed) {
                filterForm.setFieldsValue({ deptTypeId: null });
              }
            }}
          >
            <DynamicForm fields={filterFields} />
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
          </Form>
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
        onSave={handleSave}
      />
    </div>
  );
}
