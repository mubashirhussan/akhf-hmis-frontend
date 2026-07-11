'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import DynamicForm from '@/components/form/DynamicForm';
import { useConfirm } from '@/hooks/useConfirm';
import {
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
  useGetHospitalsQuery,
} from '@/features/human-resource/api/employeeApi';
import SubDeptTypeModal from './SubDeptTypeModal';
import {
  SUB_DEPT_TYPE_FILTER_INITIAL_VALUES,
  getSubDeptTypeFilterFields,
} from './sub-dept-type-fields';
import './subdepartment-type.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function SubDeptTypePage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(createSubDeptTypeFilters);

  const { data: rows = [], isLoading } = useGetSubDeptTypesQuery();
  const { data: hospitals = [] } = useGetHospitalsQuery();
  const { data: deptTypes = [] } = useGetDeptTypesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const [addSubDeptType] = useAddSubDeptTypeMutation();
  const [updateSubDeptType] = useUpdateSubDeptTypeMutation();
  const [deleteSubDeptType] = useDeleteSubDeptTypeMutation();

  const filterDeptTypeId = Form.useWatch('deptTypeId', filterForm);

  const filterDeptTypeOptions = useMemo(
    () => deptTypes.map((d) => ({ value: d.id, label: d.departmentType })),
    [deptTypes],
  );

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
      getSubDeptTypeFilterFields({
        deptTypeOptions: filterDeptTypeOptions,
        departmentOptions: filterDepartmentOptions,
      }),
    [filterDeptTypeOptions, filterDepartmentOptions],
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
        subDepartmentType: record.subDepartmentType ?? '',
      });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

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
    try {
      const values = await form.validateFields();
      const hospitalName =
        hospitals.find((h) => h.id === values.hospitalId)?.name ?? '';
      const departmentType =
        deptTypes.find((d) => d.id === values.deptTypeId)?.departmentType ?? '';
      const departmentName =
        departments.find((d) => d.id === values.departmentId)?.departmentName ?? '';

      const payload = {
        hospitalId: values.hospitalId,
        hospitalName,
        deptTypeId: values.deptTypeId,
        departmentType,
        departmentId: values.departmentId,
        departmentName,
        subDepartmentType: values.subDepartmentType.trim(),
      };

      if (editingRowId) {
        await updateSubDeptType({ id: editingRowId, ...payload }).unwrap();
        message.success('Sub Department Type updated.');
      } else {
        await addSubDeptType(payload).unwrap();
        message.success('Sub Department Type added.');
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
    editingRowId,
    addSubDeptType,
    updateSubDeptType,
    message,
    closeModal,
  ]);

  const handleSearch = useCallback((values) => {
    setAppliedFilters({
      deptTypeId: values.deptTypeId ?? null,
      departmentId: values.departmentId ?? null,
      subDepartmentType: values.subDepartmentType ?? '',
    });
  }, []);

  const handleClear = useCallback(() => {
    const reset = createSubDeptTypeFilters();
    filterForm.resetFields();
    setAppliedFilters(reset);
  }, [filterForm]);

  const filteredRows = useMemo(
    () => filterSubDeptTypeRows(rows, appliedFilters),
    [rows, appliedFilters],
  );

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
          <Form
            form={filterForm}
            layout="vertical"
            className="walk-in-add-record-form hr-search-form"
            initialValues={SUB_DEPT_TYPE_FILTER_INITIAL_VALUES}
            onFinish={handleSearch}
            onValuesChange={(changed) => {
              if ('deptTypeId' in changed) {
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
        onSave={handleSave}
      />
    </div>
  );
}
