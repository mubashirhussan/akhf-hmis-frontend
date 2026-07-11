export const REFUND_AUTHORITY_INITIAL_VALUES = {
  employeeId: undefined,
};

export const getRefundAuthorityFields = (employeeOptions = []) => [
  {
    type: 'select',
    name: 'employeeId',
    label: 'Employee',
    options: employeeOptions,
    rules: [{ required: true, message: 'Employee is required.' }],
    props: {
      showSearch: true,
      optionFilterProp: 'label',
    },
  },
];
