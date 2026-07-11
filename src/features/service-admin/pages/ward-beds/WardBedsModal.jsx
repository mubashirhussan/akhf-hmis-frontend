'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  WARD_BEDS_INITIAL_VALUES,
  getWardBedsFields,
} from '@/features/service-admin/pages/ward-beds/ward-beds-fields';

export default function WardBedsModal({
  open,
  onClose,
  title = 'Add Ward Beds',
  form,
  onSave,
  hospitalOptions = [],
  departmentOptions = [],
  subDepartmentOptions = [],
}) {
  const hospitalId = Form.useWatch('hospitalId', form);
  const departmentId = Form.useWatch('departmentId', form);

  const fields = useMemo(
    () =>
      getWardBedsFields({
        hospitalOptions,
        departmentOptions,
        subDepartmentOptions,
        hasHospital: Boolean(hospitalId),
        hasDepartment: Boolean(departmentId),
      }),
    [hospitalOptions, departmentOptions, subDepartmentOptions, hospitalId, departmentId],
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
      className="ward-beds-modal"
      rootClassName="ward-beds-modal-root"
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
        initialValues={WARD_BEDS_INITIAL_VALUES}
        onValuesChange={(changed) => {
          if ('hospitalId' in changed) {
            form.setFieldsValue({ departmentId: undefined, subDepartmentId: undefined });
          }
          if ('departmentId' in changed) {
            form.setFieldsValue({ subDepartmentId: undefined });
          }
        }}
      >
        <DynamicForm fields={fields} className="ward-beds-form-grid" />
      </Form>
    </AppModal>
  );
}
