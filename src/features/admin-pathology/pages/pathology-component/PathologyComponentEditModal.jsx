'use client';

import { useMemo } from 'react';
import { Button, Form, Input } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  useGetMainGroupsQuery,
  useGetSubGroupsQuery,
  useGetTestNamesQuery,
  useGetPathologyLookupsQuery,
} from '@/features/admin-pathology/api/pathologyApi';
import { getPathologyComponentFields } from '@/features/admin-pathology/pages/pathology-component/pathology-component-fields';

export default function PathologyComponentEditModal({
  open,
  onClose,
  form,
  onSave,
  record,
  onAddUnit,
}) {
  const { data: mainGroups = [] } = useGetMainGroupsQuery();
  const { data: subGroups = [] } = useGetSubGroupsQuery();
  const { data: testNames = [] } = useGetTestNamesQuery();
  const { data: lookups } = useGetPathologyLookupsQuery();

  const selectedTGID = Form.useWatch('TGID', form);
  const selectedTSGID = Form.useWatch('TSGID', form);

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

  const selectedSubGroup = subGroups.find((sg) => sg.TSGID === selectedTSGID);

  const testOptions = useMemo(
    () =>
      testNames
        .filter(
          (t) =>
            t.groupName === mainGroups.find((g) => g.TGID === selectedTGID)?.groupName &&
            t.subGroupName === selectedSubGroup?.subGroupName,
        )
        .map((t) => ({ label: t.testName, value: t.tid })),
    [testNames, mainGroups, selectedTGID, selectedSubGroup],
  );

  const fields = useMemo(
    () =>
      getPathologyComponentFields({
        groupOptions,
        subGroupOptions,
        testOptions,
        fieldTypeOptions: lookups?.fieldTypeOptions ?? [],
        unitOptions: lookups?.unitOptions ?? [],
        disableGroup: true,
      }),
    [groupOptions, subGroupOptions, testOptions, lookups],
  );

  const loadRecord = (opened) => {
    if (!opened || !record) return;

    const matchedSubGroup = subGroups.find(
      (sg) => sg.subGroupName === record.subGroupName && sg.TGID === record.TGID,
    );

    form.setFieldsValue({
      TGID: record.TGID ?? null,
      TSGID: matchedSubGroup?.TSGID ?? null,
      TID: record.TID ?? null,
      componentName: record.componentName ?? '',
      fieldType: record.fieldType ?? '',
      unit: record.unit ?? '',
      priority: record.priority ?? 1,
      toolTip: record.toolTip ?? '',
      referenceMale: record.referenceMale ?? '',
      referenceFemale: record.referenceFemale ?? '',
      newUnit: '',
    });
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Edit Component"
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      className="pathology-component-modal"
      rootClassName="pathology-component-modal-root"
      afterOpenChange={loadRecord}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="pathology-component-save-btn" onClick={onSave}>
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
          if ('TSGID' in changed) {
            form.setFieldsValue({ TID: null });
          }
        }}
      >
        <DynamicForm fields={fields} className="pathology-component-form-grid" />
        <div className="pathology-component-new-unit-row">
          <Form.Item name="newUnit" label="New Unit" style={{ marginBottom: 0 }}>
            <Input className={FIELD_CONTROL_CLASS} autoComplete="off" />
          </Form.Item>
          <Button type="link" onClick={onAddUnit}>
            Add New Unit
          </Button>
        </div>
      </Form>
    </AppModal>
  );
}