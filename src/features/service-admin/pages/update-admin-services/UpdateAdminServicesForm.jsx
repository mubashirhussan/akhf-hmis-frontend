'use client';

import { Input, InputNumber, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { BOOLEAN_OPTIONS, SERVICE_HEAD_OPTIONS } from '@/features/service-admin/api/mock-service-admin';

const controlClass = FIELD_CONTROL_CLASS;

export default function UpdateAdminServicesForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
  serviceCategoryOptions = [],
}) {
  const fieldId = (name) => `update-admin-services-${name}`;

  return (
    <FormGrid columns={1} className="update-admin-services-form-grid">
      <FormField label="Service Category" required error={errors?.serviceCategory}>
        <Select
          id={fieldId('service-category')}
          className={controlClass}
          status={errors?.serviceCategory ? 'error' : ''}
          value={form.serviceCategory || undefined}
          options={serviceCategoryOptions}
          showSearch
          optionFilterProp="label"
          onChange={(serviceCategory) => {
            onPatchForm({ serviceCategory });
            onClearError?.('serviceCategory');
          }}
          disabled={!serviceCategoryOptions.length}
        />
      </FormField>

      <FormField label="Service Name" required error={errors?.serviceName}>
        <Input
          id={fieldId('service-name')}
          className={controlClass}
          status={errors?.serviceName ? 'error' : ''}
          value={form.serviceName}
          onChange={(e) => {
            onPatchForm({ serviceName: e.target.value });
            onClearError?.('serviceName');
          }}
        />
      </FormField>

      <FormField label="Current Amount">
        <InputNumber
          id={fieldId('current-amount')}
          className={`${controlClass} update-admin-services-charges-input`}
          value={form.serviceCharges}
          disabled
        />
      </FormField>

      <FormField label="Service Charges" required error={errors?.serviceCharges}>
        <InputNumber
          id={fieldId('service-charges')}
          className={`${controlClass} update-admin-services-charges-input`}
          status={errors?.serviceCharges ? 'error' : ''}
          value={form.serviceCharges}
          min={0}
          onChange={(serviceCharges) => {
            onPatchForm({ serviceCharges: serviceCharges ?? 0 });
            onClearError?.('serviceCharges');
          }}
        />
      </FormField>

      <FormField label="Service Charges Before">
        <Select
          id={fieldId('service-charges-before')}
          className={controlClass}
          value={form.serviceChargesBefore}
          options={BOOLEAN_OPTIONS}
          onChange={(serviceChargesBefore) => onPatchForm({ serviceChargesBefore })}
        />
      </FormField>

      <FormField label="Service Edit Price">
        <Select
          id={fieldId('service-edit-price')}
          className={controlClass}
          value={form.serviceEditPrice}
          options={BOOLEAN_OPTIONS}
          onChange={(serviceEditPrice) => onPatchForm({ serviceEditPrice })}
        />
      </FormField>

      <FormField label="Service Head" required error={errors?.serviceHead}>
        <Select
          id={fieldId('service-head')}
          className={controlClass}
          status={errors?.serviceHead ? 'error' : ''}
          value={form.serviceHead || undefined}
          options={SERVICE_HEAD_OPTIONS}
          showSearch
          optionFilterProp="label"
          onChange={(serviceHead) => {
            onPatchForm({ serviceHead });
            onClearError?.('serviceHead');
          }}
        />
      </FormField>
    </FormGrid>
  );
}