'use client';

import { Input, InputNumber } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function DesignationForm({ form, errors = {}, onPatchForm, onClearError }) {
  const fieldId = (name) => `designation-${name}`;

  return (
    <FormGrid columns={1} className="designation-form-grid">

      <FormField
        label="Designation"
        required
        help={errors?.designation}
        validateStatus={errors?.designation ? 'error' : ''}
      >
        <Input
          id={fieldId('designation')}
          className={controlClass}
          value={form.designation}
          onChange={(e) => {
            onPatchForm({ designation: e.target.value });
            onClearError?.('designation');
          }}
          autoComplete="off"
        />
      </FormField>

      <FormField
        label="Minimum Pay Scale"
        required
        help={errors?.minPayScale}
        validateStatus={errors?.minPayScale ? 'error' : ''}
      >
        <InputNumber
          id={fieldId('minPayScale')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.minPayScale}
          min={0}
          precision={0}
          formatter={(val) => (val ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
          parser={(val) => val?.replace(/,/g, '') ?? ''}
          onChange={(val) => {
            onPatchForm({ minPayScale: val });
            onClearError?.('minPayScale');
          }}
        />
      </FormField>

    </FormGrid>
  );
}