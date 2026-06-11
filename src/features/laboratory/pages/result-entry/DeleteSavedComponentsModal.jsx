'use client';

import { useEffect, useMemo, useState } from 'react';
import { App, Button, Checkbox } from 'antd';
import AppModal from '@/components/ui/AppModal';
import DataTable from '@/components/ui/DataTable';
import { RESULT_ENTRY_DELETE_MODAL_TABLE_SCROLL_Y } from '@/lib/table-scroll';

export default function DeleteSavedComponentsModal({
  open,
  onClose,
  testTitle,
  savedParameters = [],
  onDeleteSelected,
}) {
  const { message } = App.useApp();
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    if (!open) return;
    setSelectedKeys([]);
  }, [open, savedParameters]);

  const toggleKey = (key, checked) => {
    setSelectedKeys((prev) =>
      checked ? [...prev, key] : prev.filter((item) => item !== key),
    );
  };

  const handleDelete = () => {
    if (!selectedKeys.length) {
      message.warning('Select at least one saved parameter to delete.');
      return;
    }

    onDeleteSelected(selectedKeys);
    onClose();
  };

  const columns = useMemo(
    () => [
      {
        title: 'Parameter',
        dataIndex: 'label',
        key: 'label',
        width: 180,
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        render: (_, record) => (
          <Checkbox
            checked={selectedKeys.includes(record.key)}
            onChange={(event) => toggleKey(record.key, event.target.checked)}
            aria-label={`Select ${record.label}`}
          />
        ),
      },
    ],
    [selectedKeys],
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Saved Components"
      // subtitle={testTitle}
      // icon="mdi:delete-outline"
      width={560}
      className="result-entry-delete-modal"
      rootClassName="result-entry-delete-modal-root"
      bodyClassName="result-entry-delete-modal-body"
      footer={
        <>
          <Button className="result-entry-delete-modal-close-btn" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            className="result-entry-delete-modal-delete-btn"
            onClick={handleDelete}
            disabled={!savedParameters.length}
          >
            Delete Selected
          </Button>
        </>
      }
    >
      {savedParameters.length ? (
        <DataTable
          className="result-entry-delete-modal-table py-4"
          wrapClassName="result-entry-delete-modal-table-wrap"
          columns={columns}
          dataSource={savedParameters}
          rowKey="key"
          columnAlign="left"
          bordered={false}
          pagination={false}
          scroll={{ x: false, y: RESULT_ENTRY_DELETE_MODAL_TABLE_SCROLL_Y }}
        />
      ) : (
        <p className="result-entry-delete-modal-empty">No saved parameters found for this test.</p>
      )}
    </AppModal>
  );
}
