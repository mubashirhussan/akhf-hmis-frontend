'use client';

import { Input, Select } from 'antd';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import EmployeeEntryListTab from './EmployeeEntryListTab';

const controlClass = FIELD_CONTROL_CLASS;

const TITLE_OPTIONS = [
  { label: 'Mr', value: 'mr' },
  { label: 'Mrs', value: 'mrs' },
  { label: 'Miss', value: 'miss' },
  { label: 'Dr', value: 'dr' },
  { label: 'Prof', value: 'prof' },
];

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const RELATION_OPTIONS = [
  { label: 'Father', value: 'father' },
  { label: 'Mother', value: 'mother' },
  { label: 'Spouse', value: 'spouse' },
  { label: 'Son', value: 'son' },
  { label: 'Daughter', value: 'daughter' },
  { label: 'Brother', value: 'brother' },
  { label: 'Sister', value: 'sister' },
  { label: 'Guardian', value: 'guardian' },
];

const RELATIONSHIP_FIELDS = [
  {
    name: 'title',
    label: 'Title',
    render: () => <Select className={controlClass} options={TITLE_OPTIONS} allowClear />,
  },
  {
    name: 'firstName',
    label: 'First Name',
    required: true,
    rules: [{ required: true, whitespace: true, message: 'First name is required' }],
    render: () => <Input className={controlClass} />,
  },
  {
    name: 'lastName',
    label: 'Last Name',
    required: true,
    rules: [{ required: true, whitespace: true, message: 'Last name is required' }],
    render: () => <Input className={controlClass} />,
  },
  {
    name: 'relation',
    label: 'Relation',
    required: true,
    rules: [{ required: true, message: 'Relation is required' }],
    render: () => <Select className={controlClass} options={RELATION_OPTIONS} allowClear />,
  },
  {
    name: 'gender',
    label: 'Gender',
    render: () => <Select className={controlClass} options={GENDER_OPTIONS} allowClear />,
  },
  {
    name: 'age',
    label: 'Age',
    render: () => <Input className={controlClass} />,
  },
  {
    name: 'cnic',
    label: 'CNIC',
    render: () => <Input className={controlClass} />,
  },
  {
    name: 'contactNo',
    label: 'Contact No',
    render: () => <Input className={controlClass} />,
  },
];

export default function EmployeeRelationshipTab() {
  return (
    <EmployeeEntryListTab
      name="relationships"
      addLabel="Add Relationship"
      defaultRow={{
        title: null,
        firstName: '',
        lastName: '',
        relation: null,
        gender: null,
        age: '',
        cnic: '',
        contactNo: '',
      }}
      fields={RELATIONSHIP_FIELDS}
    />
  );
}