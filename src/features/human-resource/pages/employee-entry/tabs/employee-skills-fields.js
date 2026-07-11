export const PROFICIENCY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

export const SKILL_DEFAULT_ROW = {
  skillName: '',
  proficiency: 'intermediate',
  yearsOfExperience: '',
  remarks: '',
};

export const getSkillFields = (listIndex) => [
  {
    type: 'text',
    name: [listIndex, 'skillName'],
    label: 'Skill Name',
    floating: true,
    span: 6,
    required: true,
    rules: [{ required: true, whitespace: true, message: 'Skill name is required' }],
  },
  {
    type: 'select',
    name: [listIndex, 'proficiency'],
    label: 'Proficiency',
    floating: true,
    span: 6,
    options: PROFICIENCY_OPTIONS,
  },
  {
    type: 'text',
    name: [listIndex, 'yearsOfExperience'],
    label: 'Years Of Experience',
    floating: true,
    span: 6,
  },
  {
    type: 'text',
    name: [listIndex, 'remarks'],
    label: 'Remarks',
    floating: true,
    span: 6,
  },
];
