import {
  getAdminDutyDepartments,
  getAdminDutySubDepartments,
} from '@/features/duty-roaster/api/mock-admin-duty-roaster';

export const ALTERNATIVE_OPTIONS = [
  { value: 'alternative', label: 'Alternative' },
  { value: 'week-days', label: 'Week Days' },
];

export const WEEK_DAY_OPTIONS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

export const ASSIGN_DUTY_EMPLOYEES = [
  {
    id: '1',
    departmentId: '1',
    subDepartmentId: '2',
    name: 'Sohail Ahmad',
    employeeNo: 'EMP-001',
  },
  {
    id: '2',
    departmentId: '1',
    subDepartmentId: '1',
    name: 'Fatima Khan',
    employeeNo: 'EMP-002',
  },
  {
    id: '3',
    departmentId: '2',
    subDepartmentId: '3',
    name: 'Muhammad Mehtab',
    employeeNo: 'EMP-171',
  },
  {
    id: '4',
    departmentId: '3',
    subDepartmentId: '4',
    name: 'Ayesha Siddiqui',
    employeeNo: 'EMP-045',
  },
  {
    id: '5',
    departmentId: '3',
    subDepartmentId: '5',
    name: 'Imran Hussain',
    employeeNo: 'EMP-078',
  },
  {
    id: '6',
    departmentId: '1',
    subDepartmentId: '2',
    name: 'Hina Malik',
    employeeNo: 'EMP-033',
  },
];

export { getAdminDutyDepartments, getAdminDutySubDepartments };

export function getAssignDutyEmployees(departmentId = null, subDepartmentId = null) {
  return ASSIGN_DUTY_EMPLOYEES.filter((employee) => {
    if (departmentId && employee.departmentId !== departmentId) return false;
    if (subDepartmentId && employee.subDepartmentId !== subDepartmentId) return false;
    return true;
  });
}

export function formatAlternative(value) {
  return ALTERNATIVE_OPTIONS.find((option) => option.value === value)?.label ?? value ?? '';
}

export function formatDaysOfWeek(days = []) {
  return days
    .map((day) => WEEK_DAY_OPTIONS.find((option) => option.value === day)?.label ?? day)
    .join(', ');
}

export const INITIAL_ASSIGN_DUTY_TO_EMPLOYEE_ROWS = [
  {
    id: '1',
    startFrom: '01/01/2026',
    endDate: '31/01/2026',
    employeeDepartmentId: '1',
    employeeDepartmentName: 'ADMINISTRATION ( AKK )',
    employeeSubDepartmentId: '2',
    employeeSubDepartmentName: 'Administration',
    dutyRosterDepartmentId: '1',
    dutyRosterDepartmentName: 'ADMINISTRATION ( AKK )',
    dutyRosterSubDepartmentId: '1',
    dutyRosterSubDepartmentName: 'Front Desk',
    shiftId: '1',
    shiftName: 'Evening (2PM-10PM)',
    doubleDuty: false,
    employeeIds: ['1', '6'],
    employeeNames: ['Sohail Ahmad', 'Hina Malik'],
    alternative: 'week-days',
    daysOfWeek: ['monday', 'wednesday', 'friday'],
  },
  {
    id: '2',
    startFrom: '15/02/2026',
    endDate: '15/03/2026',
    employeeDepartmentId: '3',
    employeeDepartmentName: 'MEDICAL STAFF',
    employeeSubDepartmentId: '5',
    employeeSubDepartmentName: 'Emergency',
    dutyRosterDepartmentId: '3',
    dutyRosterDepartmentName: 'MEDICAL STAFF',
    dutyRosterSubDepartmentId: '5',
    dutyRosterSubDepartmentName: 'Emergency',
    shiftId: '2',
    shiftName: 'Morning (6AM-2PM)',
    doubleDuty: true,
    employeeIds: ['5'],
    employeeNames: ['Imran Hussain'],
    alternative: 'alternative',
    daysOfWeek: ['tuesday', 'thursday'],
  },
];

let assignDutyToEmployeeRows = INITIAL_ASSIGN_DUTY_TO_EMPLOYEE_ROWS.map((row) => ({
  ...row,
}));

export function getAssignDutyToEmployeeRows() {
  return assignDutyToEmployeeRows;
}

export function createAssignDutyToEmployeeRow(payload) {
  const nextId = String(
    Math.max(...assignDutyToEmployeeRows.map((r) => Number(r.id) || 0), 0) + 1,
  );
  const row = { id: nextId, ...payload };
  assignDutyToEmployeeRows = [row, ...assignDutyToEmployeeRows];
  return row;
}

export function updateAssignDutyToEmployeeRow(id, payload) {
  assignDutyToEmployeeRows = assignDutyToEmployeeRows.map((row) =>
    row.id === id ? { ...row, ...payload } : row,
  );
  return assignDutyToEmployeeRows.find((row) => row.id === id) ?? null;
}

export function deleteAssignDutyToEmployeeRow(id) {
  assignDutyToEmployeeRows = assignDutyToEmployeeRows.filter((row) => row.id !== id);
}

export function createEmptyAssignDutyToEmployeeForm() {
  return {
    startFrom: '',
    endDate: '',
    employeeDepartmentId: null,
    employeeDepartmentName: '',
    employeeSubDepartmentId: null,
    employeeSubDepartmentName: '',
    dutyRosterDepartmentId: null,
    dutyRosterDepartmentName: '',
    dutyRosterSubDepartmentId: null,
    dutyRosterSubDepartmentName: '',
    shiftId: null,
    shiftName: '',
    doubleDuty: false,
    employeeIds: [],
    alternative: 'week-days',
    daysOfWeek: [],
  };
}

export function createAssignDutyToEmployeeFilters() {
  return {
    startFrom: '',
    endDate: '',
    employeeDepartmentId: null,
    employeeSubDepartmentId: null,
    dutyRosterDepartmentId: null,
    dutyRosterSubDepartmentId: null,
    shiftId: null,
    doubleDuty: null,
    employeeIds: [],
    alternative: null,
    daysOfWeek: [],
  };
}

export function rowToAssignDutyToEmployeeForm(row) {
  return {
    startFrom: row.startFrom ?? '',
    endDate: row.endDate ?? '',
    employeeDepartmentId: row.employeeDepartmentId ?? null,
    employeeDepartmentName: row.employeeDepartmentName ?? '',
    employeeSubDepartmentId: row.employeeSubDepartmentId ?? null,
    employeeSubDepartmentName: row.employeeSubDepartmentName ?? '',
    dutyRosterDepartmentId: row.dutyRosterDepartmentId ?? null,
    dutyRosterDepartmentName: row.dutyRosterDepartmentName ?? '',
    dutyRosterSubDepartmentId: row.dutyRosterSubDepartmentId ?? null,
    dutyRosterSubDepartmentName: row.dutyRosterSubDepartmentName ?? '',
    shiftId: row.shiftId ?? null,
    shiftName: row.shiftName ?? '',
    doubleDuty: row.doubleDuty ?? false,
    employeeIds: row.employeeIds ?? [],
    alternative: row.alternative ?? 'week-days',
    daysOfWeek: row.daysOfWeek ?? [],
  };
}

export function filterAssignDutyToEmployeeRows(rows, filters = {}) {
  let result = rows;

  if (filters.startFrom) {
    result = result.filter((r) => r.startFrom === filters.startFrom);
  }
  if (filters.endDate) {
    result = result.filter((r) => r.endDate === filters.endDate);
  }
  if (filters.employeeDepartmentId) {
    result = result.filter((r) => r.employeeDepartmentId === filters.employeeDepartmentId);
  }
  if (filters.employeeSubDepartmentId) {
    result = result.filter((r) => r.employeeSubDepartmentId === filters.employeeSubDepartmentId);
  }
  if (filters.dutyRosterDepartmentId) {
    result = result.filter((r) => r.dutyRosterDepartmentId === filters.dutyRosterDepartmentId);
  }
  if (filters.dutyRosterSubDepartmentId) {
    result = result.filter((r) => r.dutyRosterSubDepartmentId === filters.dutyRosterSubDepartmentId);
  }
  if (filters.shiftId) {
    result = result.filter((r) => r.shiftId === filters.shiftId);
  }
  if (filters.doubleDuty !== null && filters.doubleDuty !== undefined) {
    result = result.filter((r) => r.doubleDuty === filters.doubleDuty);
  }
  if (filters.employeeIds?.length) {
    result = result.filter((r) =>
      filters.employeeIds.some((id) => r.employeeIds?.includes(id)),
    );
  }
  if (filters.alternative) {
    result = result.filter((r) => r.alternative === filters.alternative);
  }
  if (filters.daysOfWeek?.length) {
    result = result.filter((r) =>
      filters.daysOfWeek.every((day) => r.daysOfWeek?.includes(day)),
    );
  }

  return result;
}

export function resolveEmployeeNames(employeeIds = []) {
  return employeeIds
    .map((id) => ASSIGN_DUTY_EMPLOYEES.find((employee) => employee.id === id)?.name ?? id)
    .filter(Boolean);
}
