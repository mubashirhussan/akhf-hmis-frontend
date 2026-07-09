import dayjs from 'dayjs';

export const TEST_BOOKING_INITIAL_VALUES = {
  mainGroup: null,
  testBookingName: '',
  testNames: [],
  service: null,
  specimenRequired: '',
  collectionTime: null,
};

export const getTestBookingFields = ({
  groupOptions = [],
  testNameOptions = [],
  serviceOptions = [],
} = {}) => [
  {
    type: 'text',
    name: 'testBookingName',
    label: 'Test Booking Name',
    col: 12,
    rules: [{ required: true, whitespace: true, message: 'Test Booking Name is required.' }],
    props: { placeholder: 'Add Test Booking Name', autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'specimenRequired',
    label: 'Specimen Required',
    col: 12,
    props: { placeholder: 'Add specimen required', autoComplete: 'off' },
  },
  {
    type: 'time',
    name: 'collectionTime',
    label: 'Collection Time',
    col: 12,
    rules: [{ required: true, message: 'Collection Time is required.' }],
    getValueProps: (v) => ({ value: v ? dayjs(v, 'HH:mm') : null }),
    getValueFromEvent: (t) => (t ? t.format('HH:mm') : null),
  },
  {
    type: 'select',
    name: 'mainGroup',
    label: 'Main Group',
    col: 12,
    options: groupOptions,
    rules: [{ required: true, message: 'Main Group is required.' }],
    props: { allowClear: true },
  },
  {
    type: 'select',
    name: 'testNames',
    label: 'Test Name(s)',
    col: 12,
    options: testNameOptions,
    rules: [{ required: true, type: 'array', min: 1, message: 'Select at least one test.' }],
    props: {
      mode: 'multiple',
      disabled: testNameOptions.length === 0,
      showSearch: true,
      optionFilterProp: 'label',
      maxTagCount: 'responsive',
      maxTagPlaceholder: (omitted) => `+${omitted.length} more`,
      style: { width: '100%' },
    },
  },
  {
    type: 'select',
    name: 'service',
    label: 'Service',
    col: 12,
    options: serviceOptions,
    rules: [{ required: true, message: 'Service is required.' }],
    props: { allowClear: true, showSearch: true, optionFilterProp: 'label' },
  },
];