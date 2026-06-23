"use client";

import { Button } from "antd";
import AppModal from "@/components/ui/AppModal";
import TestBookingForm from "./TestBookingForm";

export default function TestBookingModal({
  open,
  onClose,
  form,
  onPatchForm,
  onSave,
  mainGroups,
  testNames,
  services,
  isEdit,
}) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Test Booking" : "Add Test Booking"}
      width={760}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <TestBookingForm
        form={form}
        onPatchForm={onPatchForm}
        mainGroups={mainGroups}
        testNames={testNames}
        services={services}
      />
    </AppModal>
  );
}