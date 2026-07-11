"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Form, Tooltip, Input, Select } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import InterpretationModal from "@/features/admin-pathology/pages/interpretation/InterpretationModal";
import {
  getServiceLabel,
  SERVICE_OPTIONS,
} from "@/features/admin-pathology/api/mock-interpretation";
import { useConfirm } from "@/hooks/useConfirm";
import {
  useGetInterpretationsQuery,
  useCreateInterpretationMutation,
  useUpdateInterpretationMutation,
  useDeleteInterpretationMutation,
} from "@/features/admin-pathology/api/pathologyApi";

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";

export default function InterpretationPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [serviceFilter, setServiceFilter] = useState("");
  const [templateNameFilter, setTemplateNameFilter] = useState("");
  const { confirmDelete } = useConfirm();

  const { data: rows = [], isLoading } = useGetInterpretationsQuery();

  const [createInterpretation] = useCreateInterpretationMutation();
  const [updateInterpretation] = useUpdateInterpretationMutation();
  const [deleteInterpretation] = useDeleteInterpretationMutation();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const openModal = useCallback(() => {
    form.resetFields();
    setEditingRowId(null);
    setIsModalOpen(true);
  }, [form]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRowId(null);
    form.resetFields();
  }, [form]);

  const handleEditRow = useCallback(
    (record) => {
      form.setFieldsValue({
        serviceName: record.serviceName ?? "",
        templateName: record.templateName ?? "",
        templateDescription: record.templateDescription ?? "",
      });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

  const handleDeleteRow = useCallback(
    async (record) => {
      const itemName = record.templateName;
      const confirmed = await confirmDelete({ itemName });
      if (!confirmed) return;
      await deleteInterpretation(record.id).unwrap();
      message.success("Interpretation deleted.");
    },
    [confirmDelete, deleteInterpretation, message],
  );

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const rowPayload = {
        serviceName: values.serviceName?.trim?.() ?? values.serviceName,
        templateName: values.templateName.trim(),
        templateDescription: values.templateDescription.trim(),
      };

      if (editingRowId) {
        await updateInterpretation({
          id: editingRowId,
          ...rowPayload,
        }).unwrap();
        message.success("Interpretation updated.");
      } else {
        await createInterpretation(rowPayload).unwrap();
        message.success("Interpretation created.");
      }

      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [
    form,
    editingRowId,
    createInterpretation,
    updateInterpretation,
    message,
    closeModal,
  ]);

  const filteredRows = useMemo(() => {
    const serviceTerm = serviceFilter.trim().toLowerCase();
    const templateTerm = templateNameFilter.trim().toLowerCase();

    if (!serviceTerm && !templateTerm) return rows;

    return rows.filter((row) => {
      const serviceLabel = getServiceLabel(row.serviceName).toLowerCase();
      const matchesService =
        !serviceTerm || serviceLabel.includes(serviceTerm);
      const matchesTemplate =
        !templateTerm || row.templateName?.toLowerCase().includes(templateTerm);
      return matchesService && matchesTemplate;
    });
  }, [rows, serviceFilter, templateNameFilter]);

  const columns = useMemo(
    () => [
      {
        title: "Service Name",
        dataIndex: "serviceName",
        key: "serviceName",
        width: 280,
        render: (serviceName) => getServiceLabel(serviceName),
      },
      {
        title: "Template Name",
        dataIndex: "templateName",
        key: "templateName",
        width: 220,
      },
      {
        title: "Template Description",
        dataIndex: "templateDescription",
        key: "templateDescription",
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
                className="interpretation-actions-cell"
                aria-label="Edit interpretation"
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
                aria-label="Delete interpretation"
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
    <div className="services-billing-page interpretation-page">
      <div
        className="interpretation-table-toolbar"
        style={{ display: "flex", gap: 12, justifyContent: "space-between" }}
      >
        <div className="interpretation-filters" style={{ display: "flex", gap: 12 }}>
          <Select
            placeholder="Filter by Service Name"
            value={serviceFilter || undefined}
            onChange={(value) => setServiceFilter(value || "")}
            allowClear
            showSearch
            optionFilterProp="label"
            options={SERVICE_OPTIONS}
            style={{ width: 280 }}
          />
          <Input
            placeholder="Filter by Template Name"
            value={templateNameFilter}
            onChange={(e) => setTemplateNameFilter(e.target.value)}
            allowClear
            style={{ width: 260 }}
          />
        </div>

        <Button type="primary" onClick={openModal}>
          Add Interpretation
        </Button>
      </div>

      <section className="services-billing-results" aria-label="interpretation">
        <DataTable
          rowKey="id"
          columns={columns}
          dataSource={filteredRows}
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

      <InterpretationModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? "Edit Interpretation" : "Add Interpretation"}
        form={form}
        onSave={handleSave}
      />
    </div>
  );
}
