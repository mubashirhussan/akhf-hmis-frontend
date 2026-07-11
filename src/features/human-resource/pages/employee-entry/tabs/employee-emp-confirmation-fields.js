export const getEmpConfirmationFields = (employeeOptions = []) => [
  {
    type: 'select',
    name: ['empConfirmations', 0, 'recommendedBy'],
    label: 'Confirmation Recommended By',
    floating: true,
    span: 6,
    required: true,
    rules: [{ required: true, message: 'This field is required' }],
    options: employeeOptions,
    props: {
      showSearch: true,
      allowClear: true,
      filterOption: (input, option) =>
        option?.label?.toLowerCase().includes(input.toLowerCase()),
    },
  },
  {
    type: 'text',
    name: ['empConfirmations', 0, 'approvalDate'],
    label: 'Date of Approval',
    floating: true,
    span: 6,
    props: { type: 'date' },
  },
  {
    type: 'textarea',
    name: ['empConfirmations', 0, 'remarks'],
    label: 'Remarks / Result',
    floating: true,
    span: 24,
    props: { rows: 3 },
  },
];
