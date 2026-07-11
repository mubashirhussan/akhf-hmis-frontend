export const RESIGNATION_TYPE_OPTIONS = [
  { label: 'Resignation', value: 'resignation' },
  { label: 'Termination', value: 'termination' },
  { label: 'Retirement', value: 'retirement' },
  { label: 'Dismissal', value: 'dismissal' },
];

export const NOTICE_PERIOD_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({
  label: `${n} Month${n > 1 ? 's' : ''}`,
  value: n,
}));

export const APPROVAL_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

export const getResignationFields = (employeeOptions = []) => [
  {
    type: 'select',
    name: ['resignations', 0, 'resignationType'],
    label: 'Resignation Type',
    floating: true,
    span: 6,
    required: true,
    rules: [{ required: true, message: 'Resignation type is required' }],
    options: RESIGNATION_TYPE_OPTIONS,
    props: { allowClear: true },
  },
  {
    type: 'text',
    name: ['resignations', 0, 'resignDate'],
    label: 'Resign Date',
    floating: true,
    span: 6,
    props: { type: 'date' },
  },
  {
    type: 'text',
    name: ['resignations', 0, 'lastWorkDay'],
    label: 'Last Work Day',
    floating: true,
    span: 6,
    props: { type: 'date' },
  },
  {
    type: 'select',
    name: ['resignations', 0, 'noticePeriod'],
    label: 'Notice Period',
    floating: true,
    span: 6,
    options: NOTICE_PERIOD_OPTIONS,
    props: { allowClear: true, placeholder: 'Notice period in months' },
  },
  {
    type: 'select',
    name: ['resignations', 0, 'approval'],
    label: 'Approval',
    floating: true,
    span: 6,
    options: APPROVAL_OPTIONS,
    props: { allowClear: true },
  },
  {
    type: 'text',
    name: ['resignations', 0, 'approvalDate'],
    label: 'Approval Date',
    floating: true,
    span: 6,
    props: { type: 'date' },
  },
  {
    type: 'select',
    name: ['resignations', 0, 'approvedBy'],
    label: 'Approved By',
    floating: true,
    span: 6,
    options: employeeOptions,
    props: {
      showSearch: true,
      allowClear: true,
      filterOption: (input, option) =>
        option?.label?.toLowerCase().includes(input.toLowerCase()),
    },
  },
  {
    type: 'textarea',
    name: ['resignations', 0, 'resign'],
    label: 'Resign',
    floating: true,
    span: 24,
    props: { rows: 3 },
  },
  {
    type: 'textarea',
    name: ['resignations', 0, 'remarks'],
    label: 'Remarks',
    floating: true,
    span: 24,
    props: { rows: 3 },
  },
];
