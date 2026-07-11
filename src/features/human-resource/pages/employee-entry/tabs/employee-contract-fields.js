export function datesConflict(records, fromDate, toDate, excludeIndex = -1) {
  if (!fromDate || !toDate) return false;
  const from = new Date(fromDate);
  const to = new Date(toDate);
  return records.some((rec, i) => {
    if (i === excludeIndex || !rec.startDate || !rec.endDate) return false;
    return from <= new Date(rec.endDate) && to >= new Date(rec.startDate);
  });
}

export const CONTRACT_DEFAULT_ROW = {
  startDate: '',
  endDate: '',
  contractDocumentName: null,
  signingAuthority: null,
  notes: '',
};

export const getContractFields = (
  listIndex,
  { form, employeeOptions = [], allRows = [], documentRender } = {},
) => [
  {
    type: 'text',
    name: [listIndex, 'startDate'],
    label: 'Contract Start Date',
    floating: true,
    span: 6,
    required: true,
    validateTrigger: ['onChange', 'onBlur'],
    rules: [
      { required: true, message: 'Start date is required' },
      {
        validator(_, value) {
          const endDate = form.getFieldValue(['contracts', listIndex, 'endDate']);
          if (value && endDate && new Date(value) >= new Date(endDate)) {
            return Promise.reject(
              new Error('Enter correct dates: Start date must be earlier than End date'),
            );
          }
          if (value && endDate && datesConflict(allRows, value, endDate, listIndex)) {
            return Promise.reject(
              new Error('Enter correct dates: This period conflicts with an existing record'),
            );
          }
          return Promise.resolve();
        },
      },
    ],
    props: {
      type: 'date',
      onChange: () => {
        form.validateFields([['contracts', listIndex, 'endDate']]);
      },
    },
  },
  {
    type: 'text',
    name: [listIndex, 'endDate'],
    label: 'Contract End Date',
    floating: true,
    span: 6,
    required: true,
    validateTrigger: ['onChange', 'onBlur'],
    rules: [
      { required: true, message: 'End date is required' },
      {
        validator(_, value) {
          const startDate = form.getFieldValue(['contracts', listIndex, 'startDate']);
          if (value && startDate && new Date(value) <= new Date(startDate)) {
            return Promise.reject(
              new Error('Enter correct dates: End date must be later than Start date'),
            );
          }
          if (value && startDate && datesConflict(allRows, startDate, value, listIndex)) {
            return Promise.reject(
              new Error('Enter correct dates: This period conflicts with an existing record'),
            );
          }
          return Promise.resolve();
        },
      },
    ],
    props: {
      type: 'date',
      onChange: () => {
        form.validateFields([['contracts', listIndex, 'startDate']]);
      },
    },
  },
  {
    type: 'select',
    name: [listIndex, 'signingAuthority'],
    label: 'Signing Authority',
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
    type: 'custom',
    name: [listIndex, 'contractDocumentName'],
    label: 'Contract Document',
    floating: true,
    span: 6,
    required: true,
    rules: [{ required: true, message: 'Contract document is required' }],
    props: { render: documentRender },
  },
  {
    type: 'textarea',
    name: [listIndex, 'notes'],
    label: 'Notes',
    floating: true,
    span: 24,
    props: { rows: 2 },
  },
];
