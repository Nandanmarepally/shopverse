import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import StoreProvider from '@/store/StoreProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'ShopVerse - Premium Multi-Vendor Marketplace',
    template: '%s | ShopVerse',
  },
  description: 'Shop viral gadgets, gym fitness products, and smart home essentials from trusted vendors.',
  keywords: ['ecommerce', 'multi-vendor', 'gadgets', 'fitness', 'smart home'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            </AuthProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
