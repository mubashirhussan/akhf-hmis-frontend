'use client';

import { useCallback, useMemo, useState } from 'react';
import { App, Button, Form, Select, Tooltip } from 'antd';
import AppIcon from '@/components/icons/AppIcon';
import DataTable from '@/components/ui/DataTable';
import AssignBedLocationModal from '@/features/service-admin/pages/assign-bed-location/AssignBedLocationModal';
import { useConfirm } from '@/hooks/useConfirm';
import {
  useGetWardBedsQuery,
  useGetBedLocationsQuery,
  useCreateBedLocationMutation,
  useUpdateBedLocationMutation,
  useDeleteBedLocationMutation,
} from '@/features/service-admin/api/serviceAdminApi';
import {
  useGetHospitalsQuery,
  useGetDepartmentsQuery,
  useGetSubDepartmentsQuery,
} from '@/features/human-resource/api/employeeApi';
import '@/features/service-admin/pages/assign-bed-location/assign-bed-location.css';

const ACTION_ICON_CLASS = 'h-[16px] w-[16px] text-[var(--app-primary)]';

function makeNumberOptions(n) {
  if (!n || n < 1) return [];
  return Array.from({ length: n }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}`,
  }));
}

export default function AssignBedLocationPage() {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);

  const [fHospital, setFHospital] = useState('');
  const [fDepartment, setFDepartment] = useState('');
  const [fSubDepartment, setFSubDepartment] = useState('');
  const [fWard, setFWard] = useState('');

  const { data: hospitals = [] } = useGetHospitalsQuery();
  const { data: allDepartments = [] } = useGetDepartmentsQuery();
  const { data: allSubDepartments = [] } = useGetSubDepartmentsQuery();
  const { data: wardBeds = [] } = useGetWardBedsQuery();
  const { data: rows = [], isLoading } = useGetBedLocationsQuery();

  const [createBedLocation] = useCreateBedLocationMutation();
  const [updateBedLocation] = useUpdateBedLocationMutation();
  const [deleteBedLocation] = useDeleteBedLocationMutation();

  const watchedWardBedId = Form.useWatch('wardBedId', form);

  const hospitalOptions = useMemo(
    () => hospitals.map((h) => ({ value: h.id, label: h.name })),
    [hospitals],
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

  const filterWardOptions = useMemo(() => {
    return wardBeds
      .filter((w) => {
        if (fHospital && w.hospitalId !== fHospital) return false;
        if (fDepartment && w.departmentId !== fDepartment) return false;
        if (fSubDepartment && w.subDepartmentId !== fSubDepartment) return false;
        return true;
      })
      .map((w) => ({ value: w.id, label: w.wardName }));
  }, [wardBeds, fHospital, fDepartment, fSubDepartment]);

  const usableWardOptions = useMemo(
    () => wardBeds.map((w) => ({ value: w.id, label: w.wardName })),
    [wardBeds],
  );

  const selectedWard = useMemo(
    () => wardBeds.find((w) => w.id === watchedWardBedId) ?? null,
    [wardBeds, watchedWardBedId],
  );

  const roomOptions = useMemo(
    () => makeNumberOptions(selectedWard?.rooms ?? 0),
    [selectedWard],
  );

  const bedOptions = useMemo(
    () => makeNumberOptions(selectedWard?.maxBeds ?? 0),
    [selectedWard],
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
        wardBedId: record.wardBedId ?? undefined,
        roomNumber: String(record.roomNumber ?? ''),
        bedNumber: String(record.bedNumber ?? ''),
        location: record.location ?? '',
        price: record.price ?? null,
      });
      setEditingRowId(record.id);
      setIsModalOpen(true);
    },
    [form],
  );

  const handleDeleteRow = useCallback(
    async (record) => {
      const label = `Bed ${record.bedNumber} / Room ${record.roomNumber} (${record.wardName})`;
      const confirmed = await confirmDelete({ itemName: label });
      if (!confirmed) return;
      await deleteBedLocation(record.id).unwrap();
      message.success('Bed location deleted.');
    },
    [confirmDelete, deleteBedLocation, message],
  );

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const ward = wardBeds.find((w) => w.id === values.wardBedId);

      if (editingRowId) {
        await updateBedLocation({
          id: editingRowId,
          location: values.location.trim(),
          price: values.price,
        }).unwrap();
        message.success('Bed location updated.');
      } else {
        await createBedLocation({
          wardBedId: values.wardBedId,
          wardName: ward?.wardName ?? '',
          hospitalId: ward?.hospitalId ?? '',
          hospitalName: ward?.hospitalName ?? '',
          departmentId: ward?.departmentId ?? '',
          departmentName: ward?.departmentName ?? '',
          subDepartmentId: ward?.subDepartmentId ?? '',
          subDepartmentName: ward?.subDepartmentName ?? '',
          roomNumber: values.roomNumber,
          bedNumber: values.bedNumber,
          location: values.location.trim(),
          price: values.price,
        }).unwrap();
        message.success('Bed location assigned.');
      }

      closeModal();
    } catch {
      // validation errors are shown by antd Form
    }
  }, [form, editingRowId, wardBeds, createBedLocation, updateBedLocation, message, closeModal]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (fHospital && r.hospitalId !== fHospital) return false;
      if (fDepartment && r.departmentId !== fDepartment) return false;
      if (fSubDepartment && r.subDepartmentId !== fSubDepartment) return false;
      if (fWard && r.wardBedId !== fWard) return false;
      return true;
    });
  }, [rows, fHospital, fDepartment, fSubDepartment, fWard]);

  const columns = useMemo(
    () => [
      { title: 'Hospital', dataIndex: 'hospitalName', key: 'hospitalName', width: 170 },
      { title: 'Department', dataIndex: 'departmentName', key: 'departmentName', width: 140 },
      {
        title: 'Sub Department',
        dataIndex: 'subDepartmentName',
        key: 'subDepartmentName',
        width: 160,
      },
      { title: 'Ward Name', dataIndex: 'wardName', key: 'wardName', width: 140 },
      {
        title: 'Room No.',
        dataIndex: 'roomNumber',
        key: 'roomNumber',
        width: 90,
        align: 'center',
      },
      { title: 'Bed No.', dataIndex: 'bedNumber', key: 'bedNumber', width: 90, align: 'center' },
      { title: 'Location', dataIndex: 'location', key: 'location', width: 160 },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        width: 110,
        render: (val) => (val != null ? val.toLocaleString() : '—'),
      },
      {
        title: 'Action',
        key: 'action',
        width: 90,
        align: 'center',
        render: (_, record) => (
          <div
            className="assign-bed-location-actions-cell"
            style={{ display: 'flex', gap: 8, justifyContent: 'center' }}
          >
            <Tooltip title="Edit Location">
              <Button
                type="link"
                size="small"
                aria-label="Edit bed location"
                icon={<AppIcon icon="mdi:pencil-outline" className={ACTION_ICON_CLASS} />}
                onClick={() => handleEditRow(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                danger
                size="small"
                aria-label="Delete bed location"
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
    <div className="services-billing-page assign-bed-location-page">
      <div
        className="assign-bed-location-table-toolbar"
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}
      >
        <div className="assign-bed-location-filters" style={{ display: 'flex', gap: 12 }}>
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
              setFWard('');
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
              setFWard('');
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
            onChange={(val) => {
              setFSubDepartment(val ?? '');
              setFWard('');
            }}
          />
          <Select
            placeholder="Ward Name"
            value={fWard || undefined}
            options={filterWardOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: 220 }}
            onChange={(val) => setFWard(val ?? '')}
          />
        </div>
        <Button type="primary" onClick={openModal}>
          Assign Bed Location
        </Button>
      </div>

      <section className="services-billing-results" aria-label="assign bed locations">
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

      <AssignBedLocationModal
        open={isModalOpen}
        onClose={closeModal}
        title={editingRowId ? 'Edit Bed Location' : 'Assign Bed Location'}
        form={form}
        onSave={handleSave}
        wardOptions={usableWardOptions}
        roomOptions={roomOptions}
        bedOptions={bedOptions}
        isEditMode={!!editingRowId}
      />
    </div>
  );
}
