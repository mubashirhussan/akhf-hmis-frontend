export const LANGUAGE_PROFICIENCY_OPTIONS = [
  { label: 'High Proficiency', value: 'high_proficiency' },
  { label: 'Medium Proficiency', value: 'medium_proficiency' },
  { label: 'Low Proficiency', value: 'low_proficiency' },
];

export const ADDITIONAL_INFO_LANGUAGE_FIELDS = [
  {
    type: 'select',
    name: ['additionalInfos', 0, 'languageEnglish'],
    label: 'Language (English)',
    floating: true,
    span: 6,
    options: LANGUAGE_PROFICIENCY_OPTIONS,
    props: { allowClear: true },
  },
];

export const ADDITIONAL_INFO_DETAIL_FIELDS = [
  {
    type: 'textarea',
    name: ['additionalInfos', 0, 'objective'],
    label: 'Objective',
    floating: true,
    span: 12,
    props: { rows: 3 },
  },
  {
    type: 'textarea',
    name: ['additionalInfos', 0, 'strengths'],
    label: 'Strengths',
    floating: true,
    span: 12,
    props: { rows: 3 },
  },
  {
    type: 'textarea',
    name: ['additionalInfos', 0, 'awards'],
    label: 'Awards',
    floating: true,
    span: 12,
    props: { rows: 3 },
  },
  {
    type: 'textarea',
    name: ['additionalInfos', 0, 'hobbies'],
    label: 'Hobbies',
    floating: true,
    span: 12,
    props: { rows: 3 },
  },
];
