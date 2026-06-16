'use client';

import { useRef } from 'react';
import {Input, InputNumber, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  GROUP_OPTIONS,
  getSubGroupOptions
} from '@/features/admin-pathology/api/mock-test-name';

const controlClass = FIELD_CONTROL_CLASS;

export default function SubGroupForm({
form, errors = {}, onPatchForm, onClearError
}) {
  const componentNameRef = useRef(null);
  const fieldId = (name) => `test-name-${name}`;
  const subGroupOptions = getSubGroupOptions(form.groupName);



  return (
    <FormGrid columns={2} className="pathology-component-form-grid">
      <FormField label="Group Name">
        <Select
          id={fieldId('group-name')}
          className={controlClass}
          value={form.groupName}
          options={GROUP_OPTIONS}
          onChange={(groupName) => {
            const nextSubGroups = getSubGroupOptions(groupName);
            const nextSubGroup = nextSubGroups[0]?.value ?? '';
            onPatchForm({
              groupName,
              subGroupName: nextSubGroup,
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
          onChange={(subGroupName) => {
            onPatchForm({
              subGroupName,
            });
          }}
        />
      </FormField>

      <FormField 
  label="Test Name" 
  required
  help={errors?.testName}
  validateStatus={errors?.testName ? 'error' : ''}
>
        <Input
          id={fieldId('test-name')}
          className={controlClass}
          status={errors?.testName ? 'error' : ''}
          value={form.testName}
          onChange={(e) => onPatchForm({ testName: e.target.value })}
        />
      </FormField>
      <FormField 
  label="Medical Name" 
>
        <Input
          id={fieldId('medical-name')}
          className={controlClass}
          status={errors?.medicalName ? 'error' : ''}
          value={form.medicalName}
          onChange={(e) => onPatchForm({ medicalName: e.target.value })}
        />
      </FormField>
      <FormField 
  label="Standard Name" 
>
        <Input
          id={fieldId('standard-name')}
          className={controlClass}
          status={errors?.standardName ? 'error' : ''}
          value={form.standardName}
          onChange={(e) => onPatchForm({ standardName: e.target.value })}
        />
      </FormField>

      <FormField label="Fee">
        <InputNumber
          id={fieldId('fee')}
          className={`${controlClass} test-name-fee-input`}
          value={form.fee}
          min={0}
          onChange={(fee) => onPatchForm({ fee: fee ?? 0 })}
        />
      </FormField>
    </FormGrid>
  );
}
