import {
  getEmployeeDisplayName,
  getEmployeeRows,
} from '@/features/human-resource/api/mock-employees';

export const ALL_FILTER_VALUE = 'all';

export const HOSPITAL_FILTER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: 'All' },
  { value: 'alkhidmat-diagnostics-karachi', label: 'ALKHIDMAT DIAGNOSTICS KARACHI' },
  { value: 'alkhidmat-hospital-peshawar', label: 'ALKHIDMAT HOSPITAL PESHAWAR' },
];

export const DEPARTMENT_FILTER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: 'All' },
  { value: 'administration', label: 'ADMINISTRATION' },
  { value: 'human-resource', label: 'HUMAN RESOURCE' },
  { value: 'medical', label: 'MEDICAL' },
];

export const DESIGNATION_FILTER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: 'All' },
  { value: 'neuro-surgeon', label: 'Neuro Surgeon' },
  { value: 'medical-officer', label: 'Medical Officer' },
  { value: 'staff-nurse', label: 'Staff Nurse' },
  { value: 'administrator', label: 'Administrator' },
  { value: 'officer', label: 'Officer' },
];

export const EMPLOYEE_TYPE_FILTER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: 'All' },
  { value: 'na', label: 'N/A' },
  { value: 'permanent', label: 'Permanent' },
  { value: 'contract', label: 'Contract' },
  { value: 'visiting', label: 'Visiting' },
];

export const EMPLOYEE_STATUS_FILTER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'In Active' },
];

export const SUB_DEPARTMENT_FILTER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: 'All' },
  { value: 'administration', label: 'Administration' },
  { value: 'finance', label: 'Finance' },
  { value: 'reception', label: 'Reception' },
  { value: 'human-resource', label: 'Human Resource' },
];

export const EMPLOYEE_NAME_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: 'All' },
  { value: '1', label: 'SOHAIL AHMAD' },
  { value: '2', label: 'FATIMA KHAN' },
  { value: '3', label: 'MUHAMMAD MEHTAB' },
  { value: '4', label: 'ALI HUSSAIN' },
];

const DEPARTMENT_LABELS = Object.fromEntries(
  DEPARTMENT_FILTER_OPTIONS.filter((opt) => opt.value !== ALL_FILTER_VALUE).map((opt) => [
    opt.value,
    opt.label,
  ]),
);

const SUB_DEPARTMENT_LABELS = {
  administration: 'Administration',
  finance: 'Finance',
  reception: 'Reception',
  'human-resource': 'Human Resource',
};

const DESIGNATION_LABELS = Object.fromEntries(
  DESIGNATION_FILTER_OPTIONS.filter((opt) => opt.value !== ALL_FILTER_VALUE).map((opt) => [
    opt.value,
    opt.label,
  ]),
);

export function createEmployeeSearchFilters() {
  return {
    hospital: 'alkhidmat-diagnostics-karachi',
    department: ALL_FILTER_VALUE,
    employeeQuery: '',
    designation: ALL_FILTER_VALUE,
    employeeType: ALL_FILTER_VALUE,
    status: 'active',
  };
}

function matchesEmployeeQuery(employee, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = [
    getEmployeeDisplayName(employee),
    employee.employeeNo,
    employee.empId,
    employee.id,
    employee.cnicNo,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return searchableValues.some((value) => value.includes(normalizedQuery));
}

export function getDepartmentLabel(value) {
  return DEPARTMENT_LABELS[value] ?? value ?? '';
}

export function getSubDepartmentLabel(value) {
  return SUB_DEPARTMENT_LABELS[value] ?? value ?? '';
}

export function getDesignationLabel(value) {
  return DESIGNATION_LABELS[value] ?? value ?? '';
}

export function mapEmployeeToSearchRow(employee, index) {
  return {
    id: employee.id,
    serial: index + 1,
    empId: employee.empId ?? employee.id,
    empNo: employee.employeeNo ?? '',
    empName: getEmployeeDisplayName(employee).toUpperCase(),
    cnic: employee.cnicNo ?? '',
    department: getDepartmentLabel(employee.department),
    subDepartment: getSubDepartmentLabel(employee.subDepartment),
    designation: getDesignationLabel(employee.designation),
  };
}

export function searchEmployees(filters) {
  let rows = getEmployeeRows();

  if (filters.hospital && filters.hospital !== ALL_FILTER_VALUE) {
    rows = rows.filter((row) => row.hospital === filters.hospital);
  }

  if (filters.department && filters.department !== ALL_FILTER_VALUE) {
    rows = rows.filter((row) => row.department === filters.department);
  }

  if (filters.employeeQuery?.trim()) {
    rows = rows.filter((row) => matchesEmployeeQuery(row, filters.employeeQuery));
  }

  if (filters.designation && filters.designation !== ALL_FILTER_VALUE) {
    rows = rows.filter((row) => row.designation === filters.designation);
  }

  if (filters.employeeType && filters.employeeType !== ALL_FILTER_VALUE) {
    rows = rows.filter((row) => row.employeeType === filters.employeeType);
  }

  if (filters.status && filters.status !== ALL_FILTER_VALUE) {
    rows = rows.filter((row) => {
      const active = row.isActive ?? (row.status === 'active');
      return filters.status === 'active' ? active : !active;
    });
  }

  return rows.map(mapEmployeeToSearchRow);
}
export function filterActivateDeactivateEmployees(filters) {
  let rows = getEmployeeRows();

  if (filters.hospital && filters.hospital !== ALL_FILTER_VALUE) {
    rows = rows.filter((row) => row.hospital === filters.hospital);
  }
  if (filters.department && filters.department !== ALL_FILTER_VALUE) {
    rows = rows.filter((row) => row.department === filters.department);
  }
  if (filters.subDepartment && filters.subDepartment !== ALL_FILTER_VALUE) {
    rows = rows.filter((row) => row.subDepartment === filters.subDepartment);
  }
  if (filters.employeeNo?.trim()) {
    rows = rows.filter((row) =>
      String(row.employeeNo ?? '').toLowerCase().includes(filters.employeeNo.trim().toLowerCase()),
    );
  }
  if (filters.employeeName && filters.employeeName !== ALL_FILTER_VALUE) {
    rows = rows.filter((row) => row.id === filters.employeeName);
  }

  return rows.map((emp, index) => ({
    id: emp.id,
    serial: index + 1,
    empId: emp.empId ?? emp.id,
    empNo: emp.employeeNo ?? '',
    empName: getEmployeeDisplayName(emp).toUpperCase(),
    deptName: getDepartmentLabel(emp.department),
    subDeptName: getSubDepartmentLabel(emp.subDepartment),
    userName: emp.userName ?? '',
    joiningDate: emp.doj ?? '',
    designation: getDesignationLabel(emp.designation),
    isActive: emp.isActive ?? true,
  }));
}

export function createActivateDeactivateFilters() {
  return {
    hospital: ALL_FILTER_VALUE,
    department: ALL_FILTER_VALUE,
    subDepartment: ALL_FILTER_VALUE,
    employeeNo: '',
    employeeName: ALL_FILTER_VALUE,
  };
}
