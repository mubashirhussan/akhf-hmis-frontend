'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  REFUND_AUTHORITY_INITIAL_VALUES,
  getRefundAuthorityFields,
} from '@/features/service-admin/pages/refund-authorities/refund-authority-fields';

export default function RefundAuthorityModal({
  open,
  onClose,
  title = 'Add Refund Authority',
  form,
  onSave,
  employeeOptions = [],
}) {
  const fields = useMemo(
    () => getRefundAuthorityFields(employeeOptions),
    [employeeOptions],
  );

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
      <Form
        form={form}
        layout="vertical"
        requiredMark
        preserve={false}
        initialValues={REFUND_AUTHORITY_INITIAL_VALUES}
      >
        <DynamicForm fields={fields} className="refund-authority-form-grid" />
      </Form>
    </AppModal>
  );
}
