

export const INITIAL_HOSPITAL_ROWS = [
  {
    id: '1',
    hospitalId: 1,
    name: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    abbreviation: 'ADK',
    address: 'Main Shahrah-e-Faisal, Karachi',
    city: 'karachi',
    phone: '021-34567890',
    fax: '021-34567891',
    logo: null,
  },
  {
    id: '2',
    hospitalId: 2,
    name: 'ALKHIDMAT HOSPITAL PESHAWAR',
    abbreviation: 'AHP',
    address: 'GT Road, Peshawar',
    city: 'peshawar',
    phone: '091-2345678',
    fax: '091-2345679',
    logo: null,
  },
];

let hospitalRows = INITIAL_HOSPITAL_ROWS.map((row) => ({ ...row }));

let nextHospitalId =
  Math.max(...INITIAL_HOSPITAL_ROWS.map((row) => row.hospitalId), 0) + 1;

export function getHospitalRows() {
  return hospitalRows;
}

export function createHospitalRow(payload) {
  const providedHospitalId = payload?.hospitalId ? Number(payload.hospitalId) : undefined;
  const hospitalId = Number.isInteger(providedHospitalId) && providedHospitalId > 0
    ? providedHospitalId
    : nextHospitalId++;

  if (hospitalId >= nextHospitalId) {
    nextHospitalId = hospitalId + 1;
  }

  const row = { id: String(hospitalId), hospitalId, ...payload };
  hospitalRows = [row, ...hospitalRows];
  return row;
}

export function updateHospitalRow(id, payload) {
  hospitalRows = hospitalRows.map((row) =>
    row.id === id ? { ...row, ...payload } : row,
  );
  return hospitalRows.find((row) => row.id === id) ?? null;
}

export function deleteHospitalRow(id) {
  hospitalRows = hospitalRows.filter((row) => row.id !== id);
}

export function createEmptyHospitalForm() {
  return {
    hospitalId: '',
    name: '',
    abbreviation: '',
    address: '',
    city: '',
    phone: '',
    fax: '',
    logo: null,
  };
}

export function rowToHospitalForm(row) {
  return {
    hospitalId: row.hospitalId ?? '',
    name: row.name ?? '',
    abbreviation: row.abbreviation ?? '',
    address: row.address ?? '',
    city: row.city ?? '',
    phone: row.phone ?? '',
    fax: row.fax ?? '',
    logo: row.logo ?? null,
  };
}

export function getHospitalFilterOptions() {
  return [
    { value: 'all', label: 'All' },
    ...hospitalRows.map((row) => ({ value: row.id, label: row.name })),
  ];
}


export function createHospitalFilters() {
  return {
    name: '',
    abbreviation: '',
    address: '',
    city: '',
    phone: '',
    fax: '',
  };
}

export function filterHospitalRows(rows, filters) {
  let result = rows;
  if (filters.name?.trim()) {
    result = result.filter((r) =>
      r.name?.toLowerCase().includes(filters.name.trim().toLowerCase()),
    );
  }
  if (filters.abbreviation?.trim()) {
    result = result.filter((r) =>
      r.abbreviation?.toLowerCase().includes(filters.abbreviation.trim().toLowerCase()),
    );
  }
  if (filters.address?.trim()) {
    result = result.filter((r) =>
      r.address?.toLowerCase().includes(filters.address.trim().toLowerCase()),
    );
  }
  if (filters.city) {
    result = result.filter((r) => r.city === filters.city);
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