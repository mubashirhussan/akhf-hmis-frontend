'use client';

import { Button } from 'antd';

export default function EmployeeTabActions({
  onClear,
  onSave,
  loading = false,
  saveLabel = 'Save',
  disabled = false,
}) {
  return (
    <div className="patient-registration-actions employee-entry-tab-actions">
      <Button type="link" className="patient-reg-btn-clear" onClick={onClear} disabled={loading}>
        Clear
      </Button>
      <Button
        type="primary"
        className="patient-reg-btn-save"
        onClick={onSave}
        loading={loading}
        disabled={disabled}
      >
        {saveLabel}
      </Button>
    </div>
  );
}
