export const LAB_MACHINE_OPTIONS = [
  { value: 'architect-machine', label: 'Architect Machine', labMachineId: 1 },
  { value: 'cobas-6000', label: 'Cobas 6000', labMachineId: 2 },
  { value: 'sysmex-xn', label: 'Sysmex XN Series', labMachineId: 3 },
];

export const TEST_COMPONENT_OPTIONS = [
  {
    value: 'hcv-genotyping',
    label: 'HCV GENOTYPING - 4046',
    componentId: 4046,
  },
  {
    value: 'absolute-basophil-count',
    label: 'Absolute Basophil Count - 8789',
    componentId: 8789,
  },
  {
    value: 'haemoglobin',
    label: 'Haemoglobin - 8791',
    componentId: 8791,
  },
  {
    value: 'esr-value',
    label: 'ESR Value - 8790',
    componentId: 8790,
  },
];

export function getLabMachineLabel(labMachine) {
  return (
    LAB_MACHINE_OPTIONS.find((option) => option.value === labMachine)?.label ??
    labMachine
  );
}

export function getLabMachineId(labMachine) {
  return (
    LAB_MACHINE_OPTIONS.find((option) => option.value === labMachine)
      ?.labMachineId ?? null
  );
}

export function getTestComponentLabel(testComponent) {
  return (
    TEST_COMPONENT_OPTIONS.find((option) => option.value === testComponent)
      ?.label ?? testComponent
  );
}

export function getComponentId(testComponent) {
  return (
    TEST_COMPONENT_OPTIONS.find((option) => option.value === testComponent)
      ?.componentId ?? null
  );
}

export const INITIAL_MACHINE_INTEGRATION_COMPWISE_ROWS = [
  {
    id: '1',
    integrationId: 1,
    labMachine: 'architect-machine',
    labMachineId: 1,
    testComponent: 'hcv-genotyping',
    testComponentLabel: 'HCV GENOTYPING - 4046',
    componentId: 4046,
    machineCode: 'HCV-4046',
    assayNumber: '101',
  },
  {
    id: '2',
    integrationId: 2,
    labMachine: 'cobas-6000',
    labMachineId: 2,
    testComponent: 'haemoglobin',
    testComponentLabel: 'Haemoglobin - 8791',
    componentId: 8791,
    machineCode: 'HB-8791',
    assayNumber: '205',
  },
];

let integrationRows = INITIAL_MACHINE_INTEGRATION_COMPWISE_ROWS.map((row) => ({
  ...row,
}));

let nextIntegrationId =
  Math.max(
    ...INITIAL_MACHINE_INTEGRATION_COMPWISE_ROWS.map((row) => row.integrationId),
    0,
  ) + 1;

function resolveRowPayload(rowPayload) {
  const labMachineId = getLabMachineId(rowPayload.labMachine);
  const componentId = getComponentId(rowPayload.testComponent);
  const testComponentLabel = getTestComponentLabel(rowPayload.testComponent);

  return {
    ...rowPayload,
    labMachineId,
    componentId,
    testComponentLabel,
  };
}

export function getMachineIntegrationCompwiseRows() {
  return integrationRows;
}

export function createMachineIntegrationCompwiseRow(rowPayload) {
  const integrationId = nextIntegrationId++;

  const row = {
    id: String(integrationId),
    integrationId,
    ...resolveRowPayload(rowPayload),
  };

  integrationRows = [row, ...integrationRows];

  return row;
}

export function updateMachineIntegrationCompwiseRow(id, rowPayload) {
  integrationRows = integrationRows.map((row) =>
    row.id === id ? { ...row, ...resolveRowPayload(rowPayload) } : row,
  );

  return integrationRows.find((row) => row.id === id) ?? null;
}

export function deleteMachineIntegrationCompwiseRow(id) {
  integrationRows = integrationRows.filter((row) => row.id !== id);
}

export function createEmptyMachineIntegrationCompwiseForm() {
  return {
    labMachine: '',
    testComponent: '',
    machineCode: '',
    assayNumber: '',
  };
}

export function rowToMachineIntegrationCompwiseForm(row) {
  return {
    labMachine: row.labMachine ?? '',
    testComponent: row.testComponent ?? '',
    machineCode: row.machineCode ?? '',
    assayNumber: row.assayNumber ?? '',
  };
}
