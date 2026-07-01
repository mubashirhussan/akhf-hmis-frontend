'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import MarkReceptionistForm from './MarkReceptionistForm';

export default function MarkReceptionistModal({
  open,
  onClose,
  title = 'Mark Receptionist',
  form,
  errors,
  onPatchForm,
  onClearError,
  onSave,
  employees = [],
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
      className="mark-receptionist-modal"
      rootClassName="mark-receptionist-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="mark-receptionist-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <MarkReceptionistForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        employees={employees}
        isEdit={isEdit}
      />
    </AppModal>
  );
}