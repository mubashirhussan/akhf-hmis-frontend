'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import DynamicForm from '@/components/form/DynamicForm';
import {
  EMPLOYEE_SEARCH_FILTER_FIELDS,
  EMPLOYEE_SEARCH_FILTER_INITIAL_VALUES,
} from '@/features/human-resource/pages/search-all-employee/employee-search-fields';

export default function EmployeeSearchFilterForm({
  form,
  onSubmit,
  onClear,
  loading = false,
}) {
  return (
    <div className="walk-in-add-record-layout employee-search-layout">
      <Form
        form={form}
        layout="vertical"
        initialValues={EMPLOYEE_SEARCH_FILTER_INITIAL_VALUES}
        className="walk-in-add-record-form employee-search-form"
        onFinish={onSubmit}
      >
        <DynamicForm fields={EMPLOYEE_SEARCH_FILTER_FIELDS} gutter={[16, 12]} />
        <div className="employee-search-actions">
          <Button type="link" className="patient-reg-btn-clear" onClick={onClear}>
            Clear
          </Button>
          <Button
            type="primary"
            className="patient-reg-btn-save"
            icon={<SearchOutlined />}
            htmlType="submit"
            loading={loading}
          >
            Search
          </Button>
        </div>
      </Form>
    </div>
  );
}
