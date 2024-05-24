"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetFormattedForCurrency } from "@/lib/helpers";
import { Period, Timeframe } from "@/types/types";
import React, { useCallback, useMemo, useState } from "react";
import HistoryPeriodSelector from "./HistoryPeriodSelector";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";

export default function History() {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const historyData = useQuery({
    queryKey: ["overview", timeframe, period],
    queryFn: () =>
      fetch(
        `/api/history-data?timeframe=${timeframe}&month=${period.month}&year=${period.year}`
      ).then((res) => res.json()),
  });

  const dataAvailable = historyData.data && historyData.data.length > 0;

  const formatter = useMemo(() => {
    return GetFormattedForCurrency("IDR");
  }, [GetFormattedForCurrency]);

  return (
    <div className="container">
      <h2 className="mt-12 text-3xl font-bold">Riwayat</h2>
      <Card className="col-span-12 mt-2 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />
            <div className="flex h-10 gap-2">
              <Badge
                variant={"outline"}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-green-500" />
                <span>Pemasukkan</span>
              </Badge>
              <Badge
                variant={"outline"}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-rose-500" />
                <span>Pengeluaran</span>
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={historyData.isLoading}>
            {dataAvailable && (
              <ResponsiveContainer
                width={"100%"}
                height={400}
              >
                <BarChart
                  data={historyData.data}
                  height={300}
                  barCategoryGap={5}
                >
                  <defs>
                    <linearGradient
                      id="incomeBar"
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={1}
                    >
                      <stop
                        offset={"0"}
                        stopColor="#10B981"
                        stopOpacity={1}
                      />
                      <stop
                        offset={"1"}
                        stopColor="#10B981"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="expenseBar"
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={1}
                    >
                      <stop
                        offset={"0"}
                        stopColor="#ef4444"
                        stopOpacity={1}
                      />
                      <stop
                        offset={"1"}
                        stopColor="#ef4444"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray={"5 5"}
                    strokeOpacity={"0.2"}
                    vertical={false}
                  />
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      if (timeframe === "year") {
                        return date.toLocaleDateString("default", {
                          month: "short",
                        });
                      }
                      return date.toLocaleDateString("default", {
                        day: "2-digit",
                      });
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey={"income"}
                    label={"Pemasukkan"}
                    fill="url(#incomeBar)"
                    radius={[5, 5, 0, 0]}
                    className="cursor-pointer"
                  />
                  <Bar
                    dataKey={"expense"}
                    label={"Pengeluaran"}
                    fill="url(#expenseBar)"
                    radius={[5, 5, 0, 0]}
                    className="cursor-pointer"
                  />
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={(props) => (
                      <CustomTooltip
                        formatter={formatter}
                        {...props}
                      />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
            {!dataAvailable && (
              <Card className="flex h-[300px] flex-col items-center justify-center">
                Tidak ada data untuk periode ini
                <p className="text-sm text-muted-foreground">
                  Coba untuk pilih periode lain atau tambahkan transaksi baru
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

function CustomTooltip({ active, payload, formatter }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { expense, income } = data;

  return (
    <div className="min-w-[300px] rounded-xl border bg-background p-4">
      <h4 className="text-lg font-bold">Rincian</h4>
      <TooltipRow
        formatter={formatter}
        label="Pemasukkan"
        value={income}
        bgColor="bg-green-500"
        textColor="text-green-500"
      />
      <TooltipRow
        formatter={formatter}
        label="Pengeluaran"
        value={expense}
        bgColor="bg-red-500"
        textColor="text-red-500"
      />
      <TooltipRow
        formatter={formatter}
        label="Balance"
        value={income - expense}
        bgColor="bg-gray-500"
        textColor="text-foreground"
      />
    </div>
  );
}

function TooltipRow({
  label,
  value,
  bgColor,
  textColor,
  formatter,
}: {
  label: string;
  value: number;
  textColor: string;
  bgColor: string;
  formatter: Intl.NumberFormat;
}) {
  const formatterFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-4 h-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp
            end={value}
            formattingFn={formatterFn}
            duration={0.5}
            decimals={0}
            className="text-sm"
            preserveValue
          />
        </div>
      </div>
    </div>
  );
}
