export const SUB_GROUP_FIELDS = [
  {
    type: 'select',
    name: 'TGID',
    label: 'Group Name',
    col: 24,
    options: [],
    rules: [{ required: true, message: 'Group Name is required.' }],
  },
  {
    type: 'text',
    name: 'subGroupName',
    label: 'Sub Group Name',
    col: 24,
    rules: [{ required: true, whitespace: true, message: 'Sub Group Name is required.' }],
  },
  {
    type: 'number',
    name: 'fee',
    label: 'Fee',
    col: 24,
    props: { min: 0 },
  },
];
