export const RELAXATION_TIME_OPTIONS = [
  { value: 0, label: '0' },
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
  { value: 45, label: '45' },
  { value: 60, label: '60' },
];

export const INITIAL_SHIFT_ROWS = [
  {
    id: '1',
    shiftName: 'Evening (2PM-10PM)',
    shiftDescription: 'Evening (2PM-10PM)',
    abbreviation: 'E',
    startTime: '14:00',
    endTime: '22:00',
    relaxationTime: 15,
  },
  {
    id: '2',
    shiftName: 'Morning (6AM-2PM)',
    shiftDescription: 'Morning (6AM-2PM)',
    abbreviation: 'M',
    startTime: '06:00',
    endTime: '14:00',
    relaxationTime: 15,
  },
  {
    id: '3',
    shiftName: 'Night (10PM-6AM)',
    shiftDescription: 'Night (10PM-6AM)',
    abbreviation: 'N',
    startTime: '22:00',
    endTime: '06:00',
    relaxationTime: 10,
  },
  {
    id: '4',
    shiftName: '24 Hours',
    shiftDescription: '24 Hours Duty',
    abbreviation: '24H',
    startTime: '00:00',
    endTime: '23:59',
    relaxationTime: 0,
  },
];

let shiftRows = INITIAL_SHIFT_ROWS.map((row) => ({ ...row }));

export function getShiftRows() {
  return shiftRows;
}

export function createShiftRow(payload) {
  const nextId = String(
    Math.max(...shiftRows.map((r) => Number(r.id) || 0), 0) + 1,
  );
  const row = { id: nextId, ...payload };
  shiftRows = [row, ...shiftRows];
  return row;
}

export function updateShiftRow(id, payload) {
  shiftRows = shiftRows.map((row) => (row.id === id ? { ...row, ...payload } : row));
  return shiftRows.find((row) => row.id === id) ?? null;
}

export function deleteShiftRow(id) {
  shiftRows = shiftRows.filter((row) => row.id !== id);
}

export function createEmptyShiftForm() {
  return {
    shiftName: '',
    shiftDescription: '',
    abbreviation: '',
    startTime: '',
    endTime: '',
    relaxationTime: 0,
  };
}

export function createShiftFilters() {
  return {
    shiftName: '',
    shiftDescription: '',
    abbreviation: '',
    startTime: '',
    endTime: '',
    relaxationTime: null,
  };
}

export function rowToShiftForm(row) {
  return {
    shiftName: row.shiftName ?? '',
    shiftDescription: row.shiftDescription ?? '',
    abbreviation: row.abbreviation ?? '',
    startTime: row.startTime ?? '',
    endTime: row.endTime ?? '',
    relaxationTime: row.relaxationTime ?? 0,
  };
}

function includesIgnoreCase(value, query) {
  return value?.toLowerCase().includes(query.trim().toLowerCase());
}

export function filterShiftRows(rows, filters = {}) {
  let result = rows;

  if (filters.shiftName?.trim()) {
    result = result.filter((r) => includesIgnoreCase(r.shiftName, filters.shiftName));
  }
  if (filters.shiftDescription?.trim()) {
    result = result.filter((r) =>
      includesIgnoreCase(r.shiftDescription, filters.shiftDescription),
    );
  }
  if (filters.abbreviation?.trim()) {
    result = result.filter((r) =>
      includesIgnoreCase(r.abbreviation, filters.abbreviation),
    );
  }
  if (filters.startTime) {
    result = result.filter((r) => r.startTime === filters.startTime);
  }
  if (filters.endTime) {
    result = result.filter((r) => r.endTime === filters.endTime);
  }
  if (filters.relaxationTime !== null && filters.relaxationTime !== undefined) {
    result = result.filter((r) => r.relaxationTime === filters.relaxationTime);
  }

  return result;
}
