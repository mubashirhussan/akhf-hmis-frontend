'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'antd';
import LaboratoryDepartmentTag from '@/features/laboratory/components/LaboratoryDepartmentTag';
import CollectionFilterForm from '@/features/laboratory/components/CollectionFilterForm';
import TestConductedFormView from '@/features/laboratory/pages/test-conducted/TestConductedFormView';
import DataTable from '@/components/ui/DataTable';
import {
  createLaboratoryWorklistFilters,
} from '@/features/laboratory/api/mock-laboratory-worklist';
import {
  useGetLaboratoryWorklistRecordQuery,
  useLazySearchLaboratoryWorklistQuery,
} from '@/features/laboratory/api/laboratoryEndpoints';
import { resolveTestConductedRecord } from '@/features/laboratory/api/mock-test-conducted';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';

const TEST_CONDUCTED_STATUS = 'test-conducted';

export default function TestConductedList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const recordId = searchParams.get('recordId');

  const [filters, setFilters] = useState(() => ({
    ...createLaboratoryWorklistFilters(TEST_CONDUCTED_STATUS),
    ageUnit: DOB_AGE_UNITS.years,
    patientAge: '',
    dateRange: null,
  }));
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(true);
  const [searchWorklist, { isLoading }] = useLazySearchLaboratoryWorklistQuery();
  const { data: worklistRecord = null } = useGetLaboratoryWorklistRecordQuery(recordId, {
    skip: !recordId,
  });

  useEffect(() => {
    searchWorklist(filters).then(({ data = [] }) => setResults(data));
  }, [searchWorklist]);

  const activeRecord = useMemo(
    () => (worklistRecord ? resolveTestConductedRecord(worklistRecord) : null),
    [worklistRecord],
  );

  const patchFilter = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleSearch = async () => {
    const { data = [] } = await searchWorklist(filters);
    setResults(data);
    setHasSearched(true);
  };

  const openApprovalForm = useCallback(
    (record) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('recordId', record.id);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const closeApprovalForm = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('recordId');
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

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
          <Button type="link" size="small" onClick={() => openApprovalForm(record)}>
            Ready for Approval
          </Button>
        ),
      },
    ],
    [openApprovalForm],
  );

  if (activeRecord) {
    return (
      <TestConductedFormView
        record={activeRecord}
        onAllTestsCompleted={closeApprovalForm}
      />
    );
  }

  return (
    <div className="services-billing-page laboratory-worklist-page">
      <CollectionFilterForm
        idPrefix="test-conducted"
        filters={filters}
        onPatchFilter={patchFilter}
        onSubmit={handleSearch}
      />

      <section className="services-billing-results" aria-label="Test conducted results">
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
              : 'Use the search form above to find records',
          }}
        />
      </section>
    </div>
  );
}
