export { dobAgeRules } from '@/features/opd/utils/opd-patient-form-options';

export const TITLE_OPTIONS = [
  { value: 'mr', label: 'Mr.' },
  { value: 'miss', label: 'Miss' },
  { value: 'mrs', label: 'Mrs.' },
  { value: 'bo', label: 'B/O' },
];

export const RELATION_OPTIONS = [
  { value: 'so', label: 'S/O' },
  { value: 'do', label: 'D/O' },
  { value: 'wo', label: 'W/O' },
];

export const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'panel', label: 'Panel' },
  { value: 'b2b', label: 'B2B LABS' },
];

export const PATIENT_TYPE_OPTIONS = [
  { value: 'opd', label: 'OPD' },
  { value: 'ipd', label: 'IPD' },
];

export const CHECKUP_TYPE_OPTIONS = [
  { value: 'routine', label: 'Routine' },
  { value: 'emergency', label: 'Emergency' },
];

export const LAB_OPTIONS = [
  { value: 'chughtai', label: 'Chughtai Lab' },
  { value: 'excel', label: 'Excel Lab' },
  { value: 'dr-essa', label: 'Dr. Essa Laboratory' },
  { value: 'shaukat', label: 'Shaukat Khanum Lab' },
];

export const SERVICE_CATEGORY_MAP = {
  1: 'Consultation',
  2: 'Laboratory',
  3: 'Radiology',
  4: 'Pharmacy',
  5: 'Procedure',
};

export const SERVICE_CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Category' },
  { value: 1, label: 'Consultation' },
  { value: 2, label: 'Laboratory' },
  { value: 3, label: 'Radiology' },
  { value: 4, label: 'Pharmacy' },
  { value: 5, label: 'Procedure' },
];

export const DEPARTMENT_OPTIONS = [
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'private', label: 'Private' },
  { value: 'radiology', label: 'Radiology' },
];

export const INSURER_OPTIONS = [
  { value: 'ptcl', label: 'PTCL' },
  { value: 'ssp', label: 'SSP' },
  { value: 'state-life', label: 'State Life' },
];