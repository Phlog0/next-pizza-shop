import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "code is required" }, { status: 400 });
    }

    const findVerificationCode = await prisma.verificationCode.findFirst({
      where: {
        code,
      },
    });
    if (!findVerificationCode) {
      return NextResponse.json({ error: "Неверный код" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: findVerificationCode.userId },
      data: {
        verified: new Date(),
      },
    });

    await prisma.verificationCode.delete({
      where: {
        id: findVerificationCode.id,
      },
    });
    return NextResponse.redirect(new URL("/?verified", req.url));
    // return NextResponse.json(findVerificationCode);
  } catch (error) {
    console.error("Server Error [VERIFY_GET]", error);
  }
}
