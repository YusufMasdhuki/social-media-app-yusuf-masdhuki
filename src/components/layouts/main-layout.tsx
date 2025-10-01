'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React from 'react';

import BottomNavbar from './bottom-navbar';
import Navbar from './navbar';

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const MainLayout: React.FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const hideHeader = pathname === '/login' || pathname === '/register';

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {!hideHeader && <Navbar />}
        {children}
        {!hideHeader && <BottomNavbar />}
      </QueryClientProvider>
    </>
  );
};

export default MainLayout;
