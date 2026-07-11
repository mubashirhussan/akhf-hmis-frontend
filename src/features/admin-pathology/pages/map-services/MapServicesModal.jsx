'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  MAP_SERVICES_INITIAL_VALUES,
  getMapServicesFields,
} from '@/features/admin-pathology/pages/map-services/map-services-fields';

export default function MapServicesModal({
  open,
  onClose,
  form,
  onSave,
  row,
  services,
}) {
  const fields = useMemo(() => getMapServicesFields({ services }), [services]);

  const loadRecord = (opened) => {
    if (!opened || !row) return;
    form.setFieldsValue({
      testBookingName: row.testBookingName || '',
      specimenRequired: row.specimenRequired || '',
      service: row.service || undefined,
    });
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Map Service Edit"
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      className="map-services-modal"
      rootClassName="map-services-modal-root"
      afterOpenChange={loadRecord}
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
        initialValues={MAP_SERVICES_INITIAL_VALUES}
      >
        <DynamicForm fields={fields} />
      </Form>
    </AppModal>
  );
}
