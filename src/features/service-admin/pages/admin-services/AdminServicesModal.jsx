'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  ADMIN_SERVICES_INITIAL_VALUES,
  getAdminServicesFields,
} from '@/features/service-admin/pages/admin-services/admin-services-fields';

export default function AdminServicesModal({
  open,
  onClose,
  title = 'Add Service',
  form,
  onSave,
  departmentOptions = [],
  serviceCategoryOptions = [],
}) {
  const fields = useMemo(
    () => getAdminServicesFields({ departmentOptions, serviceCategoryOptions }),
    [departmentOptions, serviceCategoryOptions],
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
      className="admin-services-modal"
      rootClassName="admin-services-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="admin-services-save-btn" onClick={onSave}>
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
        initialValues={ADMIN_SERVICES_INITIAL_VALUES}
      >
        <DynamicForm fields={fields} className="admin-services-form-grid" />
      </Form>
    </AppModal>
  );
}
