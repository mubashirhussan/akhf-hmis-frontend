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
  { value: 'radiobuttonlist', label: 'RadioButtonList' },
  { value: 'checkboxlist', label: 'CheckBoxList' },
  { value: 'radiobutton', label: 'RadioButton' },
  { value: 'checkbox', label: 'CheckBox' },
  { value: 'dropdownlist', label: 'DropDownList' },
];

export const UNIT_OPTIONS = [
  { value: 'mm/hr', label: 'mm/hr' },
  { value: 'g/dl', label: 'g/dl' },
  { value: 'cells/ul', label: 'cells/ul' },
  { value: 'percent', label: '%' },
];

export const INITIAL_PATHOLOGY_COMPONENT_ROWS = [
  {
    id: '1',
    groupName: 'Haematology',
    subGroupName: 'Absolute Cell Counts',
    tid: 991,
    testName: 'Absolute Basophil Count',
    tcid: 8789,
    componentName: 'Absolute Basophil Count',
    fieldType: 'TextBox',
    unit: 'cells/ul',
    priority: 1,
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
    unit: 'cells/ul',
    priority: 2,
    referenceMale: '40-400',
    referenceFemale: '40-400',
  },
  {
    id: '3',
    groupName: 'Haematology',
    subGroupName: 'CBC',
    tid: 991,
    testName: 'ESR',
    tcid: 8790,
    componentName: 'ESR Value',
    fieldType: 'TextBox',
    unit: 'mm/hr',
    priority: 1,
    referenceMale: '0 - 20',
    referenceFemale: '0 - 30',
  },
  {
    id: '4',
    groupName: 'Haematology',
    subGroupName: 'CBC',
    tid: 992,
    testName: 'Hb',
    tcid: 8791,
    componentName: 'Haemoglobin',
    fieldType: 'TextBox',
    unit: 'g/dl',
    priority: 2,
    referenceMale: '13.0 - 17.0',
    referenceFemale: '12.0 - 15.0',
  },
  {
    id: '5',
    groupName: 'Haematology',
    subGroupName: 'Coagulation',
    tid: 1100,
    testName: 'PT',
    tcid: 8792,
    componentName: 'Prothrombin Time',
    fieldType: 'DropDownList',
    unit: '%',
    priority: 3,
    referenceMale: '11 - 13.5',
    referenceFemale: '11 - 13.5',
  },
  {
    id: '6',
    groupName: 'Biochemistry',
    subGroupName: 'Liver Function',
    tid: 1200,
    testName: 'ALT',
    tcid: 8793,
    componentName: 'ALT Level',
    fieldType: 'TextBox',
    unit: 'U/L',
    priority: 1,
    referenceMale: '7 - 56',
    referenceFemale: '7 - 56',
  },
  {
    id: '7',
    groupName: 'Biochemistry',
    subGroupName: 'Renal Function',
    tid: 1300,
    testName: 'Creatinine',
    tcid: 8794,
    componentName: 'Serum Creatinine',
    fieldType: 'TextBox',
    unit: 'mg/dl',
    priority: 2,
    referenceMale: '0.7 - 1.3',
    referenceFemale: '0.6 - 1.1',
  },
  {
    id: '8',
    groupName: 'Microbiology',
    subGroupName: 'Serology',
    tid: 1500,
    testName: 'HBsAg',
    tcid: 8795,
    componentName: 'HBsAg Result',
    fieldType: 'RadioButtonList',
    unit: '—',
    priority: 1,
    referenceMale: 'Non Reactive',
    referenceFemale: 'Non Reactive',
  },
  {
    id: '9',
    groupName: 'Microbiology',
    subGroupName: 'Culture',
    tid: 1400,
    testName: 'Blood Culture',
    tcid: 8796,
    componentName: 'Organism Identified',
    fieldType: 'CheckBoxList',
    unit: '—',
    priority: 4,
    referenceMale: '—',
    referenceFemale: '—',
  },
  {
    id: '10',
    groupName: 'Haematology',
    subGroupName: 'CBC',
    tid: 991,
    testName: 'ESR',
    tcid: 8797,
    componentName: 'ESR Interpretation',
    fieldType: 'Html',
    unit: '—',
    priority: 5,
    referenceMale: '—',
    referenceFemale: '—',
  },
];

export function createEmptyPathologyComponentForm() {
  return {
    groupName: 'haematology',
    subGroupName: 'cbc',
    testName: 'esr',
    fieldType: 'html',
    componentName: '',
    unit: '',
    priority: 1,
    toolTip: '',
    referenceMale: '',
    referenceFemale: '',
    newUnit: '',
  };
}

export function rowToPathologyComponentForm(row, unitOptions = UNIT_OPTIONS) {
  const groupName =
    GROUP_OPTIONS.find((option) => option.label === row.groupName)?.value ?? 'haematology';
  const subGroupName =
    getSubGroupOptions(groupName).find((option) => option.label === row.subGroupName)?.value ??
    'cbc';
  const testName =
    getTestOptions(subGroupName).find((option) => option.label === row.testName)?.value ?? 'esr';
  const fieldType =
    FIELD_TYPE_OPTIONS.find((option) => option.label === row.fieldType)?.value ?? 'html';
  const unit =
    unitOptions.find((option) => option.label === row.unit)?.value ??
    unitOptions.find((option) => option.value === row.unit)?.value ??
    '';

  return {
    groupName,
    subGroupName,
    testName,
    fieldType,
    componentName: row.componentName ?? '',
    unit,
    priority: row.priority ?? 1,
    toolTip: row.toolTip ?? '',
    referenceMale: row.referenceMale ?? '',
    referenceFemale: row.referenceFemale ?? '',
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
