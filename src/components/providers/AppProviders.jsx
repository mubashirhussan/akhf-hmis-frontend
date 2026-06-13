'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import AntdConfigProvider from '@/components/providers/AntdConfigProvider';
import StoreProvider from '@/store/provider';

/** Injects Ant Design SSR styles to prevent FOUC on first paint. */
export default function AppProviders({ children }) {
  return (
    <StoreProvider>
      <AntdRegistry>
        <AntdConfigProvider>{children}</AntdConfigProvider>
      </AntdRegistry>
    </StoreProvider>
  );
}
