'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import HospitalServicesForm from '@/features/service-admin/pages/hospital-services/HospitalServicesForm';

export default function HospitalServicesModal({
  open,
  onClose,
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
      title="Update Prices"
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={480}
      className="hospital-services-modal"
      rootClassName="hospital-services-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            className="hospital-services-save-btn"
            onClick={onSave}
          >
            Apply
          </Button>
        </>
      }
    >
      <HospitalServicesForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}