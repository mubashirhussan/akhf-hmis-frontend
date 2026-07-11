export const ASSIGN_COMPANY_RATES_INITIAL_VALUES = {
  currentAmount: null,
  adjustType: undefined,
  adjustMode: undefined,
  percentage: null,
  fixedAmount: null,
};

export const ADJUST_TYPE_OPTIONS = [
  { label: 'Increase', value: 'increase' },
  { label: 'Decrease', value: 'decrease' },
];

export const ADJUST_MODE_OPTIONS = [
  { label: 'Percentage', value: 'percentage' },
  { label: 'Fixed Amount', value: 'fixed' },
];

export function getAssignCompanyRatesFields({ adjustMode, showCurrentAmount } = {}) {
  const fields = [];

  if (showCurrentAmount) {
    fields.push({
      type: 'number',
      name: 'currentAmount',
      label: 'Current Amount',
      props: { disabled: true, className: 'assign-company-rates-percentage-input' },
    });
  }

  fields.push(
    {
      type: 'select',
      name: 'adjustType',
      label: 'Adjustment Type',
      options: ADJUST_TYPE_OPTIONS,
      rules: [{ required: true, message: 'Adjustment Type is required.' }],
    },
    {
      type: 'select',
      name: 'adjustMode',
      label: 'Adjustment Mode',
      options: ADJUST_MODE_OPTIONS,
      rules: [{ required: true, message: 'Adjustment Mode is required.' }],
    },
  );

  if (adjustMode === 'percentage') {
    fields.push({
      type: 'number',
      name: 'percentage',
      label: 'Percentage',
      rules: [{ required: true, message: 'Percentage is required.' }],
      props: { min: 0.01, max: 100, className: 'assign-company-rates-percentage-input' },
    });
  }

  if (adjustMode === 'fixed') {
    fields.push({
      type: 'number',
      name: 'fixedAmount',
      label: 'Fixed Amount',
      rules: [{ required: true, message: 'Fixed Amount is required.' }],
      props: { min: 1, className: 'assign-company-rates-percentage-input' },
    });
  }

  return fields;
}
