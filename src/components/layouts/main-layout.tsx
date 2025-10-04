'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from '@/store'; // 👉 pastikan path benar

import BottomNavbar from './bottom-navbar';
import Navbar from './navbar';
import { Toaster } from '../ui/sonner';

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const MainLayout: React.FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const hideHeader = pathname === '/login' || pathname === '/register';

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          {!hideHeader && <Navbar />}
          {children}
          {!hideHeader && <BottomNavbar />}
          <Toaster position='top-right' richColors />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default MainLayout;
