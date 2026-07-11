'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  useGetHospitalsQuery,
  useGetDeptTypesQuery,
  useGetDepartmentsQuery,
} from '@/features/human-resource/api/employeeApi';
import {
  SUB_DEPT_TYPE_INITIAL_VALUES,
  getSubDeptTypeFields,
} from '@/features/human-resource/pages/sub-department-type/sub-dept-type-fields';

export default function SubDeptTypeModal({
  open,
  onClose,
  title = 'Add Sub Department Type',
  form,
  onSave,
}) {
  const { data: hospitals = [], isLoading: hospitalsLoading } = useGetHospitalsQuery();
  const { data: deptTypes = [] } = useGetDeptTypesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();

  const hospitalId = Form.useWatch('hospitalId', form);
  const deptTypeId = Form.useWatch('deptTypeId', form);

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

  const fields = useMemo(
    () =>
      getSubDeptTypeFields({
        hospitalOptions,
        hospitalsLoading,
        deptTypeOptions,
        departmentOptions,
        hospitalId,
        deptTypeId,
      }),
    [
      hospitalOptions,
      hospitalsLoading,
      deptTypeOptions,
      departmentOptions,
      hospitalId,
      deptTypeId,
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
      width={520}
      className="sub-dept-type-modal"
      rootClassName="sub-dept-type-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="sub-dept-type-save-btn" onClick={onSave}>
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
        initialValues={SUB_DEPT_TYPE_INITIAL_VALUES}
        onValuesChange={(changed) => {
          if ('hospitalId' in changed) {
            form.setFieldsValue({ deptTypeId: null, departmentId: null });
          } else if ('deptTypeId' in changed) {
            form.setFieldsValue({ departmentId: null });
          }
        }}
      >
        <DynamicForm fields={fields} className="sub-dept-type-form-grid" />
      </Form>
    </AppModal>
  );
}
