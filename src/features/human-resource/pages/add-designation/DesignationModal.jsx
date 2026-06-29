'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DesignationForm from './DesignationForm';

export default function DesignationModal({
  open,
  onClose,
  title = 'Add Designation',
  form,
  errors,
  onPatchForm,
  onClearError,
  onSave,
  isEdit = false,
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={520}
      className="designation-modal"
      rootClassName="designation-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="designation-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <DesignationForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        isEdit={isEdit}
      />
    </AppModal>
  );
}