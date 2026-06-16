'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import SubGroupForm from '@/features/admin-pathology/pages/sub-group/SubGroupForm';

export default function SubGroupModal({
  open,
  onClose,
  title = 'Add Sub Group',

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
      width={480}
      className="sub-group-modal"
      rootClassName="sub-group-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="sub-group-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <SubGroupForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}
