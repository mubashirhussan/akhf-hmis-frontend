export const PRO_IMPROVEMENT_DEFAULT_ROW = {
  certificateName: '',
  recommendedInstitute: '',
  recommendedBy: '',
  recommendDate: '',
  recommendedTill: '',
  remarks: '',
};

export const getProImprovementFields = (listIndex) => [
  {
    type: 'text',
    name: [listIndex, 'certificateName'],
    label: 'Certificate Name',
    floating: true,
    span: 6,
    required: true,
    rules: [{ required: true, whitespace: true, message: 'Certificate name is required' }],
  },
  {
    type: 'text',
    name: [listIndex, 'recommendedInstitute'],
    label: 'Recommended Institute',
    floating: true,
    span: 6,
  },
  {
    type: 'text',
    name: [listIndex, 'recommendedBy'],
    label: 'Recommended By',
    floating: true,
    span: 6,
  },
  {
    type: 'text',
    name: [listIndex, 'recommendDate'],
    label: 'Recommend Date',
    floating: true,
    span: 6,
    props: { type: 'date' },
  },
  {
    type: 'text',
    name: [listIndex, 'recommendedTill'],
    label: 'Recommended Till',
    floating: true,
    span: 6,
    props: { type: 'date' },
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
