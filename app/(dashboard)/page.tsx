import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GreetingsDashboard from "./_components/GreetingsDashboard";
import Overview from "./_components/Overview";
import History from "./_components/History";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="h-full bg-background">
      <GreetingsDashboard firstName={user.firstName || "Unknown"} />
      <Overview />
      <History />
    </div>
  );
}
