'use client';

import { useMemo } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import DynamicForm from '@/components/form/DynamicForm';
import {
  getAdminDutyDepartments,
  getAdminDutySubDepartments,
} from '@/features/duty-roaster/api/mock-admin-duty-roaster';
import { useGetShiftsQuery } from '@/features/duty-roaster/api/dutyRoasterApi';
import {
  ADMIN_DUTY_ROASTER_FILTER_INITIAL_VALUES,
  getAdminDutyRoasterFilterFields,
} from '@/features/duty-roaster/pages/admin-duty-roaster/admin-duty-roaster-fields';

export default function AdminDutyRoasterFilterForm({
  form,
  onSubmit,
  onClear,
  loading = false,
}) {
  const { data: shifts = [] } = useGetShiftsQuery();
  const departmentId = Form.useWatch('departmentId', form);

  const departmentOptions = useMemo(
    () => getAdminDutyDepartments().map((d) => ({ value: d.id, label: d.name })),
    [],
  );

  const subDepartmentOptions = useMemo(
    () =>
      getAdminDutySubDepartments(departmentId).map((d) => ({
        value: d.id,
        label: d.name,
      })),
    [departmentId],
  );

  const shiftOptions = useMemo(
    () => shifts.map((s) => ({ value: s.id, label: s.shiftName })),
    [shifts],
  );

  const fields = useMemo(
    () =>
      getAdminDutyRoasterFilterFields({
        departmentOptions,
        subDepartmentOptions,
        shiftOptions,
        hasDepartment: Boolean(departmentId),
      }),
    [departmentOptions, subDepartmentOptions, shiftOptions, departmentId],
  );

  return (
    <section className="hr-filter-panel" aria-label="Admin duty roaster search filters">
      <div className="walk-in-add-record-layout hr-search-layout">
        <Form
          form={form}
          layout="vertical"
          initialValues={ADMIN_DUTY_ROASTER_FILTER_INITIAL_VALUES}
          className="walk-in-add-record-form hr-search-form"
          onValuesChange={(changed) => {
            if ('departmentId' in changed) {
              form.setFieldsValue({ subDepartmentId: undefined });
            }
          }}
          onFinish={onSubmit}
        >
          <DynamicForm fields={fields} gutter={[16, 12]} />
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
