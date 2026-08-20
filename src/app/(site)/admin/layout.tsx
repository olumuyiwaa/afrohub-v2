// admin/layout.tsx
"use client";
import './admin.css';
import { Outfit } from 'next/font/google';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/app/context/SidebarContext';
import { ThemeProvider } from '@/app/context/ThemeContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
      <ThemeProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </ThemeProvider>
      </body>
      </html>
  );
}