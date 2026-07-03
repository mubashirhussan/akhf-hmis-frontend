'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Input, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import ReportHeaderModal from '@/features/service-admin/pages/report-headers/ReportHeaderModal';
import { useConfirm } from '@/hooks/useConfirm';
import {
  useCreateReportHeaderMutation,
  useDeleteReportHeaderMutation,
  useGetReportHeadersQuery,
  useUpdateReportHeaderMutation,
} from '@/features/service-admin/api/serviceAdminApi';
import { useGetHospitalsQuery } from '@/features/human-resource/api/employeeApi';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function createEmptyForm() {
  return {
    hospitalId: '',
    heading1: '',
    heading2: '',
    heading3: '',
    footerHeading: '',
    imageLeft: null,
    imageRight: null,
  };
}

export default function ReportHeadersPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState(createEmptyForm);

  const { data: hospitals = [] } = useGetHospitalsQuery();
  const { data: rows = [], isLoading } = useGetReportHeadersQuery();
  const [createReportHeader] = useCreateReportHeaderMutation();
  const [updateReportHeader] = useUpdateReportHeaderMutation();
  const [deleteReportHeader] = useDeleteReportHeaderMutation();

  const hospitalOptions = useMemo(
    () => hospitals.map((hospital) => ({ value: hospital.id, label: hospital.name })),
    [hospitals],
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

  const openModal = useCallback(() => {
    setForm(createEmptyForm());
    setEditingRowId(null);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRowId(null);
    setFieldErrors({});
  }, []);

  const handleEditRow = useCallback((record) => {
    setForm({
      hospitalId: record.hospitalId ?? '',
      heading1: record.heading1 ?? '',
      heading2: record.heading2 ?? '',
      heading3: record.heading3 ?? '',
      footerHeading: record.footerHeading ?? '',
      imageLeft: record.imageLeft ? { url: record.imageLeft, name: record.imageLeftName ?? '' } : null,
      imageRight: record.imageRight ? { url: record.imageRight, name: record.imageRightName ?? '' } : null,
    });
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.hospitalName });
      if (!confirmed) return;
      await deleteReportHeader(record.id).unwrap();
      message.success('Report header deleted.');
    },
    [confirmDelete, deleteReportHeader, message],
  );

  const handleSave = useCallback(async () => {
    const errors = {};
    if (!form.hospitalId) errors.hospitalId = 'Hospital is required.';

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    const hospital = hospitals.find((item) => item.id === form.hospitalId);
    const payload = {
      hospitalId: form.hospitalId,
      hospitalName: hospital?.name ?? '',
      heading1: form.heading1,
      heading2: form.heading2,
      heading3: form.heading3,
      footerHeading: form.footerHeading,
      imageLeft: form.imageLeft?.url || '',
      imageLeftName: form.imageLeft?.name || '',
      imageRight: form.imageRight?.url || '',
      imageRightName: form.imageRight?.name || '',
    };

    if (editingRowId) {
      await updateReportHeader({ id: editingRowId, ...payload }).unwrap();
      message.success('Report header updated.');
    } else {
      await createReportHeader(payload).unwrap();
      message.success('Report header created.');
    }

    closeModal();
  }, [closeModal, editingRowId, form, hospitals, createReportHeader, updateReportHeader, message]);

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return rows.filter((row) => {
      const hospitalName = row.hospitalName?.toLowerCase() ?? '';
      return !term || hospitalName.includes(term);
    });
  }, [rows, searchTerm]);

  const columns = useMemo(
    () => [
      {
        title: 'Hospital Name',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        width: 240,
      },
      {
        title: 'Heading One',
        dataIndex: 'heading1',
        key: 'heading1',
        width: 180,
      },
      {
        title: 'Heading Two',
        dataIndex: 'heading2',
        key: 'heading2',
        width: 180,
      },
      {
        title: 'Heading Three',
        dataIndex: 'heading3',
        key: 'heading3',
        width: 180,
      },
      {
        title: 'Footer Heading',
        dataIndex: 'footerHeading',
        key: 'footerHeading',
        width: 200,
      },
      {
        title: 'Image Left',
        dataIndex: 'imageLeft',
        key: 'imageLeft',
        width: 140,
        render: (value) =>
          value ? (
            <img
              src={value}
              alt="Left"
              style={{ maxWidth: 80, maxHeight: 60, objectFit: 'contain' }}
            />
          ) : (
            '—'
          ),
      },
      {
        title: 'Image Right',
        dataIndex: 'imageRight',
        key: 'imageRight',
        width: 140,
        render: (value) =>
          value ? (
            <img
              src={value}
              alt="Right"
              style={{ maxWidth: 80, maxHeight: 60, objectFit: 'contain' }}
            />
          ) : (
            '—'
          ),
      },
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
                aria-label="Edit report header"
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label="Delete report header"
                icon={<AppIcon icon="mdi:delete-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleDeleteRow(record)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [handleDeleteRow, handleEditRow],
  );

  return (
    <div className="services-billing-page report-headers-page">
      <div
        className="report-headers-table-toolbar"
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}
      >
        <Input
          placeholder="Filter by Hospital Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          style={{ width: 320 }}
        />
        <Button type="primary" onClick={openModal}>
          Add Report Header
        </Button>
      </div>

      <section className="services-billing-results" aria-label="report headers">
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

      <ReportHeaderModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Report Header' : 'Add Report Header'}
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
        hospitalOptions={hospitalOptions}
      />
    </div>
  );
}
