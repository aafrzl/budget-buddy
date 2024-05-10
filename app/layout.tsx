import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BudgetBuddy | Personal Finance Management",
  description:
    "BudgetBuddy is a personal finance management tool that helps you track your expenses and income.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <RootProviders>{children}</RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
