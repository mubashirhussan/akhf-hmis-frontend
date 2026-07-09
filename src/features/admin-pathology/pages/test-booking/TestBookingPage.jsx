'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Tooltip, Input, Select } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import TestBookingAddModal from '@/features/admin-pathology/pages/test-booking/TestBookingAddModal';
import TestBookingEditModal from '@/features/admin-pathology/pages/test-booking/TestBookingEditModal';
import TestBookingLinkageModal from '@/features/admin-pathology/pages/test-booking/TestBookingLinkageModal';
import EditTestLinkModal from '@/features/admin-pathology/pages/test-booking/EditTestLinkageModal';
import '@/features/admin-pathology/pages/test-booking/test-booking.css';
import {
  useGetTestBookingsQuery,
  useCreateTestBookingMutation,
  useUpdateTestBookingMutation,
  useDeleteTestBookingMutation,
  useGetMainGroupsQuery,
  useGetPathologyComponentsQuery,
  useUpdatePathologyComponentMutation,
  useDeletePathologyComponentMutation,
} from '@/features/admin-pathology/api/pathologyApi';
import { SERVICE_OPTIONS } from '@/features/admin-pathology/api/mock-test-booking';
import { useConfirm } from '@/hooks/useConfirm';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function TestBookingPage() {
  const { message } = App.useApp();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data: rows = [], isLoading } = useGetTestBookingsQuery();
  const { data: mainGroups = [] } = useGetMainGroupsQuery();
  const { data: components = [] } = useGetPathologyComponentsQuery();

  const [createBooking] = useCreateTestBookingMutation();
  const [updateBooking] = useUpdateTestBookingMutation();
  const [deleteBooking] = useDeleteTestBookingMutation();
  const [updateComponent] = useUpdatePathologyComponentMutation();
  const [deleteComponent] = useDeletePathologyComponentMutation();

  const { confirmDelete } = useConfirm();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [bookingLinkModalOpen, setBookingLinkModalOpen] = useState(false);
  const [editLinkRecord, setEditLinkRecord] = useState(null);
  const [editLinkOpen, setEditLinkOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const selectedBooking = useMemo(
    () => rows.find((r) => r.id === selectedBookingId) ?? null,
    [rows, selectedBookingId],
  );

  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    addForm.resetFields();
  }, [addForm]);

  const openEditModal = useCallback((record) => {
    setEditingRow(record);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingRow(null);
    editForm.resetFields();
  }, [editForm]);

  const handleAddSave = useCallback(async () => {
    try {
      const values = await addForm.validateFields();
      const payload = {
        mainGroup: values.mainGroup,
        testBookingName: values.testBookingName.trim(),
        testNames: values.testNames,
        service: values.service,
        specimenRequired: (values.specimenRequired || '').trim(),
        collectionTime: values.collectionTime ?? '',
      };

      await createBooking(payload).unwrap();
      setIsAddModalOpen(false);
      addForm.resetFields();
      message.success('Created successfully.');
    } catch {
      // validation errors shown by antd Form
    }
  }, [addForm, createBooking, message]);

  const handleEditSave = useCallback(async () => {
    try {
      const values = await editForm.validateFields();
      const payload = {
        mainGroup: values.mainGroup,
        testBookingName: values.testBookingName.trim(),
        testNames: values.testNames,
        service: values.service,
        specimenRequired: (values.specimenRequired || '').trim(),
        collectionTime: values.collectionTime ?? '',
      };

      await updateBooking({ id: editingRow.id, ...payload }).unwrap();
      setIsEditModalOpen(false);
      setEditingRow(null);
      editForm.resetFields();
      message.success('Updated successfully.');
    } catch {
      // validation errors shown by antd Form
    }
  }, [editForm, editingRow, updateBooking, message]);

  const handleDelete = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.testBookingName });
      if (!confirmed) return;
      await deleteBooking(record.id).unwrap();
      message.success('Deleted successfully.');
    },
    [confirmDelete, deleteBooking, message],
  );

  const handleSaveLink = useCallback(
    async (updated) => {
      const oldTestName = editLinkRecord?.testName;
      const newTestName = updated.testName;

      await updateComponent({
        id: updated.id,
        testName: updated.testName,
        componentName: updated.componentName,
      }).unwrap();

      if (selectedBooking && oldTestName !== newTestName) {
        const updatedNames = [
          ...new Set(
            (selectedBooking.testNames ?? []).map((n) => (n === oldTestName ? newTestName : n)),
          ),
        ];
        await updateBooking({ id: selectedBooking.id, testNames: updatedNames }).unwrap();
      }

      setEditLinkOpen(false);
      message.success('Updated successfully.');
    },
    [editLinkRecord, selectedBooking, updateComponent, updateBooking, message],
  );

  const handleSaveBookingLinkage = useCallback(() => {
    message.success('Updated successfully.');
    setBookingLinkModalOpen(false);
    setSelectedBookingId(null);
  }, [message]);

  const groupOptions = useMemo(
    () => mainGroups.map((g) => ({ label: g.groupName, value: g.groupName })),
    [mainGroups],
  );

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return rows.filter(
      (row) =>
        (!term || row.testBookingName?.toLowerCase().includes(term)) &&
        (!selectedGroup || row.mainGroup === selectedGroup),
    );
  }, [rows, searchTerm, selectedGroup]);

  const columns = useMemo(
    () => [
      { title: 'Main Group', dataIndex: 'mainGroup', key: 'mainGroup', width: 160 },
      {
        title: 'Test Booking Name',
        dataIndex: 'testBookingName',
        key: 'testBookingName',
        width: 200,
        render: (value, record) => (
          <span
            style={{ color: 'var(--app-primary)', cursor: 'pointer' }}
            onClick={() => {
              setSelectedBookingId(record.id);
              setBookingLinkModalOpen(true);
            }}
          >
            {value}
          </span>
        ),
      },
      {
        title: 'Service',
        dataIndex: 'service',
        key: 'service',
        width: 180,
        render: (value) => SERVICE_OPTIONS.find((s) => s.value === value)?.label ?? value,
      },
      { title: 'Specimen Required', dataIndex: 'specimenRequired', width: 150 },
      { title: 'Collection Time', dataIndex: 'collectionTime', width: 140 },
      {
        title: 'Action',
        key: 'action',
        width: 100,
        align: 'center',
        render: (_, record) => (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => openEditModal(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                icon={<AppIcon icon="mdi:delete-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [openEditModal, handleDelete],
  );

  return (
    <div className="services-billing-page test-booking-page">
      <div
        className="test-booking-table-toolbar"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 }}
      >
        <div style={{ display: 'flex', gap: 10 }}>
          <Select
            placeholder="Filter by Main Group"
            style={{ width: 220 }}
            allowClear
            value={selectedGroup || undefined}
            options={groupOptions}
            onChange={(v) => setSelectedGroup(v || '')}
          />
          <Input
            placeholder="Filter by Test Booking Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            style={{ width: 260 }}
          />
        </div>
        <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
          Add Test Booking
        </Button>
      </div>

      <section className="services-billing-results" aria-label="Test bookings">
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

      <TestBookingAddModal
        open={isAddModalOpen}
        onClose={closeAddModal}
        form={addForm}
        onSave={handleAddSave}
      />

      <TestBookingEditModal
        open={isEditModalOpen}
        onClose={closeEditModal}
        form={editForm}
        onSave={handleEditSave}
        record={editingRow}
      />

      <TestBookingLinkageModal
        open={bookingLinkModalOpen}
        booking={selectedBooking}
        components={components}
        onClose={() => {
          setBookingLinkModalOpen(false);
          setSelectedBookingId(null);
        }}
        onSave={handleSaveBookingLinkage}
        onDelete={async (record) => {
          await deleteComponent(record.id).unwrap();
          if (selectedBooking) {
            const updatedNames = selectedBooking.testNames.filter(
              (t) => t !== record.testName,
            );
            await updateBooking({ id: selectedBooking.id, testNames: updatedNames }).unwrap();
          }
        }}
        onAddTest={async (bookingId, updatedTestNames) => {
          await updateBooking({ id: bookingId, testNames: updatedTestNames }).unwrap();
          message.success('Test added successfully.');
        }}
      />

      <EditTestLinkModal
        open={editLinkOpen}
        record={editLinkRecord}
        booking={selectedBooking}
        components={components}
        onClose={() => setEditLinkOpen(false)}
        onSave={handleSaveLink}
      />
    </div>
  );
}