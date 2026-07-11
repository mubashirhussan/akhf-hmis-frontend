'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  useGetHospitalsQuery,
  useGetDeptTypesQuery,
} from '@/features/human-resource/api/employeeApi';
import {
  DEPARTMENT_INITIAL_VALUES,
  getDepartmentFields,
} from '@/features/human-resource/pages/add-department/department-fields';

export default function DepartmentModal({
  open,
  onClose,
  title = 'Add Department',
  form,
  onSave,
}) {
  const { data: hospitals = [], isLoading: hospitalsLoading } = useGetHospitalsQuery();
  const { data: deptTypes = [] } = useGetDeptTypesQuery();

  const hospitalId = Form.useWatch('hospitalId', form);

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

  const fields = useMemo(
    () =>
      getDepartmentFields({
        hospitalOptions,
        hospitalsLoading,
        deptTypeOptions,
        hospitalId,
      }),
    [hospitalOptions, hospitalsLoading, deptTypeOptions, hospitalId],
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
      className="department-modal"
      rootClassName="department-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="department-save-btn" onClick={onSave}>
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
        initialValues={DEPARTMENT_INITIAL_VALUES}
        onValuesChange={(changed) => {
          if ('hospitalId' in changed) {
            form.setFieldsValue({ deptTypeId: null });
          }
        }}
      >
        <DynamicForm fields={fields} className="department-form-grid" />
      </Form>
    </AppModal>
  );
}
