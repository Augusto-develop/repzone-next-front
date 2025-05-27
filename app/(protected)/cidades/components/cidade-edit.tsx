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
import { useCidadeContext } from "./cidade-context";

// Hooks
import {
  useCustomMuiDatepickerTheme,
  useCustomSelectStyles
} from "@/hooks/use-custom-input-styles";

// Tipos e constantes
import {
  Cidade
} from "@/lib/model/types";

import { useToast } from "@/components/ui/use-toast";
import { Row } from "@tanstack/react-table";
import 'react-toastify/dist/ReactToastify.css';
import FormCidade from "./cidade-form-create";

interface EditTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row: Row<Cidade>;
  dataCidade?: Cidade | undefined;
}

const EditCidade = ({ open, setOpen, row, dataCidade = undefined }: EditTaskProps) => {

  const { cidades, setCidades, editCidade, filter } = useCidadeContext();

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
      <DialogContent ref={modalRef} className="md:max-w-[450px] w-[90%]">
        <DialogHeader>
          <DialogTitle>Edita Cidade</DialogTitle>
        </DialogHeader>
        <FormCidade dataCidade={dataCidade} setOpen={setOpen} row={row} />
      </DialogContent>
    </Dialog >
  );
};

export default EditCidade;
