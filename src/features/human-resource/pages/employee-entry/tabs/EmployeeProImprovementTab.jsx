'use client';

import { Button, Form } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import DynamicForm from '@/components/form/DynamicForm';
import {
  PRO_IMPROVEMENT_DEFAULT_ROW,
  getProImprovementFields,
} from './employee-pro-improvement-fields';

export default function EmployeeProImprovementTab() {
  return (
    <Form.List name="proImprovements">
      {(listFields, { add, remove }) => (
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
                fields={getProImprovementFields(field.name)}
                gutter={[14, 12]}
                className="patient-reg-section-grid employee-entry-section-grid"
              />
            </div>
          ))}

          <Button
            type="dashed"
            className="employee-entry-list-add-btn"
            icon={<PlusOutlined />}
            onClick={() => add(PRO_IMPROVEMENT_DEFAULT_ROW)}
          >
            Add Professional Improvement
          </Button>
        </div>
      )}
    </Form.List>
  );
}
