export const ROUTES = {
  home: '/',
  login: '/login',
  forgotPassword: '/forgot-password',
  opd: {
    root: '/opd',
    patientRegistration: '/opd/patient-registration',
    walkInPatient: '/opd/walk-in-patient',
    servicesBilling: '/opd/services-billing',
    payment: '/opd/payment',
  },
  laboratory: {
    root: '/laboratory',
    sampleCollection: '/laboratory/sample-collection',
    sampleReceiving: '/laboratory/sample-receiving',
    resultEntry: '/laboratory/result-entry',
    testConducted: '/laboratory/test-conducted',
    undeliveredReports: '/laboratory/undelivered-reports',
    deliveredReports: '/laboratory/delivered-reports',
  },
  humanResource: {
    root: '/human-resource',
    employeeEntry: '/human-resource/employee-entry',
    searchAllEmployee: '/human-resource/search-all-employee',
  },
  pharmacy: '/pharmacy',
  billing: '/billing',
  settings: '/settings',
};
