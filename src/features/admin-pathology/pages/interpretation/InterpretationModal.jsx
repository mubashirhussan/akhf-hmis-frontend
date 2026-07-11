'use client';

import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  INTERPRETATION_FIELDS,
  INTERPRETATION_INITIAL_VALUES,
} from '@/features/admin-pathology/pages/interpretation/interpretation-fields';

export default function InterpretationModal({
  open,
  onClose,
  title = 'Add Interpretation',
  form,
  onSave,
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={720}
      className="interpretation-modal"
      rootClassName="interpretation-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            className="interpretation-save-btn"
            onClick={onSave}
          >
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
        initialValues={INTERPRETATION_INITIAL_VALUES}
      >
        <DynamicForm fields={INTERPRETATION_FIELDS} className="interpretation-form-grid" />
      </Form>
    </AppModal>
  );
}
