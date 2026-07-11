'use client';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import DynamicForm from '@/components/form/DynamicForm';

export default function EmployeeEntryListTab({
  name,
  addLabel,
  defaultRow = {},
  fields,
  maxRows,
}) {
  return (
    <Form.List name={name}>
      {(listFields, { add, remove }) => (
        <div className="employee-entry-list-tab">
          {listFields.length === 0 ? (
            <p className="employee-entry-list-empty">No records added yet.</p>
          ) : (
            listFields.map((field, index) => (
              <div key={field.key} className="employee-entry-list-row">
                <div className="employee-entry-list-row-header">
                  <span className="employee-entry-list-row-title">
                    {maxRows === 1 ? 'Record' : `Record ${index + 1}`}
                  </span>
                  {!maxRows && (
                    <button
                      type="button"
                      className="employee-entry-list-remove-btn"
                      onClick={() => remove(field.name)}
                      aria-label={`Remove record ${index + 1}`}
                    >
                      <DeleteOutlined />
                    </button>
                  )}
                </div>
                <DynamicForm
                  gutter={[14, 12]}
                  className="patient-reg-section-grid employee-entry-section-grid"
                  fields={fields.map((item) => ({
                    ...item,
                    floating: item.floating ?? true,
                    span: item.span ?? (item.col === 'full' ? 24 : 6),
                    name: [field.name, item.name],
                  }))}
                />
              </div>
            ))
          )}

          {(!maxRows || listFields.length < maxRows) && (
            <Button
              type="dashed"
              className="employee-entry-list-add-btn"
              icon={<PlusOutlined />}
              onClick={() => add(defaultRow)}
            >
              {addLabel}
            </Button>
          )}
        </div>
      )}
    </Form.List>
  );
}
