'use client';

import { Suspense, useState } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import AntdAppHost from '@/components/providers/AntdAppHost';

export default function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <AppSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <AntdAppHost className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<div className="min-h-[76px] shrink-0 border-b border-slate-200/80 bg-[var(--app-header-bg)]" />}>
          <AppHeader />
        </Suspense>
        <main className="app-scrollbar flex-1 overflow-y-auto p-4">{children}</main>
      </AntdAppHost>
    </div>
  );
}
