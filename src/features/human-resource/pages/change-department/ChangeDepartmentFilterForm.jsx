'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import DynamicForm from '@/components/form/DynamicForm';
import {
  CHANGE_DEPARTMENT_FILTER_FIELDS,
  CHANGE_DEPARTMENT_FILTER_INITIAL_VALUES,
} from '@/features/human-resource/pages/change-department/change-department-fields';

export default function ChangeDepartmentFilterForm({
  form,
  onSubmit,
  onClear,
  loading = false,
}) {
  return (
    <section className="hr-filter-panel" aria-label="Change department search filters">
      <div className="walk-in-add-record-layout change-department-search-layout">
        <Form
          form={form}
          layout="vertical"
          className="walk-in-add-record-form change-department-search-form"
          initialValues={CHANGE_DEPARTMENT_FILTER_INITIAL_VALUES}
          onFinish={onSubmit}
        >
          <DynamicForm fields={CHANGE_DEPARTMENT_FILTER_FIELDS} />
          <div className="change-department-search-actions">
            <Button type="link" className="patient-reg-btn-clear" onClick={onClear}>
              Clear
            </Button>
            <Button
              type="default"
              className="hr-search-btn"
              icon={<SearchOutlined />}
              htmlType="submit"
              loading={loading}
            >
              Search
            </Button>
          </div>
        </Form>
      </div>
    </section>
  );
}
