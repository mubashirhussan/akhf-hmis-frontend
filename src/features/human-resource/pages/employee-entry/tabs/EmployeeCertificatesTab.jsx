'use client';

import { useState } from 'react';
import { Form, Input, Select, Button, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import FormGrid from '@/components/ui/FormGrid';
import FormFloatingField from '@/components/ui/FormFloatingField';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

const CERTIFICATION_TYPE_OPTIONS = [
  { label: 'PMDC', value: 'pmdc' },
  { label: 'PNC', value: 'pnc' },
  { label: 'PEC', value: 'pec' },
];

const NEED_RENEWAL_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const getLabel = (options, value) => options.find((o) => o.value === value)?.label || value || '—';

const tableColumns = [
  { title: 'Cert No', dataIndex: 'certificationNo', key: 'certificationNo', width: 110 },
  { title: 'Cert Name', dataIndex: 'certificationName', key: 'certificationName', width: 140 },
  { title: 'Institution', dataIndex: 'institutionName', key: 'institutionName', width: 140 },
  { title: 'Type', key: 'certificationType', width: 90, render: (_, r) => getLabel(CERTIFICATION_TYPE_OPTIONS, r.certificationType) },
  { title: 'From', dataIndex: 'dateFrom', key: 'dateFrom', width: 110 },
  { title: 'To', dataIndex: 'dateTo', key: 'dateTo', width: 110 },
  { title: 'Need Renewal', key: 'needRenewal', width: 110, render: (_, r) => getLabel(NEED_RENEWAL_OPTIONS, r.needRenewal) },
  { title: 'Expiry', dataIndex: 'expiryDate', key: 'expiryDate', width: 110 },
  { title: 'Document', key: 'attachImage', width: 130, render: (_, r) => r.attachImageName || '—' },
];

const DEFAULT_ROW = {
  certificationNo: '', certificationName: '', institutionName: '', detail: '',
  certificationType: null, dateFrom: '', dateTo: '', needRenewal: null,
  expiryDate: '', attachImageName: null,
};

export default function EmployeeCertificatesTab() {
  const form = Form.useFormInstance();
  const allRows = Form.useWatch('certificates', form) ?? [];
  const [fileLists, setFileLists] = useState({});

  const handleFileChange = (fieldName, { fileList: newList }) => {
    const safe = (newList || []).slice(-1).map((f) => ({ uid: f.uid, name: f.name, status: f.status ?? 'done' }));
    setFileLists((prev) => ({ ...prev, [fieldName]: safe }));
    form.setFieldValue(['certificates', fieldName, 'attachImageName'], safe[0]?.name ?? null);
  };

  return (
    <Form.List name="certificates">
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
                <FormFloatingField name={[field.name, 'certificationNo']} label="Certification No" required rules={[{ required: true, whitespace: true, message: 'Certification No is required' }]}>
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'certificationName']} label="Certification Name" required rules={[{ required: true, whitespace: true, message: 'Certification Name is required' }]}>
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'institutionName']} label="Institution Name">
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'detail']} label="Detail">
                  <Input className={controlClass} />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'certificationType']} label="Certification Type">
                  <Select className={controlClass} options={CERTIFICATION_TYPE_OPTIONS} allowClear />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'dateFrom']} label="Date From">
                  <Input className={controlClass} type="date" />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'dateTo']} label="Date To">
                  <Input className={controlClass} type="date" />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'needRenewal']} label="Need Renewal">
                  <Select className={controlClass} options={NEED_RENEWAL_OPTIONS} allowClear />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'expiryDate']} label="Expiry Date">
                  <Input className={controlClass} type="date" />
                </FormFloatingField>
                <FormFloatingField name={[field.name, 'attachImageName']} label="Attach Image" required rules={[{ required: true, message: 'Please attach an image' }]}>
                  <div className="employee-entry-upload-slot">
                    <Upload accept="image/*,.pdf" beforeUpload={() => false} maxCount={1}
                      fileList={fileLists[field.name] ?? []}
                      onChange={(info) => handleFileChange(field.name, info)}>
                      <Button icon={<UploadOutlined />} className={controlClass}>Choose File</Button>
                    </Upload>
                  </div>
                </FormFloatingField>
              </FormGrid>
            </div>
          ))}
          <Button type="dashed" className="employee-entry-list-add-btn" icon={<PlusOutlined />} onClick={() => add(DEFAULT_ROW)}>
            Add Certificate
          </Button>
        </div>
      )}
    </Form.List>
  );
}