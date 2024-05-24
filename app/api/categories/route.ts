import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url);
    const paramType = searchParams.get("type");

    const validator = z.enum(["income", "expense"]);
    const queryParams = validator.safeParse(paramType);

    if (!queryParams.success) {
      return Response.json(queryParams.error, { status: 400 });
    }

    const type = queryParams.data;
    const categories = await prisma.category.findMany({
      where: {
        userId: user.id,
        ...(type && { type }),
      },
      orderBy: {
        name: "asc",
      },
    });

    return Response.json(categories);
  } catch (error) {
    console.error(error);
    return Response.json("Error occured while fetching categories", {
      status: 500,
    });
  }
}
