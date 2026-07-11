export const STATUS_OPTIONS = [
  { label: 'Suspension', value: 'suspension' },
  { label: 'Rejoin', value: 'rejoin' },
];

export function getActiveStatus(fromDate, toDate, status) {
  if (!fromDate || !toDate) return status || '—';
  const now = new Date();
  const from = new Date(fromDate);
  const to = new Date(toDate);
  if (now >= from && now <= to) return 'Active';
  if (now > to) return status === 'rejoin' ? 'Rejoined' : 'Completed';
  return 'Upcoming';
}

export function datesConflict(records, fromDate, toDate, excludeIndex = -1) {
  if (!fromDate || !toDate) return false;
  const from = new Date(fromDate);
  const to = new Date(toDate);
  return records.some((rec, i) => {
    if (i === excludeIndex || !rec.fromDate || !rec.toDate) return false;
    return from <= new Date(rec.toDate) && to >= new Date(rec.fromDate);
  });
}

export const SUSPENSION_DEFAULT_ROW = {
  fromDate: '',
  toDate: '',
  suspendedBy: null,
  reason: '',
  remarks: '',
  status: null,
};

export const getSuspensionFields = (
  listIndex,
  { form, employeeOptions = [], allRows = [] } = {},
) => [
  {
    type: 'text',
    name: [listIndex, 'fromDate'],
    label: 'From Date',
    floating: true,
    span: 6,
    required: true,
    validateTrigger: ['onChange', 'onBlur'],
    rules: [
      { required: true, message: 'From date is required' },
      {
        validator(_, value) {
          const toDate = form.getFieldValue(['suspensions', listIndex, 'toDate']);
          if (value && toDate && new Date(value) >= new Date(toDate)) {
            return Promise.reject(
              new Error('Enter correct dates: From date must be earlier than To date'),
            );
          }
          if (value && toDate && datesConflict(allRows, value, toDate, listIndex)) {
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
        form.validateFields([['suspensions', listIndex, 'toDate']]);
      },
    },
  },
  {
    type: 'text',
    name: [listIndex, 'toDate'],
    label: 'To Date',
    floating: true,
    span: 6,
    required: true,
    validateTrigger: ['onChange', 'onBlur'],
    rules: [
      { required: true, message: 'To date is required' },
      {
        validator(_, value) {
          const fromDate = form.getFieldValue(['suspensions', listIndex, 'fromDate']);
          if (value && fromDate && new Date(value) <= new Date(fromDate)) {
            return Promise.reject(
              new Error('Enter correct dates: To date must be later than From date'),
            );
          }
          if (value && fromDate && datesConflict(allRows, fromDate, value, listIndex)) {
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
        form.validateFields([['suspensions', listIndex, 'fromDate']]);
      },
    },
  },
  {
    type: 'select',
    name: [listIndex, 'suspendedBy'],
    label: 'Suspension By',
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
    type: 'select',
    name: [listIndex, 'status'],
    label: 'Status',
    floating: true,
    span: 6,
    options: STATUS_OPTIONS,
    props: { allowClear: true },
  },
  {
    type: 'textarea',
    name: [listIndex, 'reason'],
    label: 'Reason',
    floating: true,
    span: 24,
    props: { rows: 2 },
  },
  {
    type: 'textarea',
    name: [listIndex, 'remarks'],
    label: 'Remarks',
    floating: true,
    span: 24,
    props: { rows: 2 },
  },
];
