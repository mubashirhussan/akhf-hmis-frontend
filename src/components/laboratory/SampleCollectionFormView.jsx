'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Checkbox, Input, Radio, Select } from 'antd';
import PatientInfoHeaderCard from '@/components/patient/PatientInfoHeaderCard';
import DataTable from '@/components/ui/DataTable';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import {
  createCollectionFilters,
  createSampleCollectionTests,
  SAMPLE_COLLECTION_GROUP_OPTIONS,
  SAMPLE_COLLECTION_LOCATION_OPTIONS,
  SAMPLE_COLLECTION_PRINTER_OPTIONS,
  SAMPLE_COLLECTION_SITE_OPTIONS,
} from '@/data/mock-sample-collection';
import { buildPatientInfoSummary } from '@/lib/patient-info';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

export default function SampleCollectionFormView({ record }) {
  const { message } = App.useApp();

  const patient = useMemo(() => buildPatientInfoSummary(record), [record]);

  const [filters, setFilters] = useState(createCollectionFilters);
  const [testRows, setTestRows] = useState(() => createSampleCollectionTests(record.id));

  const patchFilter = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const patchTestRow = useCallback((rowId, patch) => {
    setTestRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
    );
  }, []);

  const allChecked = testRows.length > 0 && testRows.every((row) => row.checked);
  const allSendOut = testRows.length > 0 && testRows.every((row) => row.sendOut);
  const someChecked = testRows.some((row) => row.checked);
  const someSendOut = testRows.some((row) => row.sendOut);

  const toggleAllChecked = useCallback((checked) => {
    setTestRows((prev) => prev.map((row) => ({ ...row, checked })));
  }, []);

  const toggleAllSendOut = useCallback((sendOut) => {
    setTestRows((prev) => prev.map((row) => ({ ...row, sendOut })));
  }, []);

  const handleSave = () => {
    message.success(`Sample collection saved for ${record.patientName} (Lab #${record.labNo}).`);
  };

  const columns = useMemo(
    () => [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 220 },
      {
        title: 'Specimen Required For Test',
        dataIndex: 'specimen',
        key: 'specimen',
        width: 220,
      },
      {
        key: 'checked',
        width: 110,
        align: 'center',
        title: (
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked && !allChecked}
            onChange={(e) => toggleAllChecked(e.target.checked)}
          >
            Check All
          </Checkbox>
        ),
        render: (_, row) => (
          <Checkbox
            checked={row.checked}
            onChange={(e) => patchTestRow(row.id, { checked: e.target.checked })}
          />
        ),
      },
      {
        key: 'sendOut',
        width: 110,
        align: 'center',
        title: (
          <Checkbox
            checked={allSendOut}
            indeterminate={someSendOut && !allSendOut}
            onChange={(e) => toggleAllSendOut(e.target.checked)}
          >
            Send Out
          </Checkbox>
        ),
        render: (_, row) => (
          <Checkbox
            checked={row.sendOut}
            onChange={(e) => patchTestRow(row.id, { sendOut: e.target.checked })}
          />
        ),
      },
    ],
    [
      allChecked,
      allSendOut,
      patchTestRow,
      someChecked,
      someSendOut,
      toggleAllChecked,
      toggleAllSendOut,
    ],
  );

  return (
    <div className="sample-collection-form-page">
      <PatientInfoHeaderCard patient={patient} />

      <FormGrid columns={4} className="sample-collection-entry-form">
        <FloatingField label="Test Group" htmlFor="sample-collection-group">
          <Select
            id="sample-collection-group"
            className={controlClass}
            value={filters.testGroup}
            options={SAMPLE_COLLECTION_GROUP_OPTIONS}
            onChange={(value) => patchFilter({ testGroup: value })}
          />
        </FloatingField>

        <FloatingField label="Collected at" variant="radios" col={1}>
          <Radio.Group
            value={filters.collectedAt}
            onChange={(e) => patchFilter({ collectedAt: e.target.value })}
            options={SAMPLE_COLLECTION_SITE_OPTIONS}
          />
        </FloatingField>

        <FloatingField label="Bar Code" htmlFor="sample-collection-barcode">
          <Input
            id="sample-collection-barcode"
            className={controlClass}
            value={filters.barCode}
            onChange={(e) => patchFilter({ barCode: e.target.value })}
            autoComplete="off"
          />
        </FloatingField>

        <FloatingField label="Location" htmlFor="sample-collection-location">
          <Select
            id="sample-collection-location"
            className={controlClass}
            value={filters.location}
            options={SAMPLE_COLLECTION_LOCATION_OPTIONS}
            onChange={(value) => patchFilter({ location: value })}
          />
        </FloatingField>

        <FloatingField label="Clinical Diagnosis" htmlFor="sample-collection-diagnosis" col={2}>
          <Input.TextArea
            id="sample-collection-diagnosis"
            className={controlClass}
            rows={3}
            value={filters.clinicalDiagnosis}
            onChange={(e) => patchFilter({ clinicalDiagnosis: e.target.value })}
          />
        </FloatingField>

        <FloatingField label="Select Printer Location" htmlFor="sample-collection-printer">
          <Select
            id="sample-collection-printer"
            className={controlClass}
            value={filters.printerLocation}
            options={SAMPLE_COLLECTION_PRINTER_OPTIONS}
            onChange={(value) => patchFilter({ printerLocation: value })}
          />
        </FloatingField>
      </FormGrid>

      <section className="sample-collection-form-table-section" aria-label="Tests for collection">
        <DataTable
          className="data-table--sample-collection-tests"
          columns={columns}
          dataSource={testRows}
          rowKey="id"
          columnAlign="left"
          pagination={false}
          scroll={{ x: false }}
          tableLayout="auto"
          locale={{ emptyText: 'No tests available for collection' }}
        />
      </section>

      <div className="sample-collection-form-footer">
        <Button type="primary" className="sample-collection-save-btn" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
