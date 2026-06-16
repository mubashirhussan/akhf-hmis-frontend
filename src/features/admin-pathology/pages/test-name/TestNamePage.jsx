"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { App, Button, Tooltip, Select, Input } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import TestNameModal from "@/features/admin-pathology/pages/test-name/TestNameModal";
import {
  GROUP_OPTIONS,
  createEmptyTestNameForm,
  getOptionLabel,
  getSubGroupOptions,
  rowToTestNameForm,
} from "@/features/admin-pathology/api/mock-test-name";
import "@/features/admin-pathology/pages/test-name/test-name.css";
import { useConfirm } from "@/hooks/useConfirm";
import {
  useGetTestNamesQuery,
  useCreateTestNameMutation,
  useUpdateTestNameMutation,
  useDeleteTestNameMutation,
  useGetSubGroupsQuery,
} from "@/features/admin-pathology/api/pathologyApi";

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";

export default function TestNamePage() {
  const { message } = App.useApp();

  const [form, setForm] = useState(createEmptyTestNameForm);
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
    setForm(createEmptyTestNameForm());
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
    setForm(rowToTestNameForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsComponentModalOpen(true);
  }, []);
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

    if (!testName) {
      setFieldErrors({
        testName: "Test Name is required.",
      });

      return;
    }

    setFieldErrors({});

    const rowPayload = {
      groupName: getOptionLabel(GROUP_OPTIONS, form.groupName),
subGroupName:
  subGroups.find(
    (sg) =>
      sg.groupId === form.groupId &&
      sg.subGroupName === form.subGroupName
  )?.subGroupName || form.subGroupName,
      testName,
      medicalName: form.medicalName ?? "",
      standardName: form.standardName ?? "",
      fieldType: "TextBox",
      fee: form.fee ?? 0,
    };

    if (editingRowId) {
      await updateTestName({
        id: editingRowId,
        ...rowPayload,
      }).unwrap();

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
    const uniqueGroups = [
      ...new Set(rows.map((row) => row.groupName).filter(Boolean)),
    ];

    return uniqueGroups.map((group) => ({
      label: group,
      value: group,
    }));
  }, [rows]);

  const subGroupOptions = useMemo(() => {
    let filteredRows = rows;

    if (filters.groupName) {
      filteredRows = filteredRows.filter(
        (row) => row.groupName === filters.groupName,
      );
    }

    const uniqueSubGroups = [
      ...new Set(filteredRows.map((row) => row.subGroupName).filter(Boolean)),
    ];

    return uniqueSubGroups.map((subGroup) => ({
      label: subGroup,
      value: subGroup,
    }));
  }, [rows, filters.groupName]);

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
      />
    </div>
  );
}
