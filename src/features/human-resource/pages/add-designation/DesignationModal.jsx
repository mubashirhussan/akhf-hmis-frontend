'use client';

import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import { rowToDesignationForm } from '@/features/human-resource/api/mock-designations';
import {
  DESIGNATION_FIELDS,
  DESIGNATION_INITIAL_VALUES,
} from '@/features/human-resource/pages/add-designation/designation-fields';

export default function DesignationModal({
  open,
  onClose,
  title = 'Add Designation',
  form,
  onSave,
  record = null,
}) {
  const loadRecord = (opened) => {
    if (!opened || !record) return;
    form.setFieldsValue(rowToDesignationForm(record));
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={520}
      className="designation-modal"
      rootClassName="designation-modal-root"
      afterOpenChange={loadRecord}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="designation-save-btn" onClick={onSave}>
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
        initialValues={DESIGNATION_INITIAL_VALUES}
      >
        <DynamicForm fields={DESIGNATION_FIELDS} className="designation-form-grid" />
      </Form>
    </AppModal>
  );
}
