'use client';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import FormGrid from '@/components/ui/FormGrid';
import FormFloatingField from '@/components/ui/FormFloatingField';

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
                  <span className="employee-entry-list-row-title">{maxRows === 1 ? 'Record' : `Record ${index + 1}`}</span>
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
                <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
{fields.map((item) => (
                    <FormFloatingField
                      key={item.name}
                      name={[field.name, item.name]}
                      label={item.label}
                      required={item.required}
                      rules={item.rules}
                      col={item.col}
                      valuePropName={item.valuePropName}
                      getValueFromEvent={item.getValueFromEvent}
                    >
                      {item.render()}
                    </FormFloatingField>
                  ))}
                </FormGrid>
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
