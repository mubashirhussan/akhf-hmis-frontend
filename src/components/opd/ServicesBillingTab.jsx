'use client';

import { useMemo, useState } from 'react';
import {
  CreditCardOutlined,
  EditOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Input, Space, Tag, Tooltip } from 'antd';
import HmisAgeUnitField from '@/components/ui/HmisAgeUnitField';
import HmisFloatingField from '@/components/ui/HmisFloatingField';
import HmisFormGrid from '@/components/ui/HmisFormGrid';
import HmisTable from '@/components/ui/HmisTable';
import {
  MOCK_SERVICES_BILLING_VISITS,
  searchServicesBillingVisits,
  SERVICES_BILLING_STATUS_COLORS,
  SERVICES_BILLING_TYPE_COLORS,
} from '@/data/mock-services-billing';
import { HMIS_FIELD_CONTROL_CLASS } from '@/lib/hmis-field-control';
import { HMIS_SERVICES_BILLING_TABLE_SCROLL_Y } from '@/lib/hmis-table-scroll';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';

const controlClass = HMIS_FIELD_CONTROL_CLASS;

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

export default function ServicesBillingTab() {
  const [filters, setFilters] = useState(emptyFilters);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

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
      { title: 'Patient Name', dataIndex: 'patientName', key: 'patientName', width: 150 },
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
        width: 132,
        fixed: 'right',
        align: 'center',
        render: () => (
          <Space size={4} className="services-billing-actions-cell">
            <Tooltip title="Billing">
              <Button type="link" size="small" icon={<CreditCardOutlined />} aria-label="Billing" />
            </Tooltip>
            <Tooltip title="View">
              <Button type="link" size="small" icon={<EyeOutlined />} aria-label="View" />
            </Tooltip>
            <Tooltip title="Edit">
              <Button type="link" size="small" icon={<EditOutlined />} aria-label="Edit" />
            </Tooltip>
            <Tooltip title="Settings">
              <Button type="link" size="small" icon={<SettingOutlined />} aria-label="Settings" />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [],
  );

  return (
    <div className="services-billing-page">
      <div className="walk-in-add-record-layout services-billing-search-layout">
        <HmisFormGrid
          as="form"
          columns={4}
          className="walk-in-add-record-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <HmisFloatingField label="Visit #" htmlFor="billing-visit-no">
            <Input
              id="billing-visit-no"
              className={controlClass}
              value={filters.visitNo}
              onChange={(e) => patchFilter({ visitNo: e.target.value })}
              autoComplete="off"
            />
          </HmisFloatingField>

          <HmisFloatingField label="MR #" htmlFor="billing-mr-no">
            <Input
              id="billing-mr-no"
              className={controlClass}
              value={filters.mrNo}
              onChange={(e) => patchFilter({ mrNo: e.target.value })}
              autoComplete="off"
            />
          </HmisFloatingField>

          <HmisFloatingField label="Patient Age" htmlFor="billing-patient-age">
            <HmisAgeUnitField
              embedded
              className="patient-reg-dob-age hmis-age-unit-field--no-dob"
              ageInputId="billing-patient-age"
              age={filters.patientAge}
              unit={filters.ageUnit}
              onChange={({ age, unit }) => patchFilter({ patientAge: age, ageUnit: unit })}
            />
          </HmisFloatingField>

          <HmisFloatingField label="Registration Date" htmlFor="billing-reg-date">
            <DatePicker
              id="billing-reg-date"
              className={controlClass}
              value={filters.registrationDate}
              onChange={(registrationDate) => patchFilter({ registrationDate })}
              format="DD/MM/YYYY"
            />
          </HmisFloatingField>

          <HmisFloatingField label="CNIC #" htmlFor="billing-cnic">
            <Input
              id="billing-cnic"
              className={controlClass}
              value={filters.cnic}
              onChange={(e) => patchFilter({ cnic: e.target.value })}
              autoComplete="off"
            />
          </HmisFloatingField>

          <HmisFloatingField label="Mobile #" htmlFor="billing-mobile">
            <Input
              id="billing-mobile"
              className={controlClass}
              value={filters.mobile}
              onChange={(e) => patchFilter({ mobile: e.target.value })}
              autoComplete="off"
            />
          </HmisFloatingField>

          <HmisFloatingField label="First Name" htmlFor="billing-first-name">
            <Input
              id="billing-first-name"
              className={controlClass}
              value={filters.firstName}
              onChange={(e) => patchFilter({ firstName: e.target.value })}
              autoComplete="off"
            />
          </HmisFloatingField>

          <HmisFloatingField label="Middle Name" htmlFor="billing-middle-name">
            <Input
              id="billing-middle-name"
              className={controlClass}
              value={filters.middleName}
              onChange={(e) => patchFilter({ middleName: e.target.value })}
              autoComplete="off"
            />
          </HmisFloatingField>

          <HmisFloatingField label="Last Name" htmlFor="billing-last-name">
            <Input
              id="billing-last-name"
              className={controlClass}
              value={filters.lastName}
              onChange={(e) => patchFilter({ lastName: e.target.value })}
              autoComplete="off"
            />
          </HmisFloatingField>

          <HmisFloatingField label="Relation First Name" htmlFor="billing-rel-first">
            <Input
              id="billing-rel-first"
              className={controlClass}
              value={filters.relationFirstName}
              onChange={(e) => patchFilter({ relationFirstName: e.target.value })}
              autoComplete="off"
            />
          </HmisFloatingField>

          <HmisFloatingField label="Relation Middle Name" htmlFor="billing-rel-middle">
            <Input
              id="billing-rel-middle"
              className={controlClass}
              value={filters.relationMiddleName}
              onChange={(e) => patchFilter({ relationMiddleName: e.target.value })}
              autoComplete="off"
            />
          </HmisFloatingField>

          <HmisFloatingField label="Relation Last Name" htmlFor="billing-rel-last">
            <Input
              id="billing-rel-last"
              className={controlClass}
              value={filters.relationLastName}
              onChange={(e) => patchFilter({ relationLastName: e.target.value })}
              autoComplete="off"
            />
          </HmisFloatingField>

          <div className="services-billing-search-actions">
            <Button
              type="primary"
              htmlType="submit"
              className="walk-in-search-btn services-billing-search-btn"
            >
              Submit
            </Button>
          </div>
        </HmisFormGrid>
      </div>

      <section className="services-billing-results" aria-label="Billing search results">
        <HmisTable
          className="hmis-table--billing-results"
          columns={columns}
          dataSource={results}
          rowKey="id"
          columnAlign="left"
          pagination={false}
          scroll={{ x: 1680, y: HMIS_SERVICES_BILLING_TABLE_SCROLL_Y }}
          locale={{
            emptyText: hasSearched
              ? 'No visits found'
              : 'Use the search form above to find visits',
          }}
        />
      </section>
    </div>
  );
}
