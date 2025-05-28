import { Metadata } from "next";
import React from "react";
import { ToastContainer } from 'react-toastify';
import { RepresentanteProvider } from './components/representante-context'; // Import the context provider

export const metadata: Metadata = {
  title: 'Consulta Representantes',
  description: 'Filtro de Representantes'
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RepresentanteProvider>
      <ToastContainer aria-label={undefined} />
      {children}
    </RepresentanteProvider>
  );
};

export default Layout;