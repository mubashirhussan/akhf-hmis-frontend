'use client';

import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  MACHINE_INTEGRATION_COMPWISE_FIELDS,
  MACHINE_INTEGRATION_COMPWISE_INITIAL_VALUES,
} from '@/features/admin-pathology/pages/machine-integration-compwise/machine-integration-compwise-fields';

export default function MachineIntegrationCompwiseModal({
  open,
  onClose,
  title = 'Add Machine Integration',
  form,
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
      <Form
        form={form}
        layout="vertical"
        requiredMark
        preserve={false}
        initialValues={MACHINE_INTEGRATION_COMPWISE_INITIAL_VALUES}
      >
        <DynamicForm
          fields={MACHINE_INTEGRATION_COMPWISE_FIELDS}
          className="machine-integration-compwise-form-grid"
        />
      </Form>
    </AppModal>
  );
}
