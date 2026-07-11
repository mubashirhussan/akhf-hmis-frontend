'use client';

import { Form, Button, Col, Row } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DynamicForm from '@/components/form/DynamicForm';
import {
  EMERGENCY_FORM_INITIAL_VALUES,
  SEARCH_FIELDS,
  PATIENT_INFO_FIELDS,
} from './emergency-registration-fields';

export default function EmergencyRegistrationForm() {
  const [form] = Form.useForm();

  return (
    <div className="min-h-screen p-6">
      <Form
        form={form}
        name="emergency-reg"
        initialValues={EMERGENCY_FORM_INITIAL_VALUES}
        layout="vertical"
      >
        <div className="bg-white rounded-lg border border-gray-200 px-5 py-4 mb-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Row gutter={[16, 12]} align="bottom">
                <Col span={20}>
                  <DynamicForm fields={SEARCH_FIELDS} gutter={[12, 0]} />
                </Col>
                <Col span={4}>
                  <Button
                    icon={
                      <AppIcon
                        icon="material-symbols:search"
                        className="h-[1.5em] w-[1.5em]"
                      />
                    }
                    className="!bg-[#026BB1] !border-[#026BB1] !text-white !rounded-md !h-7.75 w-24 !font-medium text-sm! shrink-0 mb-[1px]"
                    onClick={() =>
                      console.log(
                        'search',
                        form.getFieldsValue(['regNo', 'visit']),
                      )
                    }
                  >
                    Search
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-[#026BB1] text-white flex items-center gap-2 px-5 py-2.5">
            <AppIcon
              icon="solar:user-bold"
              className="h-[1.25em] w-[1.25em] text-base"
            />
            <span className="text-sm font-semibold tracking-wide">
              Patient Information
            </span>
          </div>

          <div className="px-5 py-5">
            <DynamicForm fields={PATIENT_INFO_FIELDS} gutter={[12, 0]} />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            onClick={() => form.resetFields()}
            className="!border-[#026BB1] !text-[#026BB1] !bg-white !rounded-md !h-10.5 !px-8 !font-medium !text-sm"
          >
            Clear
          </Button>
          <Button
            onClick={() => form.submit()}
            className="!bg-[#026BB1] !border-[#026BB1] !text-white !rounded-md !h-10.5 !px-8 !font-medium !text-sm"
          >
            Register
          </Button>
        </div>
      </Form>
    </div>
  );
}
