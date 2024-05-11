import { SignUp } from "@clerk/nextjs";

export default async function Page() {
  return <SignUp path="/sign-up" />;
}
