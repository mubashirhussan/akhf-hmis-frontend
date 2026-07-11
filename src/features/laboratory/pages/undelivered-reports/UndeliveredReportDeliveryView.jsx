'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Checkbox, Form } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DynamicForm from '@/components/form/DynamicForm';
import ChangeStatusModal, {
  UNDELIVERED_REPORTS_STATUS_OPTIONS,
} from '@/features/laboratory/pages/result-entry/ChangeStatusModal';
import { useUpdateLaboratoryWorklistStatusMutation } from '@/features/laboratory/api/laboratoryEndpoints';
import DataTable from '@/components/ui/DataTable';
import {
  createUndeliveredDeliveryForm,
  getUndeliveredReportLineItems,
} from '@/features/laboratory/api/mock-undelivered-reports';
import {
  UNDELIVERED_DELIVERY_RELATION_FIELDS,
  UNDELIVERED_DELIVERY_TOP_FIELDS,
} from '@/features/laboratory/pages/undelivered-reports/undelivered-report-delivery-fields';
import './undelivered-report-delivery.css';

function PaymentStatusBadge({ label, tone = 'pending' }) {
  return (
    <span className={`undelivered-report-payment-status undelivered-report-payment-status--${tone}`}>
      {label}
    </span>
  );
}

export default function UndeliveredReportDeliveryView({ record }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [updateWorklistStatus] = useUpdateLaboratoryWorklistStatusMutation();

  const lineItems = useMemo(() => getUndeliveredReportLineItems(record), [record]);
  const [selectedLineItemIds, setSelectedLineItemIds] = useState([]);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const initialValues = useMemo(() => createUndeliveredDeliveryForm(record), [record]);

  const selectedLineItemSet = useMemo(
    () => new Set(selectedLineItemIds),
    [selectedLineItemIds],
  );

  const toggleLineItemSelection = useCallback((lineItemId, checked) => {
    setSelectedLineItemIds((prev) => {
      if (checked) {
        return prev.includes(lineItemId) ? prev : [...prev, lineItemId];
      }

      return prev.filter((id) => id !== lineItemId);
    });
  }, []);

  const hasSelectedLineItems = selectedLineItemIds.length > 0;
  const allLineItemsSelected =
    lineItems.length > 0 && lineItems.every((row) => selectedLineItemSet.has(row.id));
  const someLineItemsSelected = lineItems.some((row) => selectedLineItemSet.has(row.id));

  const toggleAllLineItems = useCallback(
    (checked) => {
      setSelectedLineItemIds(checked ? lineItems.map((row) => row.id) : []);
    },
    [lineItems],
  );

  const handleSendEmail = useCallback(() => {
    if (!selectedLineItemIds.length) {
      message.error('Select at least one report to send.');
      return;
    }

    message.success(`Email sent for ${record.patientName} (Lab #${record.labNo}).`);
  }, [message, record.labNo, record.patientName, selectedLineItemIds.length]);

  const handleOpenChangeStatus = useCallback(() => {
    if (!selectedLineItemIds.length) {
      message.error('Select at least one report to change status.');
      return;
    }

    setIsChangeStatusModalOpen(true);
  }, [message, selectedLineItemIds.length]);

  const handleChangeStatus = useCallback(
    (status) => {
      void updateWorklistStatus({ recordId: record.id, status });

      const statusLabel =
        UNDELIVERED_REPORTS_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
        status;

      message.success(
        `${selectedLineItemIds.length} report${selectedLineItemIds.length === 1 ? '' : 's'} sent to ${statusLabel} for ${record.patientName} (Lab #${record.labNo}).`,
      );
      setSelectedLineItemIds([]);
    },
    [message, record.id, record.labNo, record.patientName, selectedLineItemIds.length],
  );

  const handleViewReport = useCallback(() => {
    message.success(`Report opened for ${record.patientName} (Lab #${record.labNo}).`);
  }, [message, record.labNo, record.patientName]);

  const handleSave = useCallback(() => {
    const values = form.getFieldsValue();
    if (!String(values.deliverFirstName ?? '').trim() || !String(values.deliverLastName ?? '').trim()) {
      message.error('Enter first and last name in Reports Deliver To.');
      return;
    }

    message.success(`Report delivery saved for ${record.patientName} (Lab #${record.labNo}).`);
  }, [form, message, record.labNo, record.patientName]);

  const columns = useMemo(
    () => [
      {
        key: 'select',
        width: 44,
        align: 'center',
        title: (
          <Checkbox
            checked={allLineItemsSelected}
            indeterminate={someLineItemsSelected && !allLineItemsSelected}
            aria-label="Select all reports"
            onChange={(event) => toggleAllLineItems(event.target.checked)}
          />
        ),
        render: (_, row) => (
          <Checkbox
            checked={selectedLineItemSet.has(row.id)}
            onChange={(event) => toggleLineItemSelection(row.id, event.target.checked)}
          />
        ),
      },
      { title: 'Main_ID', dataIndex: 'mainId', key: 'mainId', width: 90 },
      { title: 'PF-Name', dataIndex: 'pfName', key: 'pfName', width: 110 },
      { title: 'Patient Name', dataIndex: 'patientName', key: 'patientName', width: 150 },
      { title: 'Relation', dataIndex: 'relation', key: 'relation', width: 80 },
      { title: 'Group Name', dataIndex: 'groupName', key: 'groupName', width: 130 },
      { title: 'Booking Date', dataIndex: 'bookingDate', key: 'bookingDate', width: 130 },
      {
        title: 'Payment Status',
        dataIndex: 'paymentStatusLabel',
        key: 'paymentStatus',
        width: 160,
        render: (_, row) => (
          <PaymentStatusBadge label={row.paymentStatusLabel} tone={row.paymentStatusTone} />
        ),
      },
      { title: 'Department', dataIndex: 'department', key: 'department', width: 110 },
      {
        title: 'Test Booking Name',
        dataIndex: 'testBookingName',
        key: 'testBookingName',
        width: 150,
      },
    ],
    [
      allLineItemsSelected,
      selectedLineItemSet,
      someLineItemsSelected,
      toggleAllLineItems,
      toggleLineItemSelection,
    ],
  );

  return (
    <div className="services-billing-page undelivered-report-delivery-page">
      <section className="undelivered-report-deliver-section" aria-label="Reports deliver to">
        <h2 className="undelivered-report-deliver-section-title">Reports Deliver To</h2>
        <div className="undelivered-report-deliver-form">
          <Form form={form} layout="vertical" initialValues={initialValues}>
            <DynamicForm fields={UNDELIVERED_DELIVERY_TOP_FIELDS} gutter={[16, 12]} />
            <DynamicForm fields={UNDELIVERED_DELIVERY_RELATION_FIELDS} gutter={[16, 12]} />
          </Form>

          <div className="undelivered-report-deliver-form-actions">
            <Button
              type="primary"
              className="undelivered-report-deliver-save-btn"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </section>

      <div className="undelivered-report-delivery-toolbar">
        <Button
          type="primary"
          className="undelivered-report-toolbar-btn"
          disabled={!hasSelectedLineItems}
          icon={<AppIcon icon="mdi:swap-horizontal" className="h-4 w-4" />}
          onClick={handleOpenChangeStatus}
        >
          Change Status
        </Button>
        <Button
          type="primary"
          className="undelivered-report-toolbar-btn"
          disabled={!hasSelectedLineItems}
          onClick={handleViewReport}
        >
          View Report
        </Button>
        <Button
          type="primary"
          className="undelivered-report-toolbar-btn"
          disabled={!hasSelectedLineItems}
          onClick={handleSendEmail}
        >
          Send Email
        </Button>
      </div>

      <section className="undelivered-report-delivery-table-card" aria-label="Undelivered report tests">
        <DataTable
          columns={columns}
          dataSource={lineItems}
          rowKey="id"
          columnAlign="left"
          pagination={false}
        />
      </section>

      <ChangeStatusModal
        open={isChangeStatusModalOpen}
        onClose={() => setIsChangeStatusModalOpen(false)}
        patientName={record.patientName}
        labNo={record.labNo}
        options={UNDELIVERED_REPORTS_STATUS_OPTIONS}
        onConfirm={handleChangeStatus}
      />
    </div>
  );
}
