"use client"

import { useEffect, useState } from "react";

import {
    ColumnFiltersState,
    PaginationState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useRepresentanteContext } from "./components/representante-context";
import { columns, getColumnAlignment } from "./components/table-columns";
import TablePagination from "./components/table-pagination";

import { useResponsivePageSize } from "@/hooks/use-responsive-pagination";

import RepresentanteWrapper from "./components/representante-wrapper";


const ListTable = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const { representantes, isLoading } = useRepresentanteContext();

    const pageSize = useResponsivePageSize();

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize,
    });

    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            pageSize,
        }));
    }, [pageSize]);

    useEffect(() => {
        setPagination(prev => ({
            ...prev,
            pageIndex: 0  // vai para a página 1
        }));
    }, [representantes]);

    const table = useReactTable({
        data: representantes,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination
        },
        getRowId: row => row.id,
    });

    return (
        <RepresentanteWrapper>
            <Card className="mt-2">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="px-3 bg-default-100">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className={getColumnAlignment(header.column.id)}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-500" />
                                            Carregando...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={getColumnAlignment(cell.column.id)}
                                                style={{
                                                    width: cell.column.id === 'actions' ? 250 : 'auto',
                                                    maxWidth: cell.column.id === 'actions' ? 250 : 'auto',
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Nenhum resultado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination table={table} />
                </CardContent>
            </Card>
        </RepresentanteWrapper>
    );
};

export default ListTable;
