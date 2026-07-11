export const REPORT_HEADER_INITIAL_VALUES = {
  hospitalId: undefined,
  heading1: '',
  heading2: '',
  heading3: '',
  footerHeading: '',
  imageLeft: null,
  imageRight: null,
};

export function getReportHeaderFields({
  hospitalOptions = [],
  imageLeftField,
  imageRightField,
} = {}) {
  return [
    {
      type: 'select',
      name: 'hospitalId',
      label: 'Hospital Name',
      col: 12,
      options: hospitalOptions,
      rules: [{ required: true, message: 'Hospital is required.' }],
      props: { showSearch: true, optionFilterProp: 'label' },
    },
    {
      type: 'text',
      name: 'heading1',
      label: 'Heading 1',
      col: 12,
    },
    {
      type: 'text',
      name: 'heading2',
      label: 'Heading 2',
      col: 12,
    },
    {
      type: 'text',
      name: 'heading3',
      label: 'Heading 3',
      col: 12,
    },
    {
      type: 'text',
      name: 'footerHeading',
      label: 'Footer Heading',
      col: 12,
    },
    ...(imageLeftField ? [imageLeftField] : []),
    ...(imageRightField ? [imageRightField] : []),
  ];
}
