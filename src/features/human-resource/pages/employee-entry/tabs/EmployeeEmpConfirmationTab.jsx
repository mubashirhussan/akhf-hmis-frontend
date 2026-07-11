'use client';

import { useMemo } from 'react';
import DynamicForm from '@/components/form/DynamicForm';
import { useGetActiveEmployeesQuery } from '@/features/human-resource/api/employeeApi';
import { getEmpConfirmationFields } from './employee-emp-confirmation-fields';

export default function EmployeeEmpConfirmationTab() {
  const { data: employees = [] } = useGetActiveEmployeesQuery();

  const employeeOptions = useMemo(
    () =>
      employees.map((emp) => ({
        label: [emp.firstName, emp.middleName, emp.lastName].filter(Boolean).join(' '),
        value: emp.id,
      })),
    [employees],
  );

  const fields = useMemo(
    () => getEmpConfirmationFields(employeeOptions),
    [employeeOptions],
  );

  return (
    <div className="employee-entry-list-tab">
      <div className="employee-entry-list-row">
        <div className="employee-entry-list-row-header">
          <span className="employee-entry-list-row-title">Record</span>
        </div>
        <DynamicForm
          fields={fields}
          gutter={[14, 12]}
          className="patient-reg-section-grid employee-entry-section-grid"
        />
      </div>
    </div>
  );
}
