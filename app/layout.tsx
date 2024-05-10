import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProvider";
import { Toaster } from "@/components/ui/sonner";

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
          <Toaster
            toastOptions={{
              duration: 3000,
            }}
          />
          <RootProviders>{children}</RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
