"use client";

import { Input, Select } from "antd";
import FormField from "@/components/ui/FormField";
import FormGrid from "@/components/ui/FormGrid";

export default function MapServicesForm({
  form,
  onPatchForm,
  row,
  services,
}) {
  return (
    <FormGrid columns={1}>
      <FormField label="Test Booking Name">
        <Input value={row?.testBookingName} disabled />
      </FormField>

      <FormField label="Specimen Required">
        <Input
          value={form.specimenRequired}
          onChange={(e) =>
            onPatchForm({ specimenRequired: e.target.value })
          }
        />
      </FormField>

      <FormField label="Service">
        <Select
          value={form.service}
          options={services}
          onChange={(v) => onPatchForm({ service: v })}
          allowClear
        />
      </FormField>
    </FormGrid>
  );
}