'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import LaboratoryDepartmentTag from '@/features/laboratory/components/LaboratoryDepartmentTag';
import CollectionFilterForm from '@/features/laboratory/components/CollectionFilterForm';
import DataTable from '@/components/ui/DataTable';
import {
  createLaboratoryWorklistFilters,
} from '@/features/laboratory/api/mock-laboratory-worklist';
import {
  useGetLaboratoryWorklistRecordQuery,
  useLazySearchLaboratoryWorklistQuery,
} from '@/features/laboratory/api/laboratoryEndpoints';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SampleReceivingFormView from '@/features/laboratory/pages/sample-receiving/SampleReceivingFormView';


export default function SampleReceivingList() {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const recordId = searchParams.get('recordId');

  const { message } = App.useApp();
  const [filters, setFilters] = useState(() => ({
    ...createLaboratoryWorklistFilters('sample-receiving'),
    ageUnit: DOB_AGE_UNITS.years,
    patientAge: '',
    dateRange: null,
  }));
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchWorklist, { isLoading }] = useLazySearchLaboratoryWorklistQuery();
  const { data: activeRecord = null } = useGetLaboratoryWorklistRecordQuery(recordId, {
    skip: !recordId,
  });

  const patchFilter = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleSearch = async () => {
    const { data = [] } = await searchWorklist(filters);
    setResults(data);
    setHasSearched(true);
  };

  const handleReceiveSample = useCallback(
    (record) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('recordId', record.id);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
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
    if (activeRecord) {
      return <SampleReceivingFormView record={activeRecord} />;
    }

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
          columns={columns}
          dataSource={results}
          loading={isLoading}
          rowKey="id"
          columnAlign="left"
          pagination={false}
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
