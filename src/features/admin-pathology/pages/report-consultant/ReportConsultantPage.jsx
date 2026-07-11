"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Form, Tooltip, Input } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import ReportConsultantModal from "@/features/admin-pathology/pages/report-consultant/ReportConsultantModal";
import { useConfirm } from "@/hooks/useConfirm";
import {
  useGetReportConsultantsQuery,
  useCreateReportConsultantMutation,
  useUpdateReportConsultantMutation,
  useDeleteReportConsultantMutation,
} from "@/features/admin-pathology/api/pathologyApi";

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";

export default function ReportConsultantPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const { confirmDelete } = useConfirm();

  const { data: rows = [], isLoading } = useGetReportConsultantsQuery();

  const [createReportConsultant] = useCreateReportConsultantMutation();
  const [updateReportConsultant] = useUpdateReportConsultantMutation();
  const [deleteReportConsultant] = useDeleteReportConsultantMutation();
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
        doctorName: record.doctorName ?? "",
        doctorQualification: record.doctorQualification ?? "",
        doctorDesignation: record.doctorDesignation ?? "",
      });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

  const handleDeleteRow = useCallback(
    async (record) => {
      const itemName = record.doctorName;
      const confirmed = await confirmDelete({ itemName });
      if (!confirmed) return;
      await deleteReportConsultant(record.id).unwrap();
      message.success("Consultant deleted.");
    },
    [confirmDelete, deleteReportConsultant, message],
  );

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const rowPayload = {
        doctorName: values.doctorName.trim(),
        doctorQualification: values.doctorQualification.trim(),
        doctorDesignation: values.doctorDesignation.trim(),
      };

      if (editingRowId) {
        await updateReportConsultant({
          id: editingRowId,
          ...rowPayload,
        }).unwrap();
        message.success("Consultant updated.");
      } else {
        await createReportConsultant(rowPayload).unwrap();
        message.success("Consultant created.");
      }

      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [
    form,
    editingRowId,
    createReportConsultant,
    updateReportConsultant,
    message,
    closeModal,
  ]);

  const filteredRows = useMemo(() => {
    const nameTerm = nameFilter.trim().toLowerCase();
    const designationTerm = designationFilter.trim().toLowerCase();

    if (!nameTerm && !designationTerm) return rows;

    return rows.filter((row) => {
      const matchesName =
        !nameTerm || row.doctorName?.toLowerCase().includes(nameTerm);
      const matchesDesignation =
        !designationTerm ||
        row.doctorDesignation?.toLowerCase().includes(designationTerm);
      return matchesName && matchesDesignation;
    });
  }, [rows, nameFilter, designationFilter]);

  const columns = useMemo(
    () => [
      {
        title: "Doctor Name",
        dataIndex: "doctorName",
        key: "doctorName",
        width: 220,
      },
      {
        title: "Doctor Qualification",
        dataIndex: "doctorQualification",
        key: "doctorQualification",
      },
      {
        title: "Doctor Designation",
        dataIndex: "doctorDesignation",
        key: "doctorDesignation",
        width: 220,
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
                className="report-consultant-actions-cell"
                aria-label="Edit consultant"
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
                aria-label="Delete consultant"
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
    <div className="services-billing-page report-consultant-page">
      <div
        className="report-consultant-table-toolbar"
        style={{ display: "flex", gap: 12, justifyContent: "space-between" }}
      >
        <div className="report-consultant-filters" style={{ display: "flex", gap: 12 }}>
          <Input
            placeholder="Filter by Doctor Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            allowClear
            style={{ width: 260 }}
          />
          <Input
            placeholder="Filter by Designation"
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
            allowClear
            style={{ width: 260 }}
          />
        </div>

        <Button type="primary" onClick={openModal}>
          Add Consultant
        </Button>
      </div>

      <section className="services-billing-results" aria-label="report consultant">
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

      <ReportConsultantModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? "Edit Consultant" : "Add Consultant"}
        form={form}
        onSave={handleSave}
      />
    </div>
  );
}
