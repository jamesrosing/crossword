import React from 'react';
import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from './providers';
import ClientOnly from '@/components/ClientOnly';

export const metadata: Metadata = {
  title: "Grid Wit",
  description: "Unlock your mind, one word at a time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <ClientOnly>
              <React.Suspense fallback={<div>Loading...</div>}>
                {children}
              </React.Suspense>
            </ClientOnly>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}