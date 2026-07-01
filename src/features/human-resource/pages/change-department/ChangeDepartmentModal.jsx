'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import ChangeDepartmentForm from './ChangeDepartmentForm';

export default function ChangeDepartmentModal({
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
      title="Change Department"
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={600}
      className="change-department-modal"
      rootClassName="change-department-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="change-department-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <ChangeDepartmentForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}