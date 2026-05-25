'use client';

import { useMemo } from 'react';
import { DeleteOutlined, InfoCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import HmisTable from '@/components/ui/HmisTable';
import { formatPkr } from '@/data/mock-walk-in-services';

const ADDED_SERVICES_SCROLL_Y = {
  sidebar: 188,
  full: 280,
};

export default function AddedServicesPanel({
  variant = 'full',
  services,
  doctors,
  onQuantityChange,
  onDoctorChange,
  onRemove,
  onCancel,
  onSave,
}) {
  const isSidebar = variant === 'sidebar';

  const grandTotal = services.reduce(
    (sum, row) => sum + row.price * row.quantity - row.discount,
    0,
  );

  const columns = useMemo(
    () => [
      {
        title: 'Sr. #',
        dataIndex: 'sr',
        key: 'sr',
        width: 56,
        fixed: 'left',
        render: (_, __, index) => index + 1,
      },
      {
        title: 'Date & Time',
        dataIndex: 'addedAt',
        key: 'addedAt',
        width: 150,
      },
      {
        title: 'Services',
        dataIndex: 'name',
        key: 'name',
        width: isSidebar ? 180 : 220,
      },
      {
        title: 'Quantity',
        key: 'quantity',
        width: 120,
        render: (_, record) => (
          <div className="walk-in-qty-control">
            <button
              type="button"
              className="walk-in-qty-btn"
              onClick={() => onQuantityChange(record.id, record.quantity - 1)}
              disabled={record.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <MinusOutlined />
            </button>
            <span className="walk-in-qty-value">{record.quantity}</span>
            <button
              type="button"
              className="walk-in-qty-btn"
              onClick={() => onQuantityChange(record.id, record.quantity + 1)}
              aria-label="Increase quantity"
            >
              <PlusOutlined />
            </button>
          </div>
        ),
      },
      {
        title: 'Price',
        key: 'price',
        width: 100,
        render: (_, record) => formatPkr(record.price),
      },
      {
        title: 'Discount',
        key: 'discount',
        width: 100,
        render: (_, record) => formatPkr(record.discount),
      },
      ...(isSidebar
        ? []
        : [
            {
              title: 'Doctor',
              key: 'doctor',
              width: 140,
              render: (_, record) => (
                <Select
                  className="w-full"
                  value={record.doctorId}
                  options={doctors.map((d) => ({ value: d.id, label: d.name }))}
                  onChange={(value) => onDoctorChange(record.id, value)}
                />
              ),
            },
          ]),
      {
        title: 'Action',
        key: 'action',
        width: 72,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <button
            type="button"
            className="walk-in-service-delete-btn"
            onClick={() => onRemove(record.id)}
            aria-label="Remove service"
          >
            <DeleteOutlined />
          </button>
        ),
      },
    ],
    [isSidebar, doctors, onQuantityChange, onDoctorChange, onRemove],
  );

  const tableScroll = useMemo(
    () => ({ y: isSidebar ? ADDED_SERVICES_SCROLL_Y.sidebar : ADDED_SERVICES_SCROLL_Y.full }),
    [isSidebar],
  );

  return (
    <div
      className={`walk-in-added-services ${isSidebar ? 'walk-in-added-services--sidebar' : 'walk-in-added-services--full'}`}
    >
      <h3 className="walk-in-added-services-title">Added Services</h3>

      <HmisTable
        className="walk-in-added-services-table"
        wrapClassName="walk-in-added-services-table-wrap"
        columns={columns}
        dataSource={services}
        rowKey="id"
        pagination={false}
        locale={{ emptyText: 'No services added yet' }}
        scroll={tableScroll}
      />

      {services.length > 0 && (
        <div className="walk-in-added-services-total-bar">
          <strong className="walk-in-added-services-total-label">Grand Total</strong>
          <strong className="walk-in-added-services-grand-total">{formatPkr(grandTotal)}</strong>
        </div>
      )}

      <div className="walk-in-added-services-note">
        <InfoCircleOutlined className="walk-in-added-services-note-icon" />
        <span>
          Note : You can increase or decrease the quantity using the +/- buttons.
        </span>
      </div>

      <div className="walk-in-added-services-actions">
        <Button className="walk-in-btn-cancel" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="primary" className="walk-in-btn-save" onClick={onSave} disabled={!services.length}>
          Save Record
        </Button>
      </div>
    </div>
  );
}
