'use client';

import { Cliente, InputsFilterCliente, PayloadFilterCliente } from "@/lib/model/types";
import React, { ReactNode, createContext, useContext, useState } from 'react';

interface ClienteContextType {
  filter: PayloadFilterCliente;
  setFilter: React.Dispatch<React.SetStateAction<PayloadFilterCliente>>;
  clientes: Cliente[];
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>; 
  deleteCliente: (id: string) => void;
  editCliente: (id: string, updatedData: Partial<Cliente>) => void;
}

const ClienteContext = createContext<ClienteContextType | undefined>(undefined);

export const useClienteContext = () => {
  const context = useContext(ClienteContext);
  if (!context) {
    throw new Error('useClienteContext must be used within a ClienteProvider');
  }
  return context;
};

interface ClienteProviderProps {
  children: ReactNode;
}

export const ClienteProvider = ({ children }: ClienteProviderProps) => {
  const [clientes, setClientes] = useState<Cliente[]>([]); 
  const [filter, setFilter] = useState<PayloadFilterCliente>({
    cpf: "",
    nome: "",
    datanasc: "",
    sexo: "",   
    estado: "",
    cidade: "",
    isSubmit: false
  });  

  // Delete a cliente by its ID
  const deleteCliente = (id: string) => {
    setClientes((prevClientes) => prevClientes.filter((Cliente) => Cliente.id !== id));
  };

  const editCliente = (id: string, updatedData: Partial<Cliente>) => {
    setClientes((prevClientes) =>
      prevClientes.map((cliente) =>
        cliente.id === id ? { ...cliente, ...updatedData } : cliente
      )
    );
  };

  return (
    <ClienteContext.Provider value={{
      clientes,
      setClientes,
      deleteCliente,
      editCliente,
      filter,
      setFilter   
    }}>
      {children}
    </ClienteContext.Provider>
  );
};
