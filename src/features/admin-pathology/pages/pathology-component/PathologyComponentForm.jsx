"use client";

import { useEffect, useMemo, useRef } from "react";
import { Button, Input, InputNumber, Select } from "antd";
import FormField from "@/components/ui/FormField";
import FormGrid from "@/components/ui/FormGrid";
import { FIELD_CONTROL_CLASS } from "@/lib/field-control";
import { FIELD_TYPE_OPTIONS } from "@/features/admin-pathology/api/mock-pathology-component";

import {
  useGetMainGroupsQuery,
  useGetSubGroupsQuery,
  useGetTestNamesQuery,
} from "@/features/admin-pathology/api/pathologyApi";

export default function PathologyComponentForm({
  form,
  unitOptions,
  errors = {},
  isEditing = false,
  onPatchForm,
  onClearError,
  onAddUnit,
}) {
  const { data: mainGroups = [] } = useGetMainGroupsQuery();
  const { data: subGroups = [] } = useGetSubGroupsQuery();
  const { data: testNames = [] } = useGetTestNamesQuery();

  const controlClass = FIELD_CONTROL_CLASS;
  const groupOptions = useMemo(() => {
    return mainGroups.map((g) => ({
      label: g.groupName,
      value: g.groupName,
    }));
  }, [mainGroups]);
  const componentNameRef = useRef(null);
  const fieldId = (name) => `pathology-component-${name}`;
  const subGroupOptions = useMemo(() => {
    return subGroups
      .filter((sg) => sg.groupName === form.groupName)
      .map((sg) => ({
        label: sg.subGroupName,
        value: sg.subGroupName,
      }));
  }, [subGroups, form.groupName]);
  const testOptions = useMemo(() => {
    return testNames
      .filter(
        (t) =>
          t.groupName === form.groupName &&
          t.subGroupName === form.subGroupName,
      )
      .map((t) => ({
        label: t.testName,
        value: t.testName,
      }));
  }, [testNames, form.groupName, form.subGroupName]);
  const componentNameError = errors.componentName;

  useEffect(() => {
    if (!componentNameError) return;
    componentNameRef.current?.focus({ preventScroll: false });
  }, [componentNameError]);

  return (
    <FormGrid columns={2} className="pathology-component-form-grid">
      <FormField label="Group Name">
        <Select
          id={fieldId("group-name")}
          className={controlClass}
          value={form.groupName}
          options={groupOptions}
          disabled={isEditing}
          onChange={(groupName) => {

            onPatchForm({
              groupName,
              subGroupName: '',
              testName: '',
            });
          }}
        />
      </FormField>

      <FormField label="Sub-Group Name">
        <Select
          id={fieldId("sub-group-name")}
          className={controlClass}
          value={form.subGroupName}
          options={subGroupOptions}
          disabled={!form.groupName}
          onChange={(subGroupName) => {

            onPatchForm({
              subGroupName,
              testName: '',
            });
          }}
        />
      </FormField>

      <FormField label="Test Name">
        <Select
          id={fieldId("test-name")}
          className={controlClass}
          value={form.testName}
          options={testOptions}
          disabled={!form.subGroupName}
          onChange={(testName) => onPatchForm({ testName })}
        />
      </FormField>

      <FormField label="Control Field Type">
        <Select
          id={fieldId("field-type")}
          className={controlClass}
          value={form.fieldType}
          options={FIELD_TYPE_OPTIONS}
          onChange={(fieldType) => onPatchForm({ fieldType })}
        />
      </FormField>

      <FormField label="Component Name" required error={componentNameError}>
        <Input
          ref={componentNameRef}
          id={fieldId("component-name")}
          className={controlClass}
          value={form.componentName}
          status={componentNameError ? "error" : undefined}
          onChange={(event) => {
            onPatchForm({ componentName: event.target.value });
            if (componentNameError) {
              onClearError?.("componentName");
            }
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

      <FormField label="Tool Tip">
        <Input
          id={fieldId("tool-tip")}
          className={controlClass}
          value={form.toolTip}
          onChange={(event) => onPatchForm({ toolTip: event.target.value })}
          autoComplete="off"
        />
      </FormField>

      <FormField label="Reference Value for Report (Male)">
        <Input
          id={fieldId("reference-male")}
          className={controlClass}
          value={form.referenceMale}
          onChange={(event) =>
            onPatchForm({ referenceMale: event.target.value })
          }
          autoComplete="off"
        />
      </FormField>

      <FormField label="Reference Value for Report (Female)">
        <Input
          id={fieldId("reference-female")}
          className={controlClass}
          value={form.referenceFemale}
          onChange={(event) =>
            onPatchForm({ referenceFemale: event.target.value })
          }
          autoComplete="off"
        />
      </FormField>

      <FormField label="New Unit">
        <div className="pathology-component-new-unit">
          <Input
            id={fieldId("new-unit")}
            className={controlClass}
            value={form.newUnit}
            onChange={(event) => onPatchForm({ newUnit: event.target.value })}
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
