'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import { useGetMainGroupsQuery, useGetSubGroupsQuery } from '@/features/admin-pathology/api/pathologyApi';
import { getTestNameFields } from '@/features/admin-pathology/pages/test-name/test-name-fields';

export default function TestNameEditModal({ open, onClose, form, onSave, record }) {
  const { data: mainGroups = [] } = useGetMainGroupsQuery();
  const { data: subGroups = [] } = useGetSubGroupsQuery();

  const selectedTGID = Form.useWatch('TGID', form);

  const groupOptions = useMemo(
    () => mainGroups.map((g) => ({ label: g.groupName, value: g.TGID })),
    [mainGroups],
  );

  const subGroupOptions = useMemo(
    () =>
      subGroups
        .filter((sg) => sg.TGID === selectedTGID)
        .map((sg) => ({ label: sg.subGroupName, value: sg.TSGID })),
    [subGroups, selectedTGID],
  );

  const fields = useMemo(
    () => getTestNameFields(groupOptions, subGroupOptions),
    [groupOptions, subGroupOptions],
  );

  const loadRecord = (opened) => {
    if (!opened || !record) return;
    form.setFieldsValue({
      TGID: record.TGID ?? null,
      TSGID: record.TSGID ?? null,
      testName: record.testName ?? '',
      medicalName: record.medicalName ?? '',
      standardName: record.standardName ?? '',
      fee: record.fee ?? 0,
    });
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Edit Test Name"
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={680}
      className="test-name-modal"
      rootClassName="test-name-modal-root"
      afterOpenChange={loadRecord}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="test-name-save-btn" onClick={onSave}>
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
        onValuesChange={(changed) => {
          if ('TGID' in changed) {
            form.setFieldsValue({ TSGID: null });
          }
        }}
      >
        <DynamicForm fields={fields} className="test-name-form-grid" />
      </Form>
    </AppModal>
  );
}