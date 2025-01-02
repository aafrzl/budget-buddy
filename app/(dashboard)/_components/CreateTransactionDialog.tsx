"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateToUTCDate } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import {
  CreateTransactionSchemaType,
  transactionSchema,
} from "@/schema/transaction";
import { TransactionType } from "@/types/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateTransaction } from "../_actions/transactions";
import CategoryPicker from "./CategoryPicker";

interface Props {
  trigger: React.ReactNode;
  type: TransactionType;
}

export default function CreateTransactionDialog({ type, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);

  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success("Transaksi berhasil dibuat 🎉", {
        id: "create-transaction",
      });

      form.reset({
        type,
        description: "",
        amount: 0,
        date: new Date(),
        category: undefined,
      });

      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });

      setOpen((prev) => !prev);
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "create-transaction",
      });

      form.reset({
        type,
        description: "",
        amount: 0,
        date: new Date(),
        category: undefined,
      });

      setOpen((prev) => !prev);
    },
  });

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  const onSubmit = useCallback(
    (data: CreateTransactionSchemaType) => {
      toast.loading("Sedang membuat transaksi...", {
        id: "create-transaction",
      });

      mutate({
        ...data,
        date: DateToUTCDate(data.date),
      });
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center w-11/12 sm:max-w-md">
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
        <div className="w-11/12 sm:max-w-md">
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
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
              <div className="flex flex-col md:flex-row justify-between gap-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Kategori</FormLabel>
                      <FormControl>
                        <CategoryPicker
                          type={type}
                          onChange={handleCategoryChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Tentukan jumlah transaksi
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Tanggal Transaksi</FormLabel>
                      <FormControl>
                        <Popover
                          open={openCalendar}
                          modal={false}
                        >
                          <PopoverTrigger
                            asChild
                            onClick={() => setOpenCalendar(!openCalendar)}
                          >
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(field.value, "dd MMMM yyyy")
                                : "Pilih tanggal"}
                              <CalendarIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            side="bottom"
                            className="w-auto p-0"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormDescription>
                        Pilih tanggal transaksinya
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="w-full"
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
            className="w-full"
          >
            {isPending && (
              <Loader className="shrink-0 h-4 w-4 mr-2 animate-spin" />
            )}
            {isPending ? "Membuat..." : "Buat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
