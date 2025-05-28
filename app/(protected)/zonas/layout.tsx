import { Metadata } from "next";
import React from "react";
import { ToastContainer } from 'react-toastify';
import { ZonaProvider } from './components/zona-context'; // Import the context provider

export const metadata: Metadata = {
  title: 'Consulta Zonas',
  description: 'Filtro de Zonas'
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ZonaProvider>
      <ToastContainer aria-label={undefined} />
      {children}
    </ZonaProvider>
  );
};

export default Layout;