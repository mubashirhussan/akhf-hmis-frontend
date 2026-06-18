export const GROUP_OPTIONS = [
  { value: 'haematology', label: 'Haematology' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'microbiology', label: 'Microbiology' },
];


export const INITIAL_SUB_GROUP_ROWS = [
  {
    id: '29',
    groupId: 1,
    groupName: 'Haematology',
    subGroupId: 29,
    subGroupName: 'CBC',
    fee: 1000,
  },
  {
    id: '52',
    groupId: 2,
    groupName: 'Biochemistry',
    subGroupId: 52,
    subGroupName: 'Liver Function Test',
    fee: 1200,
  },
  {
    id: '92',
    groupId: 3,
    groupName: 'Microbiology',
    subGroupId: 92,
    subGroupName: 'Culture & Sensitivity',
    fee: 1500,
  },
  {
    id: '185',
    groupId: 4,
    groupName: 'Haematology',
    subGroupId: 185,
    subGroupName: 'Blood Cross Match',
    fee: 700,
  },
  {
    id: '238',
    groupId: 5,
    groupName: 'Immunology',
    subGroupId: 238,
    subGroupName: 'CRP (C-Reactive Protein)',
    fee: 900,
  },
  {
    id: '307',
    groupId: 6,
    groupName: 'Biochemistry',
    subGroupId: 307,
    subGroupName: 'Kidney Function Test',
    fee: 1100,
  },
  {
    id: '315',
    groupId: 7,
    groupName: 'Microbiology',
    subGroupId: 315,
    subGroupName: 'Blood Culture',
    fee: 1600,
  },
  {
    id: '316',
    groupId: 8,
    groupName: 'Immunology',
    subGroupId: 316,
    subGroupName: 'Hepatitis Profile',
    fee: 2000,
  },
  {
    id: '317',
    groupId: 9,
    groupName: 'Radiology',
    subGroupId: 317,
    subGroupName: 'X-Ray Chest',
    fee: 800,
  },
  {
    id: '401',
    groupId: 10,
    groupName: 'Radiology',
    subGroupId: 401,
    subGroupName: 'Ultrasound Abdomen',
    fee: 1800,
  },
];

let subGroupRows = INITIAL_SUB_GROUP_ROWS.map((row) => ({ ...row }));
let nextSubGroupId =
  Math.max(...INITIAL_SUB_GROUP_ROWS.map((row) => row.subGroupId), 0) + 1;

export function getSubGroupRows() {
  return subGroupRows;
}

export function createSubGroupRow(rowPayload) {
  const subGroupId = nextSubGroupId++;

  const row = {
    id: String(subGroupId),
    subGroupId,
    ...rowPayload,
  };

  subGroupRows = [row, ...subGroupRows];

  return row;
}
export function updateSubGroupRow(id, rowPayload) {
  subGroupRows = subGroupRows.map((row) =>
    row.id === id
      ? { ...row, ...rowPayload }
      : row,
  );

  return subGroupRows.find((row) => row.id === id) ?? null;
}
export function deleteSubGroupRow(id) {
  subGroupRows = subGroupRows.filter(
    (row) => row.id !== id,
  );
}
export function createEmptySubGroupForm() {
  return {
    id: '',
    groupName: '',
    subGroupName: '',
    fee: '0',
  };
}

export function rowToSubGroupForm(row) {
  const groupName =
    GROUP_OPTIONS.find((option) => option.label === row.groupName)?.value ?? 'haematology';
     

  return {
    groupName,
    subGroupName: row.subGroupName ?? '',
    fee: row.fee ?? 0,
  };
}
export function getOptionLabel(options, value) {
  return options.find((option) => option.value === value)?.label ?? value;
}




