'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import { App, Button, Form, Select } from 'antd';
import PatientInfoHeaderCard from '@/features/patient/components/PatientInfoHeaderCard';
import DataTable from '@/components/ui/DataTable';
import DynamicForm from '@/components/form/DynamicForm';
import {
  buildBillingPatientSummary,
  calcBillingServicesGrandTotal,
  createBillingServiceRow,
} from '@/features/billing/api/mock-billing-visit-services';
import {
  MOCK_DOCTORS,
  MOCK_SERVICES,
  formatPkr,
  paginateServices,
  searchServices,
} from '@/features/opd/api/mock-walk-in-services';
import { useConfirm } from '@/hooks/useConfirm';
import { buildOpdPaymentHref } from '@/features/billing/utils/billing-navigation';
import {
  BILLING_VISIT_SERVICES_FILTER_INITIAL_VALUES,
  getBillingVisitServicesFilterFields,
} from '@/features/billing/pages/services-billing/billing-visit-services-fields';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { BILLING_VISIT_SERVICES_TABLE_SCROLL_Y } from '@/lib/table-scroll';

const controlClass = FIELD_CONTROL_CLASS;

export default function BillingVisitServicesView({ visit, serviceRows, setServiceRows, loading = false }) {
  const router = useRouter();
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [filterForm] = Form.useForm();
  const patient = useMemo(() => buildBillingPatientSummary(visit), [visit]);

  const openPayment = useCallback(() => {
    router.push(buildOpdPaymentHref(visit.id));
  }, [router, visit.id]);

  const category = Form.useWatch('category', filterForm) ?? 'all';
  const searchQuery = Form.useWatch('searchQuery', filterForm) ?? '';
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [resultsPage] = useState(1);
  const { items: pagedResults } = useMemo(
    () => paginateServices(searchResults, resultsPage),
    [searchResults, resultsPage],
  );

  useEffect(() => {
    const query = String(searchQuery ?? '').trim();

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

  useEffect(() => {
    filterForm.setFieldsValue({ selectedServices: selectedServiceValues });
  }, [filterForm, selectedServiceValues]);

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

  const filterFields = useMemo(
    () =>
      getBillingVisitServicesFilterFields({
        serviceSelectOptions,
        selectedServiceSet,
        hasSearched,
      }),
    [hasSearched, selectedServiceSet, serviceSelectOptions],
  );

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
      <PatientInfoHeaderCard patient={patient} />

      <Form
        form={filterForm}
        layout="vertical"
        initialValues={BILLING_VISIT_SERVICES_FILTER_INITIAL_VALUES}
        className="walk-in-add-record-form billing-visit-services-filters"
        onValuesChange={(changed) => {
          if ('selectedServices' in changed) {
            handleSelectedServicesChange(changed.selectedServices ?? []);
          }
        }}
      >
        <DynamicForm fields={filterFields} gutter={[16, 12]} />
      </Form>

      <section className="billing-visit-services-table-section" aria-label="Visit services">
        <DataTable
          wrapClassName="billing-visit-services-table-wrap"
          columns={columns}
          dataSource={serviceRows}
          loading={loading}
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
