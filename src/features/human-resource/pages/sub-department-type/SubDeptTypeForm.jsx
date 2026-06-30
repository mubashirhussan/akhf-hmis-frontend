'use client';

import { useMemo } from 'react';
import { Input, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  useGetHospitalsQuery,
  useGetDeptTypesQuery,
  useGetDepartmentsQuery,
} from '@/features/human-resource/api/employeeApi';

const controlClass = FIELD_CONTROL_CLASS;

export default function SubDeptTypeForm({ form, errors = {}, onPatchForm, onClearError }) {
  const fieldId = (name) => `sub-dept-type-${name}`;

  const { data: hospitals = [], isLoading: hospitalsLoading } = useGetHospitalsQuery();
  const { data: deptTypes = [] } = useGetDeptTypesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();

  const hospitalOptions = hospitals.map((h) => ({ value: h.id, label: h.name }));

  // Dept type options filtered by selected hospital
  const deptTypeOptions = useMemo(() => {
    if (!form.hospitalId) return [];
    return deptTypes
      .filter((d) => d.hospitalId === form.hospitalId)
      .map((d) => ({ value: d.id, label: d.departmentType }));
  }, [deptTypes, form.hospitalId]);

  // Department options filtered by selected dept type
  const departmentOptions = useMemo(() => {
    if (!form.deptTypeId) return [];
    return departments
      .filter((d) => d.deptTypeId === form.deptTypeId)
      .map((d) => ({ value: d.id, label: d.departmentName }));
  }, [departments, form.deptTypeId]);

  return (
    <FormGrid columns={1} className="sub-dept-type-form-grid">

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
            onPatchForm({ hospitalId: val, hospitalName: opt?.label ?? '', deptTypeId: null, departmentType: '', departmentId: null, departmentName: '' });
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
            onPatchForm({ deptTypeId: val, departmentType: opt?.label ?? '', departmentId: null, departmentName: '' });
            onClearError?.('deptTypeId');
          }}
        />
      </FormField>

      <FormField
        label="Department Name"
        required
        error={errors?.departmentId}
      >
        <Select
          id={fieldId('departmentId')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.departmentId}
          options={departmentOptions}
          disabled={!form.deptTypeId}
          showSearch
          optionFilterProp="label"
          placeholder={form.deptTypeId ? 'Select department' : 'Select department type first'}
          status={errors?.departmentId ? 'error' : ''}
          onChange={(val, opt) => {
            onPatchForm({ departmentId: val, departmentName: opt?.label ?? '' });
            onClearError?.('departmentId');
          }}
        />
      </FormField>

      <FormField
        label="Sub Department Type"
        required
        help={errors?.subDepartmentType}
        validateStatus={errors?.subDepartmentType ? 'error' : ''}
      >
        <Input
          id={fieldId('subDepartmentType')}
          className={controlClass}
          value={form.subDepartmentType}
          status={errors?.subDepartmentType ? 'error' : ''}
          onChange={(e) => {
            onPatchForm({ subDepartmentType: e.target.value });
            onClearError?.('subDepartmentType');
          }}
          autoComplete="off"
        />
      </FormField>

    </FormGrid>
  );
}