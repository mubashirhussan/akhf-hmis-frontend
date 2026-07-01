'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import ShiftForm from './ShiftForm';

export default function ShiftModal({
  open,
  onClose,
  title = 'Add Shift',
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
      className="shift-modal"
      rootClassName="shift-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="shift-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <ShiftForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}
