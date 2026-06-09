'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import LaboratoryDepartmentTag from '@/features/laboratory/components/LaboratoryDepartmentTag';
import CollectionFilterForm from '@/features/laboratory/components/CollectionFilterForm';
import DataTable from '@/components/ui/DataTable';
import {
  createLaboratoryWorklistFilters,
  MOCK_LABORATORY_WORKLIST_ROWS,
  searchLaboratoryWorklistRows,
} from '@/features/laboratory/api/mock-laboratory-worklist';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';

export default function UndeliveredReportsList() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState(() => ({
    ...createLaboratoryWorklistFilters('undelivered-reports'),
    ageUnit: DOB_AGE_UNITS.years,
  }));
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const patchFilter = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleSearch = () => {
    setResults(searchLaboratoryWorklistRows(MOCK_LABORATORY_WORKLIST_ROWS, filters));
    setHasSearched(true);
  };

  const handleDeliverReport = useCallback(
    (record) => {
      message.success(`Report delivery started for ${record.patientName} (Lab #${record.labNo}).`);
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
        render: (value) => <LaboratoryDepartmentTag value={value} />,
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
            icon={
              <AppIcon
                icon="mdi:file-send-outline"
                className="h-[14px] w-[14px] text-[var(--app-primary)]"
              />
            }
            onClick={() => handleDeliverReport(record)}
          >
            Deliver Report
          </Button>
        ),
      },
    ],
    [handleDeliverReport],
  );

  return (
    <div className="services-billing-page laboratory-worklist-page">
      <CollectionFilterForm
        idPrefix="undelivered-reports"
        filters={filters}
        onPatchFilter={patchFilter}
        onSubmit={handleSearch}
      />

      <section className="services-billing-results" aria-label="Undelivered reports results">
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
              : 'Use the search form above to find reports',
          }}
        />
      </section>
    </div>
  );
}
