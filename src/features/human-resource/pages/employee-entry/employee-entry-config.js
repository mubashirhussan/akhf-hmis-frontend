import { EMPLOYEE_INFO_FIELD_PANEL_MAP } from './tabs/EmployeeInfoTab';

export const EMPLOYEE_ENTRY_TABS = {
  INFO: 'employee-info',
  EDUCATION: 'education',
  CERTIFICATES: 'certificates',
  SKILLS: 'skills',
  ADDITIONAL_INFO: 'additional-info',
  RELATIONSHIP: 'relationship',
  DOCUMENTS: 'documents',
  CARD: 'card',
  EMP_CONFIRMATION: 'emp-confirmation',
  RESIGNATION: 'resignation',
  SUSPENSION: 'suspension',
  CONTRACT: 'contract',
  AC_IMPROVEMENT: 'ac-improvement',
  PRO_IMPROVEMENT: 'pro-improvement',
  JOB_HISTORY: 'job-history',
  FILE_LABEL: 'file-label',
  EMP_SUMMARY: 'emp-summary',
  PROMOTION: 'promotion',
};

export const EMPLOYEE_INFO_FIELD_NAMES = Object.keys(EMPLOYEE_INFO_FIELD_PANEL_MAP);

export const EMPLOYEE_LIST_TAB_FIELDS = {
    [EMPLOYEE_ENTRY_TABS.EDUCATION]: 'educations',
  [EMPLOYEE_ENTRY_TABS.CERTIFICATES]: 'certificates',
  [EMPLOYEE_ENTRY_TABS.SKILLS]: 'skills',
  [EMPLOYEE_ENTRY_TABS.ADDITIONAL_INFO]: 'additionalInfos',
  [EMPLOYEE_ENTRY_TABS.RELATIONSHIP]: 'relationships',
  [EMPLOYEE_ENTRY_TABS.DOCUMENTS]: 'documents',
  [EMPLOYEE_ENTRY_TABS.CARD]: 'cards',
  [EMPLOYEE_ENTRY_TABS.EMP_CONFIRMATION]: 'empConfirmations',
  [EMPLOYEE_ENTRY_TABS.RESIGNATION]: 'resignations',
  [EMPLOYEE_ENTRY_TABS.SUSPENSION]: 'suspensions',
  [EMPLOYEE_ENTRY_TABS.CONTRACT]: 'contracts',
  [EMPLOYEE_ENTRY_TABS.AC_IMPROVEMENT]: 'acImprovements',
  [EMPLOYEE_ENTRY_TABS.PRO_IMPROVEMENT]: 'proImprovements',
  [EMPLOYEE_ENTRY_TABS.JOB_HISTORY]: 'jobHistories',
  [EMPLOYEE_ENTRY_TABS.FILE_LABEL]: 'fileLabels',
  [EMPLOYEE_ENTRY_TABS.EMP_SUMMARY]: 'empSummaries',
  [EMPLOYEE_ENTRY_TABS.PROMOTION]: 'promotions',
};

export const TAB_SAVE_LABELS = {
  [EMPLOYEE_ENTRY_TABS.INFO]: 'Save Employee Info',
  [EMPLOYEE_ENTRY_TABS.EDUCATION]: 'Save Education',
  [EMPLOYEE_ENTRY_TABS.CERTIFICATES]: 'Save Certificates',
  [EMPLOYEE_ENTRY_TABS.SKILLS]: 'Save Skills',
  [EMPLOYEE_ENTRY_TABS.ADDITIONAL_INFO]: 'Save Additional Info',
  [EMPLOYEE_ENTRY_TABS.RELATIONSHIP]: 'Save Relationship',
  [EMPLOYEE_ENTRY_TABS.DOCUMENTS]: 'Save Documents',
  [EMPLOYEE_ENTRY_TABS.CARD]: 'Save Card',
  [EMPLOYEE_ENTRY_TABS.EMP_CONFIRMATION]: 'Save Employee Confirmation',
  [EMPLOYEE_ENTRY_TABS.RESIGNATION]: 'Save Resignation',
  [EMPLOYEE_ENTRY_TABS.SUSPENSION]: 'Save Suspension',
  [EMPLOYEE_ENTRY_TABS.CONTRACT]: 'Save Contract',
  [EMPLOYEE_ENTRY_TABS.AC_IMPROVEMENT]: 'Save Academic Improvement',
  [EMPLOYEE_ENTRY_TABS.PRO_IMPROVEMENT]: 'Save Professional Improvement',
  [EMPLOYEE_ENTRY_TABS.JOB_HISTORY]: 'Save Job History',
  [EMPLOYEE_ENTRY_TABS.FILE_LABEL]: 'Save File Label',
  [EMPLOYEE_ENTRY_TABS.EMP_SUMMARY]: 'Save Employee Summary',
  [EMPLOYEE_ENTRY_TABS.PROMOTION]: 'Save Promotion',
};

export const TAB_SAVE_SUCCESS_MESSAGES = {
  [EMPLOYEE_ENTRY_TABS.INFO]: 'Employee info saved',
  [EMPLOYEE_ENTRY_TABS.EDUCATION]: 'Education saved',
  [EMPLOYEE_ENTRY_TABS.CERTIFICATES]: 'Certificates saved',
  [EMPLOYEE_ENTRY_TABS.SKILLS]: 'Skills saved',
  [EMPLOYEE_ENTRY_TABS.ADDITIONAL_INFO]: 'Additional info saved',
  [EMPLOYEE_ENTRY_TABS.RELATIONSHIP]: 'Relationship saved',
  [EMPLOYEE_ENTRY_TABS.DOCUMENTS]: 'Documents saved',
  [EMPLOYEE_ENTRY_TABS.CARD]: 'Card saved',
  [EMPLOYEE_ENTRY_TABS.EMP_CONFIRMATION]: 'Emp confirmation saved',
  [EMPLOYEE_ENTRY_TABS.RESIGNATION]: 'Resignation saved',
  [EMPLOYEE_ENTRY_TABS.SUSPENSION]: 'Suspension saved',
  [EMPLOYEE_ENTRY_TABS.CONTRACT]: 'Contract saved',
  [EMPLOYEE_ENTRY_TABS.AC_IMPROVEMENT]: 'Academic Improvement saved',
  [EMPLOYEE_ENTRY_TABS.PRO_IMPROVEMENT]: 'Professional Improvement saved',
  [EMPLOYEE_ENTRY_TABS.JOB_HISTORY]: 'Job history saved',
  [EMPLOYEE_ENTRY_TABS.FILE_LABEL]: 'File label saved',
  [EMPLOYEE_ENTRY_TABS.EMP_SUMMARY]: 'Emp summary saved',
  [EMPLOYEE_ENTRY_TABS.PROMOTION]: 'Promotion saved',
};

export const EMPLOYEE_ENTRY_TAB_ORDER = [
  EMPLOYEE_ENTRY_TABS.INFO,
  EMPLOYEE_ENTRY_TABS.EDUCATION,
  EMPLOYEE_ENTRY_TABS.CERTIFICATES,
  EMPLOYEE_ENTRY_TABS.SKILLS,
  EMPLOYEE_ENTRY_TABS.ADDITIONAL_INFO,
  EMPLOYEE_ENTRY_TABS.RELATIONSHIP,
  EMPLOYEE_ENTRY_TABS.DOCUMENTS,
  EMPLOYEE_ENTRY_TABS.CARD,
  EMPLOYEE_ENTRY_TABS.EMP_CONFIRMATION,
  EMPLOYEE_ENTRY_TABS.RESIGNATION,
  EMPLOYEE_ENTRY_TABS.SUSPENSION,
  EMPLOYEE_ENTRY_TABS.CONTRACT,
  EMPLOYEE_ENTRY_TABS.AC_IMPROVEMENT,
  EMPLOYEE_ENTRY_TABS.PRO_IMPROVEMENT,
  EMPLOYEE_ENTRY_TABS.JOB_HISTORY,
  EMPLOYEE_ENTRY_TABS.FILE_LABEL,
  EMPLOYEE_ENTRY_TABS.EMP_SUMMARY,
  EMPLOYEE_ENTRY_TABS.PROMOTION,
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
    educations: [],
  certificates: [],
  skills: [],
  additionalInfos: [],
  relationships: [],
  documents: [],
  cards: [],
  empConfirmations: [],
  resignations: [],
  suspensions: [],
  contracts: [],
  acImprovements: [],
  proImprovements: [],
  jobHistories: [],
  fileLabels: [],
  empSummaries: [],
  promotions: [],
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

  nextValues.educations = employee.educations ?? [];
  nextValues.certificates = employee.certificates ?? [];
  nextValues.skills = employee.skills ?? [];
  nextValues.additionalInfos = employee.additionalInfos ?? [];
  nextValues.relationships = employee.relationships ?? [];
  nextValues.documents = employee.documents ?? [];
  nextValues.cards = employee.cards ?? [];
  nextValues.empConfirmations = employee.empConfirmations ?? [];
  nextValues.resignations = employee.resignations ?? [];
  nextValues.suspensions = employee.suspensions ?? [];
  nextValues.contracts = employee.contracts ?? [];
  nextValues.acImprovements = employee.acImprovements ?? [];
  nextValues.proImprovements = employee.proImprovements ?? [];
  nextValues.jobHistories = employee.jobHistories ?? [];
  nextValues.fileLabels = employee.fileLabels ?? [];
  nextValues.empSummaries = employee.empSummaries ?? [];
  nextValues.promotions = employee.promotions ?? [];

  return nextValues;
}
