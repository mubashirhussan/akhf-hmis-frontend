'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { App, Button, Space, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import { UNIT_OPTIONS as BASE_UNIT_OPTIONS } from '@/features/admin-pathology/api/mock-pathology-component';
import {
  CONDITION_OPTIONS,
  GENDER_OPTIONS,
  GROUP_OPTIONS,
  INITIAL_PATHOLOGY_TEST_RANGE_ROWS,
  createEmptyPathologyTestRangeForm,
  formatAgeForDisplay,
  getComponentOptions,
  getOptionLabel,
  getSubGroupOptions,
  getTestMeta,
  rowToPathologyTestRangeForm,
} from '@/features/admin-pathology/api/mock-pathology-test-range';
import PathologyTestRangeModal from '@/features/admin-pathology/pages/pathology-test-range/PathologyTestRangeModal';
import ConversionRateModal from '@/features/admin-pathology/pages/pathology-test-range/ConversionRateModal';
import { useConfirm } from '@/hooks/useConfirm';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';
const DELETE_ICON_CLASS = 'h-[16px] w-[16px] text-[#ff4d4f]';

export default function PathologyTestRangePage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const nextIdRef = useRef(
    Math.max(...INITIAL_PATHOLOGY_TEST_RANGE_ROWS.map((row) => Number(row.id)), 0) + 1,
  );

  const [form, setForm] = useState(createEmptyPathologyTestRangeForm);
  const [rows, setRows] = useState(INITIAL_PATHOLOGY_TEST_RANGE_ROWS);
  const [unitOptions, setUnitOptions] = useState(BASE_UNIT_OPTIONS);
  const [conditionOptions, setConditionOptions] = useState(CONDITION_OPTIONS);
  const [isTestRangeModalOpen, setIsTestRangeModalOpen] = useState(false);
  const [isConversionRateModalOpen, setIsConversionRateModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const patchForm = useCallback((patch) => {
    setForm((current) => ({ ...current, ...patch }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const openTestRangeModal = useCallback(() => {
    setForm(createEmptyPathologyTestRangeForm());
    setEditingRowId(null);
    setFieldErrors({});
    setIsTestRangeModalOpen(true);
  }, []);

  const closeTestRangeModal = useCallback(() => {
    setIsTestRangeModalOpen(false);
    setEditingRowId(null);
    setFieldErrors({});
  }, []);

  const handleEditRow = useCallback(
    (record) => {
      setForm(rowToPathologyTestRangeForm(record, unitOptions));
      setEditingRowId(record.id);
      setFieldErrors({});
      setIsTestRangeModalOpen(true);
    },
    [unitOptions],
  );

  const handleDeleteRow = useCallback(
    async (record) => {
      const itemName = [record.testName, record.componentName].filter(Boolean).join(' — ');
      const confirmed = await confirmDelete({ itemName });

      if (confirmed) {
        setRows((current) => current.filter((row) => row.id !== record.id));
        message.success('Test range removed.');
      }
    },
    [confirmDelete, message],
  );

  const handleSave = useCallback(() => {
    if (!form.testComponent) {
      setFieldErrors({ testComponent: 'Test Component is required.' });
      return;
    }

    setFieldErrors({});

    const testMeta = getTestMeta(form.subGroupName, form.testName);
    const componentOptions = getComponentOptions(form.subGroupName, form.testName);
    const componentMeta = componentOptions.find((option) => option.value === form.testComponent);

    const rowPayload = {
      groupName: getOptionLabel(GROUP_OPTIONS, form.groupName),
      subGroupName: getOptionLabel(getSubGroupOptions(form.groupName), form.subGroupName),
      testName: testMeta?.label ?? form.testName,
      componentName: componentMeta?.label ?? '',
      tcid: componentMeta?.tcid ?? (Number(form.testComponentTcid) || 0),
      startValue: form.startValue.trim(),
      endValue: form.endValue.trim(),
      reportValues: form.reportValues.trim(),
      gender: getOptionLabel(GENDER_OPTIONS, form.gender),
      minAge: formatAgeForDisplay(form.ageStart, form.ageStartUnit),
      maxAge: formatAgeForDisplay(form.ageEnd, form.ageEndUnit),
      ageStart: form.ageStart,
      ageStartUnit: form.ageStartUnit,
      ageEnd: form.ageEnd,
      ageEndUnit: form.ageEndUnit,
      condition: getOptionLabel(conditionOptions, form.condition),
      unit: getOptionLabel(unitOptions, form.unit) || '—',
    };

    if (editingRowId) {
      setRows((current) =>
        current.map((row) => (row.id === editingRowId ? { ...row, ...rowPayload } : row)),
      );
      setIsTestRangeModalOpen(false);
      setEditingRowId(null);
      message.success('Test range updated.');
      return;
    }

    const id = String(nextIdRef.current);
    nextIdRef.current += 1;

    setRows((current) => [{ id, ...rowPayload }, ...current]);
    setIsTestRangeModalOpen(false);
    message.success('Test range saved to the table.');
  }, [conditionOptions, editingRowId, form, message, unitOptions]);

  const handleExport = useCallback(() => {
    if (rows.length === 0) {
      message.warning('No data to export.');
      return;
    }
    message.info('Export will be connected to the backend API.');
  }, [message, rows.length]);

  const handleAddCondition = useCallback(() => {
    const label = form.newCondition.trim();
    if (!label) {
      message.error('Enter a condition name first.');
      return;
    }

    const value = label.toLowerCase().replace(/\s+/g, '-');
    const existing = conditionOptions.find(
      (option) => option.value === value || option.label.toLowerCase() === label.toLowerCase(),
    );

    if (existing) {
      patchForm({ condition: existing.value, newCondition: '' });
      message.info(`Condition "${existing.label}" already exists.`);
      return;
    }

    setConditionOptions((current) => [...current, { value, label }]);
    patchForm({ condition: value, newCondition: '' });
    message.success(`Condition "${label}" added.`);
  }, [conditionOptions, form.newCondition, message, patchForm]);

  const handleAddConversionRate = useCallback(() => {
    setIsConversionRateModalOpen(true);
  }, []);

  const closeConversionRateModal = useCallback(() => {
    setIsConversionRateModalOpen(false);
  }, []);

  const conversionRateDefaultUnit = useMemo(
    () => getOptionLabel(unitOptions, form.unit) || 'Null',
    [form.unit, unitOptions],
  );

  const columns = useMemo(
    () => [
      { title: 'TestName', dataIndex: 'testName', key: 'testName', width: 200 },
      { title: 'Component Name', dataIndex: 'componentName', key: 'componentName', width: 200 },
      { title: 'StartValue', dataIndex: 'startValue', key: 'startValue', width: 110 },
      { title: 'EndValue', dataIndex: 'endValue', key: 'endValue', width: 110 },
      { title: 'Report Values', dataIndex: 'reportValues', key: 'reportValues', width: 140 },
      { title: 'Gender', dataIndex: 'gender', key: 'gender', width: 90 },
      { title: 'Min_Age', dataIndex: 'minAge', key: 'minAge', width: 160 },
      { title: 'Max_Age', dataIndex: 'maxAge', key: 'maxAge', width: 160 },
      {
        title: 'Action',
        key: 'action',
        width: 96,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <Space size={4} className="pathology-test-range-actions-cell">
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                className="pathology-test-range-edit-btn"
                aria-label="Edit test range"
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                size="small"
                className="pathology-test-range-delete-btn"
                aria-label="Delete test range"
                icon={<AppIcon icon="mdi:delete-outline" className={DELETE_ICON_CLASS} />}
                onClick={() => handleDeleteRow(record)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [handleDeleteRow, handleEditRow],
  );

  return (
    <div className="services-billing-page pathology-test-range-page">
      <div className="pathology-test-range-table-toolbar">
        <Button type="primary" onClick={openTestRangeModal}>
          Add Test Range
        </Button>
        <Button
          className="pathology-test-range-export-btn"
          icon={<AppIcon icon="mdi:export" className="h-4 w-4" />}
          onClick={handleExport}
        >
          Export
        </Button>
      </div>

      <section className="services-billing-results" aria-label="Pathology test ranges">
        <DataTable
          rowKey="id"
          columns={columns}
          dataSource={rows}
          columnAlign="left"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </section>

      <PathologyTestRangeModal
        open={isTestRangeModalOpen}
        onClose={closeTestRangeModal}
        title={editingRowId ? 'Edit Test Range' : 'Add Test Range'}
        form={form}
        unitOptions={unitOptions}
        conditionOptions={conditionOptions}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
        onAddCondition={handleAddCondition}
        onAddConversionRate={handleAddConversionRate}
      />

      <ConversionRateModal
        open={isConversionRateModalOpen}
        onClose={closeConversionRateModal}
        defaultUnit={conversionRateDefaultUnit}
      />
    </div>
  );
}
