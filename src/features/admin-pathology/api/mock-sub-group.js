export const GROUP_OPTIONS = [
  { value: 'haematology', label: 'Haematology' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'microbiology', label: 'Microbiology' },
];


export const INITIAL_SUB_GROUP_ROWS = [
  {
    id: '29',
    groupId :1,
    groupName: 'Haematology',
    subGroupId: 29,
    subGroupName: 'CBC',
    fee: 1000,
  },
  {
    id: '52',
    groupId :2,
    groupName: 'Haematology',
    subGroupId: 52,
    subGroupName: 'Absolute Values',
    fee: 1000,
  },
  {
    id: '92',
    groupId :3,
    groupName: 'Haematology',
    subGroupId: 92,
    subGroupName: "RBC's Morphology",
    fee: 150,
  },
  {
    id: '185',
    groupId :4,
    groupName: 'Haematology',
    subGroupId: 185,
    subGroupName: 'Blood Cross Match',
    fee: 700,
  },
  {
    id: '238',
    groupId :5,
    groupName: 'Haematology',
    subGroupId: 238,
    subGroupName: 'Absolute Cell Counts',
    fee: 20,
  },
  {
    id: '307',
    groupId :6,
    groupName: 'Haematology',
    subGroupId: 307,
    subGroupName: "Donor's Tests",
    fee: '350',
  },
  {
    id: '315',
    groupId :7,
    groupName: 'Haematology',
    subGroupId: 315,
    subGroupName: 'Blood Bag Information',
    fee: '640',
  },
  {
    id: '316',
    groupId :8,
    groupName: 'Haematology',
    subGroupId: 316,
    subGroupName: 'Recipient Information',
    fee: '670',
  },
  {
    id: '317',
    groupId :9,
    groupName: 'Haematology',
    subGroupId: 317,
    subGroupName: "Donor's Information",
    fee: '650',
  },
];

export function createEmptySubGroupForm() {
  return {
    id: '',
    groupName: 'Haematology',
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




