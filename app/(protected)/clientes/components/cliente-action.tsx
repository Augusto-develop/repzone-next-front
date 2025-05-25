'use client'
import { deleteCliente as executeDeleteCliente } from '@/action/cliente-actions';
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Cliente } from "@/lib/model/types";
import { pwButtonIconTable } from '@/lib/pw-components-styles';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Row } from "@tanstack/react-table";
import { SquarePen, Trash2 } from "lucide-react";
import React, { useState } from 'react';
import { useClienteContext } from './cliente-context';
import EditCliente from './cliente-edit';


// Add id as a prop to the component
interface ClienteActionProps {
    cliente: Cliente;
    row: Row<Cliente>;
}

const ClienteAction: React.FC<ClienteActionProps> = ({ cliente, row }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { clientes, setCliente, deleteCliente } = useClienteContext(); // Access context
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for dialog visibility
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null); // Store selected card ID for deletion


    // Handle delete button click
    const handleDeleteClick = (id: string) => {
        setSelectedRowId(id);
        row.toggleSelected(true); 
        setOpenDeleteDialog(true);
    };

    // Confirm deletion and delete the selected card
    const handleDeleteConfirm = async () => {
        if (selectedRowId) {
            const res = await executeDeleteCliente(selectedRowId);
            if (res.ok) {
                deleteCliente(selectedRowId);
            }
        }
        row.toggleSelected(false);
        setOpenDeleteDialog(false);
    };

    // Cancel deletion
    const handleDeleteCancel = () => {
        row.toggleSelected(false);
        setOpenDeleteDialog(false);
    };

    const handleClickEditar = () => {
        row.toggleSelected(true);     
        setOpen(true);
    };

    return (
        <>
            <EditCliente
                open={open}
                setOpen={setOpen}
                row={row}
                dataCliente={cliente}               
            />
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm} // Close dialog without deletion             
            />
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    className={pwButtonIconTable}
                    color="primary"
                    onClick={() => handleClickEditar()}
                >
                    <SquarePen className="w-3 h-3" />
                    Editar
                </Button>
                <Button
                    variant="outline"
                    className={pwButtonIconTable}
                    color="destructive"
                    onClick={() => handleDeleteClick(cliente.id)}
                >
                    <Trash2 className="w-3 h-3" />
                    Excluir
                </Button>
            </div>
        </>
    )
}

export default ClienteAction