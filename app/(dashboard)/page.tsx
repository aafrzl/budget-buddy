import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import GreetingsDashboard from "./_components/GreetingsDashboard";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="h-full bg-background">
      <GreetingsDashboard firstName={user.firstName || "Unknown"} />
    </div>
  );
}
