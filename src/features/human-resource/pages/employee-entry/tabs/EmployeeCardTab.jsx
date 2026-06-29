'use client';

import { useState } from 'react';
import { Button, Modal, Result } from 'antd';
import { CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';

export default function EmployeeCardTab({ employeeName }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleGenerate = () => setConfirmOpen(true);

  const handleConfirm = () => {
    setConfirmOpen(false);
    setSuccessOpen(true);
  };

  return (
    <div className="employee-card-tab">
      <div className="employee-card-generate-area">
        <CreditCardOutlined className="employee-card-icon" />
        <p className="employee-card-hint">
          Click the button below to generate an employee card.
        </p>
        <Button
          type="primary"
          icon={<CreditCardOutlined />}
          onClick={handleGenerate}
          className="employee-card-generate-btn"
        >
          Generate Card
        </Button>
      </div>

      <Modal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onOk={handleConfirm}
        okText="Yes, Generate"
        cancelText="Cancel"
        title="Generate Employee Card"
        centered
      >
        <p className="employee-card-confirm-text">
          Do you want to generate a card for{' '}
          <strong>{employeeName || 'this employee'}</strong>?
        </p>
      </Modal>

      <Modal
        open={successOpen}
        onCancel={() => setSuccessOpen(false)}
        footer={
          <Button type="primary" onClick={() => setSuccessOpen(false)}>
            Done
          </Button>
        }
        centered
        closable={false}
      >
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="Card Generated Successfully"
          subTitle={`The employee card for ${employeeName || 'this employee'} has been generated and started downloading on your device.`}
        />
      </Modal>
    </div>
  );
}