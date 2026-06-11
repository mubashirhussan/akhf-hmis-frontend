'use client';

import { useCallback, useMemo, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { App, Button, Collapse, Input, Select } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import DynamicResultField from '@/features/laboratory/components/DynamicResultField';
import './result-entry.css';
import PatientInfoHeaderCard from '@/features/patient/components/PatientInfoHeaderCard';
import {
  createResultEntryFieldValues,
  createResultEntryTestDrafts,
  createResultEntryTestsForRecord,
  getResultEntryFieldSchema,
  getResultEntryReportTemplates,
  resolveResultEntryTest,
  RESULT_ENTRY_TEST_GROUP_OPTIONS,
} from '@/features/laboratory/api/mock-result-entry';
import { buildPatientInfoSummary } from '@/features/patient/utils/patient-info';
import { useConfirm } from '@/hooks/useConfirm';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

function ResultEntryFieldRow({ field, value, onChange, idPrefix }) {
  const fieldId = `${idPrefix}-${field.key}`;

  return (
    <div className="result-entry-field-row">
      <label className="result-entry-field-label" htmlFor={fieldId}>
        {field.label}
      </label>
      <div className="result-entry-field-control">
        <DynamicResultField
          id={fieldId}
          field={field}
          value={value}
          onChange={onChange}
        />
      </div>
      <span className="result-entry-field-ref">{field.refRange ?? '—'}</span>
    </div>
  );
}

export default function ResultEntryFormView({ record }) {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const patient = useMemo(() => buildPatientInfoSummary(record), [record]);
  const initialSelection = useMemo(() => resolveResultEntryTest(record), [record]);
  const recordTests = useMemo(() => createResultEntryTestsForRecord(record), [record]);

  const [testGroup, setTestGroup] = useState(initialSelection.testGroup);
  const [activeTestKey, setActiveTestKey] = useState(initialSelection.testKey);
  const [testDrafts, setTestDrafts] = useState(() => createResultEntryTestDrafts(record));

  const schema = useMemo(
    () => getResultEntryFieldSchema(activeTestKey),
    [activeTestKey],
  );
  const reportTemplates = useMemo(
    () => getResultEntryReportTemplates(activeTestKey),
    [activeTestKey],
  );

  const currentDraft = testDrafts[activeTestKey] ?? {
    fieldValues: createResultEntryFieldValues(schema),
    remarks: schema?.defaultRemarks ?? '',
    selectedTemplateId: reportTemplates[0]?.value ?? '',
    templateContent: reportTemplates[0]?.content ?? '',
  };

  const { fieldValues, remarks, selectedTemplateId, templateContent } = currentDraft;

  const testNameOptions = useMemo(
    () =>
      recordTests
        .filter((test) => test.testGroup === testGroup)
        .map((test) => ({ value: test.testKey, label: test.label })),
    [recordTests, testGroup],
  );

  const handleTestGroupChange = useCallback(
    (value) => {
      setTestGroup(value);
      const nextTest = recordTests.find((test) => test.testGroup === value);
      if (nextTest) {
        setActiveTestKey(nextTest.testKey);
      }
    },
    [recordTests],
  );

  const handleSelectTest = useCallback(
    (testKey) => {
      const test = recordTests.find((item) => item.testKey === testKey);
      setActiveTestKey(testKey);
      if (test) {
        setTestGroup(test.testGroup);
      }
    },
    [recordTests],
  );

  const handleTestNameChange = useCallback(
    (testKey) => {
      handleSelectTest(testKey);
    },
    [handleSelectTest],
  );

  const patchCurrentDraft = useCallback(
    (patch) => {
      setTestDrafts((prev) => ({
        ...prev,
        [activeTestKey]: {
          ...prev[activeTestKey],
          ...patch,
        },
      }));
    },
    [activeTestKey],
  );

  const patchFieldValue = useCallback(
    (key, value) => {
      setTestDrafts((prev) => ({
        ...prev,
        [activeTestKey]: {
          ...prev[activeTestKey],
          fieldValues: {
            ...prev[activeTestKey]?.fieldValues,
            [key]: value,
          },
        },
      }));
    },
    [activeTestKey],
  );

  const handleTemplateChange = useCallback(
    (templateId) => {
      const template = reportTemplates.find((item) => item.value === templateId);
      patchCurrentDraft({
        selectedTemplateId: templateId,
        templateContent: template?.content ?? '',
      });
    },
    [patchCurrentDraft, reportTemplates],
  );

  const handleSave = useCallback(
    (finalize = false) => {
      const action = finalize ? 'finalized' : 'saved';
      message.success(
        `Result ${action} for ${record.patientName} (${schema?.title ?? 'Test'}, Lab #${record.labNo}).`,
      );
    },
    [message, record.labNo, record.patientName, schema?.title],
  );

  const handleDeleteSavedComponents = useCallback(async () => {
    if (!schema) return;

    const confirmed = await confirmDelete({
      message: (
        <span className="confirm-modal__message">
          Are you sure you want to delete saved components for{' '}
          <span className="confirm-modal__service-name">{schema.title}</span>?
        </span>
      ),
      okText: 'Yes, delete',
    });

    if (!confirmed) return;

    patchCurrentDraft({
      fieldValues: createResultEntryFieldValues(schema),
    });
    message.info('Saved component values cleared.');
  }, [confirmDelete, message, patchCurrentDraft, schema]);

  const sectionColumns = useMemo(() => {
    if (!schema) return [];

    return schema.sections.map((section) => {
      const leftFields = section.fields.filter((field) => field.column !== 2);
      const rightFields = section.fields.filter((field) => field.column === 2);

      return {
        ...section,
        leftFields,
        rightFields,
      };
    });
  }, [schema]);

  return (
    <div className="services-billing-page result-entry-form-page">
      {/* <Collapse
        bordered={false}
        className="billing-patient-info-collapse"
        defaultActiveKey={[]}
        expandIconPlacement="end"
        expandIcon={({ isActive }) =>
          isActive ? (
            <UpOutlined className="billing-patient-info-collapse-arrow" aria-hidden />
          ) : (
            <DownOutlined className="billing-patient-info-collapse-arrow" aria-hidden />
          )
        }
        items={[
          {
            key: 'patient-info',
            label: (
              <span className="billing-patient-info-collapse-label">
                <span className="billing-patient-info-collapse-title">Patient Info</span>
              </span>
            ),
            children: <PatientInfoHeaderCard patient={patient} />,
          },
        ]}
      /> */}

      <div className="result-entry-form-layout">
        <aside className="result-entry-sidebar" aria-label="Test selection">
          <section className="result-entry-sidebar-filters" aria-label="Test filters">
            <FormGrid columns={1} className="result-entry-sidebar-form">
              <FloatingField label="Test Group" htmlFor="result-entry-test-group">
                <Select
                  id="result-entry-test-group"
                  className={controlClass}
                  value={testGroup}
                  options={RESULT_ENTRY_TEST_GROUP_OPTIONS}
                  onChange={handleTestGroupChange}
                />
              </FloatingField>

              <FloatingField label="Test Name" htmlFor="result-entry-test-name">
                <Select
                  id="result-entry-test-name"
                  className={controlClass}
                  value={activeTestKey}
                  options={testNameOptions}
                  onChange={handleTestNameChange}
                />
              </FloatingField>
            </FormGrid>
          </section>

          <section className="result-entry-sidebar-tests" aria-label="Ordered tests">
            <h3 className="result-entry-sidebar-tests-label">Tests</h3>
            <div className="result-entry-test-list" role="list">
            {recordTests.map((test) => {
              const isActive = test.testKey === activeTestKey;

              return (
                <button
                  key={test.id}
                  type="button"
                  role="listitem"
                  className={[
                    'result-entry-selection-card',
                    isActive ? 'result-entry-selection-card--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleSelectTest(test.testKey)}
                  aria-pressed={isActive}
                >
                  <p className="result-entry-selection-title">{test.label}</p>
                  <p className="result-entry-selection-lab">Lab # {test.labNo}</p>
                </button>
              );
            })}
            </div>
          </section>
        </aside>

        <div className="result-entry-main">
          <h2 className="result-entry-form-title">{schema?.title ?? 'Enter Result'}</h2>

          {sectionColumns.map((section) => (
            <section
              key={section.title}
              className="result-entry-section"
              aria-label={section.title}
            >
              <div className="result-entry-section-header">
                <h3 className="result-entry-section-title">{section.title}</h3>
              </div>

              <div className="result-entry-fields-grid">
                <div className="result-entry-fields-column">
                  {section.leftFields.map((field) => (
                    <ResultEntryFieldRow
                      key={field.key}
                      field={field}
                      value={fieldValues[field.key]}
                      onChange={(value) => patchFieldValue(field.key, value)}
                      idPrefix="result-entry"
                    />
                  ))}
                </div>

                <div className="result-entry-fields-column">
                  {section.rightFields.map((field) => (
                    <ResultEntryFieldRow
                      key={field.key}
                      field={field}
                      value={fieldValues[field.key]}
                      onChange={(value) => patchFieldValue(field.key, value)}
                      idPrefix="result-entry"
                    />
                  ))}
                </div>
              </div>
            </section>
          ))}

          <section className="result-entry-remarks-section" aria-label="Remarks">
            <h3 className="result-entry-block-label">Remarks :</h3>
            <FloatingField label="Remarks" htmlFor="result-entry-remarks" col="full">
              <Input.TextArea
                id="result-entry-remarks"
                className={controlClass}
                rows={4}
                value={remarks}
                onChange={(event) => patchCurrentDraft({ remarks: event.target.value })}
              />
            </FloatingField>
          </section>

          <section className="result-entry-report-section" aria-label="Report templates">
            <h3 className="result-entry-block-label">Report</h3>

            <FormGrid columns={1} className="result-entry-report-form">
              <FloatingField label="Templates" htmlFor="result-entry-template" col="full">
                <Select
                  id="result-entry-template"
                  className={controlClass}
                  value={selectedTemplateId || undefined}
                  options={reportTemplates}
                  placeholder="Select template"
                  onChange={handleTemplateChange}
                />
              </FloatingField>

              <FloatingField label="Report Content" htmlFor="result-entry-template-content" col="full">
                <Input.TextArea
                  id="result-entry-template-content"
                  className={controlClass}
                  rows={4}
                  value={templateContent}
                  onChange={(event) => patchCurrentDraft({ templateContent: event.target.value })}
                  placeholder="Report template content"
                />
              </FloatingField>
            </FormGrid>
          </section>

          <div className="result-entry-form-footer">
            <Button type="primary" className="result-entry-action-btn" onClick={() => handleSave(false)}>
              Save
            </Button>
            <Button type="primary" className="result-entry-action-btn" onClick={() => handleSave(true)}>
              Final
            </Button>
            <Button
              type="primary"
              danger
              className="result-entry-action-btn result-entry-action-btn--danger"
              icon={<AppIcon icon="mdi:delete-outline" className="h-4 w-4" />}
              onClick={handleDeleteSavedComponents}
            >
              Delete saved Components
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
