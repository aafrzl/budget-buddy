"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  CreateTransactionSchemaType,
  transactionSchema,
} from "@/schema/transaction";
import { TransactionType } from "@/types/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import CategoryPicker from "./CategoryPicker";

interface Props {
  trigger: React.ReactNode;
  type: TransactionType;
}

export default function CreateTransactionDialog({ type, trigger }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Buat transaksi
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-primary" : "text-destructive"
              )}
            >
              {type === "income" ? "Pemasukan" : "Pengeluaran"}
            </span>
            baru
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Isikan deskripsi transaksi (opsional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Jumlah {type === "income" ? "pemasukan" : "pengeluaran"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      defaultValue={0}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Tentukan jumlah transaksi</FormDescription>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Kategori</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>Tentukan jumlah transaksi</FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
