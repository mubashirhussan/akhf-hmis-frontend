'use client';

import { Input, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function HospitalForm({ form, errors = {}, onPatchForm, onClearError, isEdit = false }) {
  const fieldId = (name) => `hospital-${name}`;

  return (
    <FormGrid columns={2} className="hospital-form-grid">
      <FormField
        label="Hospital Name"
        required
        error={errors?.name}
      >
        <Input
          id={fieldId('name')}
          className={controlClass}
          value={form.name}
          status={errors?.name ? 'error' : ''}
          onChange={(e) => {
            onPatchForm({ name: e.target.value });
            onClearError?.('name');
          }}
          autoComplete="off"
        />
      </FormField>

      <FormField
        label="Abbreviation"
        help={errors?.abbreviation}
        validateStatus={errors?.abbreviation ? 'error' : ''}
      >
        <Input
          id={fieldId('abbreviation')}
          className={controlClass}
          value={form.abbreviation}
          onChange={(e) => {
            onPatchForm({ abbreviation: e.target.value });
            onClearError?.('abbreviation');
          }}
          autoComplete="off"
        />
      </FormField>

      <FormField
        label="City"
        required
        error={errors?.city}
       
      >
<Input
    id={fieldId('city')}
    className={controlClass}
    value={form.city}
    placeholder="Enter city"
    status={errors?.city ? 'error' : ''}
    onChange={(e) => {
        onPatchForm({ city: e.target.value });
        onClearError?.('city');
    }}
/>
      </FormField>

     

      <FormField
        label="Phone #"
        help={errors?.phone}
        validateStatus={errors?.phone ? 'error' : ''}
      >
        <Input
          id={fieldId('phone')}
          className={controlClass}
          value={form.phone}
          onChange={(e) => {
            onPatchForm({ phone: e.target.value });
            onClearError?.('phone');
          }}
          autoComplete="off"
        />
      </FormField>

      <FormField
        label="Fax #"
        help={errors?.fax}
        validateStatus={errors?.fax ? 'error' : ''}
      >
        <Input
          id={fieldId('fax')}
          className={controlClass}
          value={form.fax}
          onChange={(e) => {
            onPatchForm({ fax: e.target.value });
            onClearError?.('fax');
          }}
          autoComplete="off"
        />
      </FormField>

      <FormField
        label="Logo Image"
      
        help={errors?.logo}
        validateStatus={errors?.logo ? 'error' : ''}
      >
        <div className="hospital-logo-picker">
          {form.logo && (
            <img
              src={form.logo}
              alt="Hospital logo preview"
              className="hospital-logo-preview"
            />
          )}
          <Input
            id={fieldId('logo')}
            type="file"
            accept="image/*"
            className={`${controlClass} hospital-logo-input`}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (evt) => {
                onPatchForm({ logo: evt.target.result });
                onClearError?.('logo');
              };
              reader.readAsDataURL(file);
            }}
          />
        </div>
      </FormField>
       <FormField
        label="Address"
      className="hospital-form-field-full"
        help={errors?.address}
        validateStatus={errors?.address ? 'error' : ''}
      >
        <Input.TextArea
          id={fieldId('address')}
          className={controlClass}
          rows={3}
          value={form.address}
          onChange={(e) => {
            onPatchForm({ address: e.target.value });
            onClearError?.('address');
          }}
        />
      </FormField>
    </FormGrid>
  );
}