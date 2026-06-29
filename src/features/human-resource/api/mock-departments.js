export const INITIAL_DEPARTMENT_ROWS = [
  {
    id: '1',
    departmentId: 1,
    hospitalId: '1',
    hospitalName: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    deptTypeId: '1',
    departmentType: 'Cardiology',
    departmentName: 'Cardiac Care Unit',
    location: 'Block A, Ground Floor',
    phone: '021-11111111',
    fax: '021-11111112',
  },
  {
    id: '2',
    departmentId: 2,
    hospitalId: '2',
    hospitalName: 'ALKHIDMAT HOSPITAL PESHAWAR',
    deptTypeId: '3',
    departmentType: 'Orthopedics',
    departmentName: 'Bone & Joint Clinic',
    location: 'Block B, First Floor',
    phone: '091-22222222',
    fax: '091-22222223',
  },
];

let departmentRows = INITIAL_DEPARTMENT_ROWS.map((row) => ({ ...row }));
let nextDepartmentId = Math.max(...INITIAL_DEPARTMENT_ROWS.map((r) => r.departmentId), 0) + 1;

export function getDepartmentRows() {
  return departmentRows;
}

export function createDepartmentRow(payload) {
  const departmentId = nextDepartmentId++;
  const row = { id: String(departmentId), departmentId, ...payload };
  departmentRows = [row, ...departmentRows];
  return row;
}

export function updateDepartmentRow(id, payload) {
  departmentRows = departmentRows.map((row) =>
    row.id === id ? { ...row, ...payload } : row,
  );
  return departmentRows.find((row) => row.id === id) ?? null;
}

export function deleteDepartmentRow(id) {
  departmentRows = departmentRows.filter((row) => row.id !== id);
}

export function createEmptyDepartmentForm() {
  return {
    hospitalId: null,
    hospitalName: '',
    deptTypeId: null,
    departmentType: '',
    departmentName: '',
    location: '',
    phone: '',
    fax: '',
  };
}

export function rowToDepartmentForm(row) {
  return {
    hospitalId: row.hospitalId ?? null,
    hospitalName: row.hospitalName ?? '',
    deptTypeId: row.deptTypeId ?? null,
    departmentType: row.departmentType ?? '',
    departmentName: row.departmentName ?? '',
    location: row.location ?? '',
    phone: row.phone ?? '',
    fax: row.fax ?? '',
  };
}

export function createDepartmentFilters() {
  return {
    hospitalId: null,
    deptTypeId: null,
    departmentName: '',
  };
}

export function filterDepartmentRows(rows, filters = {}) {
  let result = rows;
  if (filters.hospitalId) {
    result = result.filter((r) => r.hospitalId === filters.hospitalId);
  }
  if (filters.deptTypeId) {
    result = result.filter((r) => r.deptTypeId === filters.deptTypeId);
  }
  if (filters.departmentName?.trim()) {
    result = result.filter((r) =>
      r.departmentName?.toLowerCase().includes(filters.departmentName.trim().toLowerCase()),
    );
  }
  return result;
}