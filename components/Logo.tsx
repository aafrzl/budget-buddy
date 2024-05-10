import { PiggyBank } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link
      href={"/"}
      className="flex items-center gap-2"
    >
      <PiggyBank className="h-11 w-11 stroke stroke-green-500 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-green-400 to-green-800 bg-clip-text leading-tight text-3xl font-bold text-transparent tracking-tighter">
        BudgetBuddy
      </p>
    </Link>
  );
}
