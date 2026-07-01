'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import AssignDutyToEmployeeForm from './AssignDutyToEmployeeForm';

export default function AssignDutyToEmployeeModal({
  open,
  onClose,
  title = 'Assign Duty to Employee',
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
      className="assign-duty-employee-modal"
      rootClassName="assign-duty-employee-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="assign-duty-employee-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <AssignDutyToEmployeeForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}
