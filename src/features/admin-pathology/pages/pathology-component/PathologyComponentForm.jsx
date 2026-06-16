'use client';

import { useEffect, useRef } from 'react';
import { Button, Input, InputNumber, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  FIELD_TYPE_OPTIONS,
  GROUP_OPTIONS,
  getSubGroupOptions,
  getTestOptions,
} from '@/features/admin-pathology/api/mock-pathology-component';

const controlClass = FIELD_CONTROL_CLASS;

export default function PathologyComponentForm({
  form,
  unitOptions,
  errors = {},
  isEditing = false,
  onPatchForm,
  onClearError,
  onAddUnit,
}) {
  const componentNameRef = useRef(null);
  const fieldId = (name) => `pathology-component-${name}`;
  const subGroupOptions = getSubGroupOptions(form.groupName);
  const testOptions = getTestOptions(form.subGroupName);
  const componentNameError = errors.componentName;

  useEffect(() => {
    if (!componentNameError) return;
    componentNameRef.current?.focus({ preventScroll: false });
  }, [componentNameError]);

  return (
    <FormGrid columns={2} className="pathology-component-form-grid">
      <FormField label="Group Name">
        <Select
          id={fieldId('group-name')}
          className={controlClass}
          value={form.groupName}
          options={GROUP_OPTIONS}
          disabled={isEditing}
          onChange={(groupName) => {
            const nextSubGroups = getSubGroupOptions(groupName);
            const nextSubGroup = nextSubGroups[0]?.value ?? '';
            const nextTests = getTestOptions(nextSubGroup);
            onPatchForm({
              groupName,
              subGroupName: nextSubGroup,
              testName: nextTests[0]?.value ?? '',
            });
          }}
        />
      </FormField>

      <FormField label="Sub-Group Name">
        <Select
          id={fieldId('sub-group-name')}
          className={controlClass}
          value={form.subGroupName}
          options={subGroupOptions}
          disabled={isEditing}
          onChange={(subGroupName) => {
            const nextTests = getTestOptions(subGroupName);
            onPatchForm({
              subGroupName,
              testName: nextTests[0]?.value ?? '',
            });
          }}
        />
      </FormField>

      <FormField label="Test Name">
        <Select
          id={fieldId('test-name')}
          className={controlClass}
          value={form.testName}
          options={testOptions}
          disabled={isEditing}
          onChange={(testName) => onPatchForm({ testName })}
        />
      </FormField>

      <FormField label="Control Field Type">
        <Select
          id={fieldId('field-type')}
          className={controlClass}
          value={form.fieldType}
          options={FIELD_TYPE_OPTIONS}
          onChange={(fieldType) => onPatchForm({ fieldType })}
        />
      </FormField>

      <FormField label="Component Name" required error={componentNameError}>
        <Input
          ref={componentNameRef}
          id={fieldId('component-name')}
          className={controlClass}
          value={form.componentName}
          status={componentNameError ? 'error' : undefined}
          onChange={(event) => {
            onPatchForm({ componentName: event.target.value });
            if (componentNameError) {
              onClearError?.('componentName');
            }
          }}
          autoComplete="off"
        />
      </FormField>

      <FormField label="Unit">
        <Select
          id={fieldId('unit')}
          className={controlClass}
          value={form.unit || undefined}
          options={unitOptions}
          placeholder="Select unit"
          allowClear
          onChange={(unit) => onPatchForm({ unit: unit ?? '' })}
        />
      </FormField>

      <FormField label="Priority">
        <InputNumber
          id={fieldId('priority')}
          className={`${controlClass} pathology-component-priority-input`}
          value={form.priority}
          min={1}
          max={99}
          onChange={(priority) => onPatchForm({ priority: priority ?? 1 })}
        />
      </FormField>

      <FormField label="Tool Tip">
        <Input
          id={fieldId('tool-tip')}
          className={controlClass}
          value={form.toolTip}
          onChange={(event) => onPatchForm({ toolTip: event.target.value })}
          autoComplete="off"
        />
      </FormField>

      <FormField label="Reference Value for Report (Male)">
        <Input
          id={fieldId('reference-male')}
          className={controlClass}
          value={form.referenceMale}
          onChange={(event) => onPatchForm({ referenceMale: event.target.value })}
          autoComplete="off"
        />
      </FormField>

      <FormField label="Reference Value for Report (Female)">
        <Input
          id={fieldId('reference-female')}
          className={controlClass}
          value={form.referenceFemale}
          onChange={(event) => onPatchForm({ referenceFemale: event.target.value })}
          autoComplete="off"
        />
      </FormField>

      <FormField label="New Unit">
        <div className="pathology-component-new-unit">
          <Input
            id={fieldId('new-unit')}
            className={controlClass}
            value={form.newUnit}
            onChange={(event) => onPatchForm({ newUnit: event.target.value })}
            autoComplete="off"
          />
          <Button   type="link" onClick={onAddUnit}>
            Add New Unit
          </Button>
        </div>
      </FormField>
    </FormGrid>
  );
}
