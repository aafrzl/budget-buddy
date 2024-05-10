import Navbar from "@/components/Navbar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex flex-col h-screen w-full">
      <Navbar />
      <div className="w-full">{children}</div>
    </main>
  );
}
