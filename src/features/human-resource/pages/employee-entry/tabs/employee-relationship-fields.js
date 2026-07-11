export const TITLE_OPTIONS = [
  { label: 'Mr', value: 'mr' },
  { label: 'Mrs', value: 'mrs' },
  { label: 'Miss', value: 'miss' },
  { label: 'Dr', value: 'dr' },
  { label: 'Prof', value: 'prof' },
];

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export const RELATION_OPTIONS = [
  { label: 'Father', value: 'father' },
  { label: 'Mother', value: 'mother' },
  { label: 'Spouse', value: 'spouse' },
  { label: 'Son', value: 'son' },
  { label: 'Daughter', value: 'daughter' },
  { label: 'Brother', value: 'brother' },
  { label: 'Sister', value: 'sister' },
  { label: 'Guardian', value: 'guardian' },
];

export const RELATIONSHIP_DEFAULT_ROW = {
  title: null,
  firstName: '',
  lastName: '',
  relation: null,
  gender: null,
  age: '',
  cnic: '',
  contactNo: '',
};

/** Relative field names for EmployeeEntryListTab (list index applied by the list renderer). */
export const RELATIONSHIP_FIELDS = [
  {
    type: 'select',
    name: 'title',
    label: 'Title',
    floating: true,
    span: 6,
    options: TITLE_OPTIONS,
    props: { allowClear: true },
  },
  {
    type: 'text',
    name: 'firstName',
    label: 'First Name',
    floating: true,
    span: 6,
    required: true,
    rules: [{ required: true, whitespace: true, message: 'First name is required' }],
  },
  {
    type: 'text',
    name: 'lastName',
    label: 'Last Name',
    floating: true,
    span: 6,
    required: true,
    rules: [{ required: true, whitespace: true, message: 'Last name is required' }],
  },
  {
    type: 'select',
    name: 'relation',
    label: 'Relation',
    floating: true,
    span: 6,
    required: true,
    rules: [{ required: true, message: 'Relation is required' }],
    options: RELATION_OPTIONS,
    props: { allowClear: true },
  },
  {
    type: 'select',
    name: 'gender',
    label: 'Gender',
    floating: true,
    span: 6,
    options: GENDER_OPTIONS,
    props: { allowClear: true },
  },
  {
    type: 'text',
    name: 'age',
    label: 'Age',
    floating: true,
    span: 6,
  },
  {
    type: 'text',
    name: 'cnic',
    label: 'CNIC',
    floating: true,
    span: 6,
  },
  {
    type: 'text',
    name: 'contactNo',
    label: 'Contact No',
    floating: true,
    span: 6,
  },
];
