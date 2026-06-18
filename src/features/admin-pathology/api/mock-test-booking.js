export const SERVICE_OPTIONS = [
  { value: "bsr_blood_sugar_random", label: "BSR (Blood Sugar Random)" },
  { value: "ot_anesthesia_machine", label: "OT ANESTHESIA MACHINE" },
  { value: "17_oh_progesterone", label: "17-OH Hydroxy Progesterone" },
  { value: "24hr_urinary_amylase", label: "24 Hours Urinary Amylase" },
  { value: "24hr_urinary_chloride", label: "24 Hours Urinary Chloride" },
  { value: "24hr_urinary_copper", label: "24 Hours Urinary Copper" },
  { value: "24hr_urinary_cortisol", label: "24 Hours Urinary Cortisol" },
  { value: "24hr_urinary_creatinine", label: "24 HOURS URINARY CREATININE" },

];

const INITIAL_TEST_BOOKING_ROWS = [
  {
    id: "1",
    mainGroup: "Hematology",
    testBookingName: "CBC",
    specimenRequired: "Blood",
    collectionTime: "Morning",
    gender: "Female",
    service: "bsr_blood_sugar_random"
  },
  {
    id: "2",
    mainGroup: "Microbiology",
    testBookingName: "Urine Routine",
    specimenRequired: "Urine",
    collectionTime: "Morning",
    gender: "Male",
    service: "24hr_urinary_amylase"
  },
  {
    id: "3",
    mainGroup: "Serology",
    testBookingName: "LFT",
    specimenRequired: "Blood",
    collectionTime: "Fasting Required",
    gender: "Female",
    service: "17_oh_progesterone"
  },
  {
    id: "4",
    mainGroup: "Chemistry",
    testBookingName: "KFT",
    specimenRequired: "Blood",
    collectionTime: "Any Time",
    gender: "Male",
    service: "24hr_urinary_copper"
  },
  {
    id: "5",
    mainGroup: "Serology",
    testBookingName: "Hormone Test",
    specimenRequired: "Blood",
    collectionTime: "Morning",
    gender: "Female",
    service: "24hr_urinary_cortisol"
  },
  {
    id: "6",
    mainGroup: "Chemistry",
    testBookingName: "Thyroid Panel",
    specimenRequired: "Blood",
    collectionTime: "Morning",
    gender: "Male",
    service: "24hr_urinary_creatinine"
  },
  {
    id: "7",
    mainGroup: "Chemistry",
    testBookingName: "Diabetes Test",
    specimenRequired: "Blood",
    collectionTime: "Fasting Required",
    gender: "Female",
    service: "bsr_blood_sugar_random"
  },
  {
    id: "8",
    mainGroup: "Microbiology",
    testBookingName: "Pregnancy Test",
    specimenRequired: "Urine",
    collectionTime: "Any Time",
    gender: "Female",
    service: "24hr_urinary_chloride"
  },
  {
    id: "9",
    mainGroup: "Serology",
    testBookingName: "Lipid Profile",
    specimenRequired: "Blood",
    collectionTime: "Fasting Required",
    gender: "Male",
    service: "ot_anesthesia_machine"
  },
  {
    id: "10",
    mainGroup: "Microbiology",
    testBookingName: "Electrolyte Panel",
    specimenRequired: "Blood",
    collectionTime: "Any Time",
    gender: "Male",
    service: "24hr_urinary_copper"
  },
];

let testBookingRows = INITIAL_TEST_BOOKING_ROWS.map((r) => ({ ...r }));

let nextId =
  Math.max(...INITIAL_TEST_BOOKING_ROWS.map((r) => Number(r.id))) + 1;

export function getTestBookingRows() {
  return testBookingRows;
}

export function createTestBookingRow(payload) {
  const row = {
    id: String(nextId++),
    ...payload,
  };

  testBookingRows = [row, ...testBookingRows];
  return row;
}

export function updateTestBookingRow(id, payload) {
  testBookingRows = testBookingRows.map((r) =>
    r.id === id ? { ...r, ...payload } : r
  );

  return testBookingRows.find((r) => r.id === id) ?? null;
}

export function deleteTestBookingRow(id) {
  testBookingRows = testBookingRows.filter((r) => r.id !== id);
}

export function createEmptyTestBookingForm() {
return {
  mainGroup: "",
  component: "",
  testBookingName: "",
  service: "",
  specimenRequired: "",
  collectionTime: "",
  gender: "",
};
}

export function rowToTestBookingForm(row) {
  return {
    mainGroup: row.mainGroup ?? "",
    component: row.component ?? "",
    testBookingName: row.testBookingName ?? "",
    service: row.service ?? "",
    specimenRequired: row.specimenRequired ?? "",
    collectionTime: row.collectionTime ?? "",
    gender: row.gender ?? "",
  };
}