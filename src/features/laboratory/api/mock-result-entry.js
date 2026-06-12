export const RESULT_ENTRY_ALL_TEST_GROUP = 'all';

export const RESULT_ENTRY_TEST_GROUP_OPTIONS = [
  { value: 'blood-bank', label: 'Blood Bank' },
  { value: 'hematology', label: 'Hematology' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'serology', label: 'Serology' },
];

export const RESULT_ENTRY_TEST_GROUP_FILTER_OPTIONS = [
  { value: RESULT_ENTRY_ALL_TEST_GROUP, label: 'ALL' },
  ...RESULT_ENTRY_TEST_GROUP_OPTIONS,
];

export function filterResultEntryTestsByGroup(tests, testGroup = RESULT_ENTRY_ALL_TEST_GROUP) {
  if (!testGroup || testGroup === RESULT_ENTRY_ALL_TEST_GROUP) {
    return tests;
  }

  return tests.filter((test) => test.testGroup === testGroup);
}

export const RESULT_ENTRY_TESTS_BY_GROUP = {
  'blood-bank': [
    { value: 'blood-cross-match', label: 'Blood Cross Match and Screening' },
  ],
  hematology: [
    { value: 'cbc', label: 'CBC' },
    { value: 'esr', label: 'ESR' },
  ],
  biochemistry: [
    { value: 'lft', label: 'LFT' },
    { value: 'blood-glucose', label: 'Blood Glucose' },
  ],
  serology: [
    { value: 'urine', label: 'Urine Routine' },
  ],
};

const BLOOD_CROSS_MATCH_REMARKS = `1. Check the patient's name, blood group and Rh factor on the report and blood bag label before transfusion.
2. Do not use blood if there is any discrepancy.
3. Transfuse within 30 minutes of removing from the refrigerator.
4. Observe the patient during and after transfusion for any adverse reaction.`;

export const RESULT_ENTRY_FIELD_SCHEMAS = {
  'blood-cross-match': {
    title: 'Blood Cross Match and Screening',
    sections: [
      {
        title: 'Recipient Information',
        fields: [
          { key: 'patientName', label: "Patient's Name", type: 'textarea', refRange: 'Range Not Defined', column: 1 },
          { key: 'patientBloodGroup', label: 'Patient Blood Group', type: 'textarea', refRange: 'Range Not Defined', column: 2 },
          { key: 'rhFactorP', label: 'Rh. Factor (P)', type: 'textarea', refRange: 'Range Not Defined', column: 1 },
          { key: 'donorHaemoglobin', label: 'Donor Haemoglobin', type: 'textarea', refRange: '12.5 - 17.5 g/dL', column: 2 },
          { key: 'donorName', label: 'Donor Name', type: 'textarea', refRange: 'Range Not Defined', column: 1 },
          { key: 'bloodProduct', label: 'Blood Product', type: 'textarea', refRange: 'Range Not Defined', column: 2 },
          { key: 'donorBloodGroup', label: 'Donor Blood Group', type: 'textarea', refRange: 'Range Not Defined', column: 1 },
          { key: 'rhFactorD', label: 'Rh. Factor (D)', type: 'textarea', refRange: 'Range Not Defined', column: 2 },
          { key: 'crossmatchIndirectCoombs', label: "Crossmatch Indirect Coomb's", type: 'textarea', refRange: 'Range Not Defined', column: 1 },
          { key: 'donorNo', label: 'Donor NO', type: 'textarea', refRange: 'Range Not Defined', column: 2 },
          {
            key: 'malarialParasiteDonor',
            label: 'Malarial Parasite (Donor)',
            type: 'select',
            options: [
              { value: 'negative', label: 'Negative' },
              { value: 'positive', label: 'Positive' },
            ],
            refRange: 'Negative',
            column: 1,
          },
          { key: 'hbsagDonor', label: 'HBsAg (Donor)', type: 'textarea', refRange: 'Non Reactive: <1.0', column: 2 },
          { key: 'antiHcvDonor', label: 'Anti HCV (Donor)', type: 'textarea', refRange: 'Non Reactive: <1.0', column: 1 },
          { key: 'hivDonor', label: 'HIV I (Donor)', type: 'textarea', refRange: 'Non Reactive: <1.0', column: 2 },
          { key: 'vdrlDonor', label: 'VDRL/Syphilis (Donor)', type: 'textarea', refRange: 'Non Reactive', column: 1 },
          { key: 'dateOfCrossmatch', label: 'Date of Crossmatch', type: 'text', refRange: 'Range Not Defined', column: 2 },
          { key: 'dateOfBloodCollection', label: 'Date of Blood Collection', type: 'text', refRange: 'Range Not Defined', column: 1 },
          { key: 'dateOfBloodExpiry', label: 'Date of Blood Expiry', type: 'text', refRange: 'Range Not Defined', column: 2 },
          { key: 'compatibility', label: 'Compatibility', type: 'textarea', refRange: 'Range Not Defined', column: 1 },
        ],
      },
    ],
    defaultRemarks: BLOOD_CROSS_MATCH_REMARKS,
  },
  cbc: {
    title: 'Complete Blood Count (CBC)',
    sections: [
      {
        title: 'Hematology Parameters',
        fields: [
          { key: 'wbc', label: 'WBC', type: 'text', refRange: '4.0 - 11.0 x10³/µL', column: 1 },
          { key: 'rbc', label: 'RBC', type: 'text', refRange: '4.5 - 5.5 x10⁶/µL', column: 2 },
          { key: 'hemoglobin', label: 'Hemoglobin', type: 'text', refRange: '13.5 - 17.5 g/dL', column: 1 },
          { key: 'hematocrit', label: 'Hematocrit', type: 'text', refRange: '41 - 50 %', column: 2 },
          { key: 'platelets', label: 'Platelets', type: 'text', refRange: '150 - 400 x10³/µL', column: 1 },
          { key: 'mcv', label: 'MCV', type: 'text', refRange: '80 - 100 fL', column: 2 },
          { key: 'mch', label: 'MCH', type: 'text', refRange: '27 - 33 pg', column: 1 },
          { key: 'mchc', label: 'MCHC', type: 'text', refRange: '32 - 36 g/dL', column: 2 },
          { key: 'rdw', label: 'RDW', type: 'text', refRange: '11.5 - 14.5 %', column: 1 },
          { key: 'mpv', label: 'MPV', type: 'text', refRange: '7.5 - 11.5 fL', column: 2 },
          { key: 'neutrophils', label: 'Neutrophils', type: 'text', refRange: '40 - 70 %', column: 1 },
          { key: 'lymphocytes', label: 'Lymphocytes', type: 'text', refRange: '20 - 40 %', column: 2 },
          { key: 'monocytes', label: 'Monocytes', type: 'text', refRange: '2 - 8 %', column: 1 },
          { key: 'eosinophils', label: 'Eosinophils', type: 'text', refRange: '1 - 4 %', column: 2 },
          { key: 'basophils', label: 'Basophils', type: 'text', refRange: '0 - 1 %', column: 1 },
          { key: 'esr', label: 'ESR', type: 'text', refRange: '0 - 15 mm/hr', column: 2 },
        ],
      },
    ],
    defaultRemarks: '',
  },
  esr: {
    title: 'Erythrocyte Sedimentation Rate (ESR)',
    sections: [
      {
        title: 'Test Results',
        fields: [
          { key: 'esrValue', label: 'ESR', type: 'text', refRange: '0 - 15 mm/hr', column: 1 },
          {
            key: 'method',
            label: 'Method',
            type: 'select',
            options: [
              { value: 'westergren', label: 'Westergren' },
              { value: 'wintrobe', label: 'Wintrobe' },
            ],
            refRange: '—',
            column: 2,
          },
          { key: 'readingTime', label: 'Reading Time', type: 'text', refRange: '60 min', column: 1 },
          { key: 'temperature', label: 'Room Temperature', type: 'text', refRange: '18 - 25 °C', column: 2 },
          {
            key: 'specimenType',
            label: 'Specimen Type',
            type: 'select',
            options: [
              { value: 'edta', label: 'EDTA Blood' },
              { value: 'citrate', label: 'Citrate Blood' },
            ],
            refRange: 'EDTA Blood',
            column: 1,
          },
          { key: 'observation', label: 'Observation', type: 'textarea', rows: 1, refRange: 'Range Not Defined', column: 2 },
        ],
      },
    ],
    defaultRemarks: '',
  },
  lft: {
    title: 'Liver Function Test (LFT)',
    sections: [
      {
        title: 'Biochemistry Parameters',
        fields: [
          { key: 'alt', label: 'ALT (SGPT)', type: 'text', refRange: '7 - 56 U/L', column: 1 },
          { key: 'ast', label: 'AST (SGOT)', type: 'text', refRange: '10 - 40 U/L', column: 2 },
          { key: 'alp', label: 'ALP', type: 'text', refRange: '44 - 147 U/L', column: 1 },
          { key: 'ggt', label: 'GGT', type: 'text', refRange: '9 - 48 U/L', column: 2 },
          { key: 'bilirubinTotal', label: 'Bilirubin Total', type: 'text', refRange: '0.1 - 1.2 mg/dL', column: 1 },
          { key: 'bilirubinDirect', label: 'Bilirubin Direct', type: 'text', refRange: '0.0 - 0.3 mg/dL', column: 2 },
          { key: 'bilirubinIndirect', label: 'Bilirubin Indirect', type: 'text', refRange: '0.1 - 0.9 mg/dL', column: 1 },
          { key: 'albumin', label: 'Albumin', type: 'text', refRange: '3.5 - 5.0 g/dL', column: 2 },
          { key: 'totalProtein', label: 'Total Protein', type: 'text', refRange: '6.0 - 8.3 g/dL', column: 1 },
          { key: 'agRatio', label: 'A/G Ratio', type: 'text', refRange: '1.0 - 2.0', column: 2 },
        ],
      },
    ],
    defaultRemarks: '',
  },
  'blood-glucose': {
    title: 'Blood Glucose',
    sections: [
      {
        title: 'Biochemistry Parameters',
        fields: [
          { key: 'glucoseFasting', label: 'Fasting Glucose', type: 'text', refRange: '70 - 100 mg/dL', column: 1 },
          { key: 'glucoseRandom', label: 'Random Glucose', type: 'text', refRange: '< 140 mg/dL', column: 2 },
          { key: 'glucose2hrPP', label: '2 Hour Post Prandial', type: 'text', refRange: '< 140 mg/dL', column: 1 },
          { key: 'hba1c', label: 'HbA1c', type: 'text', refRange: '4.0 - 5.6 %', column: 2 },
          {
            key: 'specimenType',
            label: 'Specimen Type',
            type: 'select',
            options: [
              { value: 'serum', label: 'Serum' },
              { value: 'plasma', label: 'Plasma' },
              { value: 'fluoride', label: 'Fluoride Plasma' },
            ],
            refRange: 'Serum',
            column: 1,
          },
          {
            key: 'collectionCondition',
            label: 'Collection Condition',
            type: 'select',
            options: [
              { value: 'fasting', label: 'Fasting' },
              { value: 'random', label: 'Random' },
              { value: 'post-prandial', label: 'Post Prandial' },
            ],
            refRange: 'Fasting',
            column: 2,
          },
        ],
      },
    ],
    defaultRemarks: '',
  },
  urine: {
    title: 'Urine Routine Examination',
    sections: [
      {
        title: 'Physical Examination',
        fields: [
          { key: 'color', label: 'Color', type: 'text', refRange: 'Pale Yellow', column: 1 },
          { key: 'appearance', label: 'Appearance', type: 'text', refRange: 'Clear', column: 2 },
          { key: 'ph', label: 'pH', type: 'text', refRange: '4.5 - 8.0', column: 1 },
          { key: 'specificGravity', label: 'Specific Gravity', type: 'text', refRange: '1.005 - 1.030', column: 2 },
          { key: 'volume', label: 'Volume', type: 'text', refRange: 'Range Not Defined', column: 1 },
          { key: 'odor', label: 'Odor', type: 'text', refRange: 'Aromatic', column: 2 },
        ],
      },
      {
        title: 'Chemical Examination',
        fields: [
          { key: 'protein', label: 'Protein', type: 'text', refRange: 'Negative', column: 1 },
          { key: 'glucose', label: 'Glucose', type: 'text', refRange: 'Negative', column: 2 },
          { key: 'ketones', label: 'Ketones', type: 'text', refRange: 'Negative', column: 1 },
          { key: 'blood', label: 'Blood', type: 'text', refRange: 'Negative', column: 2 },
          { key: 'bilirubin', label: 'Bilirubin', type: 'text', refRange: 'Negative', column: 1 },
          { key: 'urobilinogen', label: 'Urobilinogen', type: 'text', refRange: 'Normal', column: 2 },
          { key: 'nitrite', label: 'Nitrite', type: 'text', refRange: 'Negative', column: 1 },
          { key: 'leukocyteEsterase', label: 'Leukocyte Esterase', type: 'text', refRange: 'Negative', column: 2 },
        ],
      },
      {
        title: 'Microscopic Examination',
        fields: [
          { key: 'pusCells', label: 'Pus Cells', type: 'text', refRange: '0 - 5 /HPF', column: 1 },
          { key: 'rbc', label: 'RBC', type: 'text', refRange: '0 - 2 /HPF', column: 2 },
          { key: 'epithelialCells', label: 'Epithelial Cells', type: 'text', refRange: 'Few', column: 1 },
          { key: 'casts', label: 'Casts', type: 'text', refRange: 'Nil', column: 2 },
          { key: 'crystals', label: 'Crystals', type: 'text', refRange: 'Nil', column: 1 },
          { key: 'bacteria', label: 'Bacteria', type: 'text', refRange: 'Nil', column: 2 },
          { key: 'yeast', label: 'Yeast', type: 'text', refRange: 'Nil', column: 1 },
          { key: 'amorphous', label: 'Amorphous Material', type: 'text', refRange: 'Nil', column: 2 },
        ],
      },
    ],
    defaultRemarks: '',
  },
};

export const RESULT_ENTRY_REPORT_TEMPLATES = {
  'blood-cross-match': [
    {
      value: 'default',
      label: 'test',
      content:
        'Cross match performed. Blood unit found compatible for transfusion. All screening tests are non-reactive.',
    },
    {
      value: 'standard',
      label: 'Standard Cross Match Report',
      content:
        'Blood cross match and screening completed as per standard protocol. Unit is compatible.',
    },
  ],
  cbc: [
    {
      value: 'default',
      label: 'CBC Standard',
      content: 'Complete blood count performed. Values are within reference ranges unless otherwise noted.',
    },
  ],
  esr: [
    {
      value: 'default',
      label: 'ESR Standard',
      content: 'ESR performed by Westergren method.',
    },
  ],
  lft: [
    {
      value: 'default',
      label: 'LFT Standard',
      content: 'Liver function test performed. Clinical correlation advised.',
    },
  ],
  'blood-glucose': [
    {
      value: 'default',
      label: 'Glucose Standard',
      content: 'Blood glucose level reported. Fasting status noted where applicable.',
    },
  ],
  urine: [
    {
      value: 'default',
      label: 'Urine Routine Standard',
      content: 'Urine routine examination performed.',
    },
  ],
};

export function getResultEntryTestsForGroup(testGroup) {
  return RESULT_ENTRY_TESTS_BY_GROUP[testGroup] ?? [];
}

export function getResultEntryFieldSchema(testKey) {
  return RESULT_ENTRY_FIELD_SCHEMAS[testKey] ?? null;
}

export function getResultEntryReportTemplates(testKey) {
  return RESULT_ENTRY_REPORT_TEMPLATES[testKey] ?? [];
}

export function createResultEntryFieldValues(schema) {
  const values = {};

  for (const section of schema?.sections ?? []) {
    for (const field of section.fields) {
      values[field.key] = field.defaultValue ?? '';
    }
  }

  return values;
}

export function resolveResultEntryTest(record) {
  const testGroup = record?.testGroup ?? 'hematology';
  const tests = getResultEntryTestsForGroup(testGroup);
  const testKey = tests.find((test) => test.value === record?.testName)?.value ?? tests[0]?.value ?? 'cbc';

  return { testGroup, testKey };
}

const DEFAULT_RECORD_TESTS = [
  { testKey: 'cbc', testGroup: 'hematology' },
  { testKey: 'esr', testGroup: 'hematology' },
  { testKey: 'lft', testGroup: 'biochemistry' },
  { testKey: 'blood-glucose', testGroup: 'biochemistry' },
];

const RESULT_ENTRY_RECORD_TESTS = {
  'lab-1': [
    { testKey: 'cbc', testGroup: 'hematology' },
    { testKey: 'esr', testGroup: 'hematology' },
    { testKey: 'lft', testGroup: 'biochemistry' },
    { testKey: 'urine', testGroup: 'serology' },
  ],
  'lab-3': [
    { testKey: 'esr', testGroup: 'hematology' },
    { testKey: 'cbc', testGroup: 'hematology' },
    { testKey: 'blood-glucose', testGroup: 'biochemistry' },
    { testKey: 'lft', testGroup: 'biochemistry' },
  ],
  'lab-6': [
    { testKey: 'cbc', testGroup: 'hematology' },
    { testKey: 'esr', testGroup: 'hematology' },
    { testKey: 'blood-glucose', testGroup: 'biochemistry' },
    { testKey: 'urine', testGroup: 'serology' },
  ],
};

export function createResultEntryTestsForRecord(record) {
  const baseRecord = record?.sourceRecordId
    ? { ...record, id: record.sourceRecordId }
    : record;
  const { testKey: primaryTestKey } = resolveResultEntryTest(baseRecord);
  const configuredTests = RESULT_ENTRY_RECORD_TESTS[baseRecord?.id] ?? DEFAULT_RECORD_TESTS;
  const uniqueTests = configuredTests.filter(
    (test, index, list) => list.findIndex((item) => item.testKey === test.testKey) === index,
  );

  const orderedTests = [
    ...uniqueTests.filter((test) => test.testKey === primaryTestKey),
    ...uniqueTests.filter((test) => test.testKey !== primaryTestKey),
  ];

  return orderedTests.map((test, index) => {
    const schema = getResultEntryFieldSchema(test.testKey);

    return {
      id: `${record.id}-${test.testKey}`,
      testKey: test.testKey,
      testGroup: test.testGroup,
      label: schema?.title ?? test.testKey,
      labNo: record?.labNo ?? baseRecord?.labNo,
      sequence: index + 1,
    };
  });
}

export function getFilledResultEntryFieldKeys(fieldValues = {}) {
  return Object.entries(fieldValues)
    .filter(([, value]) => String(value ?? '').trim() !== '')
    .map(([key]) => key);
}

function normalizeSavedFieldValue(value) {
  return String(value ?? '').trim();
}

export function buildSavedFieldSnapshotOnSave(
  fieldValues,
  filledFieldKeys,
  { savedFieldValues = {}, savedFieldTimes = {} } = {},
) {
  const savedAt = new Date().toISOString();
  const nextSavedFieldTimes = {};
  const nextSavedFieldValues = {};

  for (const key of filledFieldKeys) {
    const currentValue = fieldValues[key];
    nextSavedFieldValues[key] = currentValue;

    const valueChanged =
      normalizeSavedFieldValue(currentValue) !== normalizeSavedFieldValue(savedFieldValues[key]);

    nextSavedFieldTimes[key] = valueChanged ? savedAt : (savedFieldTimes[key] ?? savedAt);
  }

  return {
    savedFieldKeys: filledFieldKeys,
    savedFieldTimes: nextSavedFieldTimes,
    savedFieldValues: nextSavedFieldValues,
  };
}

export function createResultEntryTestDraft(testKey) {
  const schema = getResultEntryFieldSchema(testKey);
  const reportTemplates = getResultEntryReportTemplates(testKey);
  const defaultTemplate = reportTemplates[0] ?? null;

  return {
    fieldValues: createResultEntryFieldValues(schema),
    remarks: schema?.defaultRemarks ?? '',
    selectedTemplateId: defaultTemplate?.value ?? '',
    templateContent: defaultTemplate?.content ?? '',
    savedFieldKeys: [],
    savedFieldTimes: {},
    savedFieldValues: {},
    finalized: false,
  };
}

export function createResultEntryTestDrafts(record) {
  const drafts = {};

  for (const test of createResultEntryTestsForRecord(record)) {
    drafts[test.testKey] = createResultEntryTestDraft(test.testKey);
  }

  return drafts;
}

