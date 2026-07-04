'use client';

import { Input, InputNumber, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  WARD_OPTIONS,
  PACKAGE_SERVICE_HEAD_OPTIONS,
} from '@/features/service-admin/api/mock-service-admin';

const controlClass = FIELD_CONTROL_CLASS;

export default function NewPackageForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
  departmentOptions = [],
  serviceOptions = [],
  serviceCategoryOptions = [],
  serviceChargesMap = {},
}) {
  const fieldId = (name) => `new-package-${name}`;

  const servicesTotal = (form.services ?? []).reduce(
    (sum, svc) => sum + (serviceChargesMap[svc] ?? 0),
    0,
  );

  return (
    <FormGrid columns={2} className="new-package-form-grid">
      <FormField label="Ward" error={errors?.ward}>
        <Select
          id={fieldId('ward')}
          className={controlClass}
          status={errors?.ward ? 'error' : ''}
          value={form.ward || undefined}
          options={WARD_OPTIONS}
          onChange={(ward) => {
            onPatchForm({ ward });
            onClearError?.('ward');
          }}
        />
      </FormField>

      <FormField label="Department" error={errors?.department}>
        <Select
          id={fieldId('department')}
          className={controlClass}
          status={errors?.department ? 'error' : ''}
          value={form.department || undefined}
          options={departmentOptions}
          showSearch
          optionFilterProp="label"
          onChange={(department) => {
            onPatchForm({ department });
            onClearError?.('department');
          }}
        />
      </FormField>

      <FormField label="Package Name" required error={errors?.packageName}>
        <Input
          id={fieldId('package-name')}
          className={controlClass}
          status={errors?.packageName ? 'error' : ''}
          value={form.packageName}
          onChange={(e) => {
            onPatchForm({ packageName: e.target.value });
            onClearError?.('packageName');
          }}
        />
      </FormField>

      <FormField label="Doctor Share" error={errors?.doctorShare}>
        <InputNumber
          id={fieldId('doctor-share')}
          className={controlClass}
          status={errors?.doctorShare ? 'error' : ''}
          value={form.doctorShare}
          min={0}
          onChange={(doctorShare) => {
            onPatchForm({ doctorShare: doctorShare ?? null });
            onClearError?.('doctorShare');
          }}
        />
      </FormField>

      <FormField label="Service Head" error={errors?.serviceHead}>
        <Select
          id={fieldId('service-head')}
          className={controlClass}
          status={errors?.serviceHead ? 'error' : ''}
          value={form.serviceHead || undefined}
          options={PACKAGE_SERVICE_HEAD_OPTIONS}
          showSearch
          optionFilterProp="label"
          onChange={(serviceHead) => {
            onPatchForm({ serviceHead });
            onClearError?.('serviceHead');
          }}
        />
      </FormField>

      <FormField label="Description" error={errors?.description}>
        <Input.TextArea
          id={fieldId('description')}
          className={controlClass}
          status={errors?.description ? 'error' : ''}
          value={form.description}
          rows={2}
          onChange={(e) => {
            onPatchForm({ description: e.target.value });
            onClearError?.('description');
          }}
        />
      </FormField>

      <FormField label="Service Category" error={errors?.serviceCategory}>
        <Select
          id={fieldId('service-category')}
          className={controlClass}
          status={errors?.serviceCategory ? 'error' : ''}
          value={form.serviceCategory || undefined}
          options={serviceCategoryOptions}
          showSearch
          optionFilterProp="label"
          onChange={(serviceCategory) => {
            onPatchForm({ serviceCategory, services: [] });
            onClearError?.('serviceCategory');
          }}
          disabled={!serviceCategoryOptions.length}
        />
      </FormField>

      <FormField label="Services" error={errors?.services}>
        <Select
          id={fieldId('services')}
          className={controlClass}
          status={errors?.services ? 'error' : ''}
          mode="multiple"
          value={form.services}
          options={serviceOptions}
          disabled={!form.serviceCategory}
          showSearch
          optionFilterProp="label"
          maxTagCount="responsive"
          onChange={(services) => {
            onPatchForm({ services });
            onClearError?.('services');
          }}
        />
      </FormField>

      <FormField label="Total Amount">
        <InputNumber
          id={fieldId('services-total')}
          className={controlClass}
          value={servicesTotal}
          disabled
        />
      </FormField>

      <FormField label="Package Amount" error={errors?.totalAmount}>
        <InputNumber
          id={fieldId('package-amount')}
          className={controlClass}
          status={errors?.totalAmount ? 'error' : ''}
          value={form.totalAmount}
          min={0}
          onChange={(totalAmount) => {
            onPatchForm({ totalAmount: totalAmount ?? null });
            onClearError?.('totalAmount');
          }}
        />
      </FormField>
    </FormGrid>
  );
}