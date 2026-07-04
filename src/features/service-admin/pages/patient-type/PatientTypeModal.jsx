'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import PatientTypeForm from '@/features/service-admin/pages/patient-type/PatientTypeForm';

export default function PatientTypeModal({
  open,
  onClose,
  title = 'Add Patient Type',
  form,
  errors,
  onPatchForm,
  onClearError,
  onSave,
}) {
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
      <PatientTypeForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}