'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import RefundAuthorityForm from '@/features/service-admin/pages/refund-authorities/RefundAuthorityForm';

export default function RefundAuthorityModal({
  open,
  onClose,
  title = 'Add Refund Authority',
  form,
  errors,
  onPatchForm,
  onClearError,
  onSave,
  employeeOptions = [],
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
      className="refund-authority-modal"
      rootClassName="refund-authority-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <RefundAuthorityForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        employeeOptions={employeeOptions}
      />
    </AppModal>
  );
}
