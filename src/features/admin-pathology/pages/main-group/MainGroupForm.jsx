'use client';

import {useRef } from 'react';
import { Input, InputNumber } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';


const controlClass = FIELD_CONTROL_CLASS;

export default function MainGroupForm({
  form, errors = {}, onPatchForm, onClearError
}) {
  const componentNameRef = useRef(null);
  const fieldId = (name) => `main-group-${name}`;



  return (
    <FormGrid columns={2} className="main-group-form-grid">
<FormField label="Group Name"
  required
  help={errors?.groupName}
  validateStatus={errors?.groupName ? 'error' : ''}
>
  <Input
    id={fieldId('group-name')}
    className={controlClass}
    value={form.groupName}
    onChange={(e) => onPatchForm({ groupName: e.target.value })}
  />
</FormField>


      <FormField label="Fee">
        <InputNumber
          id={fieldId('fee')}
          className={`${controlClass} main-group-fee-input`}
          value={form.fee}
          min={0}
          onChange={(fee) => onPatchForm({ fee: fee ?? 0 })}
        />
      </FormField>


    </FormGrid>
  );
}
