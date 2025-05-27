'use client'
import { deleteCidade as executeDeleteCidade } from '@/action/cidade-actions';
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Cidade } from "@/lib/model/types";
import { pwButtonIconTable } from '@/lib/pw-components-styles';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Row } from "@tanstack/react-table";
import { SquarePen, Trash2 } from "lucide-react";
import React, { useState } from 'react';
import { toast as toastify } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCidadeContext } from './cidade-context';
import EditCidade from './cidade-edit';


// Add id as a prop to the component
interface CidadeActionProps {
    cidade: Cidade;
    row: Row<Cidade>;
}

const CidadeAction: React.FC<CidadeActionProps> = ({ cidade, row }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { deleteCidade } = useCidadeContext();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);


    // Handle delete button click
    const handleDeleteClick = (id: string) => {
        setSelectedRowId(id);
        row.toggleSelected(true);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedRowId) {
            try {
                const res = await executeDeleteCidade(selectedRowId);
                if (res.ok) {
                    deleteCidade(selectedRowId);
                    toastify('Cidade excluída com sucesso!', {
                        type: 'success',
                        autoClose: 3000,
                        hideProgressBar: true,
                        position: 'bottom-center',
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored"
                    });
                } else {
                    const data = await res.json();

                    toastify(data?.message || 'Erro ao excluir cidade.', {
                        type: 'error',
                        autoClose: false,
                        hideProgressBar: true,
                        position: 'bottom-center',
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored"
                    });
                }
            } catch (error) {
                toastify('Erro inesperado ao excluir cidade.' || 'Erro ao excluir cidade.', {
                    type: 'error',
                    autoClose: false,
                    hideProgressBar: true,
                    position: 'bottom-center',
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored"
                });
                console.error(error);
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
            <EditCidade
                open={open}
                setOpen={setOpen}
                row={row}
                dataCidade={cidade}
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
                    onClick={() => handleDeleteClick(cidade.id)}
                >
                    <Trash2 className="w-3 h-3" />
                    Excluir
                </Button>
            </div>
        </>
    )
}

export default CidadeAction