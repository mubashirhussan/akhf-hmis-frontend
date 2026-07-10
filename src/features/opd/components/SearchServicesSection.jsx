"use client";

import { useMemo, useState } from "react";
import { App, Checkbox, Col, Row, Select } from "antd";
import { useConfirm } from "@/hooks/useConfirm";
import { FIELD_CONTROL_CLASS } from "@/lib/field-control";
import AddedServicesPanel from "@/features/opd/components/AddedServicesPanel";
import {
  MOCK_DOCTORS,
  MOCK_SERVICES,
  formatPkr,
  formatServiceDateTime,
} from "@/features/opd/api/mock-walk-in-services";

const SERVICE_CATEGORY_OPTIONS = [
  { value: "all", label: "All Category" },
  { value: "consultation", label: "Consultation" },
  { value: "laboratory", label: "Laboratory" },
  { value: "radiology", label: "Radiology" },
];

function createAddedService(service) {
  return {
    id: `added-${service.id}-${Date.now()}`,
    serviceId: service.id,
    name: service.name,
    price: service.price,
    quantity: 1,
    discount: 0,
    doctorId: MOCK_DOCTORS[0].id,
    addedAt: formatServiceDateTime(),
  };
}

export default function SearchServicesSection({ variant = "full" }) {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const isSidebar = variant === "sidebar";
  const [category, setCategory] = useState("all");
  const [addedServices, setAddedServices] = useState([]);

  // Filter MOCK_SERVICES by selected category — no search input needed
  const serviceOptions = useMemo(
    () =>
      MOCK_SERVICES.filter(
        (s) => category === "all" || s.category === category,
      ).map((s) => ({
        value: s.id,
        label: `${s.name} (${formatPkr(s.price)})`,
      })),
    [category],
  );

  const selectedServiceValues = useMemo(
    () => addedServices.map((row) => row.serviceId),
    [addedServices],
  );

  const selectedServiceSet = useMemo(
    () => new Set(selectedServiceValues),
    [selectedServiceValues],
  );

  const handleSelectedServicesChange = (selectedIds) => {
    setAddedServices((prev) => {
      const existingMap = new Map(prev.map((row) => [row.serviceId, row]));

      return selectedIds
        .map((serviceId) => {
          const existing = existingMap.get(serviceId);
          if (existing) return existing;

          const service = MOCK_SERVICES.find((s) => s.id === serviceId);
          return service ? createAddedService(service) : null;
        })
        .filter(Boolean);
    });
  };

  const handleQuantityChange = (rowId, quantity) => {
    const nextQty = Math.max(1, quantity);
    setAddedServices((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, quantity: nextQty } : row)),
    );
  };

  const handleDoctorChange = (rowId, doctorId) => {
    setAddedServices((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, doctorId } : row)),
    );
  };

  const handleRemove = async (rowId) => {
    const row = addedServices.find((item) => item.id === rowId);
    const confirmed = await confirmDelete({ itemName: row?.name });

    if (confirmed) {
      setAddedServices((prev) => prev.filter((item) => item.id !== rowId));
    }
  };

  const handleCancel = () => {
    setAddedServices([]);
  };

  const handleSave = () => {
    message.success("Record saved successfully.");
    // TODO: wire save walk-in record API
  };

  // The service select dropdown — category drives its options, no search input
  const serviceSelectDropdown = (
    <div className="walk-in-service-results-dropdown-wrap">
      <Select
        size="middle"
        mode="multiple"
        allowClear
        className={`w-full ${FIELD_CONTROL_CLASS}`}
        placeholder="Select services"
        value={selectedServiceValues}
        options={serviceOptions}
        onChange={handleSelectedServicesChange}
        maxTagCount={1}
        maxTagTextLength={26}
        maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
        optionRender={(option) => (
          <div className="walk-in-service-option">
            <Checkbox
              checked={selectedServiceSet.has(option.value)}
              tabIndex={-1}
              className="walk-in-service-option-checkbox"
            />
            <span className="walk-in-service-option-label">{option.label}</span>
          </div>
        )}
      />
    </div>
  );

  const searchFilters = isSidebar ? (
    <div className="walk-in-services-filters">
      <div className="walk-in-services-filters-top">
        <Select
          size="middle"
          className={`walk-in-services-filter-category ${FIELD_CONTROL_CLASS}`}
          value={category}
          options={SERVICE_CATEGORY_OPTIONS}
          onChange={(val) => {
            setCategory(val);
          }}
        />
        {serviceSelectDropdown}
      </div>
    </div>
  ) : (
    <Row gutter={[12, 12]} align="stretch" className="walk-in-services-filters-grid">
      <Col xs={24} md={10} className="walk-in-services-filters-grid-col">
        <Select
          size="middle"
          className={`w-full ${FIELD_CONTROL_CLASS}`}
          value={category}
          options={SERVICE_CATEGORY_OPTIONS}
          onChange={(val) => {
            setCategory(val);
          }}
        />
      </Col>
      <Col xs={24} md={13} className="walk-in-services-filters-grid-col">
        {serviceSelectDropdown}
      </Col>
    </Row>
  );

  const servicesBody = isSidebar ? (
    <div className="walk-in-services-body walk-in-services-body--sidebar">
      <div className="walk-in-services-content walk-in-services-content--stacked">
        <div className="walk-in-services-content-row">
          <AddedServicesPanel
            variant="sidebar"
            services={addedServices}
            doctors={MOCK_DOCTORS}
            onQuantityChange={handleQuantityChange}
            onDoctorChange={handleDoctorChange}
            onRemove={handleRemove}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="walk-in-services-body">
      <div className="walk-in-services-content walk-in-services-content--stacked">
        <div className="walk-in-services-content-row walk-in-services-content-row--full">
          <AddedServicesPanel
            services={addedServices}
            doctors={MOCK_DOCTORS}
            onQuantityChange={handleQuantityChange}
            onDoctorChange={handleDoctorChange}
            onRemove={handleRemove}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );

  return (
    <section
      className={`walk-in-services-section ${isSidebar ? "walk-in-services-section--sidebar" : ""}`}
    >
      <div
        className={`walk-in-services-block ${isSidebar ? "walk-in-services-block--sidebar" : ""}`}
      >
        <div
          className={`section-header ${isSidebar ? "section-header--stacked" : "section-header--inline mt-4"}`}
        >
          <div className="section-header-text">
            <h2 className="section-title">Add Services</h2>
          </div>
          <div className="section-header-extra">{searchFilters}</div>
        </div>
        {servicesBody}
      </div>
    </section>
  );
}