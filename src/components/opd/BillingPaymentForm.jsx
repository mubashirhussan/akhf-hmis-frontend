'use client';

import { useEffect, useMemo, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Checkbox, Collapse, DatePicker, Input, InputNumber, Select } from 'antd';
import BillingDiscountRequestModal from '@/components/opd/BillingDiscountRequestModal';
import AppIcon from '@/components/icons/AppIcon';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import {
  BILLING_BANK_NAME_OPTIONS,
  BILLING_CARD_SERVICE_OPTIONS,
  BILLING_CARD_TYPE_OPTIONS,
  BILLING_COMPANY_OPTIONS,
  BILLING_RECEIVABLE_PARTY_OPTIONS,
  calcBillingMaxPanelAmount,
  calcBillingMaxReceivableAmount,
  calcBillingPaymentBreakdown,
} from '@/data/mock-billing-payment';
import { formatPkr } from '@/data/mock-walk-in-services';
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
  initialAdvancePayment = 0,
  onReceivePayment,
}) {
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [finalBill, setFinalBill] = useState(false);
  const [notes, setNotes] = useState('');
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
  const [panelAmount, setPanelAmount] = useState(0);
  const [company, setCompany] = useState(undefined);

  const refundPayment = 0;

  const appliedAdvancePayment = finalBill ? initialAdvancePayment : 0;

  const paymentBreakdown = useMemo(
    () =>
      calcBillingPaymentBreakdown({
        netPayable,
        advancePayment: appliedAdvancePayment,
        panelAmount,
        receivableAmount: receivableAmount ?? 0,
        refundPayment,
        finalBill,
        receivableEnabled: receivable,
      }),
    [
      appliedAdvancePayment,
      finalBill,
      netPayable,
      panelAmount,
      receivable,
      receivableAmount,
      refundPayment,
    ],
  );

  const { duePayment, appliedReceivable } = paymentBreakdown;

  useEffect(() => {
    if (!finalBill) return;

    const maxPanelAmount = calcBillingMaxPanelAmount({
      netPayable,
      advancePayment: initialAdvancePayment,
      receivableAmount: receivableAmount ?? 0,
      receivableEnabled: receivable,
      refundPayment,
    });

    if (panelAmount > maxPanelAmount) {
      setPanelAmount(maxPanelAmount);
    }

    if (receivableAmount == null) return;

    const maxReceivable = calcBillingMaxReceivableAmount({
      netPayable,
      advancePayment: initialAdvancePayment,
      panelAmount,
      refundPayment,
    });

    if (Number(receivableAmount) > maxReceivable) {
      setReceivableAmount(maxReceivable);
    }
  }, [
    finalBill,
    initialAdvancePayment,
    netPayable,
    panelAmount,
    receivable,
    receivableAmount,
    refundPayment,
  ]);

  const handleFinalBillChange = (checked) => {
    setFinalBill(checked);

    if (!checked) {
      setPanelAmount(0);
    }
  };

  const handleReceivableChange = (checked) => {
    setReceivable(checked);

    if (!checked) {
      setReceivableAmount(null);
      setReceivableParty(undefined);
      return;
    }

    if (finalBill && receivableAmount != null) {
      const maxReceivable = calcBillingMaxReceivableAmount({
        netPayable,
        advancePayment: appliedAdvancePayment,
        panelAmount,
        refundPayment,
      });
      setReceivableAmount(Math.min(Number(receivableAmount), maxReceivable));
    }
  };

  const handleReceivableAmountChange = (value) => {
    const nextAmount = value ?? 0;

    if (!finalBill) {
      setReceivableAmount(nextAmount);
      return;
    }

    const maxReceivable = calcBillingMaxReceivableAmount({
      netPayable,
      advancePayment: appliedAdvancePayment,
      panelAmount,
      refundPayment,
    });

    setReceivableAmount(Math.min(nextAmount, maxReceivable));
  };

  const handlePanelAmountChange = (value) => {
    const maxPanelAmount = calcBillingMaxPanelAmount({
      netPayable,
      advancePayment: appliedAdvancePayment,
      receivableAmount: receivableAmount ?? 0,
      receivableEnabled: receivable,
      refundPayment,
    });
    const nextPanelAmount = Math.min(value ?? 0, maxPanelAmount);

    setPanelAmount(nextPanelAmount);

    if (finalBill && receivable && receivableAmount != null) {
      const maxReceivable = calcBillingMaxReceivableAmount({
        netPayable,
        advancePayment: appliedAdvancePayment,
        panelAmount: nextPanelAmount,
        refundPayment,
      });
      setReceivableAmount(Math.min(Number(receivableAmount), maxReceivable));
    }
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

            <div className="billing-payment-options-row">
              <Checkbox
                checked={receivable}
                onChange={(e) => handleReceivableChange(e.target.checked)}
                className="billing-payment-receivable-check"
              >
                Receivable
              </Checkbox>
            </div>

            {receivable && (
              <FormGrid columns={2} className="">
                <FloatingField label="Amount" htmlFor="billing-receivable-amount">
                  <InputNumber
                    id="billing-receivable-amount"
                    className={`w-full ${controlClass}`}
                    controls={false}
                    min={0}
                    value={receivableAmount}
                    onChange={handleReceivableAmountChange}
                    placeholder="0"
                  />
                </FloatingField>

                <FloatingField label="Receivable Party" htmlFor="billing-receivable-party">
                  <Select
                    id="billing-receivable-party"
                    className={controlClass}
                    placeholder="Select party"
                    value={receivableParty}
                    allowClear
                    options={BILLING_RECEIVABLE_PARTY_OPTIONS}
                    onChange={setReceivableParty}
                  />
                </FloatingField>
              </FormGrid>
            )}
          </div>
        </div>

        <div className="billing-payment-panel">
          <div className="billing-payment-panel-head">
            <AppIcon icon="mdi:cash-plus" className="billing-payment-panel-icon" />
            <h3 className="billing-payment-panel-title">Advance Payment</h3>
          </div>
          <div className="billing-payment-panel-body">
            <FloatingField label="Amount" htmlFor="billing-advance-payment">
              <InputNumber
                id="billing-advance-payment"
                className={`w-full ${controlClass}`}
                controls={false}
                min={0}
                value={appliedAdvancePayment}
                readOnly
                placeholder="0"
              />
            </FloatingField>
          </div>
        </div>

        <div className="billing-payment-panel">
          <div className="billing-payment-panel-head">
            <AppIcon icon="mdi:tag-percent-outline" className="billing-payment-panel-icon" />
            <h3 className="billing-payment-panel-title">Panel</h3>
          </div>
          <div className="billing-payment-panel-body billing-payment-panel-body--stretch">
            <FormGrid columns={1} className="billing-payment-discount-grid">
              <FloatingField label="Amount" htmlFor="billing-payment-panel">
                <InputNumber
                  id="billing-payment-panel"
                  className={`w-full ${controlClass}`}
                  controls={false}
                  min={0}
                  value={panelAmount}
                  onChange={handlePanelAmountChange}
                  max={netPayable}
                />
              </FloatingField>

              <FloatingField label="Company" htmlFor="billing-payment-company">
                <Select
                  id="billing-payment-company"
                  className={controlClass}
                  placeholder="Select company"
                  value={company}
                  allowClear
                  options={BILLING_COMPANY_OPTIONS}
                  onChange={setCompany}
                />
              </FloatingField>
            </FormGrid>
          </div>
        </div>
      </div>
      <div className="billing-payment-toolbar">
        <label className="billing-payment-final-bill">
          <Checkbox checked={finalBill} onChange={(e) => handleFinalBillChange(e.target.checked)} />
          <span>Final Bill</span>
        </label>

        <div className="billing-payment-notes-wrap">
          <FloatingField label="Notes" htmlFor="billing-payment-notes">
            <Input
              id="billing-payment-notes"
              className={controlClass}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Payment notes..."
              autoComplete="off"
            />
          </FloatingField>
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
