export const PATIENT_SEARCH_FILTER_INITIAL_VALUES = {
  registrationNo: '',
  cnic: '',
  passportNo: '',
  mobileNo: '',
  registrationDate: '',
  name: '',
};

export const PATIENT_SEARCH_FILTER_FIELDS = [
  {
    type: 'text',
    name: 'registrationNo',
    label: 'Registration #',
    floating: true,
    col: 6,
    props: { allowClear: true,  autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'cnic',
    label: 'CNIC #',
    floating: true,
    col: 6,
    props: { allowClear: true,autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'passportNo',
    label: 'Passport #',
    floating: true,
    col: 6,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'mobileNo',
    label: 'Mobile #',
    floating: true,
    col: 6,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'date',
    name: 'registrationDate',
    label: 'Registration Date',
    floating: true,
    col: 6,
    props: {
      allowClear: true,
      placeholder: 'Select registration date',
      style: { width: '100%' },
      format: 'DD-MM-YYYY',
    },
  },
  {
    type: 'text',
    name: 'name',
    label: 'Name',
    floating: true,
    col: 6,
    props: { allowClear: true, autoComplete: 'off' },
  },
];