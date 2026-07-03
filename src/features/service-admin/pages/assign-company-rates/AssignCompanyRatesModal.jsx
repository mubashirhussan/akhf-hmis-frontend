'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import AssignCompanyRatesForm from '@/features/service-admin/pages/assign-company-rates/AssignCompanyRatesForm';

export default function AssignCompanyRatesModal({
  open,
  onClose,
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
      title="Adjust Prices"
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={480}
      className="assign-company-rates-modal"
      rootClassName="assign-company-rates-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            className="assign-company-rates-save-btn"
            onClick={onSave}
          >
            Apply
          </Button>
        </>
      }
    >
      <AssignCompanyRatesForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}