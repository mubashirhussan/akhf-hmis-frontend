"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Tooltip, Select, Input } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import TestNameModal from "@/features/admin-pathology/pages/test-name/TestNameModal";
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

const [form, setForm] = useState(() => ({
  TGID: null,
  TSGID: null,
  groupName: "",
  subGroupName: "",
  testName: "",
  medicalName: "",
  standardName: "",
  fee: 0,
}));
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
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

  const patchForm = useCallback((patch) => {
    setForm((current) => ({ ...current, ...patch }));
  }, []);
  const patchFilter = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
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
  setForm({
    TGID: null,
    TSGID: null,
    groupName: "",
    subGroupName: "",
    testName: "",
    medicalName: "",
    standardName: "",
    fee: 0,
  });
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
  const matchedGroup = mainGroups.find(
    (g) => g.groupName === record.groupName,
  );
  const resolvedTGID = record.TGID ?? matchedGroup?.TGID ?? null;

  const matchedSubGroup = subGroups.find(
    (sg) =>
      sg.subGroupName === record.subGroupName &&
      sg.TGID === resolvedTGID,
  );
  const resolvedTSGID = record.TSGID ?? matchedSubGroup?.TSGID ?? null;

  setForm({
    TGID: resolvedTGID,
    TSGID: resolvedTSGID,
    groupName: record.groupName ?? "",
    subGroupName: record.subGroupName ?? "",
    testName: record.testName ?? "",
    medicalName: record.medicalName ?? "",
    standardName: record.standardName ?? "",
    fee: record.fee ?? 0,
  });
  setEditingRowId(record.id);
  setFieldErrors({});
  setIsComponentModalOpen(true);
}, [mainGroups, subGroups]);

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

const handleSave = useCallback(async () => {
  const testName = (form.testName || "").trim();

  const errors = {};
  if (!form.TGID) errors.TGID = "Group Name is required.";
  if (!form.TSGID) errors.TSGID = "Sub Group Name is required.";
  if (!testName) errors.testName = "Test Name is required.";

  if (Object.keys(errors).length > 0) {
    setFieldErrors(errors);
    return;
  }

  setFieldErrors({});

  const rowPayload = {
    TGID: form.TGID,
    TSGID: form.TSGID,
    testName,
    medicalName: form.medicalName ?? "",
    standardName: form.standardName ?? "",
    fee: form.fee ?? 0,
  };

  if (editingRowId) {
    await updateTestName({ id: editingRowId, ...rowPayload }).unwrap();
    setIsComponentModalOpen(false);
    setEditingRowId(null);
    message.success("Test Name updated.");
    return;
  }

  await createTestName(rowPayload).unwrap();
  setIsComponentModalOpen(false);
  message.success("Test Name created.");
}, [form, editingRowId, createTestName, updateTestName, message]);

const groupOptions = useMemo(() => {
  return mainGroups.map((g) => ({
    label: g.groupName,
    value: g.groupName,
  }));
}, [mainGroups]);

const subGroupOptions = useMemo(() => {
  return subGroups
    .filter((sg) =>
      filters.groupName ? sg.groupName === filters.groupName : true,
    )
    .map((sg) => ({
      label: sg.subGroupName,
      value: sg.subGroupName,
    }));
}, [subGroups, filters.groupName]);

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

        <Button type="primary" onClick={openComponentModal}>
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
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </section>

<TestNameModal
  open={isComponentModalOpen}
  onClose={closeComponentModal}
  title={editingRowId ? "Edit Test Name" : "Add Test Name"}
  form={form}
  errors={fieldErrors}
  onPatchForm={patchForm}
  onClearError={clearFieldError}
  onSave={handleSave}
  mainGroups={mainGroups}
  subGroups={subGroups}
/>
    </div>
  );
}
