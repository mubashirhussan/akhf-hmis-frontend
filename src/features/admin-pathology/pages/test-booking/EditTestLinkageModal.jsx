"use client";

import { Select, Button } from "antd";
import { App } from "antd";
import AppModal from "@/components/ui/AppModal";
import { useEffect, useState, useMemo } from "react";

export default function EditTestLinkModal({
  open,
  onClose,
  record,
  booking,
  components = [],
  onSave,
}) {
  const { message } = App.useApp();

  const [testName, setTestName] = useState(null);
  const [componentName, setComponentName] = useState("");

  useEffect(() => {
    if (record) {
      setTestName(record.testName || null);
      setComponentName(record.componentName || "");
    }
  }, [record, open]);

  const filteredComponents = useMemo(() => {
    if (!booking?.mainGroup) return [];
    return components.filter((c) => c.groupName === booking.mainGroup);
  }, [components, booking]);

  const testOptions = useMemo(() => {
    const fromBooking = (booking?.testNames ?? []).map((t) => ({
      label: t,
      value: t,
    }));
    const fromComponents = filteredComponents.map((c) => ({
      label: c.testName,
      value: c.testName,
    }));
    const seen = new Set();
    return [...fromBooking, ...fromComponents].filter(({ value }) => {
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }, [booking, filteredComponents]);

  const componentOptions = useMemo(() => {
    if (!testName) return [];
    return filteredComponents
      .filter((c) => c.testName === testName)
      .map((c) => ({
        label: c.componentName,
        value: c.componentName,
      }));
  }, [filteredComponents, testName]);

  return (
    <AppModal open={open} onClose={onClose} title="Edit Test" width={600} centered={false} mask={{ closable: false }} style={{ top: 20 }} className="test-booking-modal" rootClassName="test-booking-modal-root">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, marginBottom: 6, color: "#666" }}>
            Test Name
          </div>
          <Select
            value={testName || undefined}
            options={testOptions}
            placeholder="Select Test Name"
            onChange={(v) => {
              setTestName(v);
              setComponentName("");
            }}
            style={{ width: "100%" }}
            showSearch
            optionFilterProp="label"
          />
        </div>

        <div>
          <div style={{ fontSize: 12, marginBottom: 6, color: "#666" }}>
            Component Name
          </div>
          <Select
            value={componentName || undefined}
            options={componentOptions}
            placeholder={testName ? "Select Component" : "Select test first"}
            disabled={!testName?.trim()}
            onChange={(v) => setComponentName(v)}
            style={{ width: "100%" }}
            showSearch
            optionFilterProp="label"
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button onClick={onClose}>Cancel</Button>

          <Button
            type="primary"
            disabled={!testName || !componentName}
            onClick={() => {
              onSave({
                ...record,
                testName,
                componentName,
              });
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </AppModal>
  );
}