'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import LaboratoryDepartmentTag from '@/components/laboratory/LaboratoryDepartmentTag';
import CollectionFilterForm from '@/components/laboratory/CollectionFilterForm';
import DataTable from '@/components/ui/DataTable';
import {
  createLaboratoryWorklistFilters,
  MOCK_LABORATORY_WORKLIST_ROWS,
  searchLaboratoryWorklistRows,
} from '@/data/mock-laboratory-worklist';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';

export default function SampleReceivingList() {
  const { message } = App.useApp();
  const [filters, setFilters] = useState(() => ({
    ...createLaboratoryWorklistFilters('sample-receiving'),
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

  const handleReceiveSample = useCallback(
    (record) => {
      message.success(`Sample received for ${record.patientName} (Lab #${record.labNo}).`);
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
                icon="mdi:package-variant-closed"
                className="h-[14px] w-[14px] text-[var(--app-primary)]"
              />
            }
            onClick={() => handleReceiveSample(record)}
          >
            Receive Sample
          </Button>
        ),
      },
    ],
    [handleReceiveSample],
  );

  return (
    <div className="services-billing-page laboratory-worklist-page">
      <CollectionFilterForm
        idPrefix="sample-receiving"
        filters={filters}
        onPatchFilter={patchFilter}
        onSubmit={handleSearch}
      />

      <section className="services-billing-results" aria-label="Sample receiving results">
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
