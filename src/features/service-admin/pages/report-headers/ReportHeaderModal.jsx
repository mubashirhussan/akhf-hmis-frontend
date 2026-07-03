'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import ReportHeaderForm from '@/features/service-admin/pages/report-headers/ReportHeaderForm';

export default function ReportHeaderModal({
  open,
  onClose,
  title,
  form,
  errors,
  onPatchForm,
  onClearError,
  onSave,
  hospitalOptions,
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      className="report-header-modal"
      rootClassName="report-header-modal-root"
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
      <ReportHeaderForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        hospitalOptions={hospitalOptions}
      />
    </AppModal>
  );
}
