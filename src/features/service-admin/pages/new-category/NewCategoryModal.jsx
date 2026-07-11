'use client';

import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  NEW_CATEGORY_FIELDS,
  NEW_CATEGORY_INITIAL_VALUES,
} from '@/features/service-admin/pages/new-category/new-category-fields';

export default function NewCategoryModal({
  open,
  onClose,
  title = 'Add Service Category',
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
      width={480}
      className="new-category-modal"
      rootClassName="new-category-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onSave}>
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
        initialValues={NEW_CATEGORY_INITIAL_VALUES}
      >
        <DynamicForm fields={NEW_CATEGORY_FIELDS} className="new-category-form-grid" />
      </Form>
    </AppModal>
  );
}
