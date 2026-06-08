'use client';

import { useCallback, useMemo, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { App, Button, DatePicker, Input, Select, Tag } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DobAgeField from '@/components/ui/DobAgeField';
import DataTable from '@/components/ui/DataTable';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import {
  MOCK_SAMPLE_COLLECTION_ROWS,
  SAMPLE_COLLECTION_DEPARTMENT_COLORS,
  SAMPLE_COLLECTION_PATIENT_TYPE_OPTIONS,
  SAMPLE_COLLECTION_SEND_OUT_OPTIONS,
  SAMPLE_COLLECTION_STATUS_OPTIONS,
  SAMPLE_COLLECTION_TEST_GROUP_OPTIONS,
  SAMPLE_COLLECTION_TEST_NAME_OPTIONS,
  searchSampleCollectionRows,
} from '@/data/mock-sample-collection';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import dayjs from 'dayjs';

const controlClass = FIELD_CONTROL_CLASS;

const emptyFilters = {
  firstName: '',
  lastName: '',
  cnic: '',
  fromDate: dayjs('2004-02-22'),
  labNo: '',
  patientType: 'all',
  mrNo: '',
  visitNo: '',
  patientAge: '22',
  ageUnit: DOB_AGE_UNITS.years,
  toDate: dayjs('2004-02-22'),
  mobile: '',
  testNameText: '',
  status: 'result-entry',
  testGroup: 'all',
  testNameOption: 'all',
  sendOut: 'all',
  referenceNo: '',
};

function DepartmentTag({ value }) {
  const palette = SAMPLE_COLLECTION_DEPARTMENT_COLORS[value] ?? {
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

export default function SampleCollectionTab() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState(emptyFilters);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const patchFilter = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleSearch = () => {
    const matched = searchSampleCollectionRows(MOCK_SAMPLE_COLLECTION_ROWS, filters);
    setResults(matched);
    setHasSearched(true);
  };

  const handleCollectSample = useCallback(
    (record) => {
      message.success(`Sample collection started for ${record.patientName} (Lab #${record.labNo}).`);
    },
    [message],
  );

  const columns = useMemo(
    () => [
      { title: 'MR. No', dataIndex: 'mrNo', key: 'mrNo', width: 150 },
      { title: 'Patient Name', dataIndex: 'patientName', key: 'patientName', width: 150 },
      { title: 'Relation', dataIndex: 'relation', key: 'relation', width: 80 },
      { title: 'Relation Name', dataIndex: 'relationName', key: 'relationName', width: 140 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 72 },
      { title: 'Requested Date', dataIndex: 'requestedDate', key: 'requestedDate', width: 180 },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        width: 120,
        render: (value) => <DepartmentTag value={value} />,
      },
      { title: 'Patient Type', dataIndex: 'patientType', key: 'patientType', width: 110 },
      { title: 'Collected At', dataIndex: 'collectedAt', key: 'collectedAt', width: 120 },
      { title: 'Lab #', dataIndex: 'labNo', key: 'labNo', width: 90 },
      {
        title: 'Action',
        key: 'action',
        width: 140,
        align: 'center',
        render: (_, record) => (
          <Button
            type="link"
            size="small"
            className="sample-collection-action-btn"
            icon={
              <AppIcon
                icon="mdi:test-tube"
                className="h-[14px] w-[14px] text-[var(--app-primary)]"
              />
            }
            onClick={() => handleCollectSample(record)}
          >
            Collect Sample
          </Button>
        ),
      },
    ],
    [handleCollectSample],
  );

  return (
    <div className="services-billing-page sample-collection-page">
      <div className="walk-in-add-record-layout services-billing-search-layout">
        <FormGrid
          as="form"
          columns={3}
          className="walk-in-add-record-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <FloatingField label="First Name" htmlFor="sc-first-name">
            <Input
              id="sc-first-name"
              className={controlClass}
              value={filters.firstName}
              onChange={(e) => patchFilter({ firstName: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="MR #" htmlFor="sc-mr-no">
            <Input
              id="sc-mr-no"
              className={controlClass}
              value={filters.mrNo}
              onChange={(e) => patchFilter({ mrNo: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Status" htmlFor="sc-status">
            <Select
              id="sc-status"
              className={controlClass}
              value={filters.status}
              options={SAMPLE_COLLECTION_STATUS_OPTIONS}
              onChange={(status) => patchFilter({ status })}
            />
          </FloatingField>

          <FloatingField label="Last Name" htmlFor="sc-last-name">
            <Input
              id="sc-last-name"
              className={controlClass}
              value={filters.lastName}
              onChange={(e) => patchFilter({ lastName: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Visit #" htmlFor="sc-visit-no">
            <Input
              id="sc-visit-no"
              className={controlClass}
              value={filters.visitNo}
              onChange={(e) => patchFilter({ visitNo: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Test Group" htmlFor="sc-test-group">
            <Select
              id="sc-test-group"
              className={controlClass}
              value={filters.testGroup}
              options={SAMPLE_COLLECTION_TEST_GROUP_OPTIONS}
              onChange={(testGroup) => patchFilter({ testGroup })}
            />
          </FloatingField>

          <FloatingField label="CNIC #" htmlFor="sc-cnic">
            <Input
              id="sc-cnic"
              className={controlClass}
              value={filters.cnic}
              onChange={(e) => patchFilter({ cnic: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="DOB" htmlFor="sc-dob-age">
            <DobAgeField
              embedded
              className="patient-reg-dob-age"
              ageInputId="sc-dob-age"
              age={filters.patientAge}
              unit={filters.ageUnit}
              onChange={({ age, unit }) => patchFilter({ patientAge: age, ageUnit: unit })}
            />
          </FloatingField>

          <FloatingField label="Test Name" htmlFor="sc-test-name-option">
            <Select
              id="sc-test-name-option"
              className={controlClass}
              value={filters.testNameOption}
              options={SAMPLE_COLLECTION_TEST_NAME_OPTIONS}
              onChange={(testNameOption) => patchFilter({ testNameOption })}
            />
          </FloatingField>

          <FloatingField label="From Date" htmlFor="sc-from-date">
            <DatePicker
              id="sc-from-date"
              className={controlClass}
              value={filters.fromDate}
              onChange={(fromDate) => patchFilter({ fromDate })}
              format="DD / MM / YYYY"
            />
          </FloatingField>

          <FloatingField label="To Date" htmlFor="sc-to-date">
            <DatePicker
              id="sc-to-date"
              className={controlClass}
              value={filters.toDate}
              onChange={(toDate) => patchFilter({ toDate })}
              format="DD / MM / YYYY"
            />
          </FloatingField>

          <FloatingField label="Send Out" htmlFor="sc-send-out">
            <Select
              id="sc-send-out"
              className={controlClass}
              value={filters.sendOut}
              options={SAMPLE_COLLECTION_SEND_OUT_OPTIONS}
              onChange={(sendOut) => patchFilter({ sendOut })}
            />
          </FloatingField>

          <FloatingField label="Lab #" htmlFor="sc-lab-no">
            <Input
              id="sc-lab-no"
              className={controlClass}
              value={filters.labNo}
              onChange={(e) => patchFilter({ labNo: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Mobile #" htmlFor="sc-mobile">
            <Input
              id="sc-mobile"
              className={controlClass}
              value={filters.mobile}
              onChange={(e) => patchFilter({ mobile: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Reference #" htmlFor="sc-reference">
            <Input
              id="sc-reference"
              className={controlClass}
              value={filters.referenceNo}
              onChange={(e) => patchFilter({ referenceNo: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Patient Type" htmlFor="sc-patient-type">
            <Select
              id="sc-patient-type"
              className={controlClass}
              value={filters.patientType}
              options={SAMPLE_COLLECTION_PATIENT_TYPE_OPTIONS}
              onChange={(patientType) => patchFilter({ patientType })}
            />
          </FloatingField>

          <FloatingField label="Test Name" htmlFor="sc-test-name">
            <Input
              id="sc-test-name"
              className={controlClass}
              value={filters.testNameText}
              onChange={(e) => patchFilter({ testNameText: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <div className="services-billing-search-actions">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              className="walk-in-search-btn services-billing-search-btn"
            >
              Search
            </Button>
          </div>
        </FormGrid>
      </div>

      <section className="services-billing-results" aria-label="Sample collection results">
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
              ? 'No records found'
              : 'Use the search form above to find samples',
          }}
        />
      </section>
    </div>
  );
}
