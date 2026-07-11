'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Input, Select, Tooltip } from 'antd';
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

export default function WardBedsPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);

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

  const watchedHospitalId = Form.useWatch('hospitalId', form);
  const watchedDepartmentId = Form.useWatch('departmentId', form);

  const hospitalOptions = useMemo(
    () => hospitals.map((h) => ({ value: h.id, label: h.name })),
    [hospitals],
  );

  const modalDeptOptions = useMemo(
    () =>
      allDepartments
        .filter((d) => d.hospitalId === watchedHospitalId)
        .map((d) => ({ value: d.id, label: d.departmentName })),
    [allDepartments, watchedHospitalId],
  );

  const modalSubDeptOptions = useMemo(
    () =>
      allSubDepartments
        .filter((s) => s.departmentId === watchedDepartmentId)
        .map((s) => ({ value: s.id, label: s.subDepartmentName })),
    [allSubDepartments, watchedDepartmentId],
  );

  const filterDeptOptions = useMemo(
    () =>
      allDepartments
        .filter((d) => !fHospital || d.hospitalId === fHospital)
        .map((d) => ({ value: d.id, label: d.departmentName })),
    [allDepartments, fHospital],
  );

  const filterSubDeptOptions = useMemo(
    () =>
      allSubDepartments
        .filter((s) => !fDepartment || s.departmentId === fDepartment)
        .map((s) => ({ value: s.id, label: s.subDepartmentName })),
    [allSubDepartments, fDepartment],
  );

  const openModal = useCallback(() => {
    form.resetFields();
    setEditingRowId(null);
    setIsModalOpen(true);
  }, [form]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRowId(null);
    form.resetFields();
  }, [form]);

  const handleEditRow = useCallback(
    (record) => {
      form.setFieldsValue({
        hospitalId: record.hospitalId ?? undefined,
        departmentId: record.departmentId ?? undefined,
        subDepartmentId: record.subDepartmentId ?? undefined,
        wardName: record.wardName ?? '',
        rooms: record.rooms ?? null,
        maxBeds: record.maxBeds ?? null,
      });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

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
    try {
      const values = await form.validateFields();
      const payload = {
        hospitalId: values.hospitalId,
        hospitalName: hospitals.find((h) => h.id === values.hospitalId)?.name ?? '',
        departmentId: values.departmentId,
        departmentName:
          allDepartments.find((d) => d.id === values.departmentId)?.departmentName ?? '',
        subDepartmentId: values.subDepartmentId,
        subDepartmentName:
          allSubDepartments.find((s) => s.id === values.subDepartmentId)?.subDepartmentName ?? '',
        wardName: values.wardName.trim(),
        rooms: values.rooms,
        maxBeds: values.maxBeds,
      };

      if (editingRowId) {
        await updateWardBed({ id: editingRowId, ...payload }).unwrap();
        message.success('Ward bed updated.');
      } else {
        await createWardBed(payload).unwrap();
        message.success('Ward bed added.');
      }

      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
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
      {
        title: 'Sub Department',
        dataIndex: 'subDepartmentName',
        key: 'subDepartmentName',
        width: 160,
      },
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
      <div
        className="ward-beds-table-toolbar"
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}
      >
        <div className="ward-beds-filters" style={{ display: 'flex', gap: 12 }}>
          <Select
            placeholder="Hospital"
            value={fHospital || undefined}
            options={hospitalOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 220 }}
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
            style={{ width: 220 }}
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
            style={{ width: 220 }}
            onChange={(val) => setFSubDepartment(val ?? '')}
          />
          <Input
            placeholder="Filter by Ward Name"
            value={fWardName}
            onChange={(e) => setFWardName(e.target.value)}
            allowClear
            style={{ width: 220 }}
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
        onSave={handleSave}
        hospitalOptions={hospitalOptions}
        departmentOptions={modalDeptOptions}
        subDepartmentOptions={modalSubDeptOptions}
      />
    </div>
  );
}
