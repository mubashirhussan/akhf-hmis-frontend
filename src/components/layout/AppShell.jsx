'use client';

import { useState } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import AntdConfigProvider from '@/components/providers/AntdConfigProvider';

export default function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AntdConfigProvider>
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <AppSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="hmis-scrollbar flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
    </AntdConfigProvider>
  );
}
