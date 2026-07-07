'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Tooltip, Select, Input } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import PathologyComponentModal from '@/features/admin-pathology/pages/pathology-component/PathologyComponentModal';
import {
  useAddPathologyUnitMutation,
  useCreatePathologyComponentMutation,
  useDeletePathologyComponentMutation,
  useGetPathologyComponentsQuery,
  useGetPathologyLookupsQuery,
  useUpdatePathologyComponentMutation,
  useGetTestNamesQuery,
  useGetMainGroupsQuery,
  useGetSubGroupsQuery,
} from '@/features/admin-pathology/api/pathologyApi';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function PathologyComponentPage() {
  const { message } = App.useApp();
const { data: rows = [], isLoading } = useGetPathologyComponentsQuery();
const { data: lookups } = useGetPathologyLookupsQuery();
const { data: testNames = [] } = useGetTestNamesQuery();
const { data: mainGroups = [] } = useGetMainGroupsQuery();
const { data: subGroups = [] } = useGetSubGroupsQuery();
const unitOptions = lookups?.unitOptions ?? [];
const fieldTypeOptions = lookups?.fieldTypeOptions ?? [];
const [createComponent] = useCreatePathologyComponentMutation();
const [updateComponent] = useUpdatePathologyComponentMutation();
const [deleteComponent] = useDeletePathologyComponentMutation();
const [addUnit] = useAddPathologyUnitMutation();

const [form, setForm] = useState(() => ({
  TGID: null,
  TSGID: null,
  TID: null,
  groupName: "",
  subGroupName: "",
  testName: "",
  fieldType: "",
  componentName: "",
  unit: "",
  tmUnitID: 0,
  priority: 1,
  toolTip: "",
  referenceMale: "",
  referenceFemale: "",
  minValue: "",
  maxValue: "",
  maxLength: 0,
  newUnit: "",
}));
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [filters, setFilters] = useState({
  groupName: '',
  subGroupName: '',
  testName: '',
  componentName: '',
});

  const patchForm = useCallback((patch) => {
    setForm((current) => ({ ...current, ...patch }));
  }, []);
  const patchFilter = useCallback((patch) => {
  setFilters((prev) => ({
    ...prev,
    ...patch,
  }));
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
  setForm({
    TGID: null,
    TSGID: null,
    TID: null,
    groupName: "",
    subGroupName: "",
    testName: "",
    fieldType: "",
    componentName: "",
    unit: "",
    tmUnitID: 0,
    priority: 1,
    toolTip: "",
    referenceMale: "",
    referenceFemale: "",
    minValue: "",
    maxValue: "",
    maxLength: 0,
    newUnit: "",
  });
  setEditingRowId(null);
  setFieldErrors({});
  setIsComponentModalOpen(true);
}, []);

  const closeComponentModal = useCallback(() => {
    setIsComponentModalOpen(false);
    setEditingRowId(null);
    setFieldErrors({});
  }, []);

const handleEditRow = useCallback((record) => {
  const matchedSubGroup = subGroups.find(
    (sg) =>
      sg.subGroupName === record.subGroupName &&
      sg.TGID === record.TGID,
  );
  const resolvedTSGID = matchedSubGroup?.TSGID ?? null;

  const matchedTest = testNames.find((t) => t.tid === record.TID);
  const resolvedTID = record.TID ?? matchedTest?.tid ?? null;

  setForm({
    TGID: record.TGID ?? null,
    TSGID: resolvedTSGID,
    TID: resolvedTID,
    groupName: record.groupName ?? "",
    subGroupName: record.subGroupName ?? "",
    testName: record.testName ?? "",
    fieldType: record.fieldType ?? "",
    componentName: record.componentName ?? "",
    unit: record.unit ?? "",
    tmUnitID: record.tmUnitID ?? 0,
    priority: record.priority ?? 1,
    toolTip: record.toolTip ?? "",
    referenceMale: record.referenceMale ?? "",
    referenceFemale: record.referenceFemale ?? "",
    minValue: record.minValue ?? "",
    maxValue: record.maxValue ?? "",
    maxLength: record.maxLength ?? 0,
    newUnit: "",
  });
  setEditingRowId(record.id);
  setFieldErrors({});
  setIsComponentModalOpen(true);
}, [subGroups, testNames]);

const handleSave = useCallback(async () => {
  const componentName = (form.componentName || "").trim();
  const errors = {};
  if (!form.TGID) errors.TGID = "Group Name is required.";
  if (!form.TID) errors.TID = "Test Name is required.";
  if (!componentName) errors.componentName = "Component Name is required.";

  if (Object.keys(errors).length > 0) {
    setFieldErrors(errors);
    return;
  }

  setFieldErrors({});

  const rowPayload = {
    TGID: form.TGID,
    TID: form.TID,
    componentName,
    fieldType: form.fieldType,
    tmUnitID: form.tmUnitID ?? 0,
    referenceMale: (form.referenceMale || "").trim(),
    referenceFemale: (form.referenceFemale || "").trim(),
    priority: form.priority ?? 1,
    toolTip: (form.toolTip || "").trim(),
    minValue: (form.minValue || "").trim(),
    maxValue: (form.maxValue || "").trim(),
    maxLength: form.maxLength ?? 0,
  };

  if (editingRowId) {
    await updateComponent({ id: editingRowId, ...rowPayload }).unwrap();
    setIsComponentModalOpen(false);
    setEditingRowId(null);
    message.success("Component updated.");
    return;
  }

  await createComponent(rowPayload).unwrap();
  setIsComponentModalOpen(false);
  message.success("Component saved.");
}, [createComponent, editingRowId, form, message, updateComponent]);

  const handleExport = useCallback(() => {
    if (rows.length === 0) {
      message.warning('No data to export.');
      return;
    }
    message.info('Export will be connected to the backend API.');
  }, [message, rows.length]);

  const handleAddUnit = useCallback(async () => {
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

    await addUnit({ value, label }).unwrap();
    patchForm({ unit: value, newUnit: '' });
    message.success(`Unit "${label}" added.`);
  }, [addUnit, form.newUnit, message, patchForm, unitOptions]);


const groupOptions = useMemo(() => {
  return mainGroups.map((g) => ({
    label: g.groupName,
    value: g.groupName,
  }));
}, [mainGroups]);

const subGroupOptions = useMemo(() => {
  return subGroups
    .filter((sg) =>
      filters.groupName ? sg.groupName === filters.groupName : true,
    )
    .map((sg) => ({
      label: sg.subGroupName,
      value: sg.subGroupName,
    }));
}, [subGroups, filters.groupName]);

const testNameOptions = useMemo(() => {
  return testNames
    .filter((t) => {
      const matchGroup = filters.groupName
        ? t.groupName === filters.groupName
        : true;
      const matchSubGroup = filters.subGroupName
        ? t.subGroupName === filters.subGroupName
        : true;
      return matchGroup && matchSubGroup;
    })
    .map((t) => ({
      label: t.testName,
      value: t.testName,
    }));
}, [testNames, filters.groupName, filters.subGroupName]);

const filteredRows = useMemo(() => {
  return rows.filter((row) => {
    const matchesGroup = filters.groupName
      ? row.groupName === filters.groupName
      : true;

    const matchesSubGroup = filters.subGroupName
      ? row.subGroupName === filters.subGroupName
      : true;

    const matchesTestName = filters.testName
      ? row.testName === filters.testName
      : true;

    const matchesComponentName = filters.componentName.trim()
      ? row.componentName
          ?.toLowerCase()
          .includes(filters.componentName.trim().toLowerCase())
      : true;

    return (
      matchesGroup &&
      matchesSubGroup &&
      matchesTestName &&
      matchesComponentName
    );
  });
}, [rows, filters]);
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
<div
  className="pathology-component-table-toolbar"
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  }}
>
  <div style={{ display: 'flex', gap: 10 }}>
    <Select
      placeholder="Filter by Main Group"
      allowClear
      style={{ width: 220 }}
      value={filters.groupName || undefined}
      options={groupOptions}
      onChange={(value) =>
        patchFilter({
          groupName: value || '',
          subGroupName: '',
          testName: '',
        })
      }
    />

    <Select
      placeholder="Filter by Sub Group"
      allowClear
      style={{ width: 220 }}
      value={filters.subGroupName || undefined}
      options={subGroupOptions}
      onChange={(value) =>
        patchFilter({
          subGroupName: value || '',
          testName: '',
        })
      }
    />

    <Select
      placeholder="Filter by Test Name"
      allowClear
      style={{ width: 220 }}
      value={filters.testName || undefined}
      options={testNameOptions}
      onChange={(value) =>
        patchFilter({
          testName: value || '',
        })
      }
    />

    <Input
      placeholder="Filter by Component Name"
      allowClear
      style={{ width: 250 }}
      value={filters.componentName}
      onChange={(e) =>
        patchFilter({
          componentName: e.target.value,
        })
      }
    />
  </div>

  <div style={{ display: 'flex', gap: 10 }}>
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
</div>

      <section className="services-billing-results" aria-label="Pathology components">
        <DataTable
          rowKey="id"
          columns={columns}
          dataSource={filteredRows}
          loading={isLoading}
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
  fieldTypeOptions={fieldTypeOptions}
  mainGroups={mainGroups}
  subGroups={subGroups}
  testNames={testNames}
  errors={fieldErrors}
  isEditing={Boolean(editingRowId)}
  onPatchForm={patchForm}
  onClearError={clearFieldError}
  onSave={handleSave}
  onAddUnit={handleAddUnit}
/>
    </div>
  );
}
