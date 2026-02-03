'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const publicRoutes = ['/login', '/register'];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        // Redirect to login if not authenticated and trying to access protected route
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (isAuthenticated && isPublicRoute) {
        // Redirect to dashboard if authenticated and trying to access login/register
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
