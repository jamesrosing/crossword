import React from 'react';
import { Metadata } from 'next';
import { Providers } from './providers';
import ClientOnly from '@/components/ClientOnly';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';

export const metadata: Metadata = {
  title: "Grid Wit",
  description: "A crossword puzzle game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientOnly>
            {children}
            <Toaster />
          </ClientOnly>
        </Providers>
      </body>
    </html>
  )
}