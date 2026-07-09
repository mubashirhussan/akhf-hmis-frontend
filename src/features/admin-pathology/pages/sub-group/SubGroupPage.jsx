"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Form, Tooltip, Select, Input } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import SubGroupAddModal from "@/features/admin-pathology/pages/sub-group/SubGroupAddModal";
import SubGroupEditModal from "@/features/admin-pathology/pages/sub-group/SubGroupEditModal";
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
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
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


  const patchFilter = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

const groupOptions = useMemo(() => {
  return mainGroups.map((g) => ({
    label: g.groupName,
    value: g.groupName,
  }));
}, [mainGroups]);

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
  const handleAddSave = useCallback(async () => {
    try {
      const values = await addForm.validateFields();
      const selectedGroup = mainGroups.find((group) => group.TGID === values.TGID);
      const rowPayload = {
        TGID: values.TGID,
        groupName: selectedGroup?.groupName,
        subGroupName: values.subGroupName.trim(),
        fee: values.fee ?? 0,
      };

      await createSubGroup(rowPayload).unwrap();

      setIsAddModalOpen(false);
      addForm.resetFields();

      message.success("Sub Group created.");
    } catch {
      // validation errors are shown by antd Form
    }
  }, [addForm, mainGroups, createSubGroup, message]);

  const handleEditSave = useCallback(async () => {
    try {
      const values = await editForm.validateFields();
      const selectedGroup = mainGroups.find((group) => group.TGID === values.TGID);
      const rowPayload = {
        TGID: values.TGID,
        groupName: selectedGroup?.groupName,
        subGroupName: values.subGroupName.trim(),
        fee: values.fee ?? 0,
      };

      await updateSubGroup({
        id: editingRow.id,
        ...rowPayload,
      }).unwrap();

      setIsEditModalOpen(false);
      setEditingRow(null);
      editForm.resetFields();

      message.success("Sub Group updated.");
    } catch {
      // validation errors are shown by antd Form
    }
  }, [editForm, editingRow, mainGroups, updateSubGroup, message]);

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
        title: "Test Group ID",
        dataIndex: "TGID",
        key: "TGID",
        width: 140,
      },
      {
        title: "Test Group",
        dataIndex: "groupName",
        key: "groupName",
        width: 140,
      },
{
  title: "Test Sub Group ID",
  dataIndex: "TSGID",
  key: "TSGID",
  width: 160,
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
                onClick={() => openEditModal(record)}
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
    [handleDeleteRow],
  );

  return (
    <div className="services-billing-page sub-group-page">
       <div
  className="sub-group-table-toolbar"
  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
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
        <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
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
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ["20", "50", "100"],
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </section>

      <SubGroupAddModal
        open={isAddModalOpen}
        onClose={closeAddModal}
        form={addForm}
        onSave={handleAddSave}
      />

      <SubGroupEditModal
        open={isEditModalOpen}
        onClose={closeEditModal}
        form={editForm}
        onSave={handleEditSave}
        record={editingRow}
      />
    </div>
  );
}
