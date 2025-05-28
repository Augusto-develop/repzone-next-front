"use client";
// React
import React, { useEffect, useRef, useState } from "react";

// Componentes UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

// Tipos e constantes
import {
  Cliente,
  Representante
} from "@/lib/model/types";

import { Row } from "@tanstack/react-table";
import 'react-toastify/dist/ReactToastify.css';
import { toast as toastify } from 'react-toastify';
import { getRepresentantesByCliente } from "@/action/zona-actions";

interface EditTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row: Row<Cliente>;
  dataCliente?: Cliente | undefined;
}

const ClienteRepresentante = ({ open, setOpen, row, dataCliente = undefined }: EditTaskProps) => {

  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const clienteId = dataCliente?.id || row.original.id;

  const modalRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (openState: boolean) => {
    setOpen(openState);

    // Se fechou, deseleciona a linha
    if (!openState) {
      row.toggleSelected(false);
    }
  };

  useEffect(() => {
    if (open && clienteId) {
      const fetchRepresentantes = async () => {
        try {
          setLoading(true);
          const listRepresentantes = await getRepresentantesByCliente(clienteId);

          setRepresentantes(listRepresentantes);
        } catch (error) {
          toastify('Erro inesperado ao buscar representantes.', {
            type: 'error',
            autoClose: false,
            hideProgressBar: true,
            position: 'bottom-center',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored"
          });
        } finally {
          setLoading(false);
        }
      };

      fetchRepresentantes();
    }
  }, [open, clienteId]);




  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent ref={modalRef} className="md:max-w-[480px] w-[90%]">
        <DialogHeader>
          <DialogTitle>Representantes Disponíveis</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p className="text-center py-4">Carregando representantes...</p>
        ) : representantes.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {representantes.map((rep) => (
              <li key={rep.id} className="py-2">
                <div className="font-medium">{rep.nome}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-4">Nenhum representante encontrado.</p>
        )}
      </DialogContent>
    </Dialog >
  );
};

export default ClienteRepresentante;
