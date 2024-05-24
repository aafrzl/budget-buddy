"use client";

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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteTransaction } from "../_actions/deleteTransaction";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId: string;
}

export default function DeleteTransactionDialog({
  open,
  setOpen,
  transactionId,
}: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteTransaction,
    onSuccess: async () => {
      toast.success("Transaksi berhasil dihapus", {
        id: transactionId,
      });

      await queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: transactionId,
      });
    },
  });

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin ingin menghapus data transaksi ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Data yang sudah dihapus tidak bisa dikembalikan. Pastikan data yang
            akan dihapus benar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Menghapus data transaksi...", {
                id: transactionId,
              });

              deleteMutation.mutate(transactionId);
            }}
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
