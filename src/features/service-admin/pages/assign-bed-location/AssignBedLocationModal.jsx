'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import AssignBedLocationForm from '@/features/service-admin/pages/assign-bed-location/AssignBedLocationForm';

export default function AssignBedLocationModal({
  open,
  onClose,
  title = 'Assign Bed Location',
  form,
  errors,
  onPatchForm,
  onClearError,
  onSave,
  wardOptions = [],
  roomOptions = [],
  bedOptions = [],
  isEditMode = false,
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={500}
      className="assign-bed-location-modal"
      rootClassName="assign-bed-location-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <AssignBedLocationForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        wardOptions={wardOptions}
        roomOptions={roomOptions}
        bedOptions={bedOptions}
        isEditMode={isEditMode}
      />
    </AppModal>
  );
}