import {
  BILLING_BANK_NAME_OPTIONS,
  BILLING_CARD_SERVICE_OPTIONS,
  BILLING_CARD_TYPE_OPTIONS,
  BILLING_DISCOUNT_FORWARD_TO_OPTIONS,
  BILLING_DISCOUNT_HOSPITAL_OPTIONS,
} from '@/features/billing/api/mock-billing-payment';

export const BILLING_CREDIT_CARD_FIELDS = [
  {
    type: 'number',
    name: 'creditCardAmount',
    label: 'Amount',
    col: 8,
    floating: true,
    props: { controls: false, min: 0, placeholder: '0', style: { width: '100%' } },
  },
  {
    type: 'select',
    name: 'cardType',
    label: 'Card Type',
    col: 8,
    floating: true,
    options: BILLING_CARD_TYPE_OPTIONS,
  },
  {
    type: 'select',
    name: 'creditBankName',
    label: 'Bank Name',
    col: 8,
    floating: true,
    options: BILLING_BANK_NAME_OPTIONS,
    props: { placeholder: 'Select bank', allowClear: true },
  },
  {
    type: 'text',
    name: 'cardNumber',
    label: 'Card #',
    col: 8,
    floating: true,
    props: { autoComplete: 'off' },
  },
  {
    type: 'select',
    name: 'cardService',
    label: 'Card Service',
    col: 8,
    floating: true,
    options: BILLING_CARD_SERVICE_OPTIONS,
  },
  {
    type: 'text',
    name: 'approvalNumber',
    label: 'Approval #',
    col: 8,
    floating: true,
    props: { autoComplete: 'off' },
  },
];

export const BILLING_BANK_FIELDS = [
  {
    type: 'number',
    name: 'bankAmount',
    label: 'Amount',
    col: 6,
    floating: true,
    props: { controls: false, min: 0, placeholder: '0', style: { width: '100%' } },
  },
  {
    type: 'select',
    name: 'bankName',
    label: 'Bank Name',
    col: 6,
    floating: true,
    options: BILLING_BANK_NAME_OPTIONS,
    props: { placeholder: 'Select bank', allowClear: true },
  },
  {
    type: 'text',
    name: 'chequeNumber',
    label: 'Cheque #',
    col: 6,
    floating: true,
    props: { autoComplete: 'off' },
  },
  {
    type: 'date',
    name: 'chequeDate',
    label: 'Cheque Date',
    col: 6,
    floating: true,
    props: { format: 'MM/DD/YYYY', placeholder: 'mm/dd/yyyy' },
  },
];

export function getBillingReceivableAmountField({ maxReceivableAmount, formatPkr }) {
  return [
    {
      type: 'number',
      name: 'receivableAmount',
      label: 'Amount',
      col: 24,
      floating: true,
      props: {
        controls: false,
        min: 0,
        max: maxReceivableAmount,
        placeholder: `Max ${formatPkr(maxReceivableAmount)}`,
        style: { width: '100%' },
      },
    },
  ];
}

export const BILLING_DISCOUNT_REQUEST_INITIAL_VALUES = {
  hospital: 'alkhidmat-khi',
  forwardTo: 'abdul-hameed',
  attachments: null,
  description: '',
};

export const BILLING_DISCOUNT_REQUEST_FIELDS = [
  {
    type: 'select',
    name: 'hospital',
    label: 'Hospital',
    col: 24,
    options: BILLING_DISCOUNT_HOSPITAL_OPTIONS,
    rules: [{ required: true, message: 'Hospital is required.' }],
  },
  {
    type: 'select',
    name: 'forwardTo',
    label: 'Forward To',
    col: 24,
    options: BILLING_DISCOUNT_FORWARD_TO_OPTIONS,
    rules: [{ required: true, message: 'Forward To is required.' }],
  },
];
