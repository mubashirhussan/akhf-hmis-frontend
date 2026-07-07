"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Select, Tooltip } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import AssignOpdServicesModal from "@/features/service-admin/pages/assign-opd-services/AssignOpdServicesModal";
import { useConfirm } from "@/hooks/useConfirm";
import {
  useGetHospitalsQuery,
  useGetSubDepartmentsQuery,
} from "@/features/human-resource/api/employeeApi";
import {
  useGetPatientTypesQuery,
  useGetServiceCategoriesQuery,
  useGetServiceAdminsQuery,
  useGetAssignOpdServicesQuery,
  useCreateAssignOpdServiceMutation,
  useUpdateAssignOpdServiceMutation,
  useDeleteAssignOpdServiceMutation,
} from "@/features/service-admin/api/serviceAdminApi";
import "@/features/service-admin/pages/assign-opd-services/assign-opd-services.css";

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";

const EMPTY_FORM = {
  hospital: "",
  patientType: "",
  serviceCategory: "",
  service: "",
  subDepartment: "",
  amount: null,
};

function getLabelFromOptions(options, value) {
  return options.find((o) => o.value === value)?.label ?? value ?? "—";
}

export default function AssignOpdServicesPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [form, setForm] = useState(EMPTY_FORM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [filterHospital, setFilterHospital] = useState(undefined);
  const [filterServiceCategory, setFilterServiceCategory] = useState(undefined);
  const [filterService, setFilterService] = useState(undefined);
  const [filterSubDepartment, setFilterSubDepartment] = useState(undefined);

  const { data: hospitals = [] } = useGetHospitalsQuery();
  const { data: allSubDepartments = [] } = useGetSubDepartmentsQuery();
  const { data: patientTypeRows = [] } = useGetPatientTypesQuery();
  const { data: categoryRows = [] } = useGetServiceCategoriesQuery();
  const { data: serviceAdminRows = [] } = useGetServiceAdminsQuery();
  const { data: rows = [], isLoading } = useGetAssignOpdServicesQuery();
  const [createAssignOpdService] = useCreateAssignOpdServiceMutation();
  const [updateAssignOpdService] = useUpdateAssignOpdServiceMutation();
  const [deleteAssignOpdService] = useDeleteAssignOpdServiceMutation();

  const patientTypeOptions = useMemo(
    () => patientTypeRows.map((r) => ({ value: r.id, label: r.patientType })),
    [patientTypeRows],
  );

  const serviceCategoryOptions = useMemo(
    () => categoryRows.map((r) => ({ value: r.value, label: r.serviceName })),
    [categoryRows],
  );

  const serviceOptions = useMemo(() => {
    if (!form.serviceCategory) return [];
    return serviceAdminRows
      .filter(
        (r) =>
          r.serviceCategory === form.serviceCategory &&
          r.activeStatus === "active",
      )
      .map((r) => ({ value: r.id, label: r.serviceName }));
  }, [serviceAdminRows, form.serviceCategory]);

  const filterServiceOptions = useMemo(() => {
    const base = serviceAdminRows.filter((r) => r.activeStatus === "active");
    const filtered = filterServiceCategory
      ? base.filter((r) => r.serviceCategory === filterServiceCategory)
      : base;
    return filtered.map((r) => ({ value: r.id, label: r.serviceName }));
  }, [serviceAdminRows, filterServiceCategory]);

  const hospitalOptions = useMemo(
    () => hospitals.map((h) => ({ value: h.id, label: h.name })),
    [hospitals],
  );

  const subDepartmentOptions = useMemo(
    () =>
      allSubDepartments.map((s) => ({
        value: s.id,
        label: s.subDepartmentName,
      })),
    [allSubDepartments],
  );

  const patchForm = useCallback(
    (patch) => {
      setForm((current) => {
        const next = { ...current, ...patch };
        if ("service" in patch && patch.service) {
          const selectedService = serviceAdminRows.find(
            (row) => row.id === patch.service,
          );
          if (selectedService?.serviceCharges != null) {
            next.amount = selectedService.serviceCharges;
          }
        }
        return next;
      });
    },
    [serviceAdminRows],
  );

  const clearFieldError = useCallback((field) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const openModal = useCallback(() => {
    setForm(EMPTY_FORM);
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
    setForm({
      hospital: record.hospital ?? "",
      patientType: record.patientType ?? "",
      serviceCategory: record.serviceCategory ?? "",
      service: record.service ?? "",
      subDepartment: record.subDepartment ?? "",
      amount: record.amount ?? null,
    });
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const hospitalLabel = getLabelFromOptions(
        hospitalOptions,
        record.hospital,
      );
      const confirmed = await confirmDelete({
        itemName: `OPD assignment for ${hospitalLabel}`,
      });
      if (!confirmed) return;
      await deleteAssignOpdService(record.id).unwrap();
      message.success("OPD service assignment deleted.");
    },
    [confirmDelete, deleteAssignOpdService, message, hospitalOptions],
  );

  const handleSave = useCallback(async () => {
    const errors = {};
    if (!form.hospital) errors.hospital = "Hospital is required.";
    if (!form.patientType) errors.patientType = "Patient Type is required.";
    if (!form.serviceCategory)
      errors.serviceCategory = "Service Category is required.";
    if (!form.service) errors.service = "Service is required.";
    if (!form.subDepartment)
      errors.subDepartment = "Sub Department is required.";
    if (form.amount === null || form.amount === undefined || form.amount === "")
      errors.amount = "Amount is required.";

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const hospitalLabel = getLabelFromOptions(hospitalOptions, form.hospital);
    const patientTypeLabel = getLabelFromOptions(
      patientTypeOptions,
      form.patientType,
    );
    const serviceCategoryLabel = getLabelFromOptions(
      serviceCategoryOptions,
      form.serviceCategory,
    );
    const serviceLabel = getLabelFromOptions(
      serviceAdminRows.map((r) => ({ value: r.id, label: r.serviceName })),
      form.service,
    );
    const subDepartmentLabel = getLabelFromOptions(
      subDepartmentOptions,
      form.subDepartment,
    );

    const payload = {
      hospital: form.hospital,
      hospitalLabel,
      patientType: form.patientType,
      patientTypeLabel,
      serviceCategory: form.serviceCategory,
      serviceCategoryLabel,
      service: form.service,
      serviceLabel,
      subDepartment: form.subDepartment,
      subDepartmentLabel,
      amount: form.amount,
    };

    if (editingRowId) {
      await updateAssignOpdService({ id: editingRowId, ...payload }).unwrap();
      message.success("OPD service assignment updated.");
    } else {
      await createAssignOpdService(payload).unwrap();
      message.success("OPD service assignment added.");
    }

    // closeModal();
  }, [
    form,
    editingRowId,
    hospitalOptions,
    patientTypeOptions,
    serviceCategoryOptions,
    subDepartmentOptions,
    serviceAdminRows,
    createAssignOpdService,
    updateAssignOpdService,
    message,
    closeModal,
  ]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (filterHospital && row.hospital !== filterHospital) return false;
      if (
        filterServiceCategory &&
        row.serviceCategory !== filterServiceCategory
      )
        return false;
      if (filterService && row.service !== filterService) return false;
      if (filterSubDepartment && row.subDepartment !== filterSubDepartment)
        return false;
      return true;
    });
  }, [
    rows,
    filterHospital,
    filterServiceCategory,
    filterService,
    filterSubDepartment,
  ]);

  const columns = useMemo(
    () => [
      {
        title: "Hospital",
        dataIndex: "hospitalLabel",
        key: "hospitalLabel",
        width: 200,
      },
      {
        title: "Patient Type",
        dataIndex: "patientTypeLabel",
        key: "patientTypeLabel",
        width: 140,
      },
      {
        title: "Service Category",
        dataIndex: "serviceCategoryLabel",
        key: "serviceCategoryLabel",
        width: 160,
      },
      {
        title: "Service",
        dataIndex: "serviceLabel",
        key: "serviceLabel",
        width: 200,
      },
      {
        title: "Sub Department",
        dataIndex: "subDepartmentLabel",
        key: "subDepartmentLabel",
        width: 150,
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        width: 110,
        render: (val) => (val != null ? val.toLocaleString() : "—"),
      },
      {
        title: "Action",
        key: "action",
        width: 90,
        align: "center",
        render: (_, record) => (
          <div
            className="assign-opd-services-actions-cell"
            style={{ display: "flex", gap: 8, justifyContent: "center" }}
          >
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label="Edit OPD service"
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
                aria-label="Delete OPD service"
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
    <div className="services-billing-page assign-opd-services-page">
      <div
        className="assign-opd-services-table-toolbar"
        style={{ display: "flex", gap: 12, justifyContent: "space-between" }}
      >
        <div
          className="assign-opd-services-filters"
          style={{ display: "flex", gap: 12 }}
        >
          <Select
            placeholder="Hospital"
            value={filterHospital}
            options={hospitalOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 240 }}
            onChange={(val) => {
              setFilterHospital(val);
              setFilterService(undefined);
            }}
          />
          <Select
            placeholder="Service Category"
            value={filterServiceCategory}
            options={serviceCategoryOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 220 }}
            onChange={(val) => {
              setFilterServiceCategory(val);
              setFilterService(undefined);
            }}
          />
          <Select
            placeholder="Service"
            value={filterService}
            options={filterServiceOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 220 }}
            disabled={!filterServiceCategory}
            onChange={(val) => setFilterService(val)}
          />
          <Select
            placeholder="Sub Department"
            value={filterSubDepartment}
            options={subDepartmentOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 220 }}
            onChange={(val) => setFilterSubDepartment(val)}
          />
        </div>

        <Button type="primary" onClick={openModal}>
          Assign OPD Service
        </Button>
      </div>

      <section
        className="services-billing-results"
        aria-label="assign opd services"
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

      <AssignOpdServicesModal
        open={isModalOpen}
        onClose={closeModal}
        title={
          editingRowId ? "Edit OPD Service Assignment" : "Assign OPD Service"
        }
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
        hospitalOptions={hospitalOptions}
        patientTypeOptions={patientTypeOptions}
        serviceCategoryOptions={serviceCategoryOptions}
        serviceOptions={serviceOptions}
        subDepartmentOptions={subDepartmentOptions}
      />
    </div>
  );
}
