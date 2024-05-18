import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormattedForCurrency } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import CountUp from "react-countup";

interface StatsCardsProps {
  from: Date;
  to: Date;
}

export default function StatsCards({ from, to }: StatsCardsProps) {
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  const formatter = useMemo(() => {
    return GetFormattedForCurrency("IDR");
  }, [GetFormattedForCurrency]);

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Pemasukkan"
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-green-500 bg-green-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Pengeluaran"
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-rose-500 bg-rose-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Saldo Akhir"
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-blue-500 bg-blue-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

function StatCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: React.ReactNode;
}) {
  const formatFn = useCallback(
    (value: number) => formatter.format(value),
    [formatter]
  );

  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          end={value}
          decimals={2}
          formattingFn={formatFn}
          redraw={false}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
