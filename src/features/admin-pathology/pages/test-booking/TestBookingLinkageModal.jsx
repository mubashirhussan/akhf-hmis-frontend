"use client";

import { App, Button, Table, Tag, Select  } from "antd";
import { useState, useMemo } from "react";
import AppModal from "@/components/ui/AppModal";
import AppIcon from "@/components/icons/AppIcon";
import { useConfirm } from "@/hooks/useConfirm";

export default function TestBookingLinkageModal({
  open, onClose, booking, components = [], onDelete, onSave, onAddTest,
}) {
  const { confirmDelete } = useConfirm();
  const { message } = App.useApp();
  const [addTestOpen, setAddTestOpen] = useState(false);
const [selectedTestToAdd, setSelectedTestToAdd] = useState(null);

const availableTestOptions = useMemo(() => {
  const alreadyAdded = new Set(booking?.testNames ?? []);
  const matchingComponents = components.filter(
    (c) => c.groupName === booking?.mainGroup
  );
  const uniqueTestNames = [...new Set(matchingComponents.map((c) => c.testName))];
  return uniqueTestNames
    .filter((t) => !alreadyAdded.has(t))
    .map((t) => ({ label: t, value: t }));
}, [components, booking]);

const data = (booking?.testNames ?? []).flatMap((testName) => {
  const matched = components.filter((c) => c.testName === testName);
  if (matched.length === 0) {
    return [{
      id: `unlinked-${testName}`,
      tid: "—",
      testName,
      componentName: "—",
      tcid: "—",
      _hasComponent: false,
      _component: null,
    }];
  }
  return matched.map((component) => ({
    id: component.id,
    tid: component.tid,
    testName,
    componentName: component.componentName,
    tcid: component.tcid,
    _hasComponent: true,
    _component: component,
  }));
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
  width: 60,
  render: (_, record) => (
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
  ),
},
  ];

  return (
<AppModal
  open={open}
  onClose={onClose}
  title={booking?.testBookingName}
  width={900}
  centered={false}
  mask={{ closable: false }}
  style={{ top: 20 }}
  className="test-booking-modal"
  rootClassName="test-booking-modal-root"
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
  <div style={{ marginBottom: 12, display: "flex", justifyContent: "flex-end" }}>
    <Button type="primary" onClick={() => setAddTestOpen(true)}>
      Add Tests
    </Button>
  </div>

  {addTestOpen && (
    <div
      style={{
        background: "#fafafa",
        border: "1px solid #e8e8e8",
        borderRadius: 6,
        padding: "12px 16px",
        marginBottom: 12,
        display: "flex",
        gap: 10,
        alignItems: "center",
      }}
    >
      <Select
        style={{ flex: 1 }}
        placeholder="Select a test to add"
        value={selectedTestToAdd}
        options={availableTestOptions}
        onChange={(v) => setSelectedTestToAdd(v)}
        showSearch
        optionFilterProp="label"
        allowClear
      />
      <Button
        type="primary"
        disabled={!selectedTestToAdd}
        onClick={async () => {
          if (!selectedTestToAdd || !booking) return;
          const updatedNames = [...(booking.testNames ?? []), selectedTestToAdd];
          await onAddTest?.(booking.id, updatedNames);
          setSelectedTestToAdd(null);
          setAddTestOpen(false);
        }}
      >
        Add
      </Button>
      <Button onClick={() => { setAddTestOpen(false); setSelectedTestToAdd(null); }}>
        Cancel
      </Button>
    </div>
  )}

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