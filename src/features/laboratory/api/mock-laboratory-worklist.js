import dayjs from 'dayjs';

export const LABORATORY_STATUS_OPTIONS = [
  { value: 'sample-collection', label: 'Sample Collection' },
  { value: 'sample-receiving', label: 'Sample Receiving' },
  { value: 'result-entry', label: 'Result Entry' },
  { value: 'test-conducted', label: 'Test Conducted' },
  { value: 'undelivered-reports', label: 'Undelivered Reports' },
  { value: 'delivered-reports', label: 'Delivered Reports' },
];

export const LABORATORY_ALL_OPTION = { value: 'all', label: 'ALL' };

export const LABORATORY_PATIENT_TYPE_OPTIONS = [
  LABORATORY_ALL_OPTION,
  { value: 'opd', label: 'OPD' },
  { value: 'panel', label: 'Panel' },
  { value: 'general', label: 'General' },
  { value: 'b2b', label: 'B2B' },
];
export const CENTER_TYPE_OPTIONS = [
  LABORATORY_ALL_OPTION,
  { value: 'mainlab', label: 'Main Lab' },
  { value: 'johartown', label: 'Johar Town' },
  { value: 'gulberg', label: 'Gulberg' },
  { value: 'wapdatown', label: 'Wapda Town' },
];

export const LABORATORY_TEST_GROUP_OPTIONS = [
  LABORATORY_ALL_OPTION,
  { value: 'hematology', label: 'Hematology' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'microbiology', label: 'Microbiology' },
  { value: 'serology', label: 'Serology' },
];

export const LABORATORY_TEST_NAME_OPTIONS = [
  LABORATORY_ALL_OPTION,
  { value: 'cbc', label: 'CBC' },
  { value: 'esr', label: 'ESR' },
  { value: 'lft', label: 'LFT' },
  { value: 'urine', label: 'Urine Routine' },
];

export const LABORATORY_SEND_OUT_OPTIONS = [
  LABORATORY_ALL_OPTION,
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const LABORATORY_DEPARTMENT_COLORS = {
  Emergency: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  OPD: { bg: '#e8f4fc', color: '#026BB1', border: '#b8d9f0' },
  IPD: { bg: '#ede9fe', color: '#6d28d9', border: '#ddd6fe' },
  Laboratory: { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
};

export const MOCK_LABORATORY_WORKLIST_ROWS = [
  {
    id: 'lab-1',
    mrNo: 'AKHD-485968-25',
    patientName: 'Ahmed Gorah',
    relation: 'S/O',
    relationName: 'Ali Raza',
    age: '22 y',
    requestedDate: '18/05/2026 03:56:54 PM',
    department: 'Emergency',
    patientType: 'OPD',
    collectedAt: 'Main LAB',
    labNo: '6673',
    visitNo: '20261042',
    cnic: '35202-1234567-1',
    mobile: '03001234567',
    firstName: 'Ahmed',
    lastName: 'Gorah',
    gender: 'Male',
    dob: 'May 22, 2004',
    ageDetail: '22 Years 0M 5D',
    doctor: 'Dr SOHAIL AHMAD',
    testDisplay: 'TEST TEST',
    checkupType: 'Emergency',
    status: 'sample-collection',
    testGroup: 'hematology',
    testName: 'cbc',
    sendOut: 'no',
  },
  {
    id: 'lab-2',
    mrNo: 'AKHD-485912-18',
    patientName: 'Sara Khan',
    relation: 'D/O',
    relationName: 'Khalid Khan',
    age: '42 y',
    requestedDate: '17/05/2026 10:45:00 AM',
    department: 'OPD',
    patientType: 'Panel',
    collectedAt: 'Main LAB',
    labNo: '6651',
    visitNo: '20261038',
    cnic: '35202-9876543-2',
    mobile: '03129876543',
    firstName: 'Sara',
    lastName: 'Khan',
    status: 'sample-receiving',
    testGroup: 'biochemistry',
    testName: 'lft',
    sendOut: 'no',
  },
  {
    id: 'lab-3',
    mrNo: 'AKHD-485880-11',
    patientName: 'Hassan Ali',
    relation: 'S/O',
    relationName: 'Ali Raza',
    age: '35 y',
    requestedDate: '16/05/2026 03:20:00 PM',
    department: 'Emergency',
    patientType: 'General',
    collectedAt: 'City LAB',
    labNo: '6628',
    visitNo: '20261031',
    cnic: '35202-5566778-3',
    mobile: '03335566778',
    firstName: 'Hassan',
    lastName: 'Ali',
    status: 'result-entry',
    testGroup: 'hematology',
    testName: 'esr',
    sendOut: 'yes',
  },
  {
    id: 'lab-4',
    mrNo: 'AKHD-485850-09',
    patientName: 'Fatima Noor',
    relation: 'W/O',
    relationName: 'Ahmed Noor',
    age: '28 y',
    requestedDate: '15/05/2026 09:05:00 AM',
    department: 'OPD',
    patientType: 'OPD',
    collectedAt: 'Main LAB',
    labNo: '6610',
    visitNo: '20261025',
    cnic: '35202-3344556-4',
    mobile: '03451234567',
    firstName: 'Fatima',
    lastName: 'Noor',
    status: 'test-conducted',
    testGroup: 'serology',
    testName: 'urine',
    sendOut: 'no',
  },
  {
    id: 'lab-7',
    mrNo: 'AKHD-485760-03',
    patientName: 'Bilal Hussain',
    relation: 'S/O',
    relationName: 'Hussain Ali',
    age: '45 y',
    requestedDate: '15/05/2026 04:15:00 PM',
    department: 'Emergency',
    patientType: 'OPD',
    collectedAt: 'Main LAB',
    labNo: '6602',
    visitNo: '20261022',
    cnic: '35202-4455667-7',
    mobile: '03014455667',
    firstName: 'Bilal',
    lastName: 'Hussain',
    status: 'test-conducted',
    testGroup: 'hematology',
    testName: 'cbc',
    sendOut: 'no',
  },
  {
    id: 'lab-8',
    mrNo: 'AKHD-485740-01',
    patientName: 'Nadia Sheikh',
    relation: 'D/O',
    relationName: 'Sheikh Imran',
    age: '31 y',
    requestedDate: '14/05/2026 08:30:00 AM',
    department: 'OPD',
    patientType: 'Panel',
    collectedAt: 'City LAB',
    labNo: '6588',
    visitNo: '20261017',
    cnic: '35202-9988776-8',
    mobile: '03219988776',
    firstName: 'Nadia',
    lastName: 'Sheikh',
    status: 'test-conducted',
    testGroup: 'biochemistry',
    testName: 'lft',
    sendOut: 'yes',
  },
  {
    id: 'lab-9',
    mrNo: 'AKHD-485720-88',
    patientName: 'Kamran Siddiqui',
    relation: 'S/O',
    relationName: 'Siddiqui Aslam',
    age: '38 y',
    requestedDate: '16/05/2026 11:10:00 AM',
    department: 'Laboratory',
    patientType: 'General',
    collectedAt: 'Main LAB',
    labNo: '6635',
    visitNo: '20261033',
    cnic: '35202-6677889-9',
    mobile: '03336677889',
    firstName: 'Kamran',
    lastName: 'Siddiqui',
    status: 'test-conducted',
    testGroup: 'microbiology',
    testName: 'urine',
    sendOut: 'no',
  },
  {
    id: 'lab-5',
    mrNo: 'AKHD-485820-07',
    patientName: 'Usman Tariq',
    relation: 'S/O',
    relationName: 'Tariq Mahmood',
    age: '51 y',
    requestedDate: '14/05/2026 02:40:00 PM',
    department: 'Emergency',
    patientType: 'Panel',
    collectedAt: 'Main LAB',
    labNo: '6594',
    visitNo: '20261019',
    cnic: '35202-7788990-5',
    mobile: '03217788990',
    firstName: 'Usman',
    lastName: 'Tariq',
    status: 'undelivered-reports',
    testGroup: 'biochemistry',
    testName: 'lft',
    sendOut: 'no',
  },
  {
    id: 'lab-10',
    mrNo: 'AKHD-485700-44',
    patientName: 'Rashid Mehmood',
    relation: 'S/O',
    relationName: 'Mehmood Akhtar',
    age: '29 y',
    requestedDate: '17/05/2026 09:15:00 AM',
    department: 'OPD',
    patientType: 'OPD',
    collectedAt: 'Main LAB',
    labNo: '6642',
    visitNo: '20261035',
    cnic: '35202-2233445-1',
    mobile: '03012233445',
    firstName: 'Rashid',
    lastName: 'Mehmood',
    status: 'undelivered-reports',
    testGroup: 'hematology',
    testName: 'cbc',
    sendOut: 'no',
  },
  {
    id: 'lab-11',
    mrNo: 'AKHD-485680-32',
    patientName: 'Saima Bibi',
    relation: 'W/O',
    relationName: 'Imran Khan',
    age: '36 y',
    requestedDate: '16/05/2026 01:30:00 PM',
    department: 'Emergency',
    patientType: 'General',
    collectedAt: 'City LAB',
    labNo: '6630',
    visitNo: '20261030',
    cnic: '35202-3344556-2',
    mobile: '03123344556',
    firstName: 'Saima',
    lastName: 'Bibi',
    status: 'undelivered-reports',
    testGroup: 'serology',
    testName: 'urine',
    sendOut: 'yes',
  },
  {
    id: 'lab-12',
    mrNo: 'AKHD-485660-21',
    patientName: 'Faisal Iqbal',
    relation: 'S/O',
    relationName: 'Iqbal Hussain',
    age: '47 y',
    requestedDate: '15/05/2026 10:00:00 AM',
    department: 'Laboratory',
    patientType: 'Panel',
    collectedAt: 'Main LAB',
    labNo: '6618',
    visitNo: '20261027',
    cnic: '35202-4455667-3',
    mobile: '03234455667',
    firstName: 'Faisal',
    lastName: 'Iqbal',
    status: 'undelivered-reports',
    testGroup: 'biochemistry',
    testName: 'lft',
    sendOut: 'no',
  },
  {
    id: 'lab-13',
    mrNo: 'AKHD-485640-15',
    patientName: 'Hina Shah',
    relation: 'D/O',
    relationName: 'Shahid Ali',
    age: '24 y',
    requestedDate: '18/05/2026 04:45:00 PM',
    department: 'OPD',
    patientType: 'B2B',
    collectedAt: 'Main LAB',
    labNo: '6660',
    visitNo: '20261040',
    cnic: '35202-5566778-4',
    mobile: '03345566778',
    firstName: 'Hina',
    lastName: 'Shah',
    status: 'undelivered-reports',
    testGroup: 'microbiology',
    testName: 'urine',
    sendOut: 'no',
  },
  {
    id: 'lab-6',
    mrNo: 'AKHD-485790-05',
    patientName: 'Ayesha Malik',
    relation: 'D/O',
    relationName: 'Malik Saeed',
    age: '33 y',
    requestedDate: '13/05/2026 11:20:00 AM',
    department: 'Laboratory',
    patientType: 'General',
    collectedAt: 'City LAB',
    labNo: '6572',
    visitNo: '20261012',
    cnic: '35202-1122334-6',
    mobile: '03035551234',
    firstName: 'Ayesha',
    lastName: 'Malik',
    status: 'delivered-reports',
    testGroup: 'hematology',
    testName: 'cbc',
    sendOut: 'yes',
  },
  {
    id: 'lab-14',
    mrNo: 'AKHD-485620-09',
    patientName: 'Tariq Jamil',
    relation: 'S/O',
    relationName: 'Jamil Ahmed',
    age: '55 y',
    requestedDate: '12/05/2026 08:00:00 AM',
    department: 'Emergency',
    patientType: 'OPD',
    collectedAt: 'Main LAB',
    labNo: '6560',
    visitNo: '20261008',
    cnic: '35202-6677889-5',
    mobile: '03456677889',
    firstName: 'Tariq',
    lastName: 'Jamil',
    status: 'delivered-reports',
    testGroup: 'biochemistry',
    testName: 'lft',
    sendOut: 'no',
  },
  {
    id: 'lab-15',
    mrNo: 'AKHD-485600-03',
    patientName: 'Rubina Kausar',
    relation: 'W/O',
    relationName: 'Kausar Mehmood',
    age: '41 y',
    requestedDate: '11/05/2026 03:25:00 PM',
    department: 'OPD',
    patientType: 'Panel',
    collectedAt: 'City LAB',
    labNo: '6548',
    visitNo: '20261005',
    cnic: '35202-7788990-6',
    mobile: '03567788990',
    firstName: 'Rubina',
    lastName: 'Kausar',
    status: 'delivered-reports',
    testGroup: 'hematology',
    testName: 'esr',
    sendOut: 'yes',
  },
  {
    id: 'lab-16',
    mrNo: 'AKHD-485580-88',
    patientName: 'Waqas Anwar',
    relation: 'S/O',
    relationName: 'Anwar Latif',
    age: '32 y',
    requestedDate: '10/05/2026 11:50:00 AM',
    department: 'Laboratory',
    patientType: 'General',
    collectedAt: 'Main LAB',
    labNo: '6535',
    visitNo: '20261001',
    cnic: '35202-8899001-7',
    mobile: '03678899001',
    firstName: 'Waqas',
    lastName: 'Anwar',
    status: 'delivered-reports',
    testGroup: 'serology',
    testName: 'urine',
    sendOut: 'no',
  },
  {
    id: 'lab-17',
    mrNo: 'AKHD-485560-77',
    patientName: 'Nazia Perveen',
    relation: 'D/O',
    relationName: 'Perveen Akram',
    age: '27 y',
    requestedDate: '09/05/2026 02:10:00 PM',
    department: 'Emergency',
    patientType: 'B2B',
    collectedAt: 'Main LAB',
    labNo: '6520',
    visitNo: '20260998',
    cnic: '35202-9900112-8',
    mobile: '03789900112',
    firstName: 'Nazia',
    lastName: 'Perveen',
    status: 'delivered-reports',
    testGroup: 'microbiology',
    testName: 'urine',
    sendOut: 'no',
  },
];

const CONDUCTED_TESTS_STORAGE_KEY = 'akhf-lab-conducted-tests';
const STATUS_OVERRIDES_STORAGE_KEY = 'akhf-lab-status-overrides';

function loadStatusOverrides() {
  if (typeof window === 'undefined') return {};

  try {
    const stored = window.localStorage.getItem(STATUS_OVERRIDES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveStatusOverrides(overrides) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STATUS_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // Ignore storage write failures in mock mode.
  }
}

function applyStatusOverride(row) {
  if (!row?.id) return row;

  const overrides = loadStatusOverrides();
  const overrideStatus = overrides[row.id];

  return overrideStatus ? { ...row, status: overrideStatus } : row;
}

function loadConductedTestRows() {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(CONDUCTED_TESTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveConductedTestRows(rows) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(CONDUCTED_TESTS_STORAGE_KEY, JSON.stringify(rows));
  } catch {
    // Ignore storage write failures in mock mode.
  }
}

export function addConductedTestRow(record, { testKey, testGroup } = {}) {
  if (!record?.id || !testKey) return null;

  const conductedRows = loadConductedTestRows();
  const id = `${record.id}-${testKey}-conducted`;

  if (conductedRows.some((row) => row.id === id)) {
    return conductedRows.find((row) => row.id === id) ?? null;
  }

  const conductedAt = dayjs();
  const newRow = {
    ...record,
    id,
    status: 'test-conducted',
    testGroup: testGroup ?? record.testGroup,
    testName: testKey,
    requestedDate: conductedAt.format('DD/MM/YYYY HH:mm:ss A'),
    conductedAt: conductedAt.toISOString(),
    sourceRecordId: record.id,
  };

  saveConductedTestRows([newRow, ...conductedRows]);
  return newRow;
}

export function getAllLaboratoryWorklistRows() {
  return [...loadConductedTestRows(), ...MOCK_LABORATORY_WORKLIST_ROWS].map(applyStatusOverride);
}

export function getWorklistRowById(recordId) {
  if (!recordId) return null;

  return getAllLaboratoryWorklistRows().find((item) => item.id === recordId) ?? null;
}

export function updateLaboratoryWorklistStatus(recordId, status) {
  if (!recordId || !status) return null;

  const overrides = loadStatusOverrides();
  overrides[recordId] = status;
  saveStatusOverrides(overrides);

  const row =
    MOCK_LABORATORY_WORKLIST_ROWS.find((item) => item.id === recordId) ??
    loadConductedTestRows().find((item) => item.id === recordId) ??
    null;

  return row ? applyStatusOverride({ ...row, status }) : null;
}

export function getDefaultLaboratoryWorklistResults(rows, defaultStatus = 'result-entry') {
  return rows.filter((row) => row.status === defaultStatus);
}

export function createLaboratoryWorklistFilters(defaultStatus = 'result-entry') {
  return {
    firstName: '',
    lastName: '',
    cnic: '',
    dateRange: [dayjs('2004-02-22'), dayjs('2004-02-22')],
    labNo: '',
    patientType: 'all',
    mrNo: '',
    visitNo: '',
    patientAge: '22',
    ageUnit: 'years',
    mobile: '',
    testNameText: '',
    status: defaultStatus,
    testGroup: 'all',
    testNameOption: 'all',
    sendOut: 'all',
    departmentType: 'all',
    referenceNo: '',
  };
}

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function matchesDateRange(requestedDate, fromDate, toDate) {
  if (!fromDate && !toDate) return true;

  const parsed = dayjs(requestedDate, 'DD/MM/YYYY HH:mm:ss A', true);
  if (!parsed.isValid()) return true;

  if (fromDate && parsed.isBefore(fromDate.startOf('day'))) return false;
  if (toDate && parsed.isAfter(toDate.endOf('day'))) return false;
  return true;
}

export function searchLaboratoryWorklistRows(
  rows,
  {
    firstName = '',
    lastName = '',
    cnic = '',
    dateRange = null,
    labNo = '',
    patientType = 'all',
    mrNo = '',
    visitNo = '',
    mobile = '',
    testNameText = '',
    status = 'result-entry',
    testGroup = 'all',
    testNameOption = 'all',
    sendOut = 'all',
    referenceNo = '',
  } = {},
) {
  const fromDate = dateRange?.[0] ?? null;
  const toDate = dateRange?.[1] ?? null;
  const firstQuery = normalize(firstName);
  const lastQuery = normalize(lastName);
  const cnicQuery = normalize(cnic);
  const labQuery = normalize(labNo);
  const mrQuery = normalize(mrNo);
  const visitQuery = normalize(visitNo);
  const mobileQuery = normalize(mobile).replace(/\D/g, '');
  const testNameQuery = normalize(testNameText);
  const referenceQuery = normalize(referenceNo);

  const hasFilter =
    firstQuery ||
    lastQuery ||
    cnicQuery ||
    fromDate ||
    toDate ||
    labQuery ||
    (patientType && patientType !== 'all') ||
    mrQuery ||
    visitQuery ||
    mobileQuery ||
    testNameQuery ||
    (status && status !== 'all') ||
    (testGroup && testGroup !== 'all') ||
    (testNameOption && testNameOption !== 'all') ||
    (sendOut && sendOut !== 'all') ||
    referenceQuery;

  if (!hasFilter) {
    return rows;
  }

  return rows.filter((row) => {
    const nameParts = row.patientName.toLowerCase().split(/\s+/);

    if (firstQuery && !(nameParts[0] ?? '').includes(firstQuery)) return false;
    if (lastQuery && !(nameParts[nameParts.length - 1] ?? '').includes(lastQuery)) return false;
    if (cnicQuery && !normalize(row.cnic).includes(cnicQuery)) return false;
    if (labQuery && !normalize(row.labNo).includes(labQuery)) return false;
    if (patientType !== 'all' && normalize(row.patientType) !== patientType) return false;
    if (mrQuery && !normalize(row.mrNo).includes(mrQuery)) return false;
    if (visitQuery && !normalize(row.visitNo).includes(visitQuery)) return false;
    if (mobileQuery && !normalize(row.mobile).replace(/\D/g, '').includes(mobileQuery)) return false;
    if (testNameQuery && !normalize(row.testName).includes(testNameQuery)) return false;
    if (!matchesDateRange(row.requestedDate, fromDate, toDate)) return false;
    if (status !== 'all' && row.status !== status) return false;
    if (testGroup !== 'all' && row.testGroup !== testGroup) return false;
    if (testNameOption !== 'all' && row.testName !== testNameOption) return false;
    if (sendOut !== 'all' && row.sendOut !== sendOut) return false;
    if (referenceQuery && !normalize(row.labNo).includes(referenceQuery)) return false;

    return true;
  });
}
