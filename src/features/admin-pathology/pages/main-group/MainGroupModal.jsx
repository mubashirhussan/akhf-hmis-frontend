'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import MainGroupForm from '@/features/admin-pathology/pages/main-group/MainGroupForm';

export default function MainGroupModal({
  open,
  onClose,
  title = 'Add Test Group Fee',
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
      className="main-group-modal"
      rootClassName="main-group-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="main-group-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <MainGroupForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}
