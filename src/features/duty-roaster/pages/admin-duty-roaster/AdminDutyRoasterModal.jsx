'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import AdminDutyRoasterForm from './AdminDutyRoasterForm';

export default function AdminDutyRoasterModal({
  open,
  onClose,
  title = 'Add Admin Duty Roaster',
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
      width={640}
      className="admin-duty-roaster-modal"
      rootClassName="admin-duty-roaster-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="admin-duty-roaster-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <AdminDutyRoasterForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}
