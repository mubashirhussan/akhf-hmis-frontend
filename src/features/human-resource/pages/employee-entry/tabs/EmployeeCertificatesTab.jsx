'use client';

import { Input } from 'antd';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import EmployeeEntryListTab from './EmployeeEntryListTab';

const controlClass = FIELD_CONTROL_CLASS;

const CERTIFICATE_FIELDS = [
  {
    name: 'certificateName',
    label: 'Certificate Name',
    required: true,
    rules: [{ required: true, whitespace: true, message: 'Certificate name is required' }],
    render: () => <Input className={controlClass} />,
  },
  {
    name: 'institution',
    label: 'Institution',
    render: () => <Input className={controlClass} />,
  },
  {
    name: 'issueDate',
    label: 'Issue Date',
    render: () => <Input className={controlClass} placeholder="dd/MM/yyyy" />,
  },
  {
    name: 'expiryDate',
    label: 'Expiry Date',
    render: () => <Input className={controlClass} placeholder="dd/MM/yyyy" />,
  },
];

export default function EmployeeCertificatesTab() {
  return (
    <EmployeeEntryListTab
      name="certificates"
      addLabel="Add Certificate"
      defaultRow={{
        certificateName: '',
        institution: '',
        issueDate: '',
        expiryDate: '',
      }}
      fields={CERTIFICATE_FIELDS}
    />
  );
}
