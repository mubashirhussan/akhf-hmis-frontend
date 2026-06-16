"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { App, Button, Tooltip, Select, Input } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import SubGroupModal from "@/features/admin-pathology/pages/sub-group/SubGroupModal";
import {
  GROUP_OPTIONS,
  createEmptySubGroupForm,
  getOptionLabel,
  rowToSubGroupForm,
} from "@/features/admin-pathology/api/mock-sub-group";
import "@/features/admin-pathology/pages/sub-group/sub-group.css";
import { useConfirm } from "@/hooks/useConfirm";
import {
  useGetSubGroupsQuery,
  useCreateSubGroupMutation,
  useUpdateSubGroupMutation,
  useDeleteSubGroupMutation,
  useGetMainGroupsQuery,
} from "@/features/admin-pathology/api/pathologyApi";

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";

export default function SubGroupPage() {
  const { message } = App.useApp();

  const [form, setForm] = useState(createEmptySubGroupForm);
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const { confirmDelete } = useConfirm();
  const [filters, setFilters] = useState({
    groupName: "",
    subGroupName: "",
  });
  const { data: rows = [], isLoading } = useGetSubGroupsQuery();
  const { data: mainGroups = [] } = useGetMainGroupsQuery();
  const [createSubGroup] = useCreateSubGroupMutation();
  const [updateSubGroup] = useUpdateSubGroupMutation();
  const [deleteSubGroup] = useDeleteSubGroupMutation();


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

  const patchFilter = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const groupOptions = useMemo(() => {
    const uniqueGroups = [...new Set(rows.map((r) => r.groupName))];

    return uniqueGroups.map((group) => ({
      label: group,
      value: group,
    }));
  }, [rows]);

  const openComponentModal = useCallback(() => {
    setForm(createEmptySubGroupForm());
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
    setForm(rowToSubGroupForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsComponentModalOpen(true);
  }, []);
  const handleDeleteRow = useCallback(
    async (record) => {
      const itemName = record.subGroupName;
      const confirmed = await confirmDelete({
        itemName,
      });
      if (!confirmed) return;
      await deleteSubGroup(record.id).unwrap();
      message.success("Sub Group deleted.");
    },
    [confirmDelete, deleteSubGroup, message],
  );
  const handleSave = useCallback(async () => {
const groupId = form.groupId;
const subGroupName = (form.subGroupName || "").trim();
const selectedGroup = mainGroups.find(
  (g) => g.groupId === form.groupId
);
if (!groupId || !subGroupName) {
  setFieldErrors({
    groupId: !groupId ? "Group Name is required." : "",
    subGroupName: !subGroupName ? "Sub Group Name is required." : "",
  });
  return;
}

    setFieldErrors({});

const rowPayload = {
  groupId: form.groupId,
  groupName: selectedGroup?.groupName,
  subGroupName,
  fee: form.fee ?? 0,
};
    if (editingRowId) {
      await updateSubGroup({
        id: editingRowId,
        ...rowPayload,
      }).unwrap();
      setIsComponentModalOpen(false);
      setEditingRowId(null);

      message.success("Sub Group updated.");

      return;
    }

    await createSubGroup(rowPayload).unwrap();

    setIsComponentModalOpen(false);

    message.success("Sub Group created.");
  }, [form, editingRowId, createSubGroup, updateSubGroup, message]);

  const filteredRows = useMemo(() => {
    const group = filters.groupName;
    const subGroup = filters.subGroupName.trim().toLowerCase();

    return rows.filter((row) => {
      const matchGroup = group ? row.groupName === group : true;

      const matchSubGroup = subGroup
        ? row.subGroupName?.toLowerCase().includes(subGroup)
        : true;

      return matchGroup && matchSubGroup;
    });
  }, [rows, filters]);

  const columns = useMemo(
    () => [
      {
        title: "Test Group",
        dataIndex: "groupName",
        key: "groupName",
        width: 140,
      },
      {
        title: "Test Group ID",
        dataIndex: "groupId",
        key: "groupId",
        width: 140,
      },
      {
        title: "Test Sub Group",
        dataIndex: "subGroupName",
        key: "subGroupName",
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
                className="sub-group-actions-cell"
                aria-label="Edit Sub Group"
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
    <div className="services-billing-page sub-group-page">
      <div
        className="sub-group-table-toolbar"
        style={{ justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <Select
            placeholder="Filter by Main Group"
            style={{ width: 220 }}
            allowClear
            value={filters.groupName || undefined}
            options={groupOptions}
            onChange={(value) => patchFilter({ groupName: value })}
          />

          <Input
            placeholder="Filter by Sub Group"
            value={filters.subGroupName}
            onChange={(e) => patchFilter({ subGroupName: e.target.value })}
            allowClear
            style={{ width: 240 }}
          />
        </div>
        <Button type="primary" onClick={openComponentModal}>
          Add Sub Group
        </Button>
      </div>

      <section className="services-billing-results" aria-label="sub group">
        <DataTable
          rowKey="id"
          columns={columns}
          loading={isLoading}
          dataSource={filteredRows}
          columnAlign="left"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </section>

      <SubGroupModal
        open={isComponentModalOpen}
        onClose={closeComponentModal}
        title={editingRowId ? "Edit Sub Group" : "Add Sub Group"}
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
      />
    </div>
  );
}
