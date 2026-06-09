'use client';

import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { App, Button, Input, Select, Upload } from 'antd';
import AppModal from '@/components/ui/AppModal';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import {
  BILLING_DISCOUNT_FORWARD_TO_OPTIONS,
  BILLING_DISCOUNT_HOSPITAL_OPTIONS,
} from '@/features/billing/api/mock-billing-payment';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

const ACCEPTED_FILE_TYPES = '.png,.jpg,.jpeg,.pdf';

export default function BillingDiscountRequestModal({ open, onClose }) {
  const { message } = App.useApp();
  const [hospital, setHospital] = useState('alkhidmat-khi');
  const [forwardTo, setForwardTo] = useState('abdul-hameed');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  useEffect(() => {
    if (!open) return;

    setHospital('alkhidmat-khi');
    setForwardTo('abdul-hameed');
    setDescription('');
    setAttachmentName('');
  }, [open]);

  const handleForward = () => {
    if (!hospital || !forwardTo) {
      message.error('Hospital and Forward To are required.');
      return;
    }

    message.success('Discount request forwarded successfully.');
    onClose();
  };

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
      <FormGrid columns={1} className="walk-in-add-record-form">
        <FloatingField label="Hospital" htmlFor="discount-request-hospital" required>
          <Select
            id="discount-request-hospital"
            className={controlClass}
            value={hospital}
            options={BILLING_DISCOUNT_HOSPITAL_OPTIONS}
            onChange={setHospital}
          />
        </FloatingField>

        <FloatingField label="Forward To" htmlFor="discount-request-forward" required>
          <Select
            id="discount-request-forward"
            className={controlClass}
            value={forwardTo}
            options={BILLING_DISCOUNT_FORWARD_TO_OPTIONS}
            onChange={setForwardTo}
          />
        </FloatingField>

        <FloatingField label="Attachments" htmlFor="discount-request-attachments">
          <div className="discount-request-upload">
            <Upload
              accept={ACCEPTED_FILE_TYPES}
              maxCount={1}
              showUploadList={false}
              beforeUpload={() => false}
              onChange={({ file }) => {
                setAttachmentName(file.name || '');
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
        </FloatingField>

        <FloatingField label="Description" htmlFor="discount-request-description">
          <Input.TextArea
            id="discount-request-description"
            className="discount-request-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description here ..."
          />
        </FloatingField>
      </FormGrid>
    </AppModal>
  );
}
