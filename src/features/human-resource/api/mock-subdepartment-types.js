export const INITIAL_SUBDEPT_TYPE_ROWS = [
  {
    id: '1',
    subDeptTypeId: 1,
    hospitalId: '1',
    hospitalName: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    deptTypeId: '1',
    departmentType: 'Cardiology',
    departmentId: '1',
    departmentName: 'Cardiac Care Unit',
    subDepartmentType: 'Interventional Cardiology',
  },
];

let subDeptTypeRows = INITIAL_SUBDEPT_TYPE_ROWS.map((row) => ({ ...row }));
let nextSubDeptTypeId = Math.max(...INITIAL_SUBDEPT_TYPE_ROWS.map((r) => r.subDeptTypeId), 0) + 1;

export function getSubDeptTypeRows() {
  return subDeptTypeRows;
}

export function createSubDeptTypeRow(payload) {
  const subDeptTypeId = nextSubDeptTypeId++;
  const row = { id: String(subDeptTypeId), subDeptTypeId, ...payload };
  subDeptTypeRows = [row, ...subDeptTypeRows];
  return row;
}

export function updateSubDeptTypeRow(id, payload) {
  subDeptTypeRows = subDeptTypeRows.map((row) =>
    row.id === id ? { ...row, ...payload } : row,
  );
  return subDeptTypeRows.find((row) => row.id === id) ?? null;
}

export function deleteSubDeptTypeRow(id) {
  subDeptTypeRows = subDeptTypeRows.filter((row) => row.id !== id);
}

export function createEmptySubDeptTypeForm() {
  return {
    hospitalId: null,
    hospitalName: '',
    deptTypeId: null,
    departmentType: '',
    departmentId: null,
    departmentName: '',
    subDepartmentType: '',
  };
}

export function rowToSubDeptTypeForm(row) {
  return {
    hospitalId: row.hospitalId ?? null,
    hospitalName: row.hospitalName ?? '',
    deptTypeId: row.deptTypeId ?? null,
    departmentType: row.departmentType ?? '',
    departmentId: row.departmentId ?? null,
    departmentName: row.departmentName ?? '',
    subDepartmentType: row.subDepartmentType ?? '',
  };
}

export function createSubDeptTypeFilters() {
  return {
    deptTypeId: null,
    departmentId: null,
    subDepartmentType: '',
  };
}

export function filterSubDeptTypeRows(rows, filters = {}) {
  let result = rows;
  if (filters.deptTypeId) {
    result = result.filter((r) => r.deptTypeId === filters.deptTypeId);
  }
  if (filters.departmentId) {
    result = result.filter((r) => r.departmentId === filters.departmentId);
  }
  if (filters.subDepartmentType?.trim()) {
    result = result.filter((r) =>
      r.subDepartmentType?.toLowerCase().includes(filters.subDepartmentType.trim().toLowerCase()),
    );
  }
  return result;
}