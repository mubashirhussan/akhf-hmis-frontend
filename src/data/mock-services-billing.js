export const MOCK_SERVICES_BILLING_VISITS = [
  {
    id: '1',
    visitNo: '20261042',
    regNo: 'REG-000123',
    patientName: 'Ammar Shahid',
    plName: 'AKHF Main Lab',
    relation: 'S/O',
    relationName: 'Shahid Mehmood',
    age: '64 Years',
    gender: 'Male',
    regDateTime: '18 May 2026, 01:12 PM',
    cnic: '35202-1234567-1',
    mobile: '03001234567',
    dateTimeTo: '18 May 2026, 05:00 PM',
    status: 'Open',
    patientType: 'General',
    checkupType: 'OPD',
  },
  {
    id: '2',
    visitNo: 'V-2026-1038',
    regNo: 'REG-000124',
    patientName: 'Sara Khan',
    plName: 'City Diagnostics',
    relation: 'D/O',
    relationName: 'Khalid Khan',
    age: '42 Years',
    gender: 'Female',
    regDateTime: '17 May 2026, 10:45 AM',
    cnic: '35202-9876543-2',
    mobile: '03129876543',
    dateTimeTo: '17 May 2026, 02:30 PM',
    status: 'Billed',
    patientType: 'Panel',
    checkupType: 'Emergency',
  },
  {
    id: '3',
    visitNo: '20261031',
    regNo: 'REG-000125',
    patientName: 'Hassan Ali',
    plName: 'AKHF Main Lab',
    relation: 'S/O',
    relationName: 'Ali Raza',
    age: '35 Years',
    gender: 'Male',
    regDateTime: '16 May 2026, 03:20 PM',
    cnic: '35202-5566778-3',
    mobile: '03335566778',
    dateTimeTo: '16 May 2026, 06:15 PM',
    status: 'Closed',
    patientType: 'B2B',
    checkupType: 'Emergency',
  },
  {
    id: '4',
    visitNo: '20261025',
    regNo: 'REG-000126',
    patientName: 'Fatima Noor',
    plName: 'Partner Lab North',
    relation: 'W/O',
    relationName: 'Ahmed Noor',
    age: '28 Years',
    gender: 'Female',
    regDateTime: '15 May 2026, 09:05 AM',
    cnic: '35202-3344556-4',
    mobile: '03451234567',
    dateTimeTo: '15 May 2026, 11:00 AM',
    status: 'Open',
    patientType: 'General',
    checkupType: 'OPD',
  },
  {
    id: '5',
    visitNo: '20261019',
    regNo: 'REG-000127',
    patientName: 'Usman Tariq',
    plName: 'AKHF Main Lab',
    relation: 'S/O',
    relationName: 'Tariq Mahmood',
    age: '51 Years',
    gender: 'Male',
    regDateTime: '14 May 2026, 02:40 PM',
    cnic: '35202-7788990-5',
    mobile: '03217788990',
    dateTimeTo: '14 May 2026, 06:00 PM',
    status: 'Billed',
    patientType: 'Panel',
    checkupType: 'Emergency',
  },
  {
    id: '6',
    visitNo: '20261012',
    regNo: 'REG-000128',
    patientName: 'Ayesha Malik',
    plName: 'City Diagnostics',
    relation: 'D/O',
    relationName: 'Malik Saeed',
    age: '33 Years',
    gender: 'Female',
    regDateTime: '13 May 2026, 11:20 AM',
    cnic: '35202-1122334-6',
    mobile: '03035551234',
    dateTimeTo: '13 May 2026, 03:45 PM',
    status: 'Open',
    patientType: 'General',
    checkupType: 'OPD',
  },
];

/** Default rows shown when Search is clicked with no filters. */
export const SERVICES_BILLING_DEFAULT_RESULTS = MOCK_SERVICES_BILLING_VISITS;

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function formatAgeLabel(age, unit) {
  if (age === '' || age == null) return '';
  const unitLabel = unit === 'years' ? 'Years' : unit === 'months' ? 'Months' : unit === 'days' ? 'Days' : 'Hours';
  return `${age} ${unitLabel}`;
}

export function searchServicesBillingVisits(
  visits,
  {
    visitNo = '',
    mrNo = '',
    patientAge = '',
    ageUnit = 'years',
    registrationDate = null,
    cnic = '',
    mobile = '',
    firstName = '',
    middleName = '',
    lastName = '',
    relationFirstName = '',
    relationMiddleName = '',
    relationLastName = '',
  } = {},
) {
  const visitQuery = normalize(visitNo);
  const mrQuery = normalize(mrNo);
  const ageQuery = normalize(patientAge);
  const ageLabelQuery = normalize(formatAgeLabel(patientAge, ageUnit));
  const cnicQuery = normalize(cnic);
  const mobileQuery = normalize(mobile).replace(/\D/g, '');
  const firstQuery = normalize(firstName);
  const middleQuery = normalize(middleName);
  const lastQuery = normalize(lastName);
  const relFirstQuery = normalize(relationFirstName);
  const relMiddleQuery = normalize(relationMiddleName);
  const relLastQuery = normalize(relationLastName);

  const regDateStr =
    registrationDate && typeof registrationDate.format === 'function'
      ? registrationDate.format('DD MMM YYYY').toLowerCase()
      : '';

  const hasFilter =
    visitQuery ||
    mrQuery ||
    ageQuery ||
    regDateStr ||
    cnicQuery ||
    mobileQuery ||
    firstQuery ||
    middleQuery ||
    lastQuery ||
    relFirstQuery ||
    relMiddleQuery ||
    relLastQuery;

  if (!hasFilter) {
    return visits;
  }

  return visits.filter((row) => {
    const nameParts = row.patientName.toLowerCase().split(/\s+/);
    const relNameParts = row.relationName.toLowerCase().split(/\s+/);

    if (visitQuery && !normalize(row.visitNo).includes(visitQuery)) return false;
    if (mrQuery && !normalize(row.regNo).includes(mrQuery)) return false;
    if (
      ageQuery &&
      !normalize(row.age).includes(ageQuery) &&
      !normalize(row.age).includes(ageLabelQuery)
    ) {
      return false;
    }
    if (regDateStr && !normalize(row.regDateTime).includes(regDateStr)) return false;
    if (cnicQuery && !normalize(row.cnic).includes(cnicQuery)) return false;
    if (mobileQuery && !normalize(row.mobile).replace(/\D/g, '').includes(mobileQuery)) return false;
    if (firstQuery && !(nameParts[0] ?? '').includes(firstQuery)) return false;
    if (middleQuery && !(nameParts[1] ?? '').includes(middleQuery)) return false;
    if (lastQuery && !(nameParts[nameParts.length - 1] ?? '').includes(lastQuery)) return false;
    if (relFirstQuery && !(relNameParts[0] ?? '').includes(relFirstQuery)) return false;
    if (relMiddleQuery && !(relNameParts[1] ?? '').includes(relMiddleQuery)) return false;
    if (relLastQuery && !(relNameParts[relNameParts.length - 1] ?? '').includes(relLastQuery)) return false;

    return true;
  });
}

export const SERVICES_BILLING_STATUS_COLORS = {
  Open: { bg: '#e8f4fc', color: '#026BB1', border: '#b8d9f0' },
  Billed: { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  Closed: { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
};

export const SERVICES_BILLING_TYPE_COLORS = {
  General: { bg: '#f0f7fc', color: '#026BB1', border: '#cfe8f6' },
  Panel: { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
  B2B: { bg: '#ede9fe', color: '#6d28d9', border: '#ddd6fe' },
  OPD: { bg: '#e8f4fc', color: '#026BB1', border: '#b8d9f0' },
  Emergency: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  'Follow-up': { bg: '#f1f5f9', color: '#334155', border: '#cbd5e1' },
};
