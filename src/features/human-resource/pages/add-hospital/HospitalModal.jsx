'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import HospitalForm from './HospitalForm';

export default function HospitalModal({
  open,
  onClose,
  title = 'Add Hospital',
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
      width={600}
      className="hospital-modal"
      rootClassName="hospital-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="hospital-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <HospitalForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}