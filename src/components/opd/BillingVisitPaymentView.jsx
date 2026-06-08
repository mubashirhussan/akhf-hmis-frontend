'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { App, Button, Checkbox, Collapse, InputNumber } from 'antd';
import PatientInfoHeaderCard from '@/components/patient/PatientInfoHeaderCard';
import BillingPaymentForm from '@/components/opd/BillingPaymentForm';
import DataTable from '@/components/ui/DataTable';
import {
  buildBillingPatientSummary,
  calcBillingServicesGrandTotal,
} from '@/data/mock-billing-visit-services';
import {
  buildBillingPaymentServiceTableRows,
  calcBillingAdvancePaymentTotal,
  calcBillingPanelPaymentTotal,
  calcBillingServiceDiscountTotal,
  MOCK_BILLING_ADVANCE_PAYMENTS,
  MOCK_BILLING_PANEL_PAYMENTS,
} from '@/data/mock-billing-payment';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { BILLING_PAYMENT_HISTORY_TABLE_SCROLL_Y } from '@/lib/table-scroll';

const controlClass = FIELD_CONTROL_CLASS;

function formatTableAmount(value) {
  return Number(value ?? 0).toLocaleString('en-PK');
}

export default function BillingVisitPaymentView({ visit, serviceRows = [] }) {
  const { message } = App.useApp();
  const patient = useMemo(() => buildBillingPatientSummary(visit), [visit]);

  const [selectedPaymentServiceIds, setSelectedPaymentServiceIds] = useState([]);
  const [rowEdits, setRowEdits] = useState({});

  const paymentTableRows = useMemo(
    () => buildBillingPaymentServiceTableRows(serviceRows),
    [serviceRows],
  );

  useEffect(() => {
    const availableIds = paymentTableRows.map((row) => row.serviceId).filter(Boolean);

    setRowEdits(
      Object.fromEntries(
        paymentTableRows.map((row) => [
          row.id,
          {
            companyAmount: row.companyAmount ?? 0,
            patientAmount: row.patientAmount ?? 0,
          },
        ]),
      ),
    );

    setSelectedPaymentServiceIds((prev) => {
      if (prev.length === 0) {
        return availableIds;
      }

      return prev.filter((id) => availableIds.includes(id));
    });
  }, [paymentTableRows]);

  const payableRows = useMemo(
    () => serviceRows.filter((row) => selectedPaymentServiceIds.includes(row.serviceId)),
    [serviceRows, selectedPaymentServiceIds],
  );

  const grandTotal = useMemo(
    () => calcBillingServicesGrandTotal(payableRows),
    [payableRows],
  );

  const totalDiscount = useMemo(
    () => calcBillingServiceDiscountTotal(payableRows),
    [payableRows],
  );

  const netPayable = grandTotal;
  const advancePayments = MOCK_BILLING_ADVANCE_PAYMENTS;
  const panelPayments = MOCK_BILLING_PANEL_PAYMENTS;
  const advancePaymentTotal = useMemo(
    () => calcBillingAdvancePaymentTotal(advancePayments),
    [advancePayments],
  );
  const panelPaymentTotal = useMemo(
    () => calcBillingPanelPaymentTotal(panelPayments),
    [panelPayments],
  );

  const selectedServiceSet = useMemo(
    () => new Set(selectedPaymentServiceIds),
    [selectedPaymentServiceIds],
  );

  const getRowCompanyAmount = useCallback(
    (record) => rowEdits[record.id]?.companyAmount ?? record.companyAmount ?? 0,
    [rowEdits],
  );

  const getRowPatientAmount = useCallback(
    (record) => rowEdits[record.id]?.patientAmount ?? record.patientAmount ?? 0,
    [rowEdits],
  );

  const toggleServiceSelection = useCallback((serviceId, checked) => {
    setSelectedPaymentServiceIds((prev) => {
      if (checked) {
        return prev.includes(serviceId) ? prev : [...prev, serviceId];
      }

      return prev.filter((id) => id !== serviceId);
    });
  }, []);

  const handleReceivePayment = useCallback(() => {
    if (!selectedPaymentServiceIds.length) {
      message.error('Select at least one service for payment.');
      return;
    }

    message.success('Payment received successfully.');
  }, [message, selectedPaymentServiceIds.length]);

  const handleForwardVoucherToLab = useCallback(() => {
    if (!selectedPaymentServiceIds.length) {
      message.error('Select at least one service.');
      return;
    }

    message.success('Voucher forwarded to LAB.');
  }, [message, selectedPaymentServiceIds.length]);

  const paymentTableColumns = useMemo(
    () => [
      {
        title: '',
        key: 'select',
        width: 44,
        align: 'center',
        render: (_, record) => (
          <Checkbox
            checked={selectedServiceSet.has(record.serviceId)}
            onChange={(event) => toggleServiceSelection(record.serviceId, event.target.checked)}
          />
        ),
      },
      {
        title: 'Service',
        dataIndex: 'serviceName',
        key: 'serviceName',
        width: 260,
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        width: 56,
        align: 'center',
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 96,
        align: 'right',
        render: (value) => formatTableAmount(value),
      },
      {
        title: 'System Discount',
        dataIndex: 'systemDiscount',
        key: 'systemDiscount',
        width: 118,
        align: 'right',
        render: (value) => formatTableAmount(value),
      },
      {
        title: 'Manual Discount',
        dataIndex: 'manualDiscount',
        key: 'manualDiscount',
        width: 118,
        align: 'right',
        render: (value) => formatTableAmount(value),
      },
      {
        title: 'Company',
        key: 'companyAmount',
        width: 110,
        align: 'right',
        render: (_, record) => (
          <InputNumber
            className={`billing-payment-table-input w-full ${controlClass}`}
            controls={false}
            min={0}
            value={getRowCompanyAmount(record)}
            disabled
          />
        ),
      },
      {
        title: 'Patient',
        key: 'patientAmount',
        width: 110,
        align: 'right',
        render: (_, record) => (
          <InputNumber
            className={`billing-payment-table-input w-full ${controlClass}`}
            controls={false}
            min={0}
            value={getRowPatientAmount(record)}
            disabled
          />
        ),
      },
    ],
    [getRowCompanyAmount, getRowPatientAmount, selectedServiceSet, toggleServiceSelection],
  );

  return (
    <div className="billing-visit-payment-page">
      <Collapse
        bordered={false}
        className="billing-patient-info-collapse"
        defaultActiveKey={[]}
        expandIconPlacement="end"
        expandIcon={({ isActive }) =>
          isActive ? (
            <UpOutlined className="billing-patient-info-collapse-arrow" aria-hidden />
          ) : (
            <DownOutlined className="billing-patient-info-collapse-arrow" aria-hidden />
          )
        }
        items={[
          {
            key: 'patient-info',
            label: (
              <span className="billing-patient-info-collapse-label">
                <span className="billing-patient-info-collapse-title">Patient Info</span>
              </span>
            ),
            children: <PatientInfoHeaderCard patient={patient} />,
          },
        ]}
      />

      <section className="billing-payment-services-bar" aria-label="Visit services for payment">
        <Button
          className="billing-payment-lab-voucher-btn"
          onClick={handleForwardVoucherToLab}
          disabled={!serviceRows.length}
        >
          Built voucher forward to LAB
        </Button>
      </section>

      <section className="billing-payment-services-table-section" aria-label="Payment services">
        <DataTable
          className="data-table--billing-payment-services"
          wrapClassName="billing-payment-services-table-wrap"
          columns={paymentTableColumns}
          dataSource={paymentTableRows}
          rowKey="id"
          columnAlign="left"
          tableLayout="fixed"
          pagination={false}
          scroll={{ x: false, y: BILLING_PAYMENT_HISTORY_TABLE_SCROLL_Y }}
          locale={{ emptyText: 'No services for this visit' }}
        />
      </section>

      <div className="billing-payment-form-wrap">
        <BillingPaymentForm
          totalDiscount={totalDiscount}
          netPayable={netPayable}
          advancePayments={advancePayments}
          advancePaymentTotal={advancePaymentTotal}
          panelPayments={panelPayments}
          panelPaymentTotal={panelPaymentTotal}
          onReceivePayment={handleReceivePayment}
        />
      </div>
    </div>
  );
}
