export const MOCK_WALK_IN_PATIENTS = [
  {
    id: '1',
    registrationNo: 'MR-002-26',
    displayRegNo: 'REG-000123',
    name: 'Ammar Shahid',
    mobile: '0300-1234567',
    cnic: '35202-1234567-1',
    age: 64,
    ageLabel: '64 years',
    gender: 'Male',
    weight: '128kg',
    address: 'Lahore, Pakistan',
    visitDateTime: '18 May 2026, 01:12 PM',
    visitSummary: {
      totalVisits: 3,
      lastVisit: '18 May 2026',
      totalServices: 5,
      totalCharges: '300.00',
    },
  },
  {
    id: '2',
    registrationNo: 'MR-003-41',
    displayRegNo: 'REG-000124',
    name: 'Sara Khan',
    mobile: '0312-9876543',
    cnic: '35202-9876543-2',
    age: 42,
    ageLabel: '42 years',
    gender: 'Female',
    weight: '62kg',
    address: 'Karachi, Pakistan',
    visitDateTime: '17 May 2026, 10:45 AM',
    visitSummary: {
      totalVisits: 7,
      lastVisit: '17 May 2026',
      totalServices: 12,
      totalCharges: '1,250.00',
    },
  },
  {
    id: '3',
    registrationNo: 'MR-004-18',
    displayRegNo: 'REG-000125',
    name: 'Hassan Ali',
    mobile: '0333-5566778',
    cnic: '35202-5566778-3',
    age: 35,
    ageLabel: '35 years',
    gender: 'Male',
    weight: '78kg',
    address: 'Islamabad, Pakistan',
    visitDateTime: '16 May 2026, 03:20 PM',
    visitSummary: {
      totalVisits: 2,
      lastVisit: '16 May 2026',
      totalServices: 3,
      totalCharges: '450.00',
    },
  },
];

export function searchWalkInPatients(patients, searchBy, query) {
  const trimmed = query.trim();
  if (!trimmed) return patients;

  const normalizedQuery = trimmed.toLowerCase();

  return patients.filter((patient) => {
    if (searchBy === 'mobile') {
      const mobileDigits = patient.mobile.replace(/\D/g, '');
      const queryDigits = trimmed.replace(/\D/g, '');
      return mobileDigits.includes(queryDigits);
    }

    return (
      patient.registrationNo.toLowerCase().includes(normalizedQuery) ||
      patient.displayRegNo.toLowerCase().includes(normalizedQuery)
    );
  });
}
