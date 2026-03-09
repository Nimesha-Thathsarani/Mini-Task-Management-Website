import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mini Task Management',
  description: 'Manage your tasks securely and efficiently.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 min-h-screen transition-colors duration-300`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
