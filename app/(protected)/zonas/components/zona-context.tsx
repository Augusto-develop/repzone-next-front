'use client';

import { Zona, PayloadFilterZona } from "@/lib/model/types";
import React, { ReactNode, createContext, useContext, useState } from 'react';

interface ZonaContextType {
  filter: PayloadFilterZona;
  setFilter: React.Dispatch<React.SetStateAction<PayloadFilterZona>>;
  zonas: Zona[];
  setZonas: React.Dispatch<React.SetStateAction<Zona[]>>;
  deleteZona: (id: string) => void; 
  isLoading: boolean;                 // NOVO
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ZonaContext = createContext<ZonaContextType | undefined>(undefined);

export const useZonaContext = () => {
  const context = useContext(ZonaContext);
  if (!context) {
    throw new Error('useZonaContext must be used within a ZonaProvider');
  }
  return context;
};

interface ZonaProviderProps {
  children: ReactNode;
}

export const ZonaProvider = ({ children }: ZonaProviderProps) => {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [filter, setFilter] = useState<PayloadFilterZona>({  
    estado: "",
    cidade: "",
    isSubmit: false
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Delete a zona by its ID
  const deleteZona = (id: string) => {
    setZonas((prevZonas) => prevZonas.filter((Zona) => `${Zona.representante.id}:${Zona.cidade.id}` !== id));
  };  

  return (
    <ZonaContext.Provider value={{
      zonas,
      setZonas,
      deleteZona,      
      filter,
      setFilter,
      isLoading,
      setIsLoading
    }}>
      {children}
    </ZonaContext.Provider>
  );
};
