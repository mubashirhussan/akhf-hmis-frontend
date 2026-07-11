export const DISCOUNT_AUTHORITY_INITIAL_VALUES = {
  employeeId: undefined,
};

export const getDiscountAuthorityFields = (employeeOptions = []) => [
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
