'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import DynamicForm from '@/components/form/DynamicForm';
import {
  ACTIVATE_DEACTIVATE_FILTER_FIELDS,
  ACTIVATE_DEACTIVATE_FILTER_INITIAL_VALUES,
} from '@/features/human-resource/pages/activate-deactivate-user/activate-deactivate-fields';

export default function ActivateDeactivateFilterForm({
  form,
  onSubmit,
  onClear,
  loading = false,
}) {
  return (
    <div className="walk-in-add-record-layout activate-deactivate-search-layout">
      <Form
        form={form}
        layout="vertical"
        initialValues={ACTIVATE_DEACTIVATE_FILTER_INITIAL_VALUES}
        className="walk-in-add-record-form activate-deactivate-search-form"
        onFinish={onSubmit}
      >
        <DynamicForm fields={ACTIVATE_DEACTIVATE_FILTER_FIELDS} gutter={[16, 12]} />
        <div className="activate-deactivate-search-actions">
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
