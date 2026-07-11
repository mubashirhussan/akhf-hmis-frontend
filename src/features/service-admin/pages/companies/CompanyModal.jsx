'use client';

import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  COMPANY_FIELDS,
  COMPANY_INITIAL_VALUES,
} from '@/features/service-admin/pages/companies/company-fields';

export default function CompanyModal({ open, onClose, title, form, onSave }) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      className="company-modal"
      rootClassName="company-modal-root"
      width={760}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark
        preserve={false}
        initialValues={COMPANY_INITIAL_VALUES}
      >
        <DynamicForm fields={COMPANY_FIELDS} className="company-form-grid" />
      </Form>
    </AppModal>
  );
}
