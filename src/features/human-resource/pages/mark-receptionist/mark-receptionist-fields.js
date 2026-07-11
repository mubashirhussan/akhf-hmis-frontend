export const COUNTER_TYPE_OPTIONS = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'pharmacy', label: 'Pharmacy' },
];

export const MARK_RECEPTIONIST_INITIAL_VALUES = {
  employeeId: undefined,
  employeeName: '',
  counterType: undefined,
};

export const getMarkReceptionistFields = (employeeOptions = [], { isEdit = false } = {}) => [
  {
    type: 'select',
    name: 'employeeId',
    label: 'Employee ID',
    options: employeeOptions,
    rules: [{ required: true, message: 'Employee ID is required.' }],
    props: {
      showSearch: true,
      optionFilterProp: 'label',
      disabled: isEdit,
    },
  },
  {
    type: 'text',
    name: 'employeeName',
    label: 'Employee Name',
    props: { disabled: true },
  },
  {
    type: 'select',
    name: 'counterType',
    label: 'Counter Type',
    options: COUNTER_TYPE_OPTIONS,
    rules: [{ required: true, message: 'Counter Type is required.' }],
  },
];
