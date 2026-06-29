'use client';

import { Input, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { useGetHospitalsQuery } from '@/features/human-resource/api/employeeApi';

const controlClass = FIELD_CONTROL_CLASS;

export default function DeptTypeForm({ form, errors = {}, onPatchForm, onClearError, isEdit = false }) {
  const fieldId = (name) => `dept-type-${name}`;

  const { data: hospitals = [], isLoading: hospitalsLoading } = useGetHospitalsQuery();

  const hospitalOptions = hospitals.map((h) => ({ value: h.id, label: h.name }));

  return (
    <FormGrid columns={1} className="dept-type-form-grid">

      <FormField
        label="Hospital Name"
        required
        help={errors?.hospitalId}
        validateStatus={errors?.hospitalId ? 'error' : ''}
      >
        <Select
          id={fieldId('hospitalId')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.hospitalId}
          options={hospitalOptions}
          loading={hospitalsLoading}
          disabled={isEdit}
          placeholder="Select hospital"
          onChange={(val, opt) => {
            onPatchForm({ hospitalId: val, hospitalName: opt?.label ?? '' });
            onClearError?.('hospitalId');
          }}
        />
      </FormField>

      <FormField
        label="Department Type"
        required
        help={errors?.departmentType}
        validateStatus={errors?.departmentType ? 'error' : ''}
      >
        <Input
          id={fieldId('departmentType')}
          className={controlClass}
          value={form.departmentType}
          onChange={(e) => {
            onPatchForm({ departmentType: e.target.value });
            onClearError?.('departmentType');
          }}
          autoComplete="off"
        />
      </FormField>

      {isEdit && (
        <FormField
          label="Status"
          required
          help={errors?.status}
          validateStatus={errors?.status ? 'error' : ''}
        >
          <Select
            id={fieldId('status')}
            className={controlClass}
            style={{ width: '100%' }}
            value={form.status}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'disactive', label: 'Disactive' },
            ]}
            onChange={(val) => {
              onPatchForm({ status: val });
              onClearError?.('status');
            }}
          />
        </FormField>
      )}

    </FormGrid>
  );
}