'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Form, Space, Tag, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AppIcon from '@/components/icons/AppIcon';
import DynamicForm from '@/components/form/DynamicForm';
import BillingVisitPaymentView from '@/features/billing/pages/payment/BillingVisitPaymentView';
import DataTable from '@/components/ui/DataTable';
import {
  SERVICES_BILLING_STATUS_COLORS,
  SERVICES_BILLING_TYPE_COLORS,
} from '@/features/billing/api/mock-services-billing';
import {
  useGetBillingVisitQuery,
  useGetBillingVisitServicesQuery,
  useLazySearchBillingVisitsQuery,
} from '@/features/billing/api/billingEndpoints';
import { buildOpdPaymentHref } from '@/features/billing/utils/billing-navigation';
import {
  BILLING_VISIT_FILTER_FIELDS,
  BILLING_VISIT_FILTER_INITIAL_VALUES,
  normalizeBillingVisitFilters,
} from '@/features/billing/pages/services-billing/billing-visit-filter-fields';

const PAYMENT_ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

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
  const [filterForm] = Form.useForm();

  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchVisits, { isLoading }] = useLazySearchBillingVisitsQuery();

  const visitId = searchParams.get('visitId');
  const { data: activeVisit = null } = useGetBillingVisitQuery(visitId, { skip: !visitId });
  const { data: visitServiceRows = [], isLoading: isLoadingVisitServices } =
    useGetBillingVisitServicesQuery(visitId, {
    skip: !visitId,
  });

  const openVisitPayment = useCallback(
    (record) => {
      router.push(buildOpdPaymentHref(record.id));
    },
    [router],
  );

  const handleSearch = async (values) => {
    const filters = normalizeBillingVisitFilters(values);
    const { data: matched = [] } = await searchVisits(filters);
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
    return (
      <BillingVisitPaymentView
        visit={activeVisit}
        serviceRows={visitServiceRows}
        loading={isLoadingVisitServices}
      />
    );
  }

  return (
    <div className="services-billing-page opd-payment-page">
      <div className="walk-in-add-record-layout services-billing-search-layout">
        <Form
          form={filterForm}
          layout="vertical"
          initialValues={BILLING_VISIT_FILTER_INITIAL_VALUES}
          className="walk-in-add-record-form"
          onFinish={handleSearch}
        >
          <DynamicForm fields={BILLING_VISIT_FILTER_FIELDS} gutter={[16, 12]} />
          <div className="services-billing-search-actions">
            <Button
              type="default"
              htmlType="submit"
              icon={<SearchOutlined />}
              className="walk-in-search-btn services-billing-search-btn"
              loading={isLoading}
            >
              Search
            </Button>
          </div>
        </Form>
      </div>

      <section className="services-billing-results" aria-label="Payment search results">
        <DataTable
          columns={columns}
          dataSource={results}
          loading={isLoading}
          rowKey="id"
          columnAlign="left"
          pagination={false}
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
