'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import SubDepartmentForm from './SubDepartmentForm';

export default function SubDepartmentModal({
  open,
  onClose,
  title = 'Add Sub Department',
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
      className="sub-department-modal"
      rootClassName="sub-department-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="sub-department-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <SubDepartmentForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        isEdit={isEdit}
      />
    </AppModal>
  );
}