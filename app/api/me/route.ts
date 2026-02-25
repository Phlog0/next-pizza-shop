// import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/shared/constants/next-auth-options";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/shared/constants/next-auth-options";
// import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // const user = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userData = await prisma.user.findUnique({
      // !!!
      where: { id: Number(session.user.id) },
      select: { fullName: true, email: true, password: false },
    });
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Server error [API_ME]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
