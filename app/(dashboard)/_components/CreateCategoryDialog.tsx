import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { cn } from "@/lib/utils";
import { categorySchema, CreateCategorySchemaType } from "@/schema/categories";
import { TransactionType } from "@/types/transaction";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CircleOff, Loader, PlusCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateCategory } from "../_actions/categories";
import { toast } from "sonner";
import { Category } from "@prisma/client";

interface Props {
  type: TransactionType;
  successCallback: (category: Category) => void;
  trigger?: React.ReactNode;
}

export default function CreateCategoryDialog({
  type,
  successCallback,
  trigger,
}: Props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });

      toast.success(`Kategori ${data.name} berhasil dibuat 🎉`, {
        id: "create-category",
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setOpen(false);
    },
    onError: () => {
      toast.error("Gagal membuat kategori", {
        id: "create-category",
      });
    },
  });

  const onSubmit = useCallback(
    (data: CreateCategorySchemaType) => {
      toast.loading("Sedang membuat kategori...", {
        id: "create-category",
      });
      mutate(data);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant={"ghost"}
            className="rounded-none"
          >
            <PlusCircle className="shrink-0 mr-2 h-4 w-4" />
            Tambah Kategori
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Buat Kategori
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-primary" : "text-destructive"
              )}
            >
              {type === "income" ? "Pemasukan" : "Pengeluaran"}
            </span>
            Baru
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Isikan detail untuk membuat kategori baru.
        </DialogDescription>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kategori</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={""}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Isikan nama kategori (max 20 karakter)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-[100px] w-full"
                        >
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl">{field.value}</span>
                              <p className="text-xs text-foreground">
                                Klik untuk mengganti icon
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="shrink-0 h-[48px] w-[48px] mx-auto" />
                              <p className="text-xs text-foreground">
                                Klik untuk memilih icon untuk kategori
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                          }}
                          theme={theme.resolvedTheme}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>Pilih icon untuk kategori</FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-4">
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
