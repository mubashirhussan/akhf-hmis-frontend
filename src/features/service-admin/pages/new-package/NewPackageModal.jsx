'use client';

import { useMemo } from 'react';
import { Button, Form, InputNumber } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  NEW_PACKAGE_INITIAL_VALUES,
  getNewPackageFields,
} from '@/features/service-admin/pages/new-package/new-package-fields';

export default function NewPackageModal({
  open,
  onClose,
  title = 'Add Package',
  form,
  onSave,
  departmentOptions = [],
  serviceCategoryOptions = [],
  serviceOptions = [],
  serviceChargesMap = {},
}) {
  const serviceCategory = Form.useWatch('serviceCategory', form);
  const services = Form.useWatch('services', form);

  const servicesTotal = useMemo(
    () => (services ?? []).reduce((sum, svc) => sum + (serviceChargesMap[svc] ?? 0), 0),
    [services, serviceChargesMap],
  );

  const fields = useMemo(
    () =>
      getNewPackageFields({
        departmentOptions,
        serviceCategoryOptions,
        serviceOptions,
        hasServiceCategory: Boolean(serviceCategory),
        servicesTotalField: {
          type: 'custom',
          name: '_servicesTotal',
          label: 'Total Amount',
          col: 12,
          props: {
            render: () => (
              <InputNumber value={servicesTotal} disabled style={{ width: '100%' }} />
            ),
          },
        },
      }),
    [
      departmentOptions,
      serviceCategoryOptions,
      serviceOptions,
      serviceCategory,
      servicesTotal,
    ],
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={760}
      className="new-package-modal"
      rootClassName="new-package-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="new-package-save-btn" onClick={onSave}>
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
        initialValues={NEW_PACKAGE_INITIAL_VALUES}
        onValuesChange={(changed) => {
          if ('serviceCategory' in changed) {
            form.setFieldsValue({ services: [] });
          }
        }}
      >
        <DynamicForm fields={fields} className="new-package-form-grid" />
      </Form>
    </AppModal>
  );
}
