'use client';

import { useMemo } from 'react';
import { Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  useGetHospitalsQuery,
  useGetDeptTypesQuery,
  useGetDepartmentsQuery,
  useGetSubDeptTypesQuery,
} from '@/features/human-resource/api/employeeApi';

const controlClass = FIELD_CONTROL_CLASS;

export default function SubDepartmentForm({ form, errors = {}, onPatchForm, onClearError }) {
  const fieldId = (name) => `sub-department-${name}`;

  const { data: hospitals = [], isLoading: hospitalsLoading } = useGetHospitalsQuery();
  const { data: deptTypes = [] } = useGetDeptTypesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: subDeptTypes = [] } = useGetSubDeptTypesQuery();

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

  // Sub dept type options filtered by selected department
  const subDeptTypeOptions = useMemo(() => {
    if (!form.departmentId) return [];
    return subDeptTypes
      .filter((s) => s.departmentId === form.departmentId)
      .map((s) => ({ value: s.id, label: s.subDepartmentType }));
  }, [subDeptTypes, form.departmentId]);

  return (
    <FormGrid columns={1} className="sub-department-form-grid">

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
          showSearch
          optionFilterProp="label"
          placeholder="Select hospital"
          onChange={(val, opt) => {
            onPatchForm({
              hospitalId: val,
              hospitalName: opt?.label ?? '',
              deptTypeId: null,
              departmentType: '',
              departmentId: null,
              departmentName: '',
              subDeptTypeId: null,
              subDepartmentType: '',
            });
            onClearError?.('hospitalId');
          }}
        />
      </FormField>

      <FormField
        label="Department Type"
        required
        help={errors?.deptTypeId}
        validateStatus={errors?.deptTypeId ? 'error' : ''}
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
          onChange={(val, opt) => {
            onPatchForm({
              deptTypeId: val,
              departmentType: opt?.label ?? '',
              departmentId: null,
              departmentName: '',
              subDeptTypeId: null,
              subDepartmentType: '',
            });
            onClearError?.('deptTypeId');
          }}
        />
      </FormField>

      <FormField
        label="Department Name"
        required
        help={errors?.departmentId}
        validateStatus={errors?.departmentId ? 'error' : ''}
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
          onChange={(val, opt) => {
            onPatchForm({
              departmentId: val,
              departmentName: opt?.label ?? '',
              subDeptTypeId: null,
              subDepartmentType: '',
            });
            onClearError?.('departmentId');
          }}
        />
      </FormField>

      <FormField
        label="Sub Department Type"
        required
        help={errors?.subDeptTypeId}
        validateStatus={errors?.subDeptTypeId ? 'error' : ''}
      >
        <Select
          id={fieldId('subDeptTypeId')}
          className={controlClass}
          style={{ width: '100%' }}
          value={form.subDeptTypeId}
          options={subDeptTypeOptions}
          disabled={!form.departmentId}
          showSearch
          optionFilterProp="label"
          placeholder={form.departmentId ? 'Select sub department type' : 'Select department first'}
          onChange={(val, opt) => {
            onPatchForm({ subDeptTypeId: val, subDepartmentType: opt?.label ?? '' });
            onClearError?.('subDeptTypeId');
          }}
        />
      </FormField>

      <FormField
        label="Sub Department Name"
        required
        help={errors?.subDepartmentName}
        validateStatus={errors?.subDepartmentName ? 'error' : ''}
      >
        <Input
          id={fieldId('subDepartmentName')}
          className={controlClass}
          value={form.subDepartmentName}
          onChange={(e) => {
            onPatchForm({ subDepartmentName: e.target.value });
            onClearError?.('subDepartmentName');
          }}
          autoComplete="off"
        />
      </FormField>

      <FormField
        label="Cost Center"
        help={errors?.costCenter}
        validateStatus={errors?.costCenter ? 'error' : ''}
      >
        <Input
          id={fieldId('costCenter')}
          className={controlClass}
          value={form.costCenter}
          onChange={(e) => {
            onPatchForm({ costCenter: e.target.value });
            onClearError?.('costCenter');
          }}
          autoComplete="off"
        />
      </FormField>

      <FormField
        label="Location"
        help={errors?.location}
        validateStatus={errors?.location ? 'error' : ''}
      >
        <TextArea
          id={fieldId('location')}
          className={controlClass}
          value={form.location}
          rows={2}
          onChange={(e) => {
            onPatchForm({ location: e.target.value });
            onClearError?.('location');
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

    </FormGrid>
  );
}