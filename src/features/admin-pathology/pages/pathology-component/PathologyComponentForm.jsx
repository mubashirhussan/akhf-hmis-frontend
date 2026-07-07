"use client";

import { useEffect, useMemo, useRef } from "react";
import { Button, Input, InputNumber, Select } from "antd";
import FormField from "@/components/ui/FormField";
import FormGrid from "@/components/ui/FormGrid";
import { FIELD_CONTROL_CLASS } from "@/lib/field-control";

const controlClass = FIELD_CONTROL_CLASS;

export default function PathologyComponentForm({
  form,
  unitOptions = [],
  fieldTypeOptions = [],
  mainGroups = [],
  subGroups = [],
  testNames = [],
  errors = {},
  isEditing = false,
  onPatchForm,
  onClearError,
  onAddUnit,
}) {
  const componentNameRef = useRef(null);
  const fieldId = (name) => `pathology-component-${name}`;

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

  const testOptions = useMemo(() => {
    if (!form.groupName) return [];
    return testNames
      .filter(
        (t) =>
          t.groupName === form.groupName &&
          t.subGroupName === form.subGroupName,
      )
      .map((t) => ({
        label: t.testName,
        value: t.tid,
      }));
  }, [testNames, form.groupName, form.subGroupName]);

  useEffect(() => {
    if (!errors.componentName) return;
    componentNameRef.current?.focus({ preventScroll: false });
  }, [errors.componentName]);

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
          disabled={isEditing}
          onChange={(TGID) => {
            const selectedGroup = mainGroups.find((g) => g.TGID === TGID);
            onPatchForm({
              TGID,
              TSGID: null,
              TID: null,
              groupName: selectedGroup?.groupName ?? "",
              subGroupName: "",
              testName: "",
            });
            onClearError?.("TGID");
          }}
        />
      </FormField>

      <FormField label="Sub-Group Name">
        <Select
          id={fieldId("sub-group-name")}
          className={controlClass}
          value={form.TSGID}
          options={subGroupOptions}
          disabled={!form.TGID}
          onChange={(TSGID) => {
            const selectedSG = subGroups.find((sg) => sg.TSGID === TSGID);
            onPatchForm({
              TSGID,
              TID: null,
              subGroupName: selectedSG?.subGroupName ?? "",
              testName: "",
            });
          }}
        />
      </FormField>

      <FormField
        label="Test Name"
        required
        help={errors?.TID}
        validateStatus={errors?.TID ? "error" : ""}
      >
        <Select
          id={fieldId("test-name")}
          className={controlClass}
          status={errors?.TID ? "error" : ""}
          value={form.TID}
          options={testOptions}
          disabled={!form.subGroupName}
          onChange={(TID) => {
            const selectedTest = testNames.find((t) => t.tid === TID);
            onPatchForm({
              TID,
              testName: selectedTest?.testName ?? "",
            });
            onClearError?.("TID");
          }}
        />
      </FormField>

      <FormField label="Control Field Type">
        <Select
          id={fieldId("field-type")}
          className={controlClass}
          value={form.fieldType}
          options={fieldTypeOptions}
          onChange={(fieldType) => onPatchForm({ fieldType })}
        />
      </FormField>

      <FormField
        label="Component Name"
        required
        help={errors?.componentName}
        validateStatus={errors?.componentName ? "error" : ""}
      >
        <Input
          ref={componentNameRef}
          id={fieldId("component-name")}
          className={controlClass}
          value={form.componentName}
          status={errors?.componentName ? "error" : ""}
          onChange={(e) => {
            onPatchForm({ componentName: e.target.value });
            onClearError?.("componentName");
          }}
          autoComplete="off"
        />
      </FormField>

      <FormField label="Unit">
        <Select
          id={fieldId("unit")}
          className={controlClass}
          value={form.unit || undefined}
          options={unitOptions}
          placeholder="Select unit"
          allowClear
          onChange={(unit) => onPatchForm({ unit: unit ?? "" })}
        />
      </FormField>

      <FormField label="Priority">
        <InputNumber
          id={fieldId("priority")}
          className={`${controlClass} pathology-component-priority-input`}
          value={form.priority}
          min={1}
          max={99}
          onChange={(priority) => onPatchForm({ priority: priority ?? 1 })}
        />
      </FormField>

      <FormField label="Tool Tip / Critical Values">
        <Input
          id={fieldId("tool-tip")}
          className={controlClass}
          value={form.toolTip}
          onChange={(e) => onPatchForm({ toolTip: e.target.value })}
          autoComplete="off"
        />
      </FormField>

      <FormField label="Reference Value for Report (Male)">
        <Input
          id={fieldId("reference-male")}
          className={controlClass}
          value={form.referenceMale}
          onChange={(e) => onPatchForm({ referenceMale: e.target.value })}
          autoComplete="off"
        />
      </FormField>

      <FormField label="Reference Value for Report (Female)">
        <Input
          id={fieldId("reference-female")}
          className={controlClass}
          value={form.referenceFemale}
          onChange={(e) => onPatchForm({ referenceFemale: e.target.value })}
          autoComplete="off"
        />
      </FormField>

      <FormField label="New Unit">
        <div className="pathology-component-new-unit">
          <Input
            id={fieldId("new-unit")}
            className={controlClass}
            value={form.newUnit}
            onChange={(e) => onPatchForm({ newUnit: e.target.value })}
            autoComplete="off"
          />
          <Button type="link" onClick={onAddUnit}>
            Add New Unit
          </Button>
        </div>
      </FormField>
    </FormGrid>
  );
}