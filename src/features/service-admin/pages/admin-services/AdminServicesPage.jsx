"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Input, Select, Tooltip } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import AdminServicesModal from "@/features/service-admin/pages/admin-services/AdminServicesModal";
import {
  createEmptyServiceAdminForm,
  rowToServiceAdminForm,
  getServiceCategoryLabel,
  getBooleanLabel,
  getActiveStatusLabel,
} from "@/features/service-admin/api/mock-service-admin";
import { useConfirm } from "@/hooks/useConfirm";
import {
  useGetServiceAdminsQuery,
  useGetServiceCategoriesQuery,
  useCreateServiceAdminMutation,
  useUpdateServiceAdminMutation,
  useDeleteServiceAdminMutation,
} from "@/features/service-admin/api/serviceAdminApi";
import { useGetDepartmentsQuery } from '@/features/human-resource/api/employeeApi';

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";

export default function AdminServicesPage() {
  const { message } = App.useApp();

  const [form, setForm] = useState(createEmptyServiceAdminForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const { confirmDelete } = useConfirm();

  const { data: rows = [], isLoading } = useGetServiceAdminsQuery();
  const { data: categories = [] } = useGetServiceCategoriesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();

  const departmentOptions = useMemo(
    () => departments.map((d) => ({ value: d.id, label: d.departmentName })),
    [departments],
  );

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ value: category.value, label: category.serviceName })),
    [categories],
  );

  const [createServiceAdmin] = useCreateServiceAdminMutation();
  const [updateServiceAdmin] = useUpdateServiceAdminMutation();
  const [deleteServiceAdmin] = useDeleteServiceAdminMutation();

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
    setForm(createEmptyServiceAdminForm());
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
    setForm(rowToServiceAdminForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const itemName = record.serviceName;
      const confirmed = await confirmDelete({ itemName });
      if (!confirmed) return;
      await deleteServiceAdmin(record.id).unwrap();
      message.success("Service deleted.");
    },
    [confirmDelete, deleteServiceAdmin, message],
  );

  const handleSave = useCallback(async () => {
    const serviceName = form.serviceName.trim();
    const serviceCategory = form.serviceCategory?.trim();
    const serviceHead = form.serviceHead?.trim();

    const errors = {};
    if (!serviceName) errors.serviceName = "Service Name is required.";
    if (!serviceCategory) errors.serviceCategory = "Service Category is required.";
    if (form.serviceCharges == null || form.serviceCharges < 0) {
      errors.serviceCharges = "Service Charges is required.";
    }
    if (!serviceHead) errors.serviceHead = "Service Head is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const rowPayload = {
      department: form.department,
      serviceName,
      serviceCategory,
      serviceCharges: form.serviceCharges ?? 0,
      serviceChargesBefore: form.serviceChargesBefore,
      serviceEditPrice: form.serviceEditPrice,
      serviceHead,
    };

    if (editingRowId) {
      await updateServiceAdmin({
        id: editingRowId,
        ...rowPayload,
      }).unwrap();

      setIsModalOpen(false);
      setEditingRowId(null);

      message.success("Service updated.");

      return;
    }

    await createServiceAdmin(rowPayload).unwrap();

    setIsModalOpen(false);

    message.success("Service created.");
  }, [form, editingRowId, createServiceAdmin, updateServiceAdmin, message]);

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const category = categoryFilter.trim();

    return rows.filter((row) => {
      const matchesSearch =
        !term || row.serviceName?.toLowerCase().includes(term);
      const matchesCategory =
        !category || row.serviceCategory === category;
      return matchesSearch && matchesCategory;
    });
  }, [rows, searchTerm, categoryFilter]);

  const columns = useMemo(
    () => [
      {
        title: "Service Name",
        dataIndex: "serviceName",
        key: "serviceName",
        width: 220,
      },
      {
        title: "Service Category",
        dataIndex: "serviceCategory",
        key: "serviceCategory",
        width: 180,
        render: (value) => getServiceCategoryLabel(value),
      },
      {
        title: "Service Amount",
        dataIndex: "serviceCharges",
        key: "serviceCharges",
        width: 140,
        render: (value) => (value != null ? value.toLocaleString() : ""),
      },
      {
        title: "Edit Status",
        dataIndex: "serviceEditPrice",
        key: "serviceEditPrice",
        width: 120,
        render: (value) => getBooleanLabel(value),
      },
      {
        title: "Active Status",
        dataIndex: "activeStatus",
        key: "activeStatus",
        width: 120,
        render: (value) => getActiveStatusLabel(value),
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
                className="admin-services-actions-cell"
                aria-label="Edit service"
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
                aria-label="Delete service"
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
    <div className="services-billing-page admin-services-page">
      <div
        className="admin-services-table-toolbar"
        style={{ display: "flex", gap: 12, justifyContent: "space-between" }}
      >
        <div className="admin-services-filters" style={{ display: "flex", gap: 12 }}>
          <Input
            placeholder="Filter by Service Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            style={{ width: 260 }}
          />
          <Select
            placeholder="Filter by Service Category"
            value={categoryFilter || undefined}
            onChange={(value) => setCategoryFilter(value || "")}
            allowClear
            showSearch
            optionFilterProp="label"
            options={categoryOptions}
            style={{ width: 260 }}
          />
        </div>

        <Button type="primary" onClick={openModal}>
          Add Service
        </Button>
      </div>

      <section className="services-billing-results" aria-label="admin services">
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

      <AdminServicesModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? "Edit Service" : "Add Service"}
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
        departmentOptions={departmentOptions}
        serviceCategoryOptions={categoryOptions}
      />
    </div>
  );
}
