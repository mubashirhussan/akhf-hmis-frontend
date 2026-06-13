'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { App, Button, Input } from 'antd';
import AppModal from '@/components/ui/AppModal';
import FormField from '@/components/ui/FormField';
import { createEmptyConversionRateForm } from '@/features/admin-pathology/api/mock-pathology-conversion-rate';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function ConversionRateModal({ open, onClose, defaultUnit = '' }) {
  const { message } = App.useApp();
  const conversionRateRef = useRef(null);

  const [form, setForm] = useState(createEmptyConversionRateForm(defaultUnit));
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setForm(createEmptyConversionRateForm(defaultUnit));
    setFieldErrors({});
  }, [defaultUnit, open]);

  const patchForm = useCallback((patch) => {
    setForm((current) => ({ ...current, ...patch }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const handleSave = useCallback(() => {
    const unit = form.unit.trim();
    const conversionRate = form.conversionRate.trim();

    if (!unit) {
      setFieldErrors({ unit: 'Unit is required.' });
      return;
    }

    if (!conversionRate) {
      setFieldErrors({ conversionRate: 'Conversion Rate is required.' });
      conversionRateRef.current?.focus({ preventScroll: false });
      return;
    }

    setFieldErrors({});
    message.success('Conversion rate saved.');
    onClose();
  }, [form.conversionRate, form.unit, message, onClose]);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Add Conversion Rate"
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={560}
      className="pathology-conversion-rate-modal"
      rootClassName="pathology-conversion-rate-modal-root"
      footer={null}
    >
      <div className="pathology-conversion-rate-form">
        <FormField label="Unit" required error={fieldErrors.unit}>
          <Input
            id="pathology-conversion-rate-unit"
            className={controlClass}
            value={form.unit}
            placeholder="Null"
            status={fieldErrors.unit ? 'error' : undefined}
            onChange={(event) => {
              patchForm({ unit: event.target.value });
              if (fieldErrors.unit) {
                clearFieldError('unit');
              }
            }}
            autoComplete="off"
          />
        </FormField>

        <FormField label="Conversion Rate" required error={fieldErrors.conversionRate}>
          <Input
            ref={conversionRateRef}
            id="pathology-conversion-rate-value"
            className={controlClass}
            value={form.conversionRate}
            status={fieldErrors.conversionRate ? 'error' : undefined}
            onChange={(event) => {
              patchForm({ conversionRate: event.target.value });
              if (fieldErrors.conversionRate) {
                clearFieldError('conversionRate');
              }
            }}
            autoComplete="off"
          />
        </FormField>

        <div className="pathology-conversion-rate-form-actions">
          <Button type="primary" className="pathology-conversion-rate-save-btn" onClick={handleSave}>
            Save
          </Button>
          <Button className="pathology-conversion-rate-close-btn" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </AppModal>
  );
}
