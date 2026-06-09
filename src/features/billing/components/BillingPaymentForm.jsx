'use client';

import { useEffect, useMemo, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Checkbox, Collapse, DatePicker, Input, InputNumber, Select } from 'antd';
import BillingDiscountRequestModal from '@/features/billing/components/BillingDiscountRequestModal';
import AppIcon from '@/components/icons/AppIcon';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import {
  BILLING_BANK_NAME_OPTIONS,
  BILLING_CARD_SERVICE_OPTIONS,
  BILLING_CARD_TYPE_OPTIONS,
  BILLING_RECEIVABLE_PARTY_OPTIONS,
  calcBillingMaxReceivableAmount,
  calcBillingPaymentBreakdown,
} from '@/features/billing/api/mock-billing-payment';
import { formatPkr } from '@/features/opd/api/mock-walk-in-services';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

function PaymentStat({ label, value, tone = 'default' }) {
  return (
    <div className={`billing-payment-stat billing-payment-stat--${tone}`}>
      <span className="billing-payment-stat-label">{label}</span>
      <span className="billing-payment-stat-value">{value}</span>
    </div>
  );
}

export default function BillingPaymentForm({
  totalDiscount = 0,
  netPayable = 0,
  advancePayments = [],
  advancePaymentTotal = 0,
  panelPayments = [],
  panelPaymentTotal = 0,
  onReceivePayment,
}) {
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [receivable, setReceivable] = useState(false);
  const [receivableAmount, setReceivableAmount] = useState(null);
  const [receivableParty, setReceivableParty] = useState(undefined);
  const [creditCardAmount, setCreditCardAmount] = useState(null);
  const [cardType, setCardType] = useState('master');
  const [creditBankName, setCreditBankName] = useState(undefined);
  const [cardNumber, setCardNumber] = useState('');
  const [cardService, setCardService] = useState('credit');
  const [approvalNumber, setApprovalNumber] = useState('');
  const [bankAmount, setBankAmount] = useState(null);
  const [bankName, setBankName] = useState(undefined);
  const [chequeNumber, setChequeNumber] = useState('');
  const [chequeDate, setChequeDate] = useState(null);
  const refundPayment = 0;

  const appliedAdvancePayment = advancePaymentTotal;
  const appliedPanelAmount = panelPaymentTotal;

  const paymentBreakdown = useMemo(
    () =>
      calcBillingPaymentBreakdown({
        netPayable,
        advancePayment: appliedAdvancePayment,
        panelAmount: appliedPanelAmount,
        receivableAmount: receivableAmount ?? 0,
        refundPayment,
        receivableEnabled: receivable,
      }),
    [
      appliedAdvancePayment,
      appliedPanelAmount,
      netPayable,
      receivable,
      receivableAmount,
      refundPayment,
    ],
  );

  const { duePayment, appliedReceivable } = paymentBreakdown;

  const maxReceivableAmount = useMemo(
    () =>
      calcBillingMaxReceivableAmount({
        netPayable,
        advancePayment: appliedAdvancePayment,
        panelAmount: appliedPanelAmount,
        refundPayment,
      }),
    [appliedAdvancePayment, appliedPanelAmount, netPayable, refundPayment],
  );

  const isReceivableDisabled = maxReceivableAmount <= 0;

  useEffect(() => {
    if (!isReceivableDisabled) return;

    setReceivable(false);
    setReceivableAmount(null);
    setReceivableParty(undefined);
  }, [isReceivableDisabled]);

  useEffect(() => {
    if (!receivable || receivableAmount == null) return;

    if (Number(receivableAmount) > maxReceivableAmount) {
      setReceivableAmount(maxReceivableAmount);
    }
  }, [maxReceivableAmount, receivable, receivableAmount]);

  const handleReceivableChange = (checked) => {
    if (checked && isReceivableDisabled) return;

    setReceivable(checked);

    if (!checked) {
      setReceivableAmount(null);
      setReceivableParty(undefined);
      return;
    }

    if (receivableAmount != null) {
      setReceivableAmount(Math.min(Number(receivableAmount), maxReceivableAmount));
    }
  };

  const handleReceivableAmountChange = (value) => {
    if (value == null || value === '') {
      setReceivableAmount(null);
      return;
    }

    setReceivableAmount(Math.min(Math.max(0, Number(value)), maxReceivableAmount));
  };

  const collapseItems = [
    {
      key: 'credit-card',
      label: (
        <span className="billing-payment-collapse-label">
          <AppIcon icon="mdi:credit-card-outline" className="billing-payment-collapse-icon" />
          Credit Card
        </span>
      ),
      children: (
        <FormGrid columns={3} className="billing-payment-method-grid">
          <FloatingField label="Amount" htmlFor="billing-cc-amount">
            <InputNumber
              id="billing-cc-amount"
              className={`w-full ${controlClass}`}
              controls={false}
              min={0}
              value={creditCardAmount}
              onChange={setCreditCardAmount}
              placeholder="0"
            />
          </FloatingField>
          <FloatingField label="Card Type" htmlFor="billing-cc-type">
            <Select
              id="billing-cc-type"
              className={controlClass}
              value={cardType}
              options={BILLING_CARD_TYPE_OPTIONS}
              onChange={setCardType}
            />
          </FloatingField>
          <FloatingField label="Bank Name" htmlFor="billing-cc-bank">
            <Select
              id="billing-cc-bank"
              className={controlClass}
              placeholder="Select bank"
              value={creditBankName}
              allowClear
              options={BILLING_BANK_NAME_OPTIONS}
              onChange={setCreditBankName}
            />
          </FloatingField>
          <FloatingField label="Card #" htmlFor="billing-cc-number">
            <Input
              id="billing-cc-number"
              className={controlClass}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              autoComplete="off"
            />
          </FloatingField>
          <FloatingField label="Card Service" htmlFor="billing-cc-service">
            <Select
              id="billing-cc-service"
              className={controlClass}
              value={cardService}
              options={BILLING_CARD_SERVICE_OPTIONS}
              onChange={setCardService}
            />
          </FloatingField>
          <FloatingField label="Approval #" htmlFor="billing-cc-approval">
            <Input
              id="billing-cc-approval"
              className={controlClass}
              value={approvalNumber}
              onChange={(e) => setApprovalNumber(e.target.value)}
              autoComplete="off"
            />
          </FloatingField>
        </FormGrid>
      ),
    },
    {
      key: 'bank-online',
      label: (
        <span className="billing-payment-collapse-label">
          <AppIcon icon="mdi:bank-outline" className="billing-payment-collapse-icon" />
          Bank / Online
        </span>
      ),
      children: (
        <FormGrid columns={4} className="billing-payment-method-grid">
          <FloatingField label="Amount" htmlFor="billing-bank-amount">
            <InputNumber
              id="billing-bank-amount"
              className={`w-full ${controlClass}`}
              controls={false}
              min={0}
              value={bankAmount}
              onChange={setBankAmount}
              placeholder="0"
            />
          </FloatingField>
          <FloatingField label="Bank Name" htmlFor="billing-bank-name">
            <Select
              id="billing-bank-name"
              className={controlClass}
              placeholder="Select bank"
              value={bankName}
              allowClear
              options={BILLING_BANK_NAME_OPTIONS}
              onChange={setBankName}
            />
          </FloatingField>
          <FloatingField label="Cheque #" htmlFor="billing-bank-cheque">
            <Input
              id="billing-bank-cheque"
              className={controlClass}
              value={chequeNumber}
              onChange={(e) => setChequeNumber(e.target.value)}
              autoComplete="off"
            />
          </FloatingField>
          <FloatingField label="Cheque Date" htmlFor="billing-bank-cheque-date">
            <DatePicker
              id="billing-bank-cheque-date"
              className={`w-full ${controlClass}`}
              value={chequeDate}
              onChange={setChequeDate}
              format="MM/DD/YYYY"
              placeholder="mm/dd/yyyy"
            />
          </FloatingField>
        </FormGrid>
      ),
    },
  ];

  return (
    <section className="billing-payment-card" aria-label="Payment details">
      <div className="billing-payment-card-header">
        <h2 className="billing-payment-card-title">Payment</h2>
        <div className="billing-payment-card-header-actions">
          <Button
            type="primary"
            className="billing-payment-header-discount-btn"
            onClick={() => setIsDiscountModalOpen(true)}
          >
           Add Discount
          </Button>

          <div className="billing-payment-receivable-wrap">
            <span className="billing-payment-receivable-label">Previous Receivable</span>
            <button type="button" className="billing-payment-view-receivables-link">
              View Receivables
            </button>
          </div>
        </div>
      </div>

      

      <div className="billing-payment-panels">
        <div className="billing-payment-panel">
          <div className="billing-payment-panel-head">
            <AppIcon icon="mdi:cash-multiple" className="billing-payment-panel-icon" />
            <h3 className="billing-payment-panel-title">Payment Status</h3>
          </div>

          <div className="billing-payment-panel-body">
            <div className="billing-payment-stats-grid">
              <PaymentStat
                label="Current Payment"
                value={formatPkr(netPayable)}
                tone="primary"
              />
              <PaymentStat label="Advance Payment" value={formatPkr(appliedAdvancePayment)} />
              <PaymentStat label="Discount" value={formatPkr(totalDiscount)} tone="danger" />
              <PaymentStat label="Refund Payment" value={formatPkr(refundPayment)} />
             
                <PaymentStat label="Receivable" value={formatPkr(appliedReceivable)} />
           
              <PaymentStat label="Due Payment" value={formatPkr(duePayment)} tone="success" />
            </div>

            <div className="billing-payment-receivable-row">
              <Checkbox
                checked={receivable}
                disabled={isReceivableDisabled}
                onChange={(e) => handleReceivableChange(e.target.checked)}
                className="billing-payment-receivable-check"
              >
                Receivable
              </Checkbox>

              {receivable && (
                <FloatingField label="Amount" htmlFor="billing-receivable-amount">
                  <InputNumber
                    id="billing-receivable-amount"
                    className={`w-full ${controlClass}`}
                    controls={false}
                    min={0}
                    max={maxReceivableAmount}
                    value={receivableAmount}
                    onChange={handleReceivableAmountChange}
                    placeholder={`Max ${formatPkr(maxReceivableAmount)}`}
                  />
                </FloatingField>
              )}
            </div>
          </div>
        </div>

        <div className="billing-payment-panel">
          <div className="billing-payment-panel-head">
            <AppIcon icon="mdi:cash-plus" className="billing-payment-panel-icon" />
            <h3 className="billing-payment-panel-title">Advance Payment</h3>
          </div>
          <div className="billing-payment-panel-body">
            {advancePayments.length > 0 ? (
              <div className="billing-payment-advance-table">
                {/* <div className="billing-payment-advance-header">
                  <span>Receipt #</span>
                  <span>Value</span>
                </div> */}
                <ul className="billing-payment-advance-list">
                  {advancePayments.map((payment) => (
                    <li key={payment.receiptNo} className="billing-payment-advance-item">
                      <span className="billing-payment-advance-receipt">{payment.receiptNo}</span>
                      <span className="billing-payment-advance-value">
                        {formatPkr(payment.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="billing-payment-advance-empty">No advance payment</p>
            )}
          </div>
        </div>

        <div className="billing-payment-panel">
          <div className="billing-payment-panel-head">
            <AppIcon icon="mdi:tag-percent-outline" className="billing-payment-panel-icon" />
            <h3 className="billing-payment-panel-title">Panel</h3>
          </div>
          <div className="billing-payment-panel-body">
            {panelPayments.length > 0 ? (
              <div className="billing-payment-advance-table">
                {/* <div className="billing-payment-advance-header">
                  <span>Company</span>
                  <span>Amount</span>
                </div> */}
                <ul className="billing-payment-advance-list">
                  {panelPayments.map((payment) => (
                    <li
                      key={`${payment.companyName}-${payment.amount}`}
                      className="billing-payment-advance-item"
                    >
                      <span className="billing-payment-advance-receipt">{payment.companyName}</span>
                      <span className="billing-payment-advance-value">
                        {formatPkr(payment.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="billing-payment-advance-empty">No panel payment</p>
            )}
          </div>
        </div>
      </div>
      <Collapse
        bordered={false}
        className="billing-payment-collapse"
        defaultActiveKey={[]}
        expandIconPlacement="end"
        expandIcon={({ isActive }) =>
          isActive ? (
            <UpOutlined className="billing-payment-collapse-arrow" aria-hidden />
          ) : (
            <DownOutlined className="billing-payment-collapse-arrow" aria-hidden />
          )
        }
        items={collapseItems}
      />

      <div className="billing-payment-footer-actions">
        <Button className="billing-payment-print-btn">Print Receipt</Button>
        <Button type="primary" className="billing-payment-receive-btn" onClick={onReceivePayment}>
          Receive Payment
        </Button>
      </div>

      <BillingDiscountRequestModal
        open={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
      />
    </section>
  );
}
