export const DOCTOR_OPTIONS = [
  {
    value: 'Dr. Mujahid Habib',
    label: 'Dr. Mujahid Habib',
    doctorQualification: 'MBBS, DCP, M.Phil (Histopathology)',
    doctorDesignation: 'Consultant Pathologist',
  },
  {
    value: 'Dr. Saima Khan',
    label: 'Dr. Saima Khan',
    doctorQualification: 'MBBS, FCPS (Haematology)',
    doctorDesignation: 'Consultant Haematologist',
  },
  {
    value: 'Dr. Asif Raza',
    label: 'Dr. Asif Raza',
    doctorQualification: 'MBBS, M.Phil (Microbiology)',
    doctorDesignation: 'Consultant Microbiologist',
  },
];

export function getDoctorDetails(doctorName) {
  return DOCTOR_OPTIONS.find((option) => option.value === doctorName) ?? null;
}

export const INITIAL_REPORT_CONSULTANT_ROWS = [
  {
    id: '1',
    consultantId: 1,
    doctorName: 'Dr. Mujahid Habib',
    doctorQualification: 'MBBS, DCP, M.Phil (Histopathology)',
    doctorDesignation: 'Consultant Pathologist',
  },
  {
    id: '2',
    consultantId: 2,
    doctorName: 'Dr. Saima Khan',
    doctorQualification: 'MBBS, FCPS (Haematology)',
    doctorDesignation: 'Consultant Haematologist',
  },
  {
    id: '3',
    consultantId: 3,
    doctorName: 'Dr. Asif Raza',
    doctorQualification: 'MBBS, M.Phil (Microbiology)',
    doctorDesignation: 'Consultant Microbiologist',
  },
];

let consultantRows = INITIAL_REPORT_CONSULTANT_ROWS.map((row) => ({ ...row }));

let nextConsultantId =
  Math.max(...INITIAL_REPORT_CONSULTANT_ROWS.map((row) => row.consultantId), 0) + 1;

export function getReportConsultantRows() {
  return consultantRows;
}

export function createReportConsultantRow(rowPayload) {
  const consultantId = nextConsultantId++;

  const row = {
    id: String(consultantId),
    consultantId,
    ...rowPayload,
  };

  consultantRows = [row, ...consultantRows];

  return row;
}

export function updateReportConsultantRow(id, rowPayload) {
  consultantRows = consultantRows.map((row) =>
    row.id === id ? { ...row, ...rowPayload } : row,
  );

  return consultantRows.find((row) => row.id === id) ?? null;
}

export function deleteReportConsultantRow(id) {
  consultantRows = consultantRows.filter((row) => row.id !== id);
}

export function createEmptyReportConsultantForm() {
  return {
    doctorName: '',
    doctorQualification: '',
    doctorDesignation: '',
  };
}

export function rowToReportConsultantForm(row) {
  return {
    doctorName: row.doctorName ?? '',
    doctorQualification: row.doctorQualification ?? '',
    doctorDesignation: row.doctorDesignation ?? '',
  };
}
