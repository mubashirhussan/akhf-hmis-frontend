'use client';

import { useState } from 'react';
import { Form, Input, Select, Button, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import FormGrid from '@/components/ui/FormGrid';
import FormFloatingField from '@/components/ui/FormFloatingField';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

const DOCUMENT_TYPE_OPTIONS = [
  { value: 'cnic', label: 'CNIC' },
  { value: 'passport', label: 'Passport' },
  { value: 'degree', label: 'Degree' },
  { value: 'contract', label: 'Contract' },
  { value: 'other', label: 'Other' },
];

const getLabel = (options, value) => options.find((o) => o.value === value)?.label || value || '—';

const tableColumns = [
  { title: 'Document Type', key: 'documentType', width: 130, render: (_, r) => getLabel(DOCUMENT_TYPE_OPTIONS, r.documentType) },
  { title: 'Document Name', dataIndex: 'documentName', key: 'documentName', width: 150 },
  { title: 'Attached File', key: 'documentFileName', width: 150, render: (_, r) => r.documentFileName || '—' },
  { title: 'Remarks', dataIndex: 'remarks', key: 'remarks', width: 180 },
];

const DEFAULT_ROW = { documentType: null, documentName: '', documentFileName: null, remarks: '' };

export default function EmployeeDocumentsTab() {
  const form = Form.useFormInstance();
  const allRows = Form.useWatch('documents', form) ?? [];
  const [fileLists, setFileLists] = useState({});

  const handleFileChange = (fieldName, { fileList: newList }) => {
    const safe = (newList || []).slice(-1).map((f) => ({ uid: f.uid, name: f.name, status: f.status ?? 'done' }));
    setFileLists((prev) => ({ ...prev, [fieldName]: safe }));
    form.setFieldValue(['documents', fieldName, 'documentFileName'], safe[0]?.name ?? null);
  };

  return (
    <Form.List name="documents">
      {(listFields, { add, remove }) => (
        <div className="employee-entry-list-tab">
          {listFields.length === 0 && (
            <p className="employee-entry-list-empty">No records added yet.</p>
          )}
          {listFields.map((field, index) => (
            <div key={field.key} className="employee-entry-list-row">
              <div className="employee-entry-list-row-header">
                <span className="employee-entry-list-row-title">Record {index + 1}</span>
                <button type="button" className="employee-entry-list-remove-btn"
                  onClick={() => {
                    remove(field.name);
                    setFileLists((prev) => { const n = { ...prev }; delete n[field.name]; return n; });
                  }}>
                  <DeleteOutlined />
                </button>
              </div>
              <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
                <FormFloatingField name={[field.name, 'documentType']} label="Document Type" required rules={[{ required: true, message: 'Document type is required' }]}>
                  <Select className={controlClass} options={DOCUMENT_TYPE_OPTIONS} allowClear />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'documentName']} label="Document Name" required rules={[{ required: true, whitespace: true, message: 'Document name is required' }]}>
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'documentFileName']} label="Attach Document" required rules={[{ required: true, message: 'Please attach a document' }]}>
                  <div className="employee-entry-upload-slot">
                    <Upload accept=".pdf,.doc,.docx,image/*" beforeUpload={() => false} maxCount={1}
                      fileList={fileLists[field.name] ?? []}
                      onChange={(info) => handleFileChange(field.name, info)}>
                      <Button icon={<UploadOutlined />} className={controlClass}>Choose File</Button>
                    </Upload>
                  </div>
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'remarks']} label="Remarks">
                  <Input className={controlClass} />
                </FormFloatingField>
              </FormGrid>
            </div>
          ))}
          <Button type="dashed" className="employee-entry-list-add-btn" icon={<PlusOutlined />} onClick={() => add(DEFAULT_ROW)}>
            Add Document
          </Button>
        </div>
      )}
    </Form.List>
  );
}