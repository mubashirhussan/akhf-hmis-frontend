'use client';

import { useState, useMemo } from 'react';
import { App, Button, Form, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import DynamicForm from '@/components/form/DynamicForm';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { useGetActiveEmployeesQuery } from '@/features/human-resource/api/employeeApi';
import {
  CONTRACT_DEFAULT_ROW,
  getContractFields,
} from './employee-contract-fields';

const controlClass = FIELD_CONTROL_CLASS;

export default function EmployeeContractTab() {
  const { message } = App.useApp();
  const { data: employees = [] } = useGetActiveEmployeesQuery();
  const form = Form.useFormInstance();
  const allRows = Form.useWatch('contracts', form) ?? [];
  const [fileLists, setFileLists] = useState({});

  const employeeOptions = useMemo(
    () =>
      employees.map((emp) => ({
        label: [emp.firstName, emp.middleName, emp.lastName].filter(Boolean).join(' '),
        value: emp.id,
      })),
    [employees],
  );

  const handleFileChange = (fieldName, { fileList: newList }) => {
    const safe = (newList || []).slice(-1).map((f) => ({
      uid: f.uid,
      name: f.name,
      status: f.status ?? 'done',
      originFileObj: f.originFileObj,
    }));
    setFileLists((prev) => ({ ...prev, [fieldName]: safe }));
    form.setFieldValue(['contracts', fieldName, 'contractDocumentName'], safe[0]?.name ?? null);
  };

  return (
    <Form.List name="contracts">
      {(listFields, { add, remove }) => {
        const handleAdd = () => {
          const last = allRows[allRows.length - 1];
          if (last && (!last.startDate || !last.endDate)) {
            message.warning('Please fill Start Date and End Date before adding a new record.');
            return;
          }
          add(CONTRACT_DEFAULT_ROW);
        };

        return (
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
                    onClick={() => {
                      remove(field.name);
                      setFileLists((prev) => {
                        const next = { ...prev };
                        delete next[field.name];
                        return next;
                      });
                    }}
                    aria-label={`Remove record ${index + 1}`}
                  >
                    <DeleteOutlined />
                  </button>
                </div>
                <DynamicForm
                  gutter={[14, 12]}
                  className="patient-reg-section-grid employee-entry-section-grid"
                  fields={getContractFields(field.name, {
                    form,
                    employeeOptions,
                    allRows,
                    documentRender: () => (
                      <div className="employee-entry-upload-slot">
                        <Upload
                          accept=".pdf,.doc,.docx,image/*"
                          beforeUpload={() => false}
                          maxCount={1}
                          fileList={fileLists[field.name] ?? []}
                          onChange={(info) => handleFileChange(field.name, info)}
                        >
                          <Button icon={<UploadOutlined />} className={controlClass}>
                            Attach Document
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
              onClick={handleAdd}
            >
              Add Contract
            </Button>
          </div>
        );
      }}
    </Form.List>
  );
}
