'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  HOSPITAL_SERVICES_INITIAL_VALUES,
  getHospitalServicesFields,
} from '@/features/service-admin/pages/hospital-services/hospital-services-fields';

export default function HospitalServicesModal({ open, onClose, form, onSave }) {
  const adjustMode = Form.useWatch('adjustMode', form);
  const currentAmount = Form.useWatch('currentAmount', form);

  const fields = useMemo(
    () =>
      getHospitalServicesFields({
        adjustMode,
        showCurrentAmount: currentAmount != null,
      }),
    [adjustMode, currentAmount],
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Update Prices"
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={480}
      className="hospital-services-modal"
      rootClassName="hospital-services-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="hospital-services-save-btn" onClick={onSave}>
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
        initialValues={HOSPITAL_SERVICES_INITIAL_VALUES}
        onValuesChange={(changed) => {
          if ('adjustMode' in changed) {
            form.setFieldsValue({ percentage: null, fixedAmount: null });
          }
        }}
      >
        <DynamicForm fields={fields} className="hospital-services-form-grid" />
      </Form>
    </AppModal>
  );
}
