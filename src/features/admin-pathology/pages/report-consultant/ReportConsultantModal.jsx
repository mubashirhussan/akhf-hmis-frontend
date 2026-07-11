'use client';

import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import { DOCTOR_OPTIONS } from '@/features/admin-pathology/api/mock-report-consultant';
import {
  REPORT_CONSULTANT_FIELDS,
  REPORT_CONSULTANT_INITIAL_VALUES,
} from '@/features/admin-pathology/pages/report-consultant/report-consultant-fields';

export default function ReportConsultantModal({
  open,
  onClose,
  title = 'Add Consultant',
  form,
  onSave,
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={480}
      className="report-consultant-modal"
      rootClassName="report-consultant-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            className="report-consultant-save-btn"
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
        initialValues={REPORT_CONSULTANT_INITIAL_VALUES}
        onValuesChange={(changed) => {
          if ('doctorName' in changed) {
            const selectedDoctor = DOCTOR_OPTIONS.find(
              (option) => option.value === changed.doctorName,
            );
            form.setFieldsValue({
              doctorQualification: selectedDoctor?.doctorQualification ?? '',
              doctorDesignation: selectedDoctor?.doctorDesignation ?? '',
            });
          }
        }}
      >
        <DynamicForm
          fields={REPORT_CONSULTANT_FIELDS}
          className="report-consultant-form-grid"
        />
      </Form>
    </AppModal>
  );
}
