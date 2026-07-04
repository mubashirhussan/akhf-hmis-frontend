'use client';

import { Input, InputNumber, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function WardBedsForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
  hospitalOptions = [],
  departmentOptions = [],
  subDepartmentOptions = [],
}) {
  const fieldId = (name) => `ward-beds-${name}`;

  return (
    <FormGrid columns={1} className="ward-beds-form-grid">
      <FormField label="Hospital" required error={errors?.hospitalId}>
        <Select
          id={fieldId('hospital')}
          className={controlClass}
          status={errors?.hospitalId ? 'error' : ''}
          value={form.hospitalId || undefined}
          options={hospitalOptions}
          showSearch
          optionFilterProp="label"
          placeholder="Select Hospital"
          onChange={(val) => {
            onPatchForm({ hospitalId: val, departmentId: '', subDepartmentId: '' });
            onClearError?.('hospitalId');
            onClearError?.('departmentId');
            onClearError?.('subDepartmentId');
          }}
        />
      </FormField>

      <FormField label="Department" required error={errors?.departmentId}>
        <Select
          id={fieldId('department')}
          className={controlClass}
          status={errors?.departmentId ? 'error' : ''}
          value={form.departmentId || undefined}
          options={departmentOptions}
          showSearch
          optionFilterProp="label"
          placeholder={form.hospitalId ? 'Select Department' : 'Select a hospital first'}
          disabled={!form.hospitalId}
          onChange={(val) => {
            onPatchForm({ departmentId: val, subDepartmentId: '' });
            onClearError?.('departmentId');
            onClearError?.('subDepartmentId');
          }}
        />
      </FormField>

      <FormField label="Sub Department" required error={errors?.subDepartmentId}>
        <Select
          id={fieldId('sub-department')}
          className={controlClass}
          status={errors?.subDepartmentId ? 'error' : ''}
          value={form.subDepartmentId || undefined}
          options={subDepartmentOptions}
          showSearch
          optionFilterProp="label"
          placeholder={form.departmentId ? 'Select Sub Department' : 'Select a department first'}
          disabled={!form.departmentId}
          onChange={(val) => {
            onPatchForm({ subDepartmentId: val });
            onClearError?.('subDepartmentId');
          }}
        />
      </FormField>

      <FormField label="Ward Name" required error={errors?.wardName}>
        <Input
          id={fieldId('ward-name')}
          className={controlClass}
          status={errors?.wardName ? 'error' : ''}
          value={form.wardName}
          placeholder="Enter Ward Name"
          onChange={(e) => {
            onPatchForm({ wardName: e.target.value });
            onClearError?.('wardName');
          }}
        />
      </FormField>

      <FormField label="Rooms" required error={errors?.rooms}>
        <InputNumber
          id={fieldId('rooms')}
          className={controlClass}
          status={errors?.rooms ? 'error' : ''}
          value={form.rooms}
          min={1}
          precision={0}
          placeholder="Number of rooms"
          onChange={(val) => {
            onPatchForm({ rooms: val ?? null });
            onClearError?.('rooms');
          }}
        />
      </FormField>

      <FormField label="Maximum Beds" required error={errors?.maxBeds}>
        <InputNumber
          id={fieldId('max-beds')}
          className={controlClass}
          status={errors?.maxBeds ? 'error' : ''}
          value={form.maxBeds}
          min={1}
          precision={0}
          placeholder="Max beds per room"
          onChange={(val) => {
            onPatchForm({ maxBeds: val ?? null });
            onClearError?.('maxBeds');
          }}
        />
      </FormField>
    </FormGrid>
  );
}