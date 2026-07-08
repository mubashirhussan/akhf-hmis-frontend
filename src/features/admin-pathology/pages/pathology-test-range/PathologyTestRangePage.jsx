"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Form, Space, Tooltip, Select, Input } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import { getOptionLabel } from "@/features/admin-pathology/api/mock-pathology-test-range";
import {
  useAddPathologyConditionMutation,
  useCreatePathologyTestRangeMutation,
  useDeletePathologyTestRangeMutation,
  useGetPathologyLookupsQuery,
  useGetPathologyTestRangesQuery,
  useUpdatePathologyTestRangeMutation,
} from "@/features/admin-pathology/api/pathologyApi";
import PathologyTestRangeAddModal from "@/features/admin-pathology/pages/pathology-test-range/PathologyTestRangeAddModal";
import PathologyTestRangeEditModal from "@/features/admin-pathology/pages/pathology-test-range/PathologyTestRangeEditModal";
import ConversionRateModal from "@/features/admin-pathology/pages/pathology-test-range/ConversionRateModal";
import { useConfirm } from "@/hooks/useConfirm";

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";
const DELETE_ICON_CLASS = "h-[16px] w-[16px] text-[#ff4d4f]";

export default function PathologyTestRangePage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const { data: rows = [], isLoading } = useGetPathologyTestRangesQuery();
  const { data: lookups } = useGetPathologyLookupsQuery();
  const unitOptions = lookups?.unitOptions ?? [];
  const conditionOptions = lookups?.conditionOptions ?? [];
  const [createTestRange] = useCreatePathologyTestRangeMutation();
  const [updateTestRange] = useUpdatePathologyTestRangeMutation();
  const [deleteTestRange] = useDeletePathologyTestRangeMutation();
  const [addCondition] = useAddPathologyConditionMutation();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConversionRateModalOpen, setIsConversionRateModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [filters, setFilters] = useState({
    testName: "",
    componentName: "",
  });

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
      const itemName = [record.testName, record.componentName]
        .filter(Boolean)
        .join(" — ");
      const confirmed = await confirmDelete({ itemName });

      if (confirmed) {
        await deleteTestRange(record.id).unwrap();
        message.success("Test range removed.");
      }
    },
    [confirmDelete, deleteTestRange, message],
  );

const genderIdMap = { male: 1, female: 2, both: 77, child: 3 };

  const handleAddSave = useCallback(async () => {
    try {
      const values = await addForm.validateFields();
      const rowPayload = {
        tcId: Number(values.testComponent) || 0,
        startValue: (values.startValue ?? '').trim() || 0,
        endValue: (values.endValue ?? '').trim() || 0,
        reportValues: (values.reportValues ?? '').trim() || 0,
        genderId: genderIdMap[values.gender?.toLowerCase()] ?? 77,
        minAgeVal: Number(values.ageStart) || 0,
        maxAgeVal: Number(values.ageEnd) || 0,
        ageUnit: values.ageStartUnit ?? 'Y',
      };

      await createTestRange(rowPayload).unwrap();

      setIsAddModalOpen(false);
      addForm.resetFields();

      message.success("Test range saved to the table.");
    } catch {
      // validation errors are shown by antd Form
    }
  }, [addForm, createTestRange, message]);

  const handleEditSave = useCallback(async () => {
    try {
      const values = await editForm.validateFields();
      const rowPayload = {
        tcId: Number(values.testComponent) || 0,
        startValue: (values.startValue ?? '').trim() || 0,
        endValue: (values.endValue ?? '').trim() || 0,
        reportValues: (values.reportValues ?? '').trim() || 0,
        genderId: genderIdMap[values.gender?.toLowerCase()] ?? 77,
        minAgeVal: Number(values.ageStart) || 0,
        maxAgeVal: Number(values.ageEnd) || 0,
        ageUnit: values.ageStartUnit ?? 'Y',
      };

      await updateTestRange({ id: editingRow.id, ...rowPayload }).unwrap();

      setIsEditModalOpen(false);
      setEditingRow(null);
      editForm.resetFields();

      message.success("Test range updated.");
    } catch {
      // validation errors are shown by antd Form
    }
  }, [editForm, editingRow, updateTestRange, message]);

  const handleExport = useCallback(() => {
    if (rows.length === 0) {
      message.warning("No data to export.");
      return;
    }
    message.info("Export will be connected to the backend API.");
  }, [message, rows.length]);

  const handleAddCondition = useCallback(async () => {
    const activeForm = isAddModalOpen ? addForm : editForm;
    const label = (activeForm.getFieldValue('newCondition') ?? '').trim();

    if (!label) {
      message.error("Enter a condition name first.");
      return;
    }

    const value = label.toLowerCase().replace(/\s+/g, "-");
    const existing = conditionOptions.find(
      (option) =>
        option.value === value ||
        option.label.toLowerCase() === label.toLowerCase(),
    );

    if (existing) {
      activeForm.setFieldsValue({ condition: existing.value, newCondition: "" });
      message.info(`Condition "${existing.label}" already exists.`);
      return;
    }

    await addCondition({ value, label }).unwrap();
    activeForm.setFieldsValue({ condition: value, newCondition: "" });
    message.success(`Condition "${label}" added.`);
  }, [addForm, editForm, isAddModalOpen, addCondition, conditionOptions, message]);

  const handleAddConversionRate = useCallback(() => {
    setIsConversionRateModalOpen(true);
  }, []);

  const closeConversionRateModal = useCallback(() => {
    setIsConversionRateModalOpen(false);
  }, []);

  const conversionRateDefaultUnit = useMemo(() => {
    const activeForm = isAddModalOpen ? addForm : editForm;
    const unit = activeForm.getFieldValue('unit');
    return getOptionLabel(unitOptions, unit) || "Null";
  }, [isAddModalOpen, addForm, editForm, unitOptions]);

  const testNameOptions = useMemo(() => {
  const uniqueTests = [
    ...new Set(rows.map((row) => row.testName).filter(Boolean)),
  ];

  return uniqueTests.map((test) => ({
    label: test,
    value: test,
  }));
}, [rows]);

const filteredRows = useMemo(() => {
  return rows.filter((row) => {
    const matchesTestName = filters.testName
      ? row.testName === filters.testName
      : true;

    const matchesComponentName = filters.componentName.trim()
      ? row.componentName
          ?.toLowerCase()
          .includes(filters.componentName.trim().toLowerCase())
      : true;

    return matchesTestName && matchesComponentName;
  });
}, [rows, filters]);

  const columns = useMemo(
    () => [
      { title: "TestName", dataIndex: "testName", key: "testName", width: 200 },
      {
        title: "Component Name",
        dataIndex: "componentName",
        key: "componentName",
        width: 200,
      },
      {
        title: "StartValue",
        dataIndex: "startValue",
        key: "startValue",
        width: 110,
      },
      { title: "EndValue", dataIndex: "endValue", key: "endValue", width: 110 },
      {
        title: "Report Values",
        dataIndex: "reportValues",
        key: "reportValues",
        width: 140,
      },
      { title: "Gender", dataIndex: "gender", key: "gender", width: 90 },
      { title: "Min_Age", dataIndex: "minAge", key: "minAge", width: 160 },
      { title: "Max_Age", dataIndex: "maxAge", key: "maxAge", width: 160 },
      {
        title: "Action",
        key: "action",
        width: 96,
        align: "center",
        fixed: "right",
        render: (_, record) => (
          <Space size={4} className="pathology-test-range-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                className="pathology-test-range-edit-btn"
                aria-label="Edit test range"
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
                size="small"
                className="pathology-test-range-delete-btn"
                aria-label="Delete test range"
                icon={
                  <AppIcon
                    icon="mdi:delete-outline"
                    className={DELETE_ICON_CLASS}
                  />
                }
                onClick={() => handleDeleteRow(record)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [handleDeleteRow, handleEditRow],
  );

  return (
    <div className="services-billing-page pathology-test-range-page">
<div
  className="pathology-test-range-table-toolbar"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  }}
>
  <div style={{ display: "flex", gap: 10 }}>
    <Select
      placeholder="Filter by Test Name"
      allowClear
      style={{ width: 220 }}
      value={filters.testName || undefined}
      options={testNameOptions}
      onChange={(value) =>
        patchFilter({
          testName: value || "",
        })
      }
    />

    <Input
      placeholder="Filter by Component Name"
      allowClear
      style={{ width: 250 }}
      value={filters.componentName}
      onChange={(e) =>
        patchFilter({
          componentName: e.target.value,
        })
      }
    />
  </div>

  <div style={{ display: "flex", gap: 10 }}>
    <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
      Add Test Range
    </Button>

    <Button
      className="pathology-test-range-export-btn"
      icon={<AppIcon icon="mdi:export" className="h-4 w-4" />}
      onClick={handleExport}
    >
      Export
    </Button>
  </div>
</div>

      <section
        className="services-billing-results"
        aria-label="Pathology test ranges"
      >
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

      <PathologyTestRangeAddModal
        open={isAddModalOpen}
        onClose={closeAddModal}
        form={addForm}
        onSave={handleAddSave}
        onAddCondition={handleAddCondition}
        onAddConversionRate={handleAddConversionRate}
      />

      <PathologyTestRangeEditModal
        open={isEditModalOpen}
        onClose={closeEditModal}
        form={editForm}
        onSave={handleEditSave}
        record={editingRow}
        onAddCondition={handleAddCondition}
        onAddConversionRate={handleAddConversionRate}
      />

      <ConversionRateModal
        open={isConversionRateModalOpen}
        onClose={closeConversionRateModal}
        defaultUnit={conversionRateDefaultUnit}
      />
    </div>
  );
}
