'use client';

import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import AppIcon from '@/components/icons/AppIcon';

export default function AppModal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  width = 720,
  className = '',
  bodyClassName = '',
  footerClassName = '',
  centered = true,
  destroyOnHidden = true,
  showCloseButton = true,
  ...modalProps
}) {
  const titleContent =
    typeof title === 'string' ? <h2 className="app-modal-title">{title}</h2> : title;

  return (
    <Modal
      className={['app-modal', className].filter(Boolean).join(' ')}
      rootClassName="app-modal-root"
      open={open}
      onCancel={onClose}
      footer={null}
      width={width}
      centered={centered}
      destroyOnHidden={destroyOnHidden}
      closable={false}
      classNames={{
        container: 'app-modal-container',
        header: 'app-modal-header-shell',
      }}
      styles={{
        container: { padding: 0 },
        header: { padding: 0, margin: 0, background: 'transparent', borderBottom: 'none' },
        body: { padding: 0 },
      }}
      title={
        <div className="app-modal-header">
          <div className="app-modal-header-main">
            {icon ? (
              <span className="app-modal-icon-wrap" aria-hidden>
                <AppIcon icon={icon} className="app-modal-icon" />
              </span>
            ) : null}
            <div>
              {titleContent}
              {subtitle ? <p className="app-modal-subtitle">{subtitle}</p> : null}
            </div>
          </div>
          {showCloseButton ? (
            <button
              type="button"
              className="app-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <CloseOutlined />
            </button>
          ) : null}
        </div>
      }
      {...modalProps}
    >
      <div className={['app-modal-body', bodyClassName].filter(Boolean).join(' ')}>{children}</div>
      {footer ? (
        <div className={['app-modal-footer', footerClassName].filter(Boolean).join(' ')}>{footer}</div>
      ) : null}
    </Modal>
  );
}
