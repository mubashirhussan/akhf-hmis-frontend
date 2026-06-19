"use client";

import { useCallback, useMemo, useState } from "react";
import { App, Button, Input, Select, Tooltip } from "antd";
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

  const { data: rows = [], isLoading } = useGetTestBookingsQuery();
  const { data: mainGroups = [] } = useGetMainGroupsQuery();

  const [updateBooking] = useUpdateTestBookingMutation();

  const [selectedGroup, setSelectedGroup] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const openEdit = useCallback((row) => {
    setEditingRow(row);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setEditingRow(null);
  }, []);

  const filteredRows = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return rows.filter((r) => {
      const matchesGroup = !selectedGroup || r.mainGroup === selectedGroup;
      const matchesSearch =
        !term || r.testBookingName?.toLowerCase().includes(term);

      return matchesGroup && matchesSearch;
    });
  }, [rows, selectedGroup, searchTerm]);

  const handleSave = useCallback(
    async (updated) => {
      await updateBooking({
        id: editingRow.id,
        specimenRequired: updated.specimenRequired,
        service: updated.service,
      }).unwrap();

      message.success("Updated successfully");
      closeModal();
    },
    [updateBooking, editingRow, message, closeModal]
  );

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
    [openEdit]
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
      />

      <MapServicesModal
        open={open}
        onClose={closeModal}
        row={editingRow}
        onSave={handleSave}
        services={SERVICE_OPTIONS}
      />
    </div>
  );
}