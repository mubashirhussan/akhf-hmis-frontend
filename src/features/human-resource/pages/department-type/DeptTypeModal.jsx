'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DeptTypeForm from './DeptTypeForm';

export default function DeptTypeModal({
  open,
  onClose,
  title = 'Add Department Type',
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
      className="dept-type-modal"
      rootClassName="dept-type-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="dept-type-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <DeptTypeForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        isEdit={isEdit}
      />
    </AppModal>
  );
}