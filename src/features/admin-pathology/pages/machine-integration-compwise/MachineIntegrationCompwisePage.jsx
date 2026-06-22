"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Tooltip, Input, Select } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import MachineIntegrationCompwiseModal from "@/features/admin-pathology/pages/machine-integration-compwise/MachineIntegrationCompwiseModal";
import {
  createEmptyMachineIntegrationCompwiseForm,
  rowToMachineIntegrationCompwiseForm,
  getTestComponentLabel,
  LAB_MACHINE_OPTIONS,
  TEST_COMPONENT_OPTIONS,
} from "@/features/admin-pathology/api/mock-machine-integration-compwise";
import { useConfirm } from "@/hooks/useConfirm";
import {
  useGetMachineIntegrationCompwiseQuery,
  useCreateMachineIntegrationCompwiseMutation,
  useUpdateMachineIntegrationCompwiseMutation,
  useDeleteMachineIntegrationCompwiseMutation,
} from "@/features/admin-pathology/api/pathologyApi";

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";

export default function MachineIntegrationCompwisePage() {
  const { message } = App.useApp();

  const [form, setForm] = useState(createEmptyMachineIntegrationCompwiseForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [labMachineFilter, setLabMachineFilter] = useState("");
  const [testComponentFilter, setTestComponentFilter] = useState("");
  const { confirmDelete } = useConfirm();

  const { data: rows = [], isLoading } = useGetMachineIntegrationCompwiseQuery();

  const [createMachineIntegration] = useCreateMachineIntegrationCompwiseMutation();
  const [updateMachineIntegration] = useUpdateMachineIntegrationCompwiseMutation();
  const [deleteMachineIntegration] = useDeleteMachineIntegrationCompwiseMutation();

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

  const openModal = useCallback(() => {
    setForm(createEmptyMachineIntegrationCompwiseForm());
    setEditingRowId(null);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRowId(null);
    setFieldErrors({});
  }, []);

  const handleEditRow = useCallback((record) => {
    setForm(rowToMachineIntegrationCompwiseForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const itemName =
        record.testComponentLabel || getTestComponentLabel(record.testComponent);
      const confirmed = await confirmDelete({ itemName });
      if (!confirmed) return;
      await deleteMachineIntegration(record.id).unwrap();
      message.success("Machine integration deleted.");
    },
    [confirmDelete, deleteMachineIntegration, message],
  );

  const handleSave = useCallback(async () => {
    const labMachine = form.labMachine?.trim();
    const testComponent = form.testComponent?.trim();
    const machineCode = form.machineCode.trim();
    const assayNumber = form.assayNumber.trim();

    const errors = {};
    if (!labMachine) errors.labMachine = "Lab Machine is required.";
    if (!testComponent) errors.testComponent = "Test Component is required.";
    if (!machineCode) errors.machineCode = "Machine Code is required.";
    if (!assayNumber) errors.assayNumber = "Assay Number is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const rowPayload = {
      labMachine,
      testComponent,
      machineCode,
      assayNumber,
    };

    if (editingRowId) {
      await updateMachineIntegration({
        id: editingRowId,
        ...rowPayload,
      }).unwrap();

      setIsModalOpen(false);
      setEditingRowId(null);

      message.success("Machine integration updated.");

      return;
    }

    await createMachineIntegration(rowPayload).unwrap();

    setIsModalOpen(false);

    message.success("Machine integration created.");
  }, [
    form,
    editingRowId,
    createMachineIntegration,
    updateMachineIntegration,
    message,
  ]);

  const filteredRows = useMemo(() => {
    if (!labMachineFilter && !testComponentFilter) return rows;

    return rows.filter((row) => {
      const matchesLabMachine =
        !labMachineFilter || row.labMachine === labMachineFilter;
      const matchesTestComponent =
        !testComponentFilter || row.testComponent === testComponentFilter;

      return matchesLabMachine && matchesTestComponent;
    });
  }, [rows, labMachineFilter, testComponentFilter]);

  const columns = useMemo(
    () => [
      {
        title: "Lab Machine ID",
        dataIndex: "labMachineId",
        key: "labMachineId",
        width: 140,
      },
      {
        title: "Test Component",
        dataIndex: "testComponentLabel",
        key: "testComponent",
        render: (_, record) =>
          record.testComponentLabel ||
          getTestComponentLabel(record.testComponent),
      },
      {
        title: "Component ID",
        dataIndex: "componentId",
        key: "componentId",
        width: 130,
      },
      {
        title: "Machine Code",
        dataIndex: "machineCode",
        key: "machineCode",
        width: 150,
      },
      {
        title: "Assay Number",
        dataIndex: "assayNumber",
        key: "assayNumber",
        width: 130,
      },
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
                className="machine-integration-compwise-actions-cell"
                aria-label="Edit machine integration"
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
                aria-label="Delete machine integration"
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
    <div className="services-billing-page machine-integration-compwise-page">
      <div
        className="machine-integration-compwise-table-toolbar"
        style={{ display: "flex", gap: 12, justifyContent: "space-between" }}
      >
        <div
          className="machine-integration-compwise-filters"
          style={{ display: "flex", gap: 12 }}
        >
          <Select
            placeholder="Filter by Lab Machine"
            value={labMachineFilter || undefined}
            onChange={(value) => setLabMachineFilter(value || "")}
            allowClear
            showSearch
            optionFilterProp="label"
            options={LAB_MACHINE_OPTIONS}
            style={{ width: 260 }}
          />
          <Select
            placeholder="Filter by Test Component"
            value={testComponentFilter || undefined}
            onChange={(value) => setTestComponentFilter(value || "")}
            allowClear
            showSearch
            optionFilterProp="label"
            options={TEST_COMPONENT_OPTIONS}
            style={{ width: 300 }}
          />
        </div>

        <Button type="primary" onClick={openModal}>
          Add Machine Integration
        </Button>
      </div>

      <section
        className="services-billing-results"
        aria-label="machine integration component wise"
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

      <MachineIntegrationCompwiseModal
        open={isModalOpen}
        onClose={closeModal}
        title={
          editingRowId
            ? "Edit Machine Integration"
            : "Add Machine Integration"
        }
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
      />
    </div>
  );
}
