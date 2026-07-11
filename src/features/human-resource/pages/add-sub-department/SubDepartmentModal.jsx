'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  useGetHospitalsQuery,
  useGetDeptTypesQuery,
  useGetDepartmentsQuery,
  useGetSubDeptTypesQuery,
} from '@/features/human-resource/api/employeeApi';
import {
  SUB_DEPARTMENT_INITIAL_VALUES,
  getSubDepartmentFields,
} from '@/features/human-resource/pages/add-sub-department/sub-department-fields';

export default function SubDepartmentModal({
  open,
  onClose,
  title = 'Add Sub Department',
  form,
  onSave,
}) {
  const { data: hospitals = [], isLoading: hospitalsLoading } = useGetHospitalsQuery();
  const { data: deptTypes = [] } = useGetDeptTypesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: subDeptTypes = [] } = useGetSubDeptTypesQuery();

  const hospitalId = Form.useWatch('hospitalId', form);
  const deptTypeId = Form.useWatch('deptTypeId', form);
  const departmentId = Form.useWatch('departmentId', form);

  const hospitalOptions = useMemo(
    () => hospitals.map((h) => ({ value: h.id, label: h.name })),
    [hospitals],
  );

  const deptTypeOptions = useMemo(() => {
    if (!hospitalId) return [];
    return deptTypes
      .filter((d) => d.hospitalId === hospitalId)
      .map((d) => ({ value: d.id, label: d.departmentType }));
  }, [deptTypes, hospitalId]);

  const departmentOptions = useMemo(() => {
    if (!deptTypeId) return [];
    return departments
      .filter((d) => d.deptTypeId === deptTypeId)
      .map((d) => ({ value: d.id, label: d.departmentName }));
  }, [departments, deptTypeId]);

  const subDeptTypeOptions = useMemo(() => {
    if (!departmentId) return [];
    return subDeptTypes
      .filter((s) => s.departmentId === departmentId)
      .map((s) => ({ value: s.id, label: s.subDepartmentType }));
  }, [subDeptTypes, departmentId]);

  const fields = useMemo(
    () =>
      getSubDepartmentFields({
        hospitalOptions,
        hospitalsLoading,
        deptTypeOptions,
        departmentOptions,
        subDeptTypeOptions,
        hospitalId,
        deptTypeId,
        departmentId,
      }),
    [
      hospitalOptions,
      hospitalsLoading,
      deptTypeOptions,
      departmentOptions,
      subDeptTypeOptions,
      hospitalId,
      deptTypeId,
      departmentId,
    ],
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={600}
      className="sub-department-modal"
      rootClassName="sub-department-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="sub-department-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark
        preserve={false}
        initialValues={SUB_DEPARTMENT_INITIAL_VALUES}
        onValuesChange={(changed) => {
          if ('hospitalId' in changed) {
            form.setFieldsValue({
              deptTypeId: null,
              departmentId: null,
              subDeptTypeId: null,
            });
          } else if ('deptTypeId' in changed) {
            form.setFieldsValue({ departmentId: null, subDeptTypeId: null });
          } else if ('departmentId' in changed) {
            form.setFieldsValue({ subDeptTypeId: null });
          }
        }}
      >
        <DynamicForm fields={fields} className="sub-department-form-grid" />
      </Form>
    </AppModal>
  );
}
