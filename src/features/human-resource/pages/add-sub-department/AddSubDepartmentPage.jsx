'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import DynamicForm from '@/components/form/DynamicForm';
import { useConfirm } from '@/hooks/useConfirm';
import {
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
  useGetSubDeptTypesQuery,
} from '@/features/human-resource/api/employeeApi';
import SubDepartmentModal from './SubDepartmentModal';
import {
  SUB_DEPARTMENT_FILTER_INITIAL_VALUES,
  getSubDepartmentFilterFields,
} from './sub-department-fields';
import './add-sub-department.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function AddSubDepartmentPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(createSubDepartmentFilters);

  const { data: rows = [], isLoading } = useGetSubDepartmentsQuery();
  const { data: hospitals = [] } = useGetHospitalsQuery();
  const { data: deptTypes = [] } = useGetDeptTypesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: subDeptTypes = [] } = useGetSubDeptTypesQuery();
  const [addSubDepartment] = useAddSubDepartmentMutation();
  const [updateSubDepartment] = useUpdateSubDepartmentMutation();
  const [deleteSubDepartment] = useDeleteSubDepartmentMutation();

  const filterHospitalId = Form.useWatch('hospitalId', filterForm);
  const filterDeptTypeId = Form.useWatch('deptTypeId', filterForm);

  const hospitalOptions = useMemo(
    () => hospitals.map((h) => ({ value: h.id, label: h.name })),
    [hospitals],
  );

  const filterDeptTypeOptions = useMemo(() => {
    if (!filterHospitalId) {
      return deptTypes.map((d) => ({ value: d.id, label: d.departmentType }));
    }
    return deptTypes
      .filter((d) => d.hospitalId === filterHospitalId)
      .map((d) => ({ value: d.id, label: d.departmentType }));
  }, [deptTypes, filterHospitalId]);

  const filterDepartmentOptions = useMemo(() => {
    if (!filterDeptTypeId) {
      return departments.map((d) => ({ value: d.id, label: d.departmentName }));
    }
    return departments
      .filter((d) => d.deptTypeId === filterDeptTypeId)
      .map((d) => ({ value: d.id, label: d.departmentName }));
  }, [departments, filterDeptTypeId]);

  const filterFields = useMemo(
    () =>
      getSubDepartmentFilterFields({
        hospitalOptions,
        deptTypeOptions: filterDeptTypeOptions,
        departmentOptions: filterDepartmentOptions,
      }),
    [hospitalOptions, filterDeptTypeOptions, filterDepartmentOptions],
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
        hospitalId: record.hospitalId ?? null,
        deptTypeId: record.deptTypeId ?? null,
        departmentId: record.departmentId ?? null,
        subDeptTypeId: record.subDeptTypeId ?? null,
        subDepartmentName: record.subDepartmentName ?? '',
        costCenter: record.costCenter ?? '',
        location: record.location ?? '',
        phone: record.phone ?? '',
        fax: record.fax ?? '',
      });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

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
    try {
      const values = await form.validateFields();
      const hospitalName =
        hospitals.find((h) => h.id === values.hospitalId)?.name ?? '';
      const departmentType =
        deptTypes.find((d) => d.id === values.deptTypeId)?.departmentType ?? '';
      const departmentName =
        departments.find((d) => d.id === values.departmentId)?.departmentName ?? '';
      const subDepartmentType =
        subDeptTypes.find((s) => s.id === values.subDeptTypeId)?.subDepartmentType ??
        '';

      const payload = {
        hospitalId: values.hospitalId,
        hospitalName,
        deptTypeId: values.deptTypeId,
        departmentType,
        departmentId: values.departmentId,
        departmentName,
        subDeptTypeId: values.subDeptTypeId,
        subDepartmentType,
        subDepartmentName: values.subDepartmentName.trim(),
        costCenter: (values.costCenter ?? '').trim(),
        location: (values.location ?? '').trim(),
        phone: (values.phone ?? '').trim(),
        fax: (values.fax ?? '').trim(),
      };

      if (editingRowId) {
        await updateSubDepartment({ id: editingRowId, ...payload }).unwrap();
        message.success('Sub Department updated.');
      } else {
        await addSubDepartment(payload).unwrap();
        message.success('Sub Department added.');
      }

      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [
    form,
    hospitals,
    deptTypes,
    departments,
    subDeptTypes,
    editingRowId,
    addSubDepartment,
    updateSubDepartment,
    message,
    closeModal,
  ]);

  const handleSearch = useCallback((values) => {
    setAppliedFilters({
      hospitalId: values.hospitalId ?? null,
      deptTypeId: values.deptTypeId ?? null,
      departmentId: values.departmentId ?? null,
      subDepartmentName: values.subDepartmentName ?? '',
      costCenter: values.costCenter ?? '',
      location: values.location ?? '',
      phone: values.phone ?? '',
      fax: values.fax ?? '',
    });
  }, []);

  const handleClear = useCallback(() => {
    const reset = createSubDepartmentFilters();
    filterForm.resetFields();
    setAppliedFilters(reset);
  }, [filterForm]);

  const filteredRows = useMemo(
    () => filterSubDepartmentRows(rows, appliedFilters),
    [rows, appliedFilters],
  );

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
          <Form
            form={filterForm}
            layout="vertical"
            className="walk-in-add-record-form hr-search-form"
            initialValues={SUB_DEPARTMENT_FILTER_INITIAL_VALUES}
            onFinish={handleSearch}
            onValuesChange={(changed) => {
              if ('hospitalId' in changed) {
                filterForm.setFieldsValue({ deptTypeId: null, departmentId: null });
              } else if ('deptTypeId' in changed) {
                filterForm.setFieldsValue({ departmentId: null });
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
        onSave={handleSave}
      />
    </div>
  );
}
