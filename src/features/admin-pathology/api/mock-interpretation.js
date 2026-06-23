import { SERVICE_OPTIONS } from '@/features/admin-pathology/api/mock-test-booking';

export { SERVICE_OPTIONS };

export function getServiceLabel(serviceName) {
  return SERVICE_OPTIONS.find((option) => option.value === serviceName)?.label ?? serviceName;
}

export const INITIAL_INTERPRETATION_ROWS = [
  {
    id: '1',
    interpretationId: 1,
    serviceName: 'shbg',
    templateName: 'SHBG Normal Range',
    templateDescription:
      'Sex Hormone Binding Globulin levels within reference range. No further action required.',
  },
  {
    id: '2',
    interpretationId: 2,
    serviceName: 'bsr_blood_sugar_random',
    templateName: 'Elevated BSR',
    templateDescription:
      'Random blood sugar is above the normal reference range. Clinical correlation advised.',
  },
];

let interpretationRows = INITIAL_INTERPRETATION_ROWS.map((row) => ({ ...row }));

let nextInterpretationId =
  Math.max(...INITIAL_INTERPRETATION_ROWS.map((row) => row.interpretationId), 0) + 1;

export function getInterpretationRows() {
  return interpretationRows;
}

export function createInterpretationRow(rowPayload) {
  const interpretationId = nextInterpretationId++;

  const row = {
    id: String(interpretationId),
    interpretationId,
    ...rowPayload,
  };

  interpretationRows = [row, ...interpretationRows];

  return row;
}

export function updateInterpretationRow(id, rowPayload) {
  interpretationRows = interpretationRows.map((row) =>
    row.id === id ? { ...row, ...rowPayload } : row,
  );

  return interpretationRows.find((row) => row.id === id) ?? null;
}

export function deleteInterpretationRow(id) {
  interpretationRows = interpretationRows.filter((row) => row.id !== id);
}

export function createEmptyInterpretationForm() {
  return {
    serviceName: '',
    templateName: '',
    templateDescription: '',
  };
}

export function rowToInterpretationForm(row) {
  return {
    serviceName: row.serviceName ?? '',
    templateName: row.templateName ?? '',
    templateDescription: row.templateDescription ?? '',
  };
}

export function getInterpretationTemplateOptions() {
  return interpretationRows.map((row) => ({
    value: row.id,
    label: row.templateName,
    content: row.templateDescription,
  }));
}