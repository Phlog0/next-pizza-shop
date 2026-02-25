import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // For example, fetch data from your DB here
  const users = await prisma.user.findMany();
  // const users = [
  //   { id: 1, name: "Alice" },
  //   { id: 2, name: "Boba" },
  // ];
  return new NextResponse(JSON.stringify(users), {
    status: 200,
    statusText: "Success",
    headers: {
      "Content-type": "application/json",
    },
  });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const newUser = await prisma.user.create({ data: data });
  return NextResponse.json(newUser);
}
