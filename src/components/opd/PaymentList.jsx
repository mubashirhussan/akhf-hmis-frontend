'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, DatePicker, Input, Space, Tag, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import AgeUnitField from '@/components/ui/AgeUnitField';
import BillingVisitPaymentView from '@/components/opd/BillingVisitPaymentView';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import DataTable from '@/components/ui/DataTable';
import { MOCK_BILLING_VISIT_SERVICE_ROWS } from '@/data/mock-billing-visit-services';
import {
  MOCK_SERVICES_BILLING_VISITS,
  searchServicesBillingVisits,
  SERVICES_BILLING_STATUS_COLORS,
  SERVICES_BILLING_TYPE_COLORS,
} from '@/data/mock-services-billing';
import { buildOpdPaymentHref } from '@/lib/billing-navigation';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';

const controlClass = FIELD_CONTROL_CLASS;

const PAYMENT_ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function createDefaultVisitServiceRows() {
  return MOCK_BILLING_VISIT_SERVICE_ROWS.map((row) => ({ ...row }));
}

const emptyFilters = {
  visitNo: '',
  mrNo: '',
  patientAge: '',
  ageUnit: DOB_AGE_UNITS.years,
  registrationDate: null,
  cnic: '',
  mobile: '',
  firstName: '',
  middleName: '',
  lastName: '',
  relationFirstName: '',
  relationMiddleName: '',
  relationLastName: '',
};

function BillingTag({ value }) {
  const palette =
    SERVICES_BILLING_STATUS_COLORS[value] ??
    SERVICES_BILLING_TYPE_COLORS[value] ?? {
      bg: '#f1f5f9',
      color: '#475569',
      border: '#cbd5e1',
    };

  return (
    <Tag
      bordered
      className="services-billing-tag"
      style={{
        backgroundColor: palette.bg,
        color: palette.color,
        borderColor: palette.border,
      }}
    >
      {value}
    </Tag>
  );
}

export default function PaymentList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(emptyFilters);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [visitServiceRowsByVisitId, setVisitServiceRowsByVisitId] = useState({});

  const visitId = searchParams.get('visitId');
  const activeVisit = useMemo(
    () =>
      visitId
        ? (MOCK_SERVICES_BILLING_VISITS.find((visit) => visit.id === visitId) ?? null)
        : null,
    [visitId],
  );

  useEffect(() => {
    if (!visitId) return;

    setVisitServiceRowsByVisitId((prev) => {
      if (prev[visitId]) return prev;
      return { ...prev, [visitId]: createDefaultVisitServiceRows() };
    });
  }, [visitId]);

  const visitServiceRows = visitId ? (visitServiceRowsByVisitId[visitId] ?? []) : [];

  const openVisitPayment = useCallback(
    (record) => {
      router.push(buildOpdPaymentHref(record.id));
    },
    [router],
  );

  const patchFilter = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleSearch = () => {
    const matched = searchServicesBillingVisits(MOCK_SERVICES_BILLING_VISITS, filters);
    setResults(matched);
    setHasSearched(true);
  };

  const columns = useMemo(
    () => [
      { title: 'Visit No', dataIndex: 'visitNo', key: 'visitNo', width: 130 },
      { title: 'Reg No', dataIndex: 'regNo', key: 'regNo', width: 120 },
      { title: 'PF Name', dataIndex: 'patientName', key: 'patientName', width: 150 },
      { title: 'PL Name', dataIndex: 'plName', key: 'plName', width: 140 },
      { title: 'Relation', dataIndex: 'relation', key: 'relation', width: 88 },
      { title: 'Relation Name', dataIndex: 'relationName', key: 'relationName', width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 96 },
      { title: 'Gender', dataIndex: 'gender', key: 'gender', width: 88 },
      { title: 'Reg Date&Time', dataIndex: 'regDateTime', key: 'regDateTime', width: 168 },
      { title: 'CNIC', dataIndex: 'cnic', key: 'cnic', width: 150 },
      { title: 'Date&Time To', dataIndex: 'dateTimeTo', key: 'dateTimeTo', width: 168 },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (value) => <BillingTag value={value} />,
      },
      {
        title: 'Patient Type',
        dataIndex: 'patientType',
        key: 'patientType',
        width: 118,
        render: (value) => <BillingTag value={value} />,
      },
      {
        title: 'Checkup Type',
        dataIndex: 'checkupType',
        key: 'checkupType',
        width: 118,
        render: (value) => <BillingTag value={value} />,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 80,
        align: 'center',
        render: (_, record) => (
          <Space size={4} className="services-billing-actions-cell">
            <Tooltip title="Payment">
              <Button
                type="link"
                size="small"
                icon={
                  <AppIcon
                    icon="mdi:credit-card-outline"
                    className={PAYMENT_ACTION_ICON_CLASS}
                  />
                }
                aria-label="Payment"
                onClick={() => openVisitPayment(record)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [openVisitPayment],
  );

  if (activeVisit) {
    return <BillingVisitPaymentView visit={activeVisit} serviceRows={visitServiceRows} />;
  }

  return (
    <div className="services-billing-page opd-payment-page">
      <div className="walk-in-add-record-layout services-billing-search-layout">
        <FormGrid
          as="form"
          columns={4}
          className="walk-in-add-record-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <FloatingField label="Visit #" htmlFor="payment-visit-no">
            <Input
              id="payment-visit-no"
              className={controlClass}
              value={filters.visitNo}
              inputMode="numeric"
              maxLength={12}
              placeholder="e.g. 2026"
              onChange={(e) => {
                const visitNo = e.target.value.replace(/\D/g, '');
                patchFilter({ visitNo });
              }}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="MR #" htmlFor="payment-mr-no">
            <Input
              id="payment-mr-no"
              className={controlClass}
              value={filters.mrNo}
              onChange={(e) => patchFilter({ mrNo: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Patient Age" htmlFor="payment-patient-age">
            <AgeUnitField
              embedded
              className="patient-reg-dob-age age-unit-field--no-dob"
              ageInputId="payment-patient-age"
              age={filters.patientAge}
              unit={filters.ageUnit}
              onChange={({ age, unit }) => patchFilter({ patientAge: age, ageUnit: unit })}
            />
          </FloatingField>

          <FloatingField label="Registration Date" htmlFor="payment-reg-date">
            <DatePicker
              id="payment-reg-date"
              className={controlClass}
              value={filters.registrationDate}
              onChange={(registrationDate) => patchFilter({ registrationDate })}
              format="DD/MM/YYYY"
            />
          </FloatingField>

          <FloatingField label="CNIC #" htmlFor="payment-cnic">
            <Input
              id="payment-cnic"
              className={controlClass}
              value={filters.cnic}
              onChange={(e) => patchFilter({ cnic: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Mobile #" htmlFor="payment-mobile">
            <Input
              id="payment-mobile"
              className={controlClass}
              value={filters.mobile}
              onChange={(e) => patchFilter({ mobile: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="First Name" htmlFor="payment-first-name">
            <Input
              id="payment-first-name"
              className={controlClass}
              value={filters.firstName}
              onChange={(e) => patchFilter({ firstName: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Middle Name" htmlFor="payment-middle-name">
            <Input
              id="payment-middle-name"
              className={controlClass}
              value={filters.middleName}
              onChange={(e) => patchFilter({ middleName: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Last Name" htmlFor="payment-last-name">
            <Input
              id="payment-last-name"
              className={controlClass}
              value={filters.lastName}
              onChange={(e) => patchFilter({ lastName: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Relation First Name" htmlFor="payment-rel-first">
            <Input
              id="payment-rel-first"
              className={controlClass}
              value={filters.relationFirstName}
              onChange={(e) => patchFilter({ relationFirstName: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Relation Middle Name" htmlFor="payment-rel-middle">
            <Input
              id="payment-rel-middle"
              className={controlClass}
              value={filters.relationMiddleName}
              onChange={(e) => patchFilter({ relationMiddleName: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Relation Last Name" htmlFor="payment-rel-last">
            <Input
              id="payment-rel-last"
              className={controlClass}
              value={filters.relationLastName}
              onChange={(e) => patchFilter({ relationLastName: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <div className="services-billing-search-actions">
            <Button
              type="primary"
              htmlType="submit"
              className="walk-in-search-btn services-billing-search-btn"
            >
              Search
            </Button>
          </div>
        </FormGrid>
      </div>

      <section className="services-billing-results" aria-label="Payment search results">
        <DataTable
          className="data-table--billing-results"
          columns={columns}
          dataSource={results}
          rowKey="id"
          columnAlign="left"
          pagination={false}
          scroll={{ x: false }}
          tableLayout="auto"
          locale={{
            emptyText: hasSearched
              ? 'No visits found'
              : 'Use the search form above to find visits for payment',
          }}
        />
      </section>
    </div>
  );
}
