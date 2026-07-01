'use client';

import { useMemo } from 'react';
import { Input, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  useGetHospitalsQuery,
  useGetDeptTypesQuery,
} from '@/features/human-resource/api/employeeApi';

const controlClass = FIELD_CONTROL_CLASS;

export default function DepartmentForm({ form, errors = {}, onPatchForm, onClearError }) {
  const fieldId = (name) => `department-${name}`;

  const { data: hospitals = [], isLoading: hospitalsLoading } = useGetHospitalsQuery();
  const { data: deptTypes = [] } = useGetDeptTypesQuery();

  const hospitalOptions = hospitals.map((h) => ({ value: h.id, label: h.name }));

  // Dept type options filtered by selected hospital
  const deptTypeOptions = useMemo(() => {
    if (!form.hospitalId) return [];
    return deptTypes
      .filter((d) => d.hospitalId === form.hospitalId)
      .map((d) => ({ value: d.id, label: d.departmentType }));
  }, [deptTypes, form.hospitalId]);

  return (
    <FormGrid columns={2} className="department-form-grid">

      <FormField
        label="Department ID"
        required
        error={errors?.departmentId}
      >
        <Input
          id={fieldId('departmentId')}
          className={controlClass}
          type="number"
          min="1"
          value={form.departmentId}
          status={errors?.departmentId ? 'error' : ''}
          onChange={(e) => {
            onPatchForm({ departmentId: e.target.value });
            onClearError?.('departmentId');
          }}
          autoComplete="off"
        />
      </FormField>

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
          showSearch
          optionFilterProp="label"
          placeholder="Select hospital"
          status={errors?.hospitalId ? 'error' : ''}
          onChange={(val, opt) => {
            onPatchForm({ hospitalId: val, hospitalName: opt?.label ?? '', deptTypeId: null, departmentType: '' });
            onClearError?.('hospitalId');
          }}
        />
      </FormField>

      <FormField
        label="Department Type"
        required
        error={errors?.deptTypeId}
      >
        <Select
          id={fieldId('deptTypeId')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.deptTypeId}
          options={deptTypeOptions}
          disabled={!form.hospitalId}
          showSearch
          optionFilterProp="label"
          placeholder={form.hospitalId ? 'Select department type' : 'Select hospital first'}
          status={errors?.deptTypeId ? 'error' : ''}
          onChange={(val, opt) => {
            onPatchForm({ deptTypeId: val, departmentType: opt?.label ?? '' });
            onClearError?.('deptTypeId');
          }}
        />
      </FormField>

      <FormField
        label="Department Name"
        required
        error={errors?.departmentName}
      >
        <Input
          id={fieldId('departmentName')}
          className={controlClass}
          value={form.departmentName}
          status={errors?.departmentName ? 'error' : ''}
          onChange={(e) => {
            onPatchForm({ departmentName: e.target.value });
            onClearError?.('departmentName');
          }}
          autoComplete="off"
        />
      </FormField>

      <FormField
        label="Phone"
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
        label="Location"
        className="department-form-field-full"
        help={errors?.location}
        validateStatus={errors?.location ? 'error' : ''}
      >
        <Input
          id={fieldId('location')}
          className={controlClass}
          value={form.location}
          onChange={(e) => {
            onPatchForm({ location: e.target.value });
            onClearError?.('location');
          }}
          autoComplete="off"
        />
      </FormField>

    </FormGrid>
  );
}