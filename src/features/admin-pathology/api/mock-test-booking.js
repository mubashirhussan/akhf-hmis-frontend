export const SERVICE_OPTIONS = [
  { value: "bsr_blood_sugar_random", label: "BSR (Blood Sugar Random)" },
  { value: "ot_anesthesia_machine", label: "OT ANESTHESIA MACHINE" },
  { value: "17_oh_progesterone", label: "17-OH Hydroxy Progesterone" },
  { value: "24hr_urinary_amylase", label: "24 Hours Urinary Amylase" },
  { value: "24hr_urinary_chloride", label: "24 Hours Urinary Chloride" },
  { value: "24hr_urinary_copper", label: "24 Hours Urinary Copper" },
  { value: "24hr_urinary_cortisol", label: "24 Hours Urinary Cortisol" },
  { value: "24hr_urinary_creatinine", label: "24 HOURS URINARY CREATININE" },
  // Newly Added Services
  { value: "hba1c_glycated_hemoglobin", label: "HbA1c (Glycated Hemoglobin)" },
  { value: "lipid_profile_fasting", label: "Lipid Profile - Fasting" },
  { value: "thyroid_panel_total", label: "Thyroid Profile (T3, T4, TSH)" },
  { value: "vitamin_d3_cholecalciferol", label: "Vitamin D3 (25-Hydroxy)" },
  { value: "renal_function_test", label: "RFT / Kidney Function Test" },
  { value: "crp_quantitative", label: "C-Reactive Protein (CRP) Quantitative" },
  { value: "d_dimer_plasma", label: "D-Dimer Test" },
  { value: "urine_re_microscopic", label: "Urine Routine Examination" }
];

const INITIAL_TEST_BOOKING_ROWS = [
  {
    id: "1",
    mainGroup: "Haematology",
    testBookingName: "CBC Package",
    specimenRequired: "Blood",
    collectionTime: "08:00",
    testNames: ["ESR", "Hb"],
    service: "bsr_blood_sugar_random",
  },
  {
    id: "2",
    mainGroup: "Haematology",
    testBookingName: "Absolute Cell Count Panel",
    specimenRequired: "Blood",
    collectionTime: "09:00",
    testNames: ["Absolute Basophil Count", "Absolute Eosinophil Count"],
    service: "24hr_urinary_amylase",
  },
  {
    id: "3",
    mainGroup: "Haematology",
    testBookingName: "Coagulation Screen",
    specimenRequired: "Citrated Blood",
    collectionTime: "10:00",
    testNames: ["PT"],
    service: "17_oh_progesterone",
  },
  {
    id: "4",
    mainGroup: "Biochemistry",
    testBookingName: "Liver Function Package",
    specimenRequired: "Blood",
    collectionTime: "10:30",
    testNames: ["ALT"],
    service: "24hr_urinary_amylase",
  },
  {
    id: "5",
    mainGroup: "Biochemistry",
    testBookingName: "Renal Function Test",
    specimenRequired: "Blood",
    collectionTime: "07:45",
    testNames: ["Creatinine"],
    service: "renal_function_test",
  },
  {
    id: "6",
    mainGroup: "Biochemistry",
    testBookingName: "Liver & Renal Combined",
    specimenRequired: "Blood",
    collectionTime: "11:00",
    testNames: ["ALT", "Creatinine"],
    service: "24hr_urinary_creatinine",
  },
  {
    id: "7",
    mainGroup: "Microbiology",
    testBookingName: "Culture Package",
    specimenRequired: "Blood",
    collectionTime: "17:00",
    testNames: ["Blood Culture"],
    service: "17_oh_progesterone",
  },
  {
    id: "8",
    mainGroup: "Microbiology",
    testBookingName: "Hepatitis B Screen",
    specimenRequired: "Serum",
    collectionTime: "08:30",
    testNames: ["HBsAg"],
    service: "crp_quantitative",
  },
  {
    id: "9",
    mainGroup: "Microbiology",
    testBookingName: "Infection Workup",
    specimenRequired: "Blood",
    collectionTime: "09:15",
    testNames: ["Blood Culture", "HBsAg"],
    service: "d_dimer_plasma",
  },
];

let testBookingRows = INITIAL_TEST_BOOKING_ROWS.map((row) => ({
  ...row,
  testNames: [...row.testNames],
}));

let nextId = Math.max(...INITIAL_TEST_BOOKING_ROWS.map((row) => Number(row.id))) + 1;

export function getTestBookingRows() {
  return testBookingRows;
}

export function createTestBookingRow(payload) {
  const row = {
    id: String(nextId++),
    ...payload,
    testNames: payload.testNames ?? [],
  };

  testBookingRows = [row, ...testBookingRows];
  return row;
}

export function updateTestBookingRow(id, payload) {
  testBookingRows = testBookingRows.map((row) =>
    row.id === id
      ? {
          ...row,
          ...payload,
          testNames: payload.testNames ?? row.testNames ?? [],
        }
      : row
  );

  return testBookingRows.find((row) => row.id === id) ?? null;
}

export function deleteTestBookingRow(id) {
  testBookingRows = testBookingRows.filter((row) => row.id !== id);
}

export function createEmptyTestBookingForm() {
  return {
    mainGroup: "",
    testBookingName: "",
    testNames: [],
    service: "",
    specimenRequired: "",
    collectionTime: "",
  };
}

export function rowToTestBookingForm(row) {
  return {
    mainGroup: row.mainGroup ?? "",
    testBookingName: row.testBookingName ?? "",
    testNames: row.testNames ?? [],
    service: row.service ?? "",
    specimenRequired: row.specimenRequired ?? "",
    collectionTime: row.collectionTime ?? "",
  };
}