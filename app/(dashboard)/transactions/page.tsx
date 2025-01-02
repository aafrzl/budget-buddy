"use client";

import TableTransaction from "@/app/(dashboard)/transactions/_components/TableTransaction";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { startOfMonth } from "date-fns";
import { useState } from "react";

export default function TransactionPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <h2 className="text-3xl font-bold">History Transaksi</h2>
            <p className="text-sm text-muted-foreground">
              Lihat riwayat transaksi yang telah kamu lakukan
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Pilih periode untuk melihat riwayat transaksi
            </p>
            <DateRangePicker
              initialDateFrom={dateRange.from}
              initialDateTo={dateRange.to}
              showCompare={false}
              onUpdate={(values) => {
                const { from, to } = values.range;

                if (!from || !to) return;

                setDateRange({ from, to });
              }}
            />
          </div>
        </div>
      </div>
      <div className="container py-10">
        <TableTransaction
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>
    </>
  );
}
