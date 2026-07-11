"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Form, Input, Select, Tooltip } from "antd";
import DataTable from "@/components/ui/DataTable";
import AppIcon from "@/components/icons/AppIcon";
import MapServicesModal from "./MapServicesModal";
import {
  useGetTestBookingsQuery,
  useUpdateTestBookingMutation,
  useGetMainGroupsQuery,
} from "@/features/admin-pathology/api/pathologyApi";
import { SERVICE_OPTIONS } from "@/features/admin-pathology/api/mock-test-booking";

export default function MapServicesPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const { data: rows = [], isLoading } = useGetTestBookingsQuery();
  const { data: mainGroups = [] } = useGetMainGroupsQuery();

  const [updateBooking] = useUpdateTestBookingMutation();

  const [selectedGroup, setSelectedGroup] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const openEdit = useCallback((row) => {
    setEditingRow(row);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setEditingRow(null);
    form.resetFields();
  }, [form]);

  const filteredRows = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return rows.filter((r) => {
      const matchesGroup = !selectedGroup || r.mainGroup === selectedGroup;
      const matchesSearch =
        !term || r.testBookingName?.toLowerCase().includes(term);

      return matchesGroup && matchesSearch;
    });
  }, [rows, selectedGroup, searchTerm]);

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      await updateBooking({
        id: editingRow.id,
        specimenRequired: values.specimenRequired,
        service: values.service,
      }).unwrap();

      message.success("Updated successfully");
      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [form, updateBooking, editingRow, message, closeModal]);

  const columns = useMemo(
    () => [
      {
        title: "Test Booking",
        dataIndex: "testBookingName",
      },
      {
        title: "Specimen",
        dataIndex: "specimenRequired",
      },
      {
        title: "Map Service",
        dataIndex: "service",
      },
      {
        title: "Action",
        align: "center",
        render: (_, record) => (
          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<AppIcon icon="mdi:pencil-outline" />}
              onClick={() => openEdit(record)}
            />
          </Tooltip>
        ),
      },
    ],
    [openEdit],
  );

  return (
    <div className="map-services-page">
      <div className="map-services-toolbar">
        <Select
          placeholder="Filter Main Group"
          style={{ width: 220 }}
          allowClear
          value={selectedGroup || undefined}
          options={mainGroups.map((g) => ({
            label: g.groupName,
            value: g.groupName,
          }))}
          onChange={(v) => setSelectedGroup(v || "")}
        />

        <Input
          placeholder="Filter by Test Booking"
          style={{ width: 260 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DataTable
        rowKey="id"
        columns={columns}
        dataSource={filteredRows}
        loading={isLoading}
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

      <MapServicesModal
        open={open}
        onClose={closeModal}
        form={form}
        row={editingRow}
        onSave={handleSave}
        services={SERVICE_OPTIONS}
      />
    </div>
  );
}
