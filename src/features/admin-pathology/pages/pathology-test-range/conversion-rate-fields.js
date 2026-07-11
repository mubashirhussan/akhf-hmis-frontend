export const CONVERSION_RATE_INITIAL_VALUES = {
  unit: '',
  conversionRate: '',
};

export const CONVERSION_RATE_FIELDS = [
  {
    type: 'text',
    name: 'unit',
    label: 'Unit',
    rules: [{ required: true, whitespace: true, message: 'Unit is required.' }],
    props: {
      placeholder: 'Null',
      autoComplete: 'off',
    },
  },
  {
    type: 'text',
    name: 'conversionRate',
    label: 'Conversion Rate',
    rules: [
      { required: true, whitespace: true, message: 'Conversion Rate is required.' },
    ],
    props: { autoComplete: 'off' },
  },
];
