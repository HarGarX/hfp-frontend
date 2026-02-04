'use client';

import { usePathname } from 'next/navigation';
import { AppLayout } from './navigation';

const publicRoutes = ['/login', '/register'];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  // Don't wrap public routes with AppLayout
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Wrap protected routes with dashboard layout
  return <AppLayout>{children}</AppLayout>;
}
