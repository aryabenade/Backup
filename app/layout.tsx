//Layout component in app/layout.tsx
'use client';
import {
  ClerkProvider,
} from '@clerk/nextjs'
import React, { ReactNode } from 'react';
import './styles/globals.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default Layout;

