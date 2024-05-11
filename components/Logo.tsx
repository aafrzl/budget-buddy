import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href={"/"}
      className="flex items-center gap-2"
    >
      <p className="bg-gradient-to-b from-green-400 to-green-950 bg-clip-text leading-tight text-3xl font-bold text-transparent tracking-tighter">
        BudgetBuddy
      </p>
    </Link>
  );
}
