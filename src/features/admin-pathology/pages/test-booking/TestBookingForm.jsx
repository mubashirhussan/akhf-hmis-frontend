"use client";

import { Input, Select } from "antd";
import FormField from "@/components/ui/FormField";
import FormGrid from "@/components/ui/FormGrid";
import { FIELD_CONTROL_CLASS } from "@/lib/field-control";
import { SERVICE_OPTIONS } from "../../api/mock-test-booking";
const controlClass = FIELD_CONTROL_CLASS;

export default function TestBookingForm({
  form,
  errors = {},
  onPatchForm,
  mainGroups = [],
  services = [],
}) {
  const groupOptions = mainGroups.map((g) => ({
    label: g.groupName,
    value: g.groupName,
  }));


  return (
    <FormGrid columns={1} className="test-booking-form-grid">
      <FormField label="Main Group" required>
        <Select
          className={controlClass}
          value={form.mainGroup}
          options={groupOptions}
          allowClear
          onChange={(value) =>
            onPatchForm({
              mainGroup: value || "",
            })
          }
        />
      </FormField>

      <FormField
        label="Test Booking Name"
        required
        help={errors?.testBookingName}
        validateStatus={errors?.testBookingName ? "error" : ""}
      >
        <Input
          className={controlClass}
          value={form.testBookingName}
          onChange={(e) =>
            onPatchForm({
              testBookingName: e.target.value,
            })
          }
        />
      </FormField>

      <FormField label="Service" required>
        <Select
          className={controlClass}
          value={form.service}
          options={SERVICE_OPTIONS}
          allowClear
          showSearch
          optionFilterProp="label"
          onChange={(value) =>
            onPatchForm({
              service: value || "",
            })
          }
        />
      </FormField>
    </FormGrid>
  );
}