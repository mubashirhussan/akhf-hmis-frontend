export const INITIAL_DESIGNATION_ROWS = [
  {
    id: '1',
    designationId: 1,
    designation: 'Medical Officer',
    minPayScale: 50000,
  },
  {
    id: '2',
    designationId: 2,
    designation: 'Senior Nurse',
    minPayScale: 35000,
  },
  {
    id: '3',
    designationId: 3,
    designation: 'Lab Technician',
    minPayScale: 30000,
  },
];

let designationRows = INITIAL_DESIGNATION_ROWS.map((row) => ({ ...row }));
let nextDesignationId =
  Math.max(...INITIAL_DESIGNATION_ROWS.map((r) => r.designationId), 0) + 1;

export function getDesignationRows() {
  return designationRows;
}

export function createDesignationRow(payload) {
  const designationId = nextDesignationId++;
  const row = { id: String(designationId), designationId, ...payload };
  designationRows = [row, ...designationRows];
  return row;
}

export function updateDesignationRow(id, payload) {
  designationRows = designationRows.map((row) =>
    row.id === id ? { ...row, ...payload } : row,
  );
  return designationRows.find((row) => row.id === id) ?? null;
}

export function deleteDesignationRow(id) {
  designationRows = designationRows.filter((row) => row.id !== id);
}

export function createEmptyDesignationForm() {
  return {
    designation: '',
    minPayScale: '',
  };
}

export function rowToDesignationForm(row) {
  return {
    designation: row.designation ?? '',
    minPayScale: row.minPayScale ?? '',
  };
}

export function filterDesignationRows(rows, filters = {}) {
  let result = rows;
  if (filters.designation?.trim()) {
    result = result.filter((r) =>
      r.designation?.toLowerCase().includes(filters.designation.trim().toLowerCase()),
    );
  }
  return result;
}