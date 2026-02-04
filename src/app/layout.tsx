import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/RouteGuard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { Providers } from '@/components/Providers';
import { ToastProvider } from '@/components/ui/toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HFP - Household Financial Platform",
  description: "Comprehensive household financial management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <Providers>
            <AuthProvider>
              <RouteGuard>
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
              </RouteGuard>
            </AuthProvider>
          </Providers>
          <ToastProvider />
        </ErrorBoundary>
      </body>
    </html>
  );
}
