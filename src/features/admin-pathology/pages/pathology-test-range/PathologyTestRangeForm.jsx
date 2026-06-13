'use client';

import { useEffect, useRef } from 'react';
import { Button, Input, Select } from 'antd';
import AgeUnitField from '@/components/ui/AgeUnitField';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  CONDITION_OPTIONS,
  GENDER_OPTIONS,
  GROUP_OPTIONS,
  getComponentOptions,
  getSubGroupOptions,
  getTestOptions,
} from '@/features/admin-pathology/api/mock-pathology-test-range';

const controlClass = FIELD_CONTROL_CLASS;

export default function PathologyTestRangeForm({
  form,
  unitOptions,
  conditionOptions,
  errors = {},
  onPatchForm,
  onClearError,
  onAddCondition,
  onAddConversionRate,
}) {
  const testComponentTcidRef = useRef(null);
  const fieldId = (name) => `pathology-test-range-${name}`;
  const subGroupOptions = getSubGroupOptions(form.groupName);
  const testOptions = getTestOptions(form.subGroupName);
  const componentOptions = getComponentOptions(form.subGroupName, form.testName);
  const testComponentError = errors.testComponent;

  useEffect(() => {
    if (!testComponentError) return;
    testComponentTcidRef.current?.focus({ preventScroll: false });
  }, [testComponentError]);

  return (
    <FormGrid columns={2} className="pathology-test-range-form-grid">
      <FormField label="Main Group">
        <Select
          id={fieldId('main-group')}
          className={controlClass}
          value={form.groupName}
          options={GROUP_OPTIONS}
          onChange={(groupName) => {
            const nextSubGroups = getSubGroupOptions(groupName);
            const nextSubGroup = nextSubGroups[0]?.value ?? '';
            const nextTests = getTestOptions(nextSubGroup);
            const nextTest = nextTests[0]?.value ?? '';
            const nextComponents = getComponentOptions(nextSubGroup, nextTest);
            onPatchForm({
              groupName,
              subGroupName: nextSubGroup,
              testName: nextTest,
              testComponent: nextComponents[0]?.value ?? '',
              testComponentTcid: nextComponents[0] ? String(nextComponents[0].tcid) : '',
            });
          }}
        />
      </FormField>

      <FormField label="Sub Group">
        <Select
          id={fieldId('sub-group')}
          className={controlClass}
          value={form.subGroupName}
          options={subGroupOptions}
          onChange={(subGroupName) => {
            const nextTests = getTestOptions(subGroupName);
            const nextTest = nextTests[0]?.value ?? '';
            const nextComponents = getComponentOptions(subGroupName, nextTest);
            onPatchForm({
              subGroupName,
              testName: nextTest,
              testComponent: nextComponents[0]?.value ?? '',
              testComponentTcid: nextComponents[0] ? String(nextComponents[0].tcid) : '',
            });
          }}
        />
      </FormField>

      <FormField label="Test">
        <Select
          id={fieldId('test')}
          className={controlClass}
          value={form.testName}
          options={testOptions}
          onChange={(testName) => {
            const nextComponents = getComponentOptions(form.subGroupName, testName);
            onPatchForm({
              testName,
              testComponent: nextComponents[0]?.value ?? '',
              testComponentTcid: nextComponents[0] ? String(nextComponents[0].tcid) : '',
            });
          }}
        />
      </FormField>

      <FormField label="Test Component" required error={testComponentError}>
        <div className="pathology-test-range-test-component">
          <Input
            ref={testComponentTcidRef}
            id={fieldId('test-component-tcid')}
            className={controlClass}
            value={form.testComponentTcid}
            placeholder="TCID"
            onChange={(event) => {
              const tcid = event.target.value.replace(/\D/g, '');
              const matched = componentOptions.find((option) => String(option.tcid) === tcid);
              onPatchForm({
                testComponentTcid: tcid,
                testComponent: matched?.value ?? '',
              });
              if (testComponentError) {
                onClearError?.('testComponent');
              }
            }}
            autoComplete="off"
          />
          <Select
            id={fieldId('test-component')}
            className={controlClass}
            value={form.testComponent || undefined}
            options={componentOptions}
            placeholder="Select component"
            status={testComponentError ? 'error' : undefined}
            onChange={(testComponent) => {
              const matched = componentOptions.find((option) => option.value === testComponent);
              onPatchForm({
                testComponent,
                testComponentTcid: matched ? String(matched.tcid) : '',
              });
              if (testComponentError) {
                onClearError?.('testComponent');
              }
            }}
          />
        </div>
      </FormField>

      <FormField label="Start Value">
        <Input
          id={fieldId('start-value')}
          className={controlClass}
          value={form.startValue}
          onChange={(event) => onPatchForm({ startValue: event.target.value })}
          autoComplete="off"
        />
      </FormField>

      <FormField label="End Value">
        <Input
          id={fieldId('end-value')}
          className={controlClass}
          value={form.endValue}
          onChange={(event) => onPatchForm({ endValue: event.target.value })}
          autoComplete="off"
        />
      </FormField>

      <FormField label="Report Values">
        <Input
          id={fieldId('report-values')}
          className={controlClass}
          value={form.reportValues}
          onChange={(event) => onPatchForm({ reportValues: event.target.value })}
          autoComplete="off"
        />
      </FormField>

      <FormField label="Gender">
        <Select
          id={fieldId('gender')}
          className={controlClass}
          value={form.gender}
          options={GENDER_OPTIONS}
          onChange={(gender) => onPatchForm({ gender })}
        />
      </FormField>

      <FormField label="Age Start">
        <AgeUnitField
          ageInputId={fieldId('age-start')}
          age={form.ageStart}
          unit={form.ageStartUnit}
          embedded
          className="pathology-test-range-age-field"
          onChange={({ age, unit }) => onPatchForm({ ageStart: age, ageStartUnit: unit })}
        />
      </FormField>

      <FormField label="Age End">
        <AgeUnitField
          ageInputId={fieldId('age-end')}
          age={form.ageEnd}
          unit={form.ageEndUnit}
          embedded
          className="pathology-test-range-age-field"
          onChange={({ age, unit }) => onPatchForm({ ageEnd: age, ageEndUnit: unit })}
        />
      </FormField>

      <FormField label="Condition">
        <div className="pathology-test-range-condition">
          <Select
            id={fieldId('condition')}
            className={controlClass}
            value={form.condition || undefined}
            options={conditionOptions}
            placeholder="Select condition"
            onChange={(condition) => onPatchForm({ condition: condition ?? '' })}
          />
          <div className="pathology-test-range-new-condition">
            <Input
              id={fieldId('new-condition')}
              className={controlClass}
              value={form.newCondition}
              placeholder="New condition"
              onChange={(event) => onPatchForm({ newCondition: event.target.value })}
              autoComplete="off"
            />
            <Button type="link" className="pathology-test-range-new-link" onClick={onAddCondition}>
              New
            </Button>
          </div>
        </div>
      </FormField>

      <FormField label="Unit">
        <div className="pathology-test-range-unit">
          <Select
            id={fieldId('unit')}
            className={controlClass}
            value={form.unit || undefined}
            options={unitOptions}
            placeholder="Select unit"
            allowClear
            onChange={(unit) => onPatchForm({ unit: unit ?? '' })}
          />
          <Button
            type="link"
            className="pathology-test-range-conversion-link"
            onClick={onAddConversionRate}
          >
            Add Conversion Rate
          </Button>
        </div>
      </FormField>
    </FormGrid>
  );
}
