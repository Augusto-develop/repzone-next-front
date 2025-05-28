'use client';

import { Representante, PayloadFilterRepresentante } from "@/lib/model/types";
import React, { ReactNode, createContext, useContext, useState } from 'react';

interface RepresentanteContextType {
  filter: PayloadFilterRepresentante;
  setFilter: React.Dispatch<React.SetStateAction<PayloadFilterRepresentante>>;
  representantes: Representante[];
  setRepresentantes: React.Dispatch<React.SetStateAction<Representante[]>>;
  deleteRepresentante: (id: string) => void;
  editRepresentante: (id: string, updatedData: Partial<Representante>) => void;
  isLoading: boolean;                 // NOVO
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const RepresentanteContext = createContext<RepresentanteContextType | undefined>(undefined);

export const useRepresentanteContext = () => {
  const context = useContext(RepresentanteContext);
  if (!context) {
    throw new Error('useRepresentanteContext must be used within a RepresentanteProvider');
  }
  return context;
};

interface RepresentanteProviderProps {
  children: ReactNode;
}

export const RepresentanteProvider = ({ children }: RepresentanteProviderProps) => {
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [filter, setFilter] = useState<PayloadFilterRepresentante>({    
    nome: "",       
    isSubmit: false
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Delete a representante by its ID
  const deleteRepresentante = (id: string) => {
    setRepresentantes((prevRepresentantes) => prevRepresentantes.filter((Representante) => Representante.id !== id));
  };

  const editRepresentante = (id: string, updatedData: Partial<Representante>) => {
    setRepresentantes((prevRepresentantes) =>
      prevRepresentantes.map((representante) =>
        representante.id === id ? { ...representante, ...updatedData } : representante
      )
    );
  };

  return (
    <RepresentanteContext.Provider value={{
      representantes,
      setRepresentantes,
      deleteRepresentante,
      editRepresentante,
      filter,
      setFilter,
      isLoading,
      setIsLoading
    }}>
      {children}
    </RepresentanteContext.Provider>
  );
};
