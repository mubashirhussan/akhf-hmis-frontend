import { DOB_AGE_UNITS } from '@/lib/dob-from-age';

export const BILLING_VISIT_FILTER_INITIAL_VALUES = {
  visitNo: '',
  mrNo: '',
  patientAge: { age: '', unit: DOB_AGE_UNITS.years },
  registrationDate: null,
  cnic: '',
  mobile: '',
  firstName: '',
  middleName: '',
  lastName: '',
  relationFirstName: '',
  relationMiddleName: '',
  relationLastName: '',
};

export function normalizeBillingVisitFilters(values = {}) {
  const { patientAge, ...rest } = values;

  return {
    ...rest,
    patientAge: patientAge?.age ?? '',
    ageUnit: patientAge?.unit ?? DOB_AGE_UNITS.years,
  };
}

export const BILLING_VISIT_FILTER_FIELDS = [
  {
    type: 'text',
    name: 'visitNo',
    label: 'Visit #',
    col: 6,
    floating: true,
    getValueFromEvent: (e) => String(e?.target?.value ?? '').replace(/\D/g, ''),
    props: {
      allowClear: true,
      inputMode: 'numeric',
      maxLength: 12,
      placeholder: 'e.g. 2026',
      autoComplete: 'off',
    },
  },
  {
    type: 'text',
    name: 'mrNo',
    label: 'MR #',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'age',
    name: 'patientAge',
    label: 'Patient Age',
    col: 6,
    floating: true,
    props: { className: 'patient-reg-dob-age age-unit-field--no-dob' },
  },
  {
    type: 'date',
    name: 'registrationDate',
    label: 'Registration Date',
    col: 6,
    floating: true,
    props: { format: 'DD/MM/YYYY', allowClear: true },
  },
  {
    type: 'text',
    name: 'cnic',
    label: 'CNIC #',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'mobile',
    label: 'Mobile #',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'firstName',
    label: 'First Name',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'middleName',
    label: 'Middle Name',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'lastName',
    label: 'Last Name',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'relationFirstName',
    label: 'Relation First Name',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'relationMiddleName',
    label: 'Relation Middle Name',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
  {
    type: 'text',
    name: 'relationLastName',
    label: 'Relation Last Name',
    col: 6,
    floating: true,
    props: { allowClear: true, autoComplete: 'off' },
  },
];
