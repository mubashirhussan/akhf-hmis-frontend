'use client';

import { Button } from 'antd';
import AppModal from '@/components/ui/AppModal';
import AssignOpdServicesForm from '@/features/service-admin/pages/assign-opd-services/AssignOpdServicesForm';

export default function AssignOpdServicesModal({
  open,
  onClose,
  title = 'Assign OPD Service',
  form,
  errors,
  onPatchForm,
  onClearError,
  onSave,
  patientTypeOptions = [],
  serviceCategoryOptions = [],
  serviceOptions = [],
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
      <AssignOpdServicesForm
        form={form}
        errors={errors}
        onPatchForm={onPatchForm}
        onClearError={onClearError}
        patientTypeOptions={patientTypeOptions}
        serviceCategoryOptions={serviceCategoryOptions}
        serviceOptions={serviceOptions}
      />
    </AppModal>
  );
}