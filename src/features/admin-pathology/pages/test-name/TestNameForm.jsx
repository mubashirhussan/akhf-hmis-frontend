"use client";

import { useMemo } from "react";
import { Input, InputNumber, Select } from "antd";
import FormField from "@/components/ui/FormField";
import FormGrid from "@/components/ui/FormGrid";
import { FIELD_CONTROL_CLASS } from "@/lib/field-control";

const controlClass = FIELD_CONTROL_CLASS;

export default function TestNameForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
  mainGroups = [],
  subGroups = [],
}) {
  const fieldId = (name) => `test-name-${name}`;

  const groupOptions = useMemo(() => {
    return mainGroups.map((g) => ({
      label: g.groupName,
      value: g.TGID,
    }));
  }, [mainGroups]);

  const subGroupOptions = useMemo(() => {
    return subGroups
      .filter((sg) => sg.TGID === form.TGID)
      .map((sg) => ({
        label: sg.subGroupName,
        value: sg.TSGID,
      }));
  }, [subGroups, form.TGID]);

  return (
    <FormGrid columns={2} className="pathology-component-form-grid">
      <FormField
        label="Group Name"
        required
        help={errors?.TGID}
        validateStatus={errors?.TGID ? "error" : ""}
      >
        <Select
          id={fieldId("group-name")}
          className={controlClass}
          status={errors?.TGID ? "error" : ""}
          value={form.TGID}
          options={groupOptions}
          onChange={(TGID) => {
            const selectedGroup = mainGroups.find((g) => g.TGID === TGID);
            onPatchForm({
              TGID,
              TSGID: null,
              groupName: selectedGroup?.groupName ?? "",
              subGroupName: "",
            });
            onClearError("TGID");
          }}
        />
      </FormField>

      <FormField
        label="Sub-Group Name"
        required
        help={errors?.TSGID}
        validateStatus={errors?.TSGID ? "error" : ""}
      >
        <Select
          id={fieldId("sub-group-name")}
          className={controlClass}
          status={errors?.TSGID ? "error" : ""}
          value={form.TSGID}
          options={subGroupOptions}
          disabled={!form.TGID}
          onChange={(TSGID) => {
            const selectedSubGroup = subGroups.find(
              (sg) => sg.TSGID === TSGID,
            );
            onPatchForm({
              TSGID,
              subGroupName: selectedSubGroup?.subGroupName ?? "",
            });
            onClearError("TSGID");
          }}
        />
      </FormField>

      <FormField
        label="Test Name"
        required
        help={errors?.testName}
        validateStatus={errors?.testName ? "error" : ""}
      >
        <Input
          id={fieldId("test-name")}
          className={controlClass}
          status={errors?.testName ? "error" : ""}
          value={form.testName}
          onChange={(e) => {
            onPatchForm({ testName: e.target.value });
            onClearError("testName");
          }}
        />
      </FormField>

      <FormField label="Medical Name">
        <Input
          id={fieldId("medical-name")}
          className={controlClass}
          value={form.medicalName}
          onChange={(e) => onPatchForm({ medicalName: e.target.value })}
        />
      </FormField>

      <FormField label="Standard Name">
        <Input
          id={fieldId("standard-name")}
          className={controlClass}
          value={form.standardName}
          onChange={(e) => onPatchForm({ standardName: e.target.value })}
        />
      </FormField>

      <FormField label="Fee">
        <InputNumber
          id={fieldId("fee")}
          className={`${controlClass} test-name-fee-input`}
          value={form.fee}
          min={0}
          onChange={(fee) => onPatchForm({ fee: fee ?? 0 })}
        />
      </FormField>
    </FormGrid>
  );
}