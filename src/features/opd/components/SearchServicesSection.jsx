"use client";

import { useMemo, useState } from "react";
import { App, Checkbox, Col, Row, Select } from "antd";
import { useConfirm } from "@/hooks/useConfirm";
import { FIELD_CONTROL_CLASS } from "@/lib/field-control";
import AddedServicesPanel from "@/features/opd/components/AddedServicesPanel";
import { useSearchOpdServicesQuery } from "@/features/opd/api/opdEndpoints";
import {
  SERVICE_CATEGORY_OPTIONS,
  SERVICE_CATEGORY_MAP,
} from "@/features/opd/pages/walk-in-patient/walk-in-patient-options";
import { formatServiceDateTime, formatPkr } from "@/features/opd/api/mock-walk-in-services";

function createAddedService(service) {
  return {
    id: `added-${service.S_ID}-${Date.now()}`,
    serviceId: service.S_ID,
    name: service.S_Name,
    price: service.S_Amount ?? 0,
    quantity: 1,
    discount: 0,
    doctorId: null,
    addedAt: formatServiceDateTime(),
  };
}

export default function SearchServicesSection({
  variant = "full",
  addedServices,
  onAddedServicesChange,
  consultantOptions = [],
  onSave,
  onCancel,
  isSaving = false,
}) {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const isSidebar = variant === "sidebar";
  const [category, setCategory] = useState("all");

  const { data: allServices = [] } = useSearchOpdServicesQuery();

  const serviceOptions = useMemo(
    () =>
      allServices
        .filter((s) => category === "all" || s.S_Category === category)
        .map((s) => ({
          value: s.S_ID,
          label: `${s.S_Name}${s.Display_Rate ? ` (PKR ${s.Display_Rate})` : s.S_Amount ? ` (${formatPkr(s.S_Amount)})` : ""}`,
        })),
    [allServices, category],
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
    onAddedServicesChange((prev) => {
      const existingMap = new Map(prev.map((row) => [row.serviceId, row]));
      return selectedIds
        .map((serviceId) => {
          const existing = existingMap.get(serviceId);
          if (existing) return existing;
          const service = allServices.find((s) => s.S_ID === serviceId);
          return service ? createAddedService(service) : null;
        })
        .filter(Boolean);
    });
  };

  const handleQuantityChange = (rowId, quantity) => {
    const nextQty = Math.max(1, quantity);
    onAddedServicesChange((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, quantity: nextQty } : row)),
    );
  };

  const handleDoctorChange = (rowId, doctorId) => {
    onAddedServicesChange((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, doctorId } : row)),
    );
  };

  const handleRemove = async (rowId) => {
    const row = addedServices.find((item) => item.id === rowId);
    const confirmed = await confirmDelete({ itemName: row?.name });
    if (confirmed) {
      onAddedServicesChange((prev) => prev.filter((item) => item.id !== rowId));
    }
  };

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
          onChange={(val) => setCategory(val)}
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
          onChange={(val) => setCategory(val)}
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
            consultantOptions={consultantOptions}
            onQuantityChange={handleQuantityChange}
            onDoctorChange={handleDoctorChange}
            onRemove={handleRemove}
            onCancel={onCancel}
            onSave={onSave}
            isSaving={isSaving}
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
            consultantOptions={consultantOptions}
            onQuantityChange={handleQuantityChange}
            onDoctorChange={handleDoctorChange}
            onRemove={handleRemove}
            onCancel={onCancel}
            onSave={onSave}
            isSaving={isSaving}
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