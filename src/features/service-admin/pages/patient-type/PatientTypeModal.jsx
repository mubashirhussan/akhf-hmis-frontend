'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  PATIENT_TYPE_INITIAL_VALUES,
  getPatientTypeFields,
} from '@/features/service-admin/pages/patient-type/patient-type-fields';

export default function PatientTypeModal({
  open,
  onClose,
  title = 'Add Patient Type',
  form,
  isEdit = false,
  onSave,
}) {
  const fields = useMemo(() => getPatientTypeFields({ isEdit }), [isEdit]);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={480}
      className="patient-type-modal"
      rootClassName="patient-type-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onSave}>
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
        initialValues={PATIENT_TYPE_INITIAL_VALUES}
      >
        <DynamicForm fields={fields} className="patient-type-form-grid" />
      </Form>
    </AppModal>
  );
}
