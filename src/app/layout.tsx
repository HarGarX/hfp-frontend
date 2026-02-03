import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppLayout } from '@/components/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/RouteGuard';

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
        <AuthProvider>
          <RouteGuard>
            <AppLayout>
              {children}
            </AppLayout>
          </RouteGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
