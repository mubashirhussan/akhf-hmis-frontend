'use client';

import { useEffect, useMemo, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Checkbox, Collapse, Form } from 'antd';
import BillingDiscountRequestModal from '@/features/billing/components/BillingDiscountRequestModal';
import AppIcon from '@/components/icons/AppIcon';
import DynamicForm from '@/components/form/DynamicForm';
import {
  calcBillingMaxReceivableAmount,
  calcBillingPaymentBreakdown,
} from '@/features/billing/api/mock-billing-payment';
import {
  BILLING_BANK_FIELDS,
  BILLING_CREDIT_CARD_FIELDS,
  getBillingReceivableAmountField,
} from '@/features/billing/components/billing-payment-fields';
import { formatPkr } from '@/features/opd/api/mock-walk-in-services';

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
  const [paymentForm] = Form.useForm();
  const [receivableForm] = Form.useForm();
  const [receivable, setReceivable] = useState(false);
  const receivableAmount = Form.useWatch('receivableAmount', receivableForm);
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
    receivableForm.setFieldsValue({ receivableAmount: null });
  }, [isReceivableDisabled, receivableForm]);

  useEffect(() => {
    if (!receivable || receivableAmount == null) return;

    if (Number(receivableAmount) > maxReceivableAmount) {
      receivableForm.setFieldsValue({ receivableAmount: maxReceivableAmount });
    }
  }, [maxReceivableAmount, receivable, receivableAmount, receivableForm]);

  const handleReceivableChange = (checked) => {
    if (checked && isReceivableDisabled) return;

    setReceivable(checked);

    if (!checked) {
      receivableForm.setFieldsValue({ receivableAmount: null });
    }
  };

  const receivableAmountFields = useMemo(
    () => getBillingReceivableAmountField({ maxReceivableAmount, formatPkr }),
    [maxReceivableAmount],
  );

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
        <div className="billing-payment-method-grid">
          <DynamicForm fields={BILLING_CREDIT_CARD_FIELDS} gutter={[16, 12]} />
        </div>
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
        <div className="billing-payment-method-grid">
          <DynamicForm fields={BILLING_BANK_FIELDS} gutter={[16, 12]} />
        </div>
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
                <Form form={receivableForm} layout="vertical">
                  <DynamicForm fields={receivableAmountFields} gutter={[16, 12]} />
                </Form>
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

      <Form
        form={paymentForm}
        layout="vertical"
        initialValues={{
          creditCardAmount: null,
          cardType: 'master',
          creditBankName: undefined,
          cardNumber: '',
          cardService: 'credit',
          approvalNumber: '',
          bankAmount: null,
          bankName: undefined,
          chequeNumber: '',
          chequeDate: null,
        }}
      >
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
      </Form>

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
