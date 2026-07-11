'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  UPDATE_ADMIN_SERVICES_INITIAL_VALUES,
  getUpdateAdminServicesFields,
} from '@/features/service-admin/pages/update-admin-services/update-admin-services-fields';

export default function UpdateAdminServicesModal({
  open,
  onClose,
  title = 'Edit Service',
  form,
  onSave,
  serviceCategoryOptions = [],
}) {
  const fields = useMemo(
    () => getUpdateAdminServicesFields({ serviceCategoryOptions }),
    [serviceCategoryOptions],
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={480}
      className="update-admin-services-modal"
      rootClassName="update-admin-services-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            className="update-admin-services-save-btn"
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
        initialValues={UPDATE_ADMIN_SERVICES_INITIAL_VALUES}
      >
        <DynamicForm fields={fields} className="update-admin-services-form-grid" />
      </Form>
    </AppModal>
  );
}
