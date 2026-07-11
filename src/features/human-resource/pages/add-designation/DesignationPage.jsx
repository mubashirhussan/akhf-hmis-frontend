'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import DynamicForm from '@/components/form/DynamicForm';
import { useConfirm } from '@/hooks/useConfirm';
import { filterDesignationRows } from '@/features/human-resource/api/mock-designations';
import {
  useGetDesignationsQuery,
  useAddDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
} from '@/features/human-resource/api/employeeApi';
import {
  DESIGNATION_FILTER_FIELDS,
  DESIGNATION_FILTER_INITIAL_VALUES,
} from '@/features/human-resource/pages/add-designation/designation-fields';
import DesignationModal from './DesignationModal';
import './add-designation.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function DesignationPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [appliedFilter, setAppliedFilter] = useState('');

  const { data: rows = [], isLoading } = useGetDesignationsQuery();
  const [addDesignation] = useAddDesignationMutation();
  const [updateDesignation] = useUpdateDesignationMutation();
  const [deleteDesignation] = useDeleteDesignationMutation();

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
      const confirmed = await confirmDelete({ itemName: record.designation });
      if (!confirmed) return;
      await deleteDesignation(record.id).unwrap();
      message.success('Designation deleted.');
    },
    [confirmDelete, deleteDesignation, message],
  );

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        designation: values.designation.trim(),
        minPayScale: Number(values.minPayScale),
      };

      if (editingRow) {
        await updateDesignation({ id: editingRow.id, ...payload }).unwrap();
        closeModal();
        message.success('Designation updated.');
        return;
      }

      await addDesignation(payload).unwrap();
      closeModal();
      message.success('Designation added.');
    } catch {
      // validation errors are shown by antd Form
    }
  }, [form, editingRow, addDesignation, updateDesignation, closeModal, message]);

  const handleSearch = useCallback(() => {
    const values = filterForm.getFieldsValue();
    setAppliedFilter(values.designation ?? '');
  }, [filterForm]);

  const handleClear = useCallback(() => {
    filterForm.resetFields();
    setAppliedFilter('');
  }, [filterForm]);

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
      <section className="hr-filter-panel" aria-label="Designation search filters">
        <div className="walk-in-add-record-layout hr-search-layout">
          <Form
            form={filterForm}
            layout="vertical"
            className="walk-in-add-record-form hr-search-form"
            initialValues={DESIGNATION_FILTER_INITIAL_VALUES}
            onFinish={handleSearch}
          >
            <DynamicForm fields={DESIGNATION_FILTER_FIELDS} />
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

      <section className="services-billing-results" aria-label="Designations">
        <div className="hr-table-toolbar">
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Add Designation
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

      <DesignationModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRow ? 'Edit Designation' : 'Add Designation'}
        form={form}
        onSave={handleSave}
        record={editingRow}
      />
    </div>
  );
}
