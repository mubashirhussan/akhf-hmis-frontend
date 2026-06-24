'use client';

import { Input, Select } from 'antd';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import EmployeeEntryListTab from './EmployeeEntryListTab';

const controlClass = FIELD_CONTROL_CLASS;

const RELATIONSHIP_TYPE_OPTIONS = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'other', label: 'Other' },
];

const RELATIONSHIP_FIELDS = [
  {
    name: 'relationshipType',
    label: 'Relationship',
    required: true,
    rules: [{ required: true, message: 'Relationship is required' }],
    render: () => <Select className={controlClass} options={RELATIONSHIP_TYPE_OPTIONS} />,
  },
  {
    name: 'fullName',
    label: 'Full Name',
    required: true,
    rules: [{ required: true, whitespace: true, message: 'Full name is required' }],
    render: () => <Input className={controlClass} />,
  },
  {
    name: 'contactNo',
    label: 'Contact No',
    render: () => <Input className={controlClass} />,
  },
  {
    name: 'cnicNo',
    label: 'CNIC No',
    render: () => <Input className={controlClass} />,
  },
  {
    name: 'address',
    label: 'Address',
    col: 'full',
    render: () => <Input.TextArea className={controlClass} rows={2} />,
  },
];

export default function EmployeeRelationshipTab() {
  return (
    <EmployeeEntryListTab
      name="relationships"
      addLabel="Add Relationship"
      defaultRow={{
        relationshipType: 'father',
        fullName: '',
        contactNo: '',
        cnicNo: '',
        address: '',
      }}
      fields={RELATIONSHIP_FIELDS}
    />
  );
}
