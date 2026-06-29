export const INITIAL_SUB_DEPARTMENT_ROWS = [
  {
    id: '1',
    subDepartmentId: 1,
    hospitalId: '1',
    hospitalName: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    deptTypeId: '1',
    departmentType: 'Cardiology',
    departmentId: '1',
    departmentName: 'Cardiac Care Unit',
    subDeptTypeId: '1',
    subDepartmentType: 'Interventional Cardiology',
    subDepartmentName: 'Cath Lab',
    costCenter: 'CC-001',
    location: 'Block A, Ground Floor, Room 101',
    phone: '021-11111111',
    fax: '021-11111112',
  },
];

let subDepartmentRows = INITIAL_SUB_DEPARTMENT_ROWS.map((row) => ({ ...row }));
let nextSubDepartmentId =
  Math.max(...INITIAL_SUB_DEPARTMENT_ROWS.map((r) => r.subDepartmentId), 0) + 1;

export function getSubDepartmentRows() {
  return subDepartmentRows;
}

export function createSubDepartmentRow(payload) {
  const subDepartmentId = nextSubDepartmentId++;
  const row = { id: String(subDepartmentId), subDepartmentId, ...payload };
  subDepartmentRows = [row, ...subDepartmentRows];
  return row;
}

export function updateSubDepartmentRow(id, payload) {
  subDepartmentRows = subDepartmentRows.map((row) =>
    row.id === id ? { ...row, ...payload } : row,
  );
  return subDepartmentRows.find((row) => row.id === id) ?? null;
}

export function deleteSubDepartmentRow(id) {
  subDepartmentRows = subDepartmentRows.filter((row) => row.id !== id);
}

export function createEmptySubDepartmentForm() {
  return {
    hospitalId: null,
    hospitalName: '',
    deptTypeId: null,
    departmentType: '',
    departmentId: null,
    departmentName: '',
    subDeptTypeId: null,
    subDepartmentType: '',
    subDepartmentName: '',
    costCenter: '',
    location: '',
    phone: '',
    fax: '',
  };
}

export function rowToSubDepartmentForm(row) {
  return {
    hospitalId: row.hospitalId ?? null,
    hospitalName: row.hospitalName ?? '',
    deptTypeId: row.deptTypeId ?? null,
    departmentType: row.departmentType ?? '',
    departmentId: row.departmentId ?? null,
    departmentName: row.departmentName ?? '',
    subDeptTypeId: row.subDeptTypeId ?? null,
    subDepartmentType: row.subDepartmentType ?? '',
    subDepartmentName: row.subDepartmentName ?? '',
    costCenter: row.costCenter ?? '',
    location: row.location ?? '',
    phone: row.phone ?? '',
    fax: row.fax ?? '',
  };
}

export function createSubDepartmentFilters() {
  return {
    hospitalId: null,
    deptTypeId: null,
    departmentId: null,
    subDepartmentName: '',
    costCenter: '',
    location: '',
    phone: '',
    fax: '',
  };
}

export function filterSubDepartmentRows(rows, filters = {}) {
  let result = rows;
  if (filters.hospitalId) {
    result = result.filter((r) => r.hospitalId === filters.hospitalId);
  }
  if (filters.deptTypeId) {
    result = result.filter((r) => r.deptTypeId === filters.deptTypeId);
  }
  if (filters.departmentId) {
    result = result.filter((r) => r.departmentId === filters.departmentId);
  }
  if (filters.subDepartmentName?.trim()) {
    result = result.filter((r) =>
      r.subDepartmentName
        ?.toLowerCase()
        .includes(filters.subDepartmentName.trim().toLowerCase()),
    );
  }
  if (filters.costCenter?.trim()) {
    result = result.filter((r) =>
      r.costCenter?.toLowerCase().includes(filters.costCenter.trim().toLowerCase()),
    );
  }
  if (filters.location?.trim()) {
    result = result.filter((r) =>
      r.location?.toLowerCase().includes(filters.location.trim().toLowerCase()),
    );
  }
  if (filters.phone?.trim()) {
    result = result.filter((r) =>
      r.phone?.toLowerCase().includes(filters.phone.trim().toLowerCase()),
    );
  }
  if (filters.fax?.trim()) {
    result = result.filter((r) =>
      r.fax?.toLowerCase().includes(filters.fax.trim().toLowerCase()),
    );
  }
  return result;
}