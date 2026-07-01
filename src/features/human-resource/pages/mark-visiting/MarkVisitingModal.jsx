'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import MarkVisitingForm from './MarkVisitingForm';

export default function MarkVisitingModal({
  open,
  onClose,
  title = 'Mark Visiting',
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
      className="mark-visiting-modal"
      rootClassName="mark-visiting-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="mark-visiting-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <MarkVisitingForm
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