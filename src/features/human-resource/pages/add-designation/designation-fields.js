export const DESIGNATION_INITIAL_VALUES = {
  designation: '',
  minPayScale: undefined,
};

export const DESIGNATION_FILTER_INITIAL_VALUES = {
  designation: '',
};

export const DESIGNATION_FIELDS = [
  {
    type: 'text',
    name: 'designation',
    label: 'Designation',
    rules: [{ required: true, whitespace: true, message: 'Designation is required.' }],
    props: { autoComplete: 'off' },
  },
  {
    type: 'number',
    name: 'minPayScale',
    label: 'Minimum Pay Scale',
    rules: [{ required: true, message: 'Minimum Pay Scale is required.' }],
    props: {
      min: 0,
      precision: 0,
      formatter: (val) => (val ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''),
      parser: (val) => val?.replace(/,/g, '') ?? '',
    },
  },
];

export const DESIGNATION_FILTER_FIELDS = [
  {
    type: 'text',
    name: 'designation',
    label: 'Designation Name',
    floating: true,
    col: 6,
    props: { allowClear: true, autoComplete: 'off' },
  },
];
