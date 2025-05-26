"use client";
// React
import React, { useRef, useState } from "react";

// Next
import { useTheme } from "next-themes";

// Bibliotecas externas
import dayjs, { Dayjs } from "@/lib/dayjs";

// MUI

// Actions

// Componentes UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

// Componentes locais
import { useClienteContext } from "./cliente-context";

// Hooks
import {
  useCustomMuiDatepickerTheme,
  useCustomSelectStyles
} from "@/hooks/use-custom-input-styles";

// Tipos e constantes
import {
  Cliente
} from "@/lib/model/types";

import { useToast } from "@/components/ui/use-toast";
import { Row } from "@tanstack/react-table";
import 'react-toastify/dist/ReactToastify.css';
import FormCliente from "./cliente-form-create";

interface EditTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row: Row<Cliente>;
  dataCliente?: Cliente | undefined;
}

const EditCliente = ({ open, setOpen, row, dataCliente = undefined }: EditTaskProps) => {

  const { clientes, setClientes, editCliente, filter } = useClienteContext();

  const { theme } = useTheme();
  const customStyles = useCustomSelectStyles(theme ?? "light");
  const themeCustomMuiDatepicker = useCustomMuiDatepickerTheme(theme === "dark" ? "dark" : "light");
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs().local());
  const { toast } = useToast()

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
          <DialogTitle>Edita Cliente</DialogTitle>
        </DialogHeader>
        <FormCliente dataCliente={dataCliente} setOpen={setOpen} row={row} />
      </DialogContent>
    </Dialog >
  );
};

export default EditCliente;
