'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DepartmentForm from './DepartmentForm';

export default function DepartmentModal({
  open,
  onClose,
  title = 'Add Department',
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
      className="department-modal"
      rootClassName="department-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="department-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <DepartmentForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        isEdit={isEdit}
      />
    </AppModal>
  );
}