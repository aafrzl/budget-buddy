"use client";

import { getTransactionHistoryType } from "@/app/api/transactions-history/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { columns } from "@/components/tables/columns";
import { DataTable } from "@/components/tables/DataTable";
import { DateToUTCDate } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface Props {
  from: Date;
  to: Date;
}

export default function TableTransaction({ from, to }: Props) {
  const history = useQuery<getTransactionHistoryType>({
    queryKey: ["transactions", "history", from, to],
    queryFn: () =>
      fetch(
        `/api/transactions-history?from=${DateToUTCDate(
          from
        )}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  return (
    <div className="w-full">
      <SkeletonWrapper isLoading={history.isLoading}>
        <DataTable
          data={history.data || []}
          columns={columns}
        />
      </SkeletonWrapper>
    </div>
  );
}
