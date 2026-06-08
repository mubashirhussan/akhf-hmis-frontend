import dayjs from 'dayjs';

export const SAMPLE_COLLECTION_STATUS_OPTIONS = [
  { value: 'result-entry', label: 'Result Entry' },
  { value: 'sample-collection', label: 'Sample Collection' },
  { value: 'sample-receiving', label: 'Sample Receiving' },
  { value: 'test-conducted', label: 'Test Conducted' },
];

export const SAMPLE_COLLECTION_ALL_OPTION = { value: 'all', label: 'ALL' };

export const SAMPLE_COLLECTION_PATIENT_TYPE_OPTIONS = [
  SAMPLE_COLLECTION_ALL_OPTION,
  { value: 'opd', label: 'OPD' },
  { value: 'panel', label: 'Panel' },
  { value: 'general', label: 'General' },
  { value: 'b2b', label: 'B2B' },
];

export const SAMPLE_COLLECTION_TEST_GROUP_OPTIONS = [
  SAMPLE_COLLECTION_ALL_OPTION,
  { value: 'hematology', label: 'Hematology' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'microbiology', label: 'Microbiology' },
  { value: 'serology', label: 'Serology' },
];

export const SAMPLE_COLLECTION_TEST_NAME_OPTIONS = [
  SAMPLE_COLLECTION_ALL_OPTION,
  { value: 'cbc', label: 'CBC' },
  { value: 'esr', label: 'ESR' },
  { value: 'lft', label: 'LFT' },
  { value: 'urine', label: 'Urine Routine' },
];

export const SAMPLE_COLLECTION_SEND_OUT_OPTIONS = [
  SAMPLE_COLLECTION_ALL_OPTION,
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const SAMPLE_COLLECTION_DEPARTMENT_COLORS = {
  Emergency: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  OPD: { bg: '#e8f4fc', color: '#026BB1', border: '#b8d9f0' },
  IPD: { bg: '#ede9fe', color: '#6d28d9', border: '#ddd6fe' },
  Laboratory: { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
};

export const MOCK_SAMPLE_COLLECTION_ROWS = [
  {
    id: 'sc-1',
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
    status: 'result-entry',
    testGroup: 'hematology',
    testName: 'cbc',
    sendOut: 'no',
  },
  {
    id: 'sc-2',
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
    status: 'sample-collection',
    testGroup: 'biochemistry',
    testName: 'lft',
    sendOut: 'no',
  },
  {
    id: 'sc-3',
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
];

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

export function searchSampleCollectionRows(
  rows,
  {
    firstName = '',
    lastName = '',
    cnic = '',
    fromDate = null,
    labNo = '',
    patientType = 'all',
    mrNo = '',
    visitNo = '',
    mobile = '',
    testNameText = '',
    toDate = null,
    status = 'result-entry',
    testGroup = 'all',
    testNameOption = 'all',
    sendOut = 'all',
    referenceNo = '',
  } = {},
) {
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
    labQuery ||
    (patientType && patientType !== 'all') ||
    mrQuery ||
    visitQuery ||
    mobileQuery ||
    testNameQuery ||
    toDate ||
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
