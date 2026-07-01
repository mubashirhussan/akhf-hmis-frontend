'use client';

import { Form, Input, Select, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormGrid from '@/components/ui/FormGrid';
import FormFloatingField from '@/components/ui/FormFloatingField';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { useGetActiveEmployeesQuery } from '@/features/human-resource/api/employeeApi';

const controlClass = FIELD_CONTROL_CLASS;

const RESIGNATION_TYPE_OPTIONS = [
  { label: 'Resignation', value: 'resignation' },
  { label: 'Termination', value: 'termination' },
  { label: 'Retirement', value: 'retirement' },
  { label: 'Dismissal', value: 'dismissal' },
];

const NOTICE_PERIOD_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({ label: `${n} Month${n > 1 ? 's' : ''}`, value: n }));
const APPROVAL_OPTIONS = [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }];

const getLabel = (options, value) => options.find((o) => o.value === value)?.label || value || '—';

const tableColumns = [
  { title: 'Type', key: 'resignationType', width: 120, render: (_, r) => getLabel(RESIGNATION_TYPE_OPTIONS, r.resignationType) },
  { title: 'Resign Date', dataIndex: 'resignDate', key: 'resignDate', width: 120 },
  { title: 'Last Work Day', dataIndex: 'lastWorkDay', key: 'lastWorkDay', width: 120 },
  { title: 'Notice Period', key: 'noticePeriod', width: 120, render: (_, r) => getLabel(NOTICE_PERIOD_OPTIONS, r.noticePeriod) },
  { title: 'Approval', key: 'approval', width: 90, render: (_, r) => getLabel(APPROVAL_OPTIONS, r.approval) },
  { title: 'Approval Date', dataIndex: 'approvalDate', key: 'approvalDate', width: 120 },
  { title: 'Approved By', dataIndex: 'approvedByName', key: 'approvedByName', width: 140 },
  { title: 'Remarks', dataIndex: 'remarks', key: 'remarks', width: 160 },
];

export default function EmployeeResignationTab() {
  const { data: employees = [] } = useGetActiveEmployeesQuery();
  const form = Form.useFormInstance();
  const allRows = Form.useWatch('resignations', form) ?? [];

  const employeeOptions = employees.map((emp) => ({
    label: [emp.firstName, emp.middleName, emp.lastName].filter(Boolean).join(' '),
    value: emp.id,
  }));

  const getEmpName = (id) => employeeOptions.find((e) => e.value === id)?.label || '—';

  const tableData = allRows.map((r, i) => ({
    ...r,
    approvedByName: getEmpName(r.approvedBy),
    _key: `res-${i}`,
  }));

  return (
    <div className="employee-entry-list-tab">
      <div className="employee-entry-list-row">
        <div className="employee-entry-list-row-header">
          <span className="employee-entry-list-row-title">Record</span>
        </div>
        <FormGrid columns={4} className="patient-reg-section-grid employee-entry-section-grid">
          <FormFloatingField
            name={['resignations', 0, 'resignationType']}
            label="Resignation Type"
            required
            rules={[{ required: true, message: 'Resignation type is required' }]}>
                  <Select className={controlClass} options={RESIGNATION_TYPE_OPTIONS} allowClear />
                </FormFloatingField>
          <FormFloatingField name={['resignations', 0, 'resignDate']} label="Resign Date">
            <Input className={controlClass} type="date" />
          </FormFloatingField>
          <FormFloatingField name={['resignations', 0, 'lastWorkDay']} label="Last Work Day">
            <Input className={controlClass} type="date" />
          </FormFloatingField>
          <FormFloatingField name={['resignations', 0, 'noticePeriod']} label="Notice Period">
            <Select className={controlClass} options={NOTICE_PERIOD_OPTIONS} allowClear placeholder="Notice period in months" />
          </FormFloatingField>
          <FormFloatingField name={['resignations', 0, 'approval']} label="Approval">
            <Select className={controlClass} options={APPROVAL_OPTIONS} allowClear />
          </FormFloatingField>
          <FormFloatingField name={['resignations', 0, 'approvalDate']} label="Approval Date">
            <Input className={controlClass} type="date" />
          </FormFloatingField>
          <FormFloatingField name={['resignations', 0, 'approvedBy']} label="Approved By">
            <Select className={controlClass} options={employeeOptions} showSearch allowClear
              filterOption={(input, option) => option?.label?.toLowerCase().includes(input.toLowerCase())} />
          </FormFloatingField>
          <FormFloatingField name={['resignations', 0, 'resign']} label="Resign" col="full">
            <Input.TextArea className={controlClass} rows={3} />
          </FormFloatingField>
          <FormFloatingField name={['resignations', 0, 'remarks']} label="Remarks" col="full">
            <Input.TextArea className={controlClass} rows={3} />
          </FormFloatingField>
        </FormGrid>
      </div>
    </div>
  );
}