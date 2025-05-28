"use client";

import { Representante } from "@/lib/model/types";
import { ColumnDef } from "@tanstack/react-table";
import RepresentanteAction from "./representante-action";

export const getColumnAlignment = (columnId: string) => {
  switch (columnId) {
    case "actions":
    case "nome":
    case "cidade":
      return "text-left";
    case "estado":
      return "text-center";
    default:
      return "";
  }
};

export const columns: ColumnDef<Representante>[] = [
  {
    id: "actions",
    accessorKey: "action",
    header: "",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="font-medium text-sm leading-4 whitespace-nowrap">
        <RepresentanteAction representante={row.original} row={row} />
      </div>
    ),
  },
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => (
      <div className="font-medium text-sm leading-4 whitespace-nowrap">
        {row.getValue("nome")}
      </div>
    ),
  }
];
