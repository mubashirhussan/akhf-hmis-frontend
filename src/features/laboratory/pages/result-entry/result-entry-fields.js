import { RESULT_ENTRY_TEST_GROUP_FILTER_OPTIONS } from '@/features/laboratory/api/mock-result-entry';

export const RESULT_ENTRY_SIDEBAR_FIELDS = [
  {
    type: 'select',
    name: 'testGroup',
    label: 'Test Group',
    col: 24,
    floating: true,
    options: RESULT_ENTRY_TEST_GROUP_FILTER_OPTIONS,
  },
];

export function getResultEntryRemarksFields({ disabled = false } = {}) {
  return [
    {
      type: 'textarea',
      name: 'remarks',
      label: 'Remarks',
      col: 24,
      floating: true,
      props: { rows: 4, disabled },
    },
  ];
}

export function getResultEntryReportFields({
  reportTemplates = [],
  disabled = false,
} = {}) {
  return [
    {
      type: 'select',
      name: 'selectedTemplateId',
      label: 'Templates',
      col: 24,
      floating: true,
      options: reportTemplates,
      props: { placeholder: 'Select template', disabled, allowClear: true },
    },
    {
      type: 'textarea',
      name: 'templateContent',
      label: 'Report Content',
      col: 24,
      floating: true,
      props: { rows: 4, disabled, placeholder: 'Report template content' },
    },
  ];
}
