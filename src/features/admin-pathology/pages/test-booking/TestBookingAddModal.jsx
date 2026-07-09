'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import { useGetMainGroupsQuery, useGetTestNamesQuery } from '@/features/admin-pathology/api/pathologyApi';
import { SERVICE_OPTIONS } from '@/features/admin-pathology/api/mock-test-booking';
import {
  TEST_BOOKING_INITIAL_VALUES,
  getTestBookingFields,
} from '@/features/admin-pathology/pages/test-booking/test-booking-fields';

export default function TestBookingAddModal({ open, onClose, form, onSave }) {
  const { data: mainGroups = [] } = useGetMainGroupsQuery();
  const { data: testNames = [] } = useGetTestNamesQuery();

  const selectedMainGroup = Form.useWatch('mainGroup', form);

  const groupOptions = useMemo(
    () => mainGroups.map((g) => ({ label: g.groupName, value: g.groupName })),
    [mainGroups],
  );

  const testNameOptions = useMemo(
    () =>
      testNames
        .filter((t) => t.groupName === selectedMainGroup)
        .map((t) => ({ label: t.testName, value: t.testName })),
    [testNames, selectedMainGroup],
  );

  const serviceOptions = useMemo(
    () => SERVICE_OPTIONS.map((s) => ({ label: s.label, value: s.value })),
    [],
  );

  const fields = useMemo(
    () => getTestBookingFields({ groupOptions, testNameOptions, serviceOptions }),
    [groupOptions, testNameOptions, serviceOptions],
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Add Test Booking"
      width={760}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      className="test-booking-modal"
      rootClassName="test-booking-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="test-booking-save-btn" onClick={onSave}>
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
        initialValues={TEST_BOOKING_INITIAL_VALUES}
        onValuesChange={(changed) => {
          if ('mainGroup' in changed) {
            form.setFieldsValue({ testNames: [] });
          }
        }}
      >
        <DynamicForm fields={fields} className="test-booking-form-grid" />
      </Form>
    </AppModal>
  );
}