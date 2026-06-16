'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import PathologyComponentForm from '@/features/admin-pathology/pages/pathology-component/PathologyComponentForm';

export default function PathologyComponentModal({
  open,
  onClose,
  title = 'Add Component',
  form,
  unitOptions,
  errors,
  isEditing = false,
  onPatchForm,
  onClearError,
  onSave,
  onAddUnit,
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      className="pathology-component-modal"
      rootClassName="pathology-component-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="pathology-component-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <PathologyComponentForm
        form={form}
        unitOptions={unitOptions}
        errors={errors}
        isEditing={isEditing}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        onAddUnit={onAddUnit}
      />
    </AppModal>
  );
}
