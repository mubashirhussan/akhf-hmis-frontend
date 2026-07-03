'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import NewCategoryForm from '@/features/service-admin/pages/new-category/NewCategoryForm';

export default function NewCategoryModal({
  open,
  onClose,
  title = 'Add Service Category',
  form,
  errors,
  onPatchForm,
  onClearError,
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
      <NewCategoryForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
      />
    </AppModal>
  );
}
