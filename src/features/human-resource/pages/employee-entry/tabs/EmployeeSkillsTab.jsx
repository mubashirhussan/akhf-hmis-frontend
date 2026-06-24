'use client';

import { Input, Select } from 'antd';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import EmployeeEntryListTab from './EmployeeEntryListTab';

const controlClass = FIELD_CONTROL_CLASS;

const PROFICIENCY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const SKILL_FIELDS = [
  {
    name: 'skillName',
    label: 'Skill Name',
    required: true,
    rules: [{ required: true, whitespace: true, message: 'Skill name is required' }],
    render: () => <Input className={controlClass} />,
  },
  {
    name: 'proficiency',
    label: 'Proficiency',
    render: () => <Select className={controlClass} options={PROFICIENCY_OPTIONS} />,
  },
  {
    name: 'yearsOfExperience',
    label: 'Years Of Experience',
    render: () => <Input className={controlClass} />,
  },
  {
    name: 'remarks',
    label: 'Remarks',
    render: () => <Input className={controlClass} />,
  },
];

export default function EmployeeSkillsTab() {
  return (
    <EmployeeEntryListTab
      name="skills"
      addLabel="Add Skill"
      defaultRow={{
        skillName: '',
        proficiency: 'intermediate',
        yearsOfExperience: '',
        remarks: '',
      }}
      fields={SKILL_FIELDS}
    />
  );
}
