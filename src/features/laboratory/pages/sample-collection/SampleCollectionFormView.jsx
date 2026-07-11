'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Checkbox, Form } from 'antd';
import PatientInfoHeaderCard from '@/features/patient/components/PatientInfoHeaderCard';
import DataTable from '@/components/ui/DataTable';
import DynamicForm from '@/components/form/DynamicForm';
import {
  createSampleCollectionTests,
} from '@/features/laboratory/api/mock-sample-collection';
import {
  getSampleCollectionFields,
  SAMPLE_COLLECTION_INITIAL_VALUES,
} from '@/features/laboratory/pages/sample-collection/sample-collection-fields';
import { buildPatientInfoSummary } from '@/features/patient/utils/patient-info';

export default function SampleCollectionFormView({ record }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const patient = useMemo(() => buildPatientInfoSummary(record), [record]);
  const [testRows, setTestRows] = useState(() => createSampleCollectionTests(record.id));

  const collectedAt = Form.useWatch('collectedAt', form);
  const isSatelliteCenter = collectedAt === 'satellite-center';
  const fields = useMemo(
    () => getSampleCollectionFields({ showLocation: isSatelliteCenter }),
    [isSatelliteCenter],
  );

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

      <Form
        form={form}
        layout="vertical"
        initialValues={SAMPLE_COLLECTION_INITIAL_VALUES}
        className="sample-collection-entry-form"
      >
        <DynamicForm fields={fields} gutter={[16, 12]} />
      </Form>

      <section className="sample-collection-form-table-section" aria-label="Tests for collection">
        <DataTable
          columns={columns}
          dataSource={testRows}
          rowKey="id"
          columnAlign="left"
          pagination={false}
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
