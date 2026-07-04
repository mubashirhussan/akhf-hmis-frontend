'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import WardBedsForm from '@/features/service-admin/pages/ward-beds/WardBedsForm';

export default function WardBedsModal({
  open,
  onClose,
  title = 'Add Ward Beds',
  form,
  errors,
  onPatchForm,
  onClearError,
  onSave,
  hospitalOptions = [],
  departmentOptions = [],
  subDepartmentOptions = [],
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={520}
      className="ward-beds-modal"
      rootClassName="ward-beds-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <WardBedsForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        hospitalOptions={hospitalOptions}
        departmentOptions={departmentOptions}
        subDepartmentOptions={subDepartmentOptions}
      />
    </AppModal>
  );
}