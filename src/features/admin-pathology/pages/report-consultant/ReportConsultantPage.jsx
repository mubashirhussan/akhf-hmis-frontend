"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Tooltip, Input } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import ReportConsultantModal from "@/features/admin-pathology/pages/report-consultant/ReportConsultantModal";
import {
  createEmptyReportConsultantForm,
  rowToReportConsultantForm,
} from "@/features/admin-pathology/api/mock-report-consultant";
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

  const [form, setForm] = useState(createEmptyReportConsultantForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [nameFilter, setNameFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const { confirmDelete } = useConfirm();

  const { data: rows = [], isLoading } = useGetReportConsultantsQuery();

  const [createReportConsultant] = useCreateReportConsultantMutation();
  const [updateReportConsultant] = useUpdateReportConsultantMutation();
  const [deleteReportConsultant] = useDeleteReportConsultantMutation();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

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
    setForm(createEmptyReportConsultantForm());
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
    setForm(rowToReportConsultantForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

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
    const doctorName = form.doctorName.trim();
    const doctorQualification = form.doctorQualification.trim();
    const doctorDesignation = form.doctorDesignation.trim();

    const errors = {};
    if (!doctorName) errors.doctorName = "Doctor Name is required.";
    if (!doctorQualification)
      errors.doctorQualification = "Doctor Qualification is required.";
    if (!doctorDesignation)
      errors.doctorDesignation = "Doctor Designation is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const rowPayload = {
      doctorName,
      doctorQualification,
      doctorDesignation,
    };

    if (editingRowId) {
      await updateReportConsultant({
        id: editingRowId,
        ...rowPayload,
      }).unwrap();

      setIsModalOpen(false);
      setEditingRowId(null);

      message.success("Consultant updated.");

      return;
    }

    await createReportConsultant(rowPayload).unwrap();

    setIsModalOpen(false);

    message.success("Consultant created.");
  }, [form, editingRowId, createReportConsultant, updateReportConsultant, message]);

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
            pageSizeOptions: ["10","20", "50", "100"],
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
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
      />
    </div>
  );
}
