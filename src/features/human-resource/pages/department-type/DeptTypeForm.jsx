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
        error={errors?.hospitalId}
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
          status={errors?.hospitalId ? 'error' : ''}
          onChange={(val, opt) => {
            onPatchForm({ hospitalId: val, hospitalName: opt?.label ?? '' });
            onClearError?.('hospitalId');
          }}
        />
      </FormField>

      <FormField
        label="Department Type"
        required
        error={errors?.departmentType}
      >
        <Input
          id={fieldId('departmentType')}
          className={controlClass}
          value={form.departmentType}
          status={errors?.departmentType ? 'error' : ''}
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
          error={errors?.status}
        >
          <Select
            id={fieldId('status')}
            className={controlClass}
            style={{ width: '100%' }}
            value={form.status}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'inactive' },
            ]}
            status={errors?.status ? 'error' : ''}
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