'use client';

import { Button, Form, Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import FormGrid from '@/components/ui/FormGrid';
import FormFloatingField from '@/components/ui/FormFloatingField';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

const tableColumns = [
  { title: 'Certificate Name', dataIndex: 'certificateName', key: 'certificateName', width: 160 },
  { title: 'Recommended Institute', dataIndex: 'recommendedInstitute', key: 'recommendedInstitute', width: 180 },
  { title: 'Recommended By', dataIndex: 'recommendedBy', key: 'recommendedBy', width: 150 },
  { title: 'Recommend Date', dataIndex: 'recommendDate', key: 'recommendDate', width: 130 },
  { title: 'Recommended Till', dataIndex: 'recommendedTill', key: 'recommendedTill', width: 130 },
  { title: 'Remarks', dataIndex: 'remarks', key: 'remarks', width: 160 },
];

export default function EmployeeAcImprovementTab() {
  const form = Form.useFormInstance();
  const allRows = Form.useWatch('acImprovements', form) ?? [];

  return (
    <Form.List name="acImprovements">
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
              <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
                <FormFloatingField
                  name={[field.name, 'certificateName']}
                  label="Certificate Name"
                  required
                  rules={[{ required: true, whitespace: true, message: 'Certificate name is required' }]}
                >
                  <Input className={controlClass} />
                </FormFloatingField>

                <FormFloatingField name={[field.name, 'recommendedInstitute']} label="Recommended Institute">
                  <Input className={controlClass} />
                </FormFloatingField>

                <FormFloatingField name={[field.name, 'recommendedBy']} label="Recommended By">
                  <Input className={controlClass} />
                </FormFloatingField>

                <FormFloatingField name={[field.name, 'recommendDate']} label="Recommend Date">
                  <Input className={controlClass} type="date" />
                </FormFloatingField>

                <FormFloatingField name={[field.name, 'recommendedTill']} label="Recommended Till">
                  <Input className={controlClass} type="date" />
                </FormFloatingField>

                <FormFloatingField name={[field.name, 'remarks']} label="Remarks" col="full">
                  <Input.TextArea className={controlClass} rows={2} />
                </FormFloatingField>
              </FormGrid>
            </div>
          ))}

          <Button
            type="dashed"
            className="employee-entry-list-add-btn"
            icon={<PlusOutlined />}
            onClick={() => add({ certificateName: '', recommendedInstitute: '', recommendedBy: '', recommendDate: '', recommendedTill: '', remarks: '' })}
          >
            Add Academic Improvement
          </Button>

        </div>
      )}
    </Form.List>
  );
}