"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { App, Button, Tooltip, Input, Select } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import TestBookingModal from "@/features/admin-pathology/pages/test-booking/TestBookingModal";
import EditTestLinkModal from "./EditTestLinkageModal";
import TestBookingLinkageModal from "./TestBookingLinkageModal";
import "@/features/admin-pathology/pages/test-booking/test-booking.css"

import {
  useGetTestBookingsQuery,
  useCreateTestBookingMutation,
  useUpdateTestBookingMutation,
  useDeleteTestBookingMutation,
  useGetMainGroupsQuery,
  useGetTestNamesQuery,
  useGetPathologyComponentsQuery,
  useUpdatePathologyComponentMutation,
  useDeletePathologyComponentMutation,
} from "@/features/admin-pathology/api/pathologyApi";

import {
  createEmptyTestBookingForm,
  rowToTestBookingForm,
  SERVICE_OPTIONS,
} from "@/features/admin-pathology/api/mock-test-booking";

import { useConfirm } from "@/hooks/useConfirm";

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";

export default function TestBookingPage() {
  const { message } = App.useApp();

  const [form, setForm] = useState(createEmptyTestBookingForm());
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [bookingLinkModalOpen, setBookingLinkModalOpen] = useState(false);
  const [editLinkRecord, setEditLinkRecord] = useState(null);
  const [editLinkOpen, setEditLinkOpen] = useState(false);

  const [updateComponent] = useUpdatePathologyComponentMutation();
  const [deleteComponent] = useDeletePathologyComponentMutation();

  const { confirmDelete } = useConfirm();

  const { data: rows = [], isLoading } = useGetTestBookingsQuery();
  const { data: mainGroups = [] } = useGetMainGroupsQuery();
  const { data: testNames = [] } = useGetTestNamesQuery();
  const { data: components = [] } = useGetPathologyComponentsQuery();

  const [createBooking] = useCreateTestBookingMutation();
  const [updateBooking] = useUpdateTestBookingMutation();
  const [deleteBooking] = useDeleteTestBookingMutation();

  const selectedBooking = useMemo(
    () => rows.find((r) => r.id === selectedBookingId) ?? null,
    [rows, selectedBookingId]
  );

  const patchForm = useCallback((patch) => {
    setForm((p) => ({ ...p, ...patch }));
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

  const handleSaveLink = async (updated) => {
    const oldTestName = editLinkRecord?.testName;
    const newTestName = updated.testName;

    await updateComponent({
      id: updated.id,
      testName: updated.testName,
      componentName: updated.componentName,
    }).unwrap();

    if (selectedBooking && oldTestName !== newTestName) {
      const currentNames = selectedBooking.testNames ?? [];
      const updatedNames = currentNames.map((n) =>
        n === oldTestName ? newTestName : n
      );
      const dedupedNames = [...new Set(updatedNames)];
      await updateBooking({
        id: selectedBooking.id,
        testNames: dedupedNames,
      }).unwrap();
    }

    setEditLinkOpen(false);
    message.success("Updated successfully");
  };

  const handleSaveBookingLinkage = useCallback(() => {
    message.success("Updated successfully");
    setBookingLinkModalOpen(false);
    setSelectedBookingId(null);
  }, [message]);

  const handleEditLink = (record) => {
    setEditLinkRecord(record);
    setEditLinkOpen(true);
  };

  const handleSave = useCallback(async () => {
    const testBookingName = (form.testBookingName || "").trim();

    if (!testBookingName) return message.error("Test Booking Name required");
    if (!form.mainGroup) return message.error("Main Group required");
    if (!form.testNames?.length) return message.error("Select tests");
    if (!form.service) return message.error("Service required");
    if (!form.collectionTime)
      return message.error("Collection Time required");

    const payload = {
      mainGroup: form.mainGroup,
      testBookingName,
      testNames: form.testNames,
      service: form.service,
      specimenRequired: form.specimenRequired,
      collectionTime: form.collectionTime,
    };

    if (editingId) {
      await updateBooking({ id: editingId, ...payload }).unwrap();
      message.success("Updated successfully");
    } else {
      await createBooking(payload).unwrap();
      message.success("Created successfully");
    }

    closeModal();
  }, [form, editingId, createBooking, updateBooking, message, closeModal]);

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      return (
        (!term ||
          row.testBookingName?.toLowerCase().includes(term)) &&
        (!selectedGroup || row.mainGroup === selectedGroup)
      );
    });
  }, [rows, searchTerm, selectedGroup]);

  const columns = useMemo(
    () => [
      {
        title: "Main Group",
        dataIndex: "mainGroup",
        key: "mainGroup",
        width: 160,
      },
      {
        title: "Test Booking Name",
        dataIndex: "testBookingName",
        key: "testBookingName",
        width: 200,
        render: (value, record) => (
          <span
            style={{ color: "var(--app-primary)", cursor: "pointer" }}
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
        title: "Service",
        dataIndex: "service",
        key: "service",
        width: 180,
        render: (value) => {
          const match = SERVICE_OPTIONS.find((s) => s.value === value);
          return match?.label || value;
        },
      },
      {
        title: "Specimen Required",
        dataIndex: "specimenRequired",
        width: 150,
      },
      {
        title: "Collection Time",
        dataIndex: "collectionTime",
        width: 140,
      },
      {
        title: "Action",
        key: "action",
        width: 100,
        align: "center",
        render: (_, record) => (
          <div style={{ display: "flex", gap: 8 }}>
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={
                  <AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />
                }
                onClick={() => handleEdit(record)}
              />
            </Tooltip>

            <Tooltip title="Delete">
              <Button
                danger
                type="link"
                icon={
                  <AppIcon icon="mdi:delete-outline" className={ACTION_ICON_CLASS} />
                }
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Select
            placeholder="Filter by Main Group"
            style={{ width: 220 }}
            allowClear
            value={selectedGroup || undefined}
            options={mainGroups.map((g) => ({
              label: g.groupName,
              value: g.groupName,
            }))}
            onChange={(v) => setSelectedGroup(v || "")}
          />

          <Input
            placeholder="Filter by Test Booking Name"
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
      />

      <TestBookingModal
        open={open}
        form={form}
        onClose={closeModal}
        onPatchForm={patchForm}
        onSave={handleSave}
        mainGroups={mainGroups}
        testNames={testNames}
        services={SERVICE_OPTIONS}
        isEdit={Boolean(editingId)}
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
        onEdit={handleEditLink}
        onDelete={async (record) => {
          await deleteComponent(record.id).unwrap();
          if (selectedBooking) {
            const updatedNames = selectedBooking.testNames.filter(
              (t) => t !== record.testName
            );
            await updateBooking({
              id: selectedBooking.id,
              testNames: updatedNames,
            }).unwrap();
          }
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