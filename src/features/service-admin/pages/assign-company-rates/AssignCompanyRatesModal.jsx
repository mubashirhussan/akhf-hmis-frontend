'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  ASSIGN_COMPANY_RATES_INITIAL_VALUES,
  getAssignCompanyRatesFields,
} from '@/features/service-admin/pages/assign-company-rates/assign-company-rates-fields';

export default function AssignCompanyRatesModal({ open, onClose, form, onSave }) {
  const adjustMode = Form.useWatch('adjustMode', form);
  const currentAmount = Form.useWatch('currentAmount', form);

  const fields = useMemo(
    () =>
      getAssignCompanyRatesFields({
        adjustMode,
        showCurrentAmount: currentAmount != null,
      }),
    [adjustMode, currentAmount],
  );

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
      <Form
        form={form}
        layout="vertical"
        requiredMark
        preserve={false}
        initialValues={ASSIGN_COMPANY_RATES_INITIAL_VALUES}
        onValuesChange={(changed) => {
          if ('adjustMode' in changed) {
            form.setFieldsValue({ percentage: null, fixedAmount: null });
          }
        }}
      >
        <DynamicForm fields={fields} className="assign-company-rates-form-grid" />
      </Form>
    </AppModal>
  );
}
