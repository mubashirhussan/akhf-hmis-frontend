import { DOB_AGE_UNITS } from '@/lib/dob-from-age';
import DobAgeField from '@/components/ui/DobAgeField';

export const RELATION_OPTIONS = [
  { value: 'so', label: 'S/O' },
  { value: 'do', label: 'D/O' },
  { value: 'wo', label: 'W/O' },
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const ARRIVAL_STATUS_OPTIONS = [
  { value: 'ambulatory', label: 'Ambulatory' },
  { value: 'stretcher', label: 'Stretcher' },
  { value: 'wheelChair', label: 'Wheel Chair' },
  { value: 'bed', label: 'Bed' },
];

export const PATIENT_CONDITION_OPTIONS = [
  { value: 'stable', label: 'Stable' },
  { value: 'serious', label: 'Serious' },
  { value: 'critical', label: 'Critical' },
  { value: 'broughtDead', label: 'Brought Dead' },
];

export const DEPARTMENT_OPTIONS = [
  { value: 'emergency', label: 'Emergency' },
  { value: 'icu', label: 'ICU' },
  { value: 'opd', label: 'OPD' },
  { value: 'ward', label: 'Ward' },
];

export const DOCTOR_OPTIONS = [
  { value: 'emergency', label: 'Emergency' },
  { value: 'general', label: 'General' },
  { value: 'surgical', label: 'Surgical' },
];

export const EMERGENCY_FORM_INITIAL_VALUES = {
  relation: 'so',
  dobAge: { age: '', unit: DOB_AGE_UNITS.years, dob: null },
  arrivalStatus: 'ambulatory',
  patientCondition: 'stable',
  department: 'emergency',
  doctor: 'emergency',
};

const requiredRule = (msg) => [
  { required: true, whitespace: true, message: msg },
];

const dobAgeValidator = (_, value) => {
  const age = value?.age?.trim?.() ?? '';
  if (!age || Number(age) <= 0) {
    return Promise.reject(new Error('Age is required'));
  }
  return Promise.resolve();
};

const dobAgeRules = [
  { validator: dobAgeValidator, validateTrigger: ['onChange', 'onSubmit'] },
];

function DobAgeFormControl({ value, onChange }) {
  return (
    <DobAgeField
      embedded
      className="patient-reg-dob-age"
      age={value?.age ?? ''}
      unit={value?.unit ?? DOB_AGE_UNITS.years}
      onChange={onChange}
    />
  );
}

export const SEARCH_FIELDS = [
  {
    type: 'text',
    name: 'regNo',
    label: 'Reg No',
    floating: true,
    span: 8,
    props: { placeholder: 'Enter Registration Number' },
  },
  {
    type: 'text',
    name: 'visit',
    label: 'Visit #',
    floating: true,
    span: 8,
    props: { placeholder: 'Enter Visit Number' },
  },
];

export const PATIENT_INFO_FIELDS = [
  {
    type: 'text',
    name: 'firstName',
    label: 'First Name',
    floating: true,
    span: 6,
    rules: requiredRule('First name is required'),
    validateTrigger: ['onChange', 'onSubmit'],
    props: { placeholder: 'Enter First Name' },
  },
  {
    type: 'select',
    name: 'relation',
    label: 'Relation',
    floating: true,
    span: 6,
    options: RELATION_OPTIONS,
  },
  {
    type: 'text',
    name: 'relationFirstName',
    label: 'Relation First Name',
    floating: true,
    span: 6,
    props: { placeholder: 'Enter First Name' },
  },
  {
    type: 'text',
    name: 'admitBy',
    label: 'Admit By',
    floating: true,
    span: 6,
    props: { placeholder: 'Enter Name' },
  },
  {
    type: 'dobAge',
    name: 'dobAge',
    label: 'DOB / Age',
    floating: true,
    span: 6,
    rules: dobAgeRules,
    validateTrigger: ['onChange', 'onSubmit'],
    props: { component: DobAgeFormControl },
  },
  {
    type: 'select',
    name: 'patientGender',
    label: 'Patient Gender',
    floating: true,
    span: 6,
    options: GENDER_OPTIONS,
    rules: requiredRule('Gender is required'),
    validateTrigger: ['onChange', 'onSubmit'],
    props: { placeholder: 'Gender' },
  },
  {
    type: 'text',
    name: 'mobile',
    label: 'Mobile #',
    floating: true,
    span: 6,
    props: { placeholder: 'Enter Mobile Number' },
  },
  {
    type: 'text',
    name: 'address',
    label: 'Address',
    floating: true,
    span: 6,
    props: { placeholder: 'Enter Address here...' },
  },
  {
    type: 'select',
    name: 'department',
    label: 'Department',
    floating: true,
    span: 6,
    options: DEPARTMENT_OPTIONS,
  },
  {
    type: 'select',
    name: 'doctor',
    label: 'Doctor',
    floating: true,
    span: 6,
    options: DOCTOR_OPTIONS,
  },
  {
    type: 'select',
    name: 'arrivalStatus',
    label: 'Arrival Status',
    floating: true,
    span: 6,
    options: ARRIVAL_STATUS_OPTIONS,
  },
  {
    type: 'select',
    name: 'patientCondition',
    label: 'Patient Condition',
    floating: true,
    span: 6,
    options: PATIENT_CONDITION_OPTIONS,
  },
  {
    type: 'textarea',
    name: 'admittedDiagnosis',
    label: 'Admitted Diagnosis',
    floating: true,
    span: 12,
    props: {
      placeholder: 'Enter here...',
      rows: 3,
      className: 'pl-4! pt-3!',
    },
  },
];
