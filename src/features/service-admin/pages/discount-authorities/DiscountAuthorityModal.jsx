'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DiscountAuthorityForm from '@/features/service-admin/pages/discount-authorities/DiscountAuthorityForm';

export default function DiscountAuthorityModal({
  open,
  onClose,
  title = 'Add Discount Authority',
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
      className="discount-authority-modal"
      rootClassName="discount-authority-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <DiscountAuthorityForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        employeeOptions={employeeOptions}
      />
    </AppModal>
  );
}
