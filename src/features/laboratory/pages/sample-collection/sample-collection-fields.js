import {
  createCollectionFilters,
  SAMPLE_COLLECTION_GROUP_OPTIONS,
  SAMPLE_COLLECTION_LOCATION_OPTIONS,
  SAMPLE_COLLECTION_PRINTER_OPTIONS,
  SAMPLE_COLLECTION_SITE_OPTIONS,
} from '@/features/laboratory/api/mock-sample-collection';

export const SAMPLE_COLLECTION_INITIAL_VALUES = createCollectionFilters();

export function getSampleCollectionFields({ showLocation = false } = {}) {
  const fields = [
    {
      type: 'select',
      name: 'testGroup',
      label: 'Test Group',
      col: 6,
      floating: true,
      options: SAMPLE_COLLECTION_GROUP_OPTIONS,
    },
    {
      type: 'select',
      name: 'collectedAt',
      label: 'Collected at',
      col: 6,
      floating: true,
      options: SAMPLE_COLLECTION_SITE_OPTIONS,
    },
    {
      type: 'text',
      name: 'barCode',
      label: 'Bar Code',
      col: 6,
      floating: true,
      props: { autoComplete: 'off' },
    },
    {
      type: 'select',
      name: 'printerLocation',
      label: 'Select Printer Location',
      col: 6,
      floating: true,
      options: SAMPLE_COLLECTION_PRINTER_OPTIONS,
    },
    {
      type: 'textarea',
      name: 'clinicalDiagnosis',
      label: 'Clinical Diagnosis',
      col: 6,
      floating: true,
      props: { rows: 4 },
    },
  ];

  if (showLocation) {
    fields.push({
      type: 'select',
      name: 'location',
      label: 'Location',
      col: 6,
      floating: true,
      options: SAMPLE_COLLECTION_LOCATION_OPTIONS,
    });
  }

  return fields;
}
