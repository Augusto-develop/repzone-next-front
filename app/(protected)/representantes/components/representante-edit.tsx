"use client";
// React
import React, { useRef, useState } from "react";

// Componentes UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

// Tipos e constantes
import {
  Representante
} from "@/lib/model/types";

import { Row } from "@tanstack/react-table";
import 'react-toastify/dist/ReactToastify.css';
import FormRepresentante from "./representante-form-create";

interface EditTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row: Row<Representante>;
  dataRepresentante?: Representante | undefined;
}

const EditRepresentante = ({ open, setOpen, row, dataRepresentante = undefined }: EditTaskProps) => { 

  const modalRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (openState: boolean) => {
    setOpen(openState);

    // Se fechou, deseleciona a linha
    if (!openState) {
      row.toggleSelected(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent ref={modalRef} className="md:max-w-[480px] w-[90%]">
        <DialogHeader>
          <DialogTitle>Edita Representante</DialogTitle>
        </DialogHeader>
        <FormRepresentante dataRepresentante={dataRepresentante} setOpen={setOpen} row={row} />
      </DialogContent>
    </Dialog >
  );
};

export default EditRepresentante;
