'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import {
  useGetMainGroupsQuery,
  useGetSubGroupsQuery,
  useGetTestNamesQuery,
  useGetPathologyComponentsQuery,
  useGetPathologyLookupsQuery,
} from '@/features/admin-pathology/api/pathologyApi';
import { getPathologyTestRangeFields } from '@/features/admin-pathology/pages/pathology-test-range/pathology-test-range-fields';

export default function PathologyTestRangeEditModal({
  open,
  onClose,
  form,
  onSave,
  record,
  onAddCondition,
  onAddConversionRate,
}) {
  const { data: mainGroups = [] } = useGetMainGroupsQuery();
  const { data: subGroups = [] } = useGetSubGroupsQuery();
  const { data: testNames = [] } = useGetTestNamesQuery();
  const { data: components = [] } = useGetPathologyComponentsQuery();
  const { data: lookups } = useGetPathologyLookupsQuery();

  const selectedGroupName = Form.useWatch('groupName', form);
  const selectedSubGroupName = Form.useWatch('subGroupName', form);
  const selectedTestName = Form.useWatch('testName', form);
  const newCondition = Form.useWatch('newCondition', form) ?? '';

  const groupOptions = useMemo(
    () => mainGroups.map((g) => ({ label: g.groupName, value: g.groupName })),
    [mainGroups],
  );

  const subGroupOptions = useMemo(
    () =>
      subGroups
        .filter((sg) => sg.groupName === selectedGroupName)
        .map((sg) => ({ label: sg.subGroupName, value: sg.subGroupName })),
    [subGroups, selectedGroupName],
  );

  const testOptions = useMemo(
    () =>
      testNames
        .filter(
          (t) =>
            t.groupName === selectedGroupName &&
            t.subGroupName === selectedSubGroupName,
        )
        .map((t) => ({ label: t.testName, value: t.testName })),
    [testNames, selectedGroupName, selectedSubGroupName],
  );

  const componentOptions = useMemo(
    () =>
      components
        .filter(
          (c) =>
            c.groupName === selectedGroupName &&
            c.subGroupName === selectedSubGroupName &&
            c.testName === selectedTestName,
        )
        .map((c) => ({ label: c.componentName, value: c.componentName })),
    [components, selectedGroupName, selectedSubGroupName, selectedTestName],
  );

  const fields = useMemo(
    () =>
      getPathologyTestRangeFields({
        groupOptions,
        subGroupOptions,
        testOptions,
        componentOptions,
        genderOptions: lookups?.genderOptions ?? [],
        conditionOptions: lookups?.conditionOptions ?? [],
        unitOptions: lookups?.unitOptions ?? [],
        disableMainGroup: true,
        onAddCondition,
        onAddConversionRate,
        newCondition,
        onNewConditionChange: (val) => form.setFieldsValue({ newCondition: val }),
      }),
    [
      groupOptions,
      subGroupOptions,
      testOptions,
      componentOptions,
      lookups,
      onAddCondition,
      onAddConversionRate,
      newCondition,
      form,
    ],
  );

  const loadRecord = (opened) => {
    if (!opened || !record) return;
    form.setFieldsValue({
      groupName: record.groupName ?? '',
      subGroupName: record.subGroupName ?? '',
      testName: record.testName ?? '',
      testComponent: record.testComponent ?? '',
      startValue: record.startValue ?? '',
      endValue: record.endValue ?? '',
      reportValues: record.reportValues ?? '',
      gender: record.gender ?? 'both',
      ageStart: record.ageStart ?? '0',
      ageStartUnit: record.ageStartUnit ?? '',
      ageEnd: record.ageEnd ?? '0',
      ageEndUnit: record.ageEndUnit ?? '',
      condition: record.condition ?? 'normal',
      newCondition: '',
      unit: record.unit ?? '',
    });
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Edit Test Range"
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      className="pathology-test-range-modal"
      rootClassName="pathology-test-range-modal-root"
      afterOpenChange={loadRecord}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="pathology-test-range-save-btn" onClick={onSave}>
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
          if ('subGroupName' in changed) {
            form.setFieldsValue({ testName: '', testComponent: '' });
          } else if ('testName' in changed) {
            form.setFieldsValue({ testComponent: '' });
          }
        }}
      >
        <DynamicForm fields={fields} className="pathology-test-range-form-grid" />
      </Form>
    </AppModal>
  );
}