"use client";

import { getTransactionHistoryType } from "@/app/api/transactions-history/route";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { cn } from "@/lib/utils";
import RowAction from "./RowAction";

export type TransactionHistoryRow = getTransactionHistoryType[0];

export const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Kategori"
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className="flex gap-2 capitalize">
        {row.original.categoryIcon}
        <div>{row.original.category}</div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Deskripsi"
      />
    ),
    cell: ({ row }) => <div>{row.original.description}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Tanggal"
      />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const formattedDate = date.toLocaleDateString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Tipe Transaksi"
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div
        className={cn(
          "capitalize rounded-lg text-center p-2",
          row.original.type === "expense" && "bg-red-400/10 text-red-500",
          row.original.type === "income" && "bg-green-400/10 text-green-500"
        )}
      >
        {row.original.type === "expense" ? "pengeluaran" : "pemasukan"}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Jumlah Transaksi"
      />
    ),
    cell: ({ row }) => (
      <p className="text-sm rounded-lg bg-gray-400/5 p-2 text-center font-medium">
        {row.original.amount}
      </p>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <RowAction transaction={row.original} />,
  },
];
