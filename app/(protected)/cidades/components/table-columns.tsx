"use client";

import { Cidade } from "@/lib/model/types";
import { ColumnDef } from "@tanstack/react-table";
import CidadeAction from "./cidade-action";

export const getColumnAlignment = (columnId: string) => {
  switch (columnId) {
    case "actions":
    case "nome":   
      return "text-left";   
    case "estado":   
      return "text-center";
    default:
      return "";
  }
};

export const columns: ColumnDef<Cidade>[] = [
  {
    id: "actions",
    accessorKey: "action",
    header: "",
    enableHiding: false,   
    cell: ({ row }) => (
      <div className="font-medium text-sm leading-4 whitespace-nowrap">
        <CidadeAction cidade={row.original} row={row} />
      </div>
    ),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => (
      <div className="font-medium text-sm leading-4 whitespace-nowrap">
        {row.getValue("estado")}
      </div>
    ),
  },
  {
    accessorKey: "nome",
    header: "Nome da Cidade",
    cell: ({ row }) => (
      <div className="font-medium text-sm leading-4 whitespace-nowrap">
        {row.getValue("nome")}
      </div>
    ),
  },  
];
