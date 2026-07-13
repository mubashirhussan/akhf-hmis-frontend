"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Form, Tooltip, Input, Row, Col } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import MainGroupAddModal from "@/features/admin-pathology/pages/main-group/MainGroupAddModal";
import MainGroupEditModal from "@/features/admin-pathology/pages/main-group/MainGroupEditModal";
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
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const { confirmDelete } = useConfirm();
  const { data, isLoading } = useGetMainGroupsQuery({
    page: pagination.current,
    pageSize: pagination.pageSize,
    search: searchTerm,
  });
  const [createMainGroup] = useCreateMainGroupMutation();
  const [updateMainGroup] = useUpdateMainGroupMutation();
  const [deleteMainGroup] = useDeleteMainGroupMutation();

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
      const itemName = record.groupName;
      const confirmed = await confirmDelete({ itemName });
      if (!confirmed) return;
      await deleteMainGroup(record.id).unwrap();
      message.success("Main Group deleted.");
    },
    [confirmDelete, deleteMainGroup, message],
  );

  const handleAddSave = useCallback(async () => {
    try {
      const values = await addForm.validateFields();
      const rowPayload = {
        groupName: values.groupName.trim(),
        fee: values.fee ?? 0,
      };

      await createMainGroup(rowPayload).unwrap();

      setIsAddModalOpen(false);
      addForm.resetFields();

      message.success("Main Group created.");
    } catch {
      // validation errors are shown by antd Form
    }
  }, [addForm, createMainGroup, message]);

  const handleEditSave = useCallback(async () => {
    try {
      const values = await editForm.validateFields();
      const rowPayload = {
        groupName: values.groupName.trim(),
        fee: values.fee ?? 0,
      };

      await updateMainGroup({
        id: editingRow.id,
        ...rowPayload,
      }).unwrap();

      setIsEditModalOpen(false);
      setEditingRow(null);
      editForm.resetFields();

      message.success("Main Group updated.");
    } catch {
      // validation errors are shown by antd Form
    }
  }, [editForm, editingRow, updateMainGroup, message]);

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
    [openEditModal, handleDeleteRow],
  );

  return (
    <div className="services-billing-page main-group-page">
      <section className="services-billing-results" aria-label="main group">
        <Row gutter={[16, 16]} align="middle" className="mb-2.5">
          <Col xs={24} sm={24} md={12} lg={8} xl={4}>
            <Input
              placeholder="Filter by Main Group"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}
              allowClear
            />
          </Col>

          <Col
            xs={24}
            sm={24}
            md={12}
            lg={16}
            xl={20}
            style={{ textAlign: "right" }}
          >
            <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
              Add Main Group
            </Button>
          </Col>
        </Row>
        <DataTable
          rowKey="id"
          columns={columns}
          dataSource={data ?? []}
          loading={isLoading}
          columnAlign="left"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total) => `Total ${total} items`,
            onChange: (current, pageSize) =>
              setPagination({ current, pageSize }),
          }}
        />
      </section>

      <MainGroupAddModal
        open={isAddModalOpen}
        onClose={closeAddModal}
        form={addForm}
        onSave={handleAddSave}
      />

      <MainGroupEditModal
        open={isEditModalOpen}
        onClose={closeEditModal}
        form={editForm}
        onSave={handleEditSave}
        record={editingRow}
      />
    </div>
  );
}
