'use client';

import { useMemo } from 'react';
import { App, Button, Form } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import DynamicForm from '@/components/form/DynamicForm';
import { useGetActiveEmployeesQuery } from '@/features/human-resource/api/employeeApi';
import {
  SUSPENSION_DEFAULT_ROW,
  getSuspensionFields,
} from './employee-suspension-fields';

export default function EmployeeSuspensionTab() {
  const { message } = App.useApp();
  const { data: employees = [] } = useGetActiveEmployeesQuery();
  const form = Form.useFormInstance();
  const allRows = Form.useWatch('suspensions', form) ?? [];

  const employeeOptions = useMemo(
    () =>
      employees.map((emp) => ({
        label: [emp.firstName, emp.middleName, emp.lastName].filter(Boolean).join(' '),
        value: emp.id,
      })),
    [employees],
  );

  return (
    <Form.List name="suspensions">
      {(listFields, { add, remove }) => {
        const handleAdd = () => {
          const last = allRows[allRows.length - 1];
          if (last && (!last.fromDate || !last.toDate)) {
            message.warning('Please fill From Date and To Date before adding a new record.');
            return;
          }
          add(SUSPENSION_DEFAULT_ROW);
        };

        return (
          <div className="employee-entry-list-tab">
            {listFields.length === 0 && (
              <p className="employee-entry-list-empty">No record added yet.</p>
            )}
            {listFields.map((field, index) => (
              <div key={field.key} className="employee-entry-list-row">
                <div className="employee-entry-list-row-header">
                  <span className="employee-entry-list-row-title">Record {index + 1}</span>
                  <button
                    type="button"
                    className="employee-entry-list-remove-btn"
                    onClick={() => remove(field.name)}
                    aria-label={`Remove record ${index + 1}`}
                  >
                    <DeleteOutlined />
                  </button>
                </div>
                <DynamicForm
                  gutter={[14, 12]}
                  className="patient-reg-section-grid employee-entry-section-grid"
                  fields={getSuspensionFields(field.name, { form, employeeOptions, allRows })}
                />
              </div>
            ))}

            <Button
              type="dashed"
              className="employee-entry-list-add-btn"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Add Suspension
            </Button>
          </div>
        );
      }}
    </Form.List>
  );
}
