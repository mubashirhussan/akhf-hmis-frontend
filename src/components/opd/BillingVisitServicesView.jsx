'use client';

import { useEffect, useMemo, useState } from 'react';
import { DeleteOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { App, Avatar, Button, Checkbox, Input, Select } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import {
  BILLING_PACKAGE_OPTIONS,
  BILLING_REFERENCE_OPTIONS,
  BILLING_SERVICE_CATEGORY_OPTIONS,
  MOCK_BILLING_VISIT_SERVICE_ROWS,
  buildBillingPatientSummary,
  calcBillingServicesGrandTotal,
  createBillingServiceRow,
} from '@/data/mock-billing-visit-services';
import {
  MOCK_DOCTORS,
  MOCK_SERVICES,
  formatPkr,
  paginateServices,
  searchServices,
} from '@/data/mock-walk-in-services';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function BillingVisitServicesView({ visit, onBack }) {
  const { message } = App.useApp();
  const patient = useMemo(() => buildBillingPatientSummary(visit), [visit]);

  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reference, setReference] = useState(undefined);
  const [packageId, setPackageId] = useState(undefined);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [resultsPage] = useState(1);
  const [serviceRows, setServiceRows] = useState(() =>
    MOCK_BILLING_VISIT_SERVICE_ROWS.map((row) => ({ ...row })),
  );

  const { items: pagedResults } = useMemo(
    () => paginateServices(searchResults, resultsPage),
    [searchResults, resultsPage],
  );

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const matched = searchServices(MOCK_SERVICES, category, query);
      setSearchResults(matched);
      setHasSearched(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [category, searchQuery]);

  const selectedServiceValues = useMemo(
    () => serviceRows.map((row) => row.serviceId).filter(Boolean),
    [serviceRows],
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

  const handleSelectedServicesChange = (selectedIds) => {
    setServiceRows((prev) => {
      const existingMap = new Map(prev.map((row) => [row.serviceId, row]));

      return selectedIds
        .map((serviceId) => {
          const existing = existingMap.get(serviceId);
          if (existing) return existing;

          const service = MOCK_SERVICES.find((item) => item.id === serviceId);
          return service ? createBillingServiceRow(service) : null;
        })
        .filter(Boolean);
    });
  };

  const grandTotal = useMemo(() => calcBillingServicesGrandTotal(serviceRows), [serviceRows]);

  const handleDoctorChange = (rowId, doctorId) => {
    setServiceRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, doctorId } : row)),
    );
  };

  const handleRemove = (rowId) => {
    setServiceRows((prev) => prev.filter((row) => row.id !== rowId));
  };

  const columns = useMemo(
    () => [
      { title: 'Date', dataIndex: 'date', key: 'date', width: 110 },
      {
        title: 'Services',
        dataIndex: 'serviceName',
        key: 'serviceName',
        width: 220,
      },
      {
        title: 'Charges',
        key: 'charges',
        width: 100,
        render: (_, record) => formatPkr(record.charges),
      },
      {
        title: 'System Discount',
        key: 'systemDiscount',
        width: 120,
        render: (_, record) => formatPkr(record.systemDiscount),
      },
      {
        title: 'Manual Discount',
        key: 'manualDiscount',
        width: 120,
        render: (_, record) => formatPkr(record.manualDiscount),
      },
      {
        title: 'Doctor',
        key: 'doctor',
        width: 140,
        render: (_, record) => (
          <Select
            className={`w-full ${controlClass}`}
            value={record.doctorId}
            options={MOCK_DOCTORS.map((d) => ({ value: d.id, label: d.name }))}
            onChange={(value) => handleDoctorChange(record.id, value)}
          />
        ),
      },
      { title: 'Qty', dataIndex: 'qty', key: 'qty', width: 64, align: 'center' },
      { title: 'Date', dataIndex: 'serviceDate', key: 'serviceDate', width: 110 },
      {
        title: 'Panel Amount',
        key: 'panelAmount',
        width: 110,
        render: (_, record) => formatPkr(record.panelAmount),
      },
      {
        title: 'Action',
        key: 'action',
        width: 72,
        align: 'center',
        render: (_, record) => (
          <button
            type="button"
            className="walk-in-service-delete-btn"
            onClick={() => handleRemove(record.id)}
            aria-label="Remove service"
          >
            <DeleteOutlined />
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="billing-visit-services-page">
      <div className="billing-visit-services-toolbar">
        <button type="button" className="billing-visit-services-back" onClick={onBack}>
          <span className="billing-visit-services-back-icon" aria-hidden>
            <AppIcon icon="mdi:arrow-left" className="h-[15px] w-[15px]" />
          </span>
          <span>Back to search</span>
        </button>

        <div className="billing-visit-services-visit-chip">
          <span className="billing-visit-services-visit-label">Visit</span>
          <span className="billing-visit-services-visit-no">#{visit?.visitNo}</span>
          <span className="billing-visit-services-visit-divider" aria-hidden />
          <span className="billing-visit-services-visit-name">{visit?.patientName}</span>
        </div>
      </div>

      <section className="billing-patient-header-card">
        <div className="billing-patient-header-body">
          <div className="billing-patient-header-main">
            <Avatar size={64} icon={<UserOutlined />} className="billing-patient-avatar" />

            <div className="billing-patient-header-info">
              <div className="billing-patient-name-row">
                <h2 className="billing-patient-name">{patient.displayName}</h2>
                <span className="billing-patient-relation-inline">
                  {patient.relationPrefix} {patient.relationName}
                </span>
              </div>

              <div className="billing-patient-meta-row">
                <span className="billing-patient-meta-item">
                  <AppIcon icon="mdi:account-group-outline" className="billing-patient-meta-icon" />
                  {patient.ageDetail}
                </span>
                <span className="billing-patient-meta-divider" aria-hidden />
                <span className="billing-patient-meta-item">
                  <AppIcon icon="mdi:calendar-outline" className="billing-patient-meta-icon" />
                  {patient.dob}
                </span>
                <span className="billing-patient-meta-divider" aria-hidden />
                <span className="billing-patient-meta-item">
                  <AppIcon
                    icon={
                      patient.gender?.toLowerCase() === 'female'
                        ? 'mdi:gender-female'
                        : 'mdi:gender-male'
                    }
                    className="billing-patient-meta-icon"
                  />
                  {patient.gender}
                </span>
              </div>

              <p className="billing-patient-department">{patient.department}</p>

              <div className="billing-patient-id-row">
                <span className="billing-patient-id-item">
                  MR # <strong className="billing-patient-id-value">{patient.mrNo}</strong>
                </span>
                <span className="billing-patient-meta-divider" aria-hidden />
                <span className="billing-patient-id-item">
                  Patient Type{' '}
                  <strong className="billing-patient-id-value">{patient.patientType}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="billing-patient-header-side">
            <Button
              className="billing-patient-report-btn"
              icon={<AppIcon icon="mdi:file-document-outline" className="h-4 w-4" />}
            >
              Patient Report
            </Button>

            <div className="billing-patient-doctor-card">
              <span className="billing-patient-doctor-accent" aria-hidden />
              <button type="button" className="billing-patient-doctor-handle" aria-label="More options">
                <AppIcon icon="mdi:dots-grid" className="h-4 w-4" />
              </button>

              <div className="billing-patient-doctor-avatar-wrap">
                <Avatar size={40} icon={<UserOutlined />} className="billing-patient-doctor-avatar" />
                {patient.checkupType === 'Emergency' && (
                  <span className="billing-patient-doctor-emergency-badge" aria-hidden>
                    <AppIcon icon="mdi:alert-decagram" className="h-[11px] w-[11px]" />
                  </span>
                )}
              </div>

              <div className="billing-patient-doctor-text">
                {patient.checkupType === 'Emergency' ? (
                  <div className="billing-patient-emergency-row">
                    <span className="billing-patient-emergency-pill">
                      <AppIcon icon="mdi:alert-decagram" className="h-[10px] w-[10px]" />
                      Emergency
                    </span>
                    <span className="billing-patient-emergency-slash">/Emergency</span>
                  </div>
                ) : (
                  <span className="billing-patient-checkup-pill">{patient.checkupType}</span>
                )}
                <p className="billing-patient-doctor-name">{patient.doctor}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FormGrid columns={5} className="walk-in-add-record-form billing-visit-services-filters">
        <FloatingField label="Category" htmlFor="billing-svc-category">
          <Select
            id="billing-svc-category"
            className={controlClass}
            value={category}
            options={BILLING_SERVICE_CATEGORY_OPTIONS}
            onChange={setCategory}
          />
        </FloatingField>

        <FloatingField label="Search Services" htmlFor="billing-svc-search">
          <Input
            id="billing-svc-search"
            className={controlClass}
            placeholder="Search Services here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
        </FloatingField>

        <FloatingField label="Select Reference" htmlFor="billing-svc-reference">
          <Select
            id="billing-svc-reference"
            className={controlClass}
            placeholder="Select Reference"
            value={reference}
            allowClear
            options={BILLING_REFERENCE_OPTIONS}
            onChange={setReference}
          />
        </FloatingField>

        <FloatingField label="Select Packages" htmlFor="billing-svc-package">
          <Select
            id="billing-svc-package"
            className={controlClass}
            placeholder="Select Packages"
            value={packageId}
            allowClear
            options={BILLING_PACKAGE_OPTIONS}
            onChange={setPackageId}
          />
        </FloatingField>

        <FloatingField label="Select Services" htmlFor="billing-svc-select">
          <div className="walk-in-service-results-dropdown-wrap">
            <Select
              id="billing-svc-select"
              size="middle"
              mode="multiple"
              allowClear
              className={`w-full ${controlClass}`}
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
          </div>
        </FloatingField>
      </FormGrid>

      <section className="billing-visit-services-table-section" aria-label="Visit services">
        <DataTable
          className="data-table--billing-visit-services"
          columns={columns}
          dataSource={serviceRows}
          rowKey="id"
          columnAlign="left"
          pagination={false}
          scroll={{ x: false }}
          locale={{ emptyText: 'No services added for this visit' }}
        />

        {serviceRows.length > 0 && (
          <div className="billing-visit-services-total-bar">
            <strong className="billing-visit-services-total-label">Grand Total</strong>
            <strong className="billing-visit-services-grand-total">{formatPkr(grandTotal)}</strong>
          </div>
        )}
      </section>

      <div className="billing-visit-services-footer-actions">
        <Button className="billing-visit-services-payment-btn">Payment</Button>
        <Button
          type="primary"
          className="billing-visit-services-update-btn"
          icon={<SyncOutlined />}
          onClick={() => message.success('Services updated successfully.')}
        >
          Update
        </Button>
      </div>
    </div>
  );
}
