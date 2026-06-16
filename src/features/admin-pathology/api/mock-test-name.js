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

export const INITIAL_TEST_NAME_ROWS = [
  {
    id: '1',
    tid: 991,
    groupName: 'Haematology',
    subGroupName: 'Absolute Cell Counts',
    testName: 'Absolute Basophil Count',
    medicalName: 'Basophil Count (Blood)',
    standardName: 'ABC Test',
    fieldType: 'TextBox',
    fee: 100
  },
  {
    id: '2',
    tid: 1027,
    groupName: 'Haematology',
    subGroupName: 'Absolute Cell Counts',
    testName: 'Absolute Eosinophil Count',
    medicalName: 'Eosinophil Count (Blood)',
    standardName: 'AEC Test',
    fieldType: 'TextBox',
    fee: 200
  },
  {
    id: '3',
    tid: 991,
    groupName: 'Haematology',
    subGroupName: 'CBC',
    testName: 'ESR',
    medicalName: 'Erythrocyte Sedimentation Rate',
    standardName: 'ESR Test',
    fieldType: 'TextBox',
    fee: 150
  },
  {
    id: '4',
    tid: 992,
    groupName: 'Haematology',
    subGroupName: 'CBC',
    testName: 'Hb',
    medicalName: 'Hemoglobin',
    standardName: 'HB Test',
    fieldType: 'TextBox',
    fee: 180
  },
  {
    id: '5',
    tid: 1100,
    groupName: 'Haematology',
    subGroupName: 'Coagulation',
    testName: 'PT',
    medicalName: 'Prothrombin Time',
    standardName: 'PT Test',
    fieldType: 'TextBox',
    fee: 250
  },
  {
    id: '6',
    tid: 1200,
    groupName: 'Biochemistry',
    subGroupName: 'Liver Function',
    testName: 'ALT',
    medicalName: 'Alanine Aminotransferase',
    standardName: 'ALT Test',
    fieldType: 'TextBox',
    fee: 300
  },
  {
    id: '7',
    tid: 1300,
    groupName: 'Biochemistry',
    subGroupName: 'Renal Function',
    testName: 'Creatinine',
    medicalName: 'Serum Creatinine',
    standardName: 'CREA Test',
    fieldType: 'TextBox',
    fee: 200
  },
  {
    id: '8',
    tid: 1500,
    groupName: 'Microbiology',
    subGroupName: 'Serology',
    testName: 'HBsAg',
    medicalName: 'Hepatitis B Surface Antigen',
    standardName: 'HBsAg Test',
    fieldType: 'TextBox',
    fee: 150
  },
  {
    id: '9',
    tid: 1400,
    groupName: 'Microbiology',
    subGroupName: 'Culture',
    testName: 'Blood Culture',
    medicalName: 'Bacterial Blood Culture',
    standardName: 'BC Test',
    fieldType: 'TextBox',
    fee: 200
  },
  {
    id: '10',
    tid: 991,
    groupName: 'Haematology',
    subGroupName: 'CBC',
    testName: 'ESR',
    medicalName: 'Erythrocyte Sedimentation Rate',
    standardName: 'ESR Test',
    fieldType: 'TextBox',
    fee: 150
  },
];

let testNameRows = INITIAL_TEST_NAME_ROWS.map((row) => ({ ...row }));
let nextTid =
  Math.max(...INITIAL_TEST_NAME_ROWS.map((row) => row.tid), 0) + 1;

export function getTestNameRows() {
  return testNameRows;
}

export function createTestNameRow(rowPayload) {
  const tid = nextTid++;

  const row = {
    id: String(tid),
    tid,
    ...rowPayload,
  };
  testNameRows = [row, ...testNameRows];
  return row;
}

export function updateTestNameRow(id, rowPayload) {
  testNameRows = testNameRows.map((row) =>
    row.id === id ? { ...row, ...rowPayload } : row,
  );
  return testNameRows.find((row) => row.id === id) ?? null;
}

export function createEmptyTestNameForm() {
  return {
    groupName: 'haematology',
    subGroupName: 'cbc',
    testName: '',
    medicalName:'',
    standardName:'',
    fee:0,
  };
}
export function deleteTestNameRow(id) {
  testNameRows = testNameRows.filter(
    (row) => row.id !== id,
  );
}

export function rowToTestNameForm(row) {
  const groupName =
    GROUP_OPTIONS.find((option) => option.label === row.groupName)?.value ?? 'haematology';
  const subGroupName =
    getSubGroupOptions(groupName).find((option) => option.label === row.subGroupName)?.value ??
    'cbc';

      return {
    groupName,
    subGroupName,
    testName:row.testName,
    medicalName:row.medicalName,
    standardName:row.standardName,
    fee:row.fee,
  };
}

export function getSubGroupOptions(subGroupName) {
  return SUB_GROUP_OPTIONS[subGroupName] ?? [];
}
export function getOptionLabel(options, value) {
  return options.find((option) => option.value === value)?.label ?? value;
}