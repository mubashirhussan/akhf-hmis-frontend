'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { App, Button, Collapse, Input, Select } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import DynamicResultField from '@/features/laboratory/components/DynamicResultField';
import DeleteSavedComponentsModal from '@/features/laboratory/pages/result-entry/DeleteSavedComponentsModal';
import './result-entry.css';
import PatientInfoHeaderCard from '@/features/patient/components/PatientInfoHeaderCard';
import {
  createResultEntryFieldValues,
  createResultEntryTestDrafts,
  createResultEntryTestsForRecord,
  getFilledResultEntryFieldKeys,
  getResultEntryFieldSchema,
  getResultEntryReportTemplates,
  filterResultEntryTestsByGroup,
  resolveResultEntryTest,
  RESULT_ENTRY_ALL_TEST_GROUP,
  RESULT_ENTRY_TEST_GROUP_FILTER_OPTIONS,
} from '@/features/laboratory/api/mock-result-entry';
import { buildPatientInfoSummary } from '@/features/patient/utils/patient-info';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const controlClass = FIELD_CONTROL_CLASS;

function ResultEntryFieldRow({ field, value, onChange, idPrefix, highlighted = false, disabled = false }) {
  const fieldId = `${idPrefix}-${field.key}`;

  return (
    <div
      className={[
        'result-entry-field-row',
        highlighted ? 'result-entry-field-row--saved' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label className="result-entry-field-label" htmlFor={fieldId}>
        {field.label}
      </label>
      <div className="result-entry-field-control">
        <DynamicResultField
          id={fieldId}
          field={field}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
      <span className="result-entry-field-ref">{field.refRange ?? '—'}</span>
    </div>
  );
}

export default function ResultEntryFormView({ record }) {
  const { message } = App.useApp();
  const reportSectionRef = useRef(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const patient = useMemo(() => buildPatientInfoSummary(record), [record]);
  const initialSelection = useMemo(() => resolveResultEntryTest(record), [record]);
  const recordTests = useMemo(() => createResultEntryTestsForRecord(record), [record]);

  const [testGroup, setTestGroup] = useState(RESULT_ENTRY_ALL_TEST_GROUP);
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
    savedFieldKeys: [],
    finalized: false,
  };

  const { fieldValues, remarks, selectedTemplateId, templateContent, savedFieldKeys, finalized } =
    currentDraft;
  const isCurrentTestFinalized = Boolean(finalized);
  const savedFieldKeySet = useMemo(() => new Set(savedFieldKeys ?? []), [savedFieldKeys]);

  const visibleTests = useMemo(
    () => filterResultEntryTestsByGroup(recordTests, testGroup),
    [recordTests, testGroup],
  );

  const testNameOptions = useMemo(
    () => visibleTests.map((test) => ({ value: test.testKey, label: test.label })),
    [visibleTests],
  );

  const handleTestGroupChange = useCallback(
    (value) => {
      setTestGroup(value);

      const nextVisibleTests = filterResultEntryTestsByGroup(recordTests, value);
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
      if (isCurrentTestFinalized) {
        message.warning('This test is already finalized and cannot be edited.');
        return;
      }

      const filledFieldKeys = getFilledResultEntryFieldKeys(fieldValues);

      patchCurrentDraft({
        savedFieldKeys: filledFieldKeys,
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

  const savedParameters = useMemo(() => {
    if (!schema) return [];

    const fieldMap = new Map();
    for (const section of schema.sections) {
      for (const field of section.fields) {
        fieldMap.set(field.key, field);
      }
    }

    return (savedFieldKeys ?? [])
      .map((key) => ({
        key,
        label: fieldMap.get(key)?.label ?? key,
        value: fieldValues[key],
      }))
      .filter((parameter) => String(parameter.value ?? '').trim() !== '');
  }, [fieldValues, savedFieldKeys, schema]);

  const handleOpenDeleteModal = useCallback(() => {
    if (!savedParameters.length) {
      message.warning('No saved parameters to delete. Save results first.');
      return;
    }

    setIsDeleteModalOpen(true);
  }, [message, savedParameters.length]);

  const handleDeleteSelectedParameters = useCallback(
    (selectedKeys) => {
      const keysToDelete = new Set(selectedKeys);
      const nextFieldValues = { ...fieldValues };

      for (const key of keysToDelete) {
        nextFieldValues[key] = '';
      }

      patchCurrentDraft({
        fieldValues: nextFieldValues,
        savedFieldKeys: (savedFieldKeys ?? []).filter((key) => !keysToDelete.has(key)),
      });

      message.success(
        `${selectedKeys.length} saved parameter${selectedKeys.length === 1 ? '' : 's'} deleted.`,
      );
    },
    [fieldValues, patchCurrentDraft, savedFieldKeys, message],
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
                  options={RESULT_ENTRY_TEST_GROUP_FILTER_OPTIONS}
                  onChange={handleTestGroupChange}
                />
              </FloatingField>

            
            </FormGrid>
          </section>

          <section className="result-entry-sidebar-tests" aria-label="Ordered tests">
            <h3 className="result-entry-sidebar-tests-label">Tests</h3>
            <div className="result-entry-test-list" role="list">
            {visibleTests.map((test) => {
              const isActive = test.testKey === activeTestKey;
              const isFinalized = Boolean(testDrafts[test.testKey]?.finalized);

              return (
                <button
                  key={test.id}
                  type="button"
                  role="listitem"
                  className={[
                    'result-entry-selection-card',
                    isActive ? 'result-entry-selection-card--active' : '',
                    isFinalized ? 'result-entry-selection-card--finalized' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleSelectTest(test.testKey)}
                  aria-pressed={isActive}
                >
                  <p className="result-entry-selection-title">{test.label}</p>
                  <p className="result-entry-selection-lab">Lab # {test.labNo}</p>
                  {isFinalized ? (
                    <span className="result-entry-selection-status">Finalized</span>
                  ) : null}
                </button>
              );
            })}
            </div>
          </section>
        </aside>

        <div className="result-entry-main">
          <h2 className="result-entry-form-title">
            {schema?.title ?? 'Enter Result'}
            {isCurrentTestFinalized ? (
              <span className="result-entry-form-finalized-badge">Finalized</span>
            ) : null}
          </h2>

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
                      highlighted={savedFieldKeySet.has(field.key)}
                      disabled={isCurrentTestFinalized}
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
                      highlighted={savedFieldKeySet.has(field.key)}
                      disabled={isCurrentTestFinalized}
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
                disabled={isCurrentTestFinalized}
                onChange={(event) => patchCurrentDraft({ remarks: event.target.value })}
              />
            </FloatingField>
          </section>

          <section
            ref={reportSectionRef}
            className="result-entry-report-section"
            aria-label="Report templates"
          >
            <h3 className="result-entry-block-label">Report</h3>

            <FormGrid columns={1} className="result-entry-report-form">
              <FloatingField label="Templates" htmlFor="result-entry-template" col="full">
                <Select
                  id="result-entry-template"
                  className={controlClass}
                  value={selectedTemplateId || undefined}
                  options={reportTemplates}
                  placeholder="Select template"
                  disabled={isCurrentTestFinalized}
                  onChange={handleTemplateChange}
                />
              </FloatingField>

              <FloatingField label="Report Content" htmlFor="result-entry-template-content" col="full">
                <Input.TextArea
                  id="result-entry-template-content"
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

          <div className="result-entry-form-footer">
            <Button
              className="billing-patient-report-btn result-entry-action-btn result-entry-view-report-btn"
              icon={<AppIcon icon="mdi:file-document-outline" className="h-4 w-4" />}
              onClick={handleViewReport}
            >
              View Report
            </Button>
            <Button
              type="primary"
              className="result-entry-action-btn"
              disabled={isCurrentTestFinalized}
              onClick={() => handleSave(false)}
            >
              Save
            </Button>
            <Button
              type="primary"
              className="result-entry-action-btn"
              disabled={isCurrentTestFinalized}
              onClick={() => handleSave(true)}
            >
              Final
            </Button>
            <Button
              type="primary"
              danger
              className="result-entry-action-btn result-entry-action-btn--danger"
              icon={<AppIcon icon="mdi:delete-outline" className="h-4 w-4" />}
              disabled={isCurrentTestFinalized}
              onClick={handleOpenDeleteModal}
            >
              Delete saved Components
            </Button>
          </div>
        </div>
      </div>

      <DeleteSavedComponentsModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        testTitle={schema?.title}
        savedParameters={savedParameters}
        onDeleteSelected={handleDeleteSelectedParameters}
      />
    </div>
  );
}
