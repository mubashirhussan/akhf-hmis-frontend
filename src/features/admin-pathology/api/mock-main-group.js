export const INITIAL_MAIN_GROUP_ROWS = [
  { id: '10', groupId: 10, groupName: 'Haematology', fee: 1000 },
  { id: '12', groupId: 12, groupName: 'Microbiology', fee: 1000 },
  { id: '94', groupId: 94, groupName: 'Serology', fee: 0 },
  { id: '98', groupId: 98, groupName: 'Chemistry', fee: 0 },
  { id: '101', groupId: 101, groupName: 'Histopathology', fee: 5000 },
  { id: '114', groupId: 114, groupName: 'MISCILINIOUS', fee: 100 },
  { id: '115', groupId: 115, groupName: 'Bone Marrow Examination (Haematology)', fee: 200 },
  { id: '116', groupId: 116, groupName: 'Special Stains In Haematology', fee: 200 },
  { id: '117', groupId: 117, groupName: 'Clinical Chemistry', fee: 100 },
  { id: '118', groupId: 118, groupName: 'Enzymology', fee: 100 },
];

export function createEmptyMainGroupForm() {
  return {
    groupName: '',
    fee: 0,
  };
}

export function rowToMainGroupForm(row) {
  return {
    groupName: row.groupName ?? '',
    fee: row.fee ?? 0,
  };
}

