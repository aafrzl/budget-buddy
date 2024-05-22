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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TransactionType } from "@/types/transaction";
import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { DeleteCategory } from "../_actions/categories";

interface Props {
  trigger: React.ReactNode;
  category: Category;
}

export default function DeleteCategoryDialog({ trigger, category }: Props) {
  const categoryIndetifier = `${category.name} (${category.type})`;
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      toast.success("Kategori berhasil dihapus", {
        id: categoryIndetifier,
      });

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: () => {
      toast.error("Gagal menghapus kategori", {
        id: categoryIndetifier,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin ingin menghapus data kategori {category.name}?
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
              toast.loading("Menghapus kategori...", {
                id: categoryIndetifier,
              });

              deleteMutation.mutate({
                name: category.name,
                type: category.type as TransactionType,
              });
            }}
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
