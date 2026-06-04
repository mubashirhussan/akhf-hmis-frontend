"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Checkbox, Col, Input, message, Row, Select } from "antd";
import { useHmisConfirm } from "@/hooks/useHmisConfirm";
import { HMIS_FIELD_CONTROL_CLASS } from "@/lib/hmis-field-control";
import AddedServicesPanel from "@/components/opd/AddedServicesPanel";
import {
  MOCK_DOCTORS,
  MOCK_SERVICES,
  formatPkr,
  formatServiceDateTime,
  paginateServices,
  searchServices,
} from "@/data/mock-walk-in-services";

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
  const { confirmDelete } = useHmisConfirm();
  const isSidebar = variant === "sidebar";
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [resultsPage, setResultsPage] = useState(1);
  const [addedServices, setAddedServices] = useState([]);

  const { items: pagedResults, total: resultsTotal } = useMemo(
    () => paginateServices(searchResults, resultsPage),
    [searchResults, resultsPage],
  );

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setHasSearched(false);
      setSearchResults([]);
      setResultsPage(1);
      return;
    }

    const timer = setTimeout(() => {
      const matched = searchServices(MOCK_SERVICES, category, query);
      setSearchResults(matched);
      setResultsPage(1);
      setHasSearched(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [category, searchQuery]);

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
      prev.map((row) =>
        row.id === rowId ? { ...row, quantity: nextQty } : row,
      ),
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
    setHasSearched(false);
    setSearchResults([]);
    setSearchQuery("");
    setResultsPage(1);
  };

  const handleSave = () => {
    message.success("Record saved successfully.");
    // TODO: wire save walk-in record API
  };

  const selectedServiceValues = useMemo(
    () => addedServices.map((row) => row.serviceId),
    [addedServices],
  );

  const selectedServiceSet = useMemo(
    () => new Set(selectedServiceValues),
    [selectedServiceValues],
  );

  const serviceSelectOptions = useMemo(
    () =>
      pagedResults.map((service) => ({
        value: service.id,
        label: `${service.name} (${formatPkr(service.price)})`,
      })),
    [pagedResults],
  );

  const serviceResultsDropdown = (
    <div className="walk-in-service-results-dropdown-wrap">
      <Select
        size="middle"
        mode="multiple"
        allowClear
        className={`w-full ${HMIS_FIELD_CONTROL_CLASS}`}
        placeholder="Select services"
        value={selectedServiceValues}
        options={serviceSelectOptions}
        onChange={handleSelectedServicesChange}
        disabled={!hasSearched}
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
      {/* <p className="walk-in-service-results-count">
        Showing {pagedResults.length} of {resultsTotal} results
      </p> */}
    </div>
  );

  const searchFilters = isSidebar ? (
    <div className="walk-in-services-filters">
      <div className="walk-in-services-filters-top">
        <Select
          size="middle"
          className={`walk-in-services-filter-category ${HMIS_FIELD_CONTROL_CLASS}`}
          value={category}
          options={SERVICE_CATEGORY_OPTIONS}
          onChange={setCategory}
        />
        <Input
          size="middle"
          className={`walk-in-services-filter-input ${HMIS_FIELD_CONTROL_CLASS}`}
          placeholder="Search Services"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
        />
      </div>
      <div className="walk-in-services-filter-multiselect">{serviceResultsDropdown}</div>
    </div>
  ) : (
    <Row gutter={[12, 12]} align="stretch" className="walk-in-services-filters-grid">
      <Col xs={24} md={8} className="walk-in-services-filters-grid-col">
        <Select
          size="middle"
          className={`w-full ${HMIS_FIELD_CONTROL_CLASS}`}
          value={category}
          options={SERVICE_CATEGORY_OPTIONS}
          onChange={setCategory}
        />
      </Col>
      <Col xs={24} md={16} className="walk-in-services-filters-grid-col">
        <Row
          gutter={[12, 12]}
          align="stretch"
          wrap={false}
          className="walk-in-services-filters-grid-right"
        >
          <Col span={10}>
            <Input
              size="middle"
              className={HMIS_FIELD_CONTROL_CLASS}
              placeholder="Search Services"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
            />
          </Col>
          <Col span={14}>{serviceResultsDropdown}</Col>
        </Row>
      </Col>
    </Row>
  );

  return (
    <section
      className={`walk-in-services-section ${isSidebar ? "walk-in-services-section--sidebar" : ""}`}
    >
      <div
        className={`walk-in-services-block ${isSidebar ? "walk-in-services-block--sidebar" : ""}`}
      >
        <div
          className={`hmis-section-header ${isSidebar ? "hmis-section-header--stacked" : "hmis-section-header--inline mt-4"}`}
        >
          <div className="hmis-section-header-text">
            <h2 className="hmis-section-title">Add Services</h2>
          </div>
          <div className="hmis-section-header-extra">{searchFilters}</div>
        </div>
        {!hasSearched ? (
          <div className="walk-in-services-illustration">
            <Image
              src="/hmis-base-img.svg"
              alt="Search services illustration"
              width={200}
              height={175}
              className="walk-in-services-illustration-img"
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        ) : isSidebar ? (
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
        )}
      </div>
    </section>
  );
}
