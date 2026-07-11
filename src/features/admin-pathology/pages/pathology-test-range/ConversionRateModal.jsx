'use client';

import { useEffect } from 'react';
import { App, Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  CONVERSION_RATE_FIELDS,
  CONVERSION_RATE_INITIAL_VALUES,
} from '@/features/admin-pathology/pages/pathology-test-range/conversion-rate-fields';

export default function ConversionRateModal({ open, onClose, defaultUnit = '' }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      unit: defaultUnit,
      conversionRate: '',
    });
  }, [defaultUnit, open, form]);

  const handleSave = async () => {
    try {
      await form.validateFields();
      message.success('Conversion rate saved.');
      onClose();
    } catch {
      // validation errors are shown by antd Form
    }
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Add Conversion Rate"
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={560}
      className="pathology-conversion-rate-modal"
      rootClassName="pathology-conversion-rate-modal-root"
      footer={null}
    >
      <div className="pathology-conversion-rate-form">
        <Form
          form={form}
          layout="vertical"
          requiredMark
          preserve={false}
          initialValues={{
            ...CONVERSION_RATE_INITIAL_VALUES,
            unit: defaultUnit,
          }}
        >
          <DynamicForm fields={CONVERSION_RATE_FIELDS} />
        </Form>

        <div className="pathology-conversion-rate-form-actions">
          <Button
            type="primary"
            className="pathology-conversion-rate-save-btn"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button className="pathology-conversion-rate-close-btn" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </AppModal>
  );
}
