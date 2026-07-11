'use client';

import DynamicForm from '@/components/form/DynamicForm';
import {
  ADDITIONAL_INFO_DETAIL_FIELDS,
  ADDITIONAL_INFO_LANGUAGE_FIELDS,
} from './employee-additional-info-fields';

export default function EmployeeAdditionalInfoTab() {
  return (
    <div className="employee-entry-list-tab">
      <div className="employee-entry-list-row">
        <div className="employee-entry-list-row-header">
          <span className="employee-entry-list-row-title">Record</span>
        </div>

        <DynamicForm
          fields={ADDITIONAL_INFO_LANGUAGE_FIELDS}
          gutter={[14, 12]}
          className="patient-reg-section-grid employee-entry-section-grid"
        />

        <DynamicForm
          fields={ADDITIONAL_INFO_DETAIL_FIELDS}
          gutter={[14, 12]}
          className="patient-reg-section-grid employee-entry-section-grid employee-additional-info-grid"
        />
      </div>
    </div>
  );
}
