export const INITIAL_DEPT_TYPE_ROWS = [
  {
    id: '1',
    deptTypeId: 1,
    hospitalId: '1',
    hospitalName: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    departmentType: 'Cardiology',
    status: 'active',
  },
  {
    id: '2',
    deptTypeId: 2,
    hospitalId: '1',
    hospitalName: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    departmentType: 'Radiology',
    status: 'active',
  },
  {
    id: '3',
    deptTypeId: 3,
    hospitalId: '2',
    hospitalName: 'ALKHIDMAT HOSPITAL PESHAWAR',
    departmentType: 'Orthopedics',
    status: 'active',
  },
  {
    id: '4',
    deptTypeId: 4,
    hospitalId: '2',
    hospitalName: 'ALKHIDMAT HOSPITAL PESHAWAR',
    departmentType: 'Neurology',
    status: 'disactive',
  },
  {
    id: '5',
    deptTypeId: 5,
    hospitalId: '1',
    hospitalName: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    departmentType: 'Emergency',
    status: 'active',
  },
];

let deptTypeRows = INITIAL_DEPT_TYPE_ROWS.map((row) => ({ ...row }));
let nextDeptTypeId = Math.max(...INITIAL_DEPT_TYPE_ROWS.map((r) => r.deptTypeId), 0) + 1;

export function getDeptTypeRows() {
  return deptTypeRows;
}

export function createDeptTypeRow(payload) {
  const deptTypeId = nextDeptTypeId++;
  const row = { id: String(deptTypeId), deptTypeId, ...payload };
  deptTypeRows = [row, ...deptTypeRows];
  return row;
}

export function updateDeptTypeRow(id, payload) {
  deptTypeRows = deptTypeRows.map((row) =>
    row.id === id ? { ...row, ...payload } : row,
  );
  return deptTypeRows.find((row) => row.id === id) ?? null;
}

export function deleteDeptTypeRow(id) {
  deptTypeRows = deptTypeRows.filter((row) => row.id !== id);
}

export function createEmptyDeptTypeForm() {
  return {
    hospitalId: null,
    hospitalName: '',
    departmentType: '',
    status: 'active',
  };
}

export function rowToDeptTypeForm(row) {
  return {
    hospitalId: row.hospitalId ?? null,
    hospitalName: row.hospitalName ?? '',
    departmentType: row.departmentType ?? '',
    status: row.status ?? 'active',
  };
}

export function filterDeptTypeRows(rows, deptTypeFilter) {
  if (!deptTypeFilter?.trim()) return rows;
  return rows.filter((r) =>
    r.departmentType?.toLowerCase().includes(deptTypeFilter.trim().toLowerCase()),
  );
}