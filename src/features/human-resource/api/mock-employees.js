export const INITIAL_EMPLOYEE_ROWS = [
  {
    id: '1',
    employeeNo: 'EMP-001',
    title: 'dr',
    firstName: 'Sohail',
    middleName: '',
    lastName: 'Ahmad',
    relationType: 'so',
    relationFirstName: 'Muhammad',
    relationMiddleName: '',
    relationLastName: 'Ahmad',
    relationName: '',
    gender: 'male',
    employeeType: 'permanent',
    nationality: 'pakistani',
    otherNationality: 'pakistani',
    placeOfBirth: 'abbotabad',
    religion: 'islam',
    maritalStatus: 'married',
    domicile: 'abbotabad',
    cnicNo: '35202-1234567-1',
    passportNo: '',
    cnicExpiry: '31/12/2030',
    cnicExpiryLifetime: false,
    languageKnown: 'Urdu, English',
    bloodGroup: 'o-positive',
    mobileNo: '0300-1234567',
    emailAddress: 'sohail.ahmad@alkhidmat.org',
    emergencyContactNo: '0300-9876543',
    emergencyContactName: 'Ayesha Ahmad',
    districtName: 'abbotabad',
    tehsilName: 'abbotabad',
    permanentAddress: 'House 12, Main Bazaar, Abbotabad',
    presentAddress: 'House 12, Main Bazaar, Abbotabad',
    officeAddress: 'ALKHIDMAT HOSPITAL PESHAWAR',
    designation: 'neuro-surgeon',
    grade: '5',
    doj: '01/01/2018',
    hospital: 'alkhidmat-hospital-peshawar',
    department: 'medical',
    ntnNo: '1234567-8',
    subDepartment: 'administration',
    designationDetail: 'Consultant Neuro Surgeon',
    shift: 'morning',
    gpFundNo: 'GP-1001',
    salaryMode: 'bank-transfer',
    providentFundNo: 'PF-2001',
    eobiNo: 'EOBI-3001',
    isConsultant: true,
    picture: null,
    age: '42 Years',
    status: 'active',
  },
  {
    id: '2',
    employeeNo: 'EMP-002',
    title: 'ms',
    firstName: 'Fatima',
    middleName: '',
    lastName: 'Khan',
    relationType: 'do',
    relationFirstName: 'Khalid',
    relationMiddleName: '',
    relationLastName: 'Khan',
    relationName: '',
    gender: 'female',
    employeeType: 'contract',
    nationality: 'pakistani',
    otherNationality: 'pakistani',
    placeOfBirth: 'karachi',
    religion: 'islam',
    maritalStatus: 'single',
    domicile: 'haripur',
    cnicNo: '35202-9876543-2',
    passportNo: '',
    cnicExpiry: '',
    cnicExpiryLifetime: true,
    languageKnown: 'Urdu',
    bloodGroup: 'a-positive',
    mobileNo: '0312-5556677',
    emailAddress: 'fatima.khan@alkhidmat.org',
    emergencyContactNo: '0333-1112233',
    emergencyContactName: 'Khalid Khan',
    districtName: 'haripur',
    tehsilName: 'havelian',
    permanentAddress: 'Street 4, Haripur',
    presentAddress: 'Staff Quarters, Karachi',
    officeAddress: 'ALKHIDMAT DIAGNOSTICS KARACHI',
    designation: 'staff-nurse',
    grade: '3',
    doj: '15/06/2022',
    hospital: 'alkhidmat-diagnostics-karachi',
    department: 'human-resource',
    ntnNo: '',
    subDepartment: 'reception',
    designationDetail: 'Staff Nurse',
    shift: 'evening',
    gpFundNo: '',
    salaryMode: 'cash',
    providentFundNo: '',
    eobiNo: '',
    isConsultant: false,
    picture: null,
    age: '28 Years',
    status: 'active',
  },
];

let employeeRows = INITIAL_EMPLOYEE_ROWS.map((row) => ({ ...row }));

let nextEmployeeId =
  Math.max(...INITIAL_EMPLOYEE_ROWS.map((row) => Number(row.id)), 0) + 1;

export function getEmployeeRows() {
  return employeeRows;
}

export function getEmployeeById(id) {
  return employeeRows.find((row) => row.id === id) ?? null;
}

export function createEmployeeRow(employeePayload) {
  const id = String(nextEmployeeId++);

  const row = {
    id,
    status: 'active',
    ...employeePayload,
  };

  employeeRows = [row, ...employeeRows];

  return row;
}

export function getEmployeeDisplayName(employee) {
  return [employee?.firstName, employee?.middleName, employee?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
}
