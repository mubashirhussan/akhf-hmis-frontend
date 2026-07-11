import { SERVICE_OPTIONS } from '@/features/admin-pathology/api/mock-interpretation';

export const INTERPRETATION_INITIAL_VALUES = {
  serviceName: '',
  templateName: '',
  templateDescription: '',
};

export const INTERPRETATION_FIELDS = [
  {
    type: 'select',
    name: 'serviceName',
    label: 'Service Name',
    col: 12,
    options: SERVICE_OPTIONS,
    rules: [{ required: true, message: 'Service Name is required.' }],
    props: {
      placeholder: 'Select service',
      showSearch: true,
      optionFilterProp: 'label',
    },
  },
  {
    type: 'text',
    name: 'templateName',
    label: 'Template Name',
    col: 12,
    rules: [{ required: true, whitespace: true, message: 'Template Name is required.' }],
  },
  {
    type: 'textarea',
    name: 'templateDescription',
    label: 'Template Description',
    col: 24,
    rules: [
      { required: true, whitespace: true, message: 'Template Description is required.' },
    ],
    props: { rows: 4 },
  },
];
