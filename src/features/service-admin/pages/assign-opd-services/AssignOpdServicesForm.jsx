'use client';

import { InputNumber, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';


const controlClass = FIELD_CONTROL_CLASS;

export default function AssignOpdServicesForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
  hospitalOptions = [],
  patientTypeOptions = [],
  serviceCategoryOptions = [],
  serviceOptions = [],
  subDepartmentOptions = [],
}) {
  const fieldId = (name) => `assign-opd-services-${name}`;

  return (
    <FormGrid columns={1} className="assign-opd-services-form-grid">
      <FormField label="Hospital" required error={errors?.hospital}>
        <Select
          id={fieldId('hospital')}
          className={controlClass}
          status={errors?.hospital ? 'error' : ''}
          value={form.hospital || undefined}
          options={hospitalOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select Hospital"
          onChange={(val) => {
            onPatchForm({ hospital: val });
            onClearError?.('hospital');
          }}
        />
      </FormField>

      <FormField label="Patient Type" required error={errors?.patientType}>
        <Select
          id={fieldId('patient-type')}
          className={controlClass}
          status={errors?.patientType ? 'error' : ''}
          value={form.patientType || undefined}
          options={patientTypeOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select Patient Type"
          onChange={(val) => {
            onPatchForm({ patientType: val });
            onClearError?.('patientType');
          }}
        />
      </FormField>

      <FormField label="Service Category" required error={errors?.serviceCategory}>
        <Select
          id={fieldId('service-category')}
          className={controlClass}
          status={errors?.serviceCategory ? 'error' : ''}
          value={form.serviceCategory || undefined}
          options={serviceCategoryOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select Service Category"
          onChange={(val) => {
            onPatchForm({ serviceCategory: val, service: '' });
            onClearError?.('serviceCategory');
            onClearError?.('service');
          }}
        />
      </FormField>

      <FormField label="Service" required error={errors?.service}>
        <Select
          id={fieldId('service')}
          className={controlClass}
          status={errors?.service ? 'error' : ''}
          value={form.service || undefined}
          options={serviceOptions}
          showSearch
          optionFilterProp="label"
          placeholder={form.serviceCategory ? 'Select Service' : 'Select a category first'}
          disabled={!form.serviceCategory}
          onChange={(val) => {
            onPatchForm({ service: val });
            onClearError?.('service');
          }}
        />
      </FormField>

      <FormField label="Sub Department" required error={errors?.subDepartment}>
        <Select
          id={fieldId('sub-department')}
          className={controlClass}
          status={errors?.subDepartment ? 'error' : ''}
          value={form.subDepartment || undefined}
          options={subDepartmentOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select Sub Department"
          onChange={(val) => {
            onPatchForm({ subDepartment: val });
            onClearError?.('subDepartment');
          }}
        />
      </FormField>

      <FormField label="Amount" required error={errors?.amount}>
        <InputNumber
          id={fieldId('amount')}
          className={controlClass}
          status={errors?.amount ? 'error' : ''}
          value={form.amount}
          min={0}
          placeholder="Enter Amount"
          onChange={(val) => {
            onPatchForm({ amount: val ?? null });
            onClearError?.('amount');
          }}
        />
      </FormField>
    </FormGrid>
  );
}