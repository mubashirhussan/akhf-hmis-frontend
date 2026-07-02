'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import UpdateAdminServicesForm from '@/features/service-admin/pages/update-admin-services/UpdateAdminServicesForm';

export default function UpdateAdminServicesModal({
  open,
  onClose,
  title = 'Edit Service',
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
      className="update-admin-services-modal"
      rootClassName="update-admin-services-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            className="update-admin-services-save-btn"
            onClick={onSave}
          >
            Save
          </Button>
        </>
      }
    >
      <UpdateAdminServicesForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}