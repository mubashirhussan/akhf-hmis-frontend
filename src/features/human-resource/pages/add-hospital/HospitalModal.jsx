'use client';

import { useMemo } from 'react';
import { Button, Form, Input } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { rowToHospitalForm } from '@/features/human-resource/api/mock-hospitals';
import {
  HOSPITAL_FIELDS,
  HOSPITAL_INITIAL_VALUES,
} from '@/features/human-resource/pages/add-hospital/hospital-fields';

function HospitalLogoField({ value, onChange }) {
  return (
    <div className="hospital-logo-picker">
      {value ? (
        <img src={value} alt="Hospital logo preview" className="hospital-logo-preview" />
      ) : null}
      <Input
        type="file"
        accept="image/*"
        className={`${FIELD_CONTROL_CLASS} hospital-logo-input`}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            onChange?.(evt.target.result);
          };
          reader.readAsDataURL(file);
        }}
      />
    </div>
  );
}

export default function HospitalModal({
  open,
  onClose,
  title = 'Add Hospital',
  form,
  onSave,
  record = null,
}) {
  const fields = useMemo(
    () => [
      ...HOSPITAL_FIELDS,
      {
        type: 'custom',
        name: 'logo',
        label: 'Logo Image',
        col: 12,
        props: {
          render: () => <HospitalLogoField />,
        },
      },
      {
        type: 'textarea',
        name: 'address',
        label: 'Address',
        col: 24,
        props: { rows: 3 },
      },
    ],
    [],
  );

  const loadRecord = (opened) => {
    if (!opened || !record) return;
    form.setFieldsValue(rowToHospitalForm(record));
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={600}
      className="hospital-modal"
      rootClassName="hospital-modal-root"
      afterOpenChange={loadRecord}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="hospital-save-btn" onClick={onSave}>
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
        initialValues={HOSPITAL_INITIAL_VALUES}
      >
        <DynamicForm fields={fields} className="hospital-form-grid" />
      </Form>
    </AppModal>
  );
}
