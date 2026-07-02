'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import NewPackageForm from '@/features/service-admin/pages/new-package/NewPackageForm';

export default function NewPackageModal({
  open,
  onClose,
  title = 'Add Package',
  form,
  errors,
  onPatchForm,
  onClearError,
  onSave,
  departmentOptions,
  serviceOptions,
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={760}
      className="new-package-modal"
      rootClassName="new-package-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            className="new-package-save-btn"
            onClick={onSave}
          >
            Save
          </Button>
        </>
      }
    >
      <NewPackageForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        departmentOptions={departmentOptions}
        serviceOptions={serviceOptions}
      />
    </AppModal>
  );
}