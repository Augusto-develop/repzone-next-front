import { Metadata } from "next";
import React from "react";
import { ToastContainer } from 'react-toastify';
import { CidadeProvider } from './components/cidade-context'; // Import the context provider

export const metadata: Metadata = {
  title: 'Consulta Cidades',
  description: 'Filtro de Cidades'
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CidadeProvider>
      <ToastContainer aria-label={undefined} />
      {children}
    </CidadeProvider>
  );
};

export default Layout;