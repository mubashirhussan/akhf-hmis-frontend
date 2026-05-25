'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Button, Checkbox, Col, Input, message, Pagination, Row, Select } from 'antd';
import HmisCard from '@/components/ui/HmisCard';
import AddedServicesPanel from '@/components/opd/AddedServicesPanel';
import {
  MOCK_DOCTORS,
  MOCK_SERVICES,
  formatPkr,
  formatServiceDateTime,
  paginateServices,
  searchServices,
} from '@/data/mock-walk-in-services';

const SERVICE_CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Category' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'radiology', label: 'Radiology' },
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

export default function SearchServicesSection({ variant = 'full' }) {
  const isSidebar = variant === 'sidebar';
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [resultsPage, setResultsPage] = useState(1);
  const [addedServices, setAddedServices] = useState([]);

  const { items: pagedResults, total: resultsTotal } = useMemo(
    () => paginateServices(searchResults, resultsPage),
    [searchResults, resultsPage],
  );

  const addedServiceIds = useMemo(
    () => new Set(addedServices.map((s) => s.serviceId)),
    [addedServices],
  );

  const handleSearch = () => {
    const matched = searchServices(MOCK_SERVICES, category, searchQuery);
    setSearchResults(matched);
    setResultsPage(1);
    setHasSearched(true);
  };

  const handleToggleService = (service, checked) => {
    if (checked) {
      if (addedServiceIds.has(service.id)) return;
      setAddedServices((prev) => [...prev, createAddedService(service)]);
      return;
    }

    setAddedServices((prev) => prev.filter((row) => row.serviceId !== service.id));
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

  const handleRemove = (rowId) => {
    setAddedServices((prev) => prev.filter((row) => row.id !== rowId));
  };

  const handleCancel = () => {
    setAddedServices([]);
    setHasSearched(false);
    setSearchResults([]);
    setSearchQuery('');
    setResultsPage(1);
  };

  const handleSave = () => {
    message.success('Record saved successfully.');
    // TODO: wire save walk-in record API
  };

  const searchFilters = isSidebar ? (
    <div className="walk-in-services-filters">
      <Select
        className="walk-in-services-filter-category"
        value={category}
        options={SERVICE_CATEGORY_OPTIONS}
        onChange={setCategory}
      />
      <Input
        className="walk-in-services-filter-input"
        placeholder="Search Services"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onPressEnter={handleSearch}
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
      />
      <Button type="primary" className="walk-in-search-btn walk-in-services-filter-btn" onClick={handleSearch}>
        Search
      </Button>
    </div>
  ) : (
    <Row gutter={[12, 12]} align="middle" justify="end" wrap>
      <Col xs={24} sm={8} md={8}>
        <Select
          className="w-full"
          value={category}
          options={SERVICE_CATEGORY_OPTIONS}
          onChange={setCategory}
        />
      </Col>
      <Col xs={24} sm={10} md={11}>
        <Input
          placeholder="Search Services"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onPressEnter={handleSearch}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
        />
      </Col>
      <Col xs={24} sm={6} md={5}>
        <Button type="primary" className="walk-in-search-btn w-full" onClick={handleSearch}>
          Search
        </Button>
      </Col>
    </Row>
  );

  const serviceResultsList = (
    <div className="walk-in-service-results">
      {pagedResults.length === 0 ? (
        <p className="walk-in-service-results-empty">No services found</p>
      ) : (
        <ul className="walk-in-service-results-list">
          {pagedResults.map((service) => {
            const isChecked = addedServiceIds.has(service.id);

            return (
              <li
                key={service.id}
                className={`walk-in-service-result-item ${isChecked ? 'walk-in-service-result-item--selected' : ''}`}
              >
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => handleToggleService(service, e.target.checked)}
                />
                <span className="walk-in-service-result-name">{service.name}</span>
                <span className="walk-in-service-result-price">{formatPkr(service.price)}</span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="walk-in-service-results-footer">
        <span className="walk-in-service-results-count">
          Showing {pagedResults.length} of {resultsTotal} results
        </span>
        {resultsTotal > 0 && (
          <Pagination
            size="small"
            current={resultsPage}
            total={resultsTotal}
            pageSize={10}
            showSizeChanger={false}
            onChange={setResultsPage}
          />
        )}
      </div>
    </div>
  );

  return (
    <section className={`walk-in-services-section ${isSidebar ? 'walk-in-services-section--sidebar' : ''}`}>
      <HmisCard
        className={`walk-in-services-card ${isSidebar ? 'walk-in-services-card--sidebar' : ''}`}
        title="Search Services"
        headerLayout={isSidebar ? 'stacked' : 'inline'}
        headerExtra={searchFilters}
      >
        {!hasSearched ? (
          <div className="walk-in-services-illustration">
            <Image
              src="/hmis-base-img.svg"
              alt="Search services illustration"
              width={320}
              height={280}
              className="walk-in-services-illustration-img"
              priority={false}
            />
          </div>
        ) : isSidebar ? (
          <div className="walk-in-services-body walk-in-services-body--sidebar">
            <div className="walk-in-services-content walk-in-services-content--stacked">
              <div className="walk-in-services-content-row">{serviceResultsList}</div>
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
            <Row gutter={[20, 20]} className="walk-in-services-content">
              <Col xs={24} xl={10}>
                {serviceResultsList}
              </Col>
              <Col xs={24} xl={14}>
                <AddedServicesPanel
                  services={addedServices}
                  doctors={MOCK_DOCTORS}
                  onQuantityChange={handleQuantityChange}
                  onDoctorChange={handleDoctorChange}
                  onRemove={handleRemove}
                  onCancel={handleCancel}
                  onSave={handleSave}
                />
              </Col>
            </Row>
          </div>
        )}
      </HmisCard>
    </section>
  );
}
