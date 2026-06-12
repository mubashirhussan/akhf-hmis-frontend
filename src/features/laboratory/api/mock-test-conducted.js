import { MOCK_LABORATORY_WORKLIST_ROWS } from '@/features/laboratory/api/mock-laboratory-worklist';
import {
  createResultEntryFieldValues,
  createResultEntryTestsForRecord,
  getFilledResultEntryFieldKeys,
  getResultEntryFieldSchema,
  getResultEntryReportTemplates,
  filterResultEntryTestsByGroup,
  resolveResultEntryTest,
  RESULT_ENTRY_ALL_TEST_GROUP,
  RESULT_ENTRY_TEST_GROUP_FILTER_OPTIONS,
} from '@/features/laboratory/api/mock-result-entry';

export const TEST_CONDUCTED_ALL_TEST_GROUP = RESULT_ENTRY_ALL_TEST_GROUP;
export const TEST_CONDUCTED_TEST_GROUP_FILTER_OPTIONS = RESULT_ENTRY_TEST_GROUP_FILTER_OPTIONS;
export const filterTestConductedTestsByGroup = filterResultEntryTestsByGroup;
export const createTestConductedTestsForRecord = createResultEntryTestsForRecord;
export const getTestConductedFieldSchema = getResultEntryFieldSchema;
export const getTestConductedReportTemplates = getResultEntryReportTemplates;
export const createTestConductedFieldValues = createResultEntryFieldValues;
export const getFilledTestConductedFieldKeys = getFilledResultEntryFieldKeys;
export const resolveTestConductedTest = resolveResultEntryTest;

const TEST_CONDUCTED_DEMO_VALUES = {
  esr: {
    esrValue: '12',
    method: 'westergren',
    readingTime: '60',
    temperature: '22',
    specimenType: 'edta',
  },
};

export function resolveTestConductedRecord(record) {
  if (!record) return null;

  const parent = record.sourceRecordId
    ? MOCK_LABORATORY_WORKLIST_ROWS.find((row) => row.id === record.sourceRecordId)
    : null;

  return {
    ...(parent ?? record),
    labNo: record.labNo,
    conductedTestKey: record.testName,
    conductedAt: record.conductedAt,
    sourceRecordId: record.sourceRecordId ?? record.id,
  };
}

export function createTestConductedDrafts(record) {
  const drafts = {};
  const lookupRecord = record?.sourceRecordId
    ? { ...record, id: record.sourceRecordId }
    : record;

  for (const test of createTestConductedTestsForRecord(lookupRecord)) {
    const schema = getTestConductedFieldSchema(test.testKey);
    const reportTemplates = getTestConductedReportTemplates(test.testKey);
    const defaultTemplate = reportTemplates[0] ?? null;
    const fieldValues = {
      ...createTestConductedFieldValues(schema),
      ...(TEST_CONDUCTED_DEMO_VALUES[test.testKey] ?? {}),
    };

    drafts[test.testKey] = {
      fieldValues,
      remarks: schema?.defaultRemarks ?? '',
      selectedTemplateId: defaultTemplate?.value ?? '',
      templateContent: defaultTemplate?.content ?? '',
      savedFieldKeys: [],
      savedFieldTimes: {},
      finalized: false,
    };
  }

  return drafts;
}
