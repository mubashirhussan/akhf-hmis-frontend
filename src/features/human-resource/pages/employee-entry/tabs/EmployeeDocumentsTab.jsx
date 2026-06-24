'use client';

import { Input, Select } from 'antd';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import EmployeeEntryListTab from './EmployeeEntryListTab';

const controlClass = FIELD_CONTROL_CLASS;

const DOCUMENT_TYPE_OPTIONS = [
  { value: 'cnic', label: 'CNIC' },
  { value: 'passport', label: 'Passport' },
  { value: 'degree', label: 'Degree' },
  { value: 'contract', label: 'Contract' },
  { value: 'other', label: 'Other' },
];

const DOCUMENT_FIELDS = [
  {
    name: 'documentType',
    label: 'Document Type',
    required: true,
    rules: [{ required: true, message: 'Document type is required' }],
    render: () => <Select className={controlClass} options={DOCUMENT_TYPE_OPTIONS} />,
  },
  {
    name: 'documentName',
    label: 'Document Name',
    required: true,
    rules: [{ required: true, whitespace: true, message: 'Document name is required' }],
    render: () => <Input className={controlClass} />,
  },
  {
    name: 'documentNo',
    label: 'Document No',
    render: () => <Input className={controlClass} />,
  },
  {
    name: 'remarks',
    label: 'Remarks',
    render: () => <Input className={controlClass} />,
  },
];

export default function EmployeeDocumentsTab() {
  return (
    <EmployeeEntryListTab
      name="documents"
      addLabel="Add Document"
      defaultRow={{
        documentType: 'cnic',
        documentName: '',
        documentNo: '',
        remarks: '',
      }}
      fields={DOCUMENT_FIELDS}
    />
  );
}
