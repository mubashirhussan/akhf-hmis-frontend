'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import AntdConfigProvider from '@/components/providers/AntdConfigProvider';

/** Injects Ant Design SSR styles to prevent FOUC on first paint. */
export default function AppProviders({ children }) {
  return (
    <AntdRegistry>
      <AntdConfigProvider>{children}</AntdConfigProvider>
    </AntdRegistry>
  );
}
