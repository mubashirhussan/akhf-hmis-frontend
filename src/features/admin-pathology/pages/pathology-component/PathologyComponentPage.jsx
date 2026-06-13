'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { App, Button, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import PathologyComponentModal from '@/features/admin-pathology/pages/pathology-component/PathologyComponentModal';
import {
  FIELD_TYPE_OPTIONS,
  GROUP_OPTIONS,
  INITIAL_PATHOLOGY_COMPONENT_ROWS,
  UNIT_OPTIONS,
  createEmptyPathologyComponentForm,
  getOptionLabel,
  getSubGroupOptions,
  getTestMeta,
  rowToPathologyComponentForm,
} from '@/features/admin-pathology/api/mock-pathology-component';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function PathologyComponentPage() {
  const { message } = App.useApp();
  const nextTcidRef = useRef(
    Math.max(...INITIAL_PATHOLOGY_COMPONENT_ROWS.map((row) => row.tcid), 0) + 1,
  );

  const [form, setForm] = useState(createEmptyPathologyComponentForm);
  const [rows, setRows] = useState(INITIAL_PATHOLOGY_COMPONENT_ROWS);
  const [unitOptions, setUnitOptions] = useState(UNIT_OPTIONS);
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
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

  const openComponentModal = useCallback(() => {
    setForm(createEmptyPathologyComponentForm());
    setEditingRowId(null);
    setFieldErrors({});
    setIsComponentModalOpen(true);
  }, []);

  const closeComponentModal = useCallback(() => {
    setIsComponentModalOpen(false);
    setEditingRowId(null);
    setFieldErrors({});
  }, []);

  const handleEditRow = useCallback(
    (record) => {
      setForm(rowToPathologyComponentForm(record, unitOptions));
      setEditingRowId(record.id);
      setFieldErrors({});
      setIsComponentModalOpen(true);
    },
    [unitOptions],
  );

  const handleSave = useCallback(() => {
    const componentName = form.componentName.trim();
    if (!componentName) {
      setFieldErrors({ componentName: 'Component Name is required.' });
      return;
    }

    setFieldErrors({});

    const testMeta = getTestMeta(form.subGroupName, form.testName);
    const rowPayload = {
      groupName: getOptionLabel(GROUP_OPTIONS, form.groupName),
      subGroupName: getOptionLabel(getSubGroupOptions(form.groupName), form.subGroupName),
      tid: testMeta?.tid ?? 0,
      testName: testMeta?.label ?? form.testName,
      componentName,
      fieldType: getOptionLabel(FIELD_TYPE_OPTIONS, form.fieldType),
      unit: getOptionLabel(unitOptions, form.unit) || '—',
      priority: form.priority ?? 1,
      toolTip: form.toolTip.trim(),
      referenceMale: form.referenceMale.trim(),
      referenceFemale: form.referenceFemale.trim(),
    };

    if (editingRowId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingRowId ? { ...row, ...rowPayload } : row,
        ),
      );
      setIsComponentModalOpen(false);
      setEditingRowId(null);
      message.success('Component updated.');
      return;
    }

    const tcid = nextTcidRef.current;
    nextTcidRef.current += 1;

    setRows((current) => [
      {
        id: String(tcid),
        tcid,
        ...rowPayload,
      },
      ...current,
    ]);
    setIsComponentModalOpen(false);
    message.success('Component saved to the table.');
  }, [editingRowId, form, message, unitOptions]);

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
      { title: 'Group Name', dataIndex: 'groupName', key: 'groupName', width: 130, className: 'pathology-component-col-group-name' },
      { title: 'Sub Group Name', dataIndex: 'subGroupName', key: 'subGroupName', width: 140 },
      { title: 'TID', dataIndex: 'tid', key: 'tid', width: 72 },
      { title: 'Test Name', dataIndex: 'testName', key: 'testName', width: 160 },
      { title: 'TCID', dataIndex: 'tcid', key: 'tcid', width: 80 },
      { title: 'Component Name', dataIndex: 'componentName', key: 'componentName', width: 180 },
      { title: 'Field Type', dataIndex: 'fieldType', key: 'fieldType', width: 100 },
      {
        title: 'Ref Values Male',
        dataIndex: 'referenceMale',
        key: 'referenceMale',
        width: 180,
      },
      {
        title: 'Ref Value Female',
        dataIndex: 'referenceFemale',
        key: 'referenceFemale',
        width: 180,
      },
      { title: 'Unit', dataIndex: 'unit', key: 'unit', width: 88, className: 'pathology-component-col-unit' },
      { title: 'Priority', dataIndex: 'priority', key: 'priority', width: 80 },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        render: (_, record) => (
          <Tooltip title="Edit">
            <Button
              type="link"
              size="small"
              className="pathology-component-actions-cell"
              aria-label="Edit component"
              icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
              onClick={() => handleEditRow(record)}
            />
          </Tooltip>
        ),
      },
    ],
    [handleEditRow],
  );

  return (
    <div className="services-billing-page pathology-component-page">
      <div className="pathology-component-table-toolbar">
        <Button type="primary" onClick={openComponentModal}>
          Add Component
        </Button>
        <Button
          className="pathology-component-export-btn"
          icon={<AppIcon icon="mdi:export" className="h-4 w-4" />}
          onClick={handleExport}
        >
          Export
        </Button>
      </div>

      <section className="services-billing-results" aria-label="Pathology components">
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

      <PathologyComponentModal
        open={isComponentModalOpen}
        onClose={closeComponentModal}
        title={editingRowId ? 'Edit Component' : 'Add Component'}
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
