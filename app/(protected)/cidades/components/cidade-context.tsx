'use client';

import { Cidade, PayloadFilterCidade } from "@/lib/model/types";
import React, { ReactNode, createContext, useContext, useState } from 'react';

interface CidadeContextType {
  filter: PayloadFilterCidade;
  setFilter: React.Dispatch<React.SetStateAction<PayloadFilterCidade>>;
  cidades: Cidade[];
  setCidades: React.Dispatch<React.SetStateAction<Cidade[]>>;
  deleteCidade: (id: string) => void;
  editCidade: (id: string, updatedData: Partial<Cidade>) => void;
  isLoading: boolean;                 // NOVO
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CidadeContext = createContext<CidadeContextType | undefined>(undefined);

export const useCidadeContext = () => {
  const context = useContext(CidadeContext);
  if (!context) {
    throw new Error('useCidadeContext must be used within a CidadeProvider');
  }
  return context;
};

interface CidadeProviderProps {
  children: ReactNode;
}

export const CidadeProvider = ({ children }: CidadeProviderProps) => {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [filter, setFilter] = useState<PayloadFilterCidade>({
    estado: "",
    nome: "",
    isSubmit: false
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Delete a cidade by its ID
  const deleteCidade = (id: string) => {
    setCidades((prevCidades) => prevCidades.filter((Cidade) => Cidade.id !== id));
  };

  const editCidade = (id: string, updatedData: Partial<Cidade>) => {
    setCidades((prevCidades) =>
      prevCidades.map((cidade) =>
        cidade.id === id ? { ...cidade, ...updatedData } : cidade
      )
    );
  };

  return (
    <CidadeContext.Provider value={{
      cidades,
      setCidades,
      deleteCidade,
      editCidade,
      filter,
      setFilter,
      isLoading,
      setIsLoading
    }}>
      {children}
    </CidadeContext.Provider>
  );
};
