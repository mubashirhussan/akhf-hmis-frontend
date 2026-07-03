'use client';

import { Input, InputNumber, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function CompanyForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
  companyTypeOptions,
  statusOptions,
}) {
  const fieldId = (name) => `company-${name}`;

  return (
    <FormGrid columns={2} className="company-form-grid">
      <FormField label="Company Type" required error={errors?.companyType}>
        <Select
          id={fieldId('type')}
          className={controlClass}
          status={errors?.companyType ? 'error' : ''}
          value={form.companyType || undefined}
          options={companyTypeOptions}
          onChange={(companyType) => {
            onPatchForm({ companyType });
            onClearError?.('companyType');
          }}
        />
      </FormField>

      <FormField label="Company / Party Name" required error={errors?.companyName}>
        <Input
          id={fieldId('name')}
          className={controlClass}
          value={form.companyName}
          onChange={(e) => {
            onPatchForm({ companyName: e.target.value });
            onClearError?.('companyName');
          }}
        />
      </FormField>

      <FormField label="NTN #">
        <InputNumber
          id={fieldId('ntn')}
          className={controlClass}
          value={form.ntn}
          onChange={(ntn) => onPatchForm({ ntn })}
          style={{ width: '100%' }}
        />
      </FormField>

      <FormField label="City" required error={errors?.city}>
        <Input
          id={fieldId('city')}
          className={controlClass}
          value={form.city}
          onChange={(e) => {
            onPatchForm({ city: e.target.value });
            onClearError?.('city');
          }}
        />
      </FormField>

      <FormField label="Address">
        <Input.TextArea
          id={fieldId('address')}
          className={controlClass}
          value={form.address}
          rows={3}
          onChange={(e) => onPatchForm({ address: e.target.value })}
        />
      </FormField>

      <FormField label="Contact Person Name">
        <Input
          id={fieldId('contact-person-name')}
          className={controlClass}
          value={form.contactPersonName}
          onChange={(e) => onPatchForm({ contactPersonName: e.target.value })}
        />
      </FormField>

      <FormField label="CNIC">
        <Input
          id={fieldId('cnic')}
          className={controlClass}
          value={form.cnic}
          onChange={(e) => onPatchForm({ cnic: e.target.value })}
        />
      </FormField>

      <FormField label="Phone">
        <Input
          id={fieldId('phone')}
          className={controlClass}
          value={form.phone}
          onChange={(e) => onPatchForm({ phone: e.target.value })}
        />
      </FormField>

      <FormField label="Fax">
        <InputNumber
          id={fieldId('fax')}
          className={controlClass}
          value={form.fax}
          onChange={(fax) => onPatchForm({ fax })}
          style={{ width: '100%' }}
        />
      </FormField>

      <FormField label="Email" required error={errors?.email}>
        <Input
          id={fieldId('email')}
          className={controlClass}
          type="email"
          value={form.email}
          onChange={(e) => {
            onPatchForm({ email: e.target.value });
            onClearError?.('email');
          }}
        />
      </FormField>

      <FormField label="Website" required error={errors?.website}>
        <Input
          id={fieldId('website')}
          className={controlClass}
          type="url"
          value={form.website}
          onChange={(e) => {
            onPatchForm({ website: e.target.value });
            onClearError?.('website');
          }}
        />
      </FormField>

      <FormField label="STR #">
        <InputNumber
          id={fieldId('str')}
          className={controlClass}
          value={form.str}
          onChange={(str) => onPatchForm({ str })}
          style={{ width: '100%' }}
        />
      </FormField>

      <FormField label="Bank A/C No.">
        <Input
          id={fieldId('bank-account')}
          className={controlClass}
          value={form.bankAccount}
          onChange={(e) => onPatchForm({ bankAccount: e.target.value })}
        />
      </FormField>

      <FormField label="Status" required error={errors?.status}>
        <Select
          id={fieldId('status')}
          className={controlClass}
          status={errors?.status ? 'error' : ''}
          value={form.status || undefined}
          options={statusOptions}
          onChange={(status) => {
            onPatchForm({ status });
            onClearError?.('status');
          }}
        />
      </FormField>
    </FormGrid>
  );
}
