'use client';

import { useCallback, useMemo, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { App, Button, Input, Select, Tag } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DateRangeField from '@/components/ui/DateRangeField';
import DobAgeField from '@/components/ui/DobAgeField';
import DataTable from '@/components/ui/DataTable';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import {
  createLaboratoryWorklistFilters,
  LABORATORY_DEPARTMENT_COLORS,
  LABORATORY_PATIENT_TYPE_OPTIONS,
  LABORATORY_SEND_OUT_OPTIONS,
  LABORATORY_STATUS_OPTIONS,
  LABORATORY_TEST_GROUP_OPTIONS,
  LABORATORY_TEST_NAME_OPTIONS,
  LABORATORY_WORKLIST_CONFIG,
  MOCK_LABORATORY_WORKLIST_ROWS,
  searchLaboratoryWorklistRows,
} from '@/data/mock-laboratory-worklist';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

function DepartmentTag({ value }) {
  const palette = LABORATORY_DEPARTMENT_COLORS[value] ?? {
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

export default function LaboratoryWorklistView({ screen }) {
  const config = LABORATORY_WORKLIST_CONFIG[screen];
  const fieldId = (name) => `laboratory-${screen}-${name}`;
  const { message } = App.useApp();
  const [filters, setFilters] = useState(() => ({
    ...createLaboratoryWorklistFilters(config?.defaultStatus ?? 'result-entry'),
    ageUnit: DOB_AGE_UNITS.years,
  }));
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const patchFilter = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleSearch = () => {
    const matched = searchLaboratoryWorklistRows(MOCK_LABORATORY_WORKLIST_ROWS, filters);
    setResults(matched);
    setHasSearched(true);
  };

  const handleAction = useCallback(
    (record) => {
      if (config) {
        message.success(config.getActionMessage(record));
      }
    },
    [config, message],
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
        width: 150,
        align: 'center',
        render: (_, record) => (
          <Button
            type="link"
            size="small"
            className="laboratory-worklist-action-btn"
            icon={
              <AppIcon
                icon={config.actionIcon}
                className="h-[14px] w-[14px] text-[var(--app-primary)]"
              />
            }
            onClick={() => handleAction(record)}
          >
            {config.actionLabel}
          </Button>
        ),
      },
    ],
    [config?.actionIcon, config?.actionLabel, handleAction],
  );

  if (!config) {
    return null;
  }

  return (
    <div className="services-billing-page laboratory-worklist-page">
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
          <FloatingField label="First Name" htmlFor={fieldId('first-name')}>
            <Input
              id={fieldId('first-name')}
              className={controlClass}
              value={filters.firstName}
              onChange={(e) => patchFilter({ firstName: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Last Name" htmlFor={fieldId('last-name')}>
            <Input
              id={fieldId('last-name')}
              className={controlClass}
              value={filters.lastName}
              onChange={(e) => patchFilter({ lastName: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="CNIC #" htmlFor={fieldId('cnic')}>
            <Input
              id={fieldId('cnic')}
              className={controlClass}
              value={filters.cnic}
              onChange={(e) => patchFilter({ cnic: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="MR #" htmlFor={fieldId('mr-no')}>
            <Input
              id={fieldId('mr-no')}
              className={controlClass}
              value={filters.mrNo}
              onChange={(e) => patchFilter({ mrNo: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Visit #" htmlFor={fieldId('visit-no')}>
            <Input
              id={fieldId('visit-no')}
              className={controlClass}
              value={filters.visitNo}
              onChange={(e) => patchFilter({ visitNo: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="DOB" htmlFor={fieldId('dob-age')}>
            <DobAgeField
              embedded
              className="patient-reg-dob-age"
              ageInputId={fieldId('dob-age')}
              age={filters.patientAge}
              unit={filters.ageUnit}
              onChange={({ age, unit }) => patchFilter({ patientAge: age, ageUnit: unit })}
            />
          </FloatingField>

          <FloatingField label="Mobile #" htmlFor={fieldId('mobile')}>
            <Input
              id={fieldId('mobile')}
              className={controlClass}
              value={filters.mobile}
              onChange={(e) => patchFilter({ mobile: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Lab #" htmlFor={fieldId('lab-no')}>
            <Input
              id={fieldId('lab-no')}
              className={controlClass}
              value={filters.labNo}
              onChange={(e) => patchFilter({ labNo: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="From - To Date" htmlFor={fieldId('date-range')}>
            <DateRangeField
              id={fieldId('date-range')}
              value={filters.dateRange}
              onChange={(dateRange) => patchFilter({ dateRange })}
            />
          </FloatingField>

          <FloatingField label="Patient Type" htmlFor={fieldId('patient-type')}>
            <Select
              id={fieldId('patient-type')}
              className={controlClass}
              value={filters.patientType}
              options={LABORATORY_PATIENT_TYPE_OPTIONS}
              onChange={(patientType) => patchFilter({ patientType })}
            />
          </FloatingField>

          <FloatingField label="Status" htmlFor={fieldId('status')}>
            <Select
              id={fieldId('status')}
              className={controlClass}
              value={filters.status}
              options={LABORATORY_STATUS_OPTIONS}
              onChange={(status) => patchFilter({ status })}
            />
          </FloatingField>

          <FloatingField label="Test Group" htmlFor={fieldId('test-group')}>
            <Select
              id={fieldId('test-group')}
              className={controlClass}
              value={filters.testGroup}
              options={LABORATORY_TEST_GROUP_OPTIONS}
              onChange={(testGroup) => patchFilter({ testGroup })}
            />
          </FloatingField>

          <FloatingField label="Test Name" htmlFor={fieldId('test-name-option')}>
            <Select
              id={fieldId('test-name-option')}
              className={controlClass}
              value={filters.testNameOption}
              options={LABORATORY_TEST_NAME_OPTIONS}
              onChange={(testNameOption) => patchFilter({ testNameOption })}
            />
          </FloatingField>

          <FloatingField label="Test Name" htmlFor={fieldId('test-name')}>
            <Input
              id={fieldId('test-name')}
              className={controlClass}
              value={filters.testNameText}
              onChange={(e) => patchFilter({ testNameText: e.target.value })}
              autoComplete="off"
            />
          </FloatingField>

          <FloatingField label="Send Out" htmlFor={fieldId('send-out')}>
            <Select
              id={fieldId('send-out')}
              className={controlClass}
              value={filters.sendOut}
              options={LABORATORY_SEND_OUT_OPTIONS}
              onChange={(sendOut) => patchFilter({ sendOut })}
            />
          </FloatingField>

          <FloatingField label="Reference #" htmlFor={fieldId('reference')}>
            <Input
              id={fieldId('reference')}
              className={controlClass}
              value={filters.referenceNo}
              onChange={(e) => patchFilter({ referenceNo: e.target.value })}
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

      <section className="services-billing-results" aria-label={config.resultsLabel}>
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
              : 'Use the search form above to find records',
          }}
        />
      </section>
    </div>
  );
}
