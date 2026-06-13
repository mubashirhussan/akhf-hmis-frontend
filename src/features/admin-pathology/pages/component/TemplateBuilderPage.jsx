'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { App, Button } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import TemplateBuilderModal from '@/features/admin-pathology/components/TemplateBuilderModal';
import {
  FIELD_TYPE_OPTIONS,
  GROUP_OPTIONS,
  INITIAL_TEMPLATE_BUILDER_ROWS,
  UNIT_OPTIONS,
  createEmptyTemplateBuilderForm,
  getOptionLabel,
  getSubGroupOptions,
  getTestMeta,
} from '@/features/admin-pathology/api/mock-template-builder';

export default function TemplateBuilderPage() {
  const { message } = App.useApp();
  const nextTcidRef = useRef(
    Math.max(...INITIAL_TEMPLATE_BUILDER_ROWS.map((row) => row.tcid), 0) + 1,
  );

  const [form, setForm] = useState(createEmptyTemplateBuilderForm);
  const [rows, setRows] = useState(INITIAL_TEMPLATE_BUILDER_ROWS);
  const [unitOptions, setUnitOptions] = useState(UNIT_OPTIONS);
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
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

  const openComponentModal = useCallback(() => {
    setForm(createEmptyTemplateBuilderForm());
    setFieldErrors({});
    setIsComponentModalOpen(true);
  }, []);

  const closeComponentModal = useCallback(() => {
    setIsComponentModalOpen(false);
    setFieldErrors({});
  }, []);

  const handleSave = useCallback(() => {
    const componentName = form.componentName.trim();
    if (!componentName) {
      setFieldErrors({ componentName: 'Component Name is required.' });
      return;
    }

    setFieldErrors({});

    const testMeta = getTestMeta(form.subGroupName, form.testName);
    const tcid = nextTcidRef.current;
    nextTcidRef.current += 1;

    const newRow = {
      id: String(tcid),
      groupName: getOptionLabel(GROUP_OPTIONS, form.groupName),
      subGroupName: getOptionLabel(getSubGroupOptions(form.groupName), form.subGroupName),
      tid: testMeta?.tid ?? 0,
      testName: testMeta?.label ?? form.testName,
      tcid,
      componentName,
      fieldType: getOptionLabel(FIELD_TYPE_OPTIONS, form.fieldType),
      referenceMale: form.referenceMale.trim(),
      referenceFemale: form.referenceFemale.trim(),
    };

    setRows((current) => [newRow, ...current]);
    setIsComponentModalOpen(false);
    message.success('Component saved to the table.');
  }, [form, message]);

  const handleExport = useCallback(() => {
    if (rows.length === 0) {
      message.warning('No data to export.');
      return;
    }
    message.info('Export will be connected to the backend API.');
  }, [message, rows.length]);

  const handleAddUnit = useCallback(() => {
    const label = form.newUnit.trim();
    if (!label) {
      message.error('Enter a unit name first.');
      return;
    }

    const value = label.toLowerCase().replace(/\s+/g, '-');
    const existing = unitOptions.find(
      (option) => option.value === value || option.label.toLowerCase() === label.toLowerCase(),
    );

    if (existing) {
      patchForm({ unit: existing.value, newUnit: '' });
      message.info(`Unit "${existing.label}" already exists.`);
      return;
    }

    setUnitOptions((current) => [...current, { value, label }]);
    patchForm({ unit: value, newUnit: '' });
    message.success(`Unit "${label}" added.`);
  }, [form.newUnit, message, patchForm, unitOptions]);

  const columns = useMemo(
    () => [
      { title: 'Group Name', dataIndex: 'groupName', key: 'groupName', width: 140 },
      { title: 'Sub Group Name', dataIndex: 'subGroupName', key: 'subGroupName', width: 160 },
      { title: 'TID', dataIndex: 'tid', key: 'tid', width: 80 },
      { title: 'Test Name', dataIndex: 'testName', key: 'testName', width: 180 },
      { title: 'TCID', dataIndex: 'tcid', key: 'tcid', width: 90 },
      { title: 'Component Name', dataIndex: 'componentName', key: 'componentName', width: 200 },
      { title: 'Field Type', dataIndex: 'fieldType', key: 'fieldType', width: 110 },
      {
        title: 'Reference Values Male',
        dataIndex: 'referenceMale',
        key: 'referenceMale',
        width: 160,
      },
      {
        title: 'Reference Value Female',
        dataIndex: 'referenceFemale',
        key: 'referenceFemale',
        width: 160,
      },
    ],
    [],
  );

  return (
    <div className="services-billing-page template-builder-page">
      <div className="template-builder-table-toolbar">
        <Button type="primary" onClick={openComponentModal}>
          Add Component
        </Button>
        <Button
          className="template-builder-export-btn"
          icon={<AppIcon icon="mdi:export" className="h-4 w-4" />}
          onClick={handleExport}
        >
          Export
        </Button>
      </div>

      <section className="services-billing-results" aria-label="Template builder components">
        <DataTable
          rowKey="id"
          columns={columns}
          dataSource={rows}
          columnAlign="left"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: true }}
        />
      </section>

      <TemplateBuilderModal
        open={isComponentModalOpen}
        onClose={closeComponentModal}
        form={form}
        unitOptions={unitOptions}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
        onAddUnit={handleAddUnit}
      />
    </div>
  );
}
