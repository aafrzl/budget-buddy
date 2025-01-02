"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { startOfMonth } from "date-fns";
import { useState } from "react";
import CategoriesStats from "./CategoriesStats";
import StatsCards from "./StatsCards";

export default function Overview() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Pilih periode untuk melihat statistik keuangan
            </p>
            <DateRangePicker
              initialDateFrom={dateRange.from}
              initialDateTo={dateRange.to}
              showCompare={false}
              align="start"
              onUpdate={(values) => {
                const { from, to } = values.range;

                if (!from || !to) return;

                setDateRange({ from, to });
              }}
            />
          </div>
        </div>
      </div>
      <div className="container flex w-full flex-col gap-2">
        <StatsCards
          from={dateRange.from}
          to={dateRange.to}
        />

        <CategoriesStats
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>
    </>
  );
}
