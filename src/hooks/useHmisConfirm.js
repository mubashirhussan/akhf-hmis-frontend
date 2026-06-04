'use client';

import { App } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export function useHmisConfirm() {
  const { modal } = App.useApp();

  function confirmDelete({ itemName, message, okText = 'Yes, remove' } = {}) {
    const title =
      message ??
      (itemName ? (
        <span className="hmis-confirm-modal__message">
          Are you sure you want to remove{' '}
          <span className="hmis-confirm-modal__service-name">{itemName}</span>?
        </span>
      ) : (
        'Are you sure you want to remove this service?'
      ));

    return new Promise((resolve) => {
      modal.confirm({
        className: 'hmis-confirm-modal',
        centered: true,
        icon: (
          <div className="hmis-confirm-modal__icon-wrap" aria-hidden>
            <DeleteOutlined />
          </div>
        ),
        title,
        closable: true,
        closeIcon: true,
        maskClosable: false,
        width: 440,
        okText,
        cancelText: 'Cancel',
        okButtonProps: { danger: true, size: 'middle' },
        cancelButtonProps: { size: 'middle' },
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }

  return { confirmDelete };
}
