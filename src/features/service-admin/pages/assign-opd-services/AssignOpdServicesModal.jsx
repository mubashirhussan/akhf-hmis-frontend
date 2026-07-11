'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  ASSIGN_OPD_SERVICES_INITIAL_VALUES,
  getAssignOpdServicesFields,
} from '@/features/service-admin/pages/assign-opd-services/assign-opd-services-fields';

export default function AssignOpdServicesModal({
  open,
  onClose,
  title = 'Assign OPD Service',
  form,
  onSave,
  hospitalOptions = [],
  patientTypeOptions = [],
  serviceCategoryOptions = [],
  serviceOptions = [],
  subDepartmentOptions = [],
  serviceAdminRows = [],
}) {
  const serviceCategory = Form.useWatch('serviceCategory', form);

  const fields = useMemo(
    () =>
      getAssignOpdServicesFields({
        hospitalOptions,
        patientTypeOptions,
        serviceCategoryOptions,
        serviceOptions,
        subDepartmentOptions,
        hasServiceCategory: Boolean(serviceCategory),
      }),
    [
      hospitalOptions,
      patientTypeOptions,
      serviceCategoryOptions,
      serviceOptions,
      subDepartmentOptions,
      serviceCategory,
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
      width={520}
      className="assign-opd-services-modal"
      rootClassName="assign-opd-services-modal-root"
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
        initialValues={ASSIGN_OPD_SERVICES_INITIAL_VALUES}
        onValuesChange={(changed) => {
          if ('serviceCategory' in changed) {
            form.setFieldsValue({ service: undefined });
          }
          if ('service' in changed && changed.service) {
            const selectedService = serviceAdminRows.find((row) => row.id === changed.service);
            if (selectedService?.serviceCharges != null) {
              form.setFieldsValue({ amount: selectedService.serviceCharges });
            }
          }
        }}
      >
        <DynamicForm fields={fields} className="assign-opd-services-form-grid" />
      </Form>
    </AppModal>
  );
}
