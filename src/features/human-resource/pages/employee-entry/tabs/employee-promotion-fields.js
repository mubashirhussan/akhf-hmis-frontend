export const PROMOTION_TYPE_OPTIONS = [
  { label: 'Promotion', value: 'promotion' },
  { label: 'Demotion', value: 'demotion' },
];

export const DESIGNATION_OPTIONS = [
  { value: 'neuro-surgeon', label: 'Neuro Surgeon' },
  { value: 'medical-officer', label: 'Medical Officer' },
  { value: 'staff-nurse', label: 'Staff Nurse' },
  { value: 'administrator', label: 'Administrator' },
  { value: 'officer', label: 'Officer' },
];

export function dateConflicts(records, date, excludeIndex = -1) {
  if (!date) return false;
  return records.some((rec, i) => {
    if (i === excludeIndex || !rec.promotionDate) return false;
    return rec.promotionDate === date;
  });
}

export const PROMOTION_DEFAULT_ROW = {
  currentDesignation: null,
  promotionType: null,
  promotionDate: '',
  newDesignation: null,
  orderedBy: null,
  description: '',
};

export const getPromotionFields = (listIndex, { employeeOptions = [], allRows = [] } = {}) => [
  {
    type: 'select',
    name: [listIndex, 'currentDesignation'],
    label: 'Current Designation',
    floating: true,
    span: 6,
    options: DESIGNATION_OPTIONS,
    props: { allowClear: true },
  },
  {
    type: 'select',
    name: [listIndex, 'promotionType'],
    label: 'Promotion / Demotion',
    floating: true,
    span: 6,
    required: true,
    rules: [{ required: true, message: 'This field is required' }],
    options: PROMOTION_TYPE_OPTIONS,
    props: { allowClear: true },
  },
  {
    type: 'text',
    name: [listIndex, 'promotionDate'],
    label: 'Promotion / Demotion Date',
    floating: true,
    span: 6,
    required: true,
    rules: [
      { required: true, message: 'Date is required' },
      {
        validator(_, value) {
          if (value && dateConflicts(allRows, value, listIndex)) {
            return Promise.reject(new Error('A promotion/demotion already exists on this date'));
          }
          return Promise.resolve();
        },
      },
    ],
    props: { type: 'date' },
  },
  {
    type: 'select',
    name: [listIndex, 'newDesignation'],
    label: 'New Designation',
    floating: true,
    span: 6,
    options: DESIGNATION_OPTIONS,
    props: { allowClear: true },
  },
  {
    type: 'select',
    name: [listIndex, 'orderedBy'],
    label: 'Ordered By',
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
    name: [listIndex, 'description'],
    label: 'Promotion / Demotion Description',
    floating: true,
    span: 24,
    props: { rows: 2 },
  },
];
