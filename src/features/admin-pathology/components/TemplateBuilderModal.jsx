'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import TemplateBuilderForm from '@/features/admin-pathology/components/TemplateBuilderForm';

export default function TemplateBuilderModal({
  open,
  onClose,
  form,
  unitOptions,
  errors,
  onPatchForm,
  onClearError,
  onSave,
  onAddUnit,
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Add Component"
      centered={false}
      style={{ top: 20 }}
      className="template-builder-modal"
      rootClassName="template-builder-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="template-builder-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <TemplateBuilderForm
        form={form}
        unitOptions={unitOptions}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        onAddUnit={onAddUnit}
      />
    </AppModal>
  );
}
