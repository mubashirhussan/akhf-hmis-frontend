'use client';

import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  CHANGE_DEPARTMENT_FIELDS,
  CHANGE_DEPARTMENT_INITIAL_VALUES,
} from '@/features/human-resource/pages/change-department/change-department-fields';

export default function ChangeDepartmentModal({ open, onClose, form, onSave }) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Change Department"
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={600}
      className="change-department-modal"
      rootClassName="change-department-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="change-department-save-btn" onClick={onSave}>
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
        initialValues={CHANGE_DEPARTMENT_INITIAL_VALUES}
      >
        <DynamicForm fields={CHANGE_DEPARTMENT_FIELDS} className="change-department-form-grid" />
      </Form>
    </AppModal>
  );
}
