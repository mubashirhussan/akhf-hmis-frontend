"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Tooltip, Input } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import TestBookingModal from "@/features/admin-pathology/pages/test-booking/TestBookingModal";
import {
  useGetTestBookingsQuery,
  useCreateTestBookingMutation,
  useUpdateTestBookingMutation,
  useDeleteTestBookingMutation,
  useGetMainGroupsQuery,
  useGetPathologyComponentsQuery,
} from "@/features/admin-pathology/api/pathologyApi";

import {
  createEmptyTestBookingForm,
  rowToTestBookingForm,
  SERVICE_OPTIONS,
} from "@/features/admin-pathology/api/mock-test-booking";

import { useConfirm } from "@/hooks/useConfirm";
import "@/features/admin-pathology/pages/test-booking/test-booking.css";
import { Select } from "antd";

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";

export default function TestBookingPage() {
  const { message } = App.useApp();

  const [form, setForm] = useState(createEmptyTestBookingForm());
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const { confirmDelete } = useConfirm();

  const { data: rows = [], isLoading } = useGetTestBookingsQuery();
  const { data: mainGroups = [] } = useGetMainGroupsQuery();
  const { data: components = [] } = useGetPathologyComponentsQuery();

  const [createBooking] = useCreateTestBookingMutation();
  const [updateBooking] = useUpdateTestBookingMutation();
  const [deleteBooking] = useDeleteTestBookingMutation();

  const patchForm = useCallback((patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const openModal = useCallback(() => {
    setForm(createEmptyTestBookingForm());
    setEditingId(null);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setEditingId(null);
  }, []);

  const handleEdit = useCallback((record) => {
    setForm(rowToTestBookingForm(record));
    setEditingId(record.id);
    setOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({
        itemName: record.testBookingName,
      });

      if (!confirmed) return;

      await deleteBooking(record.id).unwrap();
      message.success("Deleted successfully");
    },
    [confirmDelete, deleteBooking, message]
  );

  const handleSave = useCallback(async () => {
    const testBookingName = (form.testBookingName || "").trim();

    if (!testBookingName) {
      message.error("Test Booking Name is required");
      return;
    }

    const payload = {
      mainGroup: form.mainGroup,
      testBookingName,
      service: form.service,
    };

if (editingId) {
await updateBooking({
  id: editingId,
  mainGroup: form.mainGroup,
  component: form.component,
  testBookingName: form.testBookingName,
  service: form.service,
  specimenRequired: form.specimenRequired,
  collectionTime: form.collectionTime,
  gender: form.gender,
}).unwrap();

  message.success("Updated successfully");
} else {
await createBooking({
  mainGroup: form.mainGroup,
  component: form.component,
  testBookingName,
  service: form.service,
  specimenRequired: "",
  collectionTime: "",
  gender: "",
}).unwrap();

  message.success("Created successfully");
}

    closeModal();
  }, [
    form,
    editingId,
    createBooking,
    updateBooking,
    message,
    closeModal,
  ]);

const filteredRows = useMemo(() => {
  const term = searchTerm.trim().toLowerCase();

  return rows.filter((r) => {
    const matchesSearch =
      !term ||
      r.testBookingName?.toLowerCase().includes(term);

    const matchesGroup =
      !selectedGroup || r.mainGroup === selectedGroup;

    return matchesSearch && matchesGroup;
  });
}, [rows, searchTerm, selectedGroup]);

  const columns = useMemo(
    () => [
      {
        title: "Test Booking Name",
        dataIndex: "testBookingName",
        key: "testBookingName",
      },
      {
        title: "Specimen Required",
        dataIndex: "specimenRequired",
        key: "specimenRequired",
      },
      {
        title: "Collection Time",
        dataIndex: "collectionTime",
        key: "collectionTime",
      },
      {
        title: "Gender",
        dataIndex: "gender",
        key: "gender",
      },
      {
        title: "Action",
        key: "action",
        width: 80,
        align: "center",
        render: (_, record) => (
          <Tooltip title="Edit">
            <Button
              type="link"
              size="small"
              icon={
                <AppIcon
                  icon="mdi:pencil-outline"
                  className={ACTION_ICON_CLASS}
                />
              }
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        ),
      },
    ],
    [handleEdit]
  );

  return (
    <div className="test-booking-page">
      <div className="test-booking-toolbar flex justify-between">
        <div className="filter flex gap-2">
        <Select
  placeholder="Filter by Main Group"
  style={{ width: 220, marginLeft: 10 }}
  allowClear
  value={selectedGroup}
  options={mainGroups.map(g => ({
    label: g.groupName,
    value: g.groupName,
  }))}
  onChange={(value) => setSelectedGroup(value || "")}
/>
        <Input
          placeholder="Search Test Booking"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          style={{ width: 260 }}
        />
</div>
        <Button type="primary" onClick={openModal}>
          Add Test Booking
        </Button>
      </div>

      <DataTable
        rowKey="id"
        columns={columns}
        dataSource={filteredRows}
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />

<TestBookingModal
  open={open}
  form={form}
  onClose={closeModal}
  onPatchForm={patchForm}
  onSave={handleSave}
  mainGroups={mainGroups}
  components={components}
  services={SERVICE_OPTIONS}
  isEdit={!!editingId}
/>
    </div>
  );
}