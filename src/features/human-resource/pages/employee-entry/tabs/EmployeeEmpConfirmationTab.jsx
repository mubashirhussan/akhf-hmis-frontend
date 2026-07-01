'use client';

import { Form, Input, Select, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormGrid from '@/components/ui/FormGrid';
import FormFloatingField from '@/components/ui/FormFloatingField';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { useGetActiveEmployeesQuery } from '@/features/human-resource/api/employeeApi';

const controlClass = FIELD_CONTROL_CLASS;

const tableColumns = [
  { title: 'Recommended By', dataIndex: 'recommendedByName', key: 'recommendedByName', width: 160 },
  { title: 'Approval Date', dataIndex: 'approvalDate', key: 'approvalDate', width: 130 },
  { title: 'Remarks / Result', dataIndex: 'remarks', key: 'remarks', width: 200 },
];

export default function EmployeeEmpConfirmationTab() {
  const { data: employees = [] } = useGetActiveEmployeesQuery();
  const form = Form.useFormInstance();
  const allRows = Form.useWatch('empConfirmations', form) ?? [];

  const employeeOptions = employees.map((emp) => ({
    label: [emp.firstName, emp.middleName, emp.lastName].filter(Boolean).join(' '),
    value: emp.id,
  }));

  const getEmpName = (id) => employeeOptions.find((e) => e.value === id)?.label || '—';

  const tableData = allRows.map((r, i) => ({
    ...r,
    recommendedByName: getEmpName(r.recommendedBy),
    _key: `conf-${i}`,
  }));

  return (
    <div className="employee-entry-list-tab">
      <div className="employee-entry-list-row">
        <div className="employee-entry-list-row-header">
          <span className="employee-entry-list-row-title">Record</span>
        </div>
        <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
          <FormFloatingField
            name={['empConfirmations', 0, 'recommendedBy']}
            label="Confirmation Recommended By"
            required
            rules={[{ required: true, message: 'This field is required' }]}>
                  <Select className={controlClass} options={employeeOptions} showSearch allowClear
                    filterOption={(input, option) => option?.label?.toLowerCase().includes(input.toLowerCase())} />
                </FormFloatingField>
          <FormFloatingField name={['empConfirmations', 0, 'approvalDate']} label="Date of Approval">
            <Input className={controlClass} type="date" />
          </FormFloatingField>
          <FormFloatingField name={['empConfirmations', 0, 'remarks']} label="Remarks / Result" col="full">
            <Input.TextArea className={controlClass} rows={3} />
          </FormFloatingField>
        </FormGrid>
      </div>
    </div>
  );
}