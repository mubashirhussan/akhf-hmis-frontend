'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  ASSIGN_BED_LOCATION_INITIAL_VALUES,
  getAssignBedLocationFields,
} from '@/features/service-admin/pages/assign-bed-location/assign-bed-location-fields';

export default function AssignBedLocationModal({
  open,
  onClose,
  title = 'Assign Bed Location',
  form,
  onSave,
  wardOptions = [],
  roomOptions = [],
  bedOptions = [],
  isEditMode = false,
}) {
  const wardBedId = Form.useWatch('wardBedId', form);
  const roomNumber = Form.useWatch('roomNumber', form);

  const fields = useMemo(
    () =>
      getAssignBedLocationFields({
        wardOptions,
        roomOptions,
        bedOptions,
        hasWard: Boolean(wardBedId),
        hasRoom: Boolean(roomNumber),
        isEditMode,
      }),
    [wardOptions, roomOptions, bedOptions, wardBedId, roomNumber, isEditMode],
  );

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
      <Form
        form={form}
        layout="vertical"
        requiredMark
        preserve={false}
        initialValues={ASSIGN_BED_LOCATION_INITIAL_VALUES}
        onValuesChange={(changed) => {
          if ('wardBedId' in changed) {
            form.setFieldsValue({ roomNumber: undefined, bedNumber: undefined });
          }
          if ('roomNumber' in changed) {
            form.setFieldsValue({ bedNumber: undefined });
          }
        }}
      >
        <DynamicForm fields={fields} className="assign-bed-location-form-grid" />
      </Form>
    </AppModal>
  );
}
