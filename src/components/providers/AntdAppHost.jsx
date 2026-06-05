'use client';

import { App } from 'antd';

/**
 * Ant Design App context for message/modal/notification — only wraps main content,
 * not the sidebar, so layout and nav styles stay isolated.
 */
export default function AntdAppHost({ children, className = '' }) {
  return <App className={['app-host', className].filter(Boolean).join(' ')}>{children}</App>;
}
