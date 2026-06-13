'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { App, Button, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import MainGroupModal from '@/features/admin-pathology/pages/main-group/MainGroupModal';
import {
  GROUP_OPTIONS,
  INITIAL_MAIN_GROUP_ROWS,
  createEmptyMainGroupForm,
  getOptionLabel,
  rowToMainGroupForm,
} from '@/features/admin-pathology/api/mock-main-group';
import '@/features/admin-pathology/pages/main-group/main-group.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

export default function MainGroupPage() {
  const { message } = App.useApp();
  const nextTcidRef = useRef(
    Math.max(...INITIAL_MAIN_GROUP_ROWS.map((row) => row.tcid), 0) + 1,
  );

  const [form, setForm] = useState(createEmptyMainGroupForm);
  const [rows, setRows] = useState(INITIAL_MAIN_GROUP_ROWS);
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

const nextGroupIdRef = useRef(
  Math.max(...INITIAL_MAIN_GROUP_ROWS.map((row) => row.groupId)) + 1
);



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
    setForm(createEmptyMainGroupForm());
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
      setForm(rowToMainGroupForm(record));
      setEditingRowId(record.id);
      setFieldErrors({});
      setIsComponentModalOpen(true);
    },
    [],
  );
  const handleDeleteRow = useCallback((record) => {
  setRows((current) =>
    current.filter((row) => row.id !== record.id)
  );

  message.success('Component deleted.');
}, [message]);

  const handleSave = useCallback(() => {
    const groupName = form.groupName.trim();
    if (!groupName) {
      setFieldErrors({ groupName: 'Group Name is required.' });
      return;
    }

    setFieldErrors({});
    
const rowPayload = {
  id: crypto.randomUUID(),
  groupId: nextGroupIdRef.current++,
  groupName: getOptionLabel(GROUP_OPTIONS, form.groupName),
  fee: form.fee ?? 0,
};

    if (editingRowId) {
      setRows((current) =>
        current.map((row) =>
         row.id === editingRowId
  ? { ...row, groupName: rowPayload.groupName, fee: rowPayload.fee }
  : row
        ),
      );
      setIsComponentModalOpen(false);
      setEditingRowId(null);
      message.success('Component updated.');
      return;
    }

   setRows((current) => [
    rowPayload,
    ...current,
  ]);

  setIsComponentModalOpen(false);
  message.success('Component created.');
}, [form, editingRowId, message]);

  const columns = useMemo(
    () => [
  { title: 'Test Group ID', dataIndex: 'groupId', key: 'groupId', width: 140 },
  { title: 'Test Group', dataIndex: 'groupName', key: 'groupName', width: 140 },
  { title: 'Fee', dataIndex: 'fee', key: 'fee', width: 140 },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        render: (_, record) => (
           <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Tooltip title="Edit">
            <Button
              type="link"
              size="small"
              className="main-group-actions-cell"
              aria-label="Edit component"
              icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
              onClick={() => handleEditRow(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
        <Button
          type="link"
          danger
          size="small"
          icon={<AppIcon icon="mdi:delete-outline" className={ACTION_ICON_CLASS} />}
          onClick={() => handleDeleteRow(record)}
        />
      </Tooltip>
          </div>
        ),
      },
    ],
    [handleEditRow],
  );

  return (
    <div className="services-billing-page main-group-page">
      <div className="main-group-table-toolbar">
        <Button type="primary" onClick={openComponentModal}>
          Add Component
        </Button>
      </div>

      <section className="services-billing-results" aria-label="main group">
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

      <MainGroupModal
        open={isComponentModalOpen}
        onClose={closeComponentModal}
        title={editingRowId ? 'Edit Component' : 'Add Component'}
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
      />
    </div>
  );
}
