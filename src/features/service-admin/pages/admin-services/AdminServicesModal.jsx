'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import AdminServicesForm from '@/features/service-admin/pages/admin-services/AdminServicesForm';

export default function AdminServicesModal({
  open,
  onClose,
  title = 'Add Service',
  form,
  errors,
  onPatchForm,
  onClearError,
  onSave,
  departmentOptions = [],
  serviceCategoryOptions = [],
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
      className="admin-services-modal"
      rootClassName="admin-services-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            className="admin-services-save-btn"
            onClick={onSave}
          >
            Save
          </Button>
        </>
      }
    >
      <AdminServicesForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        departmentOptions={departmentOptions}
        serviceCategoryOptions={serviceCategoryOptions}
      />
    </AppModal>
  );
}
