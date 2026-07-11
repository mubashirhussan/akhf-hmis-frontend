export const COMPANY_TYPE_OPTIONS = [
  { label: 'Gov', value: 'gov' },
  { label: 'Semi Gov', value: 'semi-gov' },
  { label: 'Priv', value: 'priv' },
];

export const STATUS_OPTIONS = [
  { label: 'Individuals', value: 'individuals' },
  { label: 'NGO', value: 'ngo' },
  { label: 'Business', value: 'business' },
  { label: 'Trust', value: 'trust' },
];

export const COMPANY_INITIAL_VALUES = {
  companyType: undefined,
  companyName: '',
  ntn: null,
  city: '',
  address: '',
  contactPersonName: '',
  cnic: '',
  phone: '',
  fax: null,
  email: '',
  website: '',
  str: null,
  bankAccount: '',
  status: undefined,
};

export const COMPANY_FILTER_INITIAL_VALUES = {
  companyType: undefined,
  title: '',
  city: '',
  email: '',
  website: '',
  status: undefined,
};

export const COMPANY_FIELDS = [
  {
    type: 'select',
    name: 'companyType',
    label: 'Company Type',
    col: 12,
    options: COMPANY_TYPE_OPTIONS,
    rules: [{ required: true, message: 'Company Type is required.' }],
  },
  {
    type: 'text',
    name: 'companyName',
    label: 'Company / Party Name',
    col: 12,
    rules: [{ required: true, whitespace: true, message: 'Company Name is required.' }],
  },
  {
    type: 'number',
    name: 'ntn',
    label: 'NTN #',
    col: 12,
  },
  {
    type: 'text',
    name: 'city',
    label: 'City',
    col: 12,
    rules: [{ required: true, whitespace: true, message: 'City is required.' }],
  },
  {
    type: 'textarea',
    name: 'address',
    label: 'Address',
    col: 12,
    props: { rows: 3 },
  },
  {
    type: 'text',
    name: 'contactPersonName',
    label: 'Contact Person Name',
    col: 12,
  },
  {
    type: 'text',
    name: 'cnic',
    label: 'CNIC',
    col: 12,
  },
  {
    type: 'text',
    name: 'phone',
    label: 'Phone',
    col: 12,
  },
  {
    type: 'number',
    name: 'fax',
    label: 'Fax',
    col: 12,
  },
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    col: 12,
    rules: [{ required: true, whitespace: true, message: 'Email is required.' }],
    props: { type: 'email' },
  },
  {
    type: 'text',
    name: 'website',
    label: 'Website',
    col: 12,
    rules: [{ required: true, whitespace: true, message: 'Website is required.' }],
    props: { type: 'url' },
  },
  {
    type: 'number',
    name: 'str',
    label: 'STR #',
    col: 12,
  },
  {
    type: 'text',
    name: 'bankAccount',
    label: 'Bank A/C No.',
    col: 12,
  },
  {
    type: 'select',
    name: 'status',
    label: 'Status',
    col: 12,
    options: STATUS_OPTIONS,
    rules: [{ required: true, message: 'Status is required.' }],
  },
];

export const COMPANY_FILTER_FIELDS = [
  {
    type: 'select',
    name: 'companyType',
    label: 'Company Type',
    col: 6,
    floating: true,
    options: COMPANY_TYPE_OPTIONS,
    props: { allowClear: true, placeholder: 'Select type' },
  },
  {
    type: 'text',
    name: 'title',
    label: 'Company Title',
    col: 6,
    floating: true,
    props: { allowClear: true, placeholder: 'Enter title', autoComplete: 'off' },
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
    type: 'select',
    name: 'status',
    label: 'Status',
    col: 6,
    floating: true,
    options: STATUS_OPTIONS,
    props: { allowClear: true, placeholder: 'Select status' },
  },
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    col: 6,
    floating: true,
    props: { allowClear: true, placeholder: 'Enter email', autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'website',
    label: 'Website',
    col: 6,
    floating: true,
    props: { allowClear: true, placeholder: 'Enter website', autoComplete: 'off' },
  },
];
