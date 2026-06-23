"use client";

import { Button } from "antd";
import AppModal from "@/components/ui/AppModal";
import MapServicesForm from "./MapServicesForm";
import { useState, useEffect } from "react";

export default function MapServicesModal({
  open,
  onClose,
  row,
  onSave,
  services,
}) {
  const [form, setForm] = useState({
    specimenRequired: "",
    service: "",
  });

  useEffect(() => {
    if (row) {
      setForm({
        specimenRequired: row.specimenRequired || "",
        service: row.service || "",
      });
    }
  }, [row]);

  const patchForm = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  return (
<AppModal
  open={open}
  onClose={onClose}
  title="Map Service Edit"
  centered={false}
  mask={{ closable: false }}
  style={{ top: 20 }}
  className="map-services-modal"
  rootClassName="map-services-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={() => onSave(form)}>
            Save
          </Button>
        </>
      }
    >
      <MapServicesForm
        form={form}
        onPatchForm={patchForm}
        row={row}
        services={services}
      />
    </AppModal>
  );
}