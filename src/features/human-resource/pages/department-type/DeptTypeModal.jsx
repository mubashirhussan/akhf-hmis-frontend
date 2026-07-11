'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import { useGetHospitalsQuery } from '@/features/human-resource/api/employeeApi';
import {
  DEPT_TYPE_INITIAL_VALUES,
  getDeptTypeFields,
} from '@/features/human-resource/pages/department-type/dept-type-fields';

export default function DeptTypeModal({
  open,
  onClose,
  title = 'Add Department Type',
  form,
  onSave,
  isEdit = false,
}) {
  const { data: hospitals = [], isLoading: hospitalsLoading } = useGetHospitalsQuery();

  const hospitalOptions = useMemo(
    () => hospitals.map((h) => ({ value: h.id, label: h.name })),
    [hospitals],
  );

  const fields = useMemo(
    () => getDeptTypeFields({ hospitalOptions, hospitalsLoading, isEdit }),
    [hospitalOptions, hospitalsLoading, isEdit],
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
      className="dept-type-modal"
      rootClassName="dept-type-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="dept-type-save-btn" onClick={onSave}>
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
        initialValues={DEPT_TYPE_INITIAL_VALUES}
      >
        <DynamicForm fields={fields} className="dept-type-form-grid" />
      </Form>
    </AppModal>
  );
}
