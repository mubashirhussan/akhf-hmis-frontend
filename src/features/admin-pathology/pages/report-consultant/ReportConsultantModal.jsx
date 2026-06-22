'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import ReportConsultantForm from '@/features/admin-pathology/pages/report-consultant/ReportConsultantForm';

export default function ReportConsultantModal({
  open,
  onClose,
  title = 'Add Consultant',
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
      width={480}
      className="report-consultant-modal"
      rootClassName="report-consultant-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            className="report-consultant-save-btn"
            onClick={onSave}
          >
            Save
          </Button>
        </>
      }
    >
      <ReportConsultantForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}
