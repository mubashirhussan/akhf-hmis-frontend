'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Checkbox, Input, Select } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import FloatingField from '@/components/ui/FloatingField';
import ChangeStatusModal, {
  DELIVERED_REPORTS_STATUS_OPTIONS,
} from '@/features/laboratory/pages/result-entry/ChangeStatusModal';
import { useUpdateLaboratoryWorklistStatusMutation } from '@/features/laboratory/api/laboratoryEndpoints';
import FormGrid from '@/components/ui/FormGrid';
import DataTable from '@/components/ui/DataTable';
import {
  createDeliveredDeliveryForm,
  getDeliveredReportLineItems,
  DELIVERED_DELIVER_RELATION_OPTIONS,
} from '@/features/laboratory/api/mock-delivered-reports';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import './delivered-report-delivery.css';

const controlClass = FIELD_CONTROL_CLASS;

function PaymentStatusBadge({ label, tone = 'pending' }) {
  return (
    <span className={`delivered-report-payment-status delivered-report-payment-status--${tone}`}>
      {label}
    </span>
  );
}

export default function DeliveredReportDeliveryView({ record }) {
  const { message } = App.useApp();
  const [updateWorklistStatus] = useUpdateLaboratoryWorklistStatusMutation();

  const lineItems = useMemo(() => getDeliveredReportLineItems(record), [record]);
  const [selectedLineItemIds, setSelectedLineItemIds] = useState([]);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState(() => createDeliveredDeliveryForm(record));

  const selectedLineItemSet = useMemo(
    () => new Set(selectedLineItemIds),
    [selectedLineItemIds],
  );

  const patchDeliveryForm = useCallback((patch) => {
    setDeliveryForm((prev) => ({ ...prev, ...patch }));
  }, []);

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
        DELIVERED_REPORTS_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
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
    if (!deliveryForm.deliverFirstName.trim() || !deliveryForm.deliverLastName.trim()) {
      message.error('Enter first and last name in Reports Deliver To.');
      return;
    }

    message.success(`Report delivery saved for ${record.patientName} (Lab #${record.labNo}).`);
  }, [deliveryForm.deliverFirstName, deliveryForm.deliverLastName, message, record.labNo, record.patientName]);

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
    <div className="services-billing-page delivered-report-delivery-page">
      <section className="delivered-report-deliver-section" aria-label="Reports deliver to">
        <h2 className="delivered-report-deliver-section-title">Reports Deliver To</h2>
        <div className="delivered-report-deliver-form">
          <FormGrid columns={4} className="delivered-report-deliver-grid">
            <FloatingField label="First Name" htmlFor="delivered-deliver-first-name">
              <Input
                id="delivered-deliver-first-name"
                className={controlClass}
                value={deliveryForm.deliverFirstName}
                onChange={(event) => patchDeliveryForm({ deliverFirstName: event.target.value })}
              />
            </FloatingField>
            <FloatingField label="Last Name" htmlFor="delivered-deliver-last-name">
              <Input
                id="delivered-deliver-last-name"
                className={controlClass}
                value={deliveryForm.deliverLastName}
                onChange={(event) => patchDeliveryForm({ deliverLastName: event.target.value })}
              />
            </FloatingField>
            <FloatingField label="Description" htmlFor="delivered-relation-description" col={2}>
              <Input
                id="delivered-relation-description"
                className={controlClass}
                value={deliveryForm.description}
                onChange={(event) => patchDeliveryForm({ description: event.target.value })}
              />
            </FloatingField>
          </FormGrid>

          <FormGrid columns={4} className="delivered-report-deliver-grid">
            <FloatingField label="Relation" htmlFor="delivered-deliver-relation">
              <Select
                id="delivered-deliver-relation"
                className={controlClass}
                value={deliveryForm.deliverRelation}
                options={DELIVERED_DELIVER_RELATION_OPTIONS}
                onChange={(value) => patchDeliveryForm({ deliverRelation: value })}
              />
            </FloatingField>
            <FloatingField label="First Name" htmlFor="delivered-relation-first-name">
              <Input
                id="delivered-relation-first-name"
                className={controlClass}
                value={deliveryForm.relationFirstName}
                onChange={(event) => patchDeliveryForm({ relationFirstName: event.target.value })}
              />
            </FloatingField>
            <FloatingField label="Last Name" htmlFor="delivered-relation-last-name">
              <Input
                id="delivered-relation-last-name"
                className={controlClass}
                value={deliveryForm.relationLastName}
                onChange={(event) => patchDeliveryForm({ relationLastName: event.target.value })}
              />
            </FloatingField>
            <FloatingField label="CNIC #" htmlFor="delivered-relation-cnic">
              <Input
                id="delivered-relation-cnic"
                className={controlClass}
                value={deliveryForm.cnic}
                onChange={(event) => patchDeliveryForm({ cnic: event.target.value })}
              />
            </FloatingField>
          </FormGrid>

          <div className="delivered-report-deliver-form-actions">
            <Button
              type="primary"
              className="delivered-report-deliver-save-btn"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </section>

      <div className="delivered-report-delivery-toolbar">
        <Button
          type="primary"
          className="delivered-report-toolbar-btn"
          disabled={!hasSelectedLineItems}
          icon={<AppIcon icon="mdi:swap-horizontal" className="h-4 w-4" />}
          onClick={handleOpenChangeStatus}
        >
          Change Status
        </Button>
        <Button
          type="primary"
          className="delivered-report-toolbar-btn"
          disabled={!hasSelectedLineItems}
          onClick={handleViewReport}
        >
          View Report
        </Button>
        <Button
          type="primary"
          className="delivered-report-toolbar-btn"
          disabled={!hasSelectedLineItems}
          onClick={handleSendEmail}
        >
          Send Email
        </Button>
      </div>

      <section className="delivered-report-delivery-table-card" aria-label="Delivered report tests">
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
        options={DELIVERED_REPORTS_STATUS_OPTIONS}
        onConfirm={handleChangeStatus}
      />
    </div>
  );
}
