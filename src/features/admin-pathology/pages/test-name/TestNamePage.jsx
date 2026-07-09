"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Form, Tooltip, Select, Input } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import TestNameAddModal from "@/features/admin-pathology/pages/test-name/TestNameAddModal";
import TestNameEditModal from "@/features/admin-pathology/pages/test-name/TestNameEditModal";
import { useConfirm } from "@/hooks/useConfirm";
import {
  useGetTestNamesQuery,
  useCreateTestNameMutation,
  useUpdateTestNameMutation,
  useDeleteTestNameMutation,
  useGetSubGroupsQuery,
  useGetMainGroupsQuery,
} from "@/features/admin-pathology/api/pathologyApi";

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";

export default function TestNamePage() {
  const { message } = App.useApp();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [filters, setFilters] = useState({
    groupName: "",
    subGroupName: "",
    testName: "",
  });
  const { confirmDelete } = useConfirm();
  const { data: rows = [], isLoading } = useGetTestNamesQuery();
  const { data: subGroups = [] } = useGetSubGroupsQuery();
  const { data: mainGroups = [] } = useGetMainGroupsQuery();
  const [createTestName] = useCreateTestNameMutation();
  const [updateTestName] = useUpdateTestNameMutation();
  const [deleteTestName] = useDeleteTestNameMutation();

  const patchFilter = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

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
      const itemName = record.testName;
      const confirmed = await confirmDelete({
        itemName,
      });
      if (!confirmed) return;
      await deleteTestName(record.id).unwrap();
      message.success("Test deleted.");
    },
    [confirmDelete, deleteTestName, message],
  );

const handleAddSave = useCallback(async () => {
    try {
      const values = await addForm.validateFields();
      const selectedGroup = mainGroups.find((g) => g.TGID === values.TGID);
      const selectedSubGroup = subGroups.find((sg) => sg.TSGID === values.TSGID);
      const rowPayload = {
        TGID: values.TGID,
        TSGID: values.TSGID,
        groupName: selectedGroup?.groupName ?? '',
        subGroupName: selectedSubGroup?.subGroupName ?? '',
        testName: values.testName.trim(),
        medicalName: values.medicalName ?? '',
        standardName: values.standardName ?? '',
        fee: values.fee ?? 0,
      };

      await createTestName(rowPayload).unwrap();

      setIsAddModalOpen(false);
      addForm.resetFields();

      message.success("Test Name created.");
    } catch {
      // validation errors are shown by antd Form
    }
  }, [addForm, mainGroups, subGroups, createTestName, message]);

  const handleEditSave = useCallback(async () => {
    try {
      const values = await editForm.validateFields();
      const selectedGroup = mainGroups.find((g) => g.TGID === values.TGID);
      const selectedSubGroup = subGroups.find((sg) => sg.TSGID === values.TSGID);
      const rowPayload = {
        TGID: values.TGID,
        TSGID: values.TSGID,
        groupName: selectedGroup?.groupName ?? '',
        subGroupName: selectedSubGroup?.subGroupName ?? '',
        testName: values.testName.trim(),
        medicalName: values.medicalName ?? '',
        standardName: values.standardName ?? '',
        fee: values.fee ?? 0,
      };

      await updateTestName({
        id: editingRow.id,
        ...rowPayload,
      }).unwrap();

      setIsEditModalOpen(false);
      setEditingRow(null);
      editForm.resetFields();

      message.success("Test Name updated.");
    } catch {
      // validation errors are shown by antd Form
    }
  }, [editForm, editingRow, mainGroups, subGroups, updateTestName, message]);

const groupOptions = useMemo(
    () => mainGroups.map((g) => ({ label: g.groupName, value: g.groupName })),
    [mainGroups],
  );

  const subGroupOptions = useMemo(
    () =>
      subGroups
        .filter((sg) => (filters.groupName ? sg.groupName === filters.groupName : true))
        .map((sg) => ({ label: sg.subGroupName, value: sg.subGroupName })),
    [subGroups, filters.groupName],
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesGroup = filters.groupName
        ? row.groupName === filters.groupName
        : true;

      const matchesSubGroup = filters.subGroupName
        ? row.subGroupName === filters.subGroupName
        : true;

      const matchesTestName = filters.testName.trim()
        ? row.testName
            ?.toLowerCase()
            .includes(filters.testName.trim().toLowerCase())
        : true;

      return matchesGroup && matchesSubGroup && matchesTestName;
    });
  }, [rows, filters]);

  const columns = useMemo(
    () => [
      { title: "TID", dataIndex: "tid", key: "tid", width: 72 },
      {
        title: "Group Name",
        dataIndex: "groupName",
        key: "groupName",
        width: 130,
        className: "test-name-col-group-name",
      },
      {
        title: "Sub Group Name",
        dataIndex: "subGroupName",
        key: "subGroupName",
        width: 140,
      },
      {
        title: "Test Name",
        dataIndex: "testName",
        key: "testName",
        width: 160,
      },
      {
        title: "Control Type",
        dataIndex: "fieldType",
        key: "fieldType",
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
                className="test-name-actions-cell"
                aria-label="Edit Test Name"
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
    [ handleDeleteRow],
  );

  return (
    <div className="services-billing-page test-name-page">
      <div
        className="test-name-table-toolbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <Select
            placeholder="Filter by Main Group"
            style={{ width: 220 }}
            allowClear
            value={filters.groupName || undefined}
            options={groupOptions}
            onChange={(value) =>
              patchFilter({
                groupName: value || "",
                subGroupName: "",
              })
            }
          />

          <Select
            placeholder="Filter by Sub Group"
            allowClear
            style={{ width: 220 }}
            value={filters.subGroupName || undefined}
            options={subGroupOptions}
            onChange={(value) =>
              patchFilter({
                subGroupName: value || "",
              })
            }
          />

          <Input
            placeholder="Filter by Test Name"
            allowClear
            style={{ width: 250 }}
            value={filters.testName}
            onChange={(e) =>
              patchFilter({
                testName: e.target.value,
              })
            }
          />
        </div>

        <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
          Add Test Name
        </Button>
      </div>

      <section className="services-billing-results" aria-label="Test Name">
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

<TestNameAddModal
        open={isAddModalOpen}
        onClose={closeAddModal}
        form={addForm}
        onSave={handleAddSave}
      />

      <TestNameEditModal
        open={isEditModalOpen}
        onClose={closeEditModal}
        form={editForm}
        onSave={handleEditSave}
        record={editingRow}
      />
    </div>
  );
}
