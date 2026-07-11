import {
  LAB_MACHINE_OPTIONS,
  TEST_COMPONENT_OPTIONS,
} from '@/features/admin-pathology/api/mock-machine-integration-compwise';

export const MACHINE_INTEGRATION_COMPWISE_INITIAL_VALUES = {
  labMachine: '',
  testComponent: '',
  machineCode: '',
  assayNumber: '',
};

export const MACHINE_INTEGRATION_COMPWISE_FIELDS = [
  {
    type: 'select',
    name: 'labMachine',
    label: 'Lab Machine',
    options: LAB_MACHINE_OPTIONS,
    rules: [{ required: true, message: 'Lab Machine is required.' }],
    props: {
      placeholder: 'Select lab machine',
      showSearch: true,
      optionFilterProp: 'label',
    },
  },
  {
    type: 'select',
    name: 'testComponent',
    label: 'Test Component',
    options: TEST_COMPONENT_OPTIONS,
    rules: [{ required: true, message: 'Test Component is required.' }],
    props: {
      placeholder: 'Select test component',
      showSearch: true,
      optionFilterProp: 'label',
    },
  },
  {
    type: 'text',
    name: 'machineCode',
    label: 'Machine Code',
    rules: [{ required: true, whitespace: true, message: 'Machine Code is required.' }],
  },
  {
    type: 'text',
    name: 'assayNumber',
    label: 'Assay Number',
    rules: [{ required: true, whitespace: true, message: 'Assay Number is required.' }],
  },
];
