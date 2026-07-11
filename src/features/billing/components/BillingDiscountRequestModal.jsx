'use client';

import { useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { App, Button, Form, Upload } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  BILLING_DISCOUNT_REQUEST_FIELDS,
  BILLING_DISCOUNT_REQUEST_INITIAL_VALUES,
} from '@/features/billing/components/billing-payment-fields';

const ACCEPTED_FILE_TYPES = '.png,.jpg,.jpeg,.pdf';

export default function BillingDiscountRequestModal({ open, onClose }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [form, open]);

  const handleForward = async () => {
    try {
      await form.validateFields(['hospital', 'forwardTo']);
      message.success('Discount request forwarded successfully.');
      onClose();
    } catch {
      // validation messages shown by Form
    }
  };

  const fields = [
    ...BILLING_DISCOUNT_REQUEST_FIELDS,
    {
      type: 'custom',
      name: 'attachments',
      label: 'Attachments',
      col: 24,
      props: {
        render: () => (
          <DiscountAttachmentControl />
        ),
      },
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Description',
      col: 24,
      props: {
        rows: 4,
        placeholder: 'Enter description here ...',
        className: 'discount-request-description',
      },
    },
  ];

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Discount Request"
      icon="mdi:percent-outline"
      footer={
        <>
          <Button className="discount-request-close-btn" onClick={onClose}>
            Close
          </Button>
          <Button type="primary" className="discount-request-forward-btn" onClick={handleForward}>
            Forward
          </Button>
        </>
      }
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark
        initialValues={BILLING_DISCOUNT_REQUEST_INITIAL_VALUES}
        className="walk-in-add-record-form"
      >
        <DynamicForm fields={fields} gutter={[16, 12]} />
      </Form>
    </AppModal>
  );
}

function DiscountAttachmentControl({ value, onChange }) {
  const attachmentName = value?.name || '';

  return (
    <div className="discount-request-upload">
      <Upload
        accept={ACCEPTED_FILE_TYPES}
        maxCount={1}
        showUploadList={false}
        beforeUpload={() => false}
        onChange={({ file }) => {
          onChange?.(file ? { name: file.name || '', file } : null);
        }}
      >
        <Button icon={<UploadOutlined />} className="discount-request-upload-btn">
          Choose Files
        </Button>
      </Upload>
      <span className="discount-request-upload-name">
        {attachmentName || 'No file chosen'}
      </span>
      <p className="discount-request-upload-hint">
        You can upload PNG, JPG, PDF (Max. 5MB)
      </p>
    </div>
  );
}
