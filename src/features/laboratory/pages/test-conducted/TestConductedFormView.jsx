'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { App, Button, Input, Select } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import DynamicResultField from '@/features/laboratory/components/DynamicResultField';
import ChangeStatusModal, {
  TEST_CONDUCTED_STATUS_OPTIONS,
} from '@/features/laboratory/pages/result-entry/ChangeStatusModal';
import { useUpdateLaboratoryWorklistStatusMutation } from '@/features/laboratory/api/laboratoryEndpoints';
import {
  buildTestConductedSavedFieldSnapshotOnSave,
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
    second: '2-digit',
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

export default function TestConductedFormView({ record, onAllTestsCompleted }) {
  const { message } = App.useApp();
  const [updateWorklistStatus] = useUpdateLaboratoryWorklistStatusMutation();
  const reportSectionRef = useRef(null);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [sentTestKeys, setSentTestKeys] = useState([]);

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
    savedFieldValues: {},
    finalized: false,
  };

  const {
    fieldValues,
    remarks,
    selectedTemplateId,
    templateContent,
    savedFieldKeys,
    savedFieldTimes,
    savedFieldValues,
    finalized,
  } = currentDraft;
  const isCurrentTestFinalized = Boolean(finalized);
  const hasSavedResults = (savedFieldKeys ?? []).length > 0;
  const savedFieldKeySet = useMemo(() => new Set(savedFieldKeys ?? []), [savedFieldKeys]);

  const getPendingTests = useCallback(
    (group = testGroup, drafts = testDrafts, excludedTestKeys = sentTestKeys) =>
      filterTestConductedTestsByGroup(recordTests, group).filter(
        (test) =>
          !drafts[test.testKey]?.finalized && !excludedTestKeys.includes(test.testKey),
      ),
    [recordTests, sentTestKeys, testDrafts, testGroup],
  );

  const visibleTests = useMemo(() => getPendingTests(), [getPendingTests]);

  const handleTestGroupChange = useCallback(
    (value) => {
      setTestGroup(value);

      const nextPendingTests = getPendingTests(value);
      const isActiveTestVisible = nextPendingTests.some((test) => test.testKey === activeTestKey);

      if (!isActiveTestVisible && nextPendingTests.length) {
        setActiveTestKey(nextPendingTests[0].testKey);
      }
    },
    [activeTestKey, getPendingTests],
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
      const savedSnapshot = buildTestConductedSavedFieldSnapshotOnSave(
        fieldValues,
        filledFieldKeys,
        { savedFieldValues, savedFieldTimes },
      );

      patchCurrentDraft({
        ...savedSnapshot,
        ...(finalize ? { finalized: true } : {}),
      });

      if (finalize) {
        const nextPendingTests = recordTests.filter(
          (test) =>
            test.testKey !== activeTestKey &&
            !sentTestKeys.includes(test.testKey) &&
            !testDrafts[test.testKey]?.finalized,
        );

        if (nextPendingTests.length) {
          setActiveTestKey(nextPendingTests[0].testKey);
        } else {
          onAllTestsCompleted?.();
        }
      }

      const action = finalize ? 'approved' : 'saved';
      message.success(
        `Result ${action} for ${record.patientName} (${schema?.title ?? 'Test'}, Lab #${record.labNo}).`,
      );
    },
    [
      activeTestKey,
      fieldValues,
      isCurrentTestFinalized,
      message,
      onAllTestsCompleted,
      patchCurrentDraft,
      record.labNo,
      record.patientName,
      recordTests,
      savedFieldTimes,
      savedFieldValues,
      schema?.title,
      sentTestKeys,
      testDrafts,
    ],
  );

  const handleViewReport = useCallback(() => {
    reportSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    message.info(`Report section opened for ${schema?.title ?? 'selected test'}.`);
  }, [message, schema?.title]);

  const handleChangeStatus = useCallback(
    (status) => {
      const recordId = record.sourceRecordId ?? record.id;
      void updateWorklistStatus({ recordId, status });

      const statusLabel =
        TEST_CONDUCTED_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
      const activeTest = recordTests.find((test) => test.testKey === activeTestKey);
      const nextSentTestKeys = sentTestKeys.includes(activeTestKey)
        ? sentTestKeys
        : [...sentTestKeys, activeTestKey];

      setSentTestKeys(nextSentTestKeys);

      const nextPendingTests = recordTests.filter(
        (test) =>
          !nextSentTestKeys.includes(test.testKey) && !testDrafts[test.testKey]?.finalized,
      );

      if (nextPendingTests.length) {
        setActiveTestKey(nextPendingTests[0].testKey);
      } else {
        onAllTestsCompleted?.();
      }

      message.success(
        `${activeTest?.label ?? schema?.title ?? 'Test'} sent to ${statusLabel} for ${record.patientName} (Lab #${record.labNo}).`,
      );
    },
    [
      activeTestKey,
      message,
      onAllTestsCompleted,
      record.id,
      record.labNo,
      record.patientName,
      record.sourceRecordId,
      recordTests,
      schema?.title,
      sentTestKeys,
      testDrafts,
    ],
  );

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
          <div className="test-conducted-main-header">
            <h2 className="test-conducted-form-title">
              {schema?.title ?? 'Test Results'}
              {isCurrentTestFinalized ? (
                <span className="test-conducted-form-finalized-badge">Finalized</span>
              ) : null}
            </h2>
            <Button
              icon={<AppIcon icon="mdi:swap-horizontal" className="h-4 w-4" />}
              onClick={() => setIsChangeStatusModalOpen(true)}
            >
              Change Status
            </Button>
          </div>

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
                icon={<AppIcon icon="mdi:file-document-outline" className="h-4 w-4" />}
                onClick={handleViewReport}
              >
                View Report
              </Button>
            ) : null}
            <Button
              type="primary"
              disabled={isCurrentTestFinalized}
              onClick={() => handleSave(false)}
            >
              Save
            </Button>
            <Button
              type="primary"
              className="test-conducted-approve-btn"
              disabled={isCurrentTestFinalized}
              onClick={() => handleSave(true)}
            >
              Approve
            </Button>
          </div>
        </div>
      </div>

      <ChangeStatusModal
        open={isChangeStatusModalOpen}
        onClose={() => setIsChangeStatusModalOpen(false)}
        patientName={record.patientName}
        labNo={record.labNo}
        options={TEST_CONDUCTED_STATUS_OPTIONS}
        onConfirm={handleChangeStatus}
      />
    </div>
  );
}
