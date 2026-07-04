'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Select, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import WardBedsModal from '@/features/service-admin/pages/ward-beds/WardBedsModal';
import { useConfirm } from '@/hooks/useConfirm';
import {
  useGetWardBedsQuery,
  useCreateWardBedMutation,
  useUpdateWardBedMutation,
  useDeleteWardBedMutation,
} from '@/features/service-admin/api/serviceAdminApi';
import {
  useGetHospitalsQuery,
  useGetDepartmentsQuery,
  useGetSubDepartmentsQuery,
} from '@/features/human-resource/api/employeeApi';
import '@/features/service-admin/pages/ward-beds/ward-beds.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function createEmptyForm() {
  return {
    hospitalId: '',
    departmentId: '',
    subDepartmentId: '',
    wardName: '',
    rooms: null,
    maxBeds: null,
  };
}



export default function WardBedsPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();

  const [form, setForm] = useState(createEmptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [fHospital, setFHospital] = useState('');
  const [fDepartment, setFDepartment] = useState('');
  const [fSubDepartment, setFSubDepartment] = useState('');
  const [fWardName, setFWardName] = useState('');

const { data: hospitals = [] } = useGetHospitalsQuery();
const { data: allDepartments = [] } = useGetDepartmentsQuery();
const { data: allSubDepartments = [] } = useGetSubDepartmentsQuery();
const { data: rows = [], isLoading } = useGetWardBedsQuery();

  const [createWardBed] = useCreateWardBedMutation();
  const [updateWardBed] = useUpdateWardBedMutation();
  const [deleteWardBed] = useDeleteWardBedMutation();

const hospitalOptions = useMemo(
  () => hospitals.map((h) => ({ value: h.id, label: h.name })),
  [hospitals],
);

const modalDeptOptions = useMemo(
  () =>
    allDepartments
      .filter((d) => d.hospitalId === form.hospitalId)
      .map((d) => ({ value: d.id, label: d.departmentName })),
  [allDepartments, form.hospitalId],
);

const modalSubDeptOptions = useMemo(
  () =>
    allSubDepartments
      .filter((s) => s.departmentId === form.departmentId)
      .map((s) => ({ value: s.id, label: s.subDepartmentName })),
  [allSubDepartments, form.departmentId],
);

const filterHospitalOptions = useMemo(
  () => [{ label: 'All', value: '' }, ...hospitalOptions],
  [hospitalOptions],
);

const filterDeptOptions = useMemo(
  () => [
    { label: 'All', value: '' },
    ...allDepartments
      .filter((d) => !fHospital || d.hospitalId === fHospital)
      .map((d) => ({ value: d.id, label: d.departmentName })),
  ],
  [allDepartments, fHospital],
);

const filterSubDeptOptions = useMemo(
  () => [
    { label: 'All', value: '' },
    ...allSubDepartments
      .filter((s) => !fDepartment || s.departmentId === fDepartment)
      .map((s) => ({ value: s.id, label: s.subDepartmentName })),
  ],
  [allSubDepartments, fDepartment],
);

  

  const patchForm = useCallback((patch) => {
    setForm((c) => ({ ...c, ...patch }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setFieldErrors((c) => {
      if (!c[field]) return c;
      const next = { ...c };
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
      departmentId: record.departmentId ?? '',
      subDepartmentId: record.subDepartmentId ?? '',
      wardName: record.wardName ?? '',
      rooms: record.rooms ?? null,
      maxBeds: record.maxBeds ?? null,
    });
    setEditingRowId(record.id);
    setFieldErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDeleteRow = useCallback(
    async (record) => {
      const confirmed = await confirmDelete({ itemName: record.wardName });
      if (!confirmed) return;
      await deleteWardBed(record.id).unwrap();
      message.success('Ward bed deleted.');
    },
    [confirmDelete, deleteWardBed, message],
  );

  const handleSave = useCallback(async () => {
    const errors = {};
    if (!form.hospitalId) errors.hospitalId = 'Hospital is required.';
    if (!form.departmentId) errors.departmentId = 'Department is required.';
    if (!form.subDepartmentId) errors.subDepartmentId = 'Sub Department is required.';
    if (!form.wardName?.trim()) errors.wardName = 'Ward Name is required.';
    if (!form.rooms || form.rooms < 1) errors.rooms = 'Rooms is required.';
    if (!form.maxBeds || form.maxBeds < 1) errors.maxBeds = 'Maximum Beds is required.';

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const payload = {
      hospitalId: form.hospitalId,
hospitalName: hospitals.find((h) => h.id === form.hospitalId)?.name ?? '',
departmentId: form.departmentId,
departmentName: allDepartments.find((d) => d.id === form.departmentId)?.departmentName ?? '',

subDepartmentId: form.subDepartmentId,
subDepartmentName: allSubDepartments.find((s) => s.id === form.subDepartmentId)?.subDepartmentName ?? '',

      wardName: form.wardName.trim(),
      rooms: form.rooms,
      maxBeds: form.maxBeds,
    };

    if (editingRowId) {
      await updateWardBed({ id: editingRowId, ...payload }).unwrap();
      message.success('Ward bed updated.');
    } else {
      await createWardBed(payload).unwrap();
      message.success('Ward bed added.');
    }

    closeModal();
  }, [
    form,
    editingRowId,
    hospitals,
    allDepartments,
    allSubDepartments,
    createWardBed,
    updateWardBed,
    message,
    closeModal,
  ]);


  const filteredRows = useMemo(() => {
    const term = fWardName.trim().toLowerCase();
    return rows.filter((r) => {
      if (fHospital && r.hospitalId !== fHospital) return false;
      if (fDepartment && r.departmentId !== fDepartment) return false;
      if (fSubDepartment && r.subDepartmentId !== fSubDepartment) return false;
      if (term && !r.wardName?.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [rows, fHospital, fDepartment, fSubDepartment, fWardName]);

  const columns = useMemo(
    () => [
      { title: 'Hospital', dataIndex: 'hospitalName', key: 'hospitalName', width: 180 },
      { title: 'Department', dataIndex: 'departmentName', key: 'departmentName', width: 150 },
      { title: 'Sub Department', dataIndex: 'subDepartmentName', key: 'subDepartmentName', width: 160 },
      { title: 'Ward Name', dataIndex: 'wardName', key: 'wardName', width: 150 },
      { title: 'Rooms', dataIndex: 'rooms', key: 'rooms', width: 90, align: 'center' },
      { title: 'Maximum Beds', dataIndex: 'maxBeds', key: 'maxBeds', width: 130, align: 'center' },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        render: (_, record) => (
          <div
            className="ward-beds-actions-cell"
            style={{ display: 'flex', gap: 8, justifyContent: 'center' }}
          >
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                aria-label="Edit ward bed"
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label="Delete ward bed"
                icon={<AppIcon icon="mdi:delete-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleDeleteRow(record)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [handleEditRow, handleDeleteRow],
  );

  return (
    <div className="services-billing-page ward-beds-page">
      <div className="ward-beds-table-toolbar">
        <div className="ward-beds-filters">
          <Select
            placeholder="Hospital"
            value={fHospital || undefined}
            options={filterHospitalOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 180 }}
            onChange={(val) => {
              setFHospital(val ?? '');
              setFDepartment('');
              setFSubDepartment('');
            }}
          />
          <Select
            placeholder="Department"
            value={fDepartment || undefined}
            options={filterDeptOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 180 }}
            disabled={!fHospital}
            onChange={(val) => {
              setFDepartment(val ?? '');
              setFSubDepartment('');
            }}
          />
          <Select
            placeholder="Sub Department"
            value={fSubDepartment || undefined}
            options={filterSubDeptOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 180 }}
            disabled={!fDepartment}
            onChange={(val) => setFSubDepartment(val ?? '')}
          />
          <input
            className="ant-input"
            placeholder="Ward Name"
            value={fWardName}
            onChange={(e) => setFWardName(e.target.value)}
            style={{ width: 160 }}
          />
        </div>
        <Button type="primary" onClick={openModal}>
          Add Ward Beds
        </Button>
      </div>

      <section className="services-billing-results" aria-label="ward beds">
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

      <WardBedsModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Ward Beds' : 'Add Ward Beds'}
        form={form}
        errors={fieldErrors}
        onPatchForm={patchForm}
        onClearError={clearFieldError}
        onSave={handleSave}
        hospitalOptions={hospitalOptions}
        departmentOptions={modalDeptOptions}
        subDepartmentOptions={modalSubDeptOptions}
      />
    </div>
  );
}