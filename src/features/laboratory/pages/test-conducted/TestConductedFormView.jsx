'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { App, Button, Input, Select } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import DynamicResultField from '@/features/laboratory/components/DynamicResultField';
import {
  createTestConductedDrafts,
  createTestConductedFieldValues,
  createTestConductedTestsForRecord,
  filterTestConductedTestsByGroup,
  getFilledTestConductedFieldKeys,
  getTestConductedFieldSchema,
  getTestConductedReportTemplates,
  resolveTestConductedTest,
  TEST_CONDUCTED_ALL_TEST_GROUP,
  TEST_CONDUCTED_TEST_GROUP_FILTER_OPTIONS,
} from '@/features/laboratory/api/mock-test-conducted';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import './test-conducted.css';

const controlClass = FIELD_CONTROL_CLASS;

function formatSavedFieldDateTime(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);
  const datePart = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${datePart}, ${timePart}`;
}

function TestConductedFieldRow({
  field,
  value,
  onChange,
  idPrefix,
  highlighted = false,
  disabled = false,
  savedAt = '',
}) {
  const fieldId = `${idPrefix}-${field.key}`;

  return (
    <div
      className={[
        'test-conducted-field-row',
        highlighted ? 'test-conducted-field-row--saved' : '',
        highlighted && disabled ? 'test-conducted-field-row--verified' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label className="test-conducted-field-label" htmlFor={fieldId}>
        <span className="test-conducted-field-label-text">{field.label}</span>
        {highlighted && savedAt ? (
          <span className="test-conducted-field-saved-time">{formatSavedFieldDateTime(savedAt)}</span>
        ) : null}
      </label>
      <div className="test-conducted-field-control">
        <DynamicResultField
          id={fieldId}
          field={field}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
      <span className="test-conducted-field-ref">{field.refRange ?? '—'}</span>
    </div>
  );
}

export default function TestConductedFormView({ record }) {
  const { message } = App.useApp();
  const reportSectionRef = useRef(null);

  const initialSelection = useMemo(() => resolveTestConductedTest(record), [record]);
  const recordTests = useMemo(() => createTestConductedTestsForRecord(record), [record]);

  const [testGroup, setTestGroup] = useState(TEST_CONDUCTED_ALL_TEST_GROUP);
  const [activeTestKey, setActiveTestKey] = useState(
    () => record.conductedTestKey ?? initialSelection.testKey,
  );
  const [testDrafts, setTestDrafts] = useState(() => createTestConductedDrafts(record));

  const schema = useMemo(() => getTestConductedFieldSchema(activeTestKey), [activeTestKey]);
  const reportTemplates = useMemo(
    () => getTestConductedReportTemplates(activeTestKey),
    [activeTestKey],
  );

  const currentDraft = testDrafts[activeTestKey] ?? {
    fieldValues: createTestConductedFieldValues(schema),
    remarks: schema?.defaultRemarks ?? '',
    selectedTemplateId: reportTemplates[0]?.value ?? '',
    templateContent: reportTemplates[0]?.content ?? '',
    savedFieldKeys: [],
    savedFieldTimes: {},
    finalized: false,
  };

  const {
    fieldValues,
    remarks,
    selectedTemplateId,
    templateContent,
    savedFieldKeys,
    savedFieldTimes,
    finalized,
  } = currentDraft;
  const isCurrentTestFinalized = Boolean(finalized);
  const hasSavedResults = (savedFieldKeys ?? []).length > 0;
  const savedFieldKeySet = useMemo(() => new Set(savedFieldKeys ?? []), [savedFieldKeys]);

  const visibleTests = useMemo(
    () => filterTestConductedTestsByGroup(recordTests, testGroup),
    [recordTests, testGroup],
  );

  const handleTestGroupChange = useCallback(
    (value) => {
      setTestGroup(value);

      const nextVisibleTests = filterTestConductedTestsByGroup(recordTests, value);
      const isActiveTestVisible = nextVisibleTests.some((test) => test.testKey === activeTestKey);

      if (!isActiveTestVisible && nextVisibleTests.length) {
        setActiveTestKey(nextVisibleTests[0].testKey);
      }
    },
    [activeTestKey, recordTests],
  );

  const handleSelectTest = useCallback((testKey) => {
    setActiveTestKey(testKey);
  }, []);

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
      if (isCurrentTestFinalized) {
        message.warning('This test is already finalized and cannot be edited.');
        return;
      }

      const filledFieldKeys = getFilledTestConductedFieldKeys(fieldValues);
      const savedAt = new Date().toISOString();
      const nextSavedFieldTimes = Object.fromEntries(
        filledFieldKeys.map((key) => [key, savedAt]),
      );

      patchCurrentDraft({
        savedFieldKeys: filledFieldKeys,
        savedFieldTimes: nextSavedFieldTimes,
        ...(finalize ? { finalized: true } : {}),
      });

      const action = finalize ? 'finalized' : 'saved';
      message.success(
        `Result ${action} for ${record.patientName} (${schema?.title ?? 'Test'}, Lab #${record.labNo}).`,
      );
    },
    [
      fieldValues,
      isCurrentTestFinalized,
      message,
      patchCurrentDraft,
      record.labNo,
      record.patientName,
      schema?.title,
    ],
  );

  const handleViewReport = useCallback(() => {
    reportSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    message.info(`Report section opened for ${schema?.title ?? 'selected test'}.`);
  }, [message, schema?.title]);

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
    <div className="services-billing-page test-conducted-form-page">
      <div className="test-conducted-form-layout">
        <aside className="test-conducted-sidebar" aria-label="Test selection">
          <section className="test-conducted-sidebar-filters" aria-label="Test filters">
            <FormGrid columns={1} className="test-conducted-sidebar-form">
              <FloatingField label="Test Group" htmlFor="test-conducted-test-group">
                <Select
                  id="test-conducted-test-group"
                  className={controlClass}
                  value={testGroup}
                  options={TEST_CONDUCTED_TEST_GROUP_FILTER_OPTIONS}
                  onChange={handleTestGroupChange}
                />
              </FloatingField>
            </FormGrid>
          </section>

          <section className="test-conducted-sidebar-tests" aria-label="Ordered tests">
            <h3 className="test-conducted-sidebar-tests-label">Tests</h3>
            <div className="test-conducted-test-list" role="list">
              {visibleTests.map((test) => {
                const isActive = test.testKey === activeTestKey;

                return (
                  <button
                    key={test.id}
                    type="button"
                    role="listitem"
                    className={[
                      'test-conducted-selection-card',
                      isActive ? 'test-conducted-selection-card--active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleSelectTest(test.testKey)}
                    aria-pressed={isActive}
                  >
                    <p className="test-conducted-selection-title">{test.label}</p>
                    <p className="test-conducted-selection-lab">Lab # {test.labNo}</p>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        <div className="test-conducted-main">
          <h2 className="test-conducted-form-title">
            {schema?.title ?? 'Test Results'}
            {isCurrentTestFinalized ? (
              <span className="test-conducted-form-finalized-badge">Finalized</span>
            ) : null}
          </h2>

          {sectionColumns.map((section) => (
            <section
              key={section.title}
              className="test-conducted-section"
              aria-label={section.title}
            >
              <div className="test-conducted-section-header">
                <h3 className="test-conducted-section-title">{section.title}</h3>
              </div>

              <div className="test-conducted-fields-grid">
                <div className="test-conducted-fields-column">
                  {section.leftFields.map((field) => (
                    <TestConductedFieldRow
                      key={field.key}
                      field={field}
                      value={fieldValues[field.key]}
                      highlighted={savedFieldKeySet.has(field.key)}
                      savedAt={savedFieldTimes?.[field.key]}
                      disabled={isCurrentTestFinalized}
                      onChange={(value) => patchFieldValue(field.key, value)}
                      idPrefix="test-conducted"
                    />
                  ))}
                </div>

                <div className="test-conducted-fields-column">
                  {section.rightFields.map((field) => (
                    <TestConductedFieldRow
                      key={field.key}
                      field={field}
                      value={fieldValues[field.key]}
                      highlighted={savedFieldKeySet.has(field.key)}
                      savedAt={savedFieldTimes?.[field.key]}
                      disabled={isCurrentTestFinalized}
                      onChange={(value) => patchFieldValue(field.key, value)}
                      idPrefix="test-conducted"
                    />
                  ))}
                </div>
              </div>
            </section>
          ))}

          <section className="test-conducted-remarks-section" aria-label="Remarks">
            <h3 className="test-conducted-block-label">Remarks :</h3>
            <FloatingField label="Remarks" htmlFor="test-conducted-remarks" col="full">
              <Input.TextArea
                id="test-conducted-remarks"
                className={controlClass}
                rows={4}
                value={remarks}
                disabled={isCurrentTestFinalized}
                onChange={(event) => patchCurrentDraft({ remarks: event.target.value })}
              />
            </FloatingField>
          </section>

          <section
            ref={reportSectionRef}
            className="test-conducted-report-section"
            aria-label="Report templates"
          >
            <h3 className="test-conducted-block-label">Report</h3>

            <FormGrid columns={1} className="test-conducted-report-form">
              <FloatingField label="Templates" htmlFor="test-conducted-template" col="full">
                <Select
                  id="test-conducted-template"
                  className={controlClass}
                  value={selectedTemplateId || undefined}
                  options={reportTemplates}
                  placeholder="Select template"
                  disabled={isCurrentTestFinalized}
                  onChange={handleTemplateChange}
                />
              </FloatingField>

              <FloatingField label="Report Content" htmlFor="test-conducted-template-content" col="full">
                <Input.TextArea
                  id="test-conducted-template-content"
                  className={controlClass}
                  rows={4}
                  value={templateContent}
                  disabled={isCurrentTestFinalized}
                  onChange={(event) => patchCurrentDraft({ templateContent: event.target.value })}
                  placeholder="Report template content"
                />
              </FloatingField>
            </FormGrid>
          </section>

          <div className="test-conducted-form-footer">
            {hasSavedResults ? (
              <Button
                className="billing-patient-report-btn test-conducted-action-btn test-conducted-view-report-btn"
                icon={<AppIcon icon="mdi:file-document-outline" className="h-4 w-4" />}
                onClick={handleViewReport}
              >
                View Report
              </Button>
            ) : null}
            <Button
              type="primary"
              className="test-conducted-action-btn"
              disabled={isCurrentTestFinalized}
              onClick={() => handleSave(false)}
            >
              Save
            </Button>
            <Button
              type="primary"
              className="test-conducted-action-btn test-conducted-action-btn--final"
              disabled={isCurrentTestFinalized}
              onClick={() => handleSave(true)}
            >
              Final
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
