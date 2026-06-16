'use client';

import { useEffect, useRef } from 'react';
import { Button, Input, InputNumber, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  GROUP_OPTIONS,
} from '@/features/admin-pathology/api/mock-main-group';

const controlClass = FIELD_CONTROL_CLASS;

export default function MainGroupForm({
  form,
  onPatchForm,
}) {
  const componentNameRef = useRef(null);
  const fieldId = (name) => `main-group-${name}`;



  return (
    <FormGrid columns={2} className="main-group-form-grid">
      <FormField label="Group Name">
        <Select
          id={fieldId('group-name')}
          className={controlClass}
          value={form.groupName}
          options={GROUP_OPTIONS}
          onChange={(groupName) => onPatchForm({ groupName })}
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
