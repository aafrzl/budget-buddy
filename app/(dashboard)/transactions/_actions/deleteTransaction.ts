"use server"

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function DeleteTransaction(id: string) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const transaction = await prisma.transaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!transaction) {
    throw new Error("Transaksi tidak ditemukan");
  }

  await prisma.$transaction([
    //Delete data from table transaction
    prisma.transaction.delete({
      where: {
        id,
        userId: user.id,
      },
    }),

    //Delete data from table YearHistory
    prisma.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
      },
    }),

    //Delete data from table MonthHistory
    prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
}
