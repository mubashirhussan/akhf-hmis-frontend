import dayjs from 'dayjs';

export const ADMIN_DUTY_DEPARTMENTS = [
  { id: '1', name: 'ADMINISTRATION ( AKK )' },
  { id: '2', name: 'LABORATORY' },
  { id: '3', name: 'MEDICAL STAFF' },
];

export const ADMIN_DUTY_SUB_DEPARTMENTS = [
  { id: '1', departmentId: '1', name: 'Front Desk' },
  { id: '2', departmentId: '1', name: 'Administration' },
  { id: '3', departmentId: '2', name: 'Laboratory' },
  { id: '4', departmentId: '3', name: 'Paeds' },
  { id: '5', departmentId: '3', name: 'Emergency' },
];

export function getAdminDutyDepartments() {
  return ADMIN_DUTY_DEPARTMENTS;
}

export function getAdminDutySubDepartments(departmentId = null) {
  if (!departmentId) return ADMIN_DUTY_SUB_DEPARTMENTS;
  return ADMIN_DUTY_SUB_DEPARTMENTS.filter((row) => row.departmentId === departmentId);
}

export function calculateEndTime(startTime, durationHours = 0, durationMinutes = 0) {
  if (!startTime) return '';
  const [hours, minutes] = startTime.split(':').map(Number);
  return dayjs()
    .hour(hours)
    .minute(minutes)
    .second(0)
    .add(Number(durationHours) || 0, 'hour')
    .add(Number(durationMinutes) || 0, 'minute')
    .format('HH:mm:ss');
}

export function formatTimeWithSeconds(time) {
  if (!time) return '';
  if (time.length === 5) return `${time}:00`;
  return time;
}

export const INITIAL_ADMIN_DUTY_ROASTER_ROWS = [
  {
    id: '1',
    departmentId: '1',
    departmentName: 'ADMINISTRATION ( AKK )',
    subDepartmentId: '1',
    subDepartmentName: 'Front Desk',
    shiftId: '1',
    shiftName: 'Evening (2PM-10PM)',
    startTime: '14:00',
    durationHours: 8,
    durationMinutes: 0,
    endTime: '22:00:00',
  },
  {
    id: '2',
    departmentId: '2',
    departmentName: 'LABORATORY',
    subDepartmentId: '3',
    subDepartmentName: 'Laboratory',
    shiftId: '2',
    shiftName: 'Morning (6AM-2PM)',
    startTime: '08:00',
    durationHours: 6,
    durationMinutes: 0,
    endTime: '14:00:00',
  },
  {
    id: '3',
    departmentId: '3',
    departmentName: 'MEDICAL STAFF',
    subDepartmentId: '4',
    subDepartmentName: 'Paeds',
    shiftId: '2',
    shiftName: 'Morning (6AM-2PM)',
    startTime: '08:00',
    durationHours: 6,
    durationMinutes: 0,
    endTime: '14:00:00',
  },
  {
    id: '4',
    departmentId: '3',
    departmentName: 'MEDICAL STAFF',
    subDepartmentId: '5',
    subDepartmentName: 'Emergency',
    shiftId: '1',
    shiftName: 'Evening (2PM-10PM)',
    startTime: '14:00',
    durationHours: 8,
    durationMinutes: 0,
    endTime: '22:00:00',
  },
];

let adminDutyRoasterRows = INITIAL_ADMIN_DUTY_ROASTER_ROWS.map((row) => ({ ...row }));

export function getAdminDutyRoasterRows() {
  return adminDutyRoasterRows;
}

export function createAdminDutyRoasterRow(payload) {
  const nextId = String(
    Math.max(...adminDutyRoasterRows.map((r) => Number(r.id) || 0), 0) + 1,
  );
  const endTime =
    payload.endTime ??
    calculateEndTime(payload.startTime, payload.durationHours, payload.durationMinutes);
  const row = { id: nextId, endTime, ...payload };
  adminDutyRoasterRows = [row, ...adminDutyRoasterRows];
  return row;
}

export function updateAdminDutyRoasterRow(id, payload) {
  const endTime =
    payload.endTime ??
    calculateEndTime(
      payload.startTime,
      payload.durationHours,
      payload.durationMinutes,
    );
  adminDutyRoasterRows = adminDutyRoasterRows.map((row) =>
    row.id === id ? { ...row, ...payload, endTime } : row,
  );
  return adminDutyRoasterRows.find((row) => row.id === id) ?? null;
}

export function deleteAdminDutyRoasterRow(id) {
  adminDutyRoasterRows = adminDutyRoasterRows.filter((row) => row.id !== id);
}

export function createEmptyAdminDutyRoasterForm() {
  return {
    departmentId: null,
    departmentName: '',
    subDepartmentId: null,
    subDepartmentName: '',
    shiftId: null,
    shiftName: '',
    startTime: '',
    durationHours: 0,
    durationMinutes: 0,
  };
}

export function createAdminDutyRoasterFilters() {
  return {
    departmentId: null,
    subDepartmentId: null,
    shiftId: null,
    startTime: '',
    durationHours: null,
    durationMinutes: null,
  };
}

export function rowToAdminDutyRoasterForm(row) {
  return {
    departmentId: row.departmentId ?? null,
    departmentName: row.departmentName ?? '',
    subDepartmentId: row.subDepartmentId ?? null,
    subDepartmentName: row.subDepartmentName ?? '',
    shiftId: row.shiftId ?? null,
    shiftName: row.shiftName ?? '',
    startTime: row.startTime ?? '',
    durationHours: row.durationHours ?? 0,
    durationMinutes: row.durationMinutes ?? 0,
  };
}

export function filterAdminDutyRoasterRows(rows, filters = {}) {
  let result = rows;

  if (filters.departmentId) {
    result = result.filter((r) => r.departmentId === filters.departmentId);
  }
  if (filters.subDepartmentId) {
    result = result.filter((r) => r.subDepartmentId === filters.subDepartmentId);
  }
  if (filters.shiftId) {
    result = result.filter((r) => r.shiftId === filters.shiftId);
  }
  if (filters.startTime) {
    result = result.filter((r) => r.startTime === filters.startTime);
  }
  if (filters.durationHours !== null && filters.durationHours !== undefined) {
    result = result.filter((r) => r.durationHours === filters.durationHours);
  }
  if (filters.durationMinutes !== null && filters.durationMinutes !== undefined) {
    result = result.filter((r) => r.durationMinutes === filters.durationMinutes);
  }

  return result;
}
