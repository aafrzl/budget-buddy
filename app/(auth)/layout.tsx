import Logo from "@/components/Logo";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user) {
    return redirect('/')
  }

  return (
    <div className="w-full lg:grid lg:grid-cols-2 h-screen">
      <div className="flex flex-col gap-2 items-center justify-center py-12">
        <Logo />
        <div className="mx-auto grid w-[350px] gap-6">{children}</div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://images.pexels.com/photos/4386421/pexels-photo-4386421.jpeg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
