'use client';

import { useMemo } from 'react';
import { Button, Form, InputNumber } from 'antd';
import dayjs from 'dayjs';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import {
  getAdminDutyDepartments,
  getAdminDutySubDepartments,
} from '@/features/duty-roaster/api/mock-admin-duty-roaster';
import { useGetShiftsQuery } from '@/features/duty-roaster/api/dutyRoasterApi';
import {
  ADMIN_DUTY_ROASTER_INITIAL_VALUES,
  getAdminDutyRoasterFields,
} from '@/features/duty-roaster/pages/admin-duty-roaster/admin-duty-roaster-fields';

function DurationFields() {
  return (
    <div className="admin-duty-duration-row">
      <div className="admin-duty-duration-field">
        <Form.Item
          name="durationHours"
          rules={[{ required: true, message: 'Duration hours is required.' }]}
          noStyle
        >
          <InputNumber className={FIELD_CONTROL_CLASS} min={0} max={23} precision={0} />
        </Form.Item>
        <span className="admin-duty-duration-label">hr.</span>
      </div>
      <div className="admin-duty-duration-field">
        <Form.Item
          name="durationMinutes"
          rules={[{ required: true, message: 'Duration minutes is required.' }]}
          noStyle
        >
          <InputNumber className={FIELD_CONTROL_CLASS} min={0} max={59} precision={0} />
        </Form.Item>
        <span className="admin-duty-duration-label">min</span>
      </div>
    </div>
  );
}

export default function AdminDutyRoasterModal({
  open,
  onClose,
  title = 'Add Admin Duty Roaster',
  form,
  onSave,
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
      getAdminDutyRoasterFields({
        departmentOptions,
        subDepartmentOptions,
        shiftOptions,
        hasDepartment: Boolean(departmentId),
        durationField: {
          type: 'custom',
          name: '_duration',
          label: 'Duration Time',
          col: 24,
          props: {
            render: () => <DurationFields />,
          },
        },
      }),
    [departmentOptions, subDepartmentOptions, shiftOptions, departmentId],
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={640}
      className="admin-duty-roaster-modal"
      rootClassName="admin-duty-roaster-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="admin-duty-roaster-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark
        preserve={false}
        initialValues={ADMIN_DUTY_ROASTER_INITIAL_VALUES}
        onValuesChange={(changed) => {
          if ('departmentId' in changed) {
            form.setFieldsValue({ subDepartmentId: undefined });
          }
          if ('shiftId' in changed && changed.shiftId) {
            const shift = shifts.find((s) => s.id === changed.shiftId);
            if (shift?.startTime) {
              const parsed = dayjs(shift.startTime, 'HH:mm');
              if (parsed.isValid()) {
                form.setFieldsValue({ startTime: parsed });
              }
            }
          }
        }}
      >
        <DynamicForm fields={fields} className="admin-duty-roaster-form-grid" />
      </Form>
    </AppModal>
  );
}
