'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import CompanyForm from '@/features/service-admin/pages/companies/CompanyForm';

export default function CompanyModal({
  open,
  onClose,
  title,
  form,
  errors,
  onPatchForm,
  onClearError,
  onSave,
  companyTypeOptions,
  statusOptions,
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      className="company-modal"
      rootClassName="company-modal-root"
      width={760}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </div>
      }
    >
      <CompanyForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        companyTypeOptions={companyTypeOptions}
        statusOptions={statusOptions}
      />
    </AppModal>
  );
}
