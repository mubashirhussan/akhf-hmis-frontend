'use client';

import { App, Button, Form, Input, Select, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import FormGrid from '@/components/ui/FormGrid';
import FormFloatingField from '@/components/ui/FormFloatingField';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { useGetEmployeesQuery } from '@/features/human-resource/api/employeeApi';

const controlClass = FIELD_CONTROL_CLASS;

const STATUS_OPTIONS = [
  { label: 'Suspension', value: 'suspension' },
  { label: 'Rejoin', value: 'rejoin' },
];

function getActiveStatus(fromDate, toDate, status) {
  if (!fromDate || !toDate) return status || '—';
  const now = new Date();
  const from = new Date(fromDate);
  const to = new Date(toDate);
  if (now >= from && now <= to) return 'Active';
  if (now > to) return status === 'rejoin' ? 'Rejoined' : 'Completed';
  return 'Upcoming';
}

function datesConflict(records, fromDate, toDate, excludeIndex = -1) {
  if (!fromDate || !toDate) return false;
  const from = new Date(fromDate);
  const to = new Date(toDate);
  return records.some((rec, i) => {
    if (i === excludeIndex || !rec.fromDate || !rec.toDate) return false;
    return from <= new Date(rec.toDate) && to >= new Date(rec.fromDate);
  });
}

export default function EmployeeSuspensionTab({ employeeName }) {
  const { message } = App.useApp();
  const { data: employees = [] } = useGetEmployeesQuery();
  const form = Form.useFormInstance();
  const allRows = Form.useWatch('suspensions', form) ?? [];

  const employeeOptions = employees.map((emp) => ({
    label: [emp.firstName, emp.middleName, emp.lastName].filter(Boolean).join(' '),
    value: emp.id,
  }));

  const getSuspendedByName = (id) =>
    employeeOptions.find((e) => e.value === id)?.label || '—';

  const tableColumns = [
    { title: 'Employee Name', key: 'empName', width: 150, render: () => employeeName || '—' },
    { title: 'Suspended By', key: 'suspendedBy', width: 150, render: (_, rec) => getSuspendedByName(rec.suspendedBy) },
    { title: 'From', dataIndex: 'fromDate', key: 'fromDate', width: 120 },
    { title: 'To', dataIndex: 'toDate', key: 'toDate', width: 120 },
    { title: 'Reason', dataIndex: 'reason', key: 'reason', width: 160 },
    {
      title: 'Status',
      key: 'status',
      width: 110,
      render: (_, rec) => {
        const s = getActiveStatus(rec.fromDate, rec.toDate, rec.status);
        const color = s === 'Active' ? 'red' : s === 'Rejoined' ? 'green' : s === 'Completed' ? 'orange' : 'blue';
        return <Tag color={color}>{s}</Tag>;
      },
    },
  ];

  return (
    <Form.List name="suspensions">
      {(listFields, { add, remove }) => {
        const handleAdd = () => {
          const last = allRows[allRows.length - 1];
          if (last && (!last.fromDate || !last.toDate)) {
            message.warning('Please fill From Date and To Date before adding a new record.');
            return;
          }
          add({ fromDate: '', toDate: '', suspendedBy: null, reason: '', remarks: '', status: null });
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
                    onClick={() => remove(field.name)}
                    aria-label={`Remove record ${index + 1}`}
                  >
                    <DeleteOutlined />
                  </button>
                </div>
                <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
<FormFloatingField
                    name={[field.name, 'fromDate']}
                    label="From Date"
                    required
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      { required: true, message: 'From date is required' },
                      {
                        validator(_, value) {
                          const toDate = form.getFieldValue(['suspensions', field.name, 'toDate']);
                         if (value && toDate && new Date(value) >= new Date(toDate))
                            return Promise.reject('Enter correct dates: From date must be earlier than To date');
                          if (value && toDate && datesConflict(allRows, value, toDate, index))
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
                        form.validateFields([['suspensions', field.name, 'toDate']]);
                      }}
                    />
                  </FormFloatingField>

                  <FormFloatingField
                    name={[field.name, 'toDate']}
                    label="To Date"
                    required
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      { required: true, message: 'To date is required' },
                      {
                        validator(_, value) {
                          const fromDate = form.getFieldValue(['suspensions', field.name, 'fromDate']);
                          if (value && fromDate && new Date(value) <= new Date(fromDate))
                            return Promise.reject('Enter correct dates: To date must be later than From date');
                          if (value && fromDate && datesConflict(allRows, fromDate, value, index))
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
                        form.validateFields([['suspensions', field.name, 'fromDate']]);
                      }}
                    />
                  </FormFloatingField>

                  <FormFloatingField name={[field.name, 'suspendedBy']} label="Suspension By">
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

                  <FormFloatingField name={[field.name, 'status']} label="Status">
                    <Select className={controlClass} options={STATUS_OPTIONS} allowClear />
                  </FormFloatingField>

                  <FormFloatingField name={[field.name, 'reason']} label="Reason" col="full">
                    <Input.TextArea className={controlClass} rows={2} />
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
              onClick={handleAdd}
            >
              Add Suspension
            </Button>
          </div>
        );
      }}
    </Form.List>
  );
}