"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { App, Button, Tooltip, Input } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import MainGroupModal from "@/features/admin-pathology/pages/main-group/MainGroupModal";
import {
  createEmptyMainGroupForm,
  rowToMainGroupForm,
} from "@/features/admin-pathology/api/mock-main-group";
import "@/features/admin-pathology/pages/main-group/main-group.css";
import { useConfirm } from "@/hooks/useConfirm";
import {
  useGetMainGroupsQuery,
  useCreateMainGroupMutation,
  useUpdateMainGroupMutation,
  useDeleteMainGroupMutation,
} from "@/features/admin-pathology/api/pathologyApi";

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";

export default function MainGroupPage() {
  const { message } = App.useApp();

  const [form, setForm] = useState(createEmptyMainGroupForm);
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const { confirmDelete } = useConfirm();

  const { data: rows = [], isLoading } = useGetMainGroupsQuery();

  const [createMainGroup] = useCreateMainGroupMutation();
  const [updateMainGroup] = useUpdateMainGroupMutation();
  const [deleteMainGroup] = useDeleteMainGroupMutation();

  const patchForm = useCallback((patch) => {
    setForm((current) => ({ ...current, ...patch }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const openComponentModal = useCallback(() => {
    setForm(createEmptyMainGroupForm());
    setEditingRowId(null);
    setFieldErrors({});
    setIsComponentModalOpen(true);
  }, []);

  const closeComponentModal = useCallback(() => {
    setIsComponentModalOpen(false);
    setEditingRowId(null);
    setFieldErrors({});
  }, []);

  const handleEditRow = useCallback((record) => {
    setForm(rowToMainGroupForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsComponentModalOpen(true);
  }, []);
  const handleDeleteRow = useCallback(
    async (record) => {
      const itemName = record.groupName;
      const confirmed = await confirmDelete({ itemName });
      if (!confirmed) return;
      await deleteMainGroup(record.id).unwrap();
      message.success("Main Group deleted.");
    },
    [confirmDelete, deleteMainGroup, message],
  );

  const handleSave = useCallback(async () => {
    const groupName = form.groupName.trim();

    if (!groupName) {
      setFieldErrors({
        groupName: "Group Name is required.",
      });
      return;
    }

    setFieldErrors({});

    const rowPayload = {
      groupName,
      fee: form.fee ?? 0,
    };

    if (editingRowId) {
      await updateMainGroup({
        id: editingRowId,
        ...rowPayload,
      }).unwrap();

      setIsComponentModalOpen(false);
      setEditingRowId(null);

      message.success("Main Group updated.");

      return;
    }

    await createMainGroup(rowPayload).unwrap();

    setIsComponentModalOpen(false);

    message.success("Main Group created.");
  }, [form, editingRowId, createMainGroup, updateMainGroup, message]);

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return rows;

    return rows.filter((row) => row.groupName?.toLowerCase().includes(term));
  }, [rows, searchTerm]);

  const columns = useMemo(
    () => [
      {
        title: "Test Group ID",
        dataIndex: "groupId",
        key: "groupId",
        width: 140,
      },
      {
        title: "Test Group",
        dataIndex: "groupName",
        key: "groupName",
        width: 140,
      },
      { title: "Fee", dataIndex: "fee", key: "fee", width: 140 },
      {
        title: "Action",
        key: "action",
        width: 90,
        align: "center",
        render: (_, record) => (
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                className="main-group-actions-cell"
                aria-label="Edit main-group"
                icon={
                  <AppIcon
                    icon="mdi:pencil-outline"
                    className={ACTION_ICON_CLASS}
                  />
                }
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                icon={
                  <AppIcon
                    icon="mdi:delete-outline"
                    className={ACTION_ICON_CLASS}
                  />
                }
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
    <div className="services-billing-page main-group-page">
      <div
        className="main-group-table-toolbar"
        style={{ display: "flex", gap: 12, justifyContent: "space-between" }}
      >
        <Input
          placeholder="Filter by Main Group"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          style={{ width: 260 }}
        />

        <Button type="primary" onClick={openComponentModal}>
          Add Main Group
        </Button>
      </div>

      <section className="services-billing-results" aria-label="main group">
        <DataTable
          rowKey="id"
          columns={columns}
          dataSource={filteredRows}
          loading={isLoading}
          columnAlign="left"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </section>

      <MainGroupModal
        open={isComponentModalOpen}
        onClose={closeComponentModal}
        title={editingRowId ? "Edit Main Group" : "Add Main Group"}
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
      />
    </div>
  );
}
