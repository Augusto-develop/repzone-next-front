"use client";

import { Zona } from "@/lib/model/types";
import { ColumnDef } from "@tanstack/react-table";
import ZonaAction from "./zona-action";

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

export const columns: ColumnDef<Zona>[] = [
  {
    id: "actions",
    accessorKey: "action",
    header: "",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="font-medium text-sm leading-4 whitespace-nowrap">
        <ZonaAction zona={row.original} row={row} />
      </div>
    ),
  },
  {
    accessorKey: "representante",
    header: "Representante",
    cell: ({ row }) => {
      const representante = row.getValue("representante") as { nome: string; };
      return (
        <div className="font-medium text-sm leading-4 whitespace-nowrap">
          {representante.nome}
        </div>
      );
    }
  },
  // {
  //   accessorKey: "cidade",
  //   header: "Cidade",
  //   cell: ({ row }) => {
  //     const cidade = row.getValue("cidade") as { nome: string; };
  //     return (
  //       <div className="font-medium text-sm leading-4 whitespace-nowrap">
  //         {cidade.nome}
  //       </div>
  //     );
  //   }
  // }
];
