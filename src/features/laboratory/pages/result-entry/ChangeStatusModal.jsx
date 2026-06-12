'use client';

import { useEffect, useState } from 'react';
import { App, Button } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import AppModal from '@/components/ui/AppModal';

const COLLECTION_OPTION = {
  value: 'sample-collection',
  label: 'Collection',
  description: 'Return sample to collection queue',
  icon: 'mdi:test-tube',
};

const RECEIVING_OPTION = {
  value: 'sample-receiving',
  label: 'Receiving',
  description: 'Forward sample to receiving desk',
  icon: 'mdi:package-variant-closed',
};

const RESULT_ENTRY_OPTION = {
  value: 'result-entry',
  label: 'Result Entry',
  description: 'Send back to result entry queue',
  icon: 'mdi:clipboard-edit-outline',
};

const TEST_CONDUCTED_OPTION = {
  value: 'test-conducted',
  label: 'Test Conduct',
  description: 'Send to test conducted queue',
  icon: 'mdi:flask-outline',
};

export const RESULT_ENTRY_STATUS_OPTIONS = [COLLECTION_OPTION, RECEIVING_OPTION];

export const TEST_CONDUCTED_STATUS_OPTIONS = [
  COLLECTION_OPTION,
  RECEIVING_OPTION,
  RESULT_ENTRY_OPTION,
];

const UNDELIVERED_REPORTS_OPTION = {
  value: 'undelivered-reports',
  label: 'Undelivered Reports',
  description: 'Send back to undelivered reports queue',
  icon: 'mdi:email-alert-outline',
};

export const UNDELIVERED_REPORTS_STATUS_OPTIONS = [
  COLLECTION_OPTION,
  RECEIVING_OPTION,
  RESULT_ENTRY_OPTION,
  TEST_CONDUCTED_OPTION,
];

export const DELIVERED_REPORTS_STATUS_OPTIONS = [
  COLLECTION_OPTION,
  RECEIVING_OPTION,
  RESULT_ENTRY_OPTION,
  TEST_CONDUCTED_OPTION,
  UNDELIVERED_REPORTS_OPTION,
];

export default function ChangeStatusModal({
  open,
  onClose,
  patientName,
  labNo,
  onConfirm,
  options = RESULT_ENTRY_STATUS_OPTIONS,
}) {
  const { message } = App.useApp();
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (!open) return;
    setSelectedStatus('');
  }, [open]);

  const handleConfirm = () => {
    if (!selectedStatus) {
      message.warning('Select a destination to continue.');
      return;
    }

    onConfirm(selectedStatus);
    onClose();
  };

  const subtitle =
    patientName && labNo
      ? `${patientName} · Lab #${labNo}`
      : patientName || (labNo ? `Lab #${labNo}` : '');

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Change Status"
      // subtitle={subtitle}
      icon="mdi:swap-horizontal"
      width={480}
      className="result-entry-change-status-modal"
      rootClassName="result-entry-change-status-modal-root"
      bodyClassName="result-entry-change-status-modal-body"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" disabled={!selectedStatus} onClick={handleConfirm}>
            Send
          </Button>
        </>
      }
    >
      <p className="result-entry-change-status-hint">
        Choose where to send this record. Only one destination can be selected.
      </p>

      <div className="result-entry-change-status-options" role="radiogroup" aria-label="Status">
        {options.map((option) => {
          const isSelected = selectedStatus === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={[
                'result-entry-change-status-option',
                isSelected ? 'result-entry-change-status-option--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setSelectedStatus(option.value)}
            >
              <span className="result-entry-change-status-option-icon-wrap" aria-hidden>
                <AppIcon icon={option.icon} className="result-entry-change-status-option-icon" />
              </span>
              <span className="result-entry-change-status-option-content">
                <span className="result-entry-change-status-option-label">{option.label}</span>
                <span className="result-entry-change-status-option-desc">{option.description}</span>
              </span>
              <span
                className={[
                  'result-entry-change-status-option-check',
                  isSelected ? 'result-entry-change-status-option-check--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden
              >
                {isSelected ? <AppIcon icon="mdi:check" className="h-3.5 w-3.5" /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </AppModal>
  );
}
