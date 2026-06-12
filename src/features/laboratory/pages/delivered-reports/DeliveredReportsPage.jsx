'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import LaboratoryDepartmentTag from '@/features/laboratory/components/LaboratoryDepartmentTag';
import CollectionFilterForm from '@/features/laboratory/components/CollectionFilterForm';
import DeliveredReportDeliveryView from '@/features/laboratory/pages/delivered-reports/DeliveredReportDeliveryView';
import DataTable from '@/components/ui/DataTable';
import {
  createLaboratoryWorklistFilters,
  getDefaultLaboratoryWorklistResults,
  MOCK_LABORATORY_WORKLIST_ROWS,
  searchLaboratoryWorklistRows,
} from '@/features/laboratory/api/mock-laboratory-worklist';

const DELIVERED_REPORTS_STATUS = 'delivered-reports';
import { DOB_AGE_UNITS } from '@/lib/dob-from-age';

export default function DeliveredReportsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const recordId = searchParams.get('recordId');

  const [filters, setFilters] = useState(() => ({
    ...createLaboratoryWorklistFilters(DELIVERED_REPORTS_STATUS),
    ageUnit: DOB_AGE_UNITS.years,
    patientAge: '',
    dateRange: null,
  }));
  const [results, setResults] = useState(() =>
    getDefaultLaboratoryWorklistResults(MOCK_LABORATORY_WORKLIST_ROWS, DELIVERED_REPORTS_STATUS),
  );
  const [hasSearched, setHasSearched] = useState(true);

  const activeRecord = useMemo(() => {
    if (!recordId) return null;
    return MOCK_LABORATORY_WORKLIST_ROWS.find((row) => row.id === recordId) ?? null;
  }, [recordId]);

  const patchFilter = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleSearch = () => {
    setResults(
      searchLaboratoryWorklistRows(MOCK_LABORATORY_WORKLIST_ROWS, {
        ...filters,
        status: DELIVERED_REPORTS_STATUS,
      }),
    );
    setHasSearched(true);
  };

  const openDeliveryForm = useCallback(
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
                icon="mdi:file-document-outline"
                className="h-[14px] w-[14px] text-[var(--app-primary)]"
              />
            }
            onClick={() => openDeliveryForm(record)}
          >
            Report
          </Button>
        ),
      },
    ],
    [openDeliveryForm],
  );

  if (activeRecord) {
    return <DeliveredReportDeliveryView record={activeRecord} />;
  }

  return (
    <div className="services-billing-page laboratory-worklist-page">
      <CollectionFilterForm
        idPrefix="delivered-reports"
        filters={filters}
        onPatchFilter={patchFilter}
        onSubmit={handleSearch}
      />

      <section className="services-billing-results" aria-label="Delivered reports results">
        <DataTable
          columns={columns}
          dataSource={results}
          rowKey="id"
          columnAlign="left"
          pagination={false}
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
