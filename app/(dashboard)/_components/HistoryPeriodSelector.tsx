import { getHistoryPeriodsResponseType } from "@/app/api/history-period/route";
import { Period, Timeframe } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkeletonWrapper from "@/components/SkeletonWrapper";

interface HistoryPeriodSelectorProps {
  period: Period;
  timeframe: Timeframe;
  setPeriod: (period: Period) => void;
  setTimeframe: (timeframe: Timeframe) => void;
}

export default function HistoryPeriodSelector({
  period,
  timeframe,
  setPeriod,
  setTimeframe,
}: HistoryPeriodSelectorProps) {
  const historyPeriods = useQuery<getHistoryPeriodsResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: () => fetch(`/api/history-period`).then((res) => res.json()),
  });

  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper
        isLoading={historyPeriods.isLoading}
        fullWidth={false}
      >
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as Timeframe)}
        >
          <TabsList>
            <TabsTrigger value="year">Tahunan</TabsTrigger>
            <TabsTrigger value="month">Bulanan</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper
          isLoading={historyPeriods.isLoading}
          fullWidth={false}
        >
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods.data || []}
          />
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper
            isLoading={historyPeriods.isLoading}
            fullWidth={false}
          >
            <MonthSelector
              period={period}
              setPeriod={setPeriod}
            />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}

function YearSelector({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: getHistoryPeriodsResponseType;
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) =>
        setPeriod({ month: period.month, year: parseInt(value) })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem
            key={year}
            value={year.toString()}
          >
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MonthSelector({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) =>
        setPeriod({ year: period.year, month: parseInt(value) })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
          const monthStr = new Date(period.year, month, 1).toLocaleString(
            "default",
            {
              month: "long",
            }
          );

          return (
            <SelectItem
              key={month}
              value={month.toString()}
            >
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
