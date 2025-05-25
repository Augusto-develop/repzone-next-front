"use client";

import { Cliente } from "@/lib/model/types";
import { ColumnDef } from "@tanstack/react-table";
import ClienteAction from "./cliente-action";

export const getColumnAlignment = (columnId: string) => {
  switch (columnId) {
    case "actions":
    case "nome":
    case "cidade":
      return "text-left";
    case "cpf":
    case "datanasc":
    case "estado":
    case "center":
      return "text-center";
    default:
      return "";
  }
};

export const columns: ColumnDef<Cliente>[] = [
  {
    id: "actions",
    accessorKey: "action",
    header: "",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="font-medium text-sm leading-4 whitespace-nowrap">
        <ClienteAction cliente={row.original} row={row} />
      </div>
    ),
  },
  {
    accessorKey: "nome",
    header: "Cliente",
    cell: ({ row }) => (
      <div className="font-medium text-sm leading-4 whitespace-nowrap">
        {row.getValue("nome")}
      </div>
    ),
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    cell: ({ row }) => (
      <div className="font-medium text-sm leading-4 whitespace-nowrap">
        {row.getValue("cpf")}
      </div>
    ),
  },
  {
    accessorKey: "datanasc",
    header: "Data Nasc",
    cell: ({ row }) => (
      <div className="font-medium text-sm leading-4 whitespace-nowrap">
        {row.getValue("datanasc")}
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
    accessorKey: "cidade",
    header: "Cidade",
    cell: ({ row }) => (
      <div className="font-medium text-sm leading-4 whitespace-nowrap">
        {row.getValue("cidade")}
      </div>
    ),
  },
  {
    accessorKey: "sexo",
    header: "Sexo",
    cell: ({ row }) => (
      <div className="font-medium text-sm leading-4 whitespace-nowrap">
        {row.getValue("sexo")}
      </div>
    ),
  },
];
