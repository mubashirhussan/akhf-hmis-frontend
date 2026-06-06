'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import { App, Button, Checkbox, Input, Select } from 'antd';
import BillingPatientHeaderCard from '@/components/opd/BillingPatientHeaderCard';
import DataTable from '@/components/ui/DataTable';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import {
  BILLING_PACKAGE_OPTIONS,
  BILLING_REFERENCE_OPTIONS,
  BILLING_SERVICE_CATEGORY_OPTIONS,
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
import { useConfirm } from '@/hooks/useConfirm';
import { BILLING_VIEW_PAYMENT } from '@/lib/billing-navigation';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { BILLING_VISIT_SERVICES_TABLE_SCROLL_Y } from '@/lib/table-scroll';

const controlClass = FIELD_CONTROL_CLASS;

export default function BillingVisitServicesView({ visit, serviceRows, setServiceRows }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const patient = useMemo(() => buildBillingPatientSummary(visit), [visit]);

  const openPayment = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('visitId', visit.id);
    params.set('view', BILLING_VIEW_PAYMENT);
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams, visit.id]);

  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reference, setReference] = useState(undefined);
  const [packageId, setPackageId] = useState(undefined);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [resultsPage] = useState(1);
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

  const handleRemove = async (rowId, serviceName) => {
    const confirmed = await confirmDelete({ itemName: serviceName });

    if (confirmed) {
      setServiceRows((prev) => prev.filter((row) => row.id !== rowId));
    }
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
            onClick={() => handleRemove(record.id, record.serviceName)}
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
      <BillingPatientHeaderCard patient={patient} />

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

       

        <FloatingField label="Select Refer" htmlFor="billing-svc-reference">
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
          wrapClassName="billing-visit-services-table-wrap"
          columns={columns}
          dataSource={serviceRows}
          rowKey="id"
          columnAlign="left"
          pagination={false}
          scroll={{ x: false, y: BILLING_VISIT_SERVICES_TABLE_SCROLL_Y }}
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
        <Button className="billing-visit-services-payment-btn" onClick={openPayment}>
          Payment
        </Button>
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
