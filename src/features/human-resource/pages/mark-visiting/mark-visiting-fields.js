export const MARK_VISITING_INITIAL_VALUES = {
  employeeId: undefined,
  employeeName: '',
};

export const getMarkVisitingFields = (employeeOptions = [], { isEdit = false } = {}) => [
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
];
