'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import TestNameForm from '@/features/admin-pathology/pages/test-name/TestNameForm';

export default function TestNameModal({
  open,
  onClose,
  title = 'Add Test Name',
  form,
  errors,
  onPatchForm,
  onClearError,
  onSave,
  mainGroups,
  subGroups,
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      className="test-name-modal"
      rootClassName="test-name-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="test-name-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
 <TestNameForm
  form={form}
  errors={errors}
  onPatchForm={onPatchForm}
  onClearError={onClearError}
  mainGroups={mainGroups}
  subGroups={subGroups}
/>
    </AppModal>
  );
}
