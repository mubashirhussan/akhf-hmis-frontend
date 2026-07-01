"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Tag, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import { useConfirm } from "@/hooks/useConfirm";
import {
  createEmptyAssignDutyToEmployeeForm,
  createAssignDutyToEmployeeFilters,
  rowToAssignDutyToEmployeeForm,
  filterAssignDutyToEmployeeRows,
  formatAlternative,
  formatDaysOfWeek,
  resolveEmployeeNames,
} from "@/features/duty-roaster/api/mock-assign-duty-to-employee";
import {
  useGetAssignDutyToEmployeesQuery,
  useAddAssignDutyToEmployeeMutation,
  useUpdateAssignDutyToEmployeeMutation,
  useDeleteAssignDutyToEmployeeMutation,
} from "@/features/duty-roaster/api/dutyRoasterApi";
import AssignDutyToEmployeeFilterForm from "./AssignDutyToEmployeeFilterForm";
import AssignDutyToEmployeeModal from "./AssignDutyToEmployeeModal";
import "./assign-duty-to-employee.css";

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";

export default function AssignDutyToEmployeePage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [form, setForm] = useState(createEmptyAssignDutyToEmployeeForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [filters, setFilters] = useState(createAssignDutyToEmployeeFilters);
  const [appliedFilters, setAppliedFilters] = useState(
    createAssignDutyToEmployeeFilters,
  );

  const { data: rows = [], isLoading } = useGetAssignDutyToEmployeesQuery();
  const [addAssignDutyToEmployee] = useAddAssignDutyToEmployeeMutation();
  const [updateAssignDutyToEmployee] = useUpdateAssignDutyToEmployeeMutation();
  const [deleteAssignDutyToEmployee] = useDeleteAssignDutyToEmployeeMutation();

  const patchForm = useCallback(
    (patch) => setForm((c) => ({ ...c, ...patch })),
    [],
  );

  const clearFieldError = useCallback((field) => {
    setFieldErrors((c) => {
      if (!c[field]) return c;
      const next = { ...c };
      delete next[field];
      return next;
    });
  }, []);

  const openModal = useCallback(() => {
    setForm(createEmptyAssignDutyToEmployeeForm());
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
    setForm(rowToAssignDutyToEmployeeForm(record));
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({
        itemName: record.employeeNames?.join(", ") || "duty assignment",
      });
      if (!confirmed) return;
      await deleteAssignDutyToEmployee(record.id).unwrap();
      message.success("Duty assignment deleted.");
    },
    [confirmDelete, deleteAssignDutyToEmployee, message],
  );

  const handleSave = useCallback(async () => {
    const errors = {};
    if (!form.startFrom) errors.startFrom = "Start From is required.";
    if (!form.endDate) errors.endDate = "End Date is required.";
    if (!form.employeeDepartmentId) {
      errors.employeeDepartmentId = "Employees of Department is required.";
    }
    if (!form.employeeSubDepartmentId) {
      errors.employeeSubDepartmentId =
        "Employee of Sub Department is required.";
    }
    if (!form.dutyRosterDepartmentId) {
      errors.dutyRosterDepartmentId = "Duty Roster For Department is required.";
    }
    if (!form.dutyRosterSubDepartmentId) {
      errors.dutyRosterSubDepartmentId =
        "Duty Roster For Sub Department is required.";
    }
    if (!form.shiftId) errors.shiftId = "Shift Name is required.";
    if (!form.employeeIds?.length)
      errors.employeeIds = "Employee Name is required.";
    if (!form.alternative) errors.alternative = "Alternative is required.";
    if (!form.daysOfWeek?.length)
      errors.daysOfWeek = "Day of Week is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const payload = {
      startFrom: form.startFrom,
      endDate: form.endDate,
      employeeDepartmentId: form.employeeDepartmentId,
      employeeDepartmentName: form.employeeDepartmentName,
      employeeSubDepartmentId: form.employeeSubDepartmentId,
      employeeSubDepartmentName: form.employeeSubDepartmentName,
      dutyRosterDepartmentId: form.dutyRosterDepartmentId,
      dutyRosterDepartmentName: form.dutyRosterDepartmentName,
      dutyRosterSubDepartmentId: form.dutyRosterSubDepartmentId,
      dutyRosterSubDepartmentName: form.dutyRosterSubDepartmentName,
      shiftId: form.shiftId,
      shiftName: form.shiftName,
      doubleDuty: form.doubleDuty ?? false,
      employeeIds: form.employeeIds,
      employeeNames: resolveEmployeeNames(form.employeeIds),
      alternative: form.alternative,
      daysOfWeek: form.daysOfWeek,
    };

    if (editingRowId) {
      await updateAssignDutyToEmployee({
        id: editingRowId,
        ...payload,
      }).unwrap();
      setIsModalOpen(false);
      setEditingRowId(null);
      message.success("Duty assignment updated.");
      return;
    }

    await addAssignDutyToEmployee(payload).unwrap();
    setIsModalOpen(false);
    message.success("Duty assigned to employee.");
  }, [
    form,
    editingRowId,
    addAssignDutyToEmployee,
    updateAssignDutyToEmployee,
    message,
  ]);

  const handleSearch = () => setAppliedFilters({ ...filters });

  const handleClear = () => {
    const empty = createAssignDutyToEmployeeFilters();
    setFilters(empty);
    setAppliedFilters(empty);
  };

  const filteredRows = useMemo(
    () => filterAssignDutyToEmployeeRows(rows, appliedFilters),
    [rows, appliedFilters],
  );

  const columns = useMemo(
    () => [
      {
        title: "Start From",
        dataIndex: "startFrom",
        key: "startFrom",
        width: 110,
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        width: 110,
      },
      {
        title: "Department",
        dataIndex: "employeeDepartmentName",
        key: "employeeDepartmentName",
        width: 200,
      },
      {
        title: "Sub Department",
        dataIndex: "employeeSubDepartmentName",
        key: "employeeSubDepartmentName",
        width: 180,
      },
      {
        title: "Duty Roster For Department",
        dataIndex: "dutyRosterDepartmentName",
        key: "dutyRosterDepartmentName",
        width: 200,
      },
      {
        title: "Duty Roster For Sub Department",
        dataIndex: "dutyRosterSubDepartmentName",
        key: "dutyRosterSubDepartmentName",
        width: 180,
      },
      {
        title: "Shift Name",
        dataIndex: "shiftName",
        key: "shiftName",
        width: 180,
      },
      {
        title: "Double Duty",
        dataIndex: "doubleDuty",
        key: "doubleDuty",
        width: 100,
        render: (value) => (
          <Tag color={value ? "processing" : "default"}>
            {value ? "Yes" : "No"}
          </Tag>
        ),
      },
      {
        title: "Employee Name",
        dataIndex: "employeeNames",
        key: "employeeNames",
        width: 200,
        render: (names) => names?.join(", ") ?? "",
      },
      {
        title: "Alternative",
        dataIndex: "alternative",
        key: "alternative",
        width: 120,
        render: (value) => formatAlternative(value),
      },
      {
        title: "Day of Week",
        dataIndex: "daysOfWeek",
        key: "daysOfWeek",
        width: 200,
        render: (days) => formatDaysOfWeek(days),
      },
      {
        title: "Action",
        key: "action",
        width: 90,
        align: "center",
        fixed: "right",
        render: (_, record) => (
          <div className="assign-duty-employee-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label="Edit duty assignment"
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
                aria-label="Delete duty assignment"
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
    <div className="services-billing-page assign-duty-employee-page">
      <AssignDutyToEmployeeFilterForm
        filters={filters}
        onPatchFilter={(patch) => setFilters((c) => ({ ...c, ...patch }))}
        onSubmit={handleSearch}
        onClear={handleClear}
        loading={isLoading}
      />

      <section
        className="services-billing-results"
        aria-label="Assign duty to employee entries"
      >
        <div className="hr-table-toolbar">
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Assign Duty to Employee
          </Button>
        </div>

        <DataTable
          rowKey="id"
          columns={columns}
          dataSource={filteredRows}
          loading={isLoading}
          columnAlign="left"
          scroll={{ x: 1800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </section>

      <AssignDutyToEmployeeModal
        open={isModalOpen}
        onClose={closeModal}
        title={
          editingRowId
            ? "Edit Assign Duty to Employee"
            : "Assign Duty to Employee"
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
