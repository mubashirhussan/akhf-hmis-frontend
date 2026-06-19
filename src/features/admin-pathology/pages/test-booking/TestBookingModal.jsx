"use client";

import { Button, Input, Select } from "antd";
import AppModal from "@/components/ui/AppModal";
import FormField from "@/components/ui/FormField";
import FormGrid from "@/components/ui/FormGrid";
import { FIELD_CONTROL_CLASS } from "@/lib/field-control";

const controlClass = FIELD_CONTROL_CLASS;

export default function TestBookingModal({
  open,
  onClose,
  form,
  onPatchForm,
  onSave,
  mainGroups = [],
  services = [],
  components = [],
  isEdit,
}) {
  const groupOptions = mainGroups.map((g) => ({
    label: g.groupName,
    value: g.groupName,
  }));

  const serviceOptions = services.map((s) => ({
    label: s.label ?? s.serviceName,
    value: s.value ?? s.serviceName,
  }));
const componentOptions = components
  .filter(
    (c) =>
      c.groupName?.toLowerCase() === form.mainGroup?.toLowerCase()
  )
  .map((c) => ({
    value: c.componentName,
    label: c.componentName,
  }));

  return (
<AppModal
  open={open}
  onClose={onClose}
  title={isEdit ? "Edit Test Booking" : "Add Test Booking"}
  width={500}
  footer={
    <>
      <Button onClick={onClose}>Cancel</Button>
      <Button type="primary" onClick={onSave}>
        Save
      </Button>
    </>
  }
>
  {!isEdit ? (
    <FormGrid columns={1}>
            <FormField label="Test Booking Name" required>
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
      <FormField label="Main Group" required>
        <Select
          className={controlClass}
          value={form.mainGroup}
          options={groupOptions}
          onChange={(value) =>
            onPatchForm({
              mainGroup: value,
            })
          }
          allowClear
        />
      </FormField>
<FormField label="Components" required>
  <Select
    mode="multiple"
    className={controlClass}
    value={form.components}
    options={componentOptions}
    disabled={!form.mainGroup}
    allowClear
    maxTagCount={2}
    maxTagPlaceholder={(omitted) => `+${omitted.length}`}
    optionRender={(option) => (
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={form.components.includes(option.value)}
          readOnly
        />
        <span>{option.label}</span>
      </div>
    )}
    onChange={(value) =>
      onPatchForm({
        components: value,
      })
    }
  />
</FormField>



<FormField label="Service" required>
  <Select
    mode="multiple"
    className={controlClass}
    value={form.service || []}
    options={serviceOptions}
    allowClear
    maxTagCount={2}
    maxTagPlaceholder={(omitted) => `+${omitted.length}`}
    optionRender={(option) => (
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={(form.service || []).includes(option.value)}
          readOnly
        />
        <span>{option.label}</span>
      </div>
    )}
    onChange={(value) =>
      onPatchForm({
        service: value,
      })
    }
  />
</FormField>
    </FormGrid>
  ) : (
    <FormGrid columns={1}>
      <FormField label="Test Booking Name">
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

      <FormField label="Specimen Required">
        <Input
          className={controlClass}
          value={form.specimenRequired}
          onChange={(e) =>
            onPatchForm({
              specimenRequired: e.target.value,
            })
          }
        />
      </FormField>

      <FormField label="Collection Time">
        <Input
          className={controlClass}
          value={form.collectionTime}
          onChange={(e) =>
            onPatchForm({
              collectionTime: e.target.value,
            })
          }
        />
      </FormField>

<FormField label="Gender">
  <Select
    className={controlClass}
    value={form.gender}
    options={[
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
    ]}
    onChange={(value) =>
      onPatchForm({
        gender: value,
      })
    }
    allowClear
  />
</FormField>
    </FormGrid>
  )}
</AppModal>
  );
}