'use client';

import { Input, Select } from 'antd';
import FormField from '@/components/ui/FormField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  LAB_MACHINE_OPTIONS,
  TEST_COMPONENT_OPTIONS,
} from '@/features/admin-pathology/api/mock-machine-integration-compwise';

const controlClass = FIELD_CONTROL_CLASS;

export default function MachineIntegrationCompwiseForm({
  form,
  errors = {},
  onPatchForm,
  onClearError,
}) {
  const fieldId = (name) => `machine-integration-compwise-${name}`;

  return (
    <FormGrid columns={1} className="machine-integration-compwise-form-grid">
      <FormField
        label="Lab Machine"
        required
        error={errors?.labMachine}
      >
        <Select
          id={fieldId('lab-machine')}
          className={controlClass}
          status={errors?.labMachine ? 'error' : ''}
          value={form.labMachine || undefined}
          options={LAB_MACHINE_OPTIONS}
          placeholder="Select lab machine"
          showSearch
          optionFilterProp="label"
          onChange={(labMachine) => {
            onPatchForm({ labMachine });
            onClearError?.('labMachine');
          }}
        />
      </FormField>

      <FormField
        label="Test Component"
        required
        error={errors?.testComponent}
      >
        <Select
          id={fieldId('test-component')}
          className={controlClass}
          status={errors?.testComponent ? 'error' : ''}
          value={form.testComponent || undefined}
          options={TEST_COMPONENT_OPTIONS}
          placeholder="Select test component"
          showSearch
          optionFilterProp="label"
          onChange={(testComponent) => {
            onPatchForm({ testComponent });
            onClearError?.('testComponent');
          }}
        />
      </FormField>

      <FormField
        label="Machine Code"
        required
        error={errors?.machineCode}
      >
        <Input
          id={fieldId('machine-code')}
          className={controlClass}
          status={errors?.machineCode ? 'error' : ''}
          value={form.machineCode}
          onChange={(e) => {
            onPatchForm({ machineCode: e.target.value });
            onClearError?.('machineCode');
          }}
        />
      </FormField>

      <FormField
        label="Assay Number"
        required
        error={errors?.assayNumber}
      >
        <Input
          id={fieldId('assay-number')}
          className={controlClass}
          status={errors?.assayNumber ? 'error' : ''}
          value={form.assayNumber}
          onChange={(e) => {
            onPatchForm({ assayNumber: e.target.value });
            onClearError?.('assayNumber');
          }}
        />
      </FormField>
    </FormGrid>
  );
}
