'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import { getEmployeeDisplayName } from '@/features/human-resource/api/mock-employees';
import {
  MARK_VISITING_INITIAL_VALUES,
  getMarkVisitingFields,
} from '@/features/human-resource/pages/mark-visiting/mark-visiting-fields';

export default function MarkVisitingModal({
  open,
  onClose,
  title = 'Mark Visiting',
  form,
  onSave,
  employees = [],
  isEdit = false,
  record = null,
}) {
  const employeeOptions = useMemo(
    () =>
      employees.map((e) => ({
        value: e.empId ?? e.id,
        label: `${e.empId ?? e.id} — ${getEmployeeDisplayName(e)}`,
      })),
    [employees],
  );

  const fields = useMemo(
    () => getMarkVisitingFields(employeeOptions, { isEdit }),
    [employeeOptions, isEdit],
  );

  const loadRecord = (opened) => {
    if (!opened || !record) return;
    form.setFieldsValue({
      employeeId: record.employeeId ?? undefined,
      employeeName: record.employeeName ?? '',
    });
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={520}
      className="mark-visiting-modal"
      rootClassName="mark-visiting-modal-root"
      afterOpenChange={loadRecord}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="mark-visiting-save-btn" onClick={onSave}>
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
        initialValues={MARK_VISITING_INITIAL_VALUES}
        onValuesChange={(changed) => {
          if ('employeeId' in changed) {
            const found = employees.find(
              (e) => e.empId === changed.employeeId || e.id === changed.employeeId,
            );
            form.setFieldsValue({
              employeeName: found ? getEmployeeDisplayName(found) : '',
            });
          }
        }}
      >
        <DynamicForm fields={fields} className="mark-visiting-form-grid" />
      </Form>
    </AppModal>
  );
}
