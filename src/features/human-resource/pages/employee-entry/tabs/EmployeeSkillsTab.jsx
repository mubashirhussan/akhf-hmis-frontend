'use client';

import { Button, Form } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import DynamicForm from '@/components/form/DynamicForm';
import { SKILL_DEFAULT_ROW, getSkillFields } from './employee-skills-fields';

export default function EmployeeSkillsTab() {
  return (
    <Form.List name="skills">
      {(listFields, { add, remove }) => (
        <div className="employee-entry-list-tab">
          {listFields.length === 0 && (
            <p className="employee-entry-list-empty">No records added yet.</p>
          )}
          {listFields.map((field, index) => (
            <div key={field.key} className="employee-entry-list-row">
              <div className="employee-entry-list-row-header">
                <span className="employee-entry-list-row-title">Record {index + 1}</span>
                <button
                  type="button"
                  className="employee-entry-list-remove-btn"
                  onClick={() => remove(field.name)}
                >
                  <DeleteOutlined />
                </button>
              </div>
              <DynamicForm
                fields={getSkillFields(field.name)}
                gutter={[14, 12]}
                className="patient-reg-section-grid employee-entry-section-grid"
              />
            </div>
          ))}
          <Button
            type="dashed"
            className="employee-entry-list-add-btn"
            icon={<PlusOutlined />}
            onClick={() => add(SKILL_DEFAULT_ROW)}
          >
            Add Skill
          </Button>
        </div>
      )}
    </Form.List>
  );
}
