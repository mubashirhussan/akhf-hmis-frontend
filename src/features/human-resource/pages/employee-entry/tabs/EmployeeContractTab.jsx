'use client';

import { useState } from 'react';
import { App, Button, Form, Input, Select, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import FormGrid from '@/components/ui/FormGrid';
import FormFloatingField from '@/components/ui/FormFloatingField';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { useGetActiveEmployeesQuery } from '@/features/human-resource/api/employeeApi';

const controlClass = FIELD_CONTROL_CLASS;

function datesConflict(records, fromDate, toDate, excludeIndex = -1) {
  if (!fromDate || !toDate) return false;
  const from = new Date(fromDate);
  const to = new Date(toDate);
  return records.some((rec, i) => {
    if (i === excludeIndex || !rec.startDate || !rec.endDate) return false;
    return from <= new Date(rec.endDate) && to >= new Date(rec.startDate);
  });
}

export default function EmployeeContractTab({ employeeName }) {
  const { message } = App.useApp();
  const { data: employees = [] } = useGetActiveEmployeesQuery();
  const form = Form.useFormInstance();
  const allRows = Form.useWatch('contracts', form) ?? [];
  const [fileLists, setFileLists] = useState({});

  const employeeOptions = employees.map((emp) => ({
    label: [emp.firstName, emp.middleName, emp.lastName].filter(Boolean).join(' '),
    value: emp.id,
  }));

  const getSigningAuthorityName = (id) =>
    employeeOptions.find((e) => e.value === id)?.label || '—';

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

  const tableColumns = [
    { title: 'Employee Name', key: 'empName', width: 150, render: () => employeeName || '—' },
    { title: 'Signing Authority', key: 'signingAuthority', width: 150, render: (_, rec) => getSigningAuthorityName(rec.signingAuthority) },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', width: 120 },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate', width: 120 },
    { title: 'Document', key: 'doc', width: 150, render: (_, rec) => rec.contractDocumentName || '—' },
    { title: 'Notes', dataIndex: 'notes', key: 'notes', width: 180 },
  ];

  return (
    <Form.List name="contracts">
      {(listFields, { add, remove }) => {
        const handleAdd = () => {
          const last = allRows[allRows.length - 1];
          if (last && (!last.startDate || !last.endDate)) {
            message.warning('Please fill Start Date and End Date before adding a new record.');
            return;
          }
          add({ startDate: '', endDate: '', contractDocumentName: null, signingAuthority: null, notes: '' });
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
                <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
                  <FormFloatingField
                    name={[field.name, 'startDate']}
                    label="Contract Start Date"
                    required
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      { required: true, message: 'Start date is required' },
                      {
                        validator(_, value) {
                          const endDate = form.getFieldValue(['contracts', field.name, 'endDate']);
                          if (value && endDate && new Date(value) >= new Date(endDate))
                            return Promise.reject('Enter correct dates: Start date must be earlier than End date');
                          if (value && endDate && datesConflict(allRows, value, endDate, index))
                            return Promise.reject('Enter correct dates: This period conflicts with an existing record');
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      className={controlClass}
                      type="date"
                      onChange={() => {
                        form.validateFields([['contracts', field.name, 'endDate']]);
                      }}
                    />
                  </FormFloatingField>

                  <FormFloatingField
                    name={[field.name, 'endDate']}
                    label="Contract End Date"
                    required
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      { required: true, message: 'End date is required' },
                      {
                        validator(_, value) {
                          const startDate = form.getFieldValue(['contracts', field.name, 'startDate']);
                          if (value && startDate && new Date(value) <= new Date(startDate))
                            return Promise.reject('Enter correct dates: End date must be later than Start date');
                          if (value && startDate && datesConflict(allRows, startDate, value, index))
                            return Promise.reject('Enter correct dates: This period conflicts with an existing record');
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      className={controlClass}
                      type="date"
                      onChange={() => {
                        form.validateFields([['contracts', field.name, 'startDate']]);
                      }}
                    />
                  </FormFloatingField>

                  <FormFloatingField
                    name={[field.name, 'signingAuthority']}
                    label="Signing Authority"
                  >
                    <Select
                      className={controlClass}
                      options={employeeOptions}
                      showSearch
                      allowClear
                      filterOption={(input, option) =>
                        option?.label?.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </FormFloatingField>

                  <FormFloatingField
                    name={[field.name, 'contractDocumentName']}
                    label="Contract Document"
                    required
                    rules={[{ required: true, message: 'Contract document is required' }]}
                  >
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
                  </FormFloatingField>

                  <FormFloatingField
                    name={[field.name, 'notes']}
                    label="Notes"
                    col="full"
                  >
                    <Input.TextArea className={controlClass} rows={2} />
                  </FormFloatingField>
                </FormGrid>
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