'use client';

import { useState } from 'react';
import { Form, Button, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import DynamicForm from '@/components/form/DynamicForm';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  CERTIFICATE_DEFAULT_ROW,
  getCertificateFields,
} from './employee-certificates-fields';

const controlClass = FIELD_CONTROL_CLASS;

export default function EmployeeCertificatesTab() {
  const form = Form.useFormInstance();
  const [fileLists, setFileLists] = useState({});

  const handleFileChange = (fieldName, { fileList: newList }) => {
    const safe = (newList || []).slice(-1).map((f) => ({
      uid: f.uid,
      name: f.name,
      status: f.status ?? 'done',
    }));
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
                <button
                  type="button"
                  className="employee-entry-list-remove-btn"
                  onClick={() => {
                    remove(field.name);
                    setFileLists((prev) => {
                      const next = { ...prev };
                      delete next[field.name];
                      return next;
                    });
                  }}
                >
                  <DeleteOutlined />
                </button>
              </div>
              <DynamicForm
                gutter={[14, 12]}
                className="patient-reg-section-grid employee-entry-section-grid"
                fields={getCertificateFields(field.name, {
                  attachImageRender: () => (
                    <div className="employee-entry-upload-slot">
                      <Upload
                        accept="image/*,.pdf"
                        beforeUpload={() => false}
                        maxCount={1}
                        fileList={fileLists[field.name] ?? []}
                        onChange={(info) => handleFileChange(field.name, info)}
                      >
                        <Button icon={<UploadOutlined />} className={controlClass}>
                          Choose File
                        </Button>
                      </Upload>
                    </div>
                  ),
                })}
              />
            </div>
          ))}
          <Button
            type="dashed"
            className="employee-entry-list-add-btn"
            icon={<PlusOutlined />}
            onClick={() => add(CERTIFICATE_DEFAULT_ROW)}
          >
            Add Certificate
          </Button>
        </div>
      )}
    </Form.List>
  );
}
