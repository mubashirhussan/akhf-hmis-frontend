import { EMPLOYEE_INFO_FIELD_PANEL_MAP } from './tabs/EmployeeInfoTab';

export const EMPLOYEE_ENTRY_TABS = {
  INFO: 'employee-info',
  CERTIFICATES: 'certificates',
  DOCUMENTS: 'documents',
  SKILLS: 'skills',
  RELATIONSHIP: 'relationship',
};

export const EMPLOYEE_INFO_FIELD_NAMES = Object.keys(EMPLOYEE_INFO_FIELD_PANEL_MAP);

export const EMPLOYEE_LIST_TAB_FIELDS = {
  [EMPLOYEE_ENTRY_TABS.CERTIFICATES]: 'certificates',
  [EMPLOYEE_ENTRY_TABS.DOCUMENTS]: 'documents',
  [EMPLOYEE_ENTRY_TABS.SKILLS]: 'skills',
  [EMPLOYEE_ENTRY_TABS.RELATIONSHIP]: 'relationships',
};

export const TAB_SAVE_LABELS = {
  [EMPLOYEE_ENTRY_TABS.INFO]: 'Save Employee Info',
  [EMPLOYEE_ENTRY_TABS.CERTIFICATES]: 'Save Certificates',
  [EMPLOYEE_ENTRY_TABS.DOCUMENTS]: 'Save Documents',
  [EMPLOYEE_ENTRY_TABS.SKILLS]: 'Save Skills',
  [EMPLOYEE_ENTRY_TABS.RELATIONSHIP]: 'Save Relationship',
};

export const TAB_SAVE_SUCCESS_MESSAGES = {
  [EMPLOYEE_ENTRY_TABS.INFO]: 'Employee info saved',
  [EMPLOYEE_ENTRY_TABS.CERTIFICATES]: 'Certificates saved',
  [EMPLOYEE_ENTRY_TABS.DOCUMENTS]: 'Documents saved',
  [EMPLOYEE_ENTRY_TABS.SKILLS]: 'Skills saved',
  [EMPLOYEE_ENTRY_TABS.RELATIONSHIP]: 'Relationship saved',
};

export const EMPLOYEE_ENTRY_TAB_ORDER = [
  EMPLOYEE_ENTRY_TABS.INFO,
  EMPLOYEE_ENTRY_TABS.CERTIFICATES,
  EMPLOYEE_ENTRY_TABS.DOCUMENTS,
  EMPLOYEE_ENTRY_TABS.SKILLS,
  EMPLOYEE_ENTRY_TABS.RELATIONSHIP,
];

export function getNextEmployeeEntryTab(currentTab) {
  const index = EMPLOYEE_ENTRY_TAB_ORDER.indexOf(currentTab);
  if (index === -1 || index >= EMPLOYEE_ENTRY_TAB_ORDER.length - 1) {
    return null;
  }
  return EMPLOYEE_ENTRY_TAB_ORDER[index + 1];
}

export const DEFAULT_OPEN_PANELS = ['general', 'address'];

export const initialValues = {
  title: 'mr',
  relationType: 'so',
  gender: 'male',
  employeeType: 'na',
  nationality: 'pakistani',
  otherNationality: 'pakistani',
  placeOfBirth: 'abbotabad',
  religion: 'islam',
  maritalStatus: 'single',
  domicile: 'abbotabad',
  bloodGroup: 'nil',
  districtName: 'abbotabad',
  tehsilName: 'abbotabad',
  designation: 'neuro-surgeon',
  grade: '1',
  hospital: 'alkhidmat-diagnostics-karachi',
  department: 'administration',
  subDepartment: 'administration',
  shift: 'evening',
  salaryMode: 'cash',
  isConsultant: false,
  certificates: [],
  documents: [],
  skills: [],
  relationships: [],
};

export function employeeToFormValues(employee) {
  if (!employee) {
    return { ...initialValues };
  }

  const nextValues = { ...initialValues };

  for (const fieldName of EMPLOYEE_INFO_FIELD_NAMES) {
    if (fieldName in employee && employee[fieldName] !== undefined) {
      nextValues[fieldName] = employee[fieldName];
    }
  }

  nextValues.certificates = employee.certificates ?? [];
  nextValues.documents = employee.documents ?? [];
  nextValues.skills = employee.skills ?? [];
  nextValues.relationships = employee.relationships ?? [];

  return nextValues;
}
