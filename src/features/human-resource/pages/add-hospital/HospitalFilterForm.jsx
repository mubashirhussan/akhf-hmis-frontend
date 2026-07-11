'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import DynamicForm from '@/components/form/DynamicForm';
import {
  HOSPITAL_FILTER_FIELDS,
  HOSPITAL_FILTER_INITIAL_VALUES,
} from '@/features/human-resource/pages/add-hospital/hospital-fields';

export default function HospitalFilterForm({
  form,
  onSubmit,
  onClear,
  loading = false,
}) {
  return (
    <section className="hr-filter-panel" aria-label="Hospital search filters">
      <div className="walk-in-add-record-layout hr-search-layout">
        <Form
          form={form}
          layout="vertical"
          initialValues={HOSPITAL_FILTER_INITIAL_VALUES}
          className="walk-in-add-record-form hr-search-form"
          onFinish={onSubmit}
        >
          <DynamicForm fields={HOSPITAL_FILTER_FIELDS} gutter={[16, 12]} />
          <div className="hr-search-actions">
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
