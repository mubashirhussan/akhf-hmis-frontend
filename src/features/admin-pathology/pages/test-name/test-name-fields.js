export const TEST_NAME_INITIAL_VALUES = {
  TGID: null,
  TSGID: null,
  testName: '',
  medicalName: '',
  standardName: '',
  fee: 0,
};

export const getTestNameFields = (groupOptions = [], subGroupOptions = []) => [
  {
    type: 'select',
    name: 'TGID',
    label: 'Group Name',
    col: 12,
    options: groupOptions,
    rules: [{ required: true, message: 'Group Name is required.' }],
  },
  {
    type: 'select',
    name: 'TSGID',
    label: 'Sub Group Name',
    col: 12,
    options: subGroupOptions,
    rules: [{ required: true, message: 'Sub Group Name is required.' }],
    props: { disabled: subGroupOptions.length === 0 },
  },
  {
    type: 'text',
    name: 'testName',
    label: 'Test Name',
    col: 12,
    rules: [{ required: true, whitespace: true, message: 'Test Name is required.' }],
  },
  {
    type: 'text',
    name: 'medicalName',
    label: 'Medical Name',
    col: 12,
  },
  {
    type: 'text',
    name: 'standardName',
    label: 'Standard Name',
    col: 12,
  },
  {
    type: 'number',
    name: 'fee',
    label: 'Fee',
    col: 12,
    props: { min: 0 },
  },
];