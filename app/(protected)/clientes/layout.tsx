import { Metadata } from "next";
import React from "react";
import { ToastContainer } from 'react-toastify';
import { ClienteProvider } from './components/cliente-context'; // Import the context provider

export const metadata: Metadata = {
  title: 'Consulta Clientes',
  description: 'Filtro de Clientes'
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClienteProvider>
      <ToastContainer aria-label={undefined} />
      {children}
    </ClienteProvider>
  );
};

export default Layout;