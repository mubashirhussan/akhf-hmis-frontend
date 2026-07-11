export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'cnic', label: 'CNIC' },
  { value: 'passport', label: 'Passport' },
  { value: 'degree', label: 'Degree' },
  { value: 'contract', label: 'Contract' },
  { value: 'other', label: 'Other' },
];

export const DOCUMENT_DEFAULT_ROW = {
  documentType: null,
  documentName: '',
  documentFileName: null,
  remarks: '',
};

export const getDocumentFields = (listIndex, { documentRender } = {}) => [
  {
    type: 'select',
    name: [listIndex, 'documentType'],
    label: 'Document Type',
    floating: true,
    span: 6,
    required: true,
    rules: [{ required: true, message: 'Document type is required' }],
    options: DOCUMENT_TYPE_OPTIONS,
    props: { allowClear: true },
  },
  {
    type: 'text',
    name: [listIndex, 'documentName'],
    label: 'Document Name',
    floating: true,
    span: 6,
    required: true,
    rules: [{ required: true, whitespace: true, message: 'Document name is required' }],
  },
  {
    type: 'custom',
    name: [listIndex, 'documentFileName'],
    label: 'Attach Document',
    floating: true,
    span: 6,
    required: true,
    rules: [{ required: true, message: 'Please attach a document' }],
    props: { render: documentRender },
  },
  {
    type: 'text',
    name: [listIndex, 'remarks'],
    label: 'Remarks',
    floating: true,
    span: 6,
  },
];
