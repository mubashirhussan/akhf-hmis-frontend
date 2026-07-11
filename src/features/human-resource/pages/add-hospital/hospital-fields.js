export const HOSPITAL_INITIAL_VALUES = {
  hospitalId: '',
  name: '',
  abbreviation: '',
  address: '',
  city: '',
  phone: '',
  fax: '',
  logo: null,
};

export const HOSPITAL_FILTER_INITIAL_VALUES = {
  name: '',
  abbreviation: '',
  address: '',
  city: '',
  phone: '',
  fax: '',
};

export const HOSPITAL_FIELDS = [
  {
    type: 'text',
    name: 'name',
    label: 'Hospital Name',
    col: 12,
    rules: [{ required: true, whitespace: true, message: 'Hospital Name is required.' }],
    props: { autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'abbreviation',
    label: 'Abbreviation',
    col: 12,
    props: { autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'city',
    label: 'City',
    col: 12,
    rules: [{ required: true, whitespace: true, message: 'City is required.' }],
    props: { placeholder: 'Enter city', autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'phone',
    label: 'Phone #',
    col: 12,
    props: { autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'fax',
    label: 'Fax #',
    col: 12,
    props: { autoComplete: 'off' },
  },
];

export const HOSPITAL_FILTER_FIELDS = [
  {
    type: 'text',
    name: 'name',
    label: 'Hospital Name',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'abbreviation',
    label: 'Abbreviation',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'city',
    label: 'City',
    col: 6,
    floating: true,
    props: { allowClear: true, placeholder: 'Enter city', autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'address',
    label: 'Address',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'phone',
    label: 'Phone #',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'fax',
    label: 'Fax #',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
];
