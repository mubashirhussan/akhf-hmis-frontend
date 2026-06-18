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
    testBookingName: "CBC Booking",
    specimenRequired: "Blood",
    collectionTime: "Morning",
    gender: "Female",
  },
  {
    id: "2",
    testBookingName: "Urine Routine Booking",
    specimenRequired: "Urine",
    collectionTime: "Morning",
    gender: "Male",
  },
  {
    id: "3",
    testBookingName: "LFT Booking",
    specimenRequired: "Blood",
    collectionTime: "Fasting Required",
    gender: "Female",
  },
  {
    id: "4",
    testBookingName: "KFT Booking",
    specimenRequired: "Blood",
    collectionTime: "Any Time",
    gender: "Male",
  },
  {
    id: "5",
    testBookingName: "Hormone Test Booking",
    specimenRequired: "Blood",
    collectionTime: "Morning",
    gender: "Female",
  },
  {
    id: "6",
    testBookingName: "Thyroid Panel Booking",
    specimenRequired: "Blood",
    collectionTime: "Morning",
    gender: "Male",
  },
  {
    id: "7",
    testBookingName: "Diabetes Test Booking",
    specimenRequired: "Blood",
    collectionTime: "Fasting Required",
    gender: "Female",
  },
  {
    id: "8",
    testBookingName: "Pregnancy Test Booking",
    specimenRequired: "Urine",
    collectionTime: "Any Time",
    gender: "Female",
  },
  {
    id: "9",
    testBookingName: "Lipid Profile Booking",
    specimenRequired: "Blood",
    collectionTime: "Fasting Required",
    gender: "Male",
  },
  {
    id: "10",
    testBookingName: "Electrolyte Panel Booking",
    specimenRequired: "Blood",
    collectionTime: "Any Time",
    gender: "Male",
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
    testBookingName: "",
    specimenRequired: "",
    collectionTime: "",
    gender: "",
  };
}

export function rowToTestBookingForm(row) {
  return {
    mainGroup: row.mainGroup ?? "",
    testBookingName: row.testBookingName ?? "",
    service: row.service ?? "",
    specimenRequired: row.specimenRequired ?? "",
    collectionTime: row.collectionTime ?? "",
    gender: row.gender ?? "",
  };
}