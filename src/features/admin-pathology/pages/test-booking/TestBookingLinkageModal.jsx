"use client";

import { App, Button, Table, Tag } from "antd";
import AppModal from "@/components/ui/AppModal";
import AppIcon from "@/components/icons/AppIcon";
import { useConfirm } from "@/hooks/useConfirm";

export default function TestBookingLinkageModal({
  open,
  onClose,
  booking,
  components = [],
  onDelete,
  onEdit,
  onSave,
}) {
  const { confirmDelete } = useConfirm();
  const { message } = App.useApp();

  const data = (booking?.testNames ?? []).map((testName) => {
    const component = components.find((c) => c.testName === testName);
    return {
      id: component?.id ?? `unlinked-${testName}`,
      tid: component?.tid ?? "—",
      testName,
      componentName: component?.componentName ?? "—",
      tcid: component?.tcid ?? "—",
      _hasComponent: Boolean(component),
      _component: component ?? null,
    };
  });

  const columns = [
    { title: "TID", dataIndex: "tid", width: 80 },
    { title: "Test Name", dataIndex: "testName" },
    {
      title: "Component Name",
      dataIndex: "componentName",
      render: (val, record) =>
        record._hasComponent ? val : <Tag color="warning">Not linked</Tag>,
    },
    { title: "TCID", dataIndex: "tcid", width: 100 },
    {
      title: "Booking ID",
      render: () => booking?.id,
      width: 120,
    },
    {
      title: "Actions",
      width: 90,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button
            type="link"
            size="small"
            icon={<AppIcon icon="mdi:pencil-outline" />}
            onClick={() =>
              onEdit(
                record._component ?? {
                  id: null,
                  testName: record.testName,
                  componentName: "",
                }
              )
            }
          />

          <Button
            type="link"
            danger
            size="small"
            disabled={!record._hasComponent}
            icon={<AppIcon icon="mdi:delete-outline" />}
            onClick={async () => {
              if (!record._hasComponent) return;
              const confirmed = await confirmDelete({
                itemName: record.testName,
              });
              if (!confirmed) return;
              await onDelete(record._component);
              message.success("Deleted successfully");
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={booking?.testBookingName}
      width={900}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>

          <Button
            type="primary"
            onClick={() => {
              onSave?.(booking);
              onClose();
            }}
          >
            Save
          </Button>
        </>
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
        className="test-booking-linkage-table"
        bordered={false}
        locale={{ emptyText: "No tests added to this booking yet." }}
      />
    </AppModal>
  );
}