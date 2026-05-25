'use client';

import { DeleteOutlined, InfoCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Select, Table } from 'antd';
import { formatPkr } from '@/data/mock-walk-in-services';

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

  const columns = [
    {
      title: 'Sr. #',
      dataIndex: 'sr',
      key: 'sr',
      width: 56,
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
      width: isSidebar ? 160 : undefined,
      ellipsis: !isSidebar,
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
  ];

  const ADDED_SERVICES_TABLE_SCROLL_Y = 280;
  const SIDEBAR_ADDED_SERVICES_TABLE_SCROLL_Y = 200;

  const tableScroll = isSidebar
    ? { x: 640, y: SIDEBAR_ADDED_SERVICES_TABLE_SCROLL_Y }
    : { x: 900, y: ADDED_SERVICES_TABLE_SCROLL_Y };

  return (
    <div
      className={`walk-in-added-services ${isSidebar ? 'walk-in-added-services--sidebar' : 'walk-in-added-services--full'}`}
    >
      <h3 className="walk-in-added-services-title">Added Services</h3>

      <div className="walk-in-added-services-table-wrap">
      <Table
        className="walk-in-added-services-table"
        columns={columns}
        dataSource={services}
        rowKey="id"
        pagination={false}
        locale={{ emptyText: 'No services added yet' }}
        scroll={tableScroll}
        summary={() =>
          services.length > 0 ? (
            <Table.Summary fixed>
              <Table.Summary.Row className="walk-in-added-services-total-row">
                <Table.Summary.Cell index={0} colSpan={isSidebar ? 4 : 4}>
                  <strong>Grand Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} colSpan={isSidebar ? 3 : 4} align="end">
                  <strong className="walk-in-added-services-grand-total">
                    {formatPkr(grandTotal)}
                  </strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          ) : null
        }
      />
      </div>

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
