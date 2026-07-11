'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import { useConfirm } from '@/hooks/useConfirm';
import { filterShiftRows } from '@/features/duty-roaster/api/mock-shifts';
import {
  useGetShiftsQuery,
  useAddShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} from '@/features/duty-roaster/api/dutyRoasterApi';
import {
  SHIFT_FILTER_INITIAL_VALUES,
} from '@/features/duty-roaster/pages/add-shift/shift-fields';
import ShiftFilterForm from './ShiftFilterForm';
import ShiftModal from './ShiftModal';
import './add-shift.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function parseTime(value) {
  if (!value) return null;
  const parsed = dayjs(value, 'HH:mm');
  return parsed.isValid() ? parsed : null;
}

function formatTime(value) {
  if (!value) return '';
  if (dayjs.isDayjs(value)) return value.format('HH:mm');
  return value;
}

export default function AddShiftPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(SHIFT_FILTER_INITIAL_VALUES);

  const { data: rows = [], isLoading } = useGetShiftsQuery();
  const [addShift] = useAddShiftMutation();
  const [updateShift] = useUpdateShiftMutation();
  const [deleteShift] = useDeleteShiftMutation();

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
        shiftName: record.shiftName ?? '',
        shiftDescription: record.shiftDescription ?? '',
        abbreviation: record.abbreviation ?? '',
        startTime: parseTime(record.startTime),
        endTime: parseTime(record.endTime),
        relaxationTime: record.relaxationTime ?? 0,
      });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.shiftName });
      if (!confirmed) return;
      await deleteShift(record.id).unwrap();
      message.success('Shift deleted.');
    },
    [confirmDelete, deleteShift, message],
  );

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        shiftName: values.shiftName.trim(),
        shiftDescription: values.shiftDescription?.trim() ?? '',
        abbreviation: values.abbreviation.trim(),
        startTime: formatTime(values.startTime),
        endTime: formatTime(values.endTime),
        relaxationTime: values.relaxationTime ?? 0,
      };

      if (editingRowId) {
        await updateShift({ id: editingRowId, ...payload }).unwrap();
        message.success('Shift updated.');
      } else {
        await addShift(payload).unwrap();
        message.success('Shift added.');
      }

      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [form, editingRowId, addShift, updateShift, message, closeModal]);

  const handleSearch = useCallback(() => {
    const values = filterForm.getFieldsValue();
    setAppliedFilters({
      ...values,
      startTime: formatTime(values.startTime),
      endTime: formatTime(values.endTime),
    });
  }, [filterForm]);

  const handleClear = useCallback(() => {
    filterForm.resetFields();
    setAppliedFilters(SHIFT_FILTER_INITIAL_VALUES);
  }, [filterForm]);

  const filteredRows = useMemo(
    () => filterShiftRows(rows, appliedFilters),
    [rows, appliedFilters],
  );

  const columns = useMemo(
    () => [
      {
        title: 'Serial No.',
        key: 'serialNo',
        width: 90,
        render: (_, __, index) => index + 1,
      },
      { title: 'Shift Name', dataIndex: 'shiftName', key: 'shiftName', width: 200 },
      { title: 'Abbreviation', dataIndex: 'abbreviation', key: 'abbreviation', width: 120 },
      {
        title: 'Description',
        dataIndex: 'shiftDescription',
        key: 'shiftDescription',
        width: 220,
      },
      {
        title: 'Relaxation Time',
        dataIndex: 'relaxationTime',
        key: 'relaxationTime',
        width: 130,
      },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <div className="shift-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label={`Edit ${record.shiftName}`}
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label={`Delete ${record.shiftName}`}
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
    <div className="services-billing-page add-shift-page">
      <ShiftFilterForm
        form={filterForm}
        onSubmit={handleSearch}
        onClear={handleClear}
        loading={isLoading}
      />

      <section className="services-billing-results" aria-label="Shifts">
        <div className="hr-table-toolbar">
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Add Shift
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

      <ShiftModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Shift' : 'Add Shift'}
        form={form}
        onSave={handleSave}
      />
    </div>
  );
}
