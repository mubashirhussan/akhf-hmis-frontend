export const CREATE_LOGIN_DEPARTMENTS = [
  { id: '1', name: 'ADMINISTRATION' },
  { id: '2', name: 'LABORATORY' },
  { id: '3', name: 'MEDICAL STAFF' },
];

export const CREATE_LOGIN_SUB_DEPARTMENTS = [
  { id: '1', departmentId: '1', name: 'Front Desk' },
  { id: '2', departmentId: '1', name: 'Administration' },
  { id: '3', departmentId: '2', name: 'Laboratory' },
  { id: '4', departmentId: '3', name: 'Paeds' },
  { id: '5', departmentId: '3', name: 'Emergency' },
];

export const CREATE_LOGIN_EMPLOYEES = [
  {
    id: '1',
    departmentId: '1',
    subDepartmentId: '2',
    name: 'MUHAMMAD YOUSAF',
    employeeNo: 'EMP-089',
  },
  {
    id: '2',
    departmentId: '1',
    subDepartmentId: '1',
    name: 'Sohail Ahmad',
    employeeNo: 'EMP-001',
  },
  {
    id: '3',
    departmentId: '2',
    subDepartmentId: '3',
    name: 'Fatima Khan',
    employeeNo: 'EMP-002',
  },
  {
    id: '4',
    departmentId: '3',
    subDepartmentId: '4',
    name: 'Muhammad Mehtab',
    employeeNo: 'EMP-171',
  },
];

export const MAIN_PAGE_OPTIONS = [
  { value: 'check-query', label: 'Check Query' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'opd-walk-in', label: 'Walk-in Patient' },
  { value: 'services-billing', label: 'Services Billing' },
  { value: 'patient-search', label: 'Patient Search' },
];

export function getCreateLoginDepartments() {
  return CREATE_LOGIN_DEPARTMENTS;
}

export function getCreateLoginSubDepartments(departmentId = null) {
  if (!departmentId) return CREATE_LOGIN_SUB_DEPARTMENTS;
  return CREATE_LOGIN_SUB_DEPARTMENTS.filter((row) => row.departmentId === departmentId);
}

export function getCreateLoginEmployees(departmentId = null, subDepartmentId = null) {
  return CREATE_LOGIN_EMPLOYEES.filter((employee) => {
    if (departmentId && employee.departmentId !== departmentId) return false;
    if (subDepartmentId && employee.subDepartmentId !== subDepartmentId) return false;
    return true;
  });
}

export function createEmptyCreateLoginForm() {
  return {
    departmentId: null,
    departmentName: '',
    subDepartmentId: null,
    subDepartmentName: '',
    employeeId: null,
    employeeName: '',
    mainPage: null,
    branchAccess: false,
    userName: '',
    password: '',
    confirmPassword: '',
  };
}

export const INITIAL_USER_LOGIN_ROWS = [
  {
    id: '1',
    departmentId: '1',
    departmentName: 'ADMINISTRATION',
    subDepartmentId: '2',
    subDepartmentName: 'Administration',
    employeeId: '1',
    employeeName: 'MUHAMMAD YOUSAF',
    mainPage: 'check-query',
    mainPageLabel: 'Check Query',
    branchAccess: true,
    userName: 'yousaf.admin',
    createdAt: '2026-03-01T09:15:00.000Z',
  },
  {
    id: '2',
    departmentId: '1',
    departmentName: 'ADMINISTRATION',
    subDepartmentId: '1',
    subDepartmentName: 'Front Desk',
    employeeId: '2',
    employeeName: 'Sohail Ahmad',
    mainPage: 'dashboard',
    mainPageLabel: 'Dashboard',
    branchAccess: false,
    userName: 'sohail.ahmad',
    createdAt: '2026-03-05T11:30:00.000Z',
  },
  {
    id: '3',
    departmentId: '2',
    departmentName: 'LABORATORY',
    subDepartmentId: '3',
    subDepartmentName: 'Laboratory',
    employeeId: '3',
    employeeName: 'Fatima Khan',
    mainPage: 'services-billing',
    mainPageLabel: 'Services Billing',
    branchAccess: true,
    userName: 'fatima.lab',
    createdAt: '2026-03-10T14:20:00.000Z',
  },
  {
    id: '4',
    departmentId: '3',
    departmentName: 'MEDICAL STAFF',
    subDepartmentId: '4',
    subDepartmentName: 'Paeds',
    employeeId: '4',
    employeeName: 'Muhammad Mehtab',
    mainPage: 'patient-search',
    mainPageLabel: 'Patient Search',
    branchAccess: false,
    userName: 'mehtab.paeds',
    createdAt: '2026-03-12T08:45:00.000Z',
  },
];

let loginRows = INITIAL_USER_LOGIN_ROWS.map((row) => ({ ...row }));

export function getUserLoginRows() {
  return loginRows;
}

export function createUserLoginRow(payload) {
  const row = {
    id: String(Date.now()),
    ...payload,
    createdAt: new Date().toISOString(),
  };
  loginRows = [row, ...loginRows];
  return row;
}
