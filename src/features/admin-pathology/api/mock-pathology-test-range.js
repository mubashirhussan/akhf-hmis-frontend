import { DOB_AGE_UNITS } from '@/lib/dob-from-age';
import {
  GROUP_OPTIONS,
  getPathologyComponentRows,
  SUB_GROUP_OPTIONS,
  TEST_OPTIONS,
  UNIT_OPTIONS,
  getOptionLabel,
  getSubGroupOptions,
  getTestMeta,
  getTestOptions,
} from '@/features/admin-pathology/api/mock-pathology-component';

export {
  GROUP_OPTIONS,
  UNIT_OPTIONS,
  getSubGroupOptions,
  getTestOptions,
  getOptionLabel,
  getTestMeta,
};

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'both', label: 'Both' },
];

export const CONDITION_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'pregnant', label: 'Pregnant' },
  { value: 'fasting', label: 'Fasting' },
  { value: 'post-meal', label: 'Post Meal' },
];

export const INITIAL_PATHOLOGY_TEST_RANGE_ROWS = [
  {
    id: '1',
    testName: '17-OH (Hydroxyprogesterone)',
    componentName: '17-OH (Hydroxyprogesterone)',
    startValue: '',
    endValue: '',
    reportValues: '',
    gender: 'Both',
    minAge: '0 (0 Y - 0 M - 0 D)',
    maxAge: '0 (0 Y - 0 M - 0 D)',
  },
  {
    id: '2',
    testName: 'Absolute Basophil Count',
    componentName: 'Absolute Basophil Count',
    startValue: '0.02',
    endValue: '0.50',
    reportValues: '',
    gender: 'Both',
    minAge: '0 (0 Y - 0 M - 0 D)',
    maxAge: '120 (120 Y - 0 M - 0 D)',
  },
  {
    id: '3',
    testName: 'ESR',
    componentName: 'ESR Value',
    startValue: '0',
    endValue: '20',
    reportValues: '',
    gender: 'Male',
    minAge: '18 (18 Y - 0 M - 0 D)',
    maxAge: '65 (65 Y - 0 M - 0 D)',
  },
  {
    id: '4',
    testName: 'Hb',
    componentName: 'Haemoglobin',
    startValue: '12.0',
    endValue: '15.0',
    reportValues: '',
    gender: 'Female',
    minAge: '12 (12 Y - 0 M - 0 D)',
    maxAge: '50 (50 Y - 0 M - 0 D)',
  },
  {
    id: '5',
    testName: 'ALT',
    componentName: 'ALT Level',
    startValue: '7',
    endValue: '56',
    reportValues: 'Normal',
    gender: 'Both',
    minAge: '0 (0 Y - 0 M - 0 D)',
    maxAge: '0 (0 Y - 0 M - 0 D)',
  },
];

let testRangeRows = INITIAL_PATHOLOGY_TEST_RANGE_ROWS.map((row) => ({ ...row }));
let conditionOptionsState = CONDITION_OPTIONS.map((option) => ({ ...option }));
let nextTestRangeId =
  Math.max(...INITIAL_PATHOLOGY_TEST_RANGE_ROWS.map((row) => Number(row.id)), 0) + 1;

export function getPathologyTestRangeRows() {
  return testRangeRows;
}

export function getPathologyConditionOptions() {
  return conditionOptionsState;
}

export function createPathologyTestRangeRow(rowPayload) {
  const id = String(nextTestRangeId);
  nextTestRangeId += 1;
  const row = { id, ...rowPayload };
  testRangeRows = [row, ...testRangeRows];
  return row;
}

export function updatePathologyTestRangeRow(id, rowPayload) {
  testRangeRows = testRangeRows.map((row) =>
    row.id === id ? { ...row, ...rowPayload } : row,
  );
  return testRangeRows.find((row) => row.id === id) ?? null;
}

export function deletePathologyTestRangeRow(id) {
  testRangeRows = testRangeRows.filter((row) => row.id !== id);
}

export function addPathologyConditionOption(option) {
  conditionOptionsState = [...conditionOptionsState, option];
  return option;
}

export function createEmptyPathologyTestRangeForm() {
  return {
    groupName: 'haematology',
    subGroupName: 'cbc',
    testName: 'esr',
    testComponent: '',
    startValue: '',
    endValue: '',
    reportValues: '',
    gender: 'both',
    ageStart: '0',
    ageStartUnit: DOB_AGE_UNITS.years,
    ageEnd: '0',
    ageEndUnit: DOB_AGE_UNITS.years,
    condition: 'normal',
    unit: '',
    newCondition: '',
  };
}

export function getComponentOptions(subGroupName, testName) {
  const testMeta = getTestMeta(subGroupName, testName);
  if (!testMeta) return [];

  return getPathologyComponentRows().filter((row) => row.tid === testMeta.tid).map((row) => ({
    value: String(row.tcid),
    label: row.componentName,
    tcid: row.tcid,
  }));
}

export function formatAgeForDisplay(age, unit) {
  const num = Number.parseInt(String(age), 10) || 0;

  if (unit === DOB_AGE_UNITS.years) {
    return `${num} (${num} Y - 0 M - 0 D)`;
  }

  if (unit === DOB_AGE_UNITS.months) {
    const years = Math.floor(num / 12);
    const months = num % 12;
    return `${num} (${years} Y - ${months} M - 0 D)`;
  }

  if (unit === DOB_AGE_UNITS.days) {
    const years = Math.floor(num / 365);
    const remainder = num % 365;
    const months = Math.floor(remainder / 30);
    const days = remainder % 30;
    return `${num} (${years} Y - ${months} M - ${days} D)`;
  }

  return `${num} (0 Y - 0 M - 0 D)`;
}

function findTestLocationByLabel(testLabel) {
  for (const [subGroupName, tests] of Object.entries(TEST_OPTIONS)) {
    const matchedTest = tests.find((option) => option.label === testLabel);
    if (!matchedTest) continue;

    const groupName =
      Object.entries(SUB_GROUP_OPTIONS).find(([, subGroups]) =>
        subGroups.some((subGroup) => subGroup.value === subGroupName),
      )?.[0] ?? 'haematology';

    return {
      groupName,
      subGroupName,
      testName: matchedTest.value,
    };
  }

  return null;
}

export function rowToPathologyTestRangeForm(row, unitOptions = UNIT_OPTIONS) {
  const locatedTest = findTestLocationByLabel(row.testName);
  const groupName =
    GROUP_OPTIONS.find((option) => option.label === row.groupName)?.value ??
    locatedTest?.groupName ??
    'haematology';
  const subGroupName =
    getSubGroupOptions(groupName).find((option) => option.label === row.subGroupName)?.value ??
    locatedTest?.subGroupName ??
    'cbc';
  const testName =
    getTestOptions(subGroupName).find((option) => option.label === row.testName)?.value ??
    locatedTest?.testName ??
    'esr';
  const componentOptions = getComponentOptions(subGroupName, testName);
  const matchedComponent = componentOptions.find((option) => option.label === row.componentName);
  const gender =
    GENDER_OPTIONS.find((option) => option.label === row.gender)?.value ?? 'both';
  const condition =
    getPathologyConditionOptions().find((option) => option.label === row.condition)?.value ??
    CONDITION_OPTIONS.find((option) => option.label === row.condition)?.value ??
    'normal';
  const unit =
    unitOptions.find((option) => option.label === row.unit)?.value ??
    unitOptions.find((option) => option.value === row.unit)?.value ??
    '';

  return {
    groupName,
    subGroupName,
    testName,
    testComponent: matchedComponent?.value ?? '',
    startValue: row.startValue ?? '',
    endValue: row.endValue ?? '',
    reportValues: row.reportValues ?? '',
    gender,
    ageStart: row.ageStart ?? '0',
    ageStartUnit: row.ageStartUnit ?? DOB_AGE_UNITS.years,
    ageEnd: row.ageEnd ?? '0',
    ageEndUnit: row.ageEndUnit ?? DOB_AGE_UNITS.years,
    condition,
    unit,
    newCondition: '',
  };
}
