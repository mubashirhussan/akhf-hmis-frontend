"use client";

import { Input, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import FormField from "@/components/ui/FormField";
import FormGrid from "@/components/ui/FormGrid";
import { FIELD_CONTROL_CLASS } from "@/lib/field-control";

const controlClass = FIELD_CONTROL_CLASS;

export default function TestBookingForm({
  form,
  onPatchForm,
  mainGroups = [],
  testNames = [],
  services = [],
}) {
  const groupOptions = mainGroups.map((group) => ({
    label: group.groupName,
    value: group.groupName,
  }));

  const availableTestNames = testNames
    .filter((t) => t.groupName === form.mainGroup)
    .map((t) => ({
      label: t.testName,
      value: t.testName,
    }));

  const serviceOptions = services.map((s) => ({
    label: s.label ?? s.serviceName,
    value: s.value ?? s.serviceName,
  }));

  return (
    <FormGrid columns={2} className="test-booking-form-grid">
      <FormField label="Test Booking Name" required>
        <Input
          className={controlClass}
          placeholder="Add Test Booking Name"
          value={form.testBookingName}
          onChange={(e) => onPatchForm({ testBookingName: e.target.value })}
        />
      </FormField>

      <FormField label="Specimen Required">
        <Input
          className={controlClass}
          value={form.specimenRequired}
          placeholder="Add specimen required"
          onChange={(e) => onPatchForm({ specimenRequired: e.target.value })}
        />
      </FormField>

      <FormField label="Collection Time" required>
        <TimePicker
          className={controlClass}
          format="HH:mm"
          value={form.collectionTime ? dayjs(form.collectionTime, "HH:mm") : null}
          onChange={(t) =>
            onPatchForm({ collectionTime: t ? t.format("HH:mm") : "" })
          }
        />
      </FormField>

      <FormField label="Main Group" required>
        <Select
          className={controlClass}
          value={form.mainGroup || undefined}
          options={groupOptions}
          allowClear
          onChange={(v) => onPatchForm({ mainGroup: v || "", testNames: [] })}
        />
      </FormField>

      <FormField label="Test Name(s)" required>
        <Select
          mode="multiple"
          className={controlClass}
          value={form.testNames}
          options={availableTestNames}
          disabled={!form.mainGroup}
          showSearch
          optionFilterProp="label"
          onChange={(v) => onPatchForm({ testNames: v })}
          style={{ width: "100%" }}
          maxTagCount="responsive"
          maxTagPlaceholder={(omitted) => `+${omitted.length} more`}
        />
      </FormField>

      <FormField label="Service" required>
        <Select
          className={controlClass}
          value={form.service || undefined}
          options={serviceOptions}
          allowClear
          showSearch
          optionFilterProp="label"
          onChange={(v) => onPatchForm({ service: v || "" })}
        />
      </FormField>
    </FormGrid>
  );
}