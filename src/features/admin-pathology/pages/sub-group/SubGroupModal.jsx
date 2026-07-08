'use client';

import { useMemo } from 'react';
import { Button, Form } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DynamicForm from '@/components/form/DynamicForm';
import { useGetMainGroupsQuery } from '@/features/admin-pathology/api/pathologyApi';
import { SUB_GROUP_FIELDS } from '@/features/admin-pathology/pages/sub-group/sub-group-fields';

export default function SubGroupModal({
  open,
  onClose,
  title = 'Add Sub Group',
  form,
  onSave,
}) {
  const { data: mainGroups = [] } = useGetMainGroupsQuery();

  const fields = useMemo(() => {
    const options = mainGroups.map((group) => ({
      label: group.groupName,
      value: group.TGID,
    }));

    return SUB_GROUP_FIELDS.map((field) =>
      field.name === 'TGID' ? { ...field, options } : field,
    );
  }, [mainGroups]);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={480}
      className="sub-group-modal"
      rootClassName="sub-group-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="sub-group-save-btn" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <Form form={form} layout="vertical" requiredMark preserve={false}>
        <DynamicForm fields={fields} className="sub-group-form-grid" />
      </Form>
    </AppModal>
  );
}
