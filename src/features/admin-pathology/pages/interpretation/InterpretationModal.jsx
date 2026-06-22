'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import InterpretationForm from '@/features/admin-pathology/pages/interpretation/InterpretationForm';

export default function InterpretationModal({
  open,
  onClose,
  title = 'Add Interpretation',
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
      width={720}
      className="interpretation-modal"
      rootClassName="interpretation-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            className="interpretation-save-btn"
            onClick={onSave}
          >
            Save
          </Button>
        </>
      }
    >
      <InterpretationForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}
