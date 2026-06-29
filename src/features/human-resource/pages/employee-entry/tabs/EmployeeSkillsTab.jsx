'use client';

import { Form, Input, Select, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import FormGrid from '@/components/ui/FormGrid';
import FormFloatingField from '@/components/ui/FormFloatingField';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

const PROFICIENCY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const getLabel = (options, value) => options.find((o) => o.value === value)?.label || value || '—';

const tableColumns = [
  { title: 'Skill Name', dataIndex: 'skillName', key: 'skillName', width: 150 },
  { title: 'Proficiency', key: 'proficiency', width: 120, render: (_, r) => getLabel(PROFICIENCY_OPTIONS, r.proficiency) },
  { title: 'Years of Experience', dataIndex: 'yearsOfExperience', key: 'yearsOfExperience', width: 150 },
  { title: 'Remarks', dataIndex: 'remarks', key: 'remarks', width: 180 },
];

const DEFAULT_ROW = { skillName: '', proficiency: 'intermediate', yearsOfExperience: '', remarks: '' };

export default function EmployeeSkillsTab() {
  const form = Form.useFormInstance();
  const allRows = Form.useWatch('skills', form) ?? [];

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
                <button type="button" className="employee-entry-list-remove-btn" onClick={() => remove(field.name)}>
                  <DeleteOutlined />
                </button>
              </div>
              <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
                <FormFloatingField name={[field.name, 'skillName']} label="Skill Name" required rules={[{ required: true, whitespace: true, message: 'Skill name is required' }]}>
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'proficiency']} label="Proficiency">
                  <Select className={controlClass} options={PROFICIENCY_OPTIONS} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'yearsOfExperience']} label="Years Of Experience">
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'remarks']} label="Remarks">
                  <Input className={controlClass} />
                </FormFloatingField>
              </FormGrid>
            </div>
          ))}
          <Button type="dashed" className="employee-entry-list-add-btn" icon={<PlusOutlined />} onClick={() => add(DEFAULT_ROW)}>
            Add Skill
          </Button>
        </div>
      )}
    </Form.List>
  );
}