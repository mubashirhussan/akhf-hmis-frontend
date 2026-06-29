'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import SubDeptTypeForm from './SubDeptTypeForm';

export default function SubDeptTypeModal({
  open,
  onClose,
  title = 'Add Sub Department Type',
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
      className="sub-dept-type-modal"
      rootClassName="sub-dept-type-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="sub-dept-type-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <SubDeptTypeForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        isEdit={isEdit}
      />
    </AppModal>
  );
}