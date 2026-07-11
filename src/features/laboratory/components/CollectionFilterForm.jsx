'use client';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import DynamicForm from '@/components/form/DynamicForm';
import {
  COLLECTION_FILTER_FIELDS,
  getCollectionFilterInitialValues,
} from '@/features/laboratory/components/collection-filter-fields';

export default function CollectionFilterForm({
  form,
  initialValues,
  onSubmit,
  loading = false,
}) {
  return (
    <div className="walk-in-add-record-layout services-billing-search-layout">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues ?? getCollectionFilterInitialValues('result-entry')}
        className="walk-in-add-record-form"
        onFinish={onSubmit}
      >
        <DynamicForm fields={COLLECTION_FILTER_FIELDS} gutter={[16, 12]} />
        <div className="services-billing-search-actions">
          <Button
            type="default"
            htmlType="submit"
            icon={<SearchOutlined />}
            className="walk-in-search-btn services-billing-search-btn"
            loading={loading}
          >
            Search
          </Button>
        </div>
      </Form>
    </div>
  );
}
