"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Form, Tooltip } from "antd";
import AppIcon from "@/components/icons/AppIcon";
import DataTable from "@/components/ui/DataTable";
import { ROUTES } from "@/config/routes";
import { createEmployeeSearchFilters } from "@/features/human-resource/api/mock-employee-search";
import {
  useDeleteEmployeeMutation,
  useSearchEmployeesQuery,
} from "@/features/human-resource/api/employeeApi";
import { useConfirm } from "@/hooks/useConfirm";
import EmployeeSearchFilterForm from "./EmployeeSearchFilterForm";

const ACTION_ICON_CLASS = "h-[16px] w-[16px] text-[var(--app-primary)]";

export default function SearchAllEmployeePage() {
  const { message } = App.useApp();
  const router = useRouter();
  const { confirmDelete } = useConfirm();
  const [filterForm] = Form.useForm();
  const [appliedFilters, setAppliedFilters] = useState(
    createEmployeeSearchFilters,
  );
  const [hasSearched, setHasSearched] = useState(true);
  const { data: results = [], isFetching } =
    useSearchEmployeesQuery(appliedFilters);
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const handleSearch = useCallback((values) => {
    setAppliedFilters({ ...values });
    setHasSearched(true);
  }, []);

  const handleClear = useCallback(() => {
    const resetFilters = createEmployeeSearchFilters();
    filterForm.setFieldsValue(resetFilters);
    setAppliedFilters(resetFilters);
    setHasSearched(true);
  }, [filterForm]);

  const handleEdit = useCallback(
    (record) => {
      router.push(
        `${ROUTES.humanResource.employeeEntry}?employeeId=${record.id}`,
      );
    },
    [router],
  );

  const handleDelete = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.empName });
      if (!confirmed) {
        return;
      }

      try {
        await deleteEmployee(record.id).unwrap();
        message.success("Employee deleted.");
      } catch {
        message.error("Failed to delete employee.");
      }
    },
    [confirmDelete, deleteEmployee, message],
  );

  const columns = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "serial",
        key: "serial",
      },
      {
        title: "Emp ID",
        dataIndex: "empId",
        key: "empId",
      },
      {
        title: "Emp No",
        dataIndex: "empNo",
        key: "empNo",
      },
      {
        title: "Emp Name",
        dataIndex: "empName",
        key: "empName",
      },
      {
        title: "Relation Name",
        dataIndex: "relationName",
        key: "relationName",
      },
      {
        title: "Hospital Name",
        dataIndex: "hospitalName",
        key: "hospitalName",
      },
      {
        title: "Department",
        dataIndex: "department",
        key: "department",
      },
      {
        title: "SubDepartment",
        dataIndex: "subDepartment",
        key: "subDepartment",
      },
      {
        title: "CNIC",
        dataIndex: "cnic",
        key: "cnic",
      },
      {
        title: "Designation",
        dataIndex: "designation",
        key: "designation",
      },
      { title: "Gender", dataIndex: "gender", key: "gender" },
      { title: "DOB", dataIndex: "dob", key: "dob" },
      {
        title: "Joining Date",
        dataIndex: "joiningDate",
        key: "joiningDate",
      },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Phone Number", dataIndex: "phone", key: "phone" },
      { title: "PMDC", dataIndex: "pmdc", key: "pmdc" },
      { title: "Shift", dataIndex: "shift", key: "shift", className: "whitespace-nowrap" },
      {
        title: "Action",
        key: "action",
        width: 90,
        align: "center",
        fixed: "right",
        render: (_, record) => (
          <div className="employee-search-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label={`Edit ${record.empName}`}
                icon={
                  <AppIcon
                    icon="mdi:pencil-outline"
                    className={ACTION_ICON_CLASS}
                  />
                }
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            {/* <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label={`Delete ${record.empName}`}
                icon={
                  <AppIcon
                    icon="mdi:delete-outline"
                    className={ACTION_ICON_CLASS}
                  />
                }
                onClick={() => handleDelete(record)}
              />
            </Tooltip> */}
          </div>
        ),
      },
    ],
    [handleDelete, handleEdit],
  );

  return (
    <div className="patient-registration-page search-all-employee-page">
      <EmployeeSearchFilterForm
        form={filterForm}
        onSubmit={handleSearch}
        onClear={handleClear}
        loading={isFetching}
      />

      <section
        className="employee-search-results employee-search-table-wrap"
        aria-label="Employee search results"
      >
        <DataTable
          columns={columns}
          dataSource={results}
          loading={isFetching}
          rowKey="id"
          columnAlign="left"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total) => `Total ${total} items`,
          }}
          locale={{
            emptyText: hasSearched
              ? "No employees found"
              : "Use the search form above to find employees",
          }}
        />
      </section>
    </div>
  );
}
