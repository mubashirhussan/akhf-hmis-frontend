'use client';

import { Form } from 'antd';
import DynamicForm from '@/components/form/DynamicForm';
import SearchServicesSection from '@/features/opd/components/SearchServicesSection';
import {
  WALK_IN_INITIAL_VALUES,
  WALK_IN_BASE_FIELDS,
  WALK_IN_VISIT_FIELDS,
  WALK_IN_CATEGORY_FIELDS,
  WALK_IN_PANEL_FIELDS,
  WALK_IN_B2B_FIELDS,
} from '@/features/opd/pages/walk-in-patient/walk-in-patient-fields';

export default function AddNewRecordTab() {
  const [form] = Form.useForm();
  const category = Form.useWatch('category', form);

  const isB2b = category === 'b2b';
  const isPanel = category !== 'general' && category !== 'b2b';

  return (
    <div className="walk-in-add-record-layout mt-2">
      <Form
        form={form}
        name="walk-in-add"
        layout="vertical"
        className="walk-in-add-record-form"
        requiredMark={false}
        initialValues={WALK_IN_INITIAL_VALUES}
      >
        <DynamicForm fields={WALK_IN_BASE_FIELDS} gutter={[16, 12]} />
        <DynamicForm fields={WALK_IN_VISIT_FIELDS} gutter={[16, 12]} />
        <DynamicForm fields={WALK_IN_CATEGORY_FIELDS} gutter={[16, 12]} />
        {isPanel && <DynamicForm fields={WALK_IN_PANEL_FIELDS} gutter={[16, 12]} />}
        {isB2b && <DynamicForm fields={WALK_IN_B2B_FIELDS} gutter={[16, 12]} />}
      </Form>

      <div className="walk-in-add-record-services">
        <SearchServicesSection />
      </div>
    </div>
  );
}