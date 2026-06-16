'use client';

import { useRef } from 'react';
import {Input, InputNumber, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  GROUP_OPTIONS,
} from '@/features/admin-pathology/api/mock-sub-group';

const controlClass = FIELD_CONTROL_CLASS;

export default function SubGroupForm({
form, errors = {}, onPatchForm, onClearError
}) {
  const componentNameRef = useRef(null);
  const fieldId = (name) => `sub-group-${name}`;



  return (
    <FormGrid columns={2} className="sub-group-form-grid">
      <FormField label="Group Name">
        <Select
          id={fieldId('group-name')}
          className={controlClass}
          value={form.groupName}
          options={GROUP_OPTIONS}
          onChange={(groupName) => onPatchForm({ groupName })}
        />
      </FormField>

      <FormField 
  label="Sub Group Name" 
  required
  help={errors?.subGroupName}
  validateStatus={errors?.subGroupName ? 'error' : ''}
>
        <Input
          id={fieldId('sub-group-name')}
          className={controlClass}
          status={errors?.subGroupName ? 'error' : ''}
          value={form.subGroupName}
          onChange={(e) => onPatchForm({ subGroupName: e.target.value })}
        />
      </FormField>

      <FormField label="Fee">
        <InputNumber
          id={fieldId('fee')}
          className={`${controlClass} sub-group-fee-input`}
          value={form.fee}
          min={0}
          onChange={(fee) => onPatchForm({ fee: fee ?? 0 })}
        />
      </FormField>



    </FormGrid>
  );
}
