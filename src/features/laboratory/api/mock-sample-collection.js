export const SAMPLE_COLLECTION_GROUP_OPTIONS = [
  { value: 'all', label: 'ALL' },
  { value: 'hematology', label: 'Hematology' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'microbiology', label: 'Microbiology' },
];

export const SAMPLE_COLLECTION_LOCATION_OPTIONS = [
  { value: 'faisal-town', label: 'Faisal Town' },
  { value: 'main-lab', label: 'Main Lab' },
  { value: 'city-lab', label: 'City Lab' },
];

export const SAMPLE_COLLECTION_PRINTER_OPTIONS = [
  { value: 'p-01', label: 'P-01' },
  { value: 'p-02', label: 'P-02' },
  { value: 'p-03', label: 'P-03' },
];

export const SAMPLE_COLLECTION_SITE_OPTIONS = [
  { value: 'main-lab', label: 'Main Lab' },
  { value: 'satellite-center', label: 'Satellite Center' },
];

export function createCollectionFilters() {
  return {
    testGroup: 'all',
    collectedAt: 'main-lab',
    barCode: '',
    location: 'faisal-town',
    clinicalDiagnosis: '',
    printerLocation: 'p-01',
  };
}

export function createSampleCollectionTests(recordId) {
  const baseTests = [
    {
      id: `${recordId}-test-1`,
      name: 'Blood Glucose Random',
      specimen: 'Blood in Lab',
      checked: true,
      sendOut: true,
    },
    {
      id: `${recordId}-test-2`,
      name: 'CBC',
      specimen: 'Blood in EDTA',
      checked: true,
      sendOut: false,
    },
  ];

  return baseTests;
}
