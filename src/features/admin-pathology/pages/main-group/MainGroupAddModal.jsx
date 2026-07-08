"use client";

import { Button, Form } from "antd";
import AppModal from "@/components/ui/AppModal";
import DynamicForm from "@/components/form/DynamicForm";
import { MAIN_GROUP_FIELDS } from "@/features/admin-pathology/pages/main-group/main-group-fields";

export default function MainGroupAddModal({ open, onClose, form, onSave }) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Add Main Group"
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      width={480}
      className="main-group-modal"
      rootClassName="main-group-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            className="main-group-save-btn"
            onClick={onSave}
          >
            Save
          </Button>
        </>
      }
    >
      <Form form={form} layout="vertical" requiredMark preserve={false}>
        <DynamicForm fields={MAIN_GROUP_FIELDS} className="main-group-form-grid" />
      </Form>
    </AppModal>
  );
}
