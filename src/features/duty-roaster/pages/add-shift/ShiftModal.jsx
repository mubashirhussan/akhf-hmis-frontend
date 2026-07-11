'use client';

import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  SHIFT_FIELDS,
  SHIFT_INITIAL_VALUES,
} from '@/features/duty-roaster/pages/add-shift/shift-fields';

export default function ShiftModal({ open, onClose, title = 'Add Shift', form, onSave }) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={640}
      className="shift-modal"
      rootClassName="shift-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="shift-save-btn" onClick={onSave}>
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
        initialValues={SHIFT_INITIAL_VALUES}
      >
        <DynamicForm fields={SHIFT_FIELDS} className="shift-form-grid" />
      </Form>
    </AppModal>
  );
}
