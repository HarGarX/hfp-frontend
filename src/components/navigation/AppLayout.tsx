'use client';

import React, { useState } from 'react';
import { Sidebar, TopBar, Breadcrumbs } from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top Bar */}
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;