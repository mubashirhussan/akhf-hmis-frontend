'use client';

import { Form, Input, Select, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import FormGrid from '@/components/ui/FormGrid';
import FormFloatingField from '@/components/ui/FormFloatingField';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

const QUALIFICATION_OPTIONS = [
  { label: 'Medical', value: 'medical' },
  { label: 'Dentist', value: 'dentist' },
  { label: 'Computer Science', value: 'computer_science' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Pharmacy', value: 'pharmacy' },
  { label: 'Nursing', value: 'nursing' },
  { label: 'Arts', value: 'arts' },
];

const DEGREE_PROGRAM_OPTIONS = [
  { label: 'Matric', value: 'matric' },
  { label: 'I Proof', value: 'i_proof' },
  { label: 'II Proof', value: 'ii_proof' },
  { label: 'III Proof', value: 'iii_proof' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Bachelor', value: 'bachelor' },
  { label: 'Master', value: 'master' },
  { label: 'PhD', value: 'phd' },
];

const GRADE_OPTIONS = [
  { label: 'A+', value: 'a_plus' },
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c' },
  { label: 'D', value: 'd' },
  { label: 'E', value: 'e' },
  { label: 'F', value: 'f' },
];

const ATTEMPTS_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ label: String(n), value: n }));
const DISTINCTION_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const getLabel = (options, value) => options.find((o) => o.value === value)?.label || value || '—';

const tableColumns = [
  { title: 'Qualification', key: 'qualification', width: 130, render: (_, r) => getLabel(QUALIFICATION_OPTIONS, r.qualification) },
  { title: 'Degree Program', key: 'degreeProgram', width: 130, render: (_, r) => getLabel(DEGREE_PROGRAM_OPTIONS, r.degreeProgram) },
  { title: 'Majors', dataIndex: 'majors', key: 'majors', width: 120 },
  { title: 'Institute', dataIndex: 'instituteName', key: 'instituteName', width: 150 },
  { title: 'From', dataIndex: 'dateFrom', key: 'dateFrom', width: 110 },
  { title: 'To', dataIndex: 'dateTo', key: 'dateTo', width: 110 },
  { title: 'Grade', key: 'grade', width: 80, render: (_, r) => getLabel(GRADE_OPTIONS, r.grade) },
  { title: 'CGPA', dataIndex: 'cgpa', key: 'cgpa', width: 80 },
  { title: 'Obtained', dataIndex: 'obtainedMarks', key: 'obtainedMarks', width: 90 },
  { title: 'Total', dataIndex: 'totalMarks', key: 'totalMarks', width: 80 },
  { title: '%', dataIndex: 'percentage', key: 'percentage', width: 70 },
  { title: 'Attempts', key: 'attempts', width: 90, render: (_, r) => r.attempts ?? '—' },
  { title: 'Distinction', key: 'distinction', width: 100, render: (_, r) => getLabel(DISTINCTION_OPTIONS, r.distinction) },
  { title: 'Verified By', dataIndex: 'degreeVerifiedBy', key: 'degreeVerifiedBy', width: 120 },
  { title: 'Status', dataIndex: 'verificationStatus', key: 'verificationStatus', width: 110 },
];

const DEFAULT_ROW = {
  qualification: null, degreeProgram: null, majors: '', instituteName: '',
  dateFrom: '', dateTo: '', grade: null, cgpa: '', obtainedMarks: '',
  totalMarks: '', percentage: '', attempts: null, distinction: null,
  degreeVerifiedBy: '', verificationSentDate: '', verificationReceivedDate: '',
  verificationStatus: '', remarks: '',
};

export default function EmployeeEducationTab() {
  const form = Form.useFormInstance();
  const allRows = Form.useWatch('educations', form) ?? [];

  return (
    <Form.List name="educations">
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
                <FormFloatingField name={[field.name, 'qualification']} label="Qualification" required rules={[{ required: true, message: 'Qualification is required' }]}>
                  <Select className={controlClass} options={QUALIFICATION_OPTIONS} allowClear />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'degreeProgram']} label="Degree Program" required rules={[{ required: true, message: 'Degree program is required' }]}>
                  <Select className={controlClass} options={DEGREE_PROGRAM_OPTIONS} allowClear />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'majors']} label="Majors" required rules={[{ required: true, whitespace: true, message: 'Majors is required' }]}>
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'instituteName']} label="Institute Name">
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'dateFrom']} label="Date From">
                  <Input className={controlClass} type="date" />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'dateTo']} label="Date To">
                  <Input className={controlClass} type="date" />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'grade']} label="Grade">
                  <Select className={controlClass} options={GRADE_OPTIONS} allowClear />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'cgpa']} label="CGPA">
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'obtainedMarks']} label="Obtained Marks">
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'totalMarks']} label="Total Marks">
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'percentage']} label="Percentage">
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'attempts']} label="No. of Attempts">
                  <Select className={controlClass} options={ATTEMPTS_OPTIONS} allowClear />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'distinction']} label="Distinction">
                  <Select className={controlClass} options={DISTINCTION_OPTIONS} allowClear />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'degreeVerifiedBy']} label="Degree Verified By">
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'verificationSentDate']} label="Verification Sent Date">
                  <Input className={controlClass} type="date" />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'verificationReceivedDate']} label="Verification Received Date">
                  <Input className={controlClass} type="date" />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'verificationStatus']} label="Verification Status">
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'remarks']} label="Remarks">
                  <Input className={controlClass} />
                </FormFloatingField>
              </FormGrid>
            </div>
          ))}
          <Button type="dashed" className="employee-entry-list-add-btn" icon={<PlusOutlined />} onClick={() => add(DEFAULT_ROW)}>
            Add Education
          </Button>
        </div>
      )}
    </Form.List>
  );
}