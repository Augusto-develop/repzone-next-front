'use client'
import { deleteZona as executeDeleteZona } from '@/action/zona-actions';
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Zona } from "@/lib/model/types";
import { pwButtonIconTable } from '@/lib/pw-components-styles';
import { Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import React, { useState } from 'react';
import { toast as toastify } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useZonaContext } from './zona-context';

// Add id as a prop to the component
interface ZonaActionProps {
    zona: Zona;
    row: Row<Zona>;
}

const ZonaAction: React.FC<ZonaActionProps> = ({ zona, row }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { deleteZona } = useZonaContext(); // Access context
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
                const res = await executeDeleteZona(selectedRowId);
                if (res.ok) {
                    deleteZona(selectedRowId);
                    toastify('Zona de Atuação excluída com sucesso!', {
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

                    toastify(data?.message || 'Erro ao excluir zona de atuação.', {
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
                toastify('Erro inesperado ao excluir zona de atuação.', {
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
        }

        row.toggleSelected(false);
        setOpenDeleteDialog(false);
    };

    // Cancel deletion
    const handleDeleteCancel = () => {
        row.toggleSelected(false);
        setOpenDeleteDialog(false);
    };    

    return (
        <>            
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm} // Close dialog without deletion             
            />
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    className={pwButtonIconTable}
                    color="destructive"
                    onClick={() => handleDeleteClick(`${zona.representante.id}:${zona.cidade.id}`)}
                >
                    <Trash2 className="w-3 h-3" />
                    Excluir
                </Button>
            </div>
        </>
    )
}

export default ZonaAction