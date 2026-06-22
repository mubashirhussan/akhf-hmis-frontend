'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import MachineIntegrationCompwiseForm from '@/features/admin-pathology/pages/machine-integration-compwise/MachineIntegrationCompwiseForm';

export default function MachineIntegrationCompwiseModal({
  open,
  onClose,
  title = 'Add Machine Integration',
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
      className="machine-integration-compwise-modal"
      rootClassName="machine-integration-compwise-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            className="machine-integration-compwise-save-btn"
            onClick={onSave}
          >
            Save
          </Button>
        </>
      }
    >
      <MachineIntegrationCompwiseForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}
