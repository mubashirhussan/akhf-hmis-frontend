'use client';

import { useState, useMemo } from 'react';
import { App, Button, Select, Table } from 'antd';
import AppModal from '@/components/ui/AppModal';
import AppIcon from '@/components/icons/AppIcon';
import { useConfirm } from '@/hooks/useConfirm';

export default function NewPackageLinkageModal({
  open,
  onClose,
  pkg,
  allServices = [],
  allServiceRows = [],
  onSave,
}) {
  const { message } = App.useApp();
  const { confirmDelete } = useConfirm();
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [selectedServiceToAdd, setSelectedServiceToAdd] = useState(null);

 const attachedServices = pkg?.services ?? [];
  const selectedCategory = pkg?.serviceCategory;

  const servicePriceMap = useMemo(() => {
    const map = {};
    allServiceRows.forEach((r) => { map[r.serviceName] = r.serviceCharges ?? 0; });
    return map;
  }, [allServiceRows]);

  const servicesTotal = useMemo(
    () => attachedServices.reduce((sum, svc) => sum + (servicePriceMap[svc] ?? 0), 0),
    [attachedServices, servicePriceMap],
  );

  const availableOptions = useMemo(() => {
    const attached = new Set(attachedServices);
    return (allServices || [])
      .filter((service) => {
        const serviceCategory = service?.serviceCategory;
        const categoryMatches = !selectedCategory || serviceCategory === selectedCategory;
        return categoryMatches && !attached.has(service?.value ?? service?.serviceName);
      })
      .map((service) => ({
        label: service?.label ?? service?.serviceName,
        value: service?.value ?? service?.serviceName,
      }));
  }, [allServices, attachedServices, selectedCategory]);

  const tableData = attachedServices.map((svc) => ({
    key: svc,
    serviceName: svc,
  }));

 const columns = [
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
    },
    {
      title: 'Price',
      dataIndex: 'serviceName',
      key: 'price',
      width: 120,
      align: 'right',
      render: (svcName) =>
        (servicePriceMap[svcName] ?? 0).toLocaleString(),
    },
    {
      title: 'Actions',
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<AppIcon icon="mdi:delete-outline" />}
          onClick={async () => {
            const confirmed = await confirmDelete({ itemName: record.serviceName });
            if (!confirmed) return;
            const updated = attachedServices.filter((s) => s !== record.serviceName);
            await onSave?.({ ...pkg, services: updated });
            message.success('Service removed.');
          }}
        />
      ),
    },
  ];

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={pkg?.packageName}
      width={700}
      centered={false}
      mask={{ closable: false }}
      style={{ top: 20 }}
      className="new-package-modal"
      rootClassName="new-package-modal-root"
      footer={
        <>
          <Button onClick={onClose}>Close</Button>
        </>
      }
    >
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" onClick={() => setAddPanelOpen(true)}>
          Add Service
        </Button>
      </div>

      {addPanelOpen && (
        <div
          style={{
            background: '#fafafa',
            border: '1px solid #e8e8e8',
            borderRadius: 6,
            padding: '12px 16px',
            marginBottom: 12,
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <Select
            style={{ flex: 1 }}
            placeholder="Select a service to add"
            value={selectedServiceToAdd}
            options={availableOptions}
            onChange={(v) => setSelectedServiceToAdd(v)}
            showSearch
            optionFilterProp="label"
            allowClear
          />
          <Button
            type="primary"
            disabled={!selectedServiceToAdd}
            onClick={async () => {
              if (!selectedServiceToAdd || !pkg) return;
              if (attachedServices.includes(selectedServiceToAdd)) {
                message.warning('This service is already added.');
                return;
              }
              const updated = [...attachedServices, selectedServiceToAdd];
              await onSave?.({ ...pkg, services: updated });
              setSelectedServiceToAdd(null);
              setAddPanelOpen(false);
              message.success('Service added.');
            }}
          >
            Add
          </Button>
          <Button
            onClick={() => {
              setAddPanelOpen(false);
              setSelectedServiceToAdd(null);
            }}
          >
            Cancel
          </Button>
        </div>
      )}

 <Table
        rowKey="key"
        columns={columns}
        dataSource={tableData}
        pagination={false}
        className="new-package-linkage-table"
        bordered={false}
        locale={{ emptyText: 'No services attached to this package.' }}
      />

      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <span style={{ fontWeight: 500 }}>Total Amount:</span>
          <span>{servicesTotal.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <span style={{ fontWeight: 500 }}>Package Amount:</span>
          <span>{(pkg?.totalAmount ?? 0).toLocaleString()}</span>
        </div>
      </div>
    </AppModal>
  );
}