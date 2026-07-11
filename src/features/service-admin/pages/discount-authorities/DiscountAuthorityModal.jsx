'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  DISCOUNT_AUTHORITY_INITIAL_VALUES,
  getDiscountAuthorityFields,
} from '@/features/service-admin/pages/discount-authorities/discount-authority-fields';

export default function DiscountAuthorityModal({
  open,
  onClose,
  title = 'Add Discount Authority',
  form,
  onSave,
  employeeOptions = [],
}) {
  const fields = useMemo(
    () => getDiscountAuthorityFields(employeeOptions),
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
      <Form
        form={form}
        layout="vertical"
        requiredMark
        preserve={false}
        initialValues={DISCOUNT_AUTHORITY_INITIAL_VALUES}
      >
        <DynamicForm fields={fields} className="discount-authority-form-grid" />
      </Form>
    </AppModal>
  );
}
