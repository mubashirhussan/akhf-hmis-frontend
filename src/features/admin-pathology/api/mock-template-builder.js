export const GROUP_OPTIONS = [
  { value: 'haematology', label: 'Haematology' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'microbiology', label: 'Microbiology' },
];

export const SUB_GROUP_OPTIONS = {
  haematology: [
    { value: 'cbc', label: 'CBC' },
    { value: 'absolute-cell-counts', label: 'Absolute Cell Counts' },
    { value: 'coagulation', label: 'Coagulation' },
  ],
  biochemistry: [
    { value: 'liver-function', label: 'Liver Function' },
    { value: 'renal-function', label: 'Renal Function' },
  ],
  microbiology: [
    { value: 'culture', label: 'Culture' },
    { value: 'serology', label: 'Serology' },
  ],
};

export const TEST_OPTIONS = {
  cbc: [
    { value: 'esr', label: 'ESR', tid: 991 },
    { value: 'hb', label: 'Hb', tid: 992 },
  ],
  'absolute-cell-counts': [
    { value: 'absolute-basophil-count', label: 'Absolute Basophil Count', tid: 1027 },
    { value: 'absolute-eosinophil-count', label: 'Absolute Eosinophil Count', tid: 1028 },
  ],
  coagulation: [{ value: 'pt', label: 'PT', tid: 1100 }],
  'liver-function': [{ value: 'alt', label: 'ALT', tid: 1200 }],
  'renal-function': [{ value: 'creatinine', label: 'Creatinine', tid: 1300 }],
  culture: [{ value: 'blood-culture', label: 'Blood Culture', tid: 1400 }],
  serology: [{ value: 'hbsag', label: 'HBsAg', tid: 1500 }],
};

export const FIELD_TYPE_OPTIONS = [
  { value: 'html', label: 'Html' },
  { value: 'textbox', label: 'TextBox' },
  { value: 'textarea', label: 'TextArea' },
  { value: 'dropdown', label: 'DropDown' },
];

export const UNIT_OPTIONS = [
  { value: 'mm/hr', label: 'mm/hr' },
  { value: 'g/dl', label: 'g/dl' },
  { value: 'cells/ul', label: 'cells/ul' },
  { value: 'percent', label: '%' },
];

export const INITIAL_TEMPLATE_BUILDER_ROWS = [
  {
    id: '1',
    groupName: 'Haematology',
    subGroupName: 'Absolute Cell Counts',
    tid: 991,
    testName: 'Absolute Basophil Count',
    tcid: 8789,
    componentName: 'Absolute Basophil Count',
    fieldType: 'TextBox',
    referenceMale: '0.02 - 0.50',
    referenceFemale: '0.02 - 0.50',
  },
  {
    id: '2',
    groupName: 'Haematology',
    subGroupName: 'Absolute Cell Counts',
    tid: 1027,
    testName: 'Absolute Eosinophil Count',
    tcid: 2789,
    componentName: 'Absolute Eosinophil Count',
    fieldType: 'TextBox',
    referenceMale: '40-400',
    referenceFemale: '40-400',
  },
];

export function createEmptyTemplateBuilderForm() {
  return {
    groupName: 'haematology',
    subGroupName: 'cbc',
    testName: 'esr',
    fieldType: 'html',
    componentName: '',
    unit: '',
    toolTip: '',
    referenceMale: '',
    referenceFemale: '',
    newUnit: '',
  };
}

export function getSubGroupOptions(groupName) {
  return SUB_GROUP_OPTIONS[groupName] ?? [];
}

export function getTestOptions(subGroupName) {
  return TEST_OPTIONS[subGroupName] ?? [];
}

export function getOptionLabel(options, value) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function getTestMeta(subGroupName, testName) {
  return getTestOptions(subGroupName).find((option) => option.value === testName) ?? null;
}
