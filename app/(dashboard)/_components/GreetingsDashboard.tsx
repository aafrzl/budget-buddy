import React from "react";
import CreateTransactionDialog from "./CreateTransactionDialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface Props {
  firstName: string;
}

export default function GreetingsDashboard({ firstName }: Props) {
  return (
    <div className="border-b">
      <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
        <p className="text-3xl font-bold">Hello, {firstName}!👋🏼</p>

        <div className="flex flex-col md:flex-row gap-3 w-full">
          <CreateTransactionDialog
            type="income"
            trigger={
              <Button
              >
                <Plus className="shrink-0 mr-2 h-4 w-4" />
                Tambah Pemasukan 🤑
              </Button>
            }
          />
          <CreateTransactionDialog
            type="expense"
            trigger={
              <Button variant={"destructive"}>
                <Minus className="shrink-0 mr-2 h-4 w-4" />
                Pengeluaran 😤
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
