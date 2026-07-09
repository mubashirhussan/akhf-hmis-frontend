'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Tooltip, Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import FloatingField from '@/components/ui/FloatingField';
import FormGrid from '@/components/ui/FormGrid';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import PathologyComponentAddModal from '@/features/admin-pathology/pages/pathology-component/PathologyComponentAddModal';
import PathologyComponentEditModal from '@/features/admin-pathology/pages/pathology-component/PathologyComponentEditModal';
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
const controlClass = FIELD_CONTROL_CLASS;

export default function PathologyComponentPage() {
  const { message } = App.useApp();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data: rows = [], isLoading } = useGetPathologyComponentsQuery();
  const { data: lookups } = useGetPathologyLookupsQuery();
  const { data: testNames = [] } = useGetTestNamesQuery();
  const { data: mainGroups = [] } = useGetMainGroupsQuery();
  const { data: subGroups = [] } = useGetSubGroupsQuery();

  const unitOptions = lookups?.unitOptions ?? [];

  const [createComponent] = useCreatePathologyComponentMutation();
  const [updateComponent] = useUpdatePathologyComponentMutation();
  const [deleteComponent] = useDeletePathologyComponentMutation();
  const [addUnit] = useAddPathologyUnitMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [filters, setFilters] = useState({
    groupName: '',
    subGroupName: '',
    testName: '',
    componentName: '',
  });

  const patchFilter = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleClear = useCallback(() => {
    setFilters({
      groupName: '',
      subGroupName: '',
      testName: '',
      componentName: '',
    });
  }, []);

  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    addForm.resetFields();
  }, [addForm]);

  const openEditModal = useCallback((record) => {
    setEditingRow(record);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingRow(null);
    editForm.resetFields();
  }, [editForm]);

  const handleAddSave = useCallback(async () => {
    try {
      const values = await addForm.validateFields();
      const selectedGroup = mainGroups.find((g) => g.TGID === values.TGID);
      const selectedSubGroup = subGroups.find((sg) => sg.TSGID === values.TSGID);
      const selectedTest = testNames.find((t) => t.tid === values.TID);

      const rowPayload = {
        TGID: values.TGID,
        groupName: selectedGroup?.groupName ?? '',
        TSGID: values.TSGID ?? null,
        subGroupName: selectedSubGroup?.subGroupName ?? '',
        TID: values.TID,
        testName: selectedTest?.testName ?? '',
        componentName: values.componentName.trim(),
        fieldType: values.fieldType ?? '',
        unit: values.unit ?? '',
        tmUnitID: 0,
        priority: values.priority ?? 1,
        toolTip: (values.toolTip || '').trim(),
        referenceMale: (values.referenceMale || '').trim(),
        referenceFemale: (values.referenceFemale || '').trim(),
        minValue: '',
        maxValue: '',
        maxLength: 0,
      };

      await createComponent(rowPayload).unwrap();
      setIsAddModalOpen(false);
      addForm.resetFields();
      message.success('Component saved.');
    } catch {
      // validation errors shown by antd Form
    }
  }, [addForm, createComponent, mainGroups, subGroups, testNames, message]);

  const handleEditSave = useCallback(async () => {
    try {
      const values = await editForm.validateFields();
      const selectedTest = testNames.find((t) => t.tid === values.TID);

      const rowPayload = {
        TGID: values.TGID,
        TID: values.TID,
        testName: selectedTest?.testName ?? '',
        componentName: values.componentName.trim(),
        fieldType: values.fieldType ?? '',
        unit: values.unit ?? '',
        tmUnitID: editingRow?.tmUnitID ?? 0,
        priority: values.priority ?? 1,
        toolTip: (values.toolTip || '').trim(),
        referenceMale: (values.referenceMale || '').trim(),
        referenceFemale: (values.referenceFemale || '').trim(),
        minValue: editingRow?.minValue ?? '',
        maxValue: editingRow?.maxValue ?? '',
        maxLength: editingRow?.maxLength ?? 0,
      };

      await updateComponent({ id: editingRow.id, ...rowPayload }).unwrap();
      setIsEditModalOpen(false);
      setEditingRow(null);
      editForm.resetFields();
      message.success('Component updated.');
    } catch {
      // validation errors shown by antd Form
    }
  }, [editForm, editingRow, updateComponent, testNames, message]);

  const handleExport = useCallback(() => {
    if (rows.length === 0) {
      message.warning('No data to export.');
      return;
    }
    message.info('Export will be connected to the backend API.');
  }, [message, rows.length]);

  const handleAddUnit = useCallback(async () => {
    const label = (addForm.getFieldValue('newUnit') || editForm.getFieldValue('newUnit') || '').trim();
    const targetForm = isAddModalOpen ? addForm : editForm;
    const rawLabel = (targetForm.getFieldValue('newUnit') || '').trim();

    if (!rawLabel) {
      message.error('Enter a unit name first.');
      return;
    }

    const value = rawLabel.toLowerCase().replace(/\s+/g, '-');
    const existing = unitOptions.find(
      (opt) => opt.value === value || opt.label.toLowerCase() === rawLabel.toLowerCase(),
    );

    if (existing) {
      targetForm.setFieldsValue({ unit: existing.value, newUnit: '' });
      message.info(`Unit "${existing.label}" already exists.`);
      return;
    }

    await addUnit({ value, label: rawLabel }).unwrap();
    targetForm.setFieldsValue({ unit: value, newUnit: '' });
    message.success(`Unit "${rawLabel}" added.`);
  }, [addForm, editForm, isAddModalOpen, addUnit, unitOptions, message]);

  const groupOptions = useMemo(
    () => mainGroups.map((g) => ({ label: g.groupName, value: g.groupName })),
    [mainGroups],
  );

  const subGroupOptions = useMemo(
    () =>
      subGroups
        .filter((sg) => (filters.groupName ? sg.groupName === filters.groupName : true))
        .map((sg) => ({ label: sg.subGroupName, value: sg.subGroupName })),
    [subGroups, filters.groupName],
  );

  const testNameOptions = useMemo(
    () =>
      testNames
        .filter((t) => {
          const matchGroup = filters.groupName ? t.groupName === filters.groupName : true;
          const matchSubGroup = filters.subGroupName
            ? t.subGroupName === filters.subGroupName
            : true;
          return matchGroup && matchSubGroup;
        })
        .map((t) => ({ label: t.testName, value: t.testName })),
    [testNames, filters.groupName, filters.subGroupName],
  );

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const matchesGroup = filters.groupName ? row.groupName === filters.groupName : true;
        const matchesSubGroup = filters.subGroupName
          ? row.subGroupName === filters.subGroupName
          : true;
        const matchesTestName = filters.testName ? row.testName === filters.testName : true;
        const matchesComponentName = filters.componentName.trim()
          ? row.componentName?.toLowerCase().includes(filters.componentName.trim().toLowerCase())
          : true;
        return matchesGroup && matchesSubGroup && matchesTestName && matchesComponentName;
      }),
    [rows, filters],
  );

  const columns = useMemo(
    () => [
      { title: 'Group Name', dataIndex: 'groupName', key: 'groupName', width: 130, className: 'pathology-component-col-group-name' },
      { title: 'Sub Group Name', dataIndex: 'subGroupName', key: 'subGroupName', width: 140 },
      { title: 'TID', dataIndex: 'tid', key: 'tid', width: 72 },
      { title: 'Test Name', dataIndex: 'testName', key: 'testName', width: 160 },
      { title: 'TCID', dataIndex: 'tcid', key: 'tcid', width: 80 },
      { title: 'Component Name', dataIndex: 'componentName', key: 'componentName', width: 180 },
      { title: 'Field Type', dataIndex: 'fieldType', key: 'fieldType', width: 100 },
      { title: 'Ref Values Male', dataIndex: 'referenceMale', key: 'referenceMale', width: 180 },
      { title: 'Ref Value Female', dataIndex: 'referenceFemale', key: 'referenceFemale', width: 180 },
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
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
        ),
      },
    ],
    [openEditModal],
  );

  return (
    <div className="services-billing-page pathology-component-page">
      <section className="pathology-component-filter-panel" aria-label="Pathology component search filters">
        <div className="walk-in-add-record-layout pathology-component-search-layout">
          <FormGrid
            as="form"
            columns={4}
            className="walk-in-add-record-form pathology-component-search-form"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <FloatingField label="Main Group" htmlFor="pathology-filter-group">
              <Select
                id="pathology-filter-group"
                className={controlClass}
                placeholder="Select group"
                value={filters.groupName || undefined}
                options={groupOptions}
                onChange={(value) =>
                  patchFilter({ groupName: value || '', subGroupName: '', testName: '' })
                }
                allowClear
                autoComplete="off"
              />
            </FloatingField>

            <FloatingField label="Sub Group" htmlFor="pathology-filter-subgroup">
              <Select
                id="pathology-filter-subgroup"
                className={controlClass}
                placeholder="Select sub group"
                value={filters.subGroupName || undefined}
                options={subGroupOptions}
                onChange={(value) => patchFilter({ subGroupName: value || '', testName: '' })}
                allowClear
                autoComplete="off"
              />
            </FloatingField>

            <FloatingField label="Test Name" htmlFor="pathology-filter-testname">
              <Select
                id="pathology-filter-testname"
                className={controlClass}
                placeholder="Select test name"
                value={filters.testName || undefined}
                options={testNameOptions}
                onChange={(value) => patchFilter({ testName: value || '' })}
                allowClear
                autoComplete="off"
              />
            </FloatingField>

            <FloatingField label="Component Name" htmlFor="pathology-filter-component">
              <Input
                id="pathology-filter-component"
                className={controlClass}
                placeholder="Enter component name"
                value={filters.componentName}
                onChange={(e) => patchFilter({ componentName: e.target.value })}
                allowClear
                autoComplete="off"
              />
            </FloatingField>

            <div className="pathology-component-search-actions">
              <Button type="link" className="patient-reg-btn-clear" onClick={handleClear}>
                Clear
              </Button>
              <Button type="default" className="hr-search-btn" icon={<SearchOutlined />} htmlType="submit" loading={isLoading}>
                Search
              </Button>
            </div>
          </FormGrid>
        </div>
      </section>

      <section className="services-billing-results" aria-label="Pathology components">
        <div className="pathology-component-table-toolbar">
          <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
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
        <DataTable
          rowKey="id"
          columns={columns}
          dataSource={filteredRows}
          loading={isLoading}
          columnAlign="left"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['20', '50', '100'],
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </section>

      <PathologyComponentAddModal
        open={isAddModalOpen}
        onClose={closeAddModal}
        form={addForm}
        onSave={handleAddSave}
        onAddUnit={handleAddUnit}
      />

      <PathologyComponentEditModal
        open={isEditModalOpen}
        onClose={closeEditModal}
        form={editForm}
        onSave={handleEditSave}
        record={editingRow}
        onAddUnit={handleAddUnit}
      />
    </div>
  );
}