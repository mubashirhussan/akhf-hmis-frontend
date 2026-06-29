'use client';

import { App, Button, Form, Input, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import FormGrid from '@/components/ui/FormGrid';
import FormFloatingField from '@/components/ui/FormFloatingField';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { useGetEmployeesQuery } from '@/features/human-resource/api/employeeApi';

const controlClass = FIELD_CONTROL_CLASS;

const PROMOTION_TYPE_OPTIONS = [
  { label: 'Promotion', value: 'promotion' },
  { label: 'Demotion', value: 'demotion' },
];

const DESIGNATION_OPTIONS = [
  { value: 'neuro-surgeon', label: 'Neuro Surgeon' },
  { value: 'medical-officer', label: 'Medical Officer' },
  { value: 'staff-nurse', label: 'Staff Nurse' },
  { value: 'administrator', label: 'Administrator' },
  { value: 'officer', label: 'Officer' },
];

function dateConflicts(records, date, excludeIndex = -1) {
  if (!date) return false;
  return records.some((rec, i) => {
    if (i === excludeIndex || !rec.promotionDate) return false;
    return rec.promotionDate === date;
  });
}

export default function EmployeePromotionTab({ employeeName }) {
  const { data: employees = [] } = useGetEmployeesQuery();
  const form = Form.useFormInstance();
  const allRows = Form.useWatch('promotions', form) ?? [];

  const employeeOptions = employees.map((emp) => ({
    label: [emp.firstName, emp.middleName, emp.lastName].filter(Boolean).join(' '),
    value: emp.id,
  }));

  const getLabel = (options, value) =>
    options.find((o) => o.value === value)?.label || value || '—';

  const tableColumns = [
    { title: 'Employee Name', key: 'empName', width: 150, render: () => employeeName || '—' },
    { title: 'Current Designation', key: 'currentDesignation', width: 160, render: (_, rec) => getLabel(DESIGNATION_OPTIONS, rec.currentDesignation) },
    { title: 'Type', key: 'promotionType', width: 110, render: (_, rec) => getLabel(PROMOTION_TYPE_OPTIONS, rec.promotionType) },
    { title: 'Date', dataIndex: 'promotionDate', key: 'promotionDate', width: 120 },
    { title: 'New Designation', key: 'newDesignation', width: 160, render: (_, rec) => getLabel(DESIGNATION_OPTIONS, rec.newDesignation) },
    { title: 'Ordered By', key: 'orderedBy', width: 150, render: (_, rec) => getLabel(employeeOptions, rec.orderedBy) },
    { title: 'Description', dataIndex: 'description', key: 'description', width: 180 },
  ];

  return (
    <Form.List name="promotions">
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
                <FormFloatingField name={[field.name, 'currentDesignation']} label="Current Designation">
                  <Select className={controlClass} options={DESIGNATION_OPTIONS} allowClear />
                </FormFloatingField>

                <FormFloatingField
                  name={[field.name, 'promotionType']}
                  label="Promotion / Demotion"
                  required
                  rules={[{ required: true, message: 'This field is required' }]}
                >
                  <Select className={controlClass} options={PROMOTION_TYPE_OPTIONS} allowClear />
                </FormFloatingField>

                <FormFloatingField
                  name={[field.name, 'promotionDate']}
                  label="Promotion / Demotion Date"
                  required
                  rules={[
                    { required: true, message: 'Date is required' },
                    {
                      validator(_, value) {
                        if (value && dateConflicts(allRows, value, index))
                          return Promise.reject('A promotion/demotion already exists on this date');
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input className={controlClass} type="date" />
                </FormFloatingField>

                <FormFloatingField name={[field.name, 'newDesignation']} label="New Designation">
                  <Select className={controlClass} options={DESIGNATION_OPTIONS} allowClear />
                </FormFloatingField>

                <FormFloatingField name={[field.name, 'orderedBy']} label="Ordered By">
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

                <FormFloatingField name={[field.name, 'description']} label="Promotion / Demotion Description" col="full">
                  <Input.TextArea className={controlClass} rows={2} />
                </FormFloatingField>
              </FormGrid>
            </div>
          ))}

          <Button
            type="dashed"
            className="employee-entry-list-add-btn"
            icon={<PlusOutlined />}
            onClick={() => add({ currentDesignation: null, promotionType: null, promotionDate: '', newDesignation: null, orderedBy: null, description: '' })}
          >
            Add Promotion / Demotion
          </Button>
        </div>
      )}
    </Form.List>
  );
}