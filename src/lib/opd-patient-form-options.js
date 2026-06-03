import { DOB_AGE_UNITS } from '@/lib/dob-from-age';

export const TITLE_OPTIONS = [
  { value: 'mr', label: 'Mr.' },
  { value: 'miss', label: 'Miss' },
  { value: 'mrs', label: 'Mrs.' },
  { value: 'b', label: 'B' },
  { value: 'mas', label: 'Mas.' },
];

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

export const CITY_OPTIONS = [
  { value: 'peshawar', label: 'Peshawar' },
  { value: 'islamabad', label: 'Islamabad' },
  { value: 'lahore', label: 'Lahore' },
];

export const TOWN_OPTIONS = [
  { value: 'town-1', label: 'Peshawar Town-1' },
  { value: 'town-2', label: 'Peshawar Town-2' },
];

export const SPECIALITY_OPTIONS = [
  { value: 'gynae', label: 'Gynae' },
  { value: 'medicine', label: 'Medicine' },
  { value: 'surgery', label: 'Surgery' },
];

export const DOCTOR_OPTIONS = [
  { value: 'nabeela', label: 'NABEELA RAUF' },
  { value: 'ali', label: 'Dr. Ali' },
  { value: 'khan', label: 'Dr. Khan' },
];

export const PRIMARY_CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'employee', label: 'Employee' },
  { value: 'panel', label: 'Panel' },
  { value: 'pwf', label: 'Patient Welfare Fund' },
];

export const LAB_CATEGORY_OPTIONS = [
  { value: 'b2b', label: 'B2B LABS' },
  { value: 'friendMedical', label: 'Friend Medical Lab' },
  { value: 'rdl', label: 'The real lab (RDL)' },
];

export const CHECKUP_TYPE_OPTIONS = [
  { value: 'routine', label: 'Routine' },
  { value: 'emergency', label: 'Emergency' },
];

export const COMPLAINT_OPTIONS = [
  { value: 'fever', label: 'Fever' },
  { value: 'pain', label: 'Pain' },
  { value: 'checkup', label: 'General Checkup' },
];

export const LAB_OPTIONS = [
  { value: 'chughtai', label: 'Chughtai Lab' },
  { value: 'excel', label: 'Excel Lab' },
  { value: 'dr-essa', label: 'Dr. Essa Laboratory' },
];

export const RELIGION_OPTIONS = [
  { value: 'islam', label: 'Islam' },
  { value: 'hindu', label: 'Hindu' },
  { value: 'christian', label: 'Christian' },
  { value: 'other', label: 'Other' },
];

export const NATIONALITY_OPTIONS = [
  { value: 'pakistani', label: 'Pakistani' },
  { value: 'afghan', label: 'Afghan' },
  { value: 'other', label: 'Other' },
];

export const COUNTRY_OPTIONS = [{ value: 'pakistan', label: 'PAKISTAN' }];

export const PROVINCE_OPTIONS = [
  { value: 'kp', label: 'Khyber Pakhtunkhwa' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'sindh', label: 'Sindh' },
];

export const DISTRICT_OPTIONS = [
  { value: 'peshawar', label: 'Peshawar' },
  { value: 'mardan', label: 'Mardan' },
  { value: 'swat', label: 'Swat' },
];

export const KIN_TITLE_OPTIONS = [
  { value: 'mr', label: 'Mr.' },
  { value: 'miss', label: 'Miss' },
  { value: 'mrs', label: 'Mrs.' },
];

export const KIN_GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export const KIN_RELATION_OPTIONS = [
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'other', label: 'Other' },
];

export const PATIENT_FORM_INITIAL_VALUES = {
  title: 'mr',
  guardianRelation: 'so',
  gender: 'male',
  city: 'peshawar',
  town: 'town-1',
  dobAge: { age: '', unit: DOB_AGE_UNITS.years, dob: null },
  religion: 'islam',
  nationality: 'pakistani',
  country: 'pakistan',
  province: 'kp',
  district: 'peshawar',
  addressCity: 'peshawar',
  kinTitle: 'mr',
  kinGender: 'male',
  kinRelation: 'son',
  kinCountry: 'pakistan',
  primaryCategory: 'general',
  labCategory: 'friendMedical',
  speciality: 'gynae',
  doctor: 'nabeela',
  checkupType: 'routine',
  panelReference: '700',
};

export const DEFAULT_OPEN_PANELS = ['patient', 'general'];

export const REQUIRED_RULE = (message) => [
  { required: true, message, validateTrigger: ['onSubmit', 'onChange'] },
];

export const dobAgeValidator = (_, value) => {
  const age = value?.age?.trim?.() ?? '';
  if (!age || Number(age) <= 0) {
    return Promise.reject(new Error('Age is required'));
  }
  return Promise.resolve();
};

export const dobAgeRules = [
  { validator: dobAgeValidator, validateTrigger: ['onSubmit', 'onChange'] },
];
