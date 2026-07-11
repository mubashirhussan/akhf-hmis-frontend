'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Tag, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import DynamicForm from '@/components/form/DynamicForm';
import { useConfirm } from '@/hooks/useConfirm';
import { filterDeptTypeRows } from '@/features/human-resource/api/mock-department-types';
import {
  useGetDeptTypesQuery,
  useAddDeptTypeMutation,
  useUpdateDeptTypeMutation,
  useDeleteDeptTypeMutation,
  useGetHospitalsQuery,
} from '@/features/human-resource/api/employeeApi';
import DeptTypeModal from './DeptTypeModal';
import {
  DEPT_TYPE_FILTER_INITIAL_VALUES,
  getDeptTypeFilterFields,
} from './dept-type-fields';
import './department-type.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function DepartmentTypePage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [appliedFilter, setAppliedFilter] = useState({});

  const { data: rows = [], isLoading } = useGetDeptTypesQuery();
  const { data: hospitals = [] } = useGetHospitalsQuery();
  const [addDeptType] = useAddDeptTypeMutation();
  const [updateDeptType] = useUpdateDeptTypeMutation();
  const [deleteDeptType] = useDeleteDeptTypeMutation();

  const hospitalOptions = useMemo(
    () => hospitals.map((h) => ({ value: h.id, label: h.name })),
    [hospitals],
  );

  const filterFields = useMemo(
    () => getDeptTypeFilterFields({ hospitalOptions }),
    [hospitalOptions],
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
        departmentType: record.departmentType ?? '',
        status: record.status ?? 'active',
      });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

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
    try {
      const values = await form.validateFields();
      const hospitalName =
        hospitals.find((h) => h.id === values.hospitalId)?.name ?? '';

      const payload = {
        hospitalId: values.hospitalId,
        hospitalName,
        departmentType: values.departmentType.trim(),
        status: values.status ?? 'active',
      };

      if (editingRowId) {
        await updateDeptType({ id: editingRowId, ...payload }).unwrap();
        message.success('Department Type updated.');
      } else {
        await addDeptType(payload).unwrap();
        message.success('Department Type added.');
      }

      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [form, hospitals, editingRowId, addDeptType, updateDeptType, message, closeModal]);

  const handleSearch = useCallback((values) => {
    setAppliedFilter({
      hospitalId: values.hospitalId ?? null,
      departmentType: values.departmentType ?? '',
      status: values.status ?? null,
    });
  }, []);

  const handleClear = useCallback(() => {
    filterForm.resetFields();
    setAppliedFilter({});
  }, [filterForm]);

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
          <Tag className={status === 'active' ? 'status-active' : 'status-inactive'}>
            {status === 'active' ? 'Active' : 'inactive'}
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
          <Form
            form={filterForm}
            layout="vertical"
            className="walk-in-add-record-form hr-search-form"
            initialValues={DEPT_TYPE_FILTER_INITIAL_VALUES}
            onFinish={handleSearch}
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
        onSave={handleSave}
        isEdit={!!editingRowId}
      />
    </div>
  );
}
