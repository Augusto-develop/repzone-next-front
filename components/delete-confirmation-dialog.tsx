import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const DeleteConfirmationDialog = ({
  open, onClose, onConfirm, defaultToast = true, toastMessage = "Excluído com Sucesso",
  title = "Excluir ?",
  description = "Esta ação não pode ser desfeita."
}: {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void>;
  defaultToast?: boolean;
  toastMessage?: string;
  title?: string;
  description?: string;
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await onConfirm();
      if (defaultToast) {
        toast.success(toastMessage, { position: "top-right" });
      }
    } catch (error) {
      toast.error("Erro ao excluir.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={loading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className={`bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 ${loading ? "pointer-events-none opacity-70" : ""}`}
            onClick={handleConfirm}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
